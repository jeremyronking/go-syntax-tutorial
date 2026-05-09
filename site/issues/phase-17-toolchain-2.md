---
title: "Phase 17: Content: Section K group 2 (test/format/vet/doc)"
---

# Phase 17: Content: Section K group 2 (test/format/vet/doc)

> Issue [#18](https://github.com/jeremyronking/go-syntax-tutorial/issues/18) · open

> Part of [#1](/issues/epic).

## What this phase delivers
Authored content for **Section K group 2: test, format, vet, doc** — daily-workflow toolchain, all `runMode: "terminal"`.

## Scope (6 lessons)
- `go test`: table tests, subtests with `t.Run`, `-run` regex, `t.Parallel`
- `go test`: benchmarks, examples, fuzzing (`-fuzz`)
- `go test -race`, `-cover`, `-coverprofile`, `go tool cover`
- `go fmt` / `gofmt` / `goimports`
- `go vet` and common analyzers
- `go doc` and pkg.go.dev conventions

(Original spec lessons 53–58.)

Each lesson: prose + `TerminalPane` with realistic captured output.

## Acceptance criteria
- [ ] All 6 lessons render with realistic terminal output.
- [ ] `go test` lesson includes a real `--- FAIL` example.
- [ ] Coverage lesson shows a real percentage from a tiny example package.
- [ ] No checkpoint in this phase.

## Dependencies
**Requires:** [#7](/issues/phase-06-terminal-pane).
**Unblocks:** [#20](/issues/phase-19-polish).

## Decision references
D6.1, D6.2, D9.1, D9.2.

---
**Estimate:** 5–7h.

