# Everworld 6: Continuous Process Integration Specification (Doc 22)

## 1. Scope, Boundary, and Core Philosophy

This specification establishes the formal bridge between **Continuous Mathematical Processes** (differential equations, environmental fields, thermodynamic gradients, kinematic trajectories, metabolic flows) and the **Discrete Causal Ledger** established in Doc 21.

### 1.1 Non-Invention Directive
The Causal Ledger and Continuous Integration Gateway **MUST NOT** invent physical, biological, magical, or combat laws. They define the formal interface contracts through which authoritative domain engines integrate continuous processes, detect boundary transitions, accumulate conserved flux, and submit valid `DeterminationCommitPackets` to the Ledger.

### 1.2 The Master Invariant of Continuous Causal Equivalence
$$\text{ATTR-IX-INV-0 (Continuous Attribution Invariance)}$$
> Two valid computational executions of the same constitutive continuous process are **Attribution-Equivalent** with respect to a target occurrence $O$ and attribution model $M$ if and only if they produce the identical authoritative boundary state transitions and identical topological boundary crossings under their declared canonical specification. Differences in internal numerical solver substeps, host thread schedules, memory allocations, or intermediate evaluation frames have zero causal status and are strictly forbidden from entering the Ledger DAG.

---

## 2. Core Ontological Objects & Type Contracts

### 2.1 Identifiers and Temporal Coordinates

```typescript
import {
  EntityUuid,
  SubsystemPath,
  TimelineId,
  DeterminationId,
  OccurrenceId,
  WorldTimeMicroseconds,
  StateVersion,
  QuantitativeMeasurement
} from "./causal";

export type ProcessId = string;         // e.g. "PROC_BLEED_WARRIOR_01"
export type RegimeIndex = bigint;        // Monotonically increasing uint64 per process lineage
export type FormulaId = string;          // e.g. "HEMORRHAGE_EXPONENTIAL_DECAY_v2"
export type DomainCompositionOperatorId = string; // e.g. "VECTOR_SUM_3D_v1"
```

### 2.2 Topological Boundary Predicates
A continuous process boundary is not an ambiguous "event." It must declare an explicit topological crossing predicate:

```typescript
export type ThresholdTopology =
  | "STRICT_UPWARD_CROSSING"    // S(t-) < Theta && S(t+) > Theta
  | "STRICT_DOWNWARD_CROSSING"  // S(t-) > Theta && S(t+) < Theta
  | "BOUNDARY_ENTER"            // S(t-) \notin Set && S(t+) \in Set (includes tangential touch)
  | "BOUNDARY_EXIT"             // S(t-) \in Set && S(t+) \notin Set
  | "INTERVAL_OCCUPANCY";       // S(t) == Theta over [t1, t2] with measure > 0

export interface BoundaryConditionContract {
  readonly conditionId: string;
  readonly targetPath: SubsystemPath;
  readonly topology: ThresholdTopology;
  readonly targetThresholdValue: number;
  readonly hysteresisBand?: number;      // Declared anti-chatter tolerance
  readonly minimumDwellMicroseconds?: bigint; // Minimum time condition must persist
}
```

### 2.3 Process Lineage and Active Regime Interval (`ContinuousProcessInterval`)
To ensure process identity is not fractured by external parameter shifts, the architecture cleanly separates **Process Lineage** from **Regime Intervals**.

```typescript
export interface ProcessLineageIdentity {
  readonly rootProcessId: ProcessId;
  readonly initiatingDeterminationId: DeterminationId;
  readonly domainEngineId: string;
  readonly targetEntity: EntityUuid;
  readonly timelineId: TimelineId;
}

export type DependencyPerturbationType =
  | "DEPENDENCY_MUTATED"      // Parameter value shifted; triggers successor regime interval
  | "DEPENDENCY_REPLACED"     // Source entity/handle swapped; triggers successor regime interval
  | "DEPENDENCY_SUSPENDED"    // Temporarily disabled; process enters dormant state
  | "DEPENDENCY_TERMINATED";  // Governing precondition permanently destroyed; process closes

export type ProcessTerminationReason =
  | "THRESHOLD_CROSSED"       // Breached declared internal boundary
  | "FLUX_EXHAUSTION"         // Integrated fuel/energy depleted to zero
  | "DEPENDENCY_TERMINATED"   // Precondition destroyed by external determination
  | "EXTERNAL_PREEMPTION"     // Discrete determination actively severed/replaced process
  | "NATURAL_EQUILIBRIUM";    // Asymptotic resting state reached

export interface ContinuousProcessInterval {
  // Identity & Lineage
  readonly lineage: ProcessLineageIdentity;
  readonly regimeIndex: RegimeIndex;
  
  // Governed Subsystem Paths
  readonly governedPaths: ReadonlyArray<SubsystemPath>;

  // Temporal Bounds (Left-closed, right-open: [start, end))
  readonly startCoordinate: WorldTimeMicroseconds;
  readonly endCoordinate: WorldTimeMicroseconds | null; // null indicates actively integrating

  // Complete Markov Configuration (State + Governing Parameters)
  readonly constitutiveFormulaId: FormulaId;
  readonly constitutiveConfigDigest: string; // Canonical digest of all equations + constant parameters
  readonly declaredCompositionId?: DomainCompositionOperatorId;

  // Active Boundary Monitored Conditions
  readonly monitoredBoundaries: ReadonlyArray<BoundaryConditionContract>;

  // Cumulative Conserved Flux (Updated transactionally at regime shift or termination)
  readonly accumulatedMeasurements: ReadonlyMap<string, QuantitativeMeasurement>;

  // Authoritative Markov State at Interval Boundary
  readonly boundaryStateDigest: string;
}
```

### 2.4 Quantization and Coordinate Mapping Contract
Continuous mathematical solvers operate over continuous domains $\mathbb{R}$. The conversion of a continuous mathematical root $t^*$ into the discrete world timeline coordinate $\mathbf{T} \in \mathbb{N}$ is an explicit, domain-governed contract:

```typescript
export type QuantizationRule =
  | "FLOOR_INTEGER"           // T = floor(t*)
  | "CEIL_INTEGER"            // T = ceil(t*)
  | "NEAREST_HALF_EVEN"       // Standard convergent rounding
  | "FIRST_SATISFIED_TICK";   // T = smallest discrete tick where condition evaluates true

export interface CoordinateQuantizationContract {
  readonly rule: QuantizationRule;
  readonly scaleMicroseconds: bigint; // Standard: 1 microsecond = 1n
  readonly preserveSubTickRemainder: boolean;
}
```

---

## 3. The 15 Continuous Invariant Validators (Frontier A)

Before any determination arising from a continuous process can be ingested by the Ledger Gateway, it must pass the continuous integration invariants:

| Invariant | Name | Verification Condition | Error Code |
| :--- | :--- | :--- | :--- |
| **ATTR-IX-INV-1** | **Persistence Invariance** | Snapshots, saves, and loads create zero determinations and preserve active continuous intervals topologically unchanged. | `ERR_PERSISTENCE_CONTAMINATION` |
| **ATTR-IX-INV-2** | **Read-Only Sampling Invariance** | Evaluating continuous state $S(T_{\text{sample}})$ is a pure, idempotent projection producing zero state mutations and zero ledger nodes. | `ERR_SAMPLING_STATE_MUTATION` |
| **ATTR-IX-INV-3** | **Declared Process Composition** | Multiple processes may act on the same path if and only if an authoritative domain composition operator is explicitly declared. | `ERR_UNDECLARED_PATH_CONTENTION` |
| **ATTR-IX-INV-4** | **Topological Boundary Determinism** | Crossings must satisfy declared topological predicates (`STRICT_UPWARD`, `BOUNDARY_ENTER`, etc.); contact is not crossing unless specified. | `ERR_INVALID_BOUNDARY_TOPOLOGY` |
| **ATTR-IX-INV-5** | **Intermediate Root Completeness** | Domain solvers must verify and enumerate all intermediate roots across an integration interval $[T_0, T_1]$; endpoint sampling alone is rejected. | `ERR_ROOT_ENUMERATION_INCOMPLETE` |
| **ATTR-IX-INV-6** | **Declared Boundary Coalescence** | High-frequency physical oscillations must specify hysteresis bands or aggregate macro-determinations; arbitrary ledger rate limits are prohibited. | `ERR_UNCONTROLLED_BOUNDARY_CHATTER` |
| **ATTR-IX-INV-7** | **Canonical Integration Spec** | Numerically integrated processes without closed-form solutions must bind to a declared canonical integration step specification. | `ERR_NON_CANONICAL_INTEGRATION_SPEC` |
| **ATTR-IX-INV-8** | **Canonical State Digest Encoding** | State and boundary digests must be computed via RFC-8785 canonical JSON or deterministic fixed-point binary encoding. | `ERR_NON_CANONICAL_DIGEST` |
| **ATTR-IX-INV-9** | **Markov Process Closure** | Every parameter influencing future continuous evolution must reside in versioned state or in the immutable configuration digest. | `ERR_MARKOV_CLOSURE_VIOLATION` |
| **ATTR-IX-INV-10**| **Transactional Interruption** | Process interval closure and flux flushing must execute within the 2PC WAL protocol; accumulators cannot clear before commit confirmation. | `ERR_NON_TRANSACTIONAL_INTERRUPT` |
| **ATTR-IX-INV-11**| **Granular Dependency Lifecycle** | Parameter mutations trigger regime transitions (`DEPENDENCY_MUTATED`); process destruction is restricted to `DEPENDENCY_TERMINATED`. | `ERR_ILLEGAL_DEPENDENCY_LIFECYCLE` |
| **ATTR-IX-INV-12**| **Process Identity Continuity** | Regime transitions increment `RegimeIndex` while strictly preserving `RootProcessId` and initiating causal lineage. | `ERR_PROCESS_IDENTITY_FRACTURE` |
| **ATTR-IX-INV-13**| **Forward Commitment Prohibition**| Projected boundary crossings exist strictly in ephemeral queues; submitting future determinations ahead of the world clock is prohibited. | `ERR_PREDICTIVE_FORWARD_COMMIT` |
| **ATTR-IX-INV-14**| **Branch-Isolated Lineage** | Continuous processes in branched timelines operate on copy-on-write state; branch simulation cannot mutate parent process intervals. | `ERR_TIMELINE_LEAKAGE` |
| **ATTR-IX-INV-15**| **Well-Founded Same-Time Closure**| Instantaneous cascades at coordinate $T$ must form a finite, strictly acyclic sub-DAG; continuous thresholds require $T_{\text{end}} > T_{\text{start}}$. | `ERR_UNBOUNDED_INSTANTANEOUS_CASCADE`|

---

## 4. Continuous Interval Algebra (CIA) Operations

The operational semantics of continuous processes are governed by 5 pure algebraic operations:

### 4.1 Operation 1: `Initiate`
```text
Initiate(LineageIdentity, FormulaSpec, BoundaryContracts, T_start) 
  -> ContinuousProcessInterval
```
- **Precondition:** Initiated by an authoritative `DeterminationCommitPacket` (e.g. `GENESIS` or `STANDARD_TRANSITION`) valid at $T_{\text{start}}$.
- **Postcondition:** Opens interval $[T_{\text{start}}, \text{null})$ with `RegimeIndex = 0n`. Initializes accumulated flux map to zero.

### 4.2 Operation 2: `Sample` (Idempotent Projection)
```text
Sample(ProcessInterval, T_sample) 
  -> EvaluatedStateSnapshot
```
- **Precondition:** $T_{\text{start}} \le T_{\text{sample}} < T_{\text{end}}$ (or active).
- **Postcondition:** Returns mathematical state $S(T_{\text{sample}})$. **Zero modifications** to process interval, version heads, or Causal Ledger DAG.

### 4.3 Operation 3: `TruncateAndTransition` (Regime Shift)
```text
TruncateAndTransition(ProcessInterval, PerturbationType, NewConfigDigest, T_event) 
  -> (ClosedInterval, SuccessorInterval, DeterminationCommitPacket)
```
- **Precondition:** External determination or parameter mutation arrives at $T_{\text{event}}$.
- **Postcondition:** 
  1. Closes current interval at $[T_{\text{start}}, T_{\text{event}})$.
  2. Commits intermediate accumulated flux $\Delta \Phi$ via 2PC WAL.
  3. Opens successor interval $[T_{\text{event}}, \text{null})$ under the **same** `RootProcessId` with `RegimeIndex = RegimeIndex + 1n`.

### 4.4 Operation 4: `Terminate` (Boundary Crossing / Exhaustion)
```text
Terminate(ProcessInterval, Reason, FinalState, T_term) 
  -> (ClosedInterval, DeterminationCommitPacket)
```
- **Precondition:** Topological boundary condition met, fuel exhausted, or terminal preemption at $T_{\text{term}} > T_{\text{start}}$.
- **Postcondition:** Closes interval at $[T_{\text{start}}, T_{\text{term}})$. Emits terminating determination carrying final state mutation and total cumulative flux vector.

### 4.5 Operation 5: `Branch` (Copy-on-Write Timeline Split)
```text
Branch(ProcessInterval, TargetTimelineId, T_branch) 
  -> BranchedProcessInterval
```
- **Precondition:** Timeline fork requested at $T_{\text{branch}}$.
- **Postcondition:** Parent interval remains completely immutable in parent timeline. A new process handle is instantiated in `TargetTimelineId` inheriting lineage and $S(T_{\text{branch}})$.

---

## 5. Domain Engine Submission Contracts

Constitutive domain engines (Physics, Biology, Magic, Combat) submit continuous events to the Ledger Gateway through the following contract:

```typescript
export interface IContinuousDomainEngine {
  readonly domainEngineId: string;
  
  // Step integration across interval [t0, t1]
  integrateInterval(
    process: ContinuousProcessInterval,
    untilTime: WorldTimeMicroseconds
  ): ContinuousIntegrationResult;
}

export interface ContinuousIntegrationResult {
  readonly processId: ProcessId;
  readonly evaluatedToTime: WorldTimeMicroseconds;
  
  // All intermediate roots detected within [t0, t1] in chronological order
  readonly detectedBoundaryEvents: ReadonlyArray<DetectedBoundaryEvent>;
  
  // Accumulated flux over the integrated interval
  readonly stepFlux: ReadonlyMap<string, QuantitativeMeasurement>;
  
  // End of step state
  readonly endStateDigest: string;
}

export interface DetectedBoundaryEvent {
  readonly conditionId: string;
  readonly occurrenceCoordinate: WorldTimeMicroseconds;
  readonly topology: ThresholdTopology;
  readonly proposedDetermination: DeterminationCommitPacket;
}
```

---

## 6. Mandatory Falsification Test Suite (Frontier A Battery)

Any engine claiming compliance with Doc 22 must pass these 8 adversarial tests:

1. **`TEST_CONT_1` (Substep & Solver Invariance):**  
   Two solvers (Euler with 10,000 steps vs. RK4 with 500 steps) integrating the same constitutive ballistic trajectory cross the ground plane at the exact same quantized coordinate $T$. The resulting `DeterminationCommitPacket` and attribution reports must be bitwise identical.
2. **`TEST_CONT_2` (Sampling Non-Mutation):**  
   Executing 10,000 raycasts and point samples against an active flying arrow at intermediate coordinates produces zero version increments and zero Ledger DAG nodes.
3. **`TEST_CONT_3` (Multi-Process Path Composition):**  
   An entity propelled by Gravity and Jet Thrust impacts an obstacle. The collision determination receives distinct, typed momentum contributions from Gravity and Jet Thrust, preserving independent provenance.
4. **`TEST_CONT_4` (Tangential Contact Rejection):**  
   A thermal trajectory touching $100.0^\circ\text{C}$ tangentially without crossing is rejected if the contract specified `STRICT_UPWARD_CROSSING`, but accepted if specified `BOUNDARY_ENTER`.
5. **`TEST_CONT_5` (Intermediate Root Completeness):**  
   A particle tunneling through a barrier and exiting within a single integration frame $[T_0, T_1]$ correctly detects both the entry and exit boundary events in strict chronological sequence.
6. **`TEST_CONT_6` (Regime Transition Identity Preservation):**  
   A fire transitioning from wood combustion to oil combustion updates parameters and accumulates flux while preserving `RootProcessId` across the entire causal lineage.
7. **`TEST_CONT_7` (Transactional Interruption Rollback):**  
   An explosion interrupts a continuous charging battery. When the 2PC commit intentionally aborts, the battery accumulator restores its exact pre-interruption state without loss or double-counting.
8. **`TEST_CONT_8` (Instantaneous Cascade Acyclicity):**  
   A zero-duration reaction chain at coordinate $T$ is verified for DAG acyclicity. A cyclic feedback loop at $T$ is rejected with `ERR_UNBOUNDED_INSTANTANEOUS_CASCADE`.
