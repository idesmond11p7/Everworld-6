# Forensic Analysis: LLM Model Behavior Constraints & Invariants

## 1. Provider Differences & Wire Formats

SillyTavern abstracts multiple disparate LLM backend APIs into a unified interface. However, different providers impose strict physical invariants on the request payload. Violating these invariants results in hard HTTP 400 errors or silent prompt degradation.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   LLM BACKEND INVARIANT MATRIX                                         │
├─────────────────┬──────────────────────┬─────────────────────────┬──────────────────┬──────────────────┤
│ Feature / Rule  │ OpenAI / OpenRouter  │ Anthropic Claude        │ Google Gemini    │ Local / TextGen  │
├─────────────────┼──────────────────────┼─────────────────────────┼──────────────────┼──────────────────┤
│ System Prompt   │ Arbitrary role in    │ Top-level `system`      │ Top-level        │ Embedded in text │
│ Location        │ `messages[]` array   │ string parameter        │ `systemInstruction`│ via template stop│
├─────────────────┼──────────────────────┼─────────────────────────┼──────────────────┼──────────────────┤
│ Multi-System    │ Allowed anywhere     │ FORBIDDEN: System must  │ FORBIDDEN: Single│ Free-form text   │
│ Messages        │ in history array     │ be unified string       │ instruction part │ concatenation    │
├─────────────────┼──────────────────────┼─────────────────────────┼──────────────────┼──────────────────┤
│ Turn Order      │ Flexible (can have   │ STRICT: Must alternate  │ STRICT: Must     │ Determined by    │
│ Requirement     │ consecutive user/sys)│ `user` <-> `assistant`  │ alternate        │ instruct format  │
├─────────────────┼──────────────────────┼─────────────────────────┼──────────────────┼──────────────────┤
│ First Message   │ Any role             │ Must be `user`          │ Must be `user`   │ Any string       │
│ Role Constraint │                      │ (or system param)       │ (or system param)│                  │
├─────────────────┼──────────────────────┼─────────────────────────┼──────────────────┼──────────────────┤
│ Streaming       │ SSE (`data: {...}`)  │ SSE (`content_block`)   │ SSE Chunk Stream │ Raw token stream │
│ Mechanism       │                      │                         │                  │ (WebSocket/HTTP) │
├─────────────────┼──────────────────────┼─────────────────────────┼──────────────────┼──────────────────┤
│ Max Tokens      │ `max_tokens` or      │ `max_tokens` (required) │ `maxOutputTokens`│ `max_new_tokens` │
│ Parameter Name  │ `max_completion_tok` │                         │                  │                  │
└─────────────────┴──────────────────────┴─────────────────────────┴──────────────────┴──────────────────┘
```

---

## 2. In-Chat Injections & The "System Message at Depth" Problem

A frequent technique in advanced SillyTavern usage is injecting guidance or state updates at a specific depth (e.g. `@ Depth 1` or `@ Depth 2` from the bottom of chat). 

### How Different Backends Handle In-Chat System Injections:

1. **OpenAI / ChatML-based Local Models:**
   * An injection with `role: "system"` at `Depth 1` produces:
     ```json
     [
       { "role": "user", "content": "Hello!" },
       { "role": "assistant", "content": "Greetings." },
       { "role": "system", "content": "[Directives: Update posture.]" },
       { "role": "user", "content": "How are you today?" }
     ]
     ```
   * *Behavior:* OpenAI natively accepts this. The model treats the system message as an authoritative steering constraint inserted mid-dialogue.

2. **Anthropic Claude & Gemini APIs (The Role Coercion Problem):**
   * These APIs **reject** payloads containing `role: "system"` inside the conversation turns.
   * *SillyTavern Adaptation:* 
     * If the role is `system` inside chat history, ST **coerces** the message into a `user` turn or appends it to the adjacent `user` message with a formatted header:
       ```
       [System Note: Directives: Update posture.]
       
       How are you today?
       ```
   * *Behavior Consequence:* The LLM sees the injection **as if the user typed it**, altering the cognitive framing of the model (it may treat the instruction as user dialogue rather than a divine omniscient directive).

---

## 3. Streaming vs. Non-Streaming Lifecycle

When generating text, the pipeline behaves differently depending on whether streaming is enabled:

```
                          [USER HITS GENERATE]
                                    │
                                    ▼
                    [Prompt Assembled & Budgeted]
                                    │
                                    ▼
                 [POST /api/backends/.../generate]
                                    │
                   ┌────────────────┴────────────────┐
                   ▼                                 ▼
         [STREAMING: ENABLED]               [STREAMING: DISABLED]
                   │                                 │
                   ▼                                 ▼
     Server opens SSE connection        Server waits for full response
                   │                                 │
                   ▼                                 ▼
      Loops over incoming chunks:       Single JSON payload received
      - Parse chunk delta text          - Extract `.choices[0].message`
      - Emit `STREAM_TOKEN_RECEIVED`                 │
      - Live update DOM `.mes_text`                  ▼
                   │                    Render full message to DOM
                   ▼                                 │
     Stream closes (`[DONE]`)                        ▼
                   │                    Finalize message in `chat[]`
                   ▼                                 │
     Finalize message in `chat[]`                    ▼
                   │                    Emit `MESSAGE_RECEIVED`
                   ▼                                 │
     Emit `MESSAGE_RECEIVED`                         ▼
                   │                    Write to .jsonl file
                   ▼
     Write to .jsonl file
```

### Critical Invariants During Streaming:
* **Token Interception:** During streaming, extensions listening to `STREAM_TOKEN_RECEIVED` receive raw unformatted chunks. Attempting to parse markdown, JSON, or state updates mid-stream is susceptible to split-boundary errors (e.g. receiving half of a JSON tag across two separate chunks).
* **Swipe Mechanics:** If a user swipes during or after generation, the original message is not deleted; it is pushed to the `swipes[]` array inside `chat[i].extra.swipes`, and `swipe_id` increments.

---

## 4. Attention & Recency Bias (The "Lost in the Middle" Invariant)

LLM transformer architectures exhibit distinct attention gradients across long context windows:

```
ATTENTION WEIGHT
▲
│ ████████████                                            █████████████████
│ █ System   █                                            █ Latest Turns  █
│ █ & Persona█                                            █ & Injections  █
│ █ (Top)    █             ░░░░░░░░░░░░░░░░░░             █ (Bottom)      █
│ █          █             ░ Mid-Chat History ░           █               █
│ █          █             ░ (Lower Attention)░           █               █
└─┴──────────┴─────────────┴──────────────────┴───────────┴───────────────┴──►
  0                                                                       Context Max
```

### Consequences for SillyTavern Architecture:
1. **Top of Context (Primacy Effect):** High adherence. The system prompt and character card set the baseline persona, lexical style, and core boundaries.
2. **Middle of Context (Attenuation):** Messages between index 5 and index $N-5$ suffer from reduced retrieval weight if context exceeds 8,000–16,000 tokens unless explicitly referenced.
3. **Bottom of Context (Recency Effect):** Maximum adherence. Instructions placed at `Depth 0` (immediately after the last user message) or `Depth 1` (immediately before the last user message) exert the strongest steering force over the generated output.
4. **Author's Note Positioning:** This explains why SillyTavern's default Author's Note is set to `Depth 1` or `Depth 2`—placing state updates or tone guidance close to the output target maximizes model adherence.
