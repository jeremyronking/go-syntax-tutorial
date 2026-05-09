---
title: "Phase 13: Content: Sections E + F + G (interfaces, generics, errors)"
---

# Phase 13: Content: Sections E + F + G (interfaces, generics, errors)

> Issue [#14](https://github.com/jeremyronking/go-syntax-tutorial/issues/14) · open

> Part of [#1](/issues/epic).

## What this phase delivers
Authored content for **Section E: Interfaces** (24–27), **Section F: Generics** (28–30), **Section G: Errors, panic, recover** (31–33), with checkpoints.

## Scope (10 lessons + 3 checkpoints)
**Section E:**
24. Interfaces, implicit satisfaction, `any`
25. Type assertions, comma-ok, type switches revisited
26. Embedding (struct, interface, method promotion)
27. Common stdlib interfaces: `error`, `Stringer`, `io.Reader`/`Writer`

**Section F:**
28. Type parameters, type inference
29. Constraints, `comparable`, `~` underlying-type approximation, type sets
30. When *not* to reach for generics

**Section G:**
31. The `error` interface, sentinel errors, `errors.Is` / `errors.As`
32. Wrapping with `fmt.Errorf("...: %w", err)`
33. `panic` / `recover` and when each is appropriate

## Acceptance criteria
- [ ] All 10 lessons run successfully.
- [ ] Lesson 30 explicitly argues against generics-everywhere; gotcha box.
- [ ] Lesson 33 makes "panic is not exception handling" explicit.
- [ ] One checkpoint per section; each 3–5 questions.

## Dependencies
**Requires:** [#6](/issues/phase-05-code-runner), [#11](/issues/phase-10-checkpoint-framework).
**Unblocks:** [#20](/issues/phase-19-polish).

## Decision references
D5.3, D5.4, D7.2.

---
**Estimate:** 6–8h.

