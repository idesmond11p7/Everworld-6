# Everworld 6: Epistemic Horizon & Subjective Projection Layer Specification (Doc 25)

## 1. Scope, Boundary, and Core Philosophy

This specification establishes the architectural contracts governing the separation between **Authoritative World State**, **Perceptual Apertures**, and **Subjective Belief Graphs**.

### 1.1 The Tripartite Epistemic Axiom
$$\text{EPIST-INV-1 (Tripartite Epistemic Non-Identity)}$$
$$\mathbf{Authoritative\ World\ State\ (\mathcal{W})}\quad \not\equiv\quad \mathbf{Perceptual\ Aperture\ (\mathcal{A})}\quad \not\equiv\quad \mathbf{Belief/Memory\ Graph\ (\mathcal{B})}$$

1. **Authoritative World State ($\mathcal{W}$):** The omniscient, physically complete, objectively true state of all entities, timelines, and continuous processes, managed by the 2PC Commit Gateway and State Store (`Docs 21–24`).
2. **Perceptual Aperture ($\mathcal{A}$):** The physical and sensory filter modeling line-of-sight, distance attenuation, medium occlusion, ambient interference, and somatic sense organ health. It projects degraded, observer-relative stimuli.
3. **Belief / Memory Graph ($\mathcal{B}$):** The local, subjective, fallible cognitive network of beliefs, hypotheses, and recollections maintained by an individual agent.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. AUTHORITATIVE WORLD STATE (Omniscient Physical Reality)                  │
│    - Versioned paths, continuous intervals, exact causal DAG                │
│    - INACCESSIBLE to in-world agents, dialogue loops, and narrative LLMs    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Physical Stimulus Emission (Photons, Waves)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. PERCEPTUAL APERTURE (Observer-Specific Sensory Filter)                   │
│    - Occlusion, distance, noise, illumination, sensory organ acuity         │
│    - Degrades ground truth into ambiguous, estimated epistemic tokens       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Perceptual Ingress Occurrence
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. BELIEF / MEMORY GRAPH (Subjective Cognitive Representation)               │
│    - Fallible, bounded, unconfident, open-world tri-state logic             │
│    - Bounded RAG vector spaces, modality typing, confidence attenuation     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Epistemic Context Assembly
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. SUBJECTIVE ACTION & NARRATIVE (In-World Agency & Dialogue)               │
│    - Action proposals emitted using perceived identity tokens               │
│    - LLM dialogue & prose bound strictly to first-person epistemic horizon  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Ontological Objects & Data Contracts

### 2.1 Perceptual Aperture & Stimulus Carriers

Information propagates strictly via physically grounded carriers. Instantaneous state sniffing across containers or rooms is banned (Seam B-02, B-19).

```typescript
import {
  EntityUuid,
  SubsystemPath,
  TimelineId,
  DeterminationId,
  OccurrenceId,
  WorldTimeMicroseconds,
  SupportNode
} from "./causal";

export type SensoryModality =
  | "VISUAL_PHOTONIC"
  | "ACOUSTIC_PRESSURE"
  | "OLFACTORY_CHEMICAL"
  | "SOMATOSENSORY_TACTILE"
  | "THERMAL_RADIATION";

export interface EpistemicEstimate<T> {
  readonly estimatedValue: T;
  readonly confidence: number;         // 0.0 (pure speculation) to 1.0 (certain)
  readonly marginOfError?: number;     // e.g. distance = 15m ± 4m
  readonly resolutionQuality: "HIGH" | "MEDIUM" | "DEGRADED" | "AMBIGUOUS_NOISE";
}

export interface SensoryStimulusPayload {
  readonly stimulusId: string;
  readonly emittingOccurrenceId: OccurrenceId;
  readonly modality: SensoryModality;
  readonly spatialOrigin: { readonly x: number; readonly y: number; readonly z: number };
  readonly signalToNoiseRatio: number; // 0.0 to 1.0
  readonly perceivedAttributes: ReadonlyMap<string, EpistemicEstimate<unknown>>;
}

export interface PerceptualApertureReceipt {
  readonly receiptId: string;
  readonly observerUuid: EntityUuid;
  readonly timestamp: WorldTimeMicroseconds;
  readonly stimuliReceived: ReadonlyArray<SensoryStimulusPayload>;
}
```

### 2.2 Subjective Belief Graph & Epistemic Modality Typing

To eliminate the **Speculation Escalation Feedback Loop (Seam B-28, B-36)**, every belief node carries an immutable modality tag that governs confidence limits and prohibits self-promotion:

```typescript
export type EpistemicModality =
  | "FIRST_HAND_SENSORY"      // Directly witnessed via perceptual aperture
  | "SECOND_HAND_TESTIMONY"    // Heard from another agent via dialogue relay
  | "DOCUMENTARY_RECORD"       // Read from an in-world book/scroll/tablet
  | "INDUCTIVE_INFERENCE"      // Deduced by cognitive reasoning engine
  | "UNVERIFIED_SPECULATION";  // Self-generated guess or LLM hypothesis

export type TriStateTruth =
  | "KNOWN_TRUE"
  | "KNOWN_FALSE"
  | "UNKNOWN";                // Open-world ignorance; NEVER collapsed to false

export interface SubjectiveBeliefNode {
  readonly beliefId: string;
  readonly agentUuid: EntityUuid;
  readonly subjectIdentityToken: string; // e.g. "PERCEIVED_MASKED_FIGURE_01" (Opaque handle)
  readonly assertedPath: SubsystemPath;
  readonly beliefValue: unknown;
  readonly epistemicStatus: TriStateTruth;
  readonly modality: EpistemicModality;
  readonly confidence: number;           // Capped strictly by modality constraints
  readonly acquiredAtTimestamp: WorldTimeMicroseconds;
  
  // Provenance links
  readonly supportingReceiptId?: string; // Links to PerceptualApertureReceipt if sensory
  readonly premiseBeliefIds?: ReadonlyArray<string>; // Links to ancestor beliefs if inferred
  readonly sourceAgentToken?: string;    // If testimony
  readonly transmissionHops: number;     // 0 for first-hand, increments per relay
}
```

### 2.3 Epistemic Prompt Context Bundle

Unprivileged narrative generators and LLM prompt assemblers consume only compiled subjective bundles (Seams B-11, B-12):

```typescript
export interface SubjectiveAgentContextBundle {
  readonly agentEpistemicToken: string;
  readonly timelineId: TimelineId;
  readonly currentObserverCoordinate: WorldTimeMicroseconds;
  readonly activeSensoryAperture: PerceptualApertureReceipt;
  readonly localBeliefSubset: ReadonlyArray<SubjectiveBeliefNode>;
  readonly dialogueMemory: ReadonlyArray<{
    readonly speakerToken: string;
    readonly text: string;
    readonly perceivedTimestamp: WorldTimeMicroseconds;
  }>;
}
```

---

## 3. The 15 Epistemic Invariants (EPIST-INV)

Before any subjective projection is served or any belief update is committed, the Epistemic Gateway enforces all 15 invariants:

| Invariant | Name | Verification Condition | Error Code |
| :--- | :--- | :--- | :--- |
| **EPIST-INV-1** | **Tripartite Non-Identity** | $\mathcal{W} \neq \mathcal{A} \neq \mathcal{B}$. Direct access to `IStateStoreReader` by unprivileged consumers is structurally impossible. | `ERR_EPISTEMIC_IDENTITY_COLLAPSE` |
| **EPIST-INV-2** | **Physical Stimulus Propagation** | Information propagates strictly via physical carriers (`Photonic`, `Acoustic`, etc.); instant magical telepathy or state sniffing is banned. | `ERR_UNPHYSICAL_INFORMATION_PROPAGATION` |
| **EPIST-INV-3** | **Opaque Subjective Tokens** | Authoritative UUIDs, ledger IDs, and hash digests are stripped and mapped to observer-local epistemic handles. | `ERR_AUTHORITATIVE_METADATA_LEAK` |
| **EPIST-INV-4** | **Temporal Observer Clamping** | An observer cannot query or perceive any state or occurrence where $T > T_{\text{observer\_current\_coordinate}}$. | `ERR_TEMPORAL_EPISTEMIC_VIOLATION` |
| **EPIST-INV-5** | **Objective vs Subjective Attribution** | Objective Ledger attribution is platform-internal; agent reasoning operates strictly on subjective epistemic inference. | `ERR_OBJECTIVE_ATTRIBUTION_LEAK` |
| **EPIST-INV-6** | **Occlusion & Horizon Pruning** | Closed containers and occluded geometries are strictly pruned from sensory projections. | `ERR_OCCLUSION_PRUNING_BYPASS` |
| **EPIST-INV-7** | **Perspective-Bound Narrative** | Narrative generation binds strictly to a declared observer perspective (`FIRST_PERSON` or `THIRD_PERSON_LIMITED`). | `ERR_NARRATIVE_PERSPECTIVE_BREACH` |
| **EPIST-INV-8** | **Degraded & Ambiguous Representation** | Low-signal stimuli must produce degraded, uncertain estimates; ground truth cannot be synthesized from noise. | `ERR_FALSE_CERTAINTY_INJECTION` |
| **EPIST-INV-9** | **Tri-State Epistemic Logic** | Missing beliefs resolve strictly to `UNKNOWN`; collapsing ignorance into `FALSE` is prohibited. | `ERR_UNKNOWN_FALSE_COLLAPSE` |
| **EPIST-INV-10**| **Epistemic RAG Partitioning** | Vector embedding stores are strictly partitioned by `AgentUuid`; global lore sniffing is structurally impossible. | `ERR_GLOBAL_LORE_SNIFFING` |
| **EPIST-INV-11**| **Unidirectional Physical Causality** | Beliefs cannot serve as input states to physical transitions; beliefs can only cause cognitive updates or action proposals. | `ERR_BELIEF_AS_PHYSICAL_CAUSE` |
| **EPIST-INV-12**| **Epistemic Modality Conservation** | Internal speculation cannot promote itself to first-hand observation; synthesized beliefs inherit the weakest premise modality. | `ERR_MODALITY_ESCALATION` |
| **EPIST-INV-13**| **Confidence Attenuation on Inference** | Deductive/inductive inferences incur compounding confidence penalties; ungrounded hyper-deduction is rejected. | `ERR_UNBOUNDED_HYPER_DEDUCTION` |
| **EPIST-INV-14**| **Epistemic Cache Keying** | Host prompt and KV caches must incorporate `AgentUuid` and `TimelineId` into cache keys; cross-observer leakage is banned. | `ERR_CROSS_OBSERVER_CACHE_LEAK` |
| **EPIST-INV-15**| **Subjective Identity Decoupling** | Action proposals and institutional rules evaluate against perceived identity tokens, not hidden authoritative UUIDs. | `ERR_AUTHORITATIVE_IDENTITY_SHORTCUT` |

---

## 4. Operational Ingress & Projection Interfaces

### 4.1 Subjective Projection Reader Interface
The sole API surface available to agents, NPCs, and prompt constructors:

```typescript
export interface ISubjectiveProjectionReader {
  // Query what an agent currently perceives
  getSensorySnapshot(
    observerUuid: EntityUuid,
    currentCoordinate: WorldTimeMicroseconds
  ): PerceptualApertureReceipt;

  // Query what an agent believes (Tri-state evaluation)
  queryBelief(
    observerUuid: EntityUuid,
    targetToken: string,
    subsystemPath: SubsystemPath
  ): SubjectiveBeliefNode | { readonly epistemicStatus: "UNKNOWN" };

  // Assemble bounded context bundle for LLM dialogue / action planning
  compileSubjectiveContext(
    observerUuid: EntityUuid,
    currentCoordinate: WorldTimeMicroseconds,
    retrievalQuery?: string
  ): SubjectiveAgentContextBundle;
}
```

### 4.2 Belief Revision Gateway
When an agent cognitive loop updates its internal beliefs, it must submit a valid determination citing verified provenance:

```typescript
export interface BeliefUpdateSubmission {
  readonly agentUuid: EntityUuid;
  readonly proposedBeliefs: ReadonlyArray<SubjectiveBeliefNode>;
  readonly provenanceReceiptId?: string; // Must link to valid PerceptualApertureReceipt if sensory
  readonly derivationRationale?: string;
  readonly timestamp: WorldTimeMicroseconds;
}
```

The gateway validates that sensory claims match logged receipts and enforces modality conservation (`EPIST-INV-12`) before committing to the agent's `cognitive.beliefs` path in the State Store.

---

## 5. Mandatory Falsification Test Suite (Frontier B Battery)

Any implementation claiming compliance with Doc 25 must pass these 8 adversarial regression tests:

1. **`TEST_EPIST_1` (Zero Direct State Store Access):**  
   An in-world agent script attempting to query `IStateStoreReader` or `ICausalLedger` is denied at the type level and API security gateway.
2. **`TEST_EPIST_2` (Occlusion & Container Sniffing Rejection):**  
   An agent standing in front of a closed iron chest queries its sensory aperture. The returned projection contains the chest but zero representation of the gold amulet inside.
3. **`TEST_EPIST_3` (Authoritative Token Stripping):**  
   An assassination occurrence is projected to a bystander. The resulting `SensoryStimulusPayload` contains opaque token `"UNIDENTIFIED_HUMANOID_01"`; the assassin's true `EntityUuid` is nowhere in the payload.
4. **`TEST_EPIST_4` (Tri-State Logic vs. False Collapse):**  
   Querying whether a stranger is carrying a weapon when no observation has occurred returns `UNKNOWN`. Passing this to agent planning does not trigger "unarmed" behavior.
5. **`TEST_EPIST_5` (Epistemic RAG Isolation):**  
   Executing a vector semantic query on behalf of Agent Bob fails to match or return any chunks from Agent Alice's private diary or global lore documents.
6. **`TEST_EPIST_6` (Speculation Modality Conservation):**  
   An agent generates an `UNVERIFIED_SPECULATION` belief. Feeding this belief through multiple cognitive reflection cycles leaves its modality locked as `UNVERIFIED_SPECULATION` and its confidence capped at $\le 0.5$.
7. **`TEST_EPIST_7` (Derived Fact Modality Downgrade):**  
   Synthesizing a new belief from a `FIRST_HAND_SENSORY` premise and a `SECOND_HAND_TESTIMONY` premise forces the derived belief's modality to `INDUCTIVE_INFERENCE` with compounded confidence attenuation.
8. **`TEST_EPIST_8` (Cross-Observer Prompt Cache Keying):**  
   Two sequential LLM generation requests with identical prompt prefixes but different `AgentUuid`s produce disjoint cache keys, preventing KV attention head contamination.
