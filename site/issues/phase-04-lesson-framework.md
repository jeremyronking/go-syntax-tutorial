---
title: "Phase 04: Lesson framework: types, registry, renderer"
---

# Phase 04: Lesson framework: types, registry, renderer

> Issue [#5](https://github.com/jeremyronking/go-syntax-tutorial/issues/5) · open

> Part of [#1](/issues/epic).

## What this phase delivers
The lesson content type, the registry that holds all lessons, and the `LessonView` component (prose + bottom Gotcha callout). One fully wired sample lesson (Hello, world).

## Scope
- `src/content/types.ts`: `Lesson` with `slug`, `title`, `section`, `order`, `body` (markdown), `runMode` (`"playground" | "terminal" | "annotated"`), `starterCode?`, `terminalOutput?`, `streamReplay?: boolean`, `gotcha?: string`, `checkpoint?` (Phase 10).
- `src/content/lessons.ts`: typed registry, exports `lessons: Lesson[]` and `lessonBySlug(slug)`.
- `src/components/LessonView.tsx`: title, prose (`react-markdown` + `remark-gfm`), Gotcha callout box at bottom, placeholder code/terminal slot.
- One authored sample: Hello, world (`runMode: "playground"`).
- `/lesson/:slug` route wired to `LessonView` via the registry.

## Acceptance criteria
- [ ] `/lesson/hello-world` renders prose + placeholder code area; no console errors.
- [ ] `LessonView` shows `gotcha` only when present in a visually distinct callout.
- [ ] Lesson type is exported and consumed in `lessons.ts` with full type safety.
- [ ] Markdown supports code fences, lists, links, inline code.

## Dependencies
**Requires:** [#4](/issues/phase-03-layout-routing).
**Unblocks:** [#6](/issues/phase-05-code-runner), [#7](/issues/phase-06-terminal-pane), [#11](/issues/phase-10-checkpoint-framework), [#12](/issues/phase-11-content-a-b)–[#19](/issues/phase-18-toolchain-3).

## Out of scope
- Real Monaco editor (Phase 05). Terminal pane (Phase 06). Checkpoint UI (Phase 10).

## Decision references
D1.6, D1.7, D5.1, D5.2, D5.3, D5.4.

---
**Estimate:** 5–7h.

