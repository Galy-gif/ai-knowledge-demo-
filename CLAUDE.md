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

Pages use module-prefix + number: `K` = Knowledge, `Q` = Ask/AI, `T` = Task/LightApp, `M` = My/Profile, `G` = Global. `N` note pages have been retired; lightweight user-created content now lives inside the system knowledge base "我的速记". File names mirror the ID, e.g. `K01_KnowledgeHome.tsx`.

### Layout system — critical rules

There are three layout patterns. Choosing the wrong one breaks scrolling or BottomSheet:

| Pattern | When to use | Example |
|---|---|---|
| `TabLayout` | Top-level tab pages (has bottom nav bar) | Q01, K01, M01 |
| `PageLayout` | Simple secondary pages with no sticky bottom element | M02, ComingSoon |
| Raw `flex flex-col h-full relative bg-white` | Pages with a sticky toolbar/header + `flex-1 overflow-y-auto` content + fixed bottom bar | K08, Q04, Q05 |

**Never wrap a page that contains a BottomSheet inside `PageLayout`**. `PageLayout`'s inner div is `relative`, so `BottomSheet`'s `absolute inset-0` only covers the scrollable content region, not the header. Pages using BottomSheet that need a custom header must use the raw flex pattern and mount `<Toast />` / `<ConfirmDialog />` directly.

### Contexts

All providers wrap the app in `src/main.tsx` in this order: `UserProvider > AnnotationsProvider > KnowledgeProvider > AppsProvider`.

- **UserContext** — `user`, `showToast(msg, type?)`, `showConfirm(cfg)` / `hideConfirm()`. Toast auto-dismisses after 2 s. ConfirmDialog supports a `danger` flag (red confirm button).
- **KnowledgeContext** — `bases[]`, `files[]`, `teams[]` with subscription toggle, `quickNotesBase`, `addFile`, `updateFile`, `deleteFile`. "我的速记" is a locked system knowledge base, but it is still treated as a normal save target.
- **AppsContext** — `apps[]` with add/remove.
- **AnnotationsContext** — document highlights/selection annotations for knowledge, web, note, and AI answer content.

All user-generated lightweight content goes through the unified "保存到库" flow. `SaveToKnowledgeBaseSheet` defaults to "我的速记" and lets the user choose another knowledge base. There is no independent notes module and no `NotesContext`.

### Navigation state API (between pages)

Data passes between pages via React Router's Navigation State API (`navigate('/path', { state: { ... } })`), read with `useLocation().state`. Key contracts:

**K08 (FileDetail)** accepts note creation state:
```ts
{ createNote?: boolean, kbId?: string } // opens the Markdown editor for a new note-type KnowledgeFile
```
When K08 opens a `KnowledgeFile` with `type: 'note'`, the right-side `...` menu includes `编辑`. Saving edits calls `KnowledgeContext.updateFile`; creating a new quick note calls `KnowledgeContext.addFile`.

Use `SaveToKnowledgeBaseSheet` for all "添加到库 / 保存到知识库 / 保存到库" actions. Include `QUICK_NOTES_KB_ID` as the first personal target and select it by default. Do not reintroduce a separate note-saving sheet.

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

All data lives in `src/mock/data.ts`. Types are defined there too. The file exports: `QUICK_NOTES_KB_ID`, `mockUser`, `mockKnowledgeBases`, `mockSubscribedKBs`, `mockFiles`, `mockTeams`, `mockApps`, `mockAiSuggestions`, `mockWebResults`.

`KnowledgeFile.type` includes `note`. Note-type files are knowledge base files, not a separate feature module. The default "我的速记" base is locked/system-owned and seeded with migrated note-type files.

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

`SelectionMenu` and `BottomFloatingPanel` require the page root to be `relative`. The selection menu has no save action; it only keeps copy/highlight/translate/explain/follow-up. Saving should happen through the page-level "添加到库 / 保存到库" controls using `SaveToKnowledgeBaseSheet`.
