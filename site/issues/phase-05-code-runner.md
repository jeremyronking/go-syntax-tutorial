---
title: "Phase 05: Code runner: Monaco + execute + stream replay"
---

# Phase 05: Code runner: Monaco + execute + stream replay

> Issue [#6](https://github.com/jeremyronking/go-syntax-tutorial/issues/6) · open

> Part of [#1](/issues/epic).

## What this phase delivers
The Monaco-based interactive code area for `runMode: "playground"` lessons: Run / Reset, output rendering, optional streamed replay. Compiler errors render verbatim — no friendly wrapping.

## Scope
- `src/components/CodeRunner.tsx`: `@monaco-editor/react` with Go language registered.
- Run button (Cmd/Ctrl+Enter) → `POST /api/compile` (form-encoded, `version=2`, `withVet=true`).
- Reset button restores `lesson.starterCode`.
- Output pane: monospace, dark background, stdout + stderr in **exact** strings from upstream. `Errors` and `VetErrors` rendered verbatim, in red, monospace.
- Replay: when `lesson.streamReplay === true`, render `Events` honoring `Delay` (nanoseconds → ms). Otherwise dump instantly.
- "Skip animation" button visible only during a replay.
- Editor change events fire (consumed by Phase 07).

## Acceptance criteria
- [ ] Cmd/Ctrl+Enter runs the snippet; output appears.
- [ ] A program with a compile error renders the raw error string verbatim, in red, monospace, file/line preserved.
- [ ] A `streamReplay` lesson with `time.Sleep` visibly delays output; "Skip animation" cuts to final state.
- [ ] A non-`streamReplay` lesson dumps output immediately.
- [ ] Reset restores starter code and clears output.

## Dependencies
**Requires:** [#3](/issues/phase-02-playground-proxy), [#5](/issues/phase-04-lesson-framework).
**Unblocks:** [#12](/issues/phase-11-content-a-b)–[#19](/issues/phase-18-toolchain-3).

## Out of scope
- Persistence (Phase 07). Terminal pane (Phase 06).

## Decision references
D1.2, D2.6, D2.7, D2.8, D11.3.

---
**Estimate:** 6–8h.

