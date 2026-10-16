# Forensic Analysis Pass 2: Extension Execution Order & Determinism

## 1. Extension Loading & Lifecycle Sequence

### `SOURCE FILE`: `public/scripts/extensions.js`
### `CONFIDENCE`: **CONFIRMED IN SOURCE**

### The Physical Boot Sequence:
```
1. Browser fires DOMContentLoaded
2. script.js calls `loadExtensions()` in `extensions.js`
3. Client requests `GET /api/extensions`
   └── Node.js server scans directories:
       - `public/scripts/extensions/`
       - `data/{user}/extensions/` (or `third-party/`)
   └── Server returns array of strings: `["ext_a", "ext_b", "ext_c", ...]`
       NOTE: Node.js returns filenames via `fs.readdir()`, which is sorted ALPHABETICALLY by default.
4. Client iterates sequentially through the array:
   for (const extName of extensionList) {
       await import(`/scripts/extensions/${extName}/index.js`);
       // If module exports `init()`, call:
       if (typeof module.init === 'function') {
           await module.init();
       }
   }
5. All extensions complete import -> Event `APP_READY` is emitted.
```

---

## 2. Hook Execution Mechanics (`EventEmitter`)

### `SOURCE FILE`: `public/scripts/events.js` / `public/script.js`
### `SYMBOL`: `eventSource`
### `CONFIDENCE`: **CONFIRMED IN SOURCE**

SillyTavern's `eventSource` is an instance of a standard JavaScript EventEmitter / EventTarget.

### Execution Invariants:
1. **Synchronous Invocation Loop:**
   * When `eventSource.emit(event_types.CHAT_COMPLETION_PROMPT_READY, data)` is called, the EventEmitter iterates through its internal listener array `_events[eventName]` in a standard `for` loop:
     ```javascript
     emit(event, ...args) {
         const listeners = this._events[event];
         if (!listeners) return;
         if (typeof listeners === 'function') {
             listeners(...args);
         } else {
             for (let i = 0; i < listeners.length; i++) {
                 listeners[i](...args);
             }
         }
     }
     ```
2. **Registration-Order Determinism:**
   * Handlers run in the **exact order they were registered via `.on()`**.
   * Because `loadExtensions()` imports extensions in alphabetical order according to the directory list returned by the server, **initial registration order is deterministic across reloads within the same environment**.
   * **CAVEAT (Dynamic Registration):** If an extension delays registration inside a `setTimeout`, a `fetch().then()`, or an asynchronous button click, its listener will be pushed to the end of the array dynamically, breaking determinism.

3. **Asynchronous Awaiting Behavior:**
   * **CRITICAL INVARIANT:** SillyTavern's standard `eventSource.emit()` is **SYNCHRONOUS AND NOT AWAITED**.
   * If an extension registers an `async (data) => { await doSomething(); }` listener for `CHAT_COMPLETION_PROMPT_READY`, the EventEmitter calls the promise but **does NOT await its resolution before the prompt pipeline sends the HTTP request to the backend**.
   * **Consequence:** If an extension attempts to make an asynchronous `fetch()` inside `CHAT_COMPLETION_PROMPT_READY` before mutating `data.chat`, the payload will be sent to the LLM **before** the extension's mutation finishes.

---

## 3. Mutation Visibility & Inter-Extension Conflicts

### `CONFIDENCE`: **CONFIRMED IN SOURCE**

Let Extension $A$ (folder: `01_preprocessor`) and Extension $B$ (folder: `02_postprocessor`) both register listeners for `CHAT_COMPLETION_PROMPT_READY`:

```
[Prompt Engine calls emit(CHAT_COMPLETION_PROMPT_READY, { chat: messages })]
  │
  ├──> Extension A Handler Executes (Synchronously)
  │     ├── Inspects `data.chat`
  │     └── Mutates `data.chat[last].content = "[Prefix] " + content`
  │
  └──> Extension B Handler Executes (Synchronously)
        ├── Inspects `data.chat` -> OBSERVES Extension A's mutation!
        └── Mutates `data.chat.push({ role: 'system', content: '...' })`
  │
  └──> Prompt Engine continues -> Wire payload contains BOTH mutations.
```

### Destruction / Overwrite Race Conditions:
* **Visibility:** Later extensions in the execution chain **can** observe and modify changes made by earlier extensions.
* **Destructive Conflict:** If Extension A mutates a message by reference, and Extension B replaces the array (`data.chat = newArray`), Extension A's edits are discarded unless Extension B cloned them.
* **No Rollback:** There is no transactional undo, conflict resolution, or schema validation between competing extensions.
