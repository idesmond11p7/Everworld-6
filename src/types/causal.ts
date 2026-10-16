/**
 * Everworld 6: Formal Causal Ledger & Attribution Type System (Doc 17)
 * Strictly decoupled from constitutive mechanics (Physics, Biology, Magic, etc.).
 */

export type TimelineId = string;
export type EntityUuid = string;
export type SubsystemPath = string;
export type StateVersion = bigint;
export type DeterminationId = string;
export type OccurrenceId = string;

/**
 * Continuous World Time in Microseconds (10^-6 s) as uint64 BigInt.
 * Enforces cross-platform bitwise deterministic temporal coordinates.
 */
export type WorldTimeMicroseconds = bigint;

export interface StateInterval {
  readonly start: WorldTimeMicroseconds;
  readonly end: WorldTimeMicroseconds | null; // null = active interval
}

export interface StateReference {
  readonly timelineId: TimelineId;
  readonly entityUuid: EntityUuid;
  readonly path: SubsystemPath;
  readonly version: StateVersion;
  readonly interval: StateInterval;
  readonly valueDigest: string;
}

export type SupportRole = "ACTIVE_CONTRIBUTOR" | "PRECONDITION_ENABLER";

export interface QuantitativeMeasurement {
  readonly dimension: string;
  readonly unit: string;
  readonly magnitude: number;
  readonly measurementFrame?: string;
  readonly aggregationSemantics: "SUMMABLE_FLUX" | "INTENSIVE_PROPERTY" | "ORDINAL_SCALE";
}

export interface SupportLeaf {
  readonly kind: "LEAF";
  readonly stateRef: StateReference;
  readonly role: SupportRole;
  readonly quantitativeMeasurement?: QuantitativeMeasurement;
}

export interface SupportConjunction {
  readonly kind: "CONJUNCTIVE_AND";
  readonly children: ReadonlyArray<SupportNode>;
}

export interface SupportDisjunction {
  readonly kind: "DISJUNCTIVE_OR";
  readonly children: ReadonlyArray<SupportNode>;
}

export interface SupportDiscreteCountThreshold {
  readonly kind: "DISCRETE_K_OF_N";
  readonly requiredCount: number;
  readonly children: ReadonlyArray<SupportNode>;
}

export interface SupportAccumulatedQuantityThreshold {
  readonly kind: "ACCUMULATED_QUANTITY_THRESHOLD";
  readonly thresholdDimension: string;
  readonly thresholdUnit: string;
  readonly targetValue: number;
  readonly children: ReadonlyArray<SupportLeaf>;
}

export interface SupportInteractionGroup {
  readonly kind: "INTERACTION_GROUP";
  readonly interactionFormulaId: string;
  readonly isCommutative: boolean;
  readonly children: ReadonlyArray<SupportNode>;
}

export type SupportNode =
  | SupportLeaf
  | SupportConjunction
  | SupportDisjunction
  | SupportDiscreteCountThreshold
  | SupportAccumulatedQuantityThreshold
  | SupportInteractionGroup;

export type DeterminationKind =
  | "GENESIS_INITIALIZATION"
  | "DYNAMIC_ALLOCATION"
  | "STANDARD_TRANSITION";

export interface StateMutation {
  readonly entityUuid: EntityUuid;
  readonly path: SubsystemPath;
  readonly previousVersion: StateVersion;
  readonly newVersion: StateVersion;
  readonly validFrom: WorldTimeMicroseconds;
  readonly newValueDigest: string;
  readonly canonicalValuePayload: unknown;
}

export interface OccurrenceManifestation {
  readonly occurrenceId: OccurrenceId;
  readonly committingDeterminationId: DeterminationId;
  readonly label: string;
  readonly primaryAffectedEntity: EntityUuid;
  readonly timestamp: WorldTimeMicroseconds;
}

export interface DeterminationCommitPacket {
  readonly determinationId: DeterminationId;
  readonly timelineId: TimelineId;
  readonly kind: DeterminationKind;
  readonly timestamp: WorldTimeMicroseconds;
  readonly domainEngineId: string;
  readonly supportStructure: SupportNode;
  readonly committedMutations: ReadonlyArray<StateMutation>;
  readonly actualizedOccurrences: ReadonlyArray<OccurrenceManifestation>;
  readonly provenanceDigest: string;
}

export enum CausalLedgerErrorCode {
  SCHEMA_VIOLATION = "ERR_SCHEMA_VIOLATION",
  TEMPORAL_INCONSISTENCY = "ERR_TEMPORAL_INCONSISTENCY",
  VERSION_STALE_OR_NON_MONOTONIC = "ERR_VERSION_STALE_OR_NON_MONOTONIC",
  CAUSAL_CYCLE_DETECTED = "ERR_CAUSAL_CYCLE_DETECTED",
  TIMELINE_BOUNDARY_BREACH = "ERR_TIMELINE_BOUNDARY_BREACH",
  EMPTY_SUPPORT_STRUCTURE = "ERR_EMPTY_SUPPORT_STRUCTURE",
  ILLEGAL_SUPPORT_ROLE = "ERR_ILLEGAL_SUPPORT_ROLE",
  DUAL_WRITE_TRANSACTION_FAILED = "ERR_DUAL_WRITE_TRANSACTION_FAILED",
  GHOST_OMISSION_NODE_PROHIBITED = "ERR_GHOST_OMISSION_NODE_PROHIBITED",
  DETERMINATION_ID_COLLISION = "ERR_DETERMINATION_ID_COLLISION",
  NON_CANONICAL_SUPPORT_ORDER = "ERR_NON_CANONICAL_SUPPORT_ORDER",
  SYNTHETIC_GRANULARITY_COLLAPSE = "ERR_SYNTHETIC_GRANULARITY_COLLAPSE",
  HOST_EPHEMERA_LEAK = "ERR_HOST_EPHEMERA_LEAK",
}

export interface AttributionProvenanceKey {
  readonly entityUuid: EntityUuid;
  readonly originatingPath?: SubsystemPath;
  readonly stateVersion?: string; // bigint serialized as string for JSON keying
}

export interface ConservedFluxVector {
  readonly dimension: string;
  readonly unit: string;
  readonly totalMagnitude: number;
  readonly contributions: ReadonlyMap<string, number>;
}

export interface MarginalNecessityVector {
  readonly modelId: string;
  readonly interventionType: "SUPPRESS_ACTION" | "ZERO_INPUT" | "REVERT_STATE";
  readonly necessity: ReadonlyMap<string, boolean>;
}

export interface CoalitionShapleyReport {
  readonly characteristicFunctionId: string;
  readonly outcomeMetricDescription: string;
  readonly shapleyValues: ReadonlyMap<string, number>;
}

export type AgencyRoleType =
  | "SOMATIC_EXECUTOR"
  | "DIRECT_CONTROLLER"
  | "ORIGINATING_AUTHOR"
  | "COGNITIVE_GOAL_OWNER"
  | "DELEGATED_PROXY"
  | string;

export interface AgencyAttributionReport {
  readonly targetOccurrence: OccurrenceId;
  readonly initiatingDetermination: DeterminationId;
  readonly agencyRoleMap: ReadonlyMap<AgencyRoleType, EntityUuid>;
  readonly goalAlignment: {
    readonly declaredGoal?: string;
    readonly isOutcomeAligned: boolean;
    readonly mismatchReason?: "ACCIDENT" | "DEFLECTED" | "PREEMPTED" | "NO_GOAL";
  };
}

export interface OmissionEvidenceBundle {
  readonly isDutyBound: boolean;
  readonly dutyContractId?: string;
  readonly hadAwareness: boolean;
  readonly wasSelfImpaired: boolean;
  readonly wasPhysicallyCapable: boolean;
  readonly impedimentDescription?: string;
  readonly wouldHavePrevented: boolean;
  readonly outcomeUnderIntervention: string;
}

export interface FrameworkVerdict {
  readonly verdictCode: string;
  readonly rationale: string;
  readonly statutoryPayload?: unknown;
}

export interface OmissionEvaluationReport {
  readonly candidateAgent: EntityUuid;
  readonly targetOutcome: OccurrenceId;
  readonly dutyFrameworkId: string;
  readonly evidence: OmissionEvidenceBundle;
  readonly frameworkVerdict: FrameworkVerdict;
}
