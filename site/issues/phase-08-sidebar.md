---
title: "Phase 08: Sidebar, section grouping, progress UI"
---

# Phase 08: Sidebar, section grouping, progress UI

> Issue [#9](https://github.com/jeremyronking/go-syntax-tutorial/issues/9) · open

> Part of [#1](/issues/epic).

## What this phase delivers
The functional left-rail sidebar: section grouping, lesson rows with order numbers and completion checkmarks, per-section progress bars. Every lesson always navigable.

## Scope
- `src/components/Sidebar.tsx`: groups lessons by `section`, ordered by `order`.
- Each row: order number prefix, lesson title, checkmark when complete.
- Per-section progress bar: `complete / total`.
- All lessons always clickable — no progress-based locking.
- Collapse/expand per section; state persisted (`gotour:v1:sidebar`).
- Active lesson highlighted; keyboard navigable (Tab, Enter).
- Prev/Next links at the bottom of `LessonView`.

## Acceptance criteria
- [ ] Sidebar lists every lesson grouped by section.
- [ ] Checkmarks reflect store state in real time.
- [ ] All rows clickable regardless of completion.
- [ ] Collapse/expand state survives reload.
- [ ] Prev/Next traverses across section boundaries correctly.

## Dependencies
**Requires:** [#4](/issues/phase-03-layout-routing), [#8](/issues/phase-07-persistence).
**Unblocks:** None.

## Out of scope
- Search (Phase 09). Locking on progress (rejected per D4.3).

## Decision references
D4.3, D4.4.

---
**Estimate:** 4–5h.

