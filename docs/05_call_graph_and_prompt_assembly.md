# Forensic Analysis Pass 2: Exact Call Graph & Prompt Assembly Pipeline

## 1. Concrete Source Call Graph

Every text generation in SillyTavern originates from user or automated triggers in `public/script.js` and routes through dedicated provider preparation modules.

### Top-Level Trigger Call Hierarchy:
```
[User Action: Click Send / Enter Key / Quick Reply]
  │
  └──> `onSendClick()` (`public/script.js`)
        │
        ├──> `getSendText()` -> extracts raw textarea input
        ├──> `pushUserMessage()` -> appends to `chat[]` array (if normal user message)
        │     └──> `saveChatDebounced()` (`public/scripts/chat.js`)
        │     └──> `eventSource.emit(event_types.USER_MESSAGE_RENDERED, messageId)`
        │
        └──> `Generate()` (`public/script.js`)
              │
              ├── [Branch A: Chat Completions API (OpenAI/Claude/Gemini/OpenRouter/Mistral/Custom)]
              │     └──> `sendOpenAIChatCompletionRequest(type, params)` (`public/scripts/openai.js`)
              │           │
              │           ├──> `prepareOpenAIMessages(type, params)` (`public/scripts/openai.js`)
              │           │     ├──> `checkWorldInfo()` (`public/scripts/world_info.js`)
              │           │     ├──> `getExtensionPrompts()` (`public/scripts/extensions.js`)
              │           │     ├──> `buildContext()` / `formatInstructMode()` (`public/scripts/instruct.js`)
              │           │     ├──> `substituteParams()` (`public/scripts/util.js` or `script.js`)
              │           │     ├──> `truncateChat()` / `tokenizeAndTrim()`
              │           │     └──> `eventSource.emit(event_types.CHAT_COMPLETION_PROMPT_READY, { chat: messages, dryRun })`
              │           │
              │           └──> `fetch('/api/backends/chat-completions/generate', { method: 'POST', body: JSON.stringify(payload) })`
              │
              └── [Branch B: Raw Text Completion API (KoboldCpp, TextGen WebUI, Ollama, Tabby, vLLM)]
                    └──> `sendTextGenGenerationRequest(type, params)` (`public/scripts/textgen.js`)
                          │
                          ├──> `prepareTextGenPrompt(type, params)` (`public/scripts/textgen.js`)
                          │     ├──> `formatInstructModeText()` (`public/scripts/instruct.js`)
                          │     ├──> `checkWorldInfo()` (`public/scripts/world_info.js`)
                          │     ├──> `substituteParams()`
                          │     └──> `eventSource.emit(event_types.GENERATE_BEFORE_COMBINED_PROMPT, { prompt: rawString })`
                          │
                          └──> `fetch('/api/backends/text-completions/generate', ...)`
```

---

## 2. Step-by-Step Function Execution Trace (`prepareOpenAIMessages`)

### `SOURCE FILE`: `public/scripts/openai.js`
### `FUNCTION`: `prepareOpenAIMessages(type, forceMaxTokens = false, dryRun = false)`
### `CONFIDENCE`: **CONFIRMED IN SOURCE**

1. **Context Limits Calculation:**
   * Reads `max_context` (e.g. 32768) and `max_tokens` from `openai_settings`.
   * Calculates dynamic headroom:
     $$\text{availableTokens} = \text{max\_context} - \text{max\_tokens} - \text{safety\_buffer}$$
   * Selects the active tokenizer: uses `tiktoken` (client-side WASM), `llama-tokenizer-js`, or estimates via $4 \text{ chars/token}$ heuristic depending on settings.

2. **World Info Activation (`checkWorldInfo`):**
   * Calls `checkWorldInfo(chat, { scanDepth, includeInput: true })`.
   * Returns:
     * `before_defs`: entries set to position `0`
     * `after_defs`: entries set to position `1`
     * `system_top`: entries set to position `2`
     * `in_chat`: entries set to position `3` (associated with target `@ Depth X`)
     * `an_top` / `an_bottom`: entries set to position `4`

3. **Static Block Assembly:**
   * **System Prompt:** Constructed from Instruct preset's `system_prompt` or Character Card's `system_prompt` override.
   * **Persona Description:** Ingests `power_user.personas[active_persona].description`.
   * **Character Definition:** Ingests `characters[this_chid].description`, `.personality`, and `.scenario`.
   * **Example Messages:** Formats `mes_example` (if enabled in Context settings). Can be embedded as raw string blocks with `<START>` tags or split into mock `user`/`assistant` message turns.
   * Macro substitution (`substituteParams()`) is executed across each static block individually.

4. **Token Cost of Static Elements:**
   * Sums the token count of System + Persona + Character + Scenario + Examples + Top/Bottom World Info.
   * Subtracts from `availableTokens` to yield `chatBudget`.

5. **Backward Chat History Walking:**
   * Iterates backwards from `chat.length - 1` down to `0`.
   * For each message:
     * Skips messages marked as `is_system: true` if filtered, or formats them according to instruct template.
     * Computes tokens for `msg.mes`.
     * If `currentChatTokens + msgTokens > chatBudget`: halts iteration.
     * Unshifts valid messages into an array `historyMessages`.

6. **Depth Resolution & Dynamic Injection Merging:**
   * Iterates from $D = \text{max\_depth}$ down to $0$:
     * Checks if any World Info entry is targeted at `@ Depth D`.
     * Checks if Author's Note is targeted at `@ Depth D`.
     * Checks if any extension registered an in-chat prompt at `@ Depth D`.
     * Calculates insertion index:
       $$\text{targetIndex} = \max(0, \text{historyMessages.length} - D)$$
     * Slices into `historyMessages` at `targetIndex`.

7. **Event Emission & Payload Finalization:**
   * Emits `eventSource.emit(event_types.CHAT_COMPLETION_PROMPT_READY, { chat: historyMessages, dryRun })`.
   * Executes provider adapter transformations (role mapping, consecutive turn concatenation).
   * Packages JSON payload containing `messages`, `model`, `temperature`, `top_p`, `frequency_penalty`, `presence_penalty`, `stop`.
   * Returns `{ messages, finalTokens }`.
