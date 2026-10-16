# Everworld 6: Formal Conceptual Structure of the Digital Twin Substrate

## 1. Executive Summary

This document establishes the formal conceptual ontology of the **Dragon x Deus: Everworld 6** Digital Twin Substrate. Every concept, boundary, and relationship defined here is derived strictly from:
1. The locked **Definitive Behavioral & Epistemic Contract** (`/docs/10_definitive_behavioral_contract.md`).
2. The locked **Minimum Computational Substrate Derivation** (`/docs/11_minimum_computational_substrate.md`).
3. The locked foundational decisions on **Q1 (Hybrid State/Ledger)**, **Q2 (Seeded Mechanical Determinism)**, and **Q3 (Tripartite Epistemic Model)**.

This is a pure conceptual specification. It contains zero programming languages, databases, framework classes, or technical syntax.

---

## 2. The 11 Core Conceptual Primitives

### 1. Concept: ENTITY
An **Entity** is an individual locus of continuous identity, physical presence, and state within Everworld.

#### Entity Subtypes:
1. **Animate Agent Entity:** Possesses the complete 4-layer stack:
   * **Lineage Anchor (Identity):** The immutable causal root of the entity. Persists across body destruction, reincarnation, species change, or total memory wipe (`R-S-1`, `R-W-2`).
   * **Somatic Vessel (Physical Body):** The material vehicle currently occupied, with mass, fatigue, chemical states, and physical injuries situated in a Space.
   * **Psychological Vector:** Internal affective baseline, active acute stress, drives, and moral thresholds.
   * **Epistemic Model:** Subjective beliefs, perceptual horizon, and salient memory graph.
2. **Inanimate / Artifact Entity:** Possesses Lineage Anchor + Physical Structure (material composition, mass, durability, current damage state, containment capacity, spatial location), with null psychological and epistemic vectors.

#### Exclusion Test:
*If the concept of Entity were removed or collapsed into a raw string prompt, the system would lose the ability to track persistent bodily injuries, object durability, asymmetric beliefs, and continuous moral consequences across time skips (`R-W-1`, `R-W-2`, `R-S-1`).*

---

### 2. Concept: SPACE & APERTURES
A **Space** is a bounded topological domain that contains entities and artifacts, and defines the medium through which physical forces, movement, and sensory signals propagate.

#### Conceptual Mechanics:
1. **Containment & Boundaries:** Spaces contain entities and objects.
2. **Apertures & Portals (Connectivity):** Spaces connect to other spaces via Apertures (open air, wooden doors, stone archways, narrow grates) characterized by an explicit **Transmission Coefficient Matrix**:
   $$\mathbf{T}_{\text{aperture}} = \begin{bmatrix} T_{\text{visual}} \\ T_{\text{acoustic}} \\ T_{\text{olfactory}} \\ T_{\text{physical}} \end{bmatrix} \quad \text{where } T \in [0.0, 1.0]$$
   *(Example: A closed solid oak door has $T_{\text{vis}} = 0.0$, $T_{\text{acous}} = 0.15$, $T_{\text{olf}} = 0.05$, $T_{\text{phys}} = 0.0$. An open archway has $T = 1.0$ across all channels.)*
3. **Sensory Attenuation:** When an event generates energy in Space $A$, the signal propagates into adjacent Space $B$ scaled by $\mathbf{T}_{\text{aperture}}$ and spatial distance, preventing information leaks (`R-W-1`).

#### Exclusion Test:
*If Space and Apertures were removed, the system could not mathematically compute whether sound or light reaches an entity in an adjacent room, destroying Epistemic Isolation (`R-W-1`) and proximity promotion (`R-D16-2`).*

---

### 3. Concept: WORLD STATE
The **World State** is the comprehensive, authoritative ground-truth record of all currently existing properties across the 7 domains at world time $T_w$.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHORITATIVE WORLD STATE                         │
├──────────────────────────┬──────────────────────────────────────────────────┤
│ 1. Physical Truth        │ Spatial topology, object positions, structural   │
│                          │ integrity, weather, lighting, physical damage.   │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 2. Biological Truth      │ Tissue status, blood volume, stamina, chemical   │
│                          │ states, life/death status of all somatic bodies. │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 3. Psychological Truth   │ Actual current emotional load, active acute      │
│                          │ stress levels, internal drive priorities.        │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 4. Epistemic Truth       │ What each entity actually believes and knows     │
│                          │ (even when those beliefs contradict physical truth).│
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 5. Relational Truth      │ The objective matrix of active vows, legal debts,│
│                          │ formal pacts, and mutual historical interactions. │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 6. Process Truth         │ In-flight rates, active background progressions, │
│                          │ and scheduled causal timers.                     │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 7. Institutional Truth   │ Faction territories, formal laws, systemic ranks.│
└──────────────────────────┴──────────────────────────────────────────────────┘
```

#### Exclusion Test:
*If World State were removed, the simulation would have no external benchmark to validate actions against, causing all physical consequences to decay into unconstrained narrative improvisation (`R-S-1`, `R-W-2`, `R-W-3`).*

---

### 4. Concept: CAUSAL EVENT & THE IMMUTABLE LEDGER
A **Causal Event** is an atomic, irreversible historical occurrence at a specific world timestamp $T_w$ that transforms prior World State into a new World State.

#### The Lifecycle of an Event:
```
[1. Cause / Trigger] ──► [2. Action Attempt] ──► [3. Validation & Arbitration]
                                                           │
                                                           ▼
[6. Ledger Append] ◄── [5. Atomic State Delta Commit] ◄── [4. Resolved Event]
```

#### The Causal Ledger Record:
Every committed event permanently records:
* **Timestamp ($T_w$):** Exact world time of occurrence.
* **Actor & Target Lineages:** Which entities or environmental forces were involved.
* **Admissible Cause:** The prior event, process, or external command that triggered this event.
* **State Delta ($\Delta S$):** The exact property mutations applied to World State.
* **Emitted Signals:** The sensory disturbances generated in the local Space.

#### Exclusion Test:
*If the Causal Event and Ledger were removed, the system could not perform deterministic replay, audit historical consequences, or fulfill transactional atomicity (`R-S-2`, `Q1 Decision`).*

---

### 5. Concept: PROCESS
A **Process** is a continuous, time-dependent transformation of state properties that progresses over a duration $[T_{\text{start}}, T_{\text{end}}]$ according to an explicit dynamic function class, dependency set, and interruption condition.

#### Conceptual Mechanics:
1. **State-Transition Function Class:** Processes do not rely on naive linear math; they map state forward through domain-appropriate closed-form or numerical curves:
   $$\text{State}(T + \Delta t) = \Phi\Big(\text{State}(T), \mathbf{P}_{\text{env}}, \Delta t\Big)$$
   *(e.g., logistic tissue recovery, exponential thermal cooling, or piecewise waypoint navigation).*
2. **Interruption Invariant:** A process runs continuously until either (A) it reaches completion time $T_{\text{end}}$, or (B) a Causal Event violates its prerequisite conditions (e.g. a healing process is interrupted when the entity takes new damage).
3. **Lazy Analytical Resolution:** When world time advances by $\Delta t$ during low-fidelity dormancy, the engine evaluates $\Phi$ analytically without running token generation loops (`R-D16-1`).

#### Exclusion Test:
*If Process were removed, the system would fail Dimension 16 (`R-D16-1`) and non-dialogue time skips (`R-W-4`), either freezing the universe during sleep/travel or burning infinite compute simulating every second.*

---

### 6. Concept: EPISTEMIC MODEL (Tripartite Cognition)
The formal mechanism governing how an entity observes, believes, remembers, and revises its subjective reality.

```
                  [1. OBJECTIVE WORLD TRUTH]
                              │
                              ▼ (Filtered by Space Boundaries & Aperture Matrix)
                  [2. PERCEPTUAL EVENT]
                  "Loud metallic crash in dark corridor"
                              │
                              ▼ (Epistemic Integration Function Ψ)
                  [3. BELIEF UPDATE & STATE]
                  "Entity B is under attack by armed guards"
                  (May be objectively true, false, or uncertain)
                              │
                              ▼ (Consolidated over Time)
                  [4. SALIENT MEMORIES]
                  Episodic recall available for future cognition
```

#### Foundational Invariants of the Epistemic Model:
1. **Separation of Truth and Belief:** An entity's `BeliefState` is stored in the entity's epistemic domain. It can directly contradict `PhysicalTruth` without breaking engine consistency (`Q3 Decision`).
2. **Belief Inertia:** A false belief persists indefinitely until new evidence, testimony, or inference forces an update.
3. **Epistemic Integration Function:** Beliefs are updated through an explicit integration operator:
   $$\text{Belief}_{t+1} = \Psi\Big(\text{Belief}_t, \text{PerceptualEvent}, \text{Testimony}, \text{Inference}, \text{AffectiveFilter}\Big)$$
   Direct, high-clarity sensory observations provide high epistemic weight, but testimony, logical deduction, and psychological denial actively modulate belief revision.

#### Exclusion Test:
*If the Epistemic Model were removed, secrets, deception, misunderstandings, and surprise would be impossible (`R-W-1`, `Q3 Decision`).*

---

### 7. Concept: THE ACTION PIPELINE & AUTHORITY BOUNDARIES
The rigid multi-phase pipeline that transitions an entity's internal desire into an authoritative world outcome without granting the language model direct write access to reality.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            THE ACTION PIPELINE                              │
├──────────────────────────┬──────────────────────────────────────────────────┤
│ Phase                    │ Operational Description & Authority Boundary     │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **1. Subjective Desire** │ Entity experiences internal need/drive.          │
│                          │ *(Authority: Entity Subjective State)*           │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **2. Action Proposal**   │ Language Model emits structured proposal:        │
│                          │ `{ thought, utterance, action_attempt }`.        │
│                          │ *(Authority: Probabilistic LLM - NO WRITE PERM)* │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **3. Possibility Check** │ Ingress Gateway checks world invariants.         │
│                          │ Rejects physically impossible actions.           │
│                          │ *(Authority: World Engine Invariants)*           │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **4. Causal Arbitration**│ Engine evaluates attempt against target defenses,│
│                          │ environmental friction, and seeded RNG.          │
│                          │ *(Authority: Causal Arbitration Layer)*          │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **5. State Delta Output**│ Engine generates exact state mutations (ΔS).     │
│                          │ *(Authority: Causal Arbitration Layer)*          │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **6. Atomic Commit**     │ ΔS applied to World State + Event Ledger.        │
│                          │ *(Authority: State Store Transaction)*           │
└──────────────────────────┴──────────────────────────────────────────────────┘
```

#### Exclusion Test:
*If this pipeline were removed, LLMs would have direct authority over reality, immediately enabling hallucinated teleportation, unearned combat victories, and broken invariants (`R-W-3`, `R-L-3`).*

---

### 8. Concept: PROJECTION
The mathematical extraction and transformation of authoritative World State into an isolated, perspective-bound context packet for an entity or operator view.

$$\text{Subjective Projection} = \mathcal{P}\Big(\text{World State}, \text{Space Topology}, \text{Entity Senses}, \text{Entity Beliefs}, \text{Salient Memories}\Big)$$

#### The Two Strict Projection Rules:
1. **Sensory Masking:** If a world fact is located in a Space outside the entity's sensory reach, it is strictly omitted from the projection (`R-W-1`).
2. **Epistemic Replacement:** If an entity holds a false belief about a property, the projection presents the entity's *belief*, not the objective world truth (`Q3 Decision`).

#### Exclusion Test:
*If Projection were removed, the LLM would be prompted with raw world state, causing universal character omniscience and leaking all hidden game secrets (`R-W-1`, `R-U-1`).*

---

### 9. Concept: COMPUTATIONAL FIDELITY & DORMANCY (Dimension 16)
The formal operational model governing how Everworld balances computational limits with continuous causal reality.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FIDELITY STATE MACHINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. HIGH-FIDELITY ACTIVE STATE (Focal Zone)                                  │
│    - Location of active human operator or major conflict.                   │
│    - Discrete step resolution, full sensory emission, active LLM dialogue.  │
├─────────────────────────────────────────────────────────────────────────────┤
│                               ▲ Promotion (Sensory Proximity / Conflict)   │
│                               │                                             │
│                               ▼ Demotion (Observer Leaves Zone)             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. LOW-FIDELITY DORMANT STATE (Background Universe)                         │
│    - Unobserved regions, sleeping entities, distant towns.                  │
│    - Token generation paused; processes advance via closed-form rates;      │
│      routines execute via scheduled event triggers.                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### The Lazy Causal Consistency Guarantee:
When a dormant region is queried after $\Delta t$ unobserved time:
1. The engine calculates all elapsed process state transitions $\Phi(\text{State}(T), \mathbf{P}_{\text{env}}, \Delta t)$ across active entities and artifacts.
2. It evaluates and resolves any scheduled timeline events that occurred during the interval in strict causal order.
3. It materializes the exact, causally consistent state *before* generating the first high-fidelity sensory observation (`R-D16-1`, `R-D16-2`).

#### Exclusion Test:
*If this fidelity model were removed, the system would either crash from compute exhaustion or rely on contradictory post-hoc narrative improvisation (`R-D16-1`).*

---

### 10. Concept: TEMPORAL CONTINUUM
The formal framework governing the progression of time inside Everworld.

* **Monotonic World Time ($T_w$):** A continuous, forward-moving scalar coordinate.
* **Temporal Advancements:**
  * **Micro-Step:** Small $\Delta t$ (seconds) during active high-fidelity interactions.
  * **Macro-Scrub:** Large $\Delta t$ (hours/days) where processes advance analytically and dormant schedules execute.
* **Event Precedence:** In concurrent situations, temporal order is determined by initiation timestamp $T_w$ plus action execution duration $\Delta t_{\text{action}}$.

#### Exclusion Test:
*If Temporal Continuum were removed, background decay, healing, travel duration, and temporal scrubbing would be impossible (`R-W-4`, `R-U-2`).*

---

### 11. Concept: AUTHORITY MATRIX
This matrix strictly establishes who and what is permitted to declare truth in Everworld 6:

```
┌──────────────────────────┬──────────────────────────────────────────────────┐
│ Subsystem / Actor        │ Exclusive Zone of Authority                      │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **World State Engine**   │ Physical truth, spatial topology, process clocks │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **Entity Epistemics**    │ Subjective beliefs, internal feelings, memories  │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **Language Model (LLM)** │ Generates proposed thought, speech & action intent│
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **Ingress Gateway**      │ Validates grammar, isolates attempts, drops garbage│
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **Arbitration Engine**   │ Resolves success/failure, enforces invariants    │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **Causal Event Ledger**  │ Immutable historical record of all state deltas  │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ **Human Operator**       │ Directs time scrub, selects view stance (U-1/U-2)│
└──────────────────────────┴──────────────────────────────────────────────────┘
```

---

## 3. The Minimum Conceptual Relationship Graph

```
                           ┌─────────────────────────┐
                           │   WORLD TIME ($T_w$)    │
                           └────────────┬────────────┘
                                        │ (Drives Clocks & Evolution Functions Φ)
                                        ▼
┌──────────────────────┐   ┌─────────────────────────┐   ┌──────────────────────┐
│  SPACES & APERTURES  │───┤   AUTHORITATIVE WORLD   ├───│      PROCESSES       │
│(Topology & Medium T) │   │          STATE          │   │ (Dynamic Function Φ) │
└──────────┬───────────┘   └────────────┬────────────┘   └──────────┬───────────┘
           │ (Sensory Bounds & Attenuation)│ (State Properties)     │ (State Updates)
           ▼                            ▼                           │
┌────────────────────────────────────────────────────┐              │
│                      ENTITIES                      │◄─────────────┘
│  - Lineage Anchor (Identity)                       │
│  - Somatic / Physical Vessel (Body & Fatigue)      │
│  - Epistemic Model (Beliefs & Memories via Ψ)      │
└─────────────────────────┬──────────────────────────┘
                          │ (Sensory & Epistemic Projection P)
                          ▼
┌────────────────────────────────────────────────────┐
│               SUBJECTIVE PROJECTION                │
│    (Filtered Observable Truth + Current Beliefs)   │
└─────────────────────────┬──────────────────────────┘
                          │ (Context Conditioning)
                          ▼
┌────────────────────────────────────────────────────┐
│                LANGUAGE MODEL (LLM)                │
│    - Subjective Deliberation & Dialogue            │
│    - Emits Proposed Cognition & Action Intent      │
└─────────────────────────┬──────────────────────────┘
                          │ (Unvalidated Response Stream)
                          ▼
┌────────────────────────────────────────────────────┐
│         STRUCTURED INGRESS / EGRESS GATEWAY        │
│    - Strict Schema Validation & Parse Enforcement  │
│    - Separates Internal Thought vs Spoken vs Action│
│    - Invariant Pre-check (Rejects Impossible Moves)│
└─────────────────────────┬──────────────────────────┘
                          │ (Validated Action Proposal)
                          ▼
┌────────────────────────────────────────────────────┐
│              CAUSAL ARBITRATION ENGINE             │
│    - Target Defense & Environmental Resistance     │
│    - Seeded Stochastic Outcome Resolution          │
└─────────────────────────┬──────────────────────────┘
                          │ (Produces Atomic State Delta ΔS)
                          ▼
┌────────────────────────────────────────────────────┐
│            ATOMIC COMMIT & CAUSAL LEDGER           │
│  1. Mutates Authoritative World State              │
│  2. Appends Immutable Record to Event Ledger       │
│  3. Emits Sensory Signals across Aperture Matrix   │
└────────────────────────────────────────────────────┘
```
