# Everworld 6: Minimum Computational Substrate Derivation

## 1. Requirement → Capability Dependency Map

Every capability below is derived directly from the locked behavioral contract (`/docs/10_definitive_behavioral_contract.md`):

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 REQUIREMENT TO CAPABILITY TRACEABILITY                                 │
├───────────────────────────────┬────────────────────────────────────────────────────────────────────────┤
│ Contract Requirement          │ Minimum Necessary Capability                                           │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-S-1** (Cold Restorability)│ **Authoritative State Record** + **Identity Continuity**               │
│                               │ Must be able to serialize/deserialize all existing things and their    │
│                               │ stable references without relying on runtime RAM.                      │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-S-2** (Atomicity)         │ **Transactional Mutation Mechanism**                                  │
│                               │ All state deltas from a single causal resolution must commit together   │
│                               │ or roll back completely on failure.                                    │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-W-1** (Epistemic Isolation│ **Spatial/Medium Topology** + **Epistemic Filter**                     │
│ & Zero Leaks)                 │ Spaces must define sensory boundaries/propagation; entity must possess │
│                               │ an isolated subjective knowledge store separate from World Truth.      │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-W-2** (Irreversible World │ **Authoritative State Mutation** + **Possibility Constraints**         │
│ Consequences)                 │ World state changes permanently alter the valid action space for all   │
│                               │ subsequent events.                                                     │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-W-3** (Intent Decoupled   │ **Two-Phase Action Pipeline** (Attempt Proposal → Rule Arbitration)    │
│ from Resolution)              │ Expressed intention is an uncommitted input; an arbitration rule       │
│                               │ evaluates physics/state and outputs the true state delta.              │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-D16-1** (Dormancy & Lazy  │ **Temporal Progression** + **Continuous Process Model**                │
│ Causal Consistency)           │ Closed-form or step-wise rate-based decay that can advance state       │
│                               │ across Δt without running full token generation loops.                 │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-D16-2** (Proximity        │ **Fidelity Promotion Boundary**                                        │
│ Promotion)                    │ Mechanism to detect when an unobserved entity/space enters an active   │
│                               │ sensory horizon and must be materialized into high fidelity.           │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-L-1** (Schema Enforcement)│ **Structured Ingress/Egress Gateway**                                  │
│ & **R-L-3** (Action Contain)  │ Validates model output against strict grammar and routes action        │
│                               │ attempts directly to the arbitration layer; rejects impossible moves.  │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-U-1** (Dual-Stance Stance)│ **Subjective vs. Objective Projection Views**                          │
│                               │ Ability to render either an entity's filtered epistemic reality or     │
│                               │ the global authoritative world state.                                  │
├───────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ **R-U-2** (Temporal Scrubbing)│ **Discrete Time Clock & Step Dispatcher**                              │
│                               │ Explicit operator control to advance world time and emit state deltas. │
└───────────────────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Irreducible Substrate (The 8 Fundamental Primitives)

To prove that each primitive is irreducible, we subject each one to the **Exclusion Test**: *“If we removed this completely, which locked requirement becomes impossible?”*

```
                                 ┌─────────────────────────────────┐
                                 │       THE IRREDUCIBLE CORE      │
                                 │                                 │
   [1. Stable Identity] ─────────┤ 2. Authoritative State Store    ├───────── [3. Spatial Topology]
                                 │                                 │
   [4. World Clock & Time] ──────┤ 5. Continuous Process Model     ├───────── [6. Causal Arbitration]
                                 │                                 │
   [7. Epistemic Projection] ────┤ 8. Ingress/Egress Gateway       │
                                 └─────────────────────────────────┘
```

### Primitive 1: Stable Identity & Lineage Anchor
* **What It Is:** An unambiguous, permanent reference that designates an entity, location, or artifact as a continuous entity over time, regardless of changes to its name, appearance, physical body, or state.
* **Exclusion Test:** If removed, **R-S-1 (Restorability)** and **R-W-2 (Continuous Consequences)** break. If an entity undergoes bodily change, amnesia, or leaves the room, the system has no way to bind past debts, injuries, or relationships to the re-encountered entity.

### Primitive 2: Authoritative State Store
* **What It Is:** The ground-truth computational record of all currently existing properties across the 7 domains (Physical, Biological, Psychological, Epistemic, Relational, Temporal, Macro).
* **Exclusion Test:** If removed, **R-S-1 (Persistence)**, **R-W-1 (Epistemics)**, and **R-W-2 (World Consequences)** collapse. Without an external authoritative store, the system degenerates back into SillyTavern where the LLM's text stream is the only record of reality.

### Primitive 3: Spatial & Medium Topology
* **What It Is:** The structural description of *where* things are, how spaces are connected (containment, portals, boundaries), and how light, sound, and signals propagate between them.
* **Exclusion Test:** If removed, **R-W-1 (Epistemic Isolation)** and **R-D16-2 (Proximity Promotion)** become impossible. Without spatial boundaries, the system cannot mathematically determine whether Entity A can hear Entity B whispering in the next room, forcing telepathic omniscient prompts.

### Primitive 4: World Time Coordinate ($T_w$)
* **What It Is:** A monotonically advancing temporal coordinate representing the internal clock of Everworld.
* **Exclusion Test:** If removed, **R-D16-1 (Dormancy Consistency)**, **R-U-2 (Temporal Scrubbing)**, and **R-W-4 (Biological Decay)** break. The world cannot calculate rate-based healing, travel times, or pass non-conversational time.

### Primitive 5: Continuous Process Model (Lazy/Step Evolution)
* **What It Is:** The computational mechanism that transforms time-dependent state properties over $\Delta t$ (e.g. $\text{Stamina}(t + \Delta t) = f(\text{Stamina}(t), \text{Rate}, \Delta t)$) without invoking an LLM.
* **Exclusion Test:** If removed, **R-D16-1** fails. Time skips would either cause zero state change (frozen world) or require running millions of wasted LLM calls to simulate a character sleeping.

### Primitive 6: Causal Arbitration Engine (The Two-Phase Validator)
* **What It Is:** The rule-evaluation layer that intercepts an **Action Attempt**, validates it against possibility invariants, calculates outcomes against target resistance/environment, and outputs an atomic **State Delta ($\Delta S$)**.
* **Exclusion Test:** If removed, **R-W-3 (Decoupling Intent from Outcome)** and **R-L-3 (Inadmissible Action Containment)** break completely. The system would be forced to accept hallucinated model outputs as reality.

### Primitive 7: Epistemic Filter & Projection Gateway
* **What It Is:** The mechanism that queries World State through an entity's spatial coordinates and sensory modalities to produce an isolated, perspective-bound observation packet containing *only* what that entity can perceive and remember.
* **Exclusion Test:** If removed, **R-W-1 (Epistemic Isolation)** and **R-U-1 (Inhabited Mode)** fail. The LLM would be fed global state, causing immediate hallucinated leaks of hidden secrets.

### Primitive 8: Ingress / Egress Gateway (Schema Validator)
* **What It Is:** The boundary parser that forces probabilistic model outputs into strictly typed Cognition, Utterance, and Action Attempt structures, and catches malformed outputs before they reach the engine.
* **Exclusion Test:** If removed, **R-L-1 (Schema Enforcement)** and **R-S-2 (Transactional Atomicity)** fail. A malformed LLM response or markdown hallucination would crash the runtime or inject corrupt data into the state store.

---

## 3. Non-Core Systems (Deferred Beyond Substrate)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            NON-CORE SUBSYSTEMS                              │
├─────────────────────────┬───────────────────────────────────────────────────┤
│ Subsystem               │ Why It Is Non-Core / Downstream                   │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ **Complex Magic Rules** │ Sits entirely inside Primitive 6 (Arbitration) as │
│                         │ domain-specific rule scripts. Substrate only needs│
│                         │ generic validation and state deltas.              │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ **Vector Memory / RAG** │ An optimization of Primitive 7 (Epistemic Filter).│
│                         │ The core requirement is "filter to accessible";   │
│                         │ semantic vector search is an indexing technique.  │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ **Factions & Economy**  │ Composed entirely of Primitives 1, 2, and 6       │
│                         │ (Entities with relations, state variables, rules).│
├─────────────────────────┼───────────────────────────────────────────────────┤
│ **GUI / Chat Interface**│ Pure consumer of Primitive 7 (Projection) and     │
│                         │ Primitive 8 (Ingress). Substrate is headless.     │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ **Audio / TTS Engines** │ Pure downstream presentation layer.               │
└─────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 4. Unresolved Foundational Questions

### Q1: The Event Storage vs. State Materialization Balance
* **The Question:** Does the substrate store the authoritative world as **(A) A fully materialized state snapshot updated by events**, or **(B) An append-only log of immutable causal events from which state is derived**, or **(C) A hybrid (periodic snapshots + delta log)**?
* **Why It Matters:** Affects crash recovery (`R-S-1`), temporal scrubbing performance (`R-U-2`), and storage growth over long timelines.

### Q2: Stochastic Arbitration Reproducibility
* **The Question:** For non-deterministic resolutions (e.g. uncertain physical outcomes or combat rolls), does the Arbitration Engine require a deterministic, seed-based pseudorandom number generator attached to event IDs, or is standard runtime stochasticity acceptable so long as the committed delta is atomic?
* **Why It Matters:** Determines whether time scrubbing/rewinding produces identical branching history or diverging alternative realities.

### Q3: Subjective Belief Representation
* **The Question:** Is an entity's subjective knowledge represented as a structured replica of world properties (e.g. `Beliefs: { Bob.location: "Library", Bob.alive: true }`), or as a stream of raw sensory observations that the LLM interprets on the fly?
* **Why It Matters:** Structured beliefs allow the engine to evaluate deception and confusion programmatically without calling the LLM; raw observation streams reduce engine complexity but shift cognitive load and potential hallucination onto the LLM.

---

## 5. Minimum Substrate Definition (Plain Language)

> **The Everworld 6 Substrate is a headless, authoritative state-and-causality engine.**
>
> It continuously tracks the identity, properties, physical locations, ongoing biological/physical processes, and subjective knowledge of entities inside a bounded spatial topology across world time.
>
> The engine operates on a strict **Two-Phase Causal Loop**:
> 1. **Perception/Projection:** When an entity must think or act, the engine compiles a strictly isolated observation of what that specific entity can see, hear, and remember, passing it to an external language model through a structured gateway.
> 2. **Arbitration/Mutation:** When the language model emits an internal thought, spoken word, or action attempt, the engine intercepts the proposal, validates it against world laws and physical constraints, calculates the true outcome, and atomically applies the resulting state changes to the authoritative world record.
>
> Unobserved areas advance through deterministic, rate-based process updates, ensuring temporal and causal consistency across the entire world without requiring continuous language model computation.
