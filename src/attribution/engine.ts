/**
 * Everworld 6: Formal Attribution & Counterfactual Inference Engine (Doc 17)
 * Strictly decoupled from constitutive mechanics (Physics, Biology, Combat, etc.).
 */

import {
  AgencyAttributionReport,
  AgencyRoleType,
  AttributionProvenanceKey,
  CoalitionShapleyReport,
  ConservedFluxVector,
  DeterminationCommitPacket,
  EntityUuid,
  FrameworkVerdict,
  MarginalNecessityVector,
  OccurrenceId,
  OmissionEvaluationReport,
  OmissionEvidenceBundle,
  StateReference,
  SupportLeaf,
} from "../types/causal";
import { extractSupportLeaves } from "../core/invariants";

export interface ICausalLedgerQueryService {
  getDetermination(determinationId: string): DeterminationCommitPacket | undefined;
  getDeterminationForOccurrence(occurrenceId: OccurrenceId): DeterminationCommitPacket | undefined;
  getProducingDeterminationForState(stateRefDigest: string): DeterminationCommitPacket | undefined;
  getState(stateRefDigest: string): StateReference | undefined;
}

export interface IAgencyMappingService {
  getAgencyRolesForAction(determinationId: string): ReadonlyMap<AgencyRoleType, EntityUuid>;
  getGoalForActor(actorUuid: EntityUuid, determinationId: string): string | undefined;
}

export interface INormativeDutyFramework {
  readonly frameworkId: string;
  evaluateDuty(
    agentUuid: EntityUuid,
    targetOccurrenceId: OccurrenceId,
    timestamp: bigint
  ): { isBound: boolean; contractId?: string };
  evaluateEpistemicAwareness(
    agentUuid: EntityUuid,
    targetOccurrenceId: OccurrenceId
  ): { hadAwareness: boolean; wasSelfImpaired: boolean };
  evaluatePhysicalCapability(
    agentUuid: EntityUuid,
    requiredActionType: string,
    timestamp: bigint
  ): { wasCapable: boolean; impedimentDescription?: string };
  evaluateVerdict(evidence: OmissionEvidenceBundle): FrameworkVerdict;
}

export interface ICounterfactualEvaluationModel {
  readonly modelId: string;
  readonly interventionType: "SUPPRESS_ACTION" | "ZERO_INPUT" | "REVERT_STATE";
  evaluateOutcomeWithIntervention(
    suppressedEntities: ReadonlySet<EntityUuid>,
    targetOccurrenceId: OccurrenceId
  ): boolean; // returns true if outcome STILL occurs, false if PREVENTED
  evaluateCharacteristicFunction?(
    coalition: ReadonlySet<EntityUuid>,
    targetOccurrenceId: OccurrenceId
  ): number; // characteristic value v(S)
}

export class AttributionEngine {
  constructor(
    private readonly ledger: ICausalLedgerQueryService,
    private readonly agencyService: IAgencyMappingService
  ) {}

  /**
   * 1. Direct Actual Producer & Lineage Query
   */
  public getImmediateProducer(occurrenceId: OccurrenceId): {
    determinationId: string;
    domainEngineId: string;
    timestamp: bigint;
    activeContributors: ReadonlyArray<SupportLeaf>;
    preconditionEnablers: ReadonlyArray<SupportLeaf>;
  } {
    const packet = this.ledger.getDeterminationForOccurrence(occurrenceId);
    if (!packet) {
      throw new Error(`Occurrence ${occurrenceId} not found in Causal Ledger.`);
    }

    const leaves = extractSupportLeaves(packet.supportStructure);
    const activeContributors = leaves.filter((l) => l.role === "ACTIVE_CONTRIBUTOR");
    const preconditionEnablers = leaves.filter((l) => l.role === "PRECONDITION_ENABLER");

    return {
      determinationId: packet.determinationId,
      domainEngineId: packet.domainEngineId,
      timestamp: packet.timestamp,
      activeContributors,
      preconditionEnablers,
    };
  }

  /**
   * 2. Conserved Physical Flux Vector Extraction
   */
  public extractConservedFluxVector(
    occurrenceId: OccurrenceId,
    targetDimension: string
  ): ConservedFluxVector {
    const producer = this.getImmediateProducer(occurrenceId);
    const contributions = new Map<string, number>();
    let totalMagnitude = 0;
    let unit = "UNKNOWN";

    for (const leaf of producer.activeContributors) {
      if (leaf.quantitativeMeasurement && leaf.quantitativeMeasurement.dimension === targetDimension) {
        unit = leaf.quantitativeMeasurement.unit;
        const mag = leaf.quantitativeMeasurement.magnitude;
        totalMagnitude += mag;

        const key: AttributionProvenanceKey = {
          entityUuid: leaf.stateRef.entityUuid,
          originatingPath: leaf.stateRef.path,
          stateVersion: leaf.stateRef.version.toString(),
        };
        const keyStr = JSON.stringify(key);
        contributions.set(keyStr, (contributions.get(keyStr) ?? 0) + mag);
      }
    }

    return {
      dimension: targetDimension,
      unit,
      totalMagnitude,
      contributions,
    };
  }

  /**
   * 3. Model-Relative Counterfactual Marginal Necessity Vector
   */
  public computeMarginalNecessity(
    occurrenceId: OccurrenceId,
    candidateEntities: ReadonlyArray<EntityUuid>,
    model: ICounterfactualEvaluationModel
  ): MarginalNecessityVector {
    const necessity = new Map<string, boolean>();

    for (const entity of candidateEntities) {
      // Suppress single entity
      const outcomePersists = model.evaluateOutcomeWithIntervention(
        new Set([entity]),
        occurrenceId
      );
      // If outcome does NOT persist when suppressed, entity is necessary
      const isNecessary = !outcomePersists;
      const keyStr = JSON.stringify({ entityUuid: entity });
      necessity.set(keyStr, isNecessary);
    }

    return {
      modelId: model.modelId,
      interventionType: model.interventionType,
      necessity,
    };
  }

  /**
   * 4. Model-Relative Coalition Game / Shapley Value Attribution
   */
  public computeCoalitionShapley(
    occurrenceId: OccurrenceId,
    players: ReadonlyArray<EntityUuid>,
    model: ICounterfactualEvaluationModel
  ): CoalitionShapleyReport {
    if (!model.evaluateCharacteristicFunction) {
      throw new Error(`Model ${model.modelId} does not provide a characteristic function v(S).`);
    }

    const n = players.length;
    const shapleyValues = new Map<string, number>();

    // Compute exact permutations
    const permutations = this.getPermutations([...players]);
    const totalPermutations = permutations.length;

    for (const player of players) {
      let marginalSum = 0;

      for (const p of permutations) {
        const idx = p.indexOf(player);
        const predecessorSet = new Set(p.slice(0, idx));
        const withPlayerSet = new Set([...predecessorSet, player]);

        const vBefore = model.evaluateCharacteristicFunction(predecessorSet, occurrenceId);
        const vAfter = model.evaluateCharacteristicFunction(withPlayerSet, occurrenceId);
        marginalSum += vAfter - vBefore;
      }

      const val = totalPermutations > 0 ? marginalSum / totalPermutations : 0;
      const keyStr = JSON.stringify({ entityUuid: player });
      shapleyValues.set(keyStr, val);
    }

    return {
      characteristicFunctionId: model.modelId,
      outcomeMetricDescription: `Cooperative Shapley over ${model.modelId}`,
      shapleyValues,
    };
  }

  private getPermutations<T>(arr: T[]): T[][] {
    if (arr.length <= 1) return [arr];
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const perms = this.getPermutations(remaining);
      for (const p of perms) {
        result.push([current, ...p]);
      }
    }
    return result;
  }

  /**
   * 5. Agency & Somatic Goal Alignment Report
   */
  public evaluateAgencyAttribution(
    occurrenceId: OccurrenceId,
    initiatingDeterminationId: string
  ): AgencyAttributionReport {
    const roles = this.agencyService.getAgencyRolesForAction(initiatingDeterminationId);
    const controller = roles.get("DIRECT_CONTROLLER") ?? roles.get("SOMATIC_EXECUTOR") ?? "UNKNOWN";
    const goal = this.agencyService.getGoalForActor(controller, initiatingDeterminationId);

    const isAligned = goal !== undefined && goal.toLowerCase().includes("kill");
    return {
      targetOccurrence: occurrenceId,
      initiatingDetermination: initiatingDeterminationId,
      agencyRoleMap: roles,
      goalAlignment: {
        declaredGoal: goal,
        isOutcomeAligned: isAligned,
        mismatchReason: isAligned ? undefined : "ACCIDENT",
      },
    };
  }

  /**
   * 6. Omission Evaluation via 4-Tuple Objective Evidence Pipeline
   */
  public evaluateOmission(
    candidateAgent: EntityUuid,
    targetOccurrenceId: OccurrenceId,
    framework: INormativeDutyFramework,
    counterfactualModel: ICounterfactualEvaluationModel
  ): OmissionEvaluationReport {
    const packet = this.ledger.getDeterminationForOccurrence(targetOccurrenceId);
    const timestamp = packet ? packet.timestamp : 0n;

    // 1. Duty Binding
    const duty = framework.evaluateDuty(candidateAgent, targetOccurrenceId, timestamp);

    // 2. Epistemic Awareness
    const epistemic = framework.evaluateEpistemicAwareness(candidateAgent, targetOccurrenceId);

    // 3. Physical Opportunity / Capability
    const capability = framework.evaluatePhysicalCapability(
      candidateAgent,
      "INTERVENE",
      timestamp
    );

    // 4. Counterfactual Prevention Efficacy
    // When candidate agent executes intervention Do(A acts), does outcome persist?
    const persistsUnderIntervention = counterfactualModel.evaluateOutcomeWithIntervention(
      new Set([]), // Base without suppression
      targetOccurrenceId
    );
    // Efficacy model tests whether DO(A acts) prevents it
    const wouldHavePrevented = !persistsUnderIntervention;

    const evidence: OmissionEvidenceBundle = {
      isDutyBound: duty.isBound,
      dutyContractId: duty.contractId,
      hadAwareness: epistemic.hadAwareness,
      wasSelfImpaired: epistemic.wasSelfImpaired,
      wasPhysicallyCapable: capability.wasCapable,
      impedimentDescription: capability.impedimentDescription,
      wouldHavePrevented,
      outcomeUnderIntervention: wouldHavePrevented
        ? "OUTCOME_PREVENTED"
        : "OUTCOME_STILL_ACTUALIZED_FUTILE",
    };

    const verdict = framework.evaluateVerdict(evidence);

    return {
      candidateAgent,
      targetOutcome: targetOccurrenceId,
      dutyFrameworkId: framework.frameworkId,
      evidence,
      frameworkVerdict: verdict,
    };
  }
}
