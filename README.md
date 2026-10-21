# GoTour

**Five takes on the same Go tutorial.**

Live site: [go.jking.ai](https://go.jking.ai)

One spec, five model families. Pick one to compare prose, pacing, the runner UI, and how each handles the parts the Playground sandbox can't actually run.

- [Read the spec](./site/spec.md)
- [Read the prompt](./site/prompt.md)
- [Browse issues](./site/issues/epic.md)

## The five apps

- **go-claude** — Built by Claude (Opus 4.7) in Claude Code. Right-hand sticky code panel, terminal pane for non-runnable lessons, Cmd+K palette. → [go-claude.jking.ai](https://go-claude.jking.ai)
- **go-gemini** — Built by Gemini in Google Antigravity. The Gemini take on the same lesson set. → [go-gemini.jking.ai](https://go-gemini.jking.ai)
- **go-glm** — Built by GLM-5.1 (cloud) in the Pi coding agent. The GLM take on the same lesson set. → [go-glm.jking.ai](https://go-glm.jking.ai)
- **go-minimax** — Built by MiniMax (via Ollama cloud) in OpenAI's Codex CLI. The MiniMax take on the same lesson set. → [go-minimax.jking.ai](https://go-minimax.jking.ai)
- **go-beam** — Built by Beam (via Ollama cloud) in the opencode agent harness. The Beam take on the same lesson set. → [go-beam.jking.ai](https://go-beam.jking.ai)

## By the numbers

Wall-clock between the agent's first phase commit and its Phase 19 polish commit, plus a few git-derivable side-channels:

| | go-claude | go-gemini | go-glm | go-minimax | go-beam |
|---|---|---|---|---|---|
| **Implementation time** | 24m 32s | 36m 18s | 1h 13m 18s | 48m 15s | ~5m (reported) |
| **Commits** (Phase 01–19) | 19 | 19 | 15 (some bundled) | 19 | 19 (empty, see below) |
| **Lines added** (excl. lockfile) | 4,997 | 4,744 | 5,494 | 5,331 | 2,273 |
| **Files created** | 125 | 54 | 47 | 73 | 28 |
| **Subscription** | Claude Max ($100/mo) | Google AI Pro ($20/mo, via Google One) | Ollama ($20/mo) | Ollama ($20/mo) | Ollama ($20/mo) |

A few honest caveats:

- "Implementation time" is wall-clock between commits, not active model think-time. It includes any pauses, retries, or tool waits the agent didn't actively bill against.
- All five started from the same `458d83c` baseline (the spec commit). The clock starts at each agent's first phase commit so kickoff lag isn't counted.
- **go-glm**'s extra hour is mid-run rework, not after-the-fact debugging: clean cadence through Phase 12, then ~41 minutes across two bundled "Phase 12–14" / "Phase 14–18" commits that revisit earlier work. Post-Phase-19 commits (a directory restructure and a dark-mode fix) are not included.
- **go-minimax** ran clean — one commit per phase, all 19. Those per-phase commits live on the `codex/full-implementation` branch; they were folded into a single commit when the app was merged to `main`, so the granular history is preserved on the branch.
- **go-beam**'s time is the operator's estimate, not a git measurement. All of its code landed in one commit (`0aeb1a1`); the 19 phase commits that follow it are empty and share a single timestamp, so git can't time the run phase by phase. It also wrote the least code of the five: one `lessons.ts` registry holding 64 lessons.
- **go-claude**'s file count is an architecture choice — one TypeScript module per lesson — not 2× the work. The others leaned on fewer, registry-style modules.
- Token usage and model think-time aren't shown; git can't see them. Subscription cost is the flat monthly rate, not the marginal cost of this run.
- All five runs were driven from the same workstation — an **M4 Max MacBook Pro (36 GB)** — but inference happened in each provider's cloud, so the laptop spec didn't influence the comparison.

## What this is

Five coding agents — **Claude Code**, **Google Antigravity**, the **Pi coding agent** running **GLM-5.1**, **OpenAI's Codex CLI** running **MiniMax** (via Ollama cloud), and **opencode** running **Beam** (via Ollama cloud) — were each handed the same brief and the same set of GitHub issues, then turned loose to build an interactive Go tutorial autonomously.

The [spec](./site/spec.md) is the brief that defines the product. The [prompt](./site/prompt.md) is the meta-instruction that told each agent how to work. The [issues](./site/issues/epic.md) are the phased breakdown all five followed.

This repo holds the read-only docs surface (under `site/`) and the five app implementations (`go-claude/`, `go-gemini/`, `go-glm/`, `go-codex-minimax/`, `go-opencode-beam/`). The five apps themselves are linked above.

## License

[MIT](./LICENSE) — use it, fork it, ship it.
