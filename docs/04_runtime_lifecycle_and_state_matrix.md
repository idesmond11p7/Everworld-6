# Forensic Analysis: Runtime Lifecycle & State Serialization Matrix

## 1. End-to-End Runtime Execution Lifecycle

```
[ST SERVER START (server.js)]
  ├── Reads `config.yaml` / `config.json`
  ├── Initializes Express app on Port 8000 (default)
  ├── Registers `/api/*` endpoints (characters, chats, settings, backends)
  ├── Loads server-side plugins from `src/plugins/`
  └── Listens for client browser connections
        │
        ▼
[CLIENT BROWSER BOOT (index.html -> main.js / script.js)]
  ├── Step 1: DOM Loading & CSS setup
  ├── Step 2: Global Configuration Fetch (`GET /api/settings`)
  │     └── Ingests `settings.json` -> Populates `power_user`, `extension_settings`
  ├── Step 3: Character Inventory Fetch (`GET /api/characters`)
  │     └── Populates `characters[]` array in memory
  ├── Step 4: World Info Inventory Fetch (`GET /api/worldinfo`)
  │     └── Loads lorebook metadata into memory
  ├── Step 5: Extension Discovery & Loader (`GET /api/extensions`)
  │     └── Dynamically imports ES modules, registers listeners on `eventSource`
  ├── Step 6: Active Character Resolution
  │     └── Reads `last_character` from settings -> Loads Card & Avatar
  ├── Step 7: Active Chat Resolution
  │     └── Reads active `.jsonl` -> Streams lines into `chat[]` array
  └── Step 8: Fire Event `APP_READY`
        │
        ▼
[INTERACTION RUNTIME LOOP]
  ├── (A) User types input & hits Send
  ├── (B) `chat.push(userMessage)` & updates DOM
  ├── (C) Save chat asynchronously (`POST /api/chats/save`)
  ├── (D) Fire `USER_MESSAGE_RENDERED`
  ├── (E) Prompt Pipeline Execution (`openai.js` / `textgen.js`):
  │     ├── Scan World Info & evaluate triggers
  │     ├── Gather In-Chat & System extension prompts
  │     ├── Token budget calculation & backward history trimming
  │     ├── Apply macro substitution (`substituteParams`)
  │     ├── Fire `CHAT_COMPLETION_PROMPT_READY` (Extensions mutate payload)
  │     └── Reconcile provider constraints (role merging / system mapping)
  ├── (F) Dispatch Request (`POST /api/backends/chat-completions/generate`)
  ├── (G) Stream / Receive Response Chunks
  │     ├── Emit `STREAM_TOKEN_RECEIVED`
  │     └── Update DOM text node live
  ├── (H) Finalize Response (`chat.push(assistantMessage)`)
  ├── (I) Fire `MESSAGE_RECEIVED`
  └── (J) Debounced Save Chat (`POST /api/chats/save`)
```

---

## 2. Complete State Serialization Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     STATE PERSISTENCE INVENTORY                                        │
├─────────────────────┬───────────────────┬──────────────────────┬───────────────────────────────────────┤
│ Scope / Data Item   │ In-Memory (Client)│ Persistence Medium   │ Exact File Location & Format          │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Global App Settings │ `power_user`,     │ Server Disk (JSON)   │ `/data/{user}/settings.json`          │
│                     │ `main_settings`   │                      │                                       │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Character Card      │ `characters[i]`   │ Server Disk (PNG /   │ `/data/{user}/characters/{Name}.png`  │
│ Definition (V2/V3)  │                   │ JSON)                │ Embedded in PNG `tEXt` chunk `chara`  │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ World Info /        │ `world_info[i]`   │ Server Disk (JSON)   │ `/data/{user}/worlds/{Name}.json`     │
│ Lorebook Entries    │                   │                      │ Keyed by entry UIDs                   │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ User Personas       │ `personas[i]`     │ Server Disk (PNG /   │ `/data/{user}/personas/{id}.png` or   │
│                     │                   │ JSON)                │ embedded in `settings.json`           │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Active Chat History │ `chat[]` array    │ Server Disk (JSONL)  │ `/data/{user}/chats/{Char}/{id}.jsonl`│
│                     │                   │                      │ Line 0: Header, Lines 1..N: Messages  │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Chat Variables      │ `chat_metadata.   │ Server Disk (JSONL)  │ `/data/{user}/chats/{Char}/{id}.jsonl`│
│                     │ variables`        │                      │ Persisted inside Line 0 JSON object   │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Message Extra Data  │ `chat[i].extra`   │ Server Disk (JSONL)  │ `/data/{user}/chats/{Char}/{id}.jsonl`│
│ (Swipes, Gen info)  │                   │                      │ Persisted inside individual line JSON │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Instruct Presets    │ `instruct_presets`│ Server Disk (JSON)   │ `/data/{user}/instruct/{Name}.json`   │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Context Templates   │ `context_presets` │ Server Disk (JSON)   │ `/data/{user}/context/{Name}.json`    │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Extension Settings  │ `extension_       │ Server Disk (JSON)   │ Stored as nested sub-keys inside      │
│                     │ settings[ext]`    │                      │ `/data/{user}/settings.json`          │
├─────────────────────┼───────────────────┼──────────────────────┼───────────────────────────────────────┤
│ Extension In-Memory │ Custom variables  │ Transient (Lost on   │ None (Must manually persist to        │
│ Cache               │ in extension module│ reload)             │ `extension_settings` or `chat_metadata`│
└─────────────────────┴───────────────────┴──────────────────────┴───────────────────────────────────────┘
```

---

## 3. The Character Card V2/V3 Spec Architecture

Character cards in SillyTavern are self-contained portable assets containing both visual identity and prompt configuration:

```
[PNG FILE BYTES]
  ├── IHDR (Standard image dimensions, bit depth, color space)
  ├── IDAT (Compressed image pixels / Avatar visual)
  ├── tEXt chunk (Keyword: "chara")
  │     └── Base64 Encoded UTF-8 JSON String (V2 / V3 Spec)
  └── IEND (End of file)
```

### V2 Character Spec Schema Breakdown:
```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    "name": "Character Name",
    "description": "Physical traits, appearance, background, persistent core",
    "personality": "Behavioral patterns, psychological dispositions",
    "scenario": "Current situational context, physical surroundings",
    "first_mes": "Initial greeting message rendered when chat initializes",
    "mes_example": "<START>\n<START>\n{{user}}: How are you?\n{{char}}: Operational.",
    "creator_notes": "Usage guidelines, author comments",
    "system_prompt": "Optional character-level system prompt override",
    "post_history_instructions": "Optional directives appended after history",
    "alternate_greetings": ["Alternative opener 1", "Alternative opener 2"],
    "character_book": {
      "name": "Embedded Lorebook",
      "entries": [ /* Array of embedded World Info items */ ]
    },
    "tags": ["dxd", "entity"],
    "creator": "AuthorName",
    "character_version": "1.0"
  }
}
```
