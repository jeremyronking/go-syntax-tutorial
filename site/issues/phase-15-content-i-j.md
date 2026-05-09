---
title: "Phase 15: Content: Sections I + J (packages, reflection/low-level)"
---

# Phase 15: Content: Sections I + J (packages, reflection/low-level)

> Issue [#16](https://github.com/jeremyronking/go-syntax-tutorial/issues/16) · open

> Part of [#1](/issues/epic).

## What this phase delivers
Authored content for **Section I: Packages & project layout** (41–44) and **Section J: Reflection & low-level** (45–48), with checkpoints. Mixes `playground` and `terminal` run modes.

## Scope (8 lessons + 2 checkpoints)
**Section I:**
41. Packages, exported vs unexported (`playground`)
42. `init()` order, package-level variable init (`playground`)
43. `internal/` directories, import paths, `go.mod` `module` path (`terminal` — multi-package)
44. `//go:embed` (`terminal` — needs files outside the snippet)

**Section J:**
45. `reflect` basics — `TypeOf`, `ValueOf`, kind vs type (`playground`)
46. `unsafe.Pointer` and `unsafe.Sizeof` (`terminal` — sandbox forbids unsafe)
47. `cgo` (`terminal` — sandbox forbids cgo)
48. Build tags `//go:build` (`playground`)

## Acceptance criteria
- [ ] All 8 lessons render in their declared run mode.
- [ ] Lessons 43, 44, 46, 47 use `TerminalPane` with realistic pre-baked output.
- [ ] Lesson 48's `//go:build` snippet actually compiles on the Playground.
- [ ] Section I checkpoint: 4 questions on package layout & init order.
- [ ] Section J checkpoint: 3–4 questions, intentionally short.

## Dependencies
**Requires:** [#6](/issues/phase-05-code-runner), [#7](/issues/phase-06-terminal-pane), [#11](/issues/phase-10-checkpoint-framework).
**Unblocks:** [#20](/issues/phase-19-polish).

## Decision references
D6.1, D6.4, D7.2.

---
**Estimate:** 5–7h.

