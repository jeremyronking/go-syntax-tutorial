---
title: "Phase 12: Content: Sections C + D (composite types, functions)"
---

# Phase 12: Content: Sections C + D (composite types, functions)

> Issue [#13](https://github.com/jeremyronking/go-syntax-tutorial/issues/13) · open

> Part of [#1](/issues/epic).

## What this phase delivers
Authored content for **Section C: Composite types** (15–19) and **Section D: Functions** (20–23), plus checkpoints.

## Scope (9 lessons + 2 checkpoints)
**Section C:**
15. Arrays (fixed length, value semantics)
16. Slices (header layout, `append` growth, three-index slicing, `copy`, aliasing pitfalls)
17. Maps (zero value is nil, comma-ok, deletion, iteration order)
18. Structs (composite literals, field tags, anonymous fields, comparability)
19. Pointers (no arithmetic, `new`, taking address of composite literals)

**Section D:**
20. Functions, multi-return, named returns, naked `return`
21. Variadic functions, slice-spread with `...`
22. First-class functions & closures
23. Methods, value vs pointer receivers, method sets, addressability

## Acceptance criteria
- [ ] All 9 lessons run successfully.
- [ ] Lesson 16 has a prominent gotcha on slice aliasing.
- [ ] Lesson 23 has a gotcha on value vs pointer receivers.
- [ ] Section C checkpoint: 5 questions, including a slice-aliasing print-output trap.
- [ ] Section D checkpoint: 4–5 questions including "which receiver type for a mutator."

## Dependencies
**Requires:** [#6](/issues/phase-05-code-runner), [#11](/issues/phase-10-checkpoint-framework).
**Unblocks:** [#20](/issues/phase-19-polish).

## Decision references
D5.3, D5.4, D7.2.

---
**Estimate:** 5–7h.

