# Everworld 6: Constitutive Domain Engine Contracts (Doc 24)

## 1. Scope, Boundary, and Core Philosophy

This specification establishes the authoritative boundary between the **Everworld Platform Core** (Causal Ledger, 2PC Commit Gateway, Attribution Engine, Timeline Sandbox) and the **Constitutive Domain Engines** (Combat, Somatics/Biology, Spatial/Kinematics, Magic/Energy, Economics, Institutional Systems, Cognitive/Psychology).

### 1.1 The Fundamental Authority Division: Admissibility vs. Substantive Truth
$$\text{CDE-INV-1 (Structural Admissibility vs. Substantive Truth)}$$
> The Everworld Platform Core validates **Structural Admissibility**: schema conformity, version-head monotonicity, graph acyclicity, timeline isolation, capability authorization, and declared conservation balance.
> The Constitutive Domain Engine holds exclusive authority over **Substantive Truth**: whether a given kinetic force fractures bone, whether a spell depletes mana, or whether an economic transaction clears is certified solely by the domain engine's constitutive model specification. The Core never adjudicates physical, biological, or magical truth.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSTITUTIVE DOMAIN ENGINES (Physics, Biology, Magic, Institutions)         │
│  - Owns domain laws, differential equations, formulas, and constitutive logic│
│  - Evaluates action proposals against physical/domain invariants             │
│  - Generates DeterminationCommitPackets with typed quantitative measurements │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Submits Packets
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2PC COMMIT GATEWAY & CORE LEDGER (Everworld Core)                           │
│  - Validates Capability Contracts (Owned write paths, capability tokens)    │
│  - Enforces Structural Invariants (INV-1 through INV-13, CIA, CF-INV)       │
│  - Executes 2PC WAL Transaction (Intent -> Dual Write -> Commit/Abort)      │
│  - Strips host ephemera; guarantees cross-platform determinism & provenance │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Ontological Primitives & Registration Contracts

### 2.1 Capability-Based Engine Registration (`DomainEngineCapabilityContract`)

To prevent path squatting (Seam 4) and unauthorized cross-domain mutation (Seam 5), an engine must register an immutable Capability Contract prior to submitting determinations:

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
  SupportNode,
  DeterminationCommitPacket
} from "./causal";

export type DomainEngineId = string; // e.g. "EVERWORLD.BIOLOGY.SOMATICS_v2"

export interface DomainEngineCapabilityContract {
  readonly domainEngineId: DomainEngineId;
  readonly semanticVersion: string;
  
  // Explicitly owned write paths (Wildcards '*' are strictly prohibited)
  readonly ownedWritePaths: ReadonlyArray<SubsystemPath>;
  
  // Declared observable read paths
  readonly observableReadPaths: ReadonlyArray<SubsystemPath>;
  
  // Supported constitutive formulas and parameters
  readonly registeredFormulaDigests: ReadonlyArray<string>;
  
  // Declared conservation laws (if applicable, e.g. "FIRST_LAW_THERMODYNAMICS")
  readonly declaredBalanceContractId?: string;
  
  // Composition operator (if co-owning paths with other engines)
  readonly declaredCompositionOperatorId?: string;
}
```

### 2.2 Constitutive Model Identity & Provenance
Every determination must record an immutable model identity so that historical replay and forensic audits remain reproducible regardless of future engine code updates (Seams 6, 17, 27):

```typescript
export interface ConstitutiveModelIdentity {
  readonly domainEngineId: DomainEngineId;
  readonly semanticVersion: string;
  readonly formulaDigest: string;    // SHA-256 of canonical formula AST or symbolic expression
  readonly parameterDigest: string;  // SHA-256 of governing constant coefficients
  readonly prngSeedDigest?: string;  // Derived PRNG seed if stochastic logic was evaluated
}

export interface EngineSubmissionProvenance {
  readonly modelIdentity: ConstitutiveModelIdentity;
  readonly executingHostToken: string; // Authenticated token certifying engine authority
  readonly submissionTimestampMicros: WorldTimeMicroseconds;
}
```

### 2.3 Cross-Domain Causal Relay (`OccurrenceRelayContract`)
Direct mutation of external domains is strictly prohibited (Seam 5). Cross-domain reactions must execute through explicit intermediate occurrences:

```typescript
export interface CrossDomainOccurrenceRelay {
  readonly sourceOccurrenceId: OccurrenceId;
  readonly sourceDomainEngineId: DomainEngineId;
  readonly targetDomainEngineId: DomainEngineId;
  readonly targetEntityUuid: EntityUuid;
  readonly transmittedMeasurements: ReadonlyMap<string, QuantitativeMeasurement>;
  readonly relayCoordinate: WorldTimeMicroseconds;
}
```

---

## 3. The 15 Constitutive Domain Engine Invariants (CDE-INV)

Before any packet from a domain engine is committed by the 2PC Gateway, it must satisfy all 15 constitutive domain engine invariants:

| Invariant | Name | Verification Condition | Error Code |
| :--- | :--- | :--- | :--- |
| **CDE-INV-1** | **Structural Admissibility vs Substantive Truth** | Core validates structural legality and contract schemas; domain engines certify constitutive physical/domain truth. | `ERR_SCHEMA_OR_STRUCTURAL_INVALID` |
| **CDE-INV-2** | **Capability-Based Path Ownership** | Engines can mutate only declared, registered write paths. Wildcards (`*`) are strictly prohibited. | `ERR_UNAUTHORIZED_PATH_MUTATION` |
| **CDE-INV-3** | **Cross-Domain Causal Relays** | Direct cross-domain mutation is prohibited; cross-domain consequences must execute via explicit intermediate occurrence relays. | `ERR_CROSS_DOMAIN_DIRECT_MUTATION` |
| **CDE-INV-4** | **Declared Shared Path Composition** | Paths receiving contributions from multiple engines must be governed by a registered synthesizer engine and composition operator. | `ERR_UNMANAGED_PATH_CONTENTION` |
| **CDE-INV-5** | **Constitutive Model Immutability** | Determinations bind to immutable `FormulaDigest` and `ParameterDigest`; historical entries are never reinterpreted by code updates. | `ERR_UNREGISTERED_MODEL_VERSION` |
| **CDE-INV-6** | **Canonical Numerical Determinism** | Boundary decisions must use fixed-point or canonical cross-platform floating-point specifications; host precision drift is prohibited. | `ERR_HOST_PRECISION_NON_DETERMINISM` |
| **CDE-INV-7** | **Host Concurrency Ephemera Stripping** | Thread IDs, memory addresses, GPU contexts, and host execution schedules are strictly excluded from determination packets. | `ERR_HOST_EPHEMERA_LEAK` |
| **CDE-INV-8** | **Minimal Support Pruning** | Support structures must declare only necessary and sufficient determinants; unreferenced global state references are rejected. | `ERR_SUPPORT_STRUCTURE_BLOAT` |
| **CDE-INV-9** | **Continuous/Discrete Flux Handover** | Discrete impacts on integrating entities must execute transactional regime interruptions, preventing flux loss or duplication. | `ERR_FLUX_HANDOVER_VIOLATION` |
| **CDE-INV-10**| **Head Freshness & Dependency Invalidation** | Consumed states must be active and valid at the packet coordinate; stale input submissions are rejected. | `ERR_STALE_INPUT_CONSUMPTION` |
| **CDE-INV-11**| **Action Ingress Isolation** | Player, LLM, network, and host inputs enter as unprivileged Action Proposals, never direct state mutations. | `ERR_UNPRIVILEGED_INPUT_MUTATION` |
| **CDE-INV-12**| **Fail-Closed on Unregistered Interaction** | Unmodeled or uncontracted cross-entity interactions must fail closed (fizzle/abort), never guess or forge state. | `ERR_UNREGISTERED_INTERACTION_FORMULA` |
| **CDE-INV-13**| **Deterministic Seeding & RNG Isolation**| Stochastic domain logic must derive seeds from state digests and world coordinates; host clock RNG is prohibited. | `ERR_UNSEEDED_HOST_ENTROPY` |
| **CDE-INV-14**| **Engine Lifecycle Infrastructure Isolation**| Engine registration, suspension, and replacement are operational events, strictly excluded from the world Causal Ledger. | `ERR_OPERATIONAL_EVENT_IN_LEDGER` |
| **CDE-INV-15**| **Composite Multi-Engine Atomicity** | Cross-domain multi-engine transactions commit or abort as an atomic group via 2PC WAL; partial truth is rejected. | `ERR_COMPOSITE_TRANSACTION_FAILED` |

---

## 4. Submission & Ingress Interfaces

### 4.1 Unprivileged Action Ingress Interface
External entities (human players, LLM agents, network packets, ambient sensors) cannot mutate world state directly. They must submit an `ActionProposal`:

```typescript
export interface ActionProposal {
  readonly proposalId: string;
  readonly originatingAgentUuid?: EntityUuid;
  readonly intendedActionKind: string;        // e.g. "MELEE_SWING_SWORD", "CAST_FIREBALL"
  readonly targetEntities: ReadonlyArray<EntityUuid>;
  readonly proposedParameters: Record<string, unknown>;
  readonly clientSubmissionCoordinate: WorldTimeMicroseconds;
}
```

### 4.2 Constitutive Domain Engine Interface
Every engine implements the formal domain submission contract:

```typescript
export interface IConstitutiveDomainEngine {
  readonly capabilityContract: DomainEngineCapabilityContract;
  
  // Evaluate an action proposal or occurrence relay
  evaluateProposal(
    proposal: ActionProposal,
    accessibleState: IStateStoreReader,
    currentCoordinate: WorldTimeMicroseconds
  ): EngineEvaluationResult;

  // Process a cross-domain occurrence relay (e.g. Kinetic Force delivered to Flesh)
  processOccurrenceRelay(
    relay: CrossDomainOccurrenceRelay,
    accessibleState: IStateStoreReader
  ): EngineEvaluationResult;
}

export type EngineEvaluationResult =
  | { readonly status: "COMMITTED_PROPOSAL"; readonly packet: DeterminationCommitPacket; readonly downstreamRelays?: ReadonlyArray<CrossDomainOccurrenceRelay> }
  | { readonly status: "REJECTED_INEFFECTIVE"; readonly rationale: string; readonly fizzleOccurrence?: OccurrenceId }
  | { readonly status: "FAILED_ERROR"; readonly errorCode: string; readonly details: string };
```

### 4.3 Composite Multi-Engine Transaction (`CompositeCommitGroup`)
For complex events involving multiple engines (e.g. Explosion: Kinematics + Heat + Somatics), the engines coordinate under a composite transaction group (Seam 24):

```typescript
export interface CompositeCommitGroup {
  readonly transactionGroupId: string;
  readonly executionCoordinate: WorldTimeMicroseconds;
  readonly participatingEngineIds: ReadonlyArray<DomainEngineId>;
  readonly memberPackets: ReadonlyArray<DeterminationCommitPacket>;
  readonly declaredBalanceChecks?: ReadonlyArray<{
    readonly dimension: string;
    readonly expectedNetSum: number;
    readonly tolerance: number;
  }>;
}
```

The 2PC Gateway reserves all `memberPackets` under a single atomic WAL intent. If any engine's packet fails structural validation, the entire composite transaction is aborted.

---

## 5. Mandatory Falsification Test Suite (Frontier D Battery)

Any engine integration claiming compliance with Doc 24 must pass these 8 adversarial tests:

1. **`TEST_CDE_1` (Path Squatting Rejection):**  
   A Magic engine packet attempting to mutate `somatic.health` without declared ownership fails pre-flight validation with `ERR_UNAUTHORIZED_PATH_MUTATION`.
2. **`TEST_CDE_2` (Cross-Domain Occurrence Relay):**  
   An arrow impact (Combat) does not mutate target health; it emits an occurrence and kinetic measurement. The Somatics engine consumes the occurrence and commits tissue damage in a distinct, causally linked determination.
3. **`TEST_CDE_3` (Multi-Engine Composite Atomicity):**  
   In a 3-engine explosion transaction (Spatial, Chemistry, Biology), an injected failure in the Biology packet cleanly rolls back the Spatial wall damage and Chemistry fire ignition via 2PC WAL abort.
4. **`TEST_CDE_4` (Stale Input Invalidation):**  
   An AI planning engine submits an action evaluated against state `@v5`. If state was mutated to `@v6` prior to the submission timestamp, the packet is rejected with `ERR_STALE_INPUT_CONSUMPTION`.
5. **`TEST_CDE_5` (Host Ephemera Stripping):**  
   A packet submitted with host worker thread IDs and memory pointers has all host ephemera stripped by the Gateway before logging into the Causal Ledger.
6. **`TEST_CDE_6` (Model Identity & Digest Immutability):**  
   A determination committed under `FormulaDigest: ABC` is verified. Altering the engine's current code does not alter or re-evaluate the historical ledger entry.
7. **`TEST_CDE_7` (Deterministic PRNG Stream):**  
   A combat engine evaluating critical strikes uses the state-derived seed. Two identical runs produce bitwise identical critical hit determinations across different host CPU architectures.
8. **`TEST_CDE_8` (Fail-Closed on Unregistered Interactions):**  
   A spell cast on an unmodeled exotic matter type fails closed (`REJECTED_INEFFECTIVE` with `OCC_SPELL_FIZZLE`), rather than inventing unverified physical state.
