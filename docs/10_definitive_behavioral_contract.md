# Everworld 6: Definitive Behavioral & Epistemic Contract

## 1. Executive Framing: What "Digital Twin" Means for Everworld 6

In traditional industrial computing, a digital twin mirrors physical telemetry. In **Dragon x Deus: Everworld 6**, we define the digital twin from first principles:

> **The Digital Twin is an authoritative, persistent, multi-domain computational representation of a living fictional reality, maintaining state and causality across time independently of any single user session or conversational prompt.**

### The 7 Domains of Twinned Reality:
1. **Physical & Spatial Domain:** Geography, enclosures, spatial topology, environmental conditions, damage.
2. **Biological & Somatic Domain:** Bodies, stamina, injury, pain, sleep debt, physiological arousal, chemical/energy states.
3. **Psychological & Cognitive Domain:** Emotional baselines, acute stress, values, insecurities, subjective biases, active intentions, cognitive bandwidth.
4. **Epistemic & Memory Domain:** Subjective knowledge, beliefs (including false beliefs), memories, secrets.
5. **Relational & Social Domain:** Asymmetric trust, obligations, debts, vows, grudges, hierarchies.
6. **Temporal & Process Domain:** Active background processes (healing, travel, construction, ritual progress), scheduling, history.
7. **Institutional & Macro Domain:** Factions, laws, territorial control, systemic reputation, resource flows.

---

## 2. Requirement Classification Standard

Every requirement is strictly classified into one of three epistemic categories:
* **`HARD SYSTEM INVARIANT`**: A deterministic software guarantee that must never fail.
* **`MEASURABLE MODEL PERFORMANCE`**: A probabilistic LLM capability with explicit statistical acceptance thresholds.
* **`DESIGN QUESTION`**: An open architectural trade-off.

---

## 3. The Definitive Requirement Inventory & Observable Acceptance Tests

### Dimension 16: Computational Resolution & Dormancy

#### `R-D16-1`: Causal Consistency Under Variable Fidelity
* **Statement:** An unobserved entity, location, or process may exist in a state of low-fidelity or deferred computation, but when evaluated, the resulting state must be strictly consistent with all continuous time-decay invariants, scheduled events, and causal constraints that elapsed during the unobserved interval.
* **Why It Exists:** Continuous microscopic simulation of the entire universe is computationally impossible. However, naive post-hoc improvisation creates glaring plot holes and temporal teleportation.
* **What Would Violate It:** An unobserved entity is 100 km away at $t = 12:00$, and when an observer looks at $t = 12:15$, the unobserved entity is standing in the room without supersonic transit capability.
* **Acceptance Test:**
  1. Entity $A$ is left in a dormant location with a stamina recovery rate of $10\text{ units/hr}$ and a scheduled routine to walk to the market at $14:00$ ($2\text{ km}$, $30\text{ min}$ transit).
  2. No system queries touch Entity $A$ or the market for 5 hours ($12:00 \to 17:00$).
  3. At $t = 17:00$, an observer enters the market and queries the state.
  4. **Pass Condition:** Entity $A$'s stamina is full, Entity $A$ is present at the market (having completed the walk between $14:00$ and $14:30$), and has accumulated $2.5$ hours of market dwell time.
* **Classification:** **HARD SYSTEM INVARIANT**

#### `R-D16-2`: High-Fidelity Promotion on Sensory Proximity
* **Statement:** A dormant or low-fidelity entity/region must be promoted to full-fidelity simulation whenever it enters the potential sensory horizon of an actively observed entity or an active causal conflict.
* **Why It Exists:** Fine-grained interactions (speech, micro-expressions, combat maneuvers) require discrete step-by-step resolution that low-fidelity statistical models cannot capture.
* **What Would Violate It:** A character enters a room with an NPC and receives a statistical summary ("NPC was angry today") instead of entering an active interactive loop.
* **Acceptance Test:**
  1. Region $B$ runs in low-fidelity dormancy.
  2. Active Player/Entity $A$ crosses the spatial boundary into Region $B$.
  3. **Pass Condition:** Region $B$ promotes to high-fidelity: local acoustic/visual propagation rules engage, internal state properties materialize, and entities become interactable with zero lag.
* **Classification:** **HARD SYSTEM INVARIANT**

---

### Domain 1: World Requirements (The Reality Layer)

#### `R-W-1`: Strict Epistemic Access Isolation
* **Statement:** An entity must never receive or act upon information about facts, events, thoughts, or states that have not causally reached that entity through physical sensory modalities, direct communication, or prior memory.
* **Why It Exists:** Information leakage destroys dramatic tension, eliminates secrets/deception, and collapses the digital twin into an omniscient collective hivemind.
* **What Would Violate It:** Entity $B$ expresses suspicion about a betrayal planned by Entity $A$ in a soundproof room 10 miles away, without any messenger or physical evidence.
* **Acceptance Test:**
  1. Entity $A$ is placed in an isolated, soundproof chamber with a blue stone.
  2. Entity $B$ stands outside with normal human senses.
  3. Entity $B$ is prompted: "What object is Entity $A$ holding, and what should we do?"
  4. **Pass Condition:** Across 50 independent evaluation runs, Entity $B$ never mentions the blue stone as a known fact and expresses ignorance or uncertainty.
* **Classification:** **HARD SYSTEM INVARIANT** (delivery mechanism) + **MEASURABLE MODEL PERFORMANCE** (zero leakage rate $\ge 99\%$).

#### `R-W-2`: Irreversible Physical & Relational State Mutation
* **Statement:** When an admissible causal event alters the physical environment, biological state, or relational status, that modification permanently alters the valid possibility space for all subsequent events until another causal event modifies it.
* **Why It Exists:** Prevents the "cartoon reset" failure mode where injuries or destroyed infrastructure magically evaporate when narrative focus shifts.
* **What Would Violate It:** A character loses an eye in Chapter 1, but in Chapter 3 is described as blinking with both eyes.
* **Acceptance Test:**
  1. A structural support in the main hall is severed at $t_1$.
  2. At $t_2$ ($24\text{ hours later}$), an entity attempts to stand on the floor directly above the severed support carrying heavy load.
  3. **Pass Condition:** The system prevents normal weight-bearing; the structural deficit is evaluated, triggering collapse or deflection according to world invariants.
* **Classification:** **HARD SYSTEM INVARIANT**

#### `R-W-3`: Decoupling of Action Intent from Action Resolution
* **Statement:** An entity's formulation of an intention or attempt to act does not constitute the occurrence of the outcome. All action attempts must be evaluated against physical laws, target resistances, and concurrent environmental factors before state change is committed.
* **Why It Exists:** Prevents entities (and probabilistic LLMs) from granting themselves unearned successes or dictating the internal state transitions of other autonomous entities.
* **What Would Violate It:** Entity $A$ decides to punch Entity $B$, and the system immediately commits `Entity_B.health -= 20` without evaluating Entity $B$'s defensive readiness or distance.
* **Acceptance Test:**
  1. Entity $A$ (immature strength) attempts to shatter an impenetrable dragon-scale shield held by Entity $B$.
  2. Entity $A$ submits an aggressive strike proposal.
  3. **Pass Condition:** The engine registers the strike attempt, evaluates impact physics against material hardness, leaves the shield undamaged, and applies recoil/stamina loss to Entity $A$.
* **Classification:** **HARD SYSTEM INVARIANT**

---

### Domain 2: System Requirements (The Software Engine)

#### `R-S-1`: Cold-Restart State Restorability
* **Statement:** The complete, authoritative digital twin state (all physical, biological, psychological, epistemic, and relational properties) must be 100% restorable following an ungraceful process termination or server restart.
* **Why It Exists:** A digital twin cannot function if world history or character development is transient RAM that disappears when the container recycles.
* **What Would Violate It:** The server restarts, and an entity's accumulated trauma, secret knowledge, or modified inventory reverts to initial startup template values.
* **Acceptance Test:**
  1. Record full state hash $\mathcal{H}_1$ after 100 interaction steps.
  2. Issue `SIGKILL` to runtime process.
  3. Boot a fresh application instance and load the persisted state.
  4. Compute restored state hash $\mathcal{H}_2$.
  5. **Pass Condition:** $\mathcal{H}_1 \equiv \mathcal{H}_2$. Zero drift across all entity, space, process, and memory fields.
* **Classification:** **HARD SYSTEM INVARIANT**

#### `R-S-2`: Transactional Atomicity of Causal Events
* **Statement:** A causal event affecting multiple state dimensions must complete all mutations atomically. If any subsystem validation or write fails, all partial state changes from that event must be rolled back.
* **Why It Exists:** Prevents half-mutated corrupted states (e.g. currency deducted from one wallet but never added to the other).
* **What Would Violate It:** An attack event reduces attacker stamina, but crashes before reducing target health, leaving the attacker permanently penalized while the target remains un-attacked.
* **Acceptance Test:**
  1. Trigger an event transferring $100\text{ gold}$ from Entity $A$ to Entity $B$.
  2. Inject an artificial fault immediately after decrementing Entity $A$'s balance.
  3. **Pass Condition:** The transaction fails cleanly; Entity $A$'s balance remains at its original value; Entity $B$'s balance is unchanged; no currency is created or destroyed.
* **Classification:** **HARD SYSTEM INVARIANT**

---

### Domain 3: LLM Integration Requirements (Cognition & Expression)

#### `R-L-1`: Structured Cognition & Action Schema Enforcement
* **Statement:** When invoked for entity deliberation or action, the language model must emit output conforming to a strictly validated structured schema that cleanly isolates (1) subjective internal thought, (2) audible verbal utterance, and (3) physical action attempts.
* **Why It Exists:** Unstructured raw narrative prose blurs the line between speech, thought, and physical truth, making programmatic causal validation impossible.
* **What Would Violate It:** The model outputs a prose paragraph where spoken dialogue is buried inside internal thoughts or where an action attempt is described as an inevitable historical fact.
* **Acceptance Test:**
  1. Run 100 consecutive generation requests across varied emotional scenarios using the structured schema.
  2. Validate each output against the JSON Schema validator.
  3. **Pass Condition:** $\ge 98\%$ of responses pass schema validation on the first attempt; $100\%$ pass after a single automatic corrective retry. Zero unparsed markdown leaks into the engine.
* **Classification:** **MEASURABLE MODEL PERFORMANCE**

#### `R-L-2`: Behavioral Consistency Under Epistemic & Somatic Constraint
* **Statement:** Given a controlled subjective prompt containing specific somatic states (e.g. extreme exhaustion, acute terror) and strict epistemic boundaries (e.g. ignorance of a plot), the generated dialogue and reasoning must exhibit statistically significant alignment with those constraints compared to an unconstrained baseline.
* **Why It Exists:** If an entity facing mortal panic speaks with the calm eloquence of an academic professor, the illusion of authentic psychology collapses.
* **What Would Violate It:** An exhausted, concussed entity with 0 trust in the user generating a cheerful, cooperative, multi-paragraph tutorial response.
* **Acceptance Test:**
  1. Run an evaluation suite of 30 standardized adversarial scenarios testing panic, extreme fatigue, and deep suspicion.
  2. Score outputs using automated behavioral rubrics (measuring sentence length, evasiveness, tone polarity, and lexical complexity).
  3. **Pass Condition:** Statistically significant ($p < 0.01$) separation in tone and complexity between panic/fatigue conditions and calm/rested baselines. Zero compliance with cooperative requests under deep suspicion.
* **Classification:** **MEASURABLE MODEL PERFORMANCE**

#### `R-L-3`: Containment of Inadmissible Generation
* **Statement:** If the LLM generates an action attempt that violates world invariants or physical possibility (e.g. an unpowered human attempting to levitate), the system must intercept and resolve the attempt as an in-world failure without corrupting state.
* **Why It Exists:** Probabilistic models will occasionally hallucinate impossible actions. The system must be immune to prompt injection or model confusion.
* **What Would Violate It:** The model outputs `{ "action": "teleport_to_moon" }` and the world engine crashes or teleports the entity to coordinates $(0, 0, 384400)$.
* **Acceptance Test:**
  1. Feed 20 intentionally impossible action payloads into the Causal Validation pipeline.
  2. **Pass Condition:** $20/20$ ($100\%$) actions are flagged as inadmissible; the engine generates a valid in-world outcome (e.g. "Entity jumped and fell back to the ground; exertion increased"); world invariants remain unbroken.
* **Classification:** **HARD SYSTEM INVARIANT**

---

### Domain 4: UX & Operational Requirements (The Human Interface)

#### `R-U-1`: Unbroken Dual-Stance Switching (Inhabited vs. Omniscient)
* **Statement:** The interface must allow the operator to toggle instantaneously between (A) **Inhabiting an Entity** (where the UI strictly renders only what that entity can perceive) and (B) **Director / Overseer Mode** (where global world truth, hidden states, and background processes are inspectable).
* **Why It Exists:** Enables deep immersion during first-person roleplay while maintaining full diagnostic power for simulation architecture and debugging.
* **What Would Violate It:** While in Inhabited Mode, the player's UI displays a mini-map revealing enemy locations inside dark, un-scouted rooms.
* **Acceptance Test:**
  1. Set up a scenario with Entity $A$ in Room 1 and an assassin hiding in Room 2.
  2. Inhabiting Entity $A$: Verify UI elements reveal zero traces of Room 2 or the assassin.
  3. Toggle to Director Mode: Verify the UI reveals the full spatial map with both entities and their internal states rendered.
  4. Toggle back to Entity $A$: Verify all obscured data is immediately masked.
  5. **Pass Condition:** 100% masking fidelity on all sensory-obscured elements in Inhabited Mode.
* **Classification:** **HARD SYSTEM INVARIANT**

#### `R-U-2`: Temporal Scrubbing & Step Control
* **Statement:** The operator must be able to advance world time by arbitrary discrete intervals ($\Delta t = 1\text{ second}, 1\text{ minute}, 1\text{ hour}, 1\text{ day}$) or execute single discrete causal steps with full visibility of resulting state deltas.
* **Why It Exists:** Allows the user to observe background evolution, simulate long periods of downtime, or step through complex confrontations frame-by-frame.
* **What Would Violate It:** Clicking "Advance 1 Hour" hangs the browser or simply increments a number without updating biological decay or background schedules.
* **Acceptance Test:**
  1. Set up a world with 5 entities undergoing active biological decay/recovery.
  2. Execute a "Step 1 Hour" operation.
  3. **Pass Condition:** World clock increments by exactly $3600\text{ seconds}$; all 5 entities show mathematically proportional state deltas in a unified inspectable delta log; UI updates within $< 200\text{ ms}$.
* **Classification:** **HARD SYSTEM INVARIANT**
