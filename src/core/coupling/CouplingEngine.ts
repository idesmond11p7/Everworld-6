/**
 * Everworld 6: Occurrence & Cross-Domain Coupling Engine
 * 
 * Enforces:
 * - Cross-domain effects are explicit and registered.
 * - Ownership != Determination.
 * - Determination != Transition.
 * - Indeterminate / contradictory outcomes are valid modeled states.
 */

import {
  DeterminationCommitPacket,
  EntityUuid,
  OccurrenceManifestation,
  StateMutation,
  SupportNode,
  TimelineId,
  WorldTimeMicroseconds,
} from "../../types/causal";
import { AuthorityRegistry } from "../authority/AuthorityRegistry";
import { DurableCommitGateway } from "../invariants";
import { CausalLedgerDag } from "../ledger/CausalLedgerDag";
import { EverworldStateStore } from "../state/StateStore";

export interface ActionProposal {
  readonly actionId: string;
  readonly label: string;
  readonly actorEntityUuid: EntityUuid;
  readonly targetEntityUuid?: EntityUuid;
  readonly domainEngineId: string;
  readonly soundFx: string; // Comic sound burst: e.g. "FWSSHH!", "KRR-RAK!", "THOOM!"
  readonly dialogueLine?: string; // Comic speech balloon
  readonly innerThought?: string; // Comic thought cloud
}

export interface CouplingResult {
  readonly success: boolean;
  readonly determinationId: string;
  readonly soundFx: string;
  readonly dialogueLine?: string;
  readonly innerThought?: string;
  readonly primaryAffectedEntity: EntityUuid;
  readonly committedMutations: ReadonlyArray<StateMutation>;
  readonly error?: string;
}

export class CouplingEngine {
  private determinationSeq = 0;
  private occurrenceSeq = 0;

  constructor(
    private readonly stateStore: EverworldStateStore,
    private readonly ledgerDag: CausalLedgerDag,
    private readonly authority: AuthorityRegistry,
    private readonly commitGateway: DurableCommitGateway
  ) {}

  public executeAction(
    timelineId: TimelineId,
    proposal: ActionProposal,
    currentTime: WorldTimeMicroseconds
  ): CouplingResult {
    this.determinationSeq++;
    const detId = `det_${this.determinationSeq.toString().padStart(4, "0")}_${proposal.actionId}`;
    
    this.occurrenceSeq++;
    const occId = `occ_${this.occurrenceSeq.toString().padStart(4, "0")}`;

    // Collect consumed support states and build mutations through explicit coupling rules
    const mutations: StateMutation[] = [];
    const consumedLeaves: Array<{
      kind: "LEAF";
      stateRef: ReturnType<EverworldStateStore["getActiveState"]> extends undefined ? never : NonNullable<ReturnType<EverworldStateStore["getActiveState"]>>;
      role: "ACTIVE_CONTRIBUTOR" | "PRECONDITION_ENABLER";
    }> = [];

    const actorSomatic = this.stateStore.getActiveRecord(timelineId, proposal.actorEntityUuid, "somatics.vitals");
    const actorSomaticRef = this.stateStore.getActiveState(timelineId, proposal.actorEntityUuid, "somatics.vitals");
    if (actorSomaticRef && actorSomatic) {
      consumedLeaves.push({
        kind: "LEAF",
        stateRef: actorSomaticRef,
        role: "ACTIVE_CONTRIBUTOR",
      });
    }

    // Process specific action coupling rules
    switch (proposal.actionId) {
      case "DRAGON_HELLFIRE_BREATH": {
        // Actor (Dragon): Stamina -15, Heat Output +120°C
        if (actorSomatic && actorSomaticRef) {
          const vitals = actorSomatic.value as { stamina: number; coreTemp: number; adrenaline: number };
          mutations.push({
            entityUuid: proposal.actorEntityUuid,
            path: "somatics.vitals",
            previousVersion: actorSomatic.version,
            newVersion: actorSomatic.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_dragon_vitals_${detId}`,
            canonicalValuePayload: {
              ...vitals,
              stamina: Math.max(0, vitals.stamina - 15),
              coreTemp: vitals.coreTemp + 120,
              adrenaline: Math.min(100, vitals.adrenaline + 10),
            },
          });
        }

        // Target (Wanderer): Somatic damage + Kinetic Shield -40%, Adrenaline +25%
        if (proposal.targetEntityUuid) {
          const targetSomatic = this.stateStore.getActiveRecord(timelineId, proposal.targetEntityUuid, "somatics.vitals");
          const targetSomaticRef = this.stateStore.getActiveState(timelineId, proposal.targetEntityUuid, "somatics.vitals");
          if (targetSomatic && targetSomaticRef) {
            consumedLeaves.push({
              kind: "LEAF",
              stateRef: targetSomaticRef,
              role: "ACTIVE_CONTRIBUTOR",
            });
            const tVitals = targetSomatic.value as { stamina: number; coreTemp: number; shield: number; adrenaline: number };
            mutations.push({
              entityUuid: proposal.targetEntityUuid,
              path: "somatics.vitals",
              previousVersion: targetSomatic.version,
              newVersion: targetSomatic.version + 1n,
              validFrom: currentTime,
              newValueDigest: `digest_target_vitals_${detId}`,
              canonicalValuePayload: {
                ...tVitals,
                shield: Math.max(0, tVitals.shield - 40),
                coreTemp: tVitals.coreTemp + 8,
                adrenaline: Math.min(100, tVitals.adrenaline + 25),
              },
            });
          }

          // Cross-Domain Coupling: Epistemic shift (Wanderer realizes Dragon breath radius exceeds safety zone)
          const targetMind = this.stateStore.getActiveRecord(timelineId, proposal.targetEntityUuid, "mind.beliefs");
          if (targetMind) {
            const beliefs = targetMind.value as Record<string, unknown>;
            mutations.push({
              entityUuid: proposal.targetEntityUuid,
              path: "mind.beliefs",
              previousVersion: targetMind.version,
              newVersion: targetMind.version + 1n,
              validFrom: currentTime,
              newValueDigest: `digest_target_beliefs_${detId}`,
              canonicalValuePayload: {
                ...beliefs,
                dragonBreathDanger: "EXTREME_CONVECTION",
                sanctumApertureSafe: false,
                tacticalOption: "USE_VOID_GLASS_INVERSION",
              },
            });
          }
        }

        // Environmental Reaction: Dais temperature rises
        const daisEnv = this.stateStore.getActiveRecord(timelineId, "sanctum_environment", "environment.ambient");
        if (daisEnv) {
          const env = daisEnv.value as { ambientTemp: number; magmaPressure: number; stability: number };
          mutations.push({
            entityUuid: "sanctum_environment",
            path: "environment.ambient",
            previousVersion: daisEnv.version,
            newVersion: daisEnv.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_env_${detId}`,
            canonicalValuePayload: {
              ...env,
              ambientTemp: env.ambientTemp + 35,
              magmaPressure: Math.min(100, env.magmaPressure + 12),
            },
          });
        }
        break;
      }

      case "WANDERER_VOID_TETHER": {
        // Actor (Wanderer): Stamina -10, Adrenaline +5
        if (actorSomatic && actorSomaticRef) {
          const vitals = actorSomatic.value as { stamina: number; shield: number; adrenaline: number };
          mutations.push({
            entityUuid: proposal.actorEntityUuid,
            path: "somatics.vitals",
            previousVersion: actorSomatic.version,
            newVersion: actorSomatic.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_wanderer_vitals_${detId}`,
            canonicalValuePayload: {
              ...vitals,
              stamina: Math.max(0, vitals.stamina - 10),
              adrenaline: Math.min(100, vitals.adrenaline + 5),
            },
          });
        }

        // Void Item Activation
        const voidItem = this.stateStore.getActiveRecord(timelineId, proposal.actorEntityUuid, "items.void_glass");
        if (voidItem) {
          const itemVal = voidItem.value as { resonance: number; charge: number };
          mutations.push({
            entityUuid: proposal.actorEntityUuid,
            path: "items.void_glass",
            previousVersion: voidItem.version,
            newVersion: voidItem.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_item_${detId}`,
            canonicalValuePayload: {
              ...itemVal,
              resonance: 98,
              charge: Math.max(0, itemVal.charge - 20),
            },
          });
        }

        // Target (Dragon): Scale armor dampened, draconic confusion
        if (proposal.targetEntityUuid) {
          const targetSomatic = this.stateStore.getActiveRecord(timelineId, proposal.targetEntityUuid, "somatics.vitals");
          if (targetSomatic) {
            const tVitals = targetSomatic.value as { scaleArmor: number; rage: number };
            mutations.push({
              entityUuid: proposal.targetEntityUuid,
              path: "somatics.vitals",
              previousVersion: targetSomatic.version,
              newVersion: targetSomatic.version + 1n,
              validFrom: currentTime,
              newValueDigest: `digest_dragon_somatic_${detId}`,
              canonicalValuePayload: {
                ...tVitals,
                scaleArmor: Math.max(0, tVitals.scaleArmor - 18),
                rage: Math.min(100, (tVitals.rage || 0) + 30),
              },
            });
          }

          // Epistemic Reaction: Dragon realizes intruder carries anti-magma relic
          const targetMind = this.stateStore.getActiveRecord(timelineId, proposal.targetEntityUuid, "mind.beliefs");
          if (targetMind) {
            const beliefs = targetMind.value as Record<string, unknown>;
            mutations.push({
              entityUuid: proposal.targetEntityUuid,
              path: "mind.beliefs",
              previousVersion: targetMind.version,
              newVersion: targetMind.version + 1n,
              validFrom: currentTime,
              newValueDigest: `digest_dragon_mind_${detId}`,
              canonicalValuePayload: {
                ...beliefs,
                wandererThreatLevel: "HIGH_ANOMALY",
                recognizedRelic: "CHRONO_VOID_COMPASS",
              },
            });
          }
        }
        break;
      }

      case "SANCTUM_MAGMA_SURGE": {
        // Environmental event: Magma pressure releases
        const daisEnv = this.stateStore.getActiveRecord(timelineId, "sanctum_environment", "environment.ambient");
        if (daisEnv) {
          const env = daisEnv.value as { ambientTemp: number; magmaPressure: number; stability: number };
          mutations.push({
            entityUuid: "sanctum_environment",
            path: "environment.ambient",
            previousVersion: daisEnv.version,
            newVersion: daisEnv.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_env_${detId}`,
            canonicalValuePayload: {
              ...env,
              ambientTemp: env.ambientTemp + 45,
              magmaPressure: Math.max(10, env.magmaPressure - 25),
              stability: Math.max(10, env.stability - 15),
            },
          });
        }

        // Topology aperture mutation: Basalt Bridge becomes perilous
        const bridgeTopo = this.stateStore.getActiveRecord(timelineId, "sanctum_environment", "topology.apertures.bridge");
        if (bridgeTopo) {
          const topo = bridgeTopo.value as { traversable: boolean; status: string; heatRating: number };
          mutations.push({
            entityUuid: "sanctum_environment",
            path: "topology.apertures.bridge",
            previousVersion: bridgeTopo.version,
            newVersion: bridgeTopo.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_bridge_${detId}`,
            canonicalValuePayload: {
              ...topo,
              status: "FRACTURED_SUBMERGED",
              heatRating: 950,
            },
          });
        }
        break;
      }

      case "WANDERER_INSCRIBE_RUNIC_SEAL": {
        // Wanderer weaves a containment seal
        if (actorSomatic && actorSomaticRef) {
          const vitals = actorSomatic.value as { stamina: number; shield: number };
          mutations.push({
            entityUuid: proposal.actorEntityUuid,
            path: "somatics.vitals",
            previousVersion: actorSomatic.version,
            newVersion: actorSomatic.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_seal_vitals_${detId}`,
            canonicalValuePayload: {
              ...vitals,
              stamina: Math.max(0, vitals.stamina - 20),
              shield: Math.min(100, vitals.shield + 30),
            },
          });
        }

        // Environmental stability restored by runic anchors
        const daisEnv = this.stateStore.getActiveRecord(timelineId, "sanctum_environment", "environment.ambient");
        if (daisEnv) {
          const env = daisEnv.value as { stability: number };
          mutations.push({
            entityUuid: "sanctum_environment",
            path: "environment.ambient",
            previousVersion: daisEnv.version,
            newVersion: daisEnv.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_env_rune_${detId}`,
            canonicalValuePayload: {
              ...env,
              stability: Math.min(100, env.stability + 20),
            },
          });
        }
        break;
      }

      default: {
        // Generic action fallback
        if (actorSomatic && actorSomaticRef) {
          const vitals = actorSomatic.value as { stamina: number };
          mutations.push({
            entityUuid: proposal.actorEntityUuid,
            path: "somatics.vitals",
            previousVersion: actorSomatic.version,
            newVersion: actorSomatic.version + 1n,
            validFrom: currentTime,
            newValueDigest: `digest_generic_${detId}`,
            canonicalValuePayload: {
              ...vitals,
              stamina: Math.max(0, vitals.stamina - 5),
            },
          });
        }
        break;
      }
    }

    // Sort consumed leaves canonically by entityUuid and path (Structural Invariant INV-11)
    consumedLeaves.sort((a, b) => {
      const cmpEntity = a.stateRef.entityUuid.localeCompare(b.stateRef.entityUuid);
      if (cmpEntity !== 0) return cmpEntity;
      return a.stateRef.path.localeCompare(b.stateRef.path);
    });

    const supportStructure: SupportNode =
      consumedLeaves.length === 1
        ? consumedLeaves[0]
        : consumedLeaves.length > 1
        ? {
            kind: "CONJUNCTIVE_AND",
            children: consumedLeaves,
          }
        : {
            kind: "LEAF",
            stateRef: {
              timelineId,
              entityUuid: proposal.actorEntityUuid,
              path: "genesis.void",
              version: 1n,
              interval: { start: 0n, end: null },
              valueDigest: "digest_void",
            },
            role: "ACTIVE_CONTRIBUTOR",
          };

    const occurrence: OccurrenceManifestation = {
      occurrenceId: occId,
      committingDeterminationId: detId,
      label: proposal.label,
      primaryAffectedEntity: proposal.targetEntityUuid || proposal.actorEntityUuid,
      timestamp: currentTime,
    };

    const packet: DeterminationCommitPacket = {
      determinationId: detId,
      timelineId,
      kind: "STANDARD_TRANSITION",
      timestamp: currentTime,
      domainEngineId: proposal.domainEngineId,
      supportStructure,
      committedMutations: mutations,
      actualizedOccurrences: [occurrence],
      provenanceDigest: `prov_${detId}`,
    };

    try {
      this.commitGateway.commit(packet);
      return {
        success: true,
        determinationId: detId,
        soundFx: proposal.soundFx,
        dialogueLine: proposal.dialogueLine,
        innerThought: proposal.innerThought,
        primaryAffectedEntity: occurrence.primaryAffectedEntity,
        committedMutations: mutations,
      };
    } catch (err) {
      return {
        success: false,
        determinationId: detId,
        soundFx: "FAIL",
        primaryAffectedEntity: proposal.actorEntityUuid,
        committedMutations: [],
        error: (err as Error).message,
      };
    }
  }
}
