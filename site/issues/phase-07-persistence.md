---
title: "Phase 07: Persistence layer (zustand + localStorage)"
---

# Phase 07: Persistence layer (zustand + localStorage)

> Issue [#8](https://github.com/jeremyronking/go-syntax-tutorial/issues/8) · open

> Part of [#1](/issues/epic).

## What this phase delivers
The `gotour:v1` localStorage layer via zustand + persist middleware. Tracks lesson progress, editor drafts, checkpoint scores. "Reset progress" clears state.

## Scope
- `src/store/progress.ts`: zustand store with `progress: Record<slug, "unstarted" | "in-progress" | "complete">`, `editorDrafts: Record<slug, string>`, `checkpointScores: Record<id, { correct, total, lastAttempt }>`.
- `zustand/middleware/persist` keyed `gotour:v1`.
- Selector hooks: `useLessonStatus(slug)`, `useEditorDraft(slug)`, `useCheckpointScore(id)` + mutators.
- `CodeRunner` (Phase 05) writes drafts on debounce.
- `LessonView` marks lesson "in-progress" on first run, "complete" on explicit "Mark complete" or checkpoint pass (Phase 10).
- "Reset progress" footer button (clears the namespace and reloads).

## Acceptance criteria
- [ ] Reload preserves: editor draft, lesson progress, checkpoint scores.
- [ ] "Reset progress" clears the namespace and the store.
- [ ] No collision with `gotour:v1:theme` from Phase 03.
- [ ] Hydration is synchronous-feeling (no wrong-state flash).

## Dependencies
**Requires:** [#6](/issues/phase-05-code-runner).
**Unblocks:** [#9](/issues/phase-08-sidebar), [#11](/issues/phase-10-checkpoint-framework).

## Out of scope
- Server-side persistence.

## Decision references
D1.4, D3.1–D3.4.

---
**Estimate:** 4–6h.

