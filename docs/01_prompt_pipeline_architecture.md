# Forensic Analysis: SillyTavern Prompt Pipeline Architecture

## 1. Executive Summary & Core Mechanism
The SillyTavern prompt pipeline is an in-browser token assembly engine implemented primarily in `public/scripts/openai.js`, `public/scripts/instruct.js`, `public/scripts/world_info.js`, and `public/scripts/extensions.js`. 

The pipeline converts high-level abstractions (Character Cards, Lorebooks/World Info, User Personas, Context Presets, Extension States, and In-Memory Chat History) into a concrete, provider-compliant wire payload (e.g. OpenAI/Anthropic/Gemini `messages` arrays or raw TextGen string buffers).

```
                      [RAW STATE REPOSITORIES]
     ┌────────────────────────┬─────────────────────────┬───────────────────────┐
     │  Character Card (V2/V3)│  World Info (Lorebooks) │  Chat History (.jsonl)│
     │  - System Prompt       │  - Constant / Selective │  - Messages 0..N      │
     │  - Description/Mes     │  - Regex / Vector       │  - Swipes / Extra     │
     │  - Scenario / Examples │  - Position / Depths    │  - Chat Variables     │
     └───────────┬────────────┴────────────┬────────────┴───────────┬───────────┘
                 │                         │                        │
                 ▼                         ▼                        ▼
     ┌──────────────────────────────────────────────────────────────────────────┐
     │              STAGE 1: TRIGGER & CONTEXT INVENTORY GATHERING              │
     │ - Identify active provider (Chat Completions vs TextGen)                │
     │ - Read active Instruct Preset & Context Template configuration           │
     │ - Compute Base Token Limits (Context Size - Max Output Tokens - Buffer)  │
     └─────────────────────────────────────┬────────────────────────────────────┘
                                           │
                                           ▼
     ┌──────────────────────────────────────────────────────────────────────────┐
     │              STAGE 2: WORLD INFO SCANNING & KEYWORD MATCHING             │
     │ - Recursively scan chat history up to `scan_depth`                       │
     │ - Evaluate Primary Keys, Secondary (AND) Keys, Selective Logic, Regex    │
     │ - Sort active entries by `order` and route to designated insertion slots │
     └─────────────────────────────────────┬────────────────────────────────────┘
                                           │
                                           ▼
     ┌──────────────────────────────────────────────────────────────────────────┐
     │             STAGE 3: STATIC STRUCTURAL BLOCK AGGREGATION                 │
     │ - Assemble System Prompt (with embedded system-level extensions)         │
     │ - Assemble Persona Description                                           │
     │ - Assemble Character Definition (Description, Personality, Scenario)     │
     │ - Assemble Dialogue Examples (<START> format vs message-object format)   │
     │ - Apply Macro Substitution Engine (`{{char}}`, `{{user}}`, variables)    │
     └─────────────────────────────────────┬────────────────────────────────────┘
                                           │
                                           ▼
     ┌──────────────────────────────────────────────────────────────────────────┐
     │             STAGE 4: TOKEN BUDGETING & BACKWARD CHAT TRIMMING            │
     │ - Calculate exact token cost of all Static Blocks & World Info           │
     │ - Remaining Tokens = `TokenBudget - StaticTokens`                        │
     │ - Iterate Chat History backwards: message[N] -> message[N-1] -> ...      │
     │ - Stop/Trim when next message token count exceeds Remaining Tokens       │
     └─────────────────────────────────────┬────────────────────────────────────┘
                                           │
                                           ▼
     ┌──────────────────────────────────────────────────────────────────────────┐
     │             STAGE 5: DYNAMIC IN-CHAT INJECTIONS & AUTHOR'S NOTE          │
     │ - Place In-Chat World Info entries at target `@ Depth X`                 │
     │ - Place Extension Prompts (`setExtensionPrompt`) at target `@ Depth X`   │
     │ - Place Author's Note (A/N) at configured depth and role                 │
     │ - Resolve depth collisions & maintain chronological message order        │
     └─────────────────────────────────────┬────────────────────────────────────┘
                                           │
                                           ▼
     ┌──────────────────────────────────────────────────────────────────────────┐
     │             STAGE 6: EVENT EMISSION & PAYLOAD MUTATION                   │
     │ - Fire `CHAT_COMPLETION_PROMPT_READY` or `GENERATE_BEFORE_COMBINED_PROMPT`│
     │ - Registered extensions inspect and mutate `messages[]` payload in place │
     └─────────────────────────────────────┬────────────────────────────────────┘
                                           │
                                           ▼
     ┌──────────────────────────────────────────────────────────────────────────┐
     │             STAGE 7: PROVIDER ADAPTATION & SERIALIZATION                 │
     │ - Enforce alternating role constraints (User <-> Assistant) if required  │
     │ - Merge adjacent identical roles (e.g. consecutive System or User turns) │
     │ - Format stopping sequences, temperature, top_p, top_k, frequency penalty│
     │ - POST payload to `/api/backends/chat-completions/generate`              │
     └──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. In-Depth Phase Breakdown

### Phase 1: World Info (Lorebook) Scanning & Activation
World Info entries can be triggered dynamically or held constant. The resolution algorithm works as follows:

1. **Scan Scope (`scan_depth`):**
   * The scanner looks back over the last $D$ messages in the chat history (configured by `scan_depth`, typically 2–10 messages).
   * It also optionally scans:
     * Current User Input
     * Character Description/Scenario
     * Persona Description
2. **Matching Engine:**
   * **Primary Keys (Keys):** Comma-separated list of triggers. Case-insensitive substring match or regex.
   * **Secondary Keys (Selective / AND logic):** If enabled, requires at least one primary key AND at least one secondary key to be present in the scanned text.
   * **Exclusion Keys (NOT logic):** If present, prevents entry activation even if primary keys match.
   * **Constant / Force Active:** Bypasses keyword search; always active.
3. **Ordering & Slot Routing:**
   * Each active entry has an `order` property (0 to 1000). Entries are sorted by priority.
   * Each entry specifies an insertion position:
     * `0`: Before Character Definitions
     * `1`: After Character Definitions
     * `2`: Top of Context / System Prompt
     * `3`: In-Chat at specified `depth` (from bottom of history)
     * `4`: Before / After Author's Note

---

### Phase 2: Macro Substitution Engine (`substituteParams`)
Before token counting and assembly, all text fragments pass through `substituteParams()`. This engine performs regex string replacements:

| Macro | Source / Dynamic Resolution |
| :--- | :--- |
| `{{char}}` | Current active character name |
| `{{user}}` | Current active user persona name |
| `{{original}}` | Original system prompt or character description during override |
| `{{input}}` | Raw text of user's current unsent input |
| `{{lastMessage}}` | Content of the most recent message in the chat |
| `{{lastMessageId}}`| Zero-indexed integer ID of the last message |
| `{{time}}`, `{{date}}` | Client local timestamp / calendar string |
| `{{getvar::varName}}` | Reads from `chat_metadata.variables[varName]` or global variables |
| `{{setvar::varName::value}}` | Mutates variable in memory; replaced with empty string in prompt |
| `{{pick::a::b::c}}` | Randomly picks one of the delimited elements |

---

### Phase 3: Token Budgeting & Mathematical Limits

Let:
* $T_{\text{max}}$ = Total Model Context Window (e.g. 8192, 32768, 128000, 1000000)
* $T_{\text{out}}$ = Configured Max Output / Generation Tokens (e.g. 1000)
* $T_{\text{reserve}}$ = Safety Buffer Margin (typically 50–200 tokens)
* $T_{\text{static}}$ = Token cost of System Prompt + Character Defs + Persona + Scenario + Examples + World Info
* $T_{\text{chat\_budget}}$ = Available tokens for conversation history

$$\text{Total Budget} = T_{\text{max}} - T_{\text{out}} - T_{\text{reserve}}$$
$$T_{\text{chat\_budget}} = \text{Total Budget} - T_{\text{static}}$$

If $T_{\text{chat\_budget}} \le 0$, the static context alone overflows the model. SillyTavern raises a context overflow warning or forces aggressive truncation of Character Definitions / Examples depending on user settings.

#### Backward History Walk:
```javascript
let accumulatedChatTokens = 0;
const messagesToInclude = [];

for (let i = chat.length - 1; i >= 0; i--) {
    const msg = chat[i];
    const tokenCount = getTokenCount(msg); // Uses provider tokenizer
    
    if (accumulatedChatTokens + tokenCount > chat_budget) {
        break; // Drop older history beyond this threshold
    }
    
    accumulatedChatTokens += tokenCount;
    messagesToInclude.unshift(msg);
}
```

---

### Phase 4: In-Chat Depth & Injections Math
Injections are placed at specific depths measured backwards from the end of the chat history ($D = 0$ is the very bottom, after the latest message):

```
[Message History Top: Oldest Retained Message]  (Index 0 in messagesToInclude)
  ...
[Message N-3]                                   (Depth 3)
[Message N-2]                                   (Depth 2)  <--- Injected: @ Depth 2 World Info
[Message N-1]                                   (Depth 1)  <--- Injected: Extension Prompt / A/N
[Message N (Latest User Message)]               (Depth 0)
  ...
[Target of Generation: Next Assistant Message]
```

**Depth Collisions:**
When an Author's Note, a World Info entry, and an Extension Prompt all target `Depth 1`:
1. SillyTavern calculates their position index: `targetIndex = Math.max(0, messagesToInclude.length - depth)`.
2. Entries targeting the same index are appended sequentially in order of their internal registration / priority index.
3. If they share the same role (e.g. `system`), they are either merged into a single multi-paragraph message or emitted as adjacent messages (which Phase 7 will reconcile).

---

### Phase 5: Provider Formatting & Constraint Reconciliation

Different LLM providers enforce strict structural rules on their API payloads:

| Provider | Constraint / Rule | How SillyTavern Enforces It |
| :--- | :--- | :--- |
| **OpenAI / Direct APIs** | Allows arbitrary system messages anywhere in array. | Array passed as structured without role re-mapping. |
| **Anthropic (Claude)** | Requires a separate top-level `system` parameter; all `messages[]` must alternate strictly between `user` and `assistant`. | All `system` messages inside history are extracted or converted to `user` role with system wrappers; consecutive same-role turns are merged with `\n\n`. |
| **Google (Gemini)** | Dedicated `systemInstruction` field; `contents` array must alternate between `user` and `model`. Consecutive identical roles rejected. | Merges consecutive identical roles into one Content part array. System messages at depth are mapped into user turns. |
| **Raw TextGen / Llama.cpp**| Requires single unified text string with model-specific stop tokens (e.g. ChatML, Alpaca, Llama-3). | Evaluates Instruct Template (e.g. `<|start_header_id|>system<|end_header_id|>\n\n...`) to produce one continuous string. |
