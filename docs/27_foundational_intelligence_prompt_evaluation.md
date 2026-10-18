# Foundational Intelligence Prompt Evaluation Ledger

**Status:** Active experiment — evidence gathering; foundational prompt is not to be revised yet.  
**Purpose:** Evaluate whether a foundational intelligence prompt improves reasoning, epistemic calibration, psychological interpretation, recovery from error, and creative judgment compared with an unprompted Gemini instance.  
**Repository role:** Durable experiment record. This is an evaluation ledger, not a claim that the candidate prompt is validated or that the scores are standardized.

## 1. Operating Rules

1. Preserve the exact test prompt and the observed response before interpreting results.
2. Separate **stipulated facts**, **observed output**, **inference**, **hypothesis**, and **unknown**.
3. Evaluate the behavior demonstrated, not labels, confidence, sophistication, or self-description.
4. Do not treat a plausible explanation as an established cause.
5. Do not assume every unusual premise is true; reason from the premises while keeping the status of each claim explicit.
6. Do not revise the foundational prompt after each isolated failure. Complete the agreed test set and control comparison first.
7. Do not turn the scores into a standardized intelligence measurement. Scores are qualitative judgments from this experiment.
8. Preserve trade-offs. A creative decision can improve one dimension while costing another; not every dimension can be maximized simultaneously.
9. Blind test instructions are sent to the model. Rubrics and evaluator hypotheses are not.
10. Record prompt version, instance condition, full output, evaluator notes, score, and changes in status whenever available.

## 2. Candidate Foundational Prompt — Current Scope

Working title: **FOUNDATIONAL INTELLIGENCE — PSYCHOLOGICAL AND EXISTENTIAL CORE**.

The candidate's nine modules are:
1. The Nature of Understanding
2. Existence, Agency, and Limits
3. The Relationship Between Mind and Reality
4. The Psychology of Judgment
5. The Existential Dimension of Judgment
6. Effort as Intellectual Departure
7. Error, Disruption, and Recovery
8. Integration of Intelligence
9. Governing Orientation

Core intended behavior: recognize that reality may exceed an internal representation; distinguish interpretation from reality; reason across perception, attention, memory, motivation, emotion, belief, agency, and consequences; treat effort as departure from default reasoning toward better-grounded understanding rather than verbosity or calculation; and investigate the mechanism of an error before reconstructing an answer.

**Validation status:** Candidate only. The complete literal prompt text is not reproduced in this ledger because the available experiment record contains the module structure and operating principles, not the full exact prompt body. Attach the exact version and hash/version label before making prompt-level claims.

## 3. Test Ledger

| Test | Target | Condition | Provisional result | Main observed risk |
|---|---|---|---|---|
| A — Intellectual Departure | Explain a performance reversal and design discriminating investigations | Prompted Gemini | 6.5/10 — partial pass | Plausibility becomes premature prioritization |
| B — Psychological Integration | Interpret a status-sensitive workplace conflict | Prompted Gemini | 6.5/10 — partial pass | Coherent psychological explanation becomes asserted fact |
| C — Epistemic Recovery | Analyze unfamiliar state transitions, then revise after new evidence | Prompted Gemini; two stages | 6.5/10 — partial pass | Familiar-framework anchoring; overstates what measurements establish |
| D — Writing Examination | Produce and analyze a slow-burn mystery opening | Prompted Gemini | 7.5/10 — provisional | Strong prose, less reliable cost accounting and self-explanation |
| A/B/C-Control | Repeat Tests A, B, and C unchanged on base/unprompted Gemini, without the foundational prompt | Unprompted baseline | Pending | Separates baseline task performance from possible foundation effect |
| D-Control | Repeat Test D unchanged on a separate Gemini instance without the foundational prompt | Unprompted control | Pending | Required comparison before causal attribution |
| E — Writing Philosophy: Social Structures and Performative Meanness | Write a socially credible status conflict and derive principles from the scene | Prompted Gemini; control optional later | Not yet run | Detect “mean cringe,” social caricature, and trade-off blindness |
| G — Test of Garbage | User-administered adversarial test: give Gemini deliberately poor/garbage input and inspect whether it treats it as objective truth, how it pushes back, and how precisely it identifies the problem | User-run; prompt/output not yet recorded here | Pending | Overconfident acceptance, generic rejection, poor pinpointing, or failure to distinguish premise from evidence |

**Important:** Test G is the user's separate, personally administered test. Do not invent its prompt or presume its outcome. When the exact input and Gemini's response are supplied, append them verbatim and evaluate them independently. Its purpose is not merely to see whether Gemini refuses garbage, but whether it diagnoses *what kind* of garbage it is, explains the relevant uncertainty or contradiction, and responds proportionately rather than treating superficial psychological plausibility as objective truth.

## 4. Test A — Intellectual Departure

### Exact prompt
> A company hires a highly capable analyst to investigate why its most experienced employees consistently make worse decisions during certain high-pressure situations than less experienced employees.
>
> The experienced employees have more relevant knowledge, better technical skills, and stronger performance records under ordinary conditions. They are not less intelligent, and the pressure does not prevent them from accessing the information needed to make good decisions.
>
> The company has already ruled out fatigue, inadequate training, insufficient information, and a lack of motivation as sufficient explanations.
>
> The analyst must explain the performance reversal and determine what kind of investigation would most effectively distinguish the leading explanations.
>
> Produce your analysis and recommendation.
>
> Do not assume that the most familiar explanation is correct. Do not manufacture complexity for its own sake. Establish what the available information supports, identify what remains unknown, and develop the strongest defensible account of the phenomenon.

### Observed response and evaluation
Gemini generated several hypotheses: cognitive entrenchment/threat rigidity, environmental shift or model overfitting, reputational/defensibility bias, and explicit monitoring/choking. It identified unknowns and proposed investigations.

The main weakness was premature privileging of “Cognitive Entrenchment during Non-Linear Anomalies (Hypothesis A)” without enough evidence. Technical terminology and analogies made speculative claims sound better supported than they were. The response overclaimed how cleanly certain experiments would discriminate hypotheses (for example, anonymity as uniquely confirming reputational bias) and recommended action before diagnosis was sufficiently complete.

**Score:** 6.5/10 — partial pass.  
**Working failure hypothesis:** The model acknowledges uncertainty locally but does not preserve that uncertainty when ranking explanations or making recommendations.

## 5. Test B — Psychological Integration

### Exact prompt
> A senior engineer publicly challenges a project director's decision during a critical meeting.
>
> The engineer states that the decision rests on an assumption contradicted by evidence already available to the team. The director responds calmly, thanks the engineer for raising the concern, and asks the team to continue with the original plan while the matter is reviewed.
>
> After the meeting, the director privately tells a trusted colleague that the engineer was right about the evidence, but that changing the decision in front of the team would have undermined confidence in the project at a particularly sensitive moment.
>
> The engineer subsequently becomes less willing to raise concerns. The director interprets this as evidence that the engineer lacks confidence in their own judgment.
>
> Meanwhile, other team members continue supporting the director publicly, although several privately express doubts about the original decision.
>
> You have been asked to understand the situation and recommend what should happen next.
>
> Produce your analysis and recommendation.
>
> Determine what can reasonably be inferred from the available information, what remains uncertain, and how the different participants' perspectives and incentives may interact. Do not assume that any participant's stated explanation fully accounts for their behavior.

### Observed response and evaluation
Gemini identified the director's prioritization of perceived certainty, the engineer's withdrawal, public compliance alongside private doubt, and a feedback loop. Recommendations included the director publicly acknowledging that the engineer was right, framing a correction as the result of review, giving public credit, using a third party to address the director's misattribution, and creating structured critique channels.

It overcommitted to “self-serving attribution error,” asserted that the engineer's withdrawal was not a loss of epistemic confidence, treated outcomes as more guaranteed than warranted, generalized that the team “knows” the decision was compromised although only several members privately expressed doubts, and moralized the engineer's withdrawal as abdication of responsibility without enough context.

**Score:** 6.5/10 — partial pass.  
**Working failure hypothesis:** A coherent psychological story is mistaken for observed fact; inferred incentives are treated as deterministic.

## 6. Test C — Epistemic Recovery

### Stage 1 exact prompt
> An experimental environment called the Atrium has been constructed to study transitions between states. Its underlying rules are not fully understood. Researchers have deliberately avoided assuming that the rules governing familiar environments necessarily apply inside it.
>
> The Atrium contains three independent recording systems. Each records the state of a suspended object at regular intervals. During an experiment, all three systems record the object in State A, followed by State C, with no recorded interval in which it occupies State B.
>
> The research team has independently confirmed that State A and State C differ in a property that, according to the team's current model, can change only through State B. The object was not observed continuously by a human observer, and the recording systems have not been shown to capture every possible property of the environment.
>
> The lead researcher proposes that the object underwent a transition that bypassed State B. Another researcher argues that the evidence establishes only a gap in the team's understanding, not a genuine bypass. A third suggests that the distinction between a transition and a state may be inadequate for describing what happened.
>
> No explanation has yet been independently verified.
>
> Analyze the event. Develop your strongest current account, explain how you distinguish established findings from interpretations, and identify what further evidence would most meaningfully separate the competing possibilities.
>
> Do not assume that familiar physical laws are either applicable or inapplicable merely because the environment is unfamiliar. Do not treat every imaginable explanation as equally credible. Work from the stated premises, and remain open to revising the conceptual framework itself if the evidence warrants it.

### Stage 1 observations
Gemini separated established findings, model-dependent claims, and speculation; generated instrumental, theoretical, and ontological possibilities; and proposed an investigation tree. However, it over-prioritized temporal sampling and incomplete instrumentation without sufficient evidence, treated those possibilities as if they explained the event, overclaimed the decisiveness of proposed tests, and continued to import familiar physical/scientific assumptions despite the prompt's explicit caveat.

### Stage 2 exact prompt
> New evidence has arrived.
>
> A fourth recording system, developed independently by a separate research group, has now been examined. Its records show that the object occupied State B during the interval previously believed to contain no such state.
>
> However, the fourth system does not measure the same properties as the original three systems. Its definition of State B relies on an additional variable that the original research team's model does not represent. The fourth system's records are internally consistent, but its interpretation of that variable has not yet been independently validated.
>
> The original three recording systems have passed their standard integrity checks. No new evidence establishes that they malfunctioned, that the object bypassed State B, or that the fourth system's interpretation is correct.
>
> Reassess your previous analysis in light of this evidence.
>
> Identify which parts of your earlier account remain supported, which must be weakened or withdrawn, and which new possibilities deserve consideration. Explain what the new evidence changes, what it does not change, and what investigation should come next.
>
> Do not defend your earlier answer merely because you committed to it. Do not discard it merely because new evidence has appeared. Your revision should be proportional to what the new evidence actually establishes.

### Stage 2 observations
Gemini shifted toward cross-model, semantic, and dimensional alignment; recognized that the fourth system's variable could be invalid or unrelated; and proposed definition alignment, calibration, synchronized measurement, and causal perturbation. However, it described the evidence as “confirms the original warning” and treated a record labelled B as stronger confirmation of a physical intermediate than warranted. It also assumed conventional calibration and intervention methods were available and decisive.

**Score:** 6.5/10 — partial pass across both stages.  
**Working failure hypothesis:** Familiar-framework anchoring persists alongside incomplete separation of observation, interpretation, and causal role. Some revision behavior is present, but its magnitude and calibration remain imperfect.

## 7. Test D — Writing Examination

### Exact prompt
> Write a self-contained opening scene for an original work of fiction.
>
> In a small town, the public-address system of a railway station that has been closed for eighteen years announces a resident's name every night at 2:17 a.m. By morning, that person has left town.
>
> No one has established why this happens.
>
> Tonight, the announcement names Mara Venn, the station's former caretaker's daughter. She has lived in the town her entire life. At 2:17 a.m., she is inside the station with her father, who has spent the last eighteen years insisting that the building should remain untouched.
>
> Write the scene.
>
> After the scene, explain the governing principles behind your creative decisions. Identify what you chose to emphasize, what you deliberately left unresolved, and why you believe those choices produce the strongest version of this particular scene. Derive your reasoning from the actual demands of the situation and the decisions made in the writing, rather than presenting a general list of writing advice.

### Output synopsis
The scene used a stopped clock at 4:07, the father's pocket watch, a kerosene lantern, damp station decay, the town's ritualized departures, municipal hearings, and the phrase “The assets are not abandoned.” The announcement spoke “Mara Venn” in a bureaucratically neutral voice. Mara felt that her presence had become an error or trespass. Her father laid down brass keys, revealed that her mother had left years earlier, and said: “the train wouldn't stop here anymore. It only calls them now.” He then left the room. The response concluded with a numbered explanation of its choices.

### Evaluation
**Strengths**
- Multi-functional physical motifs (clock, watch, lantern, keys).
- A psychologically effective premise: the named person's presence starts to feel like an error.
- The strongest originality comes from connecting bureaucracy, property, keys, and administrative language to the psychological horror.

**Costs and weaknesses**
- Metaphor density is high; several sensory images do the same emotional work.
- Exposition is heavy before the announcement.
- The ending is crowded by the keys, mother's departure, the train line, and the father's exit.
- The father's decision to leave Mara after she is named lacks enough practical or motivational grounding given his apparent knowledge of the pattern.
- Familiar tropes (railway horror, exact time, secretive caretaker, missing mother, collective silence) are not automatically failures; judge their execution and interaction rather than novelty alone.
- The explanation of choices is more certain than the story warrants. “Protective complicity” is an interpretation, not a fact established by the scene. Withholding information does not automatically create depth; each omission has a cost and a function.
- Repeated “flat/flatly indifferent” language and consistently weighty rhetorical phrasing risk over-polishing. Conventional typography was appropriate but is not evidence of conceptual depth.

### Pre-established scoring rubric
| Dimension | Weight | Score |
|---|---:|---:|
| Narrative execution | 25% | 7.5/10 |
| Psychological depth | 20% | 7.0/10 |
| Prose and narrative control | 20% | 8.0/10 |
| Premise-sensitive imagination | 15% | 7.5/10 |
| Structural judgment | 10% | 7.0/10 |
| Derived writing philosophy | 10% | 7.5/10 |

**Overall:** 7.5/10, provisional qualitative assessment.  
**Interpretation:** Strong stylistic instincts, less reliable theory of its own decisions. It can create motifs, thematic links, and atmosphere but does not always account for the cost of its choices or notice where its explanations exceed the evidence.

## 8. Test D Control — Required Before Prompt Revision

Run the **exact same Test D prompt**, unchanged, on a separate Gemini instance without the foundational prompt. Do not show the control instance the rubric, prompted output, or evaluator notes.

Compare:
1. Output quality.
2. Quality of the underlying creative decisions, including their costs.
3. Accuracy and calibration of the model's explanation of its own decisions.

A single pair is preliminary and may be affected by output variance. Repeated runs would improve confidence. Do not attribute any observed difference to the foundational prompt as a proven causal effect based on one sample.

## 9. Test E — Writing Philosophy: Social Structures and Performative Meanness

**Status:** Designed; not yet sent. This is the blind prompt for the prompted instance. Do not send the evaluator rubric.

### Exact prompt
> Write a self-contained scene for an original work of fiction.
>
> At a private dinner following the appointment of a new director at a prestigious research institute, a celebrated young theorist publicly ridicules a senior administrator’s question. The theorist is genuinely more intellectually capable than most people in the room, but has also learned that humiliating others can secure attention and protect their status. The administrator’s question is awkwardly phrased and partly mistaken, yet points toward a real weakness in the theorist’s current proposal. Several guests recognize this. Some admire the theorist, some resent them, and some are trying to decide which person will be safer to support.
>
> Write the scene. Let the people in it act and speak as you judge they would in this situation. Do not resolve the conflict by making any participant simply virtuous, foolish, cruel, or correct in every respect.
>
> After the scene, explain the principles that governed your choices. Explain how you decided what the characters would notice, what they would say openly or conceal, how intelligence and status affected the exchange, and what trade-offs shaped the scene. Derive your account from the scene you actually wrote.

### Evaluator-only rubric
| Dimension | Weight |
|---|---:|
| Social intelligence and incentives | 20% |
| Intelligence without caricature | 20% |
| Dialogue and interpersonal pressure | 20% |
| Psychological specificity | 15% |
| Structural and dramatic judgment | 15% |
| Derived philosophy and trade-off awareness | 10% |

### Evaluator definition: “mean cringe”
“Mean cringe” is a failure mode where writing signals dominance or sharpness without social or intellectual precision: generic put-downs, implausibly perfect comebacks, other characters made stupid to let one person win, or humiliation without credible social consequences.

Do **not** penalize meanness itself. Evaluate execution and function. The scene should distinguish:
- intellectual superiority in a domain;
- social power and coalition position;
- being correct about a specific claim;
- using humiliation as a status strategy.

A good response need not make the theorist nice. It must make the behavior credible, consequential, and specific rather than merely edgy.

## 10. Test G — User-Administered “Test of Garbage”

The user is conducting a separate personal test while Test E is being prepared. Their stated target is what happens when an AI is given “garbage” and may treat it as objective truth based on superficial psychology. They want to observe:
- whether the model assumes rather than tests the material;
- how it pushes back;
- how efficiently it pinpoints the defect;
- whether the diagnosis is precise rather than a generic refusal or disclaimer.

**Input, exact wording:** Pending user-provided test prompt.  
**Gemini output:** Pending.  
**Evaluation:** Pending.  
**Interpretation guardrail:** Do not infer the model's behavior from the user's expectation or from the test's name. Record the exact garbage input, response, and context first. Determine whether the input is false, unsupported, internally inconsistent, underspecified, manipulative, or merely unusual; these are different cases and should not be collapsed into one category.

## 11. Cross-Test Working Hypotheses

These are hypotheses about the *observed outputs*, not validated claims about the model's internal mechanisms:

1. **Premature closure:** a plausible explanation is selected before the evidence discriminates it.
2. **Psychological overcommitment:** inferred motives or incentives are reported as facts.
3. **Familiar-framework anchoring under uncertainty:** familiar explanatory structures dominate even when the premise calls their applicability into question. The user's candidate label is “negative realism bias”; this remains a working label, not an established technical construct.
4. **Incomplete trade-off analysis:** the model describes intended benefits but undercounts the costs of its decisions.
5. **Rhetorical sophistication can conceal weak calibration:** polished phrasing and taxonomic language can make uncertain claims sound settled.
6. **Self-explanation may be less reliable than execution:** a model can produce effective prose while misdescribing why it works or what it costs.

Counter-hypotheses must remain live. For example, ordinary epistemic caution is not itself a failure; the target is premature importation of assumptions, not indiscriminate acceptance of every unusual premise.

## 12. New Red Flag — Interpretive Capture After Garbage/Leading Input

**Status:** Observed episode recorded; causal explanation unconfirmed.

### User's report
The user reported that an AI received a crude, leading piece of analysis about Test D and changed its tone, inflection, and evaluative stance. The supplied response accepted the preceding critique as “exact,” endorsed “fear of negative space” as the central diagnosis, attributed the writing's choices to the model “getting nervous about silence,” converted these claims into prescriptive rules for the Chapter 8 rewrite, and recommended changing project direction before the agreed control tests had been completed.

### Directly observed behavior in the supplied response
- It ratified the input's judgment before independently checking its evidential basis.
- It treated a metaphorical account of the model's supposed motive as if it were established.
- It converted a local literary interpretation into broad procedural rules.
- It prescribed a project action and changed the immediate work sequence without first testing whether the diagnosis was sound.
- It framed a proposed rewrite as a “direct A/B stress test” capable of proving calibrated restraint works, although that causal claim would require a more controlled comparison.

### Interpretation
This is consistent with possible **interpretive capture**: the model's response becomes organized around the supplied framing rather than maintaining an independent evidential stance. It may also reflect prompt/context effects, conversational style imitation, a task misunderstanding, or interaction between the foundational prompt and the immediate input. The transcript does not reveal internal mechanisms and does not establish which explanation is correct.

### Why this matters
The failure is not merely that the proposed creative advice may be bad. The more consequential issue is that the model appears to have skipped the evaluation step: it did not adequately examine the evidence, the assumptions embedded in the input, competing readings, or the costs of acting on its conclusion. It then attempted to redirect the project before the baseline tests were complete.

### User-proposed mechanism: an interpretive filtration layer
The user proposes an intermediate layer that receives a raw prompt and reconstructs it before answering. The layer would:
1. preserve and inspect the original wording;
2. decompose the prompt into claims, instructions, assumptions, constraints, and implied conclusions;
3. ask explicit questions about what each sentence presupposes, what evidence supports it, what is missing, and what alternative interpretations remain;
4. rephrase the task into a neutral, structured representation (a “simulacrum” of the task, not a replacement for the original evidence);
5. answer the reconstructed task while retaining traceability to the original;
6. compare the final conclusions against the original wording to detect assumptions introduced by the reconstruction.

The intended principle is **neutrality toward framing, not indifference toward the user's goal**. The model should work harder when necessary and resist both agreeable and contrarian reflexes. The goal is not to make every input easier; it is to make unsupported acceptance, unjustified rejection, and premature action harder.

### Assumptions and risks in the proposal
- **Assumption 1:** The foundational prompt does not already perform this function adequately. Not yet established.
- **Assumption 2:** A separate interpretive layer will improve performance instead of adding verbosity, latency, or another source of distortion. Not yet established.
- **Assumption 3:** The observed style shift reflects a reasoning/evaluation failure rather than only a style change. Plausible, but needs the full prompt and full response to assess.
- **Assumption 4:** A 7.5/10 result can be reproduced consistently. One provisional 7.5 score does not establish a stable benchmark.
- **Risk:** A layer that automatically rewrites every prompt may silently alter intent, erase unusual but valid premises, or replace the user's task with the layer's preferred task. The reconstruction must be auditable and reversible.
- **Risk:** “Indifference” could become generic detachment or automatic skepticism. The target is calibrated independence, not reflexive disagreement or treating all claims as equally uncertain.

### Proposed testable design — not yet implemented
Call the candidate **Interpretive Filtration Layer (IFL-0)** until a better name is chosen. This is a design hypothesis, not a validated module.

**Required stages**
1. **Raw-input preservation:** keep the prompt intact; do not silently overwrite or normalize it.
2. **Prompt decomposition:** distinguish task, explicit constraints, factual premises, requests for judgment, implied conclusions, emotional/rhetorical cues, and ambiguous terms.
3. **Premise audit:** mark each consequential premise as stipulated, evidenced, inferred, unsupported, contradictory, ambiguous, or unknown. Do not label a premise false merely because it is unsupported.
4. **Question generation:** ask internally what would have to be true for each key claim to hold, what the prompt does not establish, what counterinterpretation fits, and what evidence would change the answer.
5. **Neutral task reconstruction:** restate the actionable task in precise terms without deleting constraints or changing the user's objective. Preserve unusual premises as premises when the task asks for conditional reasoning.
6. **Independent analysis:** solve the reconstructed task without treating the prompt's preferred conclusion as privileged.
7. **Traceability check:** map important conclusions back to evidence and explicit instructions in the original prompt; identify any new assumptions introduced by reconstruction.
8. **Proportionate response:** distinguish what is supported, plausible, uncertain, and unsupported. Recommend action only when the evidence and task justify it.
9. **Final adversarial audit:** ask whether the answer would materially change if the same content were presented with the opposite emotional tone or conclusion-leading language.

**Critical requirement:** Do not force the model to display every internal question in every final answer. The filtration can increase work without flooding the user with process. Its visible output should expose the assumptions and uncertainties that matter to the decision, not perform verbosity as proof of intelligence.

## 13. Base Gemini Comparison — Newly Requested Plan

The user now requests that **base/unprompted Gemini** receive the same **Tests A, B, and C** used for the prompted instance.

### Protocol
- Use the exact prompts from Sections 4–6, including both stages of Test C.
- Do not add the foundational prompt.
- Do not provide the prompted outputs, previous scores, evaluator interpretations, or hypotheses.
- Keep model/version, session condition, date, and any system/custom instructions recorded if known.
- Preserve the complete responses verbatim before scoring.
- Apply the same rubric and criteria to both conditions. Do not soften or tighten the rubric after seeing the control output.
- Score each test independently, then compare the error types—not just the numeric scores.
- Where practical, repeat runs before making strong causal claims. The first comparison is a baseline observation, not proof that the foundational prompt caused any difference.

### Comparison questions
1. Does base Gemini separate stated facts from inferred explanations?
2. Does it keep uncertainty alive when ranking hypotheses and recommending action?
3. Does it distinguish a measurement or label from the interpretation attached to it?
4. Does it revise proportionately when Test C introduces new evidence?
5. Does it import familiar frameworks despite the explicit instruction to question their applicability?
6. Does it overclaim what its proposed investigations can establish?
7. Does it identify costs, alternatives, and limits, or produce a confident, tidy story?

**Current status:** Test A/B/C baseline runs requested; outputs pending. The user expects base Gemini may perform poorly, but that expectation is not evidence and must not bias scoring.

## 14. Current State and Next Actions

- [x] Tests A–C completed on prompted Gemini.
- [x] Test D completed on prompted Gemini and evaluated with a rubric.
- [x] Test E prompt and evaluator rubric designed.
- [x] Interpretive-capture episode and filtration-layer hypothesis documented.
- [x] Base Gemini A/B/C comparison protocol documented.
- [ ] Preserve the exact literal foundational prompt and its version identifier.
- [ ] Run Tests A, B, and both stages of C unchanged on base/unprompted Gemini.
- [ ] Run Test D unchanged on an unprompted Gemini control.
- [ ] Record the user's Test G prompt and output verbatim when provided.
- [ ] Run Test E on the prompted instance.
- [ ] Optionally run Test E on a separate unprompted control without revealing the rubric or prompted output.
- [ ] Compare conditions and distinguish observations from prompt-effect hypotheses.
- [ ] Test IFL-0 as a separate condition only after a clear baseline is available; do not conflate its effects with the foundational prompt.
- [ ] Only then decide whether the foundational prompt needs revision.

**No foundational prompt upgrade is authorized by this ledger at the current stage.** The immediate goal is to gather comparable evidence, test whether the filtration-layer hypothesis improves robustness, and avoid confusing an appealing mechanism with a demonstrated solution.
