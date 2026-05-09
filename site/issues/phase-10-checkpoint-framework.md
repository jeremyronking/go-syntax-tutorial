---
title: "Phase 10: Checkpoint quiz framework"
---

# Phase 10: Checkpoint quiz framework

> Issue [#11](https://github.com/jeremyronking/go-syntax-tutorial/issues/11) · open

> Part of [#1](/issues/epic).

## What this phase delivers
The reusable Checkpoint quiz component (MCQ + fill-in-blank), per-question explanations, score persistence. ≥80% marks the section "complete" but never gates the next section.

## Scope
- Checkpoint type in `src/content/types.ts`: `{ id, sectionSlug, questions: Question[] }`. `Question` is a tagged union (`mcq` with options + correctIndex; `fill` with acceptedAnswers).
- `src/components/Checkpoint.tsx`: renders questions, accepts answers, on submit shows correct answers + one-sentence explanations, computes score.
- Score writes to `checkpointScores` (Phase 07).
- ≥80% sets every lesson in that section to `complete` in the progress map.
- Retake button (resets local input only; persisted high score is monotonic).
- "Skip — not now" link returns to last lesson without judgment.

## Acceptance criteria
- [ ] A 5-question MCQ checkpoint renders, accepts answers, scores correctly.
- [ ] Failing (<80%) does NOT block forward navigation.
- [ ] Per-question explanations show after submit.
- [ ] Highest score persists; retake doesn't lower it.
- [ ] No `any` in question definitions.

## Dependencies
**Requires:** [#5](/issues/phase-04-lesson-framework), [#8](/issues/phase-07-persistence).
**Unblocks:** [#12](/issues/phase-11-content-a-b)–[#19](/issues/phase-18-toolchain-3).

## Out of scope
- Authoring actual questions (each content phase does that).

## Decision references
D7.1, D7.2, D7.3, D7.4.

---
**Estimate:** 5–6h.

