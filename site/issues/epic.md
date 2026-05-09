---
title: "GoTour: phased delivery (epic)"
---

# GoTour: phased delivery (epic)

> Issue [#1](https://github.com/jeremyronking/go-syntax-tutorial/issues/1) · closed

# GoTour — phased delivery

This epic tracks the build of the GoTour interactive Go syntax & toolchain tutorial described in `specs/requirements.md`. All decisions baked into the breakdown are logged in `docs/decisions.md`.

## How to use this epic
- Each phase below is a separately-implementable issue.
- Dependencies are inside each phase issue (and reflected in the order of the checklist).
- Content phases (11–18) can run in parallel after framework phases (1–10) close.

## Phase checklist
- [ ] Phase 01 — Project scaffold & dev environment — [#2](/issues/phase-01-project-scaffold)
- [ ] Phase 02 — Go Playground proxy infrastructure — [#3](/issues/phase-02-playground-proxy)
- [ ] Phase 03 — Layout, routing, theming & landing page — [#4](/issues/phase-03-layout-routing)
- [ ] Phase 04 — Lesson framework: types, registry, renderer — [#5](/issues/phase-04-lesson-framework)
- [ ] Phase 05 — Code runner: Monaco + execute + stream replay — [#6](/issues/phase-05-code-runner)
- [ ] Phase 06 — Pre-baked terminal pane (non-runnable lessons) — [#7](/issues/phase-06-terminal-pane)
- [ ] Phase 07 — Persistence layer (zustand + localStorage) — [#8](/issues/phase-07-persistence)
- [ ] Phase 08 — Sidebar, section grouping, progress UI — [#9](/issues/phase-08-sidebar)
- [ ] Phase 09 — Search & command palette (Cmd/Ctrl+K) — [#10](/issues/phase-09-search-palette)
- [ ] Phase 10 — Checkpoint quiz framework — [#11](/issues/phase-10-checkpoint-framework)
- [ ] Phase 11 — Content: Sections A + B (fundamentals, control flow) — [#12](/issues/phase-11-content-a-b)
- [ ] Phase 12 — Content: Sections C + D (composite types, functions) — [#13](/issues/phase-12-content-c-d)
- [ ] Phase 13 — Content: Sections E + F + G (interfaces, generics, errors) — [#14](/issues/phase-13-content-e-f-g)
- [ ] Phase 14 — Content: Section H (concurrency, solo) — [#15](/issues/phase-14-content-h-concurrency)
- [ ] Phase 15 — Content: Sections I + J (packages, reflection/low-level) — [#16](/issues/phase-15-content-i-j)
- [ ] Phase 16 — Content: Section K group 1 (build/run/modules) — [#17](/issues/phase-16-toolchain-1)
- [ ] Phase 17 — Content: Section K group 2 (test/format/vet/doc) — [#18](/issues/phase-17-toolchain-2)
- [ ] Phase 18 — Content: Section K group 3 (advanced toolchain) — [#19](/issues/phase-18-toolchain-3)
- [ ] Phase 19 — Polish: Lighthouse, README, CONTRIBUTING — [#20](/issues/phase-19-polish)

## Dependency graph (textual)
```
01 ──┬─► 02 ──► 05
     └─► 03 ──► 04 ──┬─► 05 ──► 11..18
                     ├─► 06 ──► 16, 17, 18
                     ├─► 07 ──┬─► 08
                     │         └─► 10 ──► 11..18
                     ├─► 08
                     ├─► 09
                     └─► 10
11..18 ──► 19
```

## Acceptance: epic closes when
- All 19 phase issues are closed.
- Production preview meets Lighthouse Perf ≥ 90 / A11y ≥ 95.
- Every lesson runs (or renders its terminal pane) end-to-end.

