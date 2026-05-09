---
title: "Phase 06: Pre-baked terminal pane (non-runnable lessons)"
---

# Phase 06: Pre-baked terminal pane (non-runnable lessons)

> Issue [#7](https://github.com/jeremyronking/go-syntax-tutorial/issues/7) · open

> Part of [#1](/issues/epic).

## What this phase delivers
A read-only terminal-style component for `runMode: "terminal"` lessons. Pre-baked commands and output, per-line copy affordance.

## Scope
- `src/components/TerminalPane.tsx`: renders `terminalOutput`, a structured `Array<{ kind: "command" | "stdout" | "stderr"; text: string }>`.
- Visually distinct from `CodeRunner` — terminal styling (prompt indicator, monospace, no editor frame).
- Per-`command` line: small copy-to-clipboard button copying just the command text.
- No Run button. No editor.
- `LessonView` switches between `CodeRunner` and `TerminalPane` based on `lesson.runMode`.

## Acceptance criteria
- [ ] A lesson with `runMode: "terminal"` renders `TerminalPane`, not Monaco.
- [ ] Copy button writes only the command (no `$` prompt).
- [ ] Visual diff between `CodeRunner` and `TerminalPane` is unmistakable.
- [ ] `runMode: "annotated"` renders a static syntax-highlighted block with no controls.

## Dependencies
**Requires:** [#5](/issues/phase-04-lesson-framework).
**Unblocks:** [#16](/issues/phase-15-content-i-j), [#17](/issues/phase-16-toolchain-1), [#18](/issues/phase-17-toolchain-2), [#19](/issues/phase-18-toolchain-3).

## Out of scope
- Actually executing toolchain commands.

## Decision references
D6.1, D6.2, D6.3, D6.4.

---
**Estimate:** 4–5h.

