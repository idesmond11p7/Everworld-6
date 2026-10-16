# Forensic Analysis Pass 2: Prompt Mutability Matrix & State Authority

## 1. Prompt Mutability Matrix

This matrix maps every stage of the prompt lifecycle to its physical data structures, mutability, persistence characteristics, and observer visibility.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                      PROMPT MUTABILITY MATRIX                                                           │
├─────────────────────────┬───────────────────────┬──────────┬───────────┬─────────────────────────┬─────────────────────────────────────┤
│ Lifecycle Stage         │ Target Data Structure │ Mutable? │ Persists? │ Who Sees The Mutation?  │ Hook / Mechanism                    │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 1. Raw Message Input    │ `input_text` (String) │ YES      │ NO        │ UI, Macros              │ `#send_textarea` DOM input          │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 2. Chat Array Ingest    │ `chat[i]` (Object)    │ YES      │ **YES**   │ Entire App, Storage     │ `chat[i].mes = ...`, `saveChat()`   │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 3. Message Extra Bag    │ `chat[i].extra` (Dict)│ YES      │ **YES**   │ Extensions, Storage     │ `chat[i].extra.custom_key = val`    │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 4. Chat Header Metadata │ `chat_metadata` (Dict)│ YES      │ **YES**   │ Extensions, Storage     │ `chat_metadata.variables[k] = v`    │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 5. World Info Buffer    │ `world_info` array    │ YES      │ Dynamic   │ Prompt Assembly Engine  │ `checkWorldInfo()`, custom filters  │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 6. Extension Prompts    │ `extension_prompts`   │ YES      │ In-Memory │ Prompt Assembly Engine  │ `setExtensionPrompt(id, text, ...)` │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 7. Static Context Block │ `context_string`      │ YES      │ Session   │ Assembly Engine         │ `GENERATE_BEFORE_COMBINED_PROMPT`   │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 8. Outgoing Messages    │ `data.chat` (Array)   │ **YES**  │ **NO**    │ Downstream Extensions,  │ `CHAT_COMPLETION_PROMPT_READY`      │
│    (In-Flight Payload)  │                       │          │           │ LLM Wire Request        │ (Transient per-generation mutation) │
├─────────────────────────┼───────────────────────┼──────────┼───────────┼─────────────────────────┼─────────────────────────────────────┤
│ 9. Provider Wire Body   │ `request_body` (JSON) │ NO (Lock)│ NO        │ Express Backend, LLM    │ `fetch('/api/backends/...', ...)`   │
└─────────────────────────┴───────────────────────┴──────────┴───────────┴─────────────────────────┴─────────────────────────────────────┘
```

---

## 2. State Authority & Persistence Registry

### `CONFIDENCE`: **CONFIRMED IN SOURCE**

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                    STATE AUTHORITY REGISTRY                                                            │
├─────────────────────┬──────────────────────────┬─────────────────────────────┬─────────────────────┬───────────────────┬───────────────┤
│ Data Domain         │ Authoritative Storage    │ Runtime In-Memory Variable  │ Serialization       │ Load Path         │ Write Path    │
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ Character Cards     │ `/data/{user}/characters/│ `characters[this_chid]`     │ Base64 JSON inside  │ `GET /api/        │ `POST /api/   │
│                     │ {Name}.png`              │                             │ PNG `tEXt` chunk    │ characters`       │ characters/   │
│                     │                          │                             │ (V2/V3 Spec)        │                   │ edit`         │
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ Active Chat History │ `/data/{user}/chats/     │ `chat[]` array in           │ JSON Lines          │ `POST /api/chats/ │ `POST /api/   │
│                     │ {Char}/{ChatId}.jsonl`   │ `public/script.js`          │ (`.jsonl`), line    │ get` (streams     │ chats/save`   │
│                     │                          │                             │ by line             │ lines into array) │ (debounced)   │
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ Chat Metadata       │ Line 0 of active         │ `chat_metadata` in          │ JSON object on      │ Parsed from Line 0│ Overwrites    │
│ & Variables         │ `.jsonl` file            │ `public/scripts/chat.js`    │ Line 0 of `.jsonl`  │ on chat load      │ Line 0 in save│
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ World Info          │ `/data/{user}/worlds/    │ `world_info[world_name]`    │ JSON object keyed   │ `POST /api/       │ `POST /api/   │
│ (Lorebooks)         │ {WorldName}.json`        │ in `world_info.js`          │ by entry UIDs       │ worldinfo/get`    │ worldinfo/edit│
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ User Personas       │ `/data/{user}/personas/  │ `power_user.personas[]`     │ PNG metadata chunk  │ Ingested via      │ `POST /api/   │
│                     │ {id}.png` or JSON        │                             │ or JSON             │ `GET /api/settings│ personas/edit`│
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ Instruct / Context  │ `/data/{user}/instruct/  │ `instruct_presets[]`,       │ Formatted JSON      │ `GET /api/instruct│ `POST /api/   │
│ Presets             │ {Name}.json`             │ `context_presets[]`         │                     │ /get`             │ instruct/save`│
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ Global Extension    │ `/data/{user}/           │ `extension_settings[ext]`   │ Nested dictionary   │ Ingested via      │ `POST /api/   │
│ Settings            │ settings.json`           │ in `extensions.js`          │ inside settings.json│ `GET /api/settings│ settings/save`│
├─────────────────────┼──────────────────────────┼─────────────────────────────┼─────────────────────┼───────────────────┼───────────────┤
│ Runtime Transient   │ NONE (Lost on refresh)   │ Scoped module variables     │ N/A (RAM only)      │ Re-initialized on │ None          │
│ In-Memory Variables │                          │                             │                     │ boot              │               │
└─────────────────────┴──────────────────────────┴─────────────────────────────┴─────────────────────┴───────────────────┴───────────────┘
```
