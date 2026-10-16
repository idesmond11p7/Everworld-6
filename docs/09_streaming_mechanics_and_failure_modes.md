# Forensic Analysis Pass 2: Streaming, Adapters, Macros & Failure Modes

## 1. Streaming Mechanics & SSE Chunk Processing

### `SOURCE FILE`: `public/scripts/openai.js` / `public/scripts/sse-stream.js`
### `CONFIDENCE`: **CONFIRMED IN SOURCE**

### The Physical SSE Trace:
```
[Node.js Express Backend]                                [Browser Client]
  │                                                        │
  ├── Opens HTTP 200 with `Content-Type: text/event-stream`│
  │                                                        │
  ├── Pipes upstream LLM chunks:                           │
  │   `data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n`
  │                                                        ├──> `EventSource` or `fetch().body.getReader()`
  │                                                        │     └──> Receives Uint8Array chunk
  │                                                        │     └──> TextDecoder converts to UTF-8
  │                                                        │     └──> Splits buffer by `\n\n`
  │                                                        │
  │                                                        ├──> Loop over split frames:
  │                                                        │     ├── If line starts with `data: [DONE]`: Close stream
  │                                                        │     ├── Parse JSON: `JSON.parse(line.slice(6))`
  │                                                        │     ├── Extract `delta.content` (e.g. "Hello")
  │                                                        │     ├── Append to accumulated string `streamingText`
  │                                                        │     ├── Emit `eventSource.emit(STREAM_TOKEN_RECEIVED, chunk)`
  │                                                        │     └── Update DOM `.mes_text` directly
```

### Streaming Edge Cases & Interrupted Streams:
1. **Split-Boundary Chunks:** Multi-byte Unicode characters (e.g. emojis or CJK glyphs) or JSON payloads split across TCP buffer packets are buffered in an uncompleted chunk string until the delimiter `\n\n` is encountered.
2. **User Abort / Cancel:**
   * User clicks "Stop" button $\to$ invokes `AbortController.abort()` on the active client-side `fetch`.
   * Client closes connection.
   * **Persistence Behavior on Abort:** SillyTavern pushes the **partial text generated so far** into `chat[]` and calls `saveChatDebounced()`. The incomplete generation is **not discarded**; it becomes a valid assistant message in history.

---

## 2. World Info / Lorebook Matching Engine

### `SOURCE FILE`: `public/scripts/world_info.js`
### `FUNCTION`: `checkWorldInfo(chat, options)`
### `CONFIDENCE`: **CONFIRMED IN SOURCE**

```
                     [LOREBOOK SCANNING ALGORITHM]
                                  │
                                  ▼
 1. Extract Scan Buffer:
    - Text of last `scan_depth` messages in chat
    - Optional: User Input textarea text
    - Optional: Persona Description & Character Card Definitions
                                  │
                                  ▼
 2. Iterate through all active Lorebook entries:
    ├── (A) Check `constant === true` -> IF true: ACTIVATE IMMEDIATELY
    │
    ├── (B) Evaluate Primary Keys (Comma-separated or Regex):
    │       - Check if any primary key string exists in Scan Buffer.
    │       - IF NOT FOUND: Skip entry.
    │
    ├── (C) Evaluate Secondary (AND / Selective) Keys (if enabled):
    │       - Check if at least one secondary key exists in Scan Buffer.
    │       - IF NOT FOUND: Skip entry.
    │
    └── (D) Evaluate Exclusion (NOT) Keys (if enabled):
            - Check if any exclusion key exists in Scan Buffer.
            - IF FOUND: DEACTIVATE entry (Skip).
                                  │
                                  ▼
 3. Recursion / Cascading Activation (`recursive_scanning`):
    - When Entry A activates, its content is appended to the Scan Buffer.
    - Scanner re-evaluates all remaining unactivated entries against the new buffer.
    - Controlled by `max_recursive_steps` (default: 2–5 passes).
                                  │
                                  ▼
 4. Slot Sorting & Insertion Routing:
    - Sort activated entries by their numeric `order` property (Ascending or Descending).
    - Route to designated slots: `before_defs`, `after_defs`, `system_top`, `@ Depth X`.
```

---

## 3. Macro Resolution Lifecycle & Timing

### `CONFIDENCE`: **CONFIRMED IN SOURCE**

Macros do **not** resolve simultaneously; they resolve in distinct stages across the pipeline:

| Macro Category | Examples | Resolution Timing | Where Mutation Occurs |
| :--- | :--- | :--- | :--- |
| **Identity & Names** | `{{char}}`, `{{user}}` | Assembled Prompt construction | Replaced during `substituteParams()` in memory before token count. Stored `.jsonl` files retain raw macro if in card definition. |
| **Dynamic Inputs** | `{{input}}`, `{{lastMessage}}` | Trigger execution | Evaluated against current active UI state at the moment `Generate()` is called. |
| **Temporal / Clock** | `{{time}}`, `{{date}}` | Generation execution | Evaluated against client machine's local JavaScript `Date()`. |
| **State Mutators** | `{{setvar::k::v}}` | Parsing pass in `substituteParams()` | **Side effect:** Mutates `chat_metadata.variables[k] = v`. **Output in prompt:** String is stripped and replaced with `""`. |
| **State Readers** | `{{getvar::k}}` | Parsing pass in `substituteParams()` | Substituted with value from `chat_metadata.variables[k]` or `""` if undefined. |

---

## 4. Provider Adapters & Role Coercion

### `SOURCE FILE`: `public/scripts/openai.js` / `public/scripts/instruct.js`
### `CONFIDENCE`: **CONFIRMED IN SOURCE**

Provider adaptations are handled via specialized formatting functions before wire dispatch:

```
[Internal Canonical ST Messages Array]
[
  { role: "system", content: "Main System Prompt" },
  { role: "user", content: "Hello" },
  { role: "assistant", content: "Hi" },
  { role: "system", content: "[Depth 1 Directive: Be brief]" },
  { role: "user", content: "What is 2+2?" }
]
       │
       ├───> [ADAPTER: OpenAI / OpenRouter]
       │     └── Unaltered 1:1 pass-through (OpenAI supports mid-history system messages).
       │
       ├───> [ADAPTER: Anthropic Claude]
       │     ├── 1. Extracts index 0 system message -> Top-level `system: "Main System Prompt"` parameter.
       │     ├── 2. Scans history for `role: "system"` at depth:
       │     │      Coerces into `role: "user"` with format: `\n\n[System Note: Directive: Be brief]\n\n`.
       │     └── 3. Merges consecutive same-role messages into single turn.
       │
       └───> [ADAPTER: Google Gemini]
             ├── 1. Extracts system message -> `systemInstruction: { parts: [{ text: "..." }] }`.
             ├── 2. Converts `role: "assistant"` to `role: "model"`.
             ├── 3. Coerces mid-history `system` turns into `user` turns.
             └── 4. Merges consecutive identical roles to enforce strict `user` <-> `model` alternation.
```

---

## 5. Comprehensive Failure Modes Analysis

### `CONFIDENCE`: **CONFIRMED IN SOURCE & RUNTIME TRACE**

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       FAILURE MODES & BREAKDOWN MATRIX                                 │
├───────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────┤
│ Failure Scenario      │ Direct Mechanism / Root Cause            │ SillyTavern Handling / Behavior     │
├───────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────┤
│ 1. Context Overflow   │ Static blocks + World Info exceed model  │ Truncates chat history down to 0    │
│                       │ maximum context window.                  │ messages. If still overflow, raises │
│                       │                                          │ UI toast error; halts generation.   │
├───────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────┤
│ 2. Tokenizer Mismatch │ Client uses estimated 4 char/tok while   │ Request reaches provider; provider  │
│                       │ model uses custom BPE tokenizer.         │ rejects with HTTP 400 Context Length│
│                       │                                          │ Exceeded.                           │
├───────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────┤
│ 3. Extension Crash    │ Synchronous listener throws uncaught     │ Halts the entire EventEmitter chain.│
│                       │ exception inside `eventSource.on()`.     │ Subsequent extensions DO NOT run.   │
│                       │                                          │ Generation may abort or hang.       │
├───────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────┤
│ 4. Network Drop /     │ Socket disconnects during SSE chunk      │ UI displays error popup. Partial    │
│    Timeout            │ stream.                                  │ received tokens are saved in chat   │
│                       │                                          │ as truncated assistant turn.        │
├───────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────┤
│ 5. Disk Write Race /  │ Multiple rapid asynchronous calls to     │ `saveChatDebounced()` coalesces     │
│    Lock Collision     │ `POST /api/chats/save`.                  │ writes with a 500ms debounce timer. │
│                       │                                          │ Fast reloads before debounce can    │
│                       │                                          │ lose the most recent message turn.  │
├───────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────┤
│ 6. Role Rejection     │ Provider enforces alternating turns;     │ If adapter fails to merge, provider │
│                       │ two `user` messages sent consecutively.  │ returns HTTP 400 Bad Request.       │
└───────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────┘
```
