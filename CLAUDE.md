# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `app/`:

```bash
npm run dev       # start dev server (Vite, hot reload)
npm run build     # tsc -b && vite build (type-check + bundle)
npm run lint      # ESLint
```

There are no tests. `npm run build` is the primary correctness check — it runs the full TypeScript compiler before bundling.

## Project overview

A mobile AI knowledge management app demo. No backend, no localStorage — all state is in-memory React Context seeded from `src/mock/data.ts`. The entire app renders inside a 390×844 phone frame centered on desktop (`src/components/layout/PhoneFrame.tsx`).

## TypeScript strictness

`tsconfig.app.json` enables `verbatimModuleSyntax`, `noUnusedLocals`, and `noUnusedParameters`. This means:

- **Every type-only import must use `import type`** (or `import { type X }`). Using a plain import for a type-only symbol is a build error.
- Unused variables and parameters are build errors. Remove them or prefix with `_`.

## Architecture

### Page naming convention

Pages use module-prefix + number: `K` = Knowledge, `Q` = Ask/AI, `T` = Task/LightApp, `N` = Notes, `M` = My/Profile, `G` = Global. File names mirror the ID, e.g. `K01_KnowledgeHome.tsx`.

### Layout system — critical rules

There are three layout patterns. Choosing the wrong one breaks scrolling or BottomSheet:

| Pattern | When to use | Example |
|---|---|---|
| `TabLayout` | Top-level tab pages (has bottom nav bar) | N02, Q01, M01 |
| `PageLayout` | Simple secondary pages with no sticky bottom element | M02, K03 |
| Raw `flex flex-col h-full relative bg-white` | Pages with a sticky toolbar/header + `flex-1 overflow-y-auto` content + fixed bottom bar | N05, N06, Q04 |

**Never wrap a page that contains a BottomSheet inside `PageLayout`**. `PageLayout`'s inner div is `relative`, so `BottomSheet`'s `absolute inset-0` only covers the scrollable content region, not the header. Pages using BottomSheet that need a custom header must use the raw flex pattern and mount `<Toast />` / `<ConfirmDialog />` directly.

### Contexts

All providers wrap the app in `src/main.tsx` in this order: `UserProvider > KnowledgeProvider > NotesProvider > AppsProvider`.

- **UserContext** — `user`, `showToast(msg, type?)`, `showConfirm(cfg)` / `hideConfirm()`. Toast auto-dismisses after 2 s. ConfirmDialog supports a `danger` flag (red confirm button).
- **NotesContext** — `notes[]`, CRUD (`addNote`, `updateNote`, `deleteNote`), `activeNote` / `setActiveNote` (set before navigating to N06), `prefillContent` / `setPrefillContent` (cross-module prefill pathway).
- **KnowledgeContext** — `bases[]`, `files[]`, `teams[]` with subscription toggle.
- **AppsContext** — `apps[]` with add/remove.

### Navigation state API (between pages)

Data passes between pages via React Router's Navigation State API (`navigate('/path', { state: { ... } })`), read with `useLocation().state`. Key contracts:

**N05 (NoteEdit)** accepts:
```ts
{ noteId?: string }            // edit mode if present; omit for create
{ prefillTitle?: string }      // pre-fill title field
{ prefilledContent?: string }  // pre-fill body (from AI answer, web save, etc.)
{ aiGenerated?: boolean, template?: string }  // triggers streaming typewriter
```
N05 also reads `NotesContext.prefillContent` as a secondary prefill source (and clears it on mount). Edit mode (`noteId` present) calls `updateNote`; create mode calls `addNote`.

**N06 (NoteDetail)** navigates to N05 with:
```ts
{ noteId: note.id, prefillTitle: note.title, prefilledContent: note.content }
```

**N02 → N06**: calls `setActiveNote(note)` before `navigate('/notes/detail')`.

### BottomSheet

`src/components/ui/BottomSheet.tsx` uses `absolute inset-0 z-40` — it must be inside a container that spans the full visible page. The parent page root must be `relative`.

### Design tokens (Tailwind)

Custom tokens defined in `tailwind.config.js`:

- **Colors**: `brand-orange` (#FF7A00), `brand-orange-light`, `ink-primary/secondary/placeholder`, `line-base`, `surface-card`, `pwa-bg`
- **Typography**: `text-h1` (22px/600), `text-h2` (18px/600), `text-card-title` (15px/600), `text-body` (14px/400), `text-caption` (12px/400), `text-micro` (11px/400)
- **Radius**: `rounded-card` (12px), `rounded-card-lg/xl`, `rounded-btn` (10px), `rounded-pill` (999px)
- **Shadow**: `shadow-card`, `shadow-float`, `shadow-sheet`

Orange (`brand-orange`) is used sparingly: primary action buttons, avatar background in M01, the 轻应用 badge in M01.

### Mock data

All data lives in `src/mock/data.ts`. Types are defined there too. The file exports: `mockUser`, `mockKnowledgeBases`, `mockSubscribedKBs`, `mockFiles`, `mockTeams`, `mockNotes`, `mockApps`, `mockAiSuggestions`, `mockWebResults`.

### Streaming text effect

**Always use `<StreamingText>` from `src/components/common/StreamingText.tsx`** — never hand-roll setInterval streaming.

```tsx
import StreamingText from '../../components/common/StreamingText'

<StreamingText
  text={FULL_ANSWER}
  speed={4}       // chars per tick (default 3)
  tickMs={18}     // ms per tick (default 20)
  onComplete={() => setDone(true)}
  render={(displayed, streaming) => (
    <div>
      {streaming && <div className="w-1.5 h-4 bg-brand-orange animate-pulse" />}
      {renderMarkdown(displayed)}
    </div>
  )}
/>
```

The `render` prop receives `(displayed: string, streaming: boolean)` — use it to render markdown and toggle streaming indicators. Internal `useRef` prevents StrictMode double-fire.

### Text selection (X01-X04 划词功能)

Use `useTextSelection()` from `src/hooks/useTextSelection.ts` — handles both mouseup (desktop) and touchend (mobile) via `window.getSelection()`.

```tsx
const { selection, onSelect, dismiss } = useTextSelection()

// On the scrollable content div:
<div onMouseUp={onSelect} onTouchEnd={onSelect}>...</div>

// SelectionMenu (X01):
<SelectionMenu
  visible={selection.visible}
  text={selection.text}
  onAction={handleAction}
  onDismiss={dismiss}
  bottomPx={72}   // px above page bottom
/>

// X02/X03/X04 panels use BottomFloatingPanel (src/components/common/BottomFloatingPanel.tsx)
<BottomFloatingPanel open={showX02} onClose={() => setShowX02(false)} title="AI 追问">
  ...
</BottomFloatingPanel>
```

`SelectionMenu` and `BottomFloatingPanel` require the page root to be `relative`.
