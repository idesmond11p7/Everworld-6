# Forensic Analysis: Extension System & Injection Procedures

## 1. Extension Anatomy & Directory Topology

SillyTavern extensions exist in two locations:
1. Built-in: `public/scripts/extensions/{extension_name}/`
2. Third-Party: `data/{user}/extensions/{extension_name}/` (or `public/scripts/extensions/third-party/`)

### Standard Extension Directory Layout:
```
my_extension/
├── index.js          # Main entry point (ES Module loaded in browser)
├── style.css         # Optional CSS injected into browser DOM
├── settings.html     # HTML snippet injected into ST's Extensions Settings panel
├── package.json      # Metadata (name, author, version, dependencies)
└── server.js         # (Optional) Node.js companion script loaded by Express backend
```

---

## 2. Extension Initialization Lifecycle

The frontend extension manager (`public/scripts/extensions.js`) controls boot sequence:

```
[ST Frontend Boot]
   │
   ▼
1. Fetch active extension list: `GET /api/extensions`
   │
   ▼
2. Loop over extension names:
   ├── Inject `style.css` into `<head>` (if exists)
   ├── Dynamically import ES Module: `await import('/scripts/extensions/' + name + '/index.js')`
   └── Check if module exports `init()` -> Call `await module.init()`
   │
   ▼
3. Render Settings HTML:
   ├── Fetch `settings.html`
   ├── Append into `#extensions_settings` drawer in DOM
   └── Trigger extension-specific UI binding functions
   │
   ▼
4. Load Extension Settings:
   ├── Read `extension_settings[name]` from global `settings.json`
   └── If undefined, initialize with default configuration
```

---

## 3. The `eventSource` Event Bus

SillyTavern provides a central event emitter in `public/script.js`. Extensions subscribe via:
```javascript
import { eventSource, event_types } from '../../../../script.js';

eventSource.on(event_types.SOME_EVENT, async (args) => {
    // Handling logic
});
```

### Complete Inventory of Event Hooks:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION LIFECYCLE                            │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ Event Name                   │ Trigger Condition / Injected Arguments        │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ `APP_READY`                  │ UI and core scripts fully initialized.       │
│ `SETTINGS_LOADED`            │ Settings synced from server; theme applied.  │
│ `CHARACTER_LOADED`           │ New character selected; receives `{ chid }`. │
│ `CHARACTER_EDITED`           │ Character fields modified or saved.          │
│ `CHAT_CHANGED`               │ New chat file loaded; receives chat history. │
│ `CHAT_CREATED`               │ New chat session started.                    │
│ `CHAT_DELETED`               │ Chat session deleted from disk.              │
└──────────────────────────────┴──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                             MESSAGE & DOM FLOW                              │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ Event Name                   │ Trigger Condition / Injected Arguments        │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ `USER_MESSAGE_RENDERED`      │ User clicks Send; message added to DOM.      │
│ `MESSAGE_RECEIVED`           │ Assistant response received and finalized.   │
│ `MESSAGE_UPDATED`            │ A message was edited in the UI.              │
│ `MESSAGE_DELETED`            │ A message was deleted from the chat array.   │
│ `MESSAGE_SWIPED`             │ User navigated to an alternative swipe.      │
│ `STREAM_TOKEN_RECEIVED`      │ Real-time chunk received via SSE stream.     │
└──────────────────────────────┴──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        PROMPT & GENERATION HOOKS                            │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ Event Name                   │ Trigger Condition / Injected Arguments        │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ `GENERATE_BEFORE_COMBINED_PROMPT` │ Fired before prompt strings combine.    │
│ `CHAT_COMPLETION_PROMPT_READY`    │ Fired right before wire dispatch. Receives│
│                                   │ `{ chat: promptMessages[], dryRun }`.   │
│ `GENERATE_AFTER_DATA`             │ Raw response received before parsing.   │
│ `FORCE_STOP_GENERATION`           │ User clicked Stop or token limit hit.   │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 4. Prompt Injection Mechanisms

Extensions have two distinct paths to alter what the LLM sees:

### Method A: The Structured `setExtensionPrompt` API
The officially sanctioned, safe method for injecting instructions:
```javascript
import { setExtensionPrompt, extension_prompt_types } from '../../../../script.js';

setExtensionPrompt(
    'my_extension_id',       // Unique identifier
    'System: Maintain state...', // Text content (supports {{macros}})
    extension_prompt_types.IN_CHAT, // Position
    2,                       // Depth (2 messages from bottom)
    false,                   // Scan for World Info?
    'system'                 // Target role: 'system' | 'user' | 'assistant'
);
```

#### Position Types (`extension_prompt_types`):
* `SYSTEM` (`0`): Appends directly to the primary System Prompt.
* `BEFORE_PROMPT` (`1`): Injected immediately before the Character Definition.
* `AFTER_PROMPT` (`2`): Injected immediately after the Character Definition.
* `TOP_AN` (`3`): Placed at top of Author's Note block.
* `BOTTOM_AN` (`4`): Placed at bottom of Author's Note block.
* `IN_CHAT` (`5`): Injected inside the active message history at depth $X$.

---

### Method B: Raw Interception via `CHAT_COMPLETION_PROMPT_READY`
The direct mutation approach. The extension intercepts the mutable array right before network dispatch:

```javascript
eventSource.on(event_types.CHAT_COMPLETION_PROMPT_READY, (data) => {
    // data.chat is the exact array of [{ role: '...', content: '...' }]
    const messages = data.chat;
    
    // Example: Mutate the latest user message in flight
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'user') {
        lastMsg.content = `[State: Stable]\n${lastMsg.content}`;
    }
    
    // Example: Insert an arbitrary hidden guidance turn
    messages.splice(messages.length - 1, 0, {
        role: 'system',
        content: 'Directive: Do not reveal secret X.'
    });
});
```

---

## 5. Persistence: How Extensions Store Data

Extensions must store data across three different scopes:

### 1. Global Extension Settings (Survives browser reloads, shared across all chats)
Stored inside the user's primary `settings.json`:
```javascript
import { extension_settings, saveSettingsDebounced } from '../../../../script.js';

// Access settings
extension_settings.my_ext = extension_settings.my_ext || { enabled: true, threshold: 5 };

// Mutate and save
extension_settings.my_ext.threshold = 10;
saveSettingsDebounced(); // Triggers POST /api/settings/save
```

### 2. Chat-Specific State (Survives reloads, tied to one specific chat file)
Stored inside the `.jsonl` header `chat_metadata`:
```javascript
import { chat_metadata, saveChatDebounced } from '../../../../script.js';

chat_metadata.variables = chat_metadata.variables || {};
chat_metadata.variables['fatigue_level'] = 85;

saveChatDebounced(); // Updates Line 0 in the active .jsonl
```

### 3. Message-Specific State (Tied to a single message turn)
Stored inside `chat[i].extra`:
```javascript
import { chat, saveChatDebounced } from '../../../../script.js';

const messageIndex = chat.length - 1;
chat[messageIndex].extra = chat[messageIndex].extra || {};
chat[messageIndex].extra['my_ext_data'] = {
    internal_thought: "Agent evaluated risk as moderate.",
    calculated_delta: +12
};

saveChatDebounced(); // Writes updated message to .jsonl
```

---

## 6. Execution Order & Inter-Extension Conflicts

### Registration Order Dependency:
* SillyTavern executes `eventSource` listeners synchronously in the exact sequence they were registered via `eventSource.on()`.
* **The Conflict Problem:** If Extension A and Extension B both listen to `CHAT_COMPLETION_PROMPT_READY` and modify `data.chat`:
  * If Extension A modifies message $K$, and Extension B subsequently replaces or splices message $K$, Extension A's mutation is destroyed.
  * SillyTavern provides **no native dependency tree or deterministic priority weighting** between competing extensions.
  * The order of execution is determined entirely by directory loading order (`GET /api/extensions` returns folder names sorted alphabetically).
