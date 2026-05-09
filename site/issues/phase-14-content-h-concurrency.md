---
title: "Phase 14: Content: Section H (concurrency, solo)"
---

# Phase 14: Content: Section H (concurrency, solo)

> Issue [#15](https://github.com/jeremyronking/go-syntax-tutorial/issues/15) · open

> Part of [#1](/issues/epic).

## What this phase delivers
Authored content for **Section H: Concurrency** (34–40), exercising the streamed-replay UI in earnest. Solo phase — concurrency is the densest material and the only section where output timing matters.

## Scope (7 lessons + 1 checkpoint)
34. Goroutines (cost, lifecycle)
35. Channels: unbuffered vs buffered, send/receive
36. `close`, `range` over channels, nil channel behavior
37. `select` (default case, timeouts with `time.After`)
38. `sync`: `Mutex`, `RWMutex`, `WaitGroup`, `Once`, `Cond`
39. `sync/atomic` and the memory model in one paragraph
40. `context.Context` — cancellation, deadlines, values (with anti-patterns)

Every lesson:
- One-line italic note: "Playground uses a deterministic fake clock; real runtime scheduling will differ."
- `streamReplay: true` for lessons where output interleaving / timing is the point (34, 35, 36, 37 at minimum).
- Gotcha callouts: nil channel never sends/receives; sending on closed channel panics; etc.

## Acceptance criteria
- [ ] All 7 lessons run successfully and produce expected interleaved output.
- [ ] Stream replay visibly works on lesson 34.
- [ ] "Skip animation" works on every replay-enabled lesson.
- [ ] Every lesson has the deterministic-clock note.
- [ ] Section H checkpoint: 5 questions including "send on closed channel" and "select with default."

## Dependencies
**Requires:** [#6](/issues/phase-05-code-runner), [#11](/issues/phase-10-checkpoint-framework).
**Unblocks:** [#20](/issues/phase-19-polish).

## Decision references
D2.7, D2.8, D5.5, D7.2.

---
**Estimate:** 6–8h.

