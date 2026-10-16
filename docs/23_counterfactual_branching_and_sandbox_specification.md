# Everworld 6: Counterfactual Branching & Timeline Sandbox Orchestration Specification (Doc 23)

## 1. Scope, Boundary, and Core Philosophy

This specification defines the formal mechanics for creating, executing, querying, comparing, and archiving **Counterfactual Timelines and Simulation Sandboxes ($\mathcal{W}_{\text{hypothetical}}$)** without permitting hypothetical state to contaminate authoritative history ($\mathcal{W}_{\text{actual}}$).

### 1.1 Non-Invention Directive & Architectural Scoping
The Counterfactual Branching and Sandbox Orchestration layer **MUST NOT** invent physical, biological, cognitive, or magical laws. It provides the formal timeline management, snapshot isolation, intervention injection, and layered causal accounting required to evaluate counterfactual questions (e.g. *"What if the archer had missed?"*, *"Would the reactor have breached without the coolant valve failure?"*) under the immutable authority of the constitutive domain engines.

### 1.2 The Master Invariant of Counterfactual Isolation
$$\text{CF-INV-0 (Counterfactual Isolation Axiom)}$$
> A hypothetical branch $\mathcal{W}_{\text{hypothetical}}$ is a causally, temporally, and epistemically isolated projection. No state mutation, determination commit, continuous flux accumulation, or operational failure occurring within a hypothetical timeline may ever mutate, overwrite, corrupt, or retroactively alter the authoritative actual timeline $\mathcal{W}_{\text{actual}}$.

---

## 2. Core Ontological Primitives & Data Contracts

### 2.1 Timeline Classification, Ancestry & Descriptors

Timelines form a strict, immutable directed tree rooted at $\mathcal{W}_{\text{actual}}$ (`TL_ROOT_0`).

```typescript
import {
  EntityUuid,
  SubsystemPath,
  TimelineId,
  DeterminationId,
  OccurrenceId,
  WorldTimeMicroseconds,
  StateVersion,
  QuantitativeMeasurement,
  SupportNode
} from "./causal";
import { ContinuousProcessInterval, ProcessId } from "./continuous";

export type TimelineClass =
  | "AUTHORITATIVE_ACTUAL"      // The active, authoritative world timeline (TL_ROOT_X)
  | "ARCHIVED_ACTUAL"           // A previously authoritative actual timeline superseded by promotion
  | "HYPOTHETICAL_SANDBOX";     // A branched sandbox for counterfactual inference or agent forecasting

export interface TimelineDescriptor {
  readonly timelineId: TimelineId;
  readonly parentTimelineId: TimelineId | null; // null only for initial genesis root TL_ROOT_0
  readonly branchCoordinate: WorldTimeMicroseconds;
  readonly timelineClass: TimelineClass;
  readonly ancestryDepth: number;
  readonly createdAtHostEpochMs: number;
  readonly rootInterventionDigest: string; // Hash of the intervention specification that seeded this branch
}
```

### 2.2 Formal Taxonomy of Counterfactual Interventions ($do(\mathcal{I})$)

Interventions represent deliberate counterfactual overrides introduced at the branch boundary. Every intervention is typed, explicit, and provenance-tracked.

```typescript
export type InterventionKind =
  | "STATE_CLAMP"               // Overrides a state variable at T_branch
  | "ACTION_SUPPRESSION"        // Prevents an anticipated determination from executing
  | "DETERMINATION_INJECTION"   // Injects a novel determination into the branch ledger
  | "PARAMETER_MODULATION"      // Alters constitutive parameter of an active continuous process
  | "COGNITIVE_OVERRIDE";       // Overrides an agent's internal goal or proposal prior to somatic execution

export interface StateClampIntervention {
  readonly kind: "STATE_CLAMP";
  readonly targetEntity: EntityUuid;
  readonly targetPath: SubsystemPath;
  readonly clampedValue: unknown;
  readonly releaseCondition?: "IMMEDIATE" | "PERMANENT_LOCK" | "RELEASE_AFTER_DURATION";
  readonly lockDurationMicroseconds?: WorldTimeMicroseconds;
}

export interface ActionSuppressionIntervention {
  readonly kind: "ACTION_SUPPRESSION";
  readonly targetDeterminationId: DeterminationId; // Determination in parent timeline to suppress
  readonly suppressionReason: string;
}

export interface DeterminationInjectionIntervention {
  readonly kind: "DETERMINATION_INJECTION";
  readonly injectionPayload: {
    readonly domainEngineId: string;
    readonly supportStructure: SupportNode;
    readonly committedMutations: ReadonlyArray<{
      readonly entityUuid: EntityUuid;
      readonly path: SubsystemPath;
      readonly previousVersion: StateVersion;
      readonly newVersion: StateVersion;
      readonly validFrom: WorldTimeMicroseconds;
      readonly newValueDigest: string;
      readonly canonicalValuePayload: unknown;
    }>;
  };
}

export interface ParameterModulationIntervention {
  readonly kind: "PARAMETER_MODULATION";
  readonly targetProcessId: ProcessId;
  readonly parameterPath: string;
  readonly modulatedValue: unknown;
}

export interface CognitiveOverrideIntervention {
  readonly kind: "COGNITIVE_OVERRIDE";
  readonly agentUuid: EntityUuid;
  readonly overrideGoalDescription: string;
  readonly overrideDecisionPayload: unknown;
}

export type CounterfactualIntervention =
  | StateClampIntervention
  | ActionSuppressionIntervention
  | DeterminationInjectionIntervention
  | ParameterModulationIntervention
  | CognitiveOverrideIntervention;

export interface InterventionSpecificationContract {
  readonly interventionPlanId: string;
  readonly targetTimelineId: TimelineId;
  readonly executionCoordinate: WorldTimeMicroseconds;
  readonly interventions: ReadonlyArray<CounterfactualIntervention>;
  readonly conflictResolutionStrategy: "REJECT_ON_CONFLICT" | "DECLARED_COMPOSITION";
  readonly compositionOperatorId?: string;
  readonly rationale: string;
}
```

### 2.3 Layered Virtual Causal Ledger (Overlay DAG)

A hypothetical branch does not duplicate ancestral ledger storage. It mounts an immutable view of ancestral history up to $T_{\text{branch}}$ and writes all counterfactual determinations to an isolated delta overlay:

$$\mathcal{G}_{TL_{\text{branch}}} = \mathcal{G}_{\text{parent}} \upharpoonright_{t \le T_{\text{branch}}} \;\cup\; \Delta\mathcal{G}_{TL_{\text{branch}}}$$

```typescript
export interface BranchDivergencePoint {
  readonly branchTimelineId: TimelineId;
  readonly parentTimelineId: TimelineId;
  readonly divergenceCoordinate: WorldTimeMicroseconds;
  readonly seedingInterventionDigest: string;
  readonly initialDivergenceDeterminationId: DeterminationId;
}

export interface LayeredLedgerView {
  readonly timelineDescriptor: TimelineDescriptor;
  readonly divergencePoint: BranchDivergencePoint;
  readonly localDeltaDeterminationCount: number;
}
```

---

## 3. The 12 Counterfactual Invariants (CF-INV)

Before any counterfactual timeline is instantiated, executed, or queried, it must satisfy all 12 architectural invariants:

| Invariant | Name | Verification Condition | Error Code |
| :--- | :--- | :--- | :--- |
| **CF-INV-1** | **Parent Immutability** | Branch execution, writes, crashes, or timeouts can never mutate parent timeline state, version heads, or Ledger DAG nodes. | `ERR_PARENT_TIMELINE_MUTATION` |
| **CF-INV-2** | **Namespace Isolation** | All branch identifiers (`DeterminationId`, `StateReference`, `ProcessId`, `OccurrenceId`) are strictly prefixed by `TimelineId`. | `ERR_TIMELINE_NAMESPACE_COLLISION` |
| **CF-INV-3** | **Markov Snapshot Completeness** | Branching inherits the complete multi-domain state closure ($\text{Physical}, \text{Biological}, \text{Cognitive}, \text{Relational}, \text{Institutional}, \text{Processes}$); partial physical-only slices are rejected. | `ERR_INCOMPLETE_MARKOV_SNAPSHOT` |
| **CF-INV-4** | **Ephemeral Ephemera Exclusion** | Uncommitted WAL intents, solver substeps, host caches, and predicted future events are strictly stripped from the branch snapshot. | `ERR_HOST_EPHEMERA_LEAK` |
| **CF-INV-5** | **Continuous Process Branching** | Active continuous processes are split via Doc 22 `Branch`, preserving historical accumulated flux and instantiating branch-isolated process handles. | `ERR_CONTINUOUS_PROCESS_BRANCH_CORRUPTION` |
| **CF-INV-6** | **Intervention Typing & Provenance** | All counterfactual modifications must map to the 5 typed intervention primitives and carry explicit `COUNTERFACTUAL_INTERVENTION` provenance. | `ERR_UNTYPED_INTERVENTION` |
| **CF-INV-7** | **Simultaneous Intervention Determinism** | Conflicting interventions at the identical coordinate must be resolved by a declared composition operator; unresolvable conflicts are rejected immediately. | `ERR_MUTUALLY_EXCLUSIVE_INTERVENTIONS` |
| **CF-INV-8** | **Layered Ledger Overlay** | Branch ledgers are virtual delta overlays over immutable ancestral history; duplicating ancestral DAGs or corrupting ancestral node handles is prohibited. | `ERR_LEDGER_OVERLAY_CORRUPTION` |
| **CF-INV-9** | **Attribution Partitioning** | Actual world attribution and counterfactual marginal necessity are distinct, non-interchangeable report types; actual reports cannot cite branch determinations. | `ERR_ATTRIBUTION_DOMAIN_CONFLATION` |
| **CF-INV-10**| **Epistemic Future Barrier** | A branch can never query or receive parent timeline states or events where $t > T_{\text{branch}}$; future spoilers are strictly rejected. | `ERR_EPISTEMIC_FUTURE_LEAK` |
| **CF-INV-11**| **Operational vs In-World Halts**| Sandbox timeouts, wall-clock limits, and solver non-convergence are operational halts; they must never emit in-world death or destruction occurrences. | `ERR_OPERATIONAL_HALT_AS_OCCURRENCE` |
| **CF-INV-12**| **Promotion via Re-Rooting with Immutable Provenance** | Authoritative history is never retroactively spliced. Promoting a branch archives the old root, creates a new root, and permanently preserves branch lineage metadata. | `ERR_ILLEGAL_TIMELINE_MUTATION` |

---

## 4. Operational Sandbox Lifecycle & Execution Contracts

### 4.1 Sandbox Execution Bounds Contract

A counterfactual simulation sandbox must never run unconstrained:

```typescript
export type SandboxTerminationStatus =
  | "TARGET_CONDITION_SATISFIED" // In-world predicate met (e.g. King survived or died)
  | "HORIZON_REACHED"            // Reached simulated world time boundary
  | "WALL_CLOCK_TIMEOUT"         // Host CPU quota exceeded (Operational halt)
  | "SOLVER_NON_CONVERGENCE"     // Constitutive math failure (Operational halt)
  | "MANUALLY_ABORTED";          // External query cancellation

export interface SandboxExecutionContract {
  readonly sandboxId: string;
  readonly targetTimelineId: TimelineId;
  readonly maxSimulatedMicroseconds: WorldTimeMicroseconds;
  readonly maxRealWallClockMilliseconds: number;
  readonly terminationPredicate?: (timelineId: TimelineId) => boolean;
}

export interface SandboxExecutionResult {
  readonly sandboxId: string;
  readonly timelineId: TimelineId;
  readonly status: SandboxTerminationStatus;
  readonly simulatedDurationMicroseconds: WorldTimeMicroseconds;
  readonly wallClockElapsedMilliseconds: number;
  readonly determinationsCommittedCount: number;
  readonly terminationRationale: string;
}
```

### 4.2 Epistemic Horizon Isolation Contract

To prevent the **Omniscient Leak** (Seam 24):
- The sandbox state store reader enforces an immutable temporal boundary:
  $$\text{MaxAccessibleParentTime} \equiv T_{\text{branch}}$$
- Any attempt by an in-branch domain engine, cognitive model, or agent planning loop to query the parent timeline past $T_{\text{branch}}$ throws `ERR_EPISTEMIC_FUTURE_LEAK`.
- In-branch observations write strictly to branch-local belief deltas ($\Delta\mathcal{B}_{TL_{\text{branch}}}$). The parent belief graph $\mathcal{B}_{\text{actual}}$ is completely read-only.

---

## 5. Timeline Promotion & Permanent Provenance Preservation

### 5.1 The Anti-Splicing Principle
Actual History ($\mathcal{W}_{\text{actual}}$) is strictly append-only. **Retroactive in-place splicing is permanently prohibited.** 

When an administrative authority, player load-game, or narrative engine requests that a counterfactual branch be "made real":

```text
Actual History (Prior to Promotion):
  TL_ROOT_0: [T_0 ──────────── T_branch ──────────── T_now] (Active Authoritative)
                   │
                   └─► TL_SANDBOX_ALPHA: [T_branch ──────────── T_diverged] (Hypothetical)

Actual History (Post Promotion via Re-Rooting):
  TL_ROOT_0: [T_0 ──────────── T_branch ──────────── T_now] (ARCHIVED_ACTUAL - Immutable)
                   │
                   └─► TL_SANDBOX_ALPHA (ARCHIVED_HYPOTHETICAL - Immutable)
                             │
                             ▼ (Administrative Promotion Event)
  TL_ROOT_1: [T_0 ─── TL_ROOT_0 ─── T_branch ─── TL_SANDBOX_ALPHA ─── T_diverged ───►] (NEW Active Authoritative)
```

### 5.2 The Timeline Promotion Record

The promotion creates a brand-new root timeline (`TL_ROOT_{N+1}`). The origin of the new timeline permanently records its counterfactual lineage:

```typescript
export interface TimelinePromotionRecord {
  readonly previousRootTimelineId: TimelineId;     // e.g. "TL_ROOT_0"
  readonly promotedSourceTimelineId: TimelineId;    // e.g. "TL_SANDBOX_ALPHA"
  readonly newActiveRootTimelineId: TimelineId;     // e.g. "TL_ROOT_1"
  readonly promotionCoordinate: WorldTimeMicroseconds;
  readonly divergenceCoordinate: WorldTimeMicroseconds; // T_branch
  readonly promotionDeterminationId: DeterminationId;
  readonly permanentLineageChain: ReadonlyArray<TimelineId>;
  readonly promotionJustification: string;
}
```

- In `TL_ROOT_1`, all determinations prior to $T_{\text{branch}}$ reference `TL_ROOT_0`.
- All determinations between $T_{\text{branch}}$ and $T_{\text{diverged}}$ carry immutable provenance indicating they originated in `TL_SANDBOX_ALPHA` and were ratified into `TL_ROOT_1` via `DET_TIMELINE_PROMOTION`.
- **Historical provenance is permanently auditable.**

---

## 6. Mandatory Falsification Test Suite (Frontier C Battery)

Any engine claiming compliance with Doc 23 must pass these 8 adversarial tests:

1. **`TEST_CF_1` (Parent Immutability & Namespace Isolation):**  
   Executing 500 determinations in `TL_SANDBOX_01` leaves `TL_ROOT_0`'s state version heads, active intervals, and determination count bitwise unchanged. All sandbox determinations carry `TL_SANDBOX_01` prefix.
2. **`TEST_CF_2` (Continuous Process Branch Inheritance):**  
   Branching during an active hemorrhage at $T_{\text{branch}} = 2500\mu\text{s}$ inherits exact accumulated blood loss up to $2500\mu\text{s}$ without restarting or terminating the parent process.
3. **`TEST_CF_3` (Typed Intervention Provenance):**  
   A state clamp ($do(\text{Health} = 100)$) commits an explicit `DET_CF_STATE_CLAMP` carrying `COUNTERFACTUAL_INTERVENTION` provenance. The ledger rejects untyped raw state mutations.
4. **`TEST_CF_4` (Layered Ledger Ancestral Traversal):**  
   An attribution query inside `TL_SANDBOX_01` traces a lineage back through the branch point $T_{\text{branch}}$ to a genesis determination in `TL_ROOT_0` without duplicating the ancestral DAG.
5. **`TEST_CF_5` (Epistemic Future Barrier Enforcement):**  
   An agent inside a branch at $T = 2000\mu\text{s}$ attempting to query parent timeline state at $T = 3000\mu\text{s}$ is blocked with `ERR_EPISTEMIC_FUTURE_LEAK`.
6. **`TEST_CF_6` (Operational Timeout vs World Event):**  
   A runaway sandbox hitting `maxRealWallClockMilliseconds = 50ms` halts cleanly with status `WALL_CLOCK_TIMEOUT`. The branch ledger contains zero artificial death or destruction occurrences.
7. **`TEST_CF_7` (Promotion Re-Rooting & Provenance Persistence):**  
   Promoting `TL_SANDBOX_01` archives `TL_ROOT_0`, opens `TL_ROOT_1`, and logs `DET_TIMELINE_PROMOTION`. All subsequent queries in `TL_ROOT_1` retain auditable lineage to the original sandbox.
8. **`TEST_CF_8` (Simultaneous Conflicting Intervention Rejection):**  
   Injecting $do(X = 5)$ and $do(X = 10)$ at the same coordinate without a declared composition operator is rejected immediately with `ERR_MUTUALLY_EXCLUSIVE_INTERVENTIONS`.
