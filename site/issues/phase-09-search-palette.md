---
title: "Phase 09: Search & command palette (Cmd/Ctrl+K)"
---

# Phase 09: Search & command palette (Cmd/Ctrl+K)

> Issue [#10](https://github.com/jeremyronking/go-syntax-tutorial/issues/10) · open

> Part of [#1](/issues/epic).

## What this phase delivers
A Cmd/Ctrl+K command palette using Fuse.js to fuzzy-search lesson title, section, and prose body.

## Scope
- `src/lib/search.ts`: Fuse instance from the lesson registry, weighted (title > section > body).
- `src/components/CommandPalette.tsx`: modal opened by Cmd/Ctrl+K (also clickable from top bar). ESC closes.
- Result rows: title + section breadcrumb + matching snippet; arrow keys + Enter.
- Debounced query input.
- Focus trap; restores focus on close.

## Acceptance criteria
- [ ] Cmd/Ctrl+K opens the palette from any route.
- [ ] Typing "channel" surfaces all channel-related lessons.
- [ ] Enter on a result navigates to `/lesson/:slug`.
- [ ] No layout shift when palette opens.
- [ ] A11y: `role="dialog"`, focus trap, screen-reader-friendly.

## Dependencies
**Requires:** [#4](/issues/phase-03-layout-routing), [#5](/issues/phase-04-lesson-framework).
**Unblocks:** None.

## Out of scope
- Backend search. Fuzzy code-snippet search.

## Decision references
D1.8.

---
**Estimate:** 4–6h.

