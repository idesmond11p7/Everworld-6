# Master Index: Forensic Reverse-Engineering of SillyTavern

This documentation repository contains the definitive, source-level reverse-engineering analysis of SillyTavern's architecture, prompt assembly pipelines, extension execution determinism, generation routes, state persistence, and provider adapters.

## Pass 1: Core Architectural Taxonomy
| Document | Core Focus |
| :--- | :--- |
| **`01_prompt_pipeline_architecture.md`** | 7-stage prompt assembly flow, World Info recursive keyword matching, macro substitution, backward history token budgeting, in-chat depth resolution, and provider wire formatting. |
| **`02_extension_system_and_injection.md`** | Extension directory structure, module boot sequence, the `eventSource` lifecycle hooks matrix, prompt injection via `setExtensionPrompt`, payload interception, and storage scopes. |
| **`03_model_behavior_and_constraints.md`** | Backend invariant matrix (OpenAI vs Claude vs Gemini vs TextGen), the role coercion problem with in-chat system messages, streaming SSE chunk mechanics, and attention/recency gradients. |
| **`04_runtime_lifecycle_and_state_matrix.md`** | End-to-end server & client boot lifecycles, full state serialization mapping (authoritative vs transient vs memory), and Character Card V2/V3 PNG metadata specifications. |

## Pass 2: Implementation Call Graphs & Stress Analysis
| Document | Deep Forensic Focus |
| :--- | :--- |
| **`05_call_graph_and_prompt_assembly.md`** | Exact source call hierarchy (`script.js` -> `openai.js` / `textgen.js`), step-by-step function execution trace of `prepareOpenAIMessages()`, and concrete data structures. |
| **`06_extension_execution_order_and_determinism.md`** | Directory loading order determinism, synchronous un-awaited `EventEmitter` invocation loops, mutation visibility across listeners, and race condition breakdowns. |
| **`07_generation_paths_and_divergence.md`** | Comprehensive route taxonomy: Normal, Regenerate, Swipe, Continue, Impersonate, Quiet/Background generation, Group Chat turn selection, and Chat Summarization. |
| **`08_prompt_mutability_matrix_and_state_authority.md`** | Stage-by-stage Mutability Matrix (Mutability, Persistence, Visibility) and State Authority Registry (authoritative disk paths, serialization formats, load/write paths). |
| **`09_streaming_mechanics_and_failure_modes.md`** | SSE frame splitting, AbortController cancellation and partial persistence, World Info cascading recursion algorithms, macro resolution lifecycle timing, provider adapter role coercion, and the 6 primary failure modes. |

## Everworld 6: Foundations, Contract & Substrate Derivation
| Document | Core Focus |
| :--- | :--- |
| **`10_definitive_behavioral_contract.md`** | Complete behavioral requirements, 7-domain digital twin definition, epistemic classification (Hard Invariants vs. Measurable Model Performance), Dimension 16 (Computational Resolution & Dormancy), and empirical acceptance tests. |
| **`11_minimum_computational_substrate.md`** | Requirement-to-Capability derivation, the 8 Irreducible Primitives (Exclusion Tests), Non-Core System boundaries, the 3 Foundational Questions, and the plain-language Substrate Definition. |
| **`12_formal_conceptual_structure.md`** | Formal conceptual ontology: Entity decomposition, Space boundaries/propagation, 7-domain World State, Causal Event Ledger lifecycle, continuous Processes, Tripartite Epistemics, Action Pipeline, Subjective Projection, Dimension 16 Fidelity Machine, Temporal Continuum, Authority Matrix, and the Minimum Relationship Graph. |
| **`13_verification_and_adversarial_audit.md`** | Hostile verification audit report: 5 corrected conceptual vulnerabilities, exclusion tests on all 11 primitives, and full contract requirement PASS/FAIL matrix. |
| **`14_structural_schema_specification.md`** | Formal Structural Schema Specification: field-level records for Lineage, Spaces/Apertures, Somatics/Items, Tripartite Epistemics/Psychology, Processes (Φ), Action Proposals, Causal Event Ledger, and the 12-vector Adversarial Schema Audit. |
| **`15_state_transition_semantics.md`** | Formal State Transition Semantics: World State evolution operators, 7-stage Causal Event lifecycle, dual-write atomic commit/rollback, Topological Generation Waves ($W_k$), Piecewise continuous process contracts, Causal Coordinate ordering ($\mathbf{C}_{\text{event}}$), Harmonic Epistemic Integration, and Scaled Integer multi-platform determinism. |
| **`16_hostile_audit_state_transitions.md`** | Two-stage hostile verification audit report on State Transition Semantics: failure dissection of arbitrary bounds, float non-determinism, environmental priority inversions, and their mathematically closed replacements. |
| **`17_causal_and_event_semantics.md`** | Formal Causal and Event Semantics: Causal DAG formulation ($\mathcal{G}_{\text{causal}}$), 4-origin event taxonomy, multi-parent process-event confluence, negative/failure causality propagation, fine-grained field dependency tracking, snapshot compaction invariants, and executable test specifications. |
| **`18_hostile_audit_causal_semantics.md`** | Hostile verification audit report on Causal & Event Semantics: failure dissection of naive counterfactuals under overdetermination, process provenance collapse, derived field mask breakage, and the 6 mandatory architectural amendments. |
| **`19_re_audit_causal_semantics.md`** | Second-order hostile re-audit report on Causal & Event Semantics: failure dissection of the arbitrary 8-wave ceiling and contingency preemption chains, resulting in Natural Propagation Delay ($\tau_{\text{prop}}$) and Active Directed Path Invariants. |
| **`20_third_order_hostile_audit_causal_semantics.md`** | Third-order hostile audit report: exposing the hand-waving in continuous gradient calculus, "absorbing zero" moral laws, and artificial biological intent limits. |
| **`21_formal_causal_ledger_and_attribution_specification.md`** | **Doc 17 (Definitive Specification):** The formal, hardened structural contract for the Causal Ledger DAG, 13 Rejection Invariants, typed Quantitative Vectors, 4-Tuple Omission Inference Pipeline, and Canonical Equivalence. |
| **`26_master_upstream_ai_synchronization_briefing.md`** | **Master Upstream AI Synchronization Briefing:** Complete context restoration, implementation status, codebase map, and forward instructions to re-align the upstream AI model. |

## Experimental Prompt Evaluation
| Document | Core Focus |
| :--- | :--- |
| **`27_foundational_intelligence_prompt_evaluation.md`** | Active evaluation ledger for a candidate foundational intelligence prompt: blind Tests A–E, a pending unprompted Test D control, user-run Test of Garbage, provisional scores, evaluator hypotheses, and a no-revision-before-comparison rule. |

---

*All analyses are classified according to strict confidence standards: `CONFIRMED IN SOURCE`, `DOCUMENTED BUT IMPLEMENTATION-DEPENDENT`, `INFERRED`, or `UNKNOWN`.*
