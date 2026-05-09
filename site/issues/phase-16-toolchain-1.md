---
title: "Phase 16: Content: Section K group 1 (build/run/modules)"
---

# Phase 16: Content: Section K group 1 (build/run/modules)

> Issue [#17](https://github.com/jeremyronking/go-syntax-tutorial/issues/17) · open

> Part of [#1](/issues/epic).

## What this phase delivers
Authored content for **Section K group 1: build/run/modules** — foundational toolchain, all `runMode: "terminal"`. Workflow grouping per D9.

## Scope (5 lessons)
- `go run`, `go build`, output paths, `-o`
- `go install` and `GOBIN`
- `go mod init` / `tidy` / `get` / `why` / `graph` / `replace` / `vendor`
- `go work` multi-module workspaces

(Original spec lessons 49–52, regrouped per workflow ordering — D9.)

Each lesson: prose + `TerminalPane` showing realistic command + output captured from a Go 1.23+ workspace.

## Acceptance criteria
- [ ] All lessons render with realistic terminal output (verified against a clean Go 1.23 workspace).
- [ ] Each command line in `TerminalPane` has a working copy button.
- [ ] No checkpoint (Section K checkpoint lands in Phase 18).

## Dependencies
**Requires:** [#7](/issues/phase-06-terminal-pane).
**Unblocks:** [#20](/issues/phase-19-polish).

## Decision references
D6.1, D6.2, D9.1, D9.2.

---
**Estimate:** 5–7h.

