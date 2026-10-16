# Everworld 6 — Canonical Engine & Interactive Comic Runtime

A foundational software implementation of the Everworld 6 core engine: replacing theoretical documentation with an operational state store, authority-gated mutation contracts, cross-domain occurrence/coupling machinery, and an interactive graphic-novel runtime where the Dragon and Wanderer clash inside the Obsidian Sanctum.

## User Review & Critical Decisions

> [!IMPORTANT]
> This redesigned plan pivots directly from theoretical research to the concrete software engine and its interactive comic-book stage:

- **Core Engine Focus**: Pure software implementation of the canonical primitives extracted from architectural research:
  1. Authoritative state paths & domain ownership
  2. Identity decoupled from mutable state
  3. Occurrence proposal, validation, cross-domain coupling, and atomic transition
  4. Orthogonal continuous process ticker ($\Phi$)
  5. First-class modeling of epistemic horizons and indeterminate states
- **Interactive Experience**: Comic-book panel stage with real-time continuous process ticks, turn-based discrete action dispatch, live state path inspection, and causal DAG tracing.
- **Scenario**: The Obsidian Sanctum confrontation between **Ignis-Vorax (The Dragon)** and **Kaelen (The Wanderer)**.
- **Visual Design**: Authentic graphic-novel styling — high-contrast inked panel borders, dynamic halftones, speech/thought balloons reflecting internal epistemic states, and tactile action-burst sound effects.

---

## 1. Overview & Core Concept

### What It Does
Everworld 6 is an authoritative digital twin engine where world state is never a fragile text hallucination. It runs a deterministic, multi-domain state store governed by strict authority boundaries:
- **State Store**: Hierarchical state paths (e.g., `entities.kaelen.somatics.core_temp`, `sanctum.topology.apertures.dais`) with explicit domain ownership.
- **Authority Contracts**: Changes to physical reality, internal psychology, or somatic vitals can only be authored by authorized regimes or explicit cross-domain coupling rules.
- **Coupling Pipeline**: When a discrete event occurs (e.g. *Dragon releases Hellfire Convection*), the engine computes primary somatic impact, thermal topological diffusion, and secondary epistemic terror through explicit registered coupling contracts.
- **Continuous Background ($\Phi$)**: Sanctum heat radiation, ambient mana pressure, and somatic stamina decay update continuously over time $\Delta t$.
- **Comic Runtime Interface**: Users watch and manipulate this simulation through an expressive graphic-novel viewport where panels re-frame dynamically based on dramatic tension.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interactive Comic Stage (The Sanctum)**:
   - Dynamic comic panels framing the confrontation:
     - **Main Action Panel**: The Dragon coiled upon the Magma Dais and the Wanderer positioned at the obsidian gateway.
     - **Thought & Epistemic Bubbles**: Oval thought clouds revealing each entity's subjective belief graph (e.g., Kaelen believes the dais is solid ground; ground truth shows magma weakening beneath).
     - **Dialogue & Somatic Balloons**: Sharp speech bubbles with dramatic tails triggered by dialogue or physical exertion.
     - **Dynamic Sound-FX Burst**: Visual onomatopoeia (*KRRK*, *FWSSSH*, *BOOM*) exploding on panel impacts.
2. **Action Dispatch Deck**:
   - The user selects discrete actions for either entity or triggers environmental occurrences:
     - *Kaelen*: Inscribe Void Rune, Dash across Aperture, Cast Aegis, Seek True Name.
     - *Ignis-Vorax*: Incinerate Arc, Draconic Intimidation, Crush Obsidian Pillar, Dormant Slumber.
     - *Sanctum*: Magma Surge, Thermal Pulse, Collapse Archway.
   - Each action triggers the full pipeline: Proposal $\rightarrow$ Authority Check $\rightarrow$ Cross-Domain Coupling $\rightarrow$ Atomic Commit $\rightarrow$ Panel Animation.
3. **Canonical State Inspector**:
   - Toggle between **Entity Views** (Dragon vs. Wanderer) and **Sanctum Environment**:
     - *State Path Explorer*: Browse exact dot-notated paths and their owning regimes.
     - *Vitals & Somatics*: Tabular live metrics for temperature, metabolic energy, stress, and limb integrity.
     - *Epistemic Horizon vs. Ground Truth*: Side-by-side comparison of an entity's internal subjective beliefs vs. objective reality.
4. **Simulation Engine Controls**:
   - Continuous Process Ticker ($\Phi$): Start/Pause ambient drift, adjust tick frequency (100ms to 1s), single-step $\Delta t$, or reset to initial conditions.
5. **Causal Ledger & DAG Drawer**:
   - Open a ledger slide-out displaying the historical DAG of occurrences, complete with parent IDs, delta mutations, and verification status.

### Visual Identity & Theme (Comics Style)
- **Palette**:
  - *Paper Base (60%)*: Off-white vintage comic newsprint `#FDFBF7` with dark comic ink `#0F172A` in dark mode.
  - *Inked Surfaces (30%)*: High-contrast white panels with bold `#18181B` inked borders (`border-3 border-black`), offset drop shadows (`shadow-[4px_4px_0px_#000000]`), and halftone dot accents.
  - *Dramatic Accents (10%)*: Dragon Flame Crimson `#E11D48`, Arcane Wanderer Cobalt `#2563EB`, and Magma Gold `#F59E0B`.
- **Typography**:
  - *Headlines & Sound FX*: Bold, condensed neo-grotesque display (`Bricolage Grotesque` / `Outfit`) with uppercase letterforms.
  - *Dialogue & Descriptions*: Expressive readable comic sans (`Plus Jakarta Sans`).
  - *State Paths & Coordinates*: Monospace tabular figures (`font-mono tabular-nums`).

---

## 3. Key Product Decisions & Trade-Offs

- **Executable TypeScript Engine Core**:
  - *Chosen*: Implement the core state store, authority manager, and coupling engine in pure TypeScript in `src/core/`.
  - *Why*: Provides instant execution, total type safety, zero external network dependency, and deterministic simulation replay.
- **Coupling Pipeline Over Monolithic Updates**:
  - *Chosen*: Cross-domain mutations (e.g. physical force causing psychological terror) must pass through explicit `CouplingRule` registrations rather than ad-hoc state mutations.
  - *Why*: Directly preserves the core architectural finding that cross-domain effects must be explicit and auditable.
- **High-Impact Graphic Novel Presentation**:
  - *Chosen*: Custom SVG-based and styled-panel comic aesthetics with illustrated character representations.
  - *Why*: Bridges rigorous mathematical state mechanics with high-fidelity storytelling, making abstract state paths immediately graspable.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EVERWORLD CORE ENGINE                           │
│                                                                        │
│   ┌────────────────────────┐            ┌──────────────────────────┐   │
│   │   Identity Registry    │            │   Continuous Process     │   │
│   │   • EntityId handles   │            │   Engine (Φ Dynamics)    │   │
│   │   • Lineage metadata   │            │   • Thermal diffusion    │   │
│   └───────────┬────────────┘            │   • Somatic fatigue      │   │
│               │                         └────────────┬─────────────┘   │
│               ▼                                      ▼                 │
│   ┌────────────────────────────────────────────────────────────┐       │
│   │               Authoritative State Store                    │       │
│   │   • Path-based addressing (e.g. entities.kaelen.somatics)   │       │
│   │   • Regime ownership registry & write-permission masks     │       │
│   │   • Ground truth + Epistemic subjective projections        │       │
│   └─────────────────────────────┬──────────────────────────────┘       │
│                                 │                                      │
│                                 ▼                                      │
│   ┌────────────────────────────────────────────────────────────┐       │
│   │               Occurrence & Coupling Engine                 │       │
│   │   1. Discrete Event Proposal                               │       │
│   │   2. Authority & Invariant Validation                      │       │
│   │   3. Cross-Domain Coupling Cascade (Topological Wave)      │       │
│   │   4. Dual-Phase Atomic Commit & Ledger DAG Inscription     │       │
│   └─────────────────────────────┬──────────────────────────────┘       │
│                                 │                                      │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      COMIC RUNTIME INTERFACE                           │
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │   Graphic Novel Stage     │      │   Authoritative Inspector   │   │
│   │   • Main Dramatic Panel   │      │   • State Path Tree Browser │   │
│   │   • Speech / Thought Bubs │      │   • Somatic Vitals Metrics  │   │
│   │   • Sound FX Explosions   │      │   • Epistemic Horizon Diff  │   │
│   └─────────────┬─────────────┘      └──────────────┬──────────────┘   │
│                 │                                   │                  │
│   ┌─────────────┴─────────────┐      ┌──────────────┴──────────────┐   │
│   │   Action Dispatch Deck    │      │   Simulation & DAG Deck     │   │
│   │   • Tactical entity moves │      │   • Live Φ Continuous Play  │   │
│   │   • Environmental triggers│      │   • Causal History Ledger   │   │
│   └───────────────────────────┘      └─────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Module Structure
- `src/core/state/`: `StateStore.ts` (path-based state tree, ownership check, commit/rollback), `types.ts`.
- `src/core/authority/`: `AuthorityRegistry.ts` (domain boundaries: Physical, Somatic, Cognitive, Environmental).
- `src/core/coupling/`: `CouplingEngine.ts` (cross-domain event propagation rules).
- `src/core/processes/`: `ContinuousEngine.ts` ($\Phi$ background drift execution).
- `src/core/ledger/`: `CausalLedger.ts` (immutable DAG of occurrences with parent pointers).
- `src/scenarios/`: `sanctum_scenario.ts` (seed data for Ignis-Vorax, Kaelen, and the Obsidian Sanctum).
- `src/components/comic/`: `ComicStage.tsx`, `ComicPanel.tsx`, `SpeechBubble.tsx`, `SoundBurst.tsx`.
- `src/components/inspector/`: `StateInspector.tsx`, `EpistemicDiff.tsx`, `SomaticTelemetry.tsx`.
- `src/components/controls/`: `ActionDeck.tsx`, `SimulationControls.tsx`, `CausalLedgerDrawer.tsx`.
