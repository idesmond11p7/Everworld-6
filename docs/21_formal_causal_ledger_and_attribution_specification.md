# Everworld 6: Formal Causal Ledger & Attribution Specification (Doc 17)

## 1. System Layer Hierarchy & Boundary Contracts

The Everworld 6 causal architecture enforces a strict, unidirectional authority hierarchy. No downstream layer may redefine, mutate, or synthesize the semantics of an upstream layer.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. WORLD ONTOLOGY                                                           │
│    Declared entity schemas, spatial topologies, and property domains.       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. CONSTITUTIVE SEMANTICS                                                   │
│    Authoritative domain engines (Physics, Biology, Magic, Combat, Crafting, │
│    Cognition, Economics, Institutions) defining state transition laws,      │
│    interaction formulas, and boundary conditions.                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. AUTHORITATIVE STATE STORE                                                │
│    Active state intervals, versioned properties, and true/false invariants. │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. DETERMINATION COMMIT GATEWAY (2PC / WAL)                                 │
│    Atomic transformation packets committing state mutations & actualizing   │
│    occurrences under the 13 Structural Invariants via durable WAL protocol.│
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. CAUSAL LEDGER (Timeline DAG)                                             │
│    Immutable, append-only bipartite graph (Determination <-> StateReference)│
│    recording Authoritative World History across all recognized domains.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. ATTRIBUTION & COUNTERFACTUAL INFERENCE ENGINE                            │
│    Target-relative queries over actual DAG lineage, typed quantitative      │
│    contribution vectors, and explicit counterfactual intervention models.   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. AGENCY & NORMATIVE EVALUATOR                                             │
│    Mapping actions to extensible agency role maps, and evaluating omissions │
│    via the 4-Tuple Evidence Pipeline against legal/duty frameworks.         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 8. PRESENTATION & PROJECTION LAYER                                          │
│    UI views, narrative summaries, and LLM text generation (Zero authority). │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Non-Redefinition Invariants
1. **Presentation Isolation:** UI views or narrative text cannot create state transitions or causal links.
2. **Normative Isolation:** Legal, moral, or culpability evaluations cannot rewrite or insert physical edges into the Causal Ledger DAG.
3. **Counterfactual Isolation:** Trajectories evaluated in hypothetical branches $\mathcal{W}_{\text{hypothetical}}$ cannot be inserted into actual timeline history $\mathcal{W}_{\text{actual}}$.
4. **Agency Decoupling:** Actor intentions and goals cannot override collision, chemical, or state transformation facts.
5. **Attribution Decoupling:** Attribution queries cannot alter, synthesize, or re-evaluate underlying constitutive determinations.
6. **Host Trace Isolation:** Ephemeral ODE solver substeps, CPU thread schedules, memory pointers, and runtime caches have zero authority and are strictly excluded from the Ledger.
7. **Domain Engine Boundary:** The Causal Ledger and Attribution Engine **MUST NOT** implement Physics, Biology, Magic, Combat, or Cognition laws. They accept determinations emitted by constitutive domain engines via declared contracts.

---

## 2. Core Ontological Primitives & Data Contracts

### 2.1 Identifiers and Coordinate Types

```typescript
export type TimelineId = string;         // e.g. "TL_ROOT_0", "TL_BRANCH_ALPHA"
export type EntityUuid = string;         // RFC-4122 v4 UUID
export type SubsystemPath = string;      // e.g. "somatic.cardiovascular.heart_state"
export type StateVersion = bigint;       // Monotonically increasing uint64
export type DeterminationId = string;    // e.g. "DET_20260902_000041"
export type OccurrenceId = string;       // e.g. "OCC_DEATH_KING_001"
/**
 * Continuous World Time represented as a 64-bit integer of Microseconds (10^-6 s).
 * Bitwise deterministic across all CPU architectures and runtimes.
 */
export type WorldTimeMicroseconds = bigint;
```

### 2.2 State Reference Handle (`StateReference`)
A `StateReference` is an immutable, content-addressed handle representing a specific versioned interval of an authoritative state component.

```typescript
export interface StateInterval {
  readonly start: WorldTimeMicroseconds;
  readonly end: WorldTimeMicroseconds | null; // null indicates active/open interval
}

export interface StateReference {
  readonly timelineId: TimelineId;
  readonly entityUuid: EntityUuid;
  readonly path: SubsystemPath;
  readonly version: StateVersion;
  readonly interval: StateInterval;
  readonly valueDigest: string;   // SHA-256 digest of canonical serialized value
}
```

### 2.3 Support Structure Trees (`SupportStructure`)
A Determination's consumed inputs are organized into a typed, deterministic support tree that encodes how inputs participated in the constitutive evaluation. Commutativity and interaction ordering are **strictly declared by the constitutive domain contract**; the Ledger does not invent mathematical commutativity.

```typescript
export type SupportRole = 
  | "ACTIVE_CONTRIBUTOR"     // Direct active energy, momentum, chemical, or transform input
  | "PRECONDITION_ENABLER";  // Boolean permission, invariant prerequisite, or spatial container

export interface QuantitativeMeasurement {
  readonly dimension: string;         // e.g. "ENERGY_CONSERVED", "MOMENTUM", "DAMAGE_POTENTIAL"
  readonly unit: string;              // e.g. "JOULE", "KG_M_PER_S", "SCALAR_HEALTH_POINTS"
  readonly magnitude: number;
  readonly measurementFrame?: string; // e.g. "LOCAL_REST_FRAME", "STANDARD_GRAVITY"
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
  readonly thresholdDimension: string; // e.g. "KINETIC_FORCE", "THERMAL_FLUX"
  readonly thresholdUnit: string;      // e.g. "NEWTONS", "JOULES"
  readonly targetValue: number;
  readonly children: ReadonlyArray<SupportLeaf>;
}

export interface SupportInteractionGroup {
  readonly kind: "INTERACTION_GROUP";
  readonly interactionFormulaId: string; // e.g. "EXOTHERMIC_CATALYSIS_v1"
  readonly isCommutative: boolean;       // If false, child array order is authoritative
  readonly children: ReadonlyArray<SupportNode>;
}

export type SupportNode =
  | SupportLeaf
  | SupportConjunction
  | SupportDisjunction
  | SupportDiscreteCountThreshold
  | SupportAccumulatedQuantityThreshold
  | SupportInteractionGroup;
```

### 2.4 Determination Classification & Commit Packet

```typescript
export type DeterminationKind = 
  | "GENESIS_INITIALIZATION"  // Consumed inputs = [] (Permitted world/entity origin)
  | "DYNAMIC_ALLOCATION"      // Consumes entity lifetime/container handle only
  | "STANDARD_TRANSITION";    // Requires non-empty support structure

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
```

### 2.5 Causal Ledger Bipartite Graph
The Ledger DAG is an append-only bipartite graph:
$$\mathcal{G}_{\text{ledger}} = \langle \mathbf{D}, \mathbf{S}, \mathbf{E}_{\text{consumes}}, \mathbf{E}_{\text{commits}} \rangle$$

- $\mathbf{D}$: Set of all Determination nodes.
- $\mathbf{S}$: Set of all StateReference nodes.
- $\mathbf{E}_{\text{consumes}} \subseteq \mathbf{S} \times \mathbf{D}$: Directed edges from consumed StateReferences to the consuming Determination.
- $\mathbf{E}_{\text{commits}} \subseteq \mathbf{D} \times \mathbf{S}$: Directed edges from the committing Determination to newly produced StateReferences.

**Rule on Occurrences:** Occurrences are **not** independent graph nodes. An `Occurrence` is an immutable manifestation explicitly bound to its committing `DeterminationId`:
$$\text{Producer}(\text{Occurrence } O) \equiv \mathcal{D}_{\text{commit}}$$

---

## 3. The 13 Structural Invariant Rejection Validators

Before any `DeterminationCommitPacket` is appended to the Ledger and committed to the State Store, it must pass all 13 deterministic validation gates:

| Invariant | Name | Validation Condition | Error Code |
| :--- | :--- | :--- | :--- |
| **INV-1** | **Schema Validity** | All UUIDs, paths, BigInt timestamps, and payload digests match schema constraints. | `ERR_SCHEMA_VIOLATION` |
| **INV-2** | **Temporal Interval Consistency** | All consumed states have $t_{\text{valid\_start}} \le T_{\text{det}}$. All committed states have $t_{\text{valid\_start}} \ge T_{\text{det}}$. | `ERR_TEMPORAL_INCONSISTENCY` |
| **INV-3** | **Path-Specific Version Head Monotonicity** | For each mutation on $\langle \text{EntityUuid}, \text{Path} \rangle$, $\text{newVersion} \equiv \text{HeadVersion}(\text{Path}) + 1$. Legally consumed historical states on other paths do not block un-mutated dependencies. | `ERR_VERSION_STALE_OR_NON_MONOTONIC` |
| **INV-4** | **Directed Acyclicity** | Appending $\mathcal{D}$ and its edges introduces zero cycles into $\mathcal{G}_{\text{ledger}}$. | `ERR_CAUSAL_CYCLE_DETECTED` |
| **INV-5** | **Timeline Confinement** | $\mathcal{D}$ and all consumed/committed states belong to the same authoritative `TimelineId`. | `ERR_TIMELINE_BOUNDARY_BREACH` |
| **INV-6** | **Support Non-Emptiness with Genesis Exemption** | `supportStructure` must contain at least one valid `SupportLeaf` unless `kind === "GENESIS_INITIALIZATION"`. | `ERR_EMPTY_SUPPORT_STRUCTURE` |
| **INV-7** | **Role Legality** | Every `SupportLeaf` is explicitly marked `ACTIVE_CONTRIBUTOR` or `PRECONDITION_ENABLER`. | `ERR_ILLEGAL_SUPPORT_ROLE` |
| **INV-8** | **Durable 2PC Commit Protocol** | Pre-flight validation writes to WAL; commit applies atomically to State Store and Ledger DAG. Rollback/replay preserves consistency on failure. | `ERR_DUAL_WRITE_TRANSACTION_FAILED` |
| **INV-9** | **Absence Invariant Purity** | Negative conditions are represented via active false-state intervals, never ghost omission determinations. | `ERR_GHOST_OMISSION_NODE_PROHIBITED` |
| **INV-10**| **Idempotency & Collision Guard** | Re-submitting identical determination ID + payload is an idempotent ACK; ID collision with different payload is rejected. | `ERR_DETERMINATION_ID_COLLISION` |
| **INV-11**| **Declared Commutativity Sorting** | Pure conjunctions/disjunctions and commutative interaction groups sort children canonically by $\langle \text{EntityUuid}, \text{Path}, \text{Version} \rangle$. Non-commutative groups preserve authoritative engine child order. | `ERR_NON_CANONICAL_SUPPORT_ORDER` |
| **INV-12**| **Granularity Preservation** | Ingestion accepts the exact determination granularity emitted by the engine without synthetic merging or splitting. | `ERR_SYNTHETIC_GRANULARITY_COLLAPSE` |
| **INV-13**| **Host Ephemera Exclusion** | Ingestion payloads must not contain host memory addresses, raw float tolerances, solver substeps, or thread IDs. | `ERR_HOST_EPHEMERA_LEAK` |

---

## 4. Attribution & Inference Layer Contracts

### 4.1 Provenance-Keyed Quantitative Attribution Vectors
Quantitative values remain typed and are never coerced into a single scalar:

```typescript
export interface AttributionProvenanceKey {
  readonly entityUuid: EntityUuid;
  readonly originatingPath?: SubsystemPath;
  readonly stateVersion?: StateVersion;
}

export interface ConservedFluxVector {
  readonly dimension: string;
  readonly unit: string;
  readonly totalMagnitude: number;
  readonly contributions: ReadonlyMap<string, number>; // JSON stringified AttributionProvenanceKey -> magnitude
}

export interface MarginalNecessityVector {
  readonly modelId: string;
  readonly interventionType: "SUPPRESS_ACTION" | "ZERO_INPUT" | "REVERT_STATE";
  readonly necessity: ReadonlyMap<string, boolean>; // JSON stringified AttributionProvenanceKey -> boolean
}

export interface CoalitionShapleyReport {
  readonly characteristicFunctionId: string;
  readonly outcomeMetricDescription: string;
  readonly shapleyValues: ReadonlyMap<string, number>; // JSON stringified AttributionProvenanceKey -> float
}
```

### 4.2 Extensible Agency Architecture

```typescript
export type AgencyRoleType =
  | "SOMATIC_EXECUTOR"      // Physical/Somatic limb or channel
  | "DIRECT_CONTROLLER"     // Immediate AI/Player/Spell commanding the channel
  | "ORIGINATING_AUTHOR"    // Distal programmer/creator (e.g. Artificer of Golem)
  | "COGNITIVE_GOAL_OWNER"  // Entity holding mental state matching the outcome
  | "DELEGATED_PROXY"       // Intermediary agent in chain of command
  | string;                 // Extensible custom domain roles

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
```

### 4.3 Omission Evaluator Pipeline (4-Tuple Objective Evidence)

Negative attribution is **never a physical edge in the Ledger**. It is evaluated on-demand as a 4-tuple logical query against an authoritative normative framework:

$$\text{OmissionProfile}(A, O, \text{DutyCode}) = \langle \text{DutyBinding}, \text{EpistemicAwareness}, \text{PhysicalOpportunity}, \text{CounterfactualEfficacy} \rangle$$

```typescript
export interface OmissionEvaluationReport {
  readonly candidateAgent: EntityUuid;
  readonly targetOutcome: OccurrenceId;
  readonly dutyFrameworkId: string;

  // Standardized Objective Evidence Dimensions
  readonly evidence: {
    readonly isDutyBound: boolean;
    readonly dutyContractId?: string;
    readonly hadAwareness: boolean;
    readonly wasSelfImpaired: boolean;
    readonly wasPhysicallyCapable: boolean;
    readonly impedimentDescription?: string;
    readonly wouldHavePrevented: boolean;
    readonly outcomeUnderIntervention: string;
  };

  // Evaluator-Defined Framework Result (Decoupled from Engine Core)
  readonly frameworkVerdict: {
    readonly verdictCode: string; // e.g. "CULPABLE_BY_OMISSION", "EXONERATED_PHYSICAL_IMPOSSIBILITY"
    readonly rationale: string;
    readonly statutoryPayload?: unknown;
  };
}
```

---

## 5. Canonicalization, Invariance, & Equivalence

### 5.1 Semantic Determinism vs. Serialization Determinism
- **ATTR-VII5-INV-3 (Canonical Attribution Determinism):** For identical authoritative inputs, identical attribution model/version, identical intervention semantics, and identical numerical/serialization specification, the Attribution Engine **MUST** produce the same canonical semantic result and, where the numerical specification guarantees it, the same canonical serialized representation.

### 5.2 Model-Relative Attribution Equivalence
Two Ledger histories $\mathcal{H}_1$ and $\mathcal{H}_2$ are **Attribution-Equivalent** with respect to a target occurrence $O$ and attribution query/model $M$ if and only if:
$$\text{QueryAttribution}(\mathcal{H}_1, O, M) \equiv \text{QueryAttribution}(\mathcal{H}_2, O, M)$$
preserving every semantic attribute consumed by the requested attribution model.

Changes in internal ODE solver substeps, host memory structures, CPU thread scheduling, or presentation strings have zero effect on Authoritative History and are strictly **Attribution-Invariant**.

---

## 6. Mandatory Falsification Test Obligations (Adversarial Suite)

1. **TEST_REG_1 (Direct Kinematics):** Single projectile lethality. Producer is $\mathcal{D}_{\text{impact}}$, not the shooter UUID.
2. **TEST_REG_2 (Nonlinear Threshold & Synergy):** Fire + Acid + Vault door. Verifies raw energy accounting vs. catalytic interaction term without synthetic percentage collapse.
3. **TEST_REG_3 (Preemption & Deflection):** Multi-attacker scenario. Preempting lethal outcome preserves actual corpse momentum and carriage collision.
4. **TEST_REG_4 (Target-Relative Lineage):** Corpse collision carriage smash. Attacker $B$ is lethal cause of death, but only distal mass ancestor of carriage damage.
5. **TEST_REG_5 (Omission 4-Tuple Filter):** 
   - Paralyzed operator $\to$ Exonerated (Capability = FALSE).
   - Lethal overdose medic $\to$ Exonerated of death (Efficacy = FALSE / Futile).
   - Sleeping guard with duty $\to$ Culpable by omission.
6. **TEST_REG_6 (Acyclicity, Version Monotonicity & Genesis Exemption):** Circular additions and stale version writes rejected; genesis initialization accepted.
7. **TEST_REG_7 (Computational Ephemera Invariance):** Two solver configurations with identical boundary crossings produce structurally and semantically identical Ledger DAGs and attribution reports.
