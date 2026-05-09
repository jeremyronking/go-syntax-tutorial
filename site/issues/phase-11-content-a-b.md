---
title: "Phase 11: Content: Sections A + B (fundamentals, control flow)"
---

# Phase 11: Content: Sections A + B (fundamentals, control flow)

> Issue [#12](https://github.com/jeremyronking/go-syntax-tutorial/issues/12) · closed

> Part of [#1](/issues/epic).

## What this phase delivers
Authored content for **Section A: Language fundamentals** (lessons 1–7) and **Section B: Control flow** (lessons 8–14), plus checkpoints.

## Scope (14 lessons + 2 checkpoints)
**Section A:**
1. Hello, world & program structure
2. `go run` vs `go build` (brief; cross-links to Section K)
3. Variables: `var`, `:=`, multiple assignment, blank identifier
4. Constants & `iota` (bit-flag pattern, expression repetition)
5. Basic types, zero values, type conversions (no implicit conversion)
6. Strings, runes, bytes; UTF-8 iteration with `range`
7. Numeric types, overflow, untyped constants

**Section B:**
8. `if` (init statement)
9. `for` (3-clause, while-style, infinite, `range`)
10. Loop variable capture (pre-1.22 vs 1.22+)
11. `switch` (no fallthrough, expression-less, multi-value)
12. `type switch`
13. `defer` (LIFO, arg evaluation timing, gotchas in loops)
14. `goto`, labels, labeled `break`/`continue`

Each lesson: ~150 words prose + heavier code, `runMode: "playground"`, gotcha callout where applicable.

## Acceptance criteria
- [ ] All 14 lessons authored; each runs successfully against the Playground.
- [ ] Lesson 10 explicitly notes the Go 1.22+ semantic change.
- [ ] Lesson 13 has a gotcha box on `defer` arg evaluation timing.
- [ ] Section A checkpoint: 5 questions on `iota`, zero values, untyped constants.
- [ ] Section B checkpoint: 5 questions including a `defer` evaluation-order trap.
- [ ] No `any` in lesson definitions.

## Dependencies
**Requires:** [#6](/issues/phase-05-code-runner), [#11](/issues/phase-10-checkpoint-framework).
**Unblocks:** [#20](/issues/phase-19-polish).

## Out of scope
- Sections C–K.

## Decision references
D5.3, D5.4, D7.2.

---
**Estimate:** 6–8h.

