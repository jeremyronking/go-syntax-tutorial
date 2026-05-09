---
title: "Phase 19: Polish: Lighthouse, README, CONTRIBUTING"
---

# Phase 19: Polish: Lighthouse, README, CONTRIBUTING

> Issue [#20](https://github.com/jeremyronking/go-syntax-tutorial/issues/20) · open

> Part of [#1](/issues/epic).

## What this phase delivers
Production readiness: Lighthouse targets met, README and CONTRIBUTING complete, final cross-browser smoke, keyboard shortcut docs.

## Scope
- Optimize: code-split Monaco, lazy-load lessons, defer non-critical CSS, cache static assets.
- A11y pass: focus order, color contrast, ARIA on palette and modals, `prefers-reduced-motion` respected (skips stream replay).
- README: prereqs, dev/prod commands, proxy deploy notes (Fly.io & Render snippets), full lesson slug list (auto-generated from `lessons.ts`), keyboard shortcut reference.
- CONTRIBUTING.md: how to add a lesson (one TS file in `src/content/lessons/`, register in `lessons.ts`, optional checkpoint, run-mode guidance).
- Final smoke: visit every lesson in the production preview.

## Acceptance criteria
- [ ] `pnpm build && pnpm preview` Lighthouse: Performance ≥ 90, Accessibility ≥ 95.
- [ ] README has working dev/prod/deploy commands, full slug list, all keyboard shortcuts.
- [ ] CONTRIBUTING.md covers the lesson authoring workflow end-to-end.
- [ ] `prefers-reduced-motion: reduce` skips stream replay automatically.
- [ ] No console warnings in production preview.
- [ ] Visited every lesson once in preview build; nothing 404s or crashes.

## Dependencies
**Requires:** [#12](/issues/phase-11-content-a-b), [#13](/issues/phase-12-content-c-d), [#14](/issues/phase-13-content-e-f-g), [#15](/issues/phase-14-content-h-concurrency), [#16](/issues/phase-15-content-i-j), [#17](/issues/phase-16-toolchain-1), [#18](/issues/phase-17-toolchain-2), [#19](/issues/phase-18-toolchain-3).
**Unblocks:** Epic close ([#1](/issues/epic)).

## Decision references
D11.1, D11.2, D11.3.

---
**Estimate:** 5–7h.

