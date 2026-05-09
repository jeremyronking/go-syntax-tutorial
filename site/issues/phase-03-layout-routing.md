---
title: "Phase 03: Layout, routing, theming & landing page"
---

# Phase 03: Layout, routing, theming & landing page

> Issue [#4](https://github.com/jeremyronking/go-syntax-tutorial/issues/4) · open

> Part of [#1](/issues/epic).

## What this phase delivers
The visual shell: top bar, three-pane layout (sidebar / prose / editor placeholders), responsive breakpoints, theme toggle, and a non-trivial landing page route.

## Scope
- `react-router-dom` v6 with routes `/` (landing) and `/lesson/:slug` (placeholder content).
- `src/components/Layout.tsx`: three-pane on `lg+`, two-pane on `md`, stacked on `sm`.
- Top bar: GoTour logo, search trigger placeholder (Cmd/Ctrl+K hint, real impl in Phase 09), theme toggle (light/dark, dark default).
- Landing page (`/`): section overview (11 sections), "Start from beginning" → first lesson, "Jump to a topic" with section-anchored list.
- Sidebar placeholder component (real list in Phase 08).
- Theme toggle persists to localStorage (`gotour:v1:theme`).
- Tailwind container width capped at ~72ch for prose.

## Acceptance criteria
- [ ] Landing page renders all 11 sections with anchor links.
- [ ] Three-pane / two-pane / stacked breakpoints visually correct.
- [ ] Theme toggle flips dark↔light and survives reload.
- [ ] Routes resolve; `/lesson/hello-world` shows placeholder.
- [ ] Lighthouse a11y ≥ 95 on the landing page.

## Dependencies
**Requires:** [#2](/issues/phase-01-project-scaffold).
**Unblocks:** [#5](/issues/phase-04-lesson-framework), [#9](/issues/phase-08-sidebar), [#10](/issues/phase-09-search-palette).

## Out of scope
- Real sidebar lesson list (Phase 08). Real search (Phase 09). Real lesson rendering (Phase 04).

## Decision references
D4.1, D4.2, D4.5, D8.1–D8.4.

---
**Estimate:** 5–7h.

