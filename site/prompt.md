---
title: The prompt
---

# The prompt

Each of the three coding agents — **Claude** (via Claude Code), **Gemini** (via Google Antigravity), and **GLM-5.1** (via the Pi coding agent) — was handed the same product [spec](/spec) and the same set of [phased GitHub issues](/issues/epic), then given the instruction below.

> What I would like you to do is create this application in a folder called `go-XXX` using a git worktree (from `main`) to not affect the current active branch. You are responsible for implementing **ALL issues** which are mapped out in `gh issue #1`. **DO NOT CLOSE THE ISSUES**, please.
>
> You are to run **fully autonomous** without my input. All decisions are your own.
>
> The issues do have dependencies, so be sure to follow that dependency order. Finally, create a **SINGLE PR** for this work. Each commit should map to the issue you implemented.

## What this constrains

- **One worktree per agent**, branched from `main`, so the three implementations stay parallel and isolated.
- **Issue-driven scope.** The phased breakdown ([epic #1](/issues/epic)) is the ground truth — no tasks invented, no tasks skipped.
- **No human-in-the-loop.** Every design call (file layout, naming, lib choices left open by the spec, copy decisions) is the agent's.
- **Commits = issues.** Each commit corresponds to a single phase issue, so you can read the PR top-to-bottom and watch the product assemble.
- **Issues stay open.** Closing them is the human's call after review; the agents are not allowed to mark their own work done.

## Where to look next

- [The spec](/spec) — the product brief shared across all three runs.
- [The epic](/issues/epic) — the phase-by-phase plan all three agents executed.
- The three apps: [go-claude](https://go-claude.jking.ai) · [go-gemini](https://go-gemini.jking.ai) · [go-glm](https://go-glm.jking.ai).
