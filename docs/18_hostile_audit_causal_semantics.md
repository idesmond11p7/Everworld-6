# Formal Hostile Audit Report: Causal & Event Semantics

**Document Audited:** `/docs/17_causal_and_event_semantics.md`  
**Audit Methodology:** Multi-Vector Hostile Structural & Semantics Attack  
**Audit Output Target:** `/docs/18_hostile_audit_causal_semantics.md`  
**Status:** **FAILED (CRITICAL & MAJOR VULNERABILITIES IDENTIFIED; SPECIFICATION UNSAFE TO LOCK)**

---

## 1. Executive Summary & Audit Overview

This report provides the formal hostile adversarial audit of `/docs/17_causal_and_event_semantics.md`. The specification was subjected to targeted attacks across eight specific architectural seams:
1. Counterfactual causality failure under overdetermination & preemption.
2. Causal cycle vulnerabilities across feedback loops and reactions.
3. Multi-parent asymmetry, redundant causes, and preemption.
4. Process provenance collapse (loss of intermediate continuous modifiers).
5. Failed-action dependency conflation.
6. Field mask pathologies (derived/aggregate state, structural aliases, array indexing).
7. Compaction equivalence breakage (loss of semantic equivalence in cold sub-DAG slicing).
8. Tautological and ungrounded test specifications.

Every attack follows the strict verification chain:
$$\text{Attack Scenario} \longrightarrow \text{Formal Failure Condition} \longrightarrow \text{Current Semantic Admissibility} \longrightarrow \text{Invariant Violation} \longrightarrow \text{Minimal Architectural Correction} \longrightarrow \text{Counterexample} \longrightarrow \text{Executable Test Specification}$$

---

## 2. Detailed Attack Dissections

---

### Attack 1: Counterfactual Removal Failure under Overdetermination & Preemption

#### A. Attack Scenario
Two snipers, $A$ and $B$, shoot victim $V$ simultaneously at $T_w = 12.0\text{ s}$ (Generation Wave 0).
* Sniper $A$'s bullet strikes $V$'s heart (inflicting 10,000 damage; lethal threshold is 5,000).
* Sniper $B$'s bullet strikes $V$'s head simultaneously (inflicting 10,000 damage).
* Lethal Threshold: $\text{Health} \le 0$. Initial $\text{Health} = 5,000$.

#### B. Formal Failure Condition
Section 1.2 defines causal dependency purely counterfactually:
$$\text{Event } B \text{ depends on } A \iff \Delta \mathcal{S}_B\Big(\mathcal{S} \setminus \Delta \mathcal{S}_A[\mathbf{F}]\Big) \neq \Delta \mathcal{S}_B(\mathcal{S})$$
Under simultaneous overdetermination:
* If we counterfactually remove $A$'s damage: $B$'s bullet alone still inflicts 10,000 damage, reducing health from 5,000 to -5,000 ($\le 0$). Death Event $E_{\text{death}}$ still occurs identically.
  $$\Delta \mathcal{S}_{E_{\text{death}}}\Big(\mathcal{S} \setminus \Delta \mathcal{S}_A\Big) \equiv \Delta \mathcal{S}_{E_{\text{death}}}(\mathcal{S}) \implies A \text{ is NOT a cause of Death}.$$
* If we counterfactually remove $B$'s damage: $A$'s bullet alone still inflicts 10,000 damage ($\le 0$). Death Event $E_{\text{death}}$ still occurs identically.
  $$\Delta \mathcal{S}_{E_{\text{death}}}\Big(\mathcal{S} \setminus \Delta \mathcal{S}_B\Big) \equiv \Delta \mathcal{S}_{E_{\text{death}}}(\mathcal{S}) \implies B \text{ is NOT a cause of Death}.$$
* **Result:** The death event has **ZERO causal parents**. It becomes an uncaused orphan event in the ledger.

#### C. Whether Current Semantics Permit It
**YES.** Section 1.2 strictly mandates naive counterfactual removal ($\mathcal{S} \setminus \Delta \mathcal{S}_A$), which provably collapses under symmetrical overdetermination and asymmetrical preemption.

#### D. Invariant Violation
* Violates `R-W-3` (Authoritative World Simulation / Causal Ledger Accountability): An unnatural death occurs with zero culpability assigned to either active killer.

#### E. Severity: **FATAL**

#### F. Minimal Architectural Correction
Replace naive "but-for" counterfactual removal with a **Restricted Actual Causality (Structural Contribution Relation)**:
1. Partition causal contribution into two explicit modes:
   * **Sufficient Actual Contributor:** Event $A$ is an actual cause of $E$ if there exists a contingency subset of co-occurring events $\mathcal{U}$ such that under $\mathcal{S} \setminus \mathcal{U}$, $A$ is strictly necessary for $E$. (In the sniper case, setting contingency $\mathcal{U} = \{B\}$ reveals $A$'s necessity).
   * **Joint Necessary Contributor:** $A$ and $B$ are individually insufficient but jointly sufficient.
2. In the ledger, edge typing must distinguish:
   $$e = \langle A, E_{\text{death}}, \text{ACTUAL_CONTRIBUTOR_OVERDETERMINED}, \{\text{"vessels/V/health"}\} \rangle$$

#### G. Adversarial Counterexample & Executable Test Specification
```
TEST: test_overdetermined_simultaneous_kill_preserves_both_culprits
  Given: Vessel V with Health = 5000 (Lethal threshold <= 0).
  When:  Event A inflicts 10000 damage at T = 12.0s, Wave 0.
  And:   Event B inflicts 10000 damage at T = 12.0s, Wave 0.
  Then:  Event E_death executes at T = 12.0s, Wave 1.
  And:   ASSERT E_death.causal_origin.parent_refs CONTAINS A.id.
  And:   ASSERT E_death.causal_origin.parent_refs CONTAINS B.id.
  And:   ASSERT Edge(A -> E_death).type == ACTUAL_CONTRIBUTOR_OVERDETERMINED.
  And:   ASSERT Edge(B -> E_death).type == ACTUAL_CONTRIBUTOR_OVERDETERMINED.
```

---

### Attack 2: The Cyclic Causal Dependency Attack

#### A. Attack Scenario
Two gladiators $A$ and $B$ engage in close-quarters grappling at $T_w = 14.0\text{ s}$.
* Wave 0, Event $E_1$: $A$ shoves $B$, altering $B$'s balance ($\Delta \mathcal{S}_{\text{posture\_B}}$).
* Wave 1, Event $E_2$: $B$'s involuntary stumble causes $B$ to crash into $A$, altering $A$'s footing ($\Delta \mathcal{S}_{\text{posture\_A}}$).
* Wave 2, Event $E_3$: $A$'s altered footing causes $A$ to slip and drop their sword onto $B$'s foot ($\Delta \mathcal{S}_{\text{damage\_B}}$).

#### B. Formal Failure Condition
If causality is defined purely by entity-to-entity interactions or state-domain references without strict topological wave indexing, the causal graph can generate cyclic references ($A \to B \to A \to B$). If an event's precondition tries to resolve against an ancestor in the same physical microsecond without wave stratification, a circular fixed-point dependency halts the resolver.

#### C. Whether Current Semantics Permit It
**PARTIAL.** While Doc 15 introduced Topological Waves ($W_k$), Doc 17 Section 2 defines $\mathcal{G}_{\text{causal}}$ generally as a DAG without explicitly bounding wave progression within a single $T_w$, and Section 5 does not define how multi-wave feedback within a single microsecond terminates when entity states mutually modulate each other.

#### D. Invariant Violation
* Violates `R-S-2` (Deterministic Transactional Progress): Potential infinite wave loop if mutual reactions continuously trigger immediate consequences.

#### E. Severity: **MAJOR**

#### F. Minimal Architectural Correction
1. Mandate that every edge in $\mathcal{E}_{\text{causal}}$ MUST satisfy the **Strict Wave Stratification Invariant**:
   $$\forall \langle E_a, E_b \rangle \in \mathcal{E}_{\text{causal}}: \quad \big(t(E_a) < t(E_b)\big) \lor \Big(t(E_a) == t(E_b) \land \text{Wave}(E_a) < \text{Wave}(E_b)\Big)$$
2. Because $\text{Wave}(E_b) > \text{Wave}(E_a)$ strictly on same-$T_w$ edges, topological cycles are mathematically impossible ($G_{\text{causal}}$ is guaranteed acyclic).
3. If $\text{Wave} \ge N_{\text{wave\_limit}} = 8$ within a single $T_w$, the remaining energy is converted into a continuous process $\mathcal{P}_{\text{stumble}}$ for $T_w + \delta t$, terminating same-tick wave cascades.

#### G. Adversarial Counterexample & Executable Test Specification
```
TEST: test_grappling_feedback_loop_is_strictly_acyclic_and_wave_bounded
  Given: Entity A and Entity B in Grapple at T = 14.0s.
  When:  E1 (Wave 0: A shoves B) -> E2 (Wave 1: B stumbles into A) -> E3 (Wave 2: A slips onto B).
  Then:  ASSERT Wave(E1) == 0 AND Wave(E2) == 1 AND Wave(E3) == 2.
  And:   ASSERT TopologicalSort(G_causal) succeeds with 0 cycles.
  And:   ASSERT All edges point strictly from lower wave to higher wave.
```

---

### Attack 3: Multi-Parent Asymmetry & Preemptive Redundancy

#### A. Attack Scenario
* At $T_w = 10.0\text{ s}$, Assassin $A$ shoots a poisoned dart at King $K$ (travel time 0.2s, lethal impact at $10.2\text{ s}$).
* At $T_w = 10.1\text{ s}$, Guard $G$ pushes King $K$ out of the way.
* At $T_w = 10.2\text{ s}$, the dart strikes the throne (empty space).

#### B. Formal Failure Condition
Section 5.1 defines Confluent Composition ($A + B \to C$) assuming static logical conjunction ($\mathcal{P}_A \land \mathcal{P}_B \equiv \text{TRUE}$). It fails to define **Causal Preemption / Interception** where Event $B$ (Guard's shove) actively *defeats* the causal trajectory of Event $A$ (Dart firing). Under naive multi-parent models, the throne impact might record Assassin $A$ and Guard $G$ as joint cooperative causes of "Throne Struck", losing the fact that $G$ was a *preempting deflector*.

#### C. Whether Current Semantics Permit It
**YES.** Doc 17 does not define a formal edge type for **Causal Interception / Deflection**.

#### D. Invariant Violation
* Violates `R-W-1` (Causal Consistency & Invariable Accountability): The guard's defensive rescue is encoded identically to an accessory aiding the assassin.

#### E. Severity: **MAJOR**

#### F. Minimal Architectural Correction
Introduce the **`PREEMPTIVE_DEFLECTION`** edge type:
$$\text{Edge}(G \to E_{\text{miss}}) = \langle E_{\text{guard\_shove}}, E_{\text{dart\_miss}}, \text{PREEMPTIVE_DEFLECTION}, \{\text{"vessels/K/location"}\} \rangle$$
Where a preemptive edge explicitly asserts that parent $G$ modified a precondition parameter such that parent $A$'s intended effect on target $K$ was diverted to an alternative target (Throne).

#### G. Adversarial Counterexample & Executable Test Specification
```
TEST: test_guard_interception_records_preemptive_deflection
  Given: Assassin fires dart at King (Trajectory active, impact scheduled T = 10.2s).
  When:  Guard pushes King at T = 10.1s (Event E_shove).
  Then:  At T = 10.2s, Event E_impact executes with target = Throne.
  And:   ASSERT Edge(E_shove -> E_impact).type == PREEMPTIVE_DEFLECTION.
  And:   ASSERT E_impact.causal_origin.interrupted_intended_target == King.lineage_id.
```

---

### Attack 4: Process Provenance Collapse (Loss of Intermediate Modifiers)

#### A. Attack Scenario
* $T_w = 00:00$: Assassin stabs Target with poisoned blade ($E_{\text{stab}}$). Instantiates Poison Process $\mathcal{P}_{\text{poison}}$ ($\text{lethal threshold} = 100\text{ toxicity}$, $\text{base rate} = +10/\text{hr}$, projected death $T_w = 10:00$).
* $T_w = 02:00$: Target drinks Antidote ($E_{\text{antidote}}$). Modulates $\mathcal{P}_{\text{poison}}$ rate to $+2/\text{hr}$ (projected death pushed to $T_w = 42:00$).
* $T_w = 04:00$: Target runs a strenuous sprint ($E_{\text{sprint}}$). Modulates $\mathcal{P}_{\text{poison}}$ rate to $+20/\text{hr}$.
* $T_w = 07:00$: Target collapses into toxic shock and dies ($E_{\text{death}}$).

#### B. Formal Failure Condition
Section 6.1 specifies that a process milestone event links back to the *initiating event* that started the process:
$$e = \langle E_{\text{stab}}, E_{\text{death}}, \text{PROCESS_CONVERGENCE}, \dots \rangle$$
* **Failure:** The edge points *only* from $E_{\text{stab}}$ to $E_{\text{death}}$. The antidote ($E_{\text{antidote}}$) and the sprint ($E_{\text{sprint}}$) are completely bypassed. An auditor querying *"Why did the character die at 07:00 instead of 42:00?"* finds zero causal link connecting the sprint to the death.

#### C. Whether Current Semantics Permit It
**YES.** Section 6.1 explicitly binds `initiating_event_ref == E_stab.id`, collapsing the entire continuous modification history into a single initial event.

#### D. Invariant Violation
* Violates `R-W-3` (Historical State Traceability) and `R-W-4` (Autonomous Temporal Consistency): Intermediate causal actions that accelerated or decelerated death are deleted from the causal chain.

#### E. Severity: **FATAL**

#### F. Minimal Architectural Correction
A Process Milestone Event MUST record a **Causal Process Trajectory Mask**:
$$\text{Parents}(E_{\text{threshold}}) = \big\{ E_{\text{initiating}} \big\} \cup \big\{ E_{\text{mod}_1}, E_{\text{mod}_2}, \dots, E_{\text{mod}_n} \big\}$$
Where every event that executed a `PROCESS_REPARAMETERIZATION` on $\mathcal{P}$ is an authoritative co-parent of the threshold event, with edge type `PROCESS_RATE_MODIFIER`.

#### G. Adversarial Counterexample & Executable Test Specification
```
TEST: test_process_threshold_preserves_all_intermediate_modifiers
  Given: Poison process initiated by E_stab at T = 0h.
  When:  E_antidote modifies rate at T = 2h.
  And:   E_sprint modifies rate at T = 4h.
  And:   E_death triggers at T = 7h.
  Then:  ASSERT E_death.causal_origin.parent_refs CONTAINS E_stab.id.
  And:   ASSERT E_death.causal_origin.parent_refs CONTAINS E_antidote.id.
  And:   ASSERT E_death.causal_origin.parent_refs CONTAINS E_sprint.id.
  And:   ASSERT Edge(E_sprint -> E_death).type == PROCESS_RATE_MODIFIER.
```

---

### Attack 5: Failed-Action Dependency Conflation

#### A. Attack Scenario
Thief $T$ attempts to pick a vault lock and snaps their lockpick with a loud crack ($E_{\text{fail}}$).
* Guard $G$ (in adjacent room) hears the loud snap and investigates ($E_{\text{investigate}}$).
* Accomplice $A$ (standing next to $T$) sees the snapped tool and hands $T$ a spare pick ($E_{\text{spare}}$).
* Thief $T$ feels their fingers bruised and shakes their hand ($E_{\text{shake}}$).

#### B. Formal Failure Condition
Section 3.3 introduces `FAILURE_COUNTER` as a single monolithic edge type for downstream dependencies on failed actions.
* **Failure:** It conflates four distinct physical/epistemic pathways:
  1. Guard $G$ responded to the **Acoustic Disturbance Signal** (did not know it was a lockpick failure).
  2. Accomplice $A$ responded to the **Visual Observation of Broken Tool State**.
  3. Thief $T$ responded to **Somatic Muscle Strain / Fatigue**.
  Using a generic `FAILURE_COUNTER` edge for all three obliterates the distinction between sensory propagation, physical injury, and intentional counter-play.

#### C. Whether Current Semantics Permit It
**YES.** Section 3.3 presents `FAILURE_COUNTER` as the universal failure dependency edge.

#### D. Invariant Violation
* Violates Epistemic Isolation (`R-W-1`): If Guard $G$'s action is linked via `FAILURE_COUNTER` rather than purely `SENSORY_SIGNAL`, the guard's cognitive prompt falsely receives structural knowledge that a lockpick action specifically failed.

#### E. Severity: **MAJOR**

#### F. Minimal Architectural Correction
Strictly partition failure dependency into 3 mutually exclusive edge types:
1. **`SIGNAL_PROPAGATION_DEP`:** For entities reacting purely to emitted acoustic/visual disturbance signals (Guard).
2. **`SOMATIC_FATIGUE_DEP`:** For subsequent actor actions constrained by stamina/posture loss (Thief shaking hand).
3. **`TACTICAL_OPPORTUNITY_DEP`:** Specifically and only for deliberate combat counter-attacks that mechanically exploit the `OVEREXTENDED` posture state (Riposte).

#### G. Adversarial Counterexample & Executable Test Specification
```
TEST: test_guard_reaction_to_failed_action_is_strictly_signal_dependent
  Given: Thief fails lockpick in Room A, emitting Acoustic signal S_noise (energy 4000).
         Guard in Room B with closed door (Aperture T_acoustic = 0.5, T_visual = 0.0).
  When:  Event E_fail commits.
  Then:  Guard receives Signal S_heard (energy 2000, content: "METALLIC_SNAP").
  And:   Guard initiates E_investigate.
  Then:  ASSERT Edge(E_fail -> E_investigate).type == SIGNAL_PROPAGATION_DEP.
  And:   ASSERT Edge(E_fail -> E_investigate).type != TACTICAL_OPPORTUNITY_DEP.
  And:   ASSERT Guard.epistemic_store DOES NOT CONTAIN "Lockpick_Failed_Assertion".
```

---

### Attack 6: Field Mask Pathologies (Derived State & Aggregate Aliasing)

#### A. Attack Scenario
* Event $A$: Merchant hands Hero a 50kg iron anvil.
  * Mutated field: `vessels/hero/inventory/items[4]` (added anvil, mass = 50.0kg).
* Event $B$: Hero attempts to jump across a 3-meter chasm.
  * Precondition: `vessels/hero/somatic/jump_clearance_m >= 3.0`.
  * Physical engine computes: $\text{jump\_clearance} = f(\text{stamina}, \text{total\_mass\_kg})$.
  * Result: Jump fails because `total_mass_kg` exceeded limit.

#### B. Formal Failure Condition
Section 4.1 defines fine-grained field masks as exact struct pointers (e.g. `{"vessels/hero/somatic/jump_clearance_m"}`).
* **Failure:** Event $A$ mutated `inventory/items[4]`. Event $B$ read `jump_clearance_m`.
* If a naive string-matching algorithm compares `{"vessels/hero/inventory/items[4]"}` with `{"vessels/hero/somatic/jump_clearance_m"}`, the intersection is **EMPTY ($\emptyset$)**.
* The dependency tracker concludes Event $B$ is **independent** of Event $A$, dropping the causal edge entirely.

#### C. Whether Current Semantics Permit It
**YES.** Section 4 does not define how **Derived Physical Attributes** (aggregates like total mass, encumbrance, temperature averages) inherit field dependency provenance from their primitive component fields.

#### D. Invariant Violation
* Violates `R-W-2` (Physical Groundedness & Conservation): Actions constrained by physical mass become detached from inventory mutations.

#### E. Severity: **FATAL**

#### F. Minimal Architectural Correction
Define the **Derived Field Dependency Expansion Rule**:
1. Authoritative World State schema must explicitly declare derivation dependencies:
   $$\text{Derivation}(\text{"vessels/X/somatic/total\_mass\_kg"}) = \text{Sum}\big(\text{"vessels/X/mass\_kg"}, \text{"vessels/X/inventory/items[*]/mass\_kg"}\big)$$
2. When Event $B$ evaluates a precondition on a derived field $F_{\text{derived}}$, the dependency resolver expands $F_{\text{derived}}$ to its primitive constituent paths $\bigcup \text{Primitives}(F_{\text{derived}})$.
3. The causal edge records both the derived query and the matching underlying primitive mutation.

#### G. Adversarial Counterexample & Executable Test Specification
```
TEST: test_derived_encumbrance_correctly_links_to_item_addition
  Given: Hero with empty inventory (total_mass = 70kg).
  When:  Event A adds 50kg Anvil to inventory/items[0] at T = 1.0s.
  And:   Event B (Jump Attempt) evaluates jump_clearance(total_mass = 120kg) and FAILS at T = 2.0s.
  Then:  ASSERT Edge(A -> B) EXISTS in G_causal.
  And:   ASSERT Edge(A -> B).field_mask CONTAINS "inventory/items[0]".
  And:   ASSERT Edge(A -> B).derived_bridge == "somatic/total_mass_kg".
```

---

### Attack 7: Compaction Reconstruction Invariance Breakage

#### A. Attack Scenario
* A simulation executes 10,000 turns.
* At $T_{5000}$, snapshot $\mathcal{S}(T_{5000})$ is materialized and events $E_0 \dots E_{4999}$ are flushed to cold storage.
* At $T_{7000}$, an in-game trial evaluates moral culpability for a murder committed at $T_{2000}$.
* The cold log is queried to reconstruct the causal sub-DAG for the murder.

#### B. Formal Failure Condition
Section 9.2 states that the engine loads cold chunks and rebuilds the local sub-DAG.
* **Failure:** If intermediate state deltas were compacted/pruned into snapshot aggregates without preserving the **Causal Edge Inversion Index** (a backlink index from targets to parent events), rebuilding a sub-DAG requires scanning all 5,000 serialized JSON event records from disk, causing an $O(N)$ full table scan.
* Furthermore, if intermediate continuous process checkpoints were discarded, continuous intervals cannot be mathematically verified during replay.

#### C. Whether Current Semantics Permit It
**YES.** Section 8 and 9 describe the concept of cold storage but omit the formal storage indexing requirement (Merkle-indexed backlink table).

#### D. Invariant Violation
* Violates `R-S-1` (Cold State Restorability) and `R-U-2` (Computational Efficiency / Boundedness).

#### E. Severity: **MAJOR**

#### F. Minimal Architectural Correction
1. Historical event chunks in cold storage MUST be stored alongside an immutable **Causal Inversion Index** ($\text{Target\_ID} \mapsto [\text{Event\_ID}_1, \dots]$) and a **Merkle Directed Causal Graph Index**.
2. Compaction MUST guarantee **Semantic Slicing Equivalence**:
   $$\text{Slice}\big(\mathcal{G}_{\text{compacted}}, [t_1, t_2]\big) \equiv \text{SubGraph}\big(\mathcal{G}_{\text{full}}, [t_1, t_2]\big)$$

#### G. Adversarial Counterexample & Executable Test Specification
```
TEST: test_cold_log_subdag_reconstruction_is_isomorphic_to_full_graph
  Given: 6000 events executed; Snapshot taken at E_5000; Active RAM holds [E_5001 ... E_6000].
  When:  Causal query issued for Event E_2500.
  Then:  Engine loads cold chunk [E_2000 ... E_3000] using Merkle Inversion Index.
  And:   ASSERT Reconstructed_SubDAG(E_2500) IS ISOMORPHIC to Uncompacted_SubDAG(E_2500).
  And:   Zero full-history table scans performed.
```

---

### Attack 8: Tautological & Ungrounded Test Specifications

#### A. Attack Scenario
Audit of Section 10 test specifications for self-fulfilling or ungrounded assertions.

#### B. Formal Failure Condition
* In Section 10, Test 3 (`INV_MULTI_PARENT_CONFLUENT_COMPOSITION`) asserted:
  `ASSERT E_explosion.parent_refs == [Gas_Process.id, E_spark.id]`
  This test was tautological: it asserted the contents of an array without verifying whether the *physical preconditions* of the explosion actually evaluated both parents, or whether a spurious 3rd parent (e.g. ambient air) would be erroneously included.
* Test 4 (`INV_PROCESS_THRESHOLD_CAUSAL_BRIDGE`) failed because it assumed the flawed single-parent `initiating_event_ref` model proven broken in Attack 4.

#### C. Whether Current Semantics Permit It
**YES.** The test specifications in Doc 17 lacked negative adversarial assertion clauses.

#### D. Invariant Violation
* Violates Verification & Audit Integrity.

#### E. Severity: **MINOR**

#### F. Minimal Architectural Correction
Rewrite all executable test specifications to include **Negative Exclusion Assertions** (asserting what MUST NOT be in `parent_refs`) and **Counterfactual Perturbation Runs** (mutating one parent and asserting the child fails to trigger).

---

## 3. Hostile Audit Vulnerability Summary

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CAUSAL SEMANTICS VULNERABILITY MATRIX                                     │
├──────┬───────────────────────────────┬──────────┬──────────────────────────────────────────────────────┤
│ No.  │ Attack Vector                 │ Severity │ Fatal Architectural Flaw Identified                  │
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **1**│ Overdetermination / Preempt   │ **FATAL**│ Naive counterfactual removal leaves deaths with zero │
│      │                               │          │ parents when two lethal events hit simultaneously.   │
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **2**│ Cyclic Feedback in Grappling  │ **MAJOR**│ Same-tick reactions can loop without strict wave     │
│      │                               │          │ stratification and wave-count caps.                  │
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **3**│ Preemptive Interception       │ **MAJOR**│ Defending a target is encoded identically to aiding  │
│      │                               │          │ the attacker; missing `PREEMPTIVE_DEFLECTION` edge.  │
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **4**│ Process Provenance Collapse   │ **FATAL**│ Intermediate rate modifiers (antidote, sprint) are   │
│      │                               │          │ deleted from long-term death causality chains.       │
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **5**│ Failed-Action Conflation      │ **MAJOR**│ Sound, visual cues, fatigue, and tactical ripostes   │
│      │                               │          │ are blurred under one generic `FAILURE_COUNTER` edge.│
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **6**│ Derived Field Mask Breakage   │ **FATAL**│ Encumbrance and derived stats fail string-mask match │
│      │                               │          │ against underlying item/inventory mutations.         │
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **7**│ Compaction Equivalence Loss   │ **MAJOR**│ Cold log sub-DAG reconstruction lacks Merkle backlink│
│      │                               │          │ index, risking $O(N)$ scans and semantic drift.      │
├──────┼───────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ **8**│ Tautological Test Specs       │ **MINOR**│ Tests lacked negative exclusion assertions.          │
└──────┴───────────────────────────────┴──────────┴──────────────────────────────────────────────────────┘
```

---

## 4. Mandatory Architectural Amendments

To make `/docs/17_causal_and_event_semantics.md` legally lockable, the following 6 mathematical and structural corrections MUST be applied:

1. **Amendment 1 (Restricted Actual Causality):** Replace naive counterfactual removal with Contingency-Based Actual Causality (`ACTUAL_CONTRIBUTOR_OVERDETERMINED` vs `JOINT_NECESSARY_CONTRIBUTOR`).
2. **Amendment 2 (Process Trajectory Provenance):** Mandate that continuous threshold events record all intermediate `PROCESS_RATE_MODIFIER` events in their parent vector.
3. **Amendment 3 (Derived Field Mask Expansion):** Implement recursive schema expansion from derived aggregate fields (`total_mass_kg`) to primitive constituent fields (`inventory/items[*]`).
4. **Amendment 4 (Typed Failure & Deflection Edges):** Formalize `PREEMPTIVE_DEFLECTION`, `SIGNAL_PROPAGATION_DEP`, `SOMATIC_FATIGUE_DEP`, and `TACTICAL_OPPORTUNITY_DEP`.
5. **Amendment 5 (Wave Stratification Invariant):** Enforce $\text{Wave}(B) > \text{Wave}(A)$ on all same-$T_w$ edges with an 8-wave same-tick ceiling.
6. **Amendment 6 (Cold Merkle Inversion Index):** Formalize the backlink index for historical cold chunks to guarantee sub-DAG reconstruction isomorphism.

---

## 5. Final Audit Verdict

### **LOCK STATUS: REJECTED (UNSAFE TO LOCK)**

`/docs/17_causal_and_event_semantics.md` contains 3 FATAL flaws (overdetermination collapse, process provenance deletion, derived field mask disconnect) and 4 MAJOR flaws. It CANNOT be locked until the 6 mandatory amendments are written into the formal specification.
