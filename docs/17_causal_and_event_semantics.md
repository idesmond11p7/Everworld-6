# Everworld 6: Formal Causal and Event Semantics (Hardened Specification)

## 1. Foundational Axioms & Definition of Causality

In the **Dragon x Deus: Everworld 6** computational substrate, "causality" is not a loose narrative convention or a temporal log sequence. It is a strictly typed mathematical relation over state evolution.

### 1.1 The Strict Separation Axiom
We formally distinguish between six distinct relationships:
1. **Causal Dependency ($A \xrightarrow{\text{causes}} B$):** Event $B$ could not have legally occurred, or its state delta / parameters would differ, without the specific state mutations, sensory signals, or threshold crossings produced by Event $A$.
2. **Temporal Precedence ($t_A < t_B$):** Mere sequence in World Time $T_w$. Temporal order is a necessary but *insufficient* condition for causality. $A$ happening before $B$ never implies $A$ caused $B$.
3. **Spatial Co-location ($\text{Space}(A) \equiv \text{Space}(B)$):** Two phenomena occurring in the same space are causally independent unless an energy/state transmission link connects them.
4. **Epistemic Observation ($E_{\text{entity}} \xrightarrow{\text{perceives}} A$):** Perceiving an event does not make the observer a cause of that event, nor does an unperceived event lack causal power.
5. **Authorship / Agency ($\text{Lineage}(A)$):** An entity may author an action proposal, but the causal outcome is governed by the state and arbitration engine, not the author's narrative intent.
6. **Correlation / Sibling Co-occurrence ($A \sim B$):** Two events triggered by the same ancestor in the same generation wave are siblings, not parent/child.

---

### 1.2 Restricted Actual Causality (Active Directed Paths & Polarity-Typed Relations)

Naive "but-for" counterfactual removal fails under symmetrical overdetermination (e.g. two simultaneous fatal gunshots), asymmetrical preemption, and defender enabling paradoxes. We formally replace naive counterfactuals with **Restricted Actual Causality over Active Directed Paths**:

Let $\mathcal{S}$ be the authoritative World State, and $\mathcal{G}_{\text{causal}}$ the Directed Acyclic Graph of events.

#### Definition: Active Causal Path
A directed sequence of edges $\pi = \langle E_0, E_1, \dots, E_k \rangle$ in $\mathcal{G}_{\text{causal}}$ is an **Active Causal Path** if and only if every intermediate edge $e_i = \langle E_i, E_{i+1} \rangle$ represents an unsevered, actualized state delta mutation that was not preempted or dissipated prior to reaching $E_k$.

#### Definition: Actual Cause
Event $A$ is an **Actual Cause** of Event $B$ with respect to state delta $\Delta \mathcal{S}_B$ if and only if:
1. There exists an **Active Causal Path** $\pi$ from $A$ to $B$ in $\mathcal{G}_{\text{causal}}$.
2. There exists a contingency subset of co-occurring events $\mathcal{U} \subseteq \mathbf{E}_{\text{parents}}(B) \setminus \{A\}$ such that under $\mathcal{S} \setminus \big(\Delta \mathcal{S}_A[\mathbf{F}] \cup \Delta \mathcal{S}_{\mathcal{U}}\big)$, Event $B$'s admissibility or delta magnitude is strictly altered.

#### Polarity-Typed Causal Edge Classes:
To prevent defenders who block earlier attacks from being misclassified as killers (The Defender Enabling Paradox), causal edges are typed by functional polarity:
1. **`DIRECT_LETHAL_OR_TRANSFORMATIVE`:** Event $A$ directly transferred energy, material, or damage to produce $B$'s primary delta (e.g. lethal arrow striking heart).
2. **`ACTUAL_CONTRIBUTOR_OVERDETERMINED`:** Event $A$ was one of multiple independently sufficient actual causes along active unsevered paths (e.g. two simultaneous fatal headshots).
3. **`PREEMPTIVE_DEFLECTION`:** Event $A$ severed the active trajectory of another candidate event $E_{\text{prior}}$, preventing $E_{\text{prior}}$ from reaching target (e.g. shield blocking bolt).
4. **`TEMPORAL_WINDOW_ENABLER`:** Event $A$ preserved the target's survival across an intermediate interval $[t_1, t_2)$, allowing a later distinct event $B$ to occur, without $A$ being a direct damage contributor to $B$.

---

## 2. The Formal Causal DAG Model & Edge Taxonomy

The universe history is a Directed Acyclic Graph:
$$\mathcal{G}_{\text{causal}} = \big(\mathcal{V}_{\text{events}}, \mathcal{E}_{\text{causal}}\big)$$

Where each node $E \in \mathcal{V}_{\text{events}}$ is an immutable `CAUSAL_EVENT_RECORD`, and each directed edge $e \in \mathcal{E}_{\text{causal}}$ carries a strict causal typing tuple:
$$e = \langle E_{\text{parent}}, E_{\text{child}}, \text{Causal\_Edge\_Type}, \mathbf{Field\_Dependency\_Mask}, \text{Signal\_Ref} \rangle$$

### 2.1 Formal Causal Edge Taxonomy

```
┌──────────────────────────────┬────────────────────────────────────────────────────────┐
│ Causal Edge Type             │ Operational Semantics & Activation Rule               │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **1. DIRECT_TRIGGER**        │ Parent event directly triggered child evaluation      │
│                              │ (e.g. Weapon Impact → Wound Infliction).               │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **2. MATERIAL_STATE_DEP**    │ Child precondition/delta depended on a physical field   │
│                              │ mutated by parent (e.g. Key Unlock → Door Open).       │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **3. SIGNAL_PROPAGATION_DEP**│ Child action was prompted by an acoustic, visual, or    │
│                              │ tactile disturbance signal emitted by parent.          │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **4. SOMATIC_FATIGUE_DEP**   │ Child action was mechanically constrained by stamina   │
│                              │ loss or posture degradation from parent attempt.       │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **5. TACTICAL_OPPORTUNITY_DEP│ Deliberate combat reaction mechanically exploiting an   │
│                              │ opponent's `OVEREXTENDED` posture from parent failure. │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **6. PREEMPTIVE_DEFLECTION** │ Parent intervened to intercept, block, or divert the   │
│                              │ trajectory/target of another active action/projectile. │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **7. PROCESS_RATE_MODIFIER** │ Parent event altered the parameters Φ or rate of an   │
│                              │ active continuous process (e.g. antidote, sprint).     │
├──────────────────────────────┼────────────────────────────────────────────────────────┤
│ **8. PROCESS_CONVERGENCE**   │ Autonomous process crossed a threshold boundary,       │
│                              │ generating a discrete milestone event.                 │
└──────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Negative & Failed Action Causality

### 3.1 The Causal Reality of Failure
A failed action proposal is **NOT a no-op**. 
In the physical and psychological reality of Everworld 6:
* An entity attempting an action consumes real biological metabolic energy (stamina / ATP).
* An entity attempting an action alters physical body posture (overextension, balance loss).
* An attempt generates acoustic, visual, and vibrational energy in the containing Space.
* An attempt exposes intent to perceiving observers.

### 3.2 Formal State Representation of Failed Attempts
When the Arbitration Engine rejects an action proposal's primary intended effect:
1. **Primary Delta Rejection:** Intended target mutation $\Delta \mathcal{S}_{\text{target}}$ is dropped to $\emptyset$.
2. **Somatic Cost Application:** Actor somatic expenditure $\Delta \mathcal{S}_{\text{actor}}$ is committed (stamina loss, posture shift).
3. **Disturbance Emission:** Sensory signals $\mathbf{\Sigma}_{\text{disturbance}}$ are emitted into the spatial medium.
4. **Committed Event Node:** An event record with `outcome_status = FAILED_ATTEMPT` is committed to $\mathcal{V}_{\text{events}}$.

### 3.3 Downstream Dependency on Failure
Downstream events attach distinct, non-conflated causal edges:
* **The Observing Guard:** Attaches `SIGNAL_PROPAGATION_DEP` (reacting to sound, without omniscience of lockpick failure).
* **The Counter-Attacking Defender:** Attaches `TACTICAL_OPPORTUNITY_DEP` (exploiting attacker's overextended posture).
* **The Exhausted Thief:** Attaches `SOMATIC_FATIGUE_DEP` to subsequent physical attempts.

---

## 4. Derived Field Dependency Expansion & Mask Matching

Coarse entity-level dependencies create false couplings, while naive string matching on JSON paths fails whenever derived attributes (encumbrance, jump clearance, average temperature) are evaluated.

### 4.1 Schema Derivation Map
The World State schema explicitly declares the dependency mapping of all derived/aggregate attributes to their primitive constituent fields:
$$\text{Derivation}(\text{"vessels/X/somatic/total\_mass\_kg"}) = \Big\{ \text{"vessels/X/mass\_kg"}, \text{"vessels/X/inventory/items[*]/mass\_kg"} \Big\}$$
$$\text{Derivation}(\text{"spaces/Y/ambient\_temperature"}) = \Big\{ \text{"spaces/Y/heat\_sources[*]/btu\_output"}, \text{"spaces/Y/climate/base\_temp"} \Big\}$$

### 4.2 The Recursive Mask Expansion Algorithm
When Event $B$ evaluates a precondition or calculates a delta based on field path $F$:
1. If $F$ is a primitive field, $\mathbf{Mask}(F) = \{F\}$.
2. If $F$ is a derived/aggregate field, $\mathbf{Mask}(F) = \bigcup \text{Derivation}(F)$.
3. When matching against prior Event $A$'s delta $\Delta \mathcal{S}_A$:
   $$\text{Dependency\_Active}(A \to B) \iff \mathbf{Mask}(F_B) \cap \text{Keys}(\Delta \mathcal{S}_A) \neq \emptyset$$

* **Guarantee:** Adding a 50kg anvil to `inventory/items[0]` is guaranteed to match and causally link to a jump failure evaluated on `somatic/jump_clearance_m` through its expanded mass dependency.

---

## 5. Temporal Dynamics: Propagation Delay vs. Instantaneous Topological Waves

Physical systems exhibit dual temporal behaviors: instantaneous logical/structural state transitions and non-instantaneous spatial physical propagations.

### 5.1 The Dual Temporal Resolution Axiom
1. **Instantaneous Transitions ($\Delta t = 0$):** Precondition checks, geometric bounds tests, transactional state locking, and structural field derivations evaluate at the exact same microsecond $T_w$ within topological waves $W_0, W_1, \dots$.
2. **Propagating Physical Transitions ($\Delta t = \tau_{\text{prop}} > 0$):** Kinetic transfers across physical space, atmospheric pressure waves, acoustic signals, projectile flights, and neuromuscular reaction chains take strictly positive propagation time:
   $$\tau_{\text{prop}} = \max\left(\frac{d(\text{Source}, \text{Target})}{v_{\text{medium}}}, \tau_{\text{biological\_latency}}\right)$$

### 5.2 Elimination of Arbitrary Wave Limits
* There is **no arbitrary numerical limit (such as 8)** placed on topological waves.
* Multi-body interactions (e.g. grappling, collisions, falling mechanisms) advance through waves $W_k$ until all strictly instantaneous local state deductions at $T_w$ are settled.
* Any consequence requiring physical spatial transmission, acoustic propagation, or somatic response naturally schedules its child event at:
  $$T_{\text{child}} = T_w + \tau_{\text{prop}} \quad (\tau_{\text{prop}} \ge 1\text{ }\mu\text{s})$$
* **Formal Progress Guarantee:** Because physical interaction cycles strictly consume positive physical time $\sum \tau_i > 0$, infinite zero-time simulation loops are physically and mathematically impossible without requiring artificial semantic conversion hacks.

---

## 6. Process Provenance & Trajectory Tracking

Continuous processes $\Phi$ advance state across time without discrete actor events. When a continuous process triggers a discrete milestone event (e.g. poison death, structural collapse), the entire causal history of that process MUST be preserved.

### 6.1 The Causal Process Trajectory Mask
When continuous process $\mathcal{P}_k$ crosses a threshold at timestamp $T_{\text{cross}}$:
1. **Autonomous Milestone Generation:** The engine synthesizes a discrete `CAUSAL_EVENT_RECORD` with `causal_origin.category = PROCESS_THRESHOLD`.
2. **Complete Trajectory Edge Vector:** The milestone event's parent references are formally defined as:
   $$\mathbf{Parents}(E_{\text{threshold}}) = \big\{ E_{\text{initiating}} \big\} \cup \big\{ E_{\text{mod}_1}, E_{\text{mod}_2}, \dots, E_{\text{mod}_n} \big\}$$
   Where:
   * $E_{\text{initiating}}$ is the event that originally instantiated the process (e.g. the poisoned blade stab).
   * $\{E_{\text{mod}_i}\}$ is the complete set of intermediate discrete events that executed a `PROCESS_RATE_MODIFIER` (e.g. drinking antidote, running a sprint, applying a tourniquet).
3. **Audit Completeness Invariant:** A query asking *"Why did the character die at 07:00 instead of 42:00?"* traverses all intermediate antidote and sprint edges, preserving 100% causal accountability across hours of unobserved time skips.

---

## 7. Causal Compaction & Cold Merkle Inversion Index

To ensure bounded active memory while guaranteeing bit-exact historical reconstruction:

### 7.1 Two-Tiered Storage Architecture
* **Active Working Memory:** Retains current World State $\mathcal{S}(T_{\text{now}})$, the recent causal window $[T_{\text{anchor}}, T_{\text{now}}]$, and permanent Lineage relational/moral debts.
* **Cold Historical Storage:** Retains immutable event chunks $[E_0 \dots E_{4999}]$, $[E_{5000} \dots E_{9999}]$ signed with SHA-256 Merkle DAG roots.

### 7.2 The Cold Merkle Inversion Index
Each archived cold chunk contains an immutable **Causal Inversion Backlink Index**:
$$\mathbf{Index}_{\text{backlink}} = \big\{ \text{Entity\_ID} \mapsto [\text{Event\_ID}_1, \text{Event\_ID}_2, \dots] \big\}$$
$$\mathbf{Index}_{\text{field}} = \big\{ \text{Field\_Path} \mapsto [\text{Event\_ID}_a, \text{Event\_ID}_b, \dots] \big\}$$

* **Semantic Slicing Equivalence:** Reconstructing a local sub-DAG for a historical incident (e.g. *"Who poisoned the well 3 months ago?"*) loads only the indexed event slice, producing a sub-DAG that is strictly isomorphic to the original uncompacted graph without full-history table scans.

---

## 8. Executable Invariant Test Specifications

Every invariant is formulated with an executable test specification, strict assertions, and negative counterexamples.

---

### Test Spec 1: `TEST_OVERDETERMINED_SIMULTANEOUS_KILL`
* **Objective:** Verify that two simultaneous lethal attacks both register as actual causes without orphan event creation.
* **Preconditions:**
  * Target $V$ in Space $X$ (`Health = 5000`, lethal threshold $\le 0$).
* **Execution Sequence:**
  1. Sniper $A$ fires: Event $E_A$ inflicts 10000 damage at $T = 12.0\text{ s}$, Wave 0.
  2. Sniper $B$ fires: Event $E_B$ inflicts 10000 damage at $T = 12.0\text{ s}$, Wave 0.
  3. Engine resolves Wave 1: generates Death Event $E_{\text{death}}$.
* **Assertions:**
  * $\text{ASSERT } E_{\text{death}}.\text{causal\_origin}.\text{parent\_refs} \text{ CONTAINS } [E_A.\text{id}, E_B.\text{id}]$.
  * $\text{ASSERT } \text{Edge}(E_A \to E_{\text{death}}).\text{type} == \text{ACTUAL_CONTRIBUTOR_OVERDETERMINED}$.
  * $\text{ASSERT } \text{Edge}(E_B \to E_{\text{death}}).\text{type} == \text{ACTUAL_CONTRIBUTOR_OVERDETERMINED}$.
  * **Negative Exclusion:** $\text{ASSERT } E_{\text{death}}.\text{parent\_refs} \text{ DOES NOT CONTAIN any unrelated ambient events}$.

---

### Test Spec 2: `TEST_PROCESS_TRAJECTORY_PROVENANCE`
* **Objective:** Verify that an autonomous threshold event preserves all intermediate rate-modifying parent events.
* **Preconditions:**
  * Target $V$ stabbed by Assassin at $T = 0\text{ h}$ (Event $E_{\text{stab}}$), instantiating Poison Process $\mathcal{P}_{\text{poison}}$.
* **Execution Sequence:**
  1. At $T = 2\text{ h}$, $V$ drinks Antidote (Event $E_{\text{antidote}}$, rate drops to $+2/\text{hr}$).
  2. At $T = 4\text{ h}$, $V$ sprints (Event $E_{\text{sprint}}$, rate increases to $+20/\text{hr}$).
  3. At $T = 7\text{ h}$, $\mathcal{P}_{\text{poison}}$ reaches lethal threshold; engine synthesizes Event $E_{\text{death}}$.
* **Assertions:**
  * $\text{ASSERT } E_{\text{death}}.\text{parent\_refs} \text{ CONTAINS } [E_{\text{stab}}.\text{id}, E_{\text{antidote}}.\text{id}, E_{\text{sprint}}.\text{id}]$.
  * $\text{ASSERT } \text{Edge}(E_{\text{sprint}} \to E_{\text{death}}).\text{type} == \text{PROCESS_RATE_MODIFIER}$.
  * $\text{ASSERT } \text{Edge}(E_{\text{antidote}} \to E_{\text{death}}).\text{type} == \text{PROCESS_RATE_MODIFIER}$.
  * **Counterfactual Perturbation:** Removing $E_{\text{sprint}}$ from simulation advances death timestamp to $T = 42\text{ h}$.

---

### Test Spec 3: `TEST_DERIVED_FIELD_ENCUMBRANCE_EXPANSION`
* **Objective:** Verify that precondition checks on derived aggregate fields link causally to underlying primitive inventory mutations.
* **Preconditions:**
  * Hero in Space $X$ with empty inventory (`total_mass_kg = 70.0`, jump clearance $= 3.5\text{ m}$).
* **Execution Sequence:**
  1. At $T = 1.0\text{ s}$, Event $E_{\text{add}}$ places 50kg Anvil into `inventory/items[0]`.
  2. At $T = 2.0\text{ s}$, Hero attempts 3-meter chasm jump (Event $E_{\text{jump}}$).
  3. Precondition evaluates derived `jump_clearance_m` ($= 2.1\text{ m}$ under 120kg mass) and FAILS.
* **Assertions:**
  * $\text{ASSERT } \text{Edge}(E_{\text{add}} \to E_{\text{jump}}) \text{ EXISTS in } \mathcal{G}_{\text{causal}}$.
  * $\text{ASSERT } \text{Edge}(E_{\text{add}} \to E_{\text{jump}}).\text{field\_mask} \text{ CONTAINS } \text{"inventory/items[0]"}$.
  * $\text{ASSERT } \text{Edge}(E_{\text{add}} \to E_{\text{jump}}).\text{derived\_bridge} == \text{"somatic/total_mass_kg"}$.

---

### Test Spec 4: `TEST_FAILED_ACTION_TYPED_EDGE_DISCRIMINATION`
* **Objective:** Verify that downstream reactions to failed actions receive precise, non-conflated edge types.
* **Preconditions:**
  * Thief $T$ in Vault, Guard $G$ in adjacent room (Aperture $T_{\text{acoustic}} = 0.5, T_{\text{visual}} = 0.0$).
* **Execution Sequence:**
  1. Thief attempts lockpick with broken pick; engine resolves Event $E_{\text{fail}}$ (`status = FAILED_ATTEMPT`, emits acoustic signal $S_{\text{snap}}$).
  2. Guard reacts to sound, submitting Investigation Event $E_{\text{guard}}$.
  3. Thief shakes bruised hand, submitting Hand Shake Event $E_{\text{thief}}$.
* **Assertions:**
  * $\text{ASSERT } \text{Edge}(E_{\text{fail}} \to E_{\text{guard}}).\text{type} == \text{SIGNAL_PROPAGATION_DEP}$.
  * $\text{ASSERT } \text{Edge}(E_{\text{fail}} \to E_{\text{thief}}).\text{type} == \text{SOMATIC_FATIGUE_DEP}$.
  * $\text{ASSERT } \text{Guard.epistemic\_store DOES NOT CONTAIN structural assertion of lockpick failure}$.

---

### Test Spec 5: `TEST_COLD_MERKLE_SUBDAG_ISOMORPHISM`
* **Objective:** Verify that reconstructing a local sub-DAG from cold storage is strictly isomorphic to the original uncompacted graph.
* **Preconditions:**
  * 6,000 events executed. Snapshot taken at $E_{5000}$. Active RAM holds $[E_{5001} \dots E_{6000}]$.
* **Execution Sequence:**
  1. Issue deep causal query for Event $E_{2500}$.
  2. Engine loads cold chunk $[E_{2000} \dots E_{3000}]$ using the Merkle Backlink Index.
  3. Materialize Reconstructed Sub-DAG $\mathcal{G}_{\text{reconstructed}}$.
* **Assertions:**
  * $\text{ASSERT } \text{GraphIsomorphic}(\mathcal{G}_{\text{reconstructed}}(E_{2500}), \mathcal{G}_{\text{original}}(E_{2500})) \equiv \text{TRUE}$.
  * $\text{ASSERT Total disk chunk reads} == 1$ (zero full-history table scans).
