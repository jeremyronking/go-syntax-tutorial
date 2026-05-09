---
layout: home

hero:
  name: GoTour
  text: Three takes on the same Go tutorial.
  tagline: One spec, three model families. Pick one to compare prose, pacing, the runner UI, and how each handles the parts the Playground sandbox can't actually run.
  actions:
    - theme: brand
      text: Read the spec
      link: /spec
    - theme: alt
      text: Read the prompt
      link: /prompt
    - theme: alt
      text: Browse issues
      link: /issues/epic

features:
  - title: go-claude
    details: Built by Claude (Opus 4.7) in Claude Code. Right-hand sticky code panel, terminal pane for non-runnable lessons, Cmd+K palette.
    link: https://go-claude.jking.ai
    linkText: Open go-claude
  - title: go-gemini
    details: Built by Gemini in Google Antigravity. The Gemini take on the same lesson set.
    link: https://go-gemini.jking.ai
    linkText: Open go-gemini
  - title: go-glm
    details: Built by GLM-5.1 (cloud) in the Pi coding agent. The GLM take on the same lesson set.
    link: https://go-glm.jking.ai
    linkText: Open go-glm
---

## By the numbers

Wall-clock between the agent's first phase commit and its Phase 19 polish commit, plus a few git-derivable side-channels:

| | go-claude | go-gemini | go-glm |
|---|---|---|---|
| **Implementation time** | 24m 32s | 36m 18s | 1h 13m 18s |
| **Commits** (Phase 01–19) | 19 | 19 | 15 (some bundled) |
| **Lines added** (excl. lockfile) | 4,997 | 4,744 | 5,494 |
| **Files created** | 125 | 54 | 47 |
| **Subscription** | Claude Max ($100/mo) | Google AI Pro ($20/mo, via Google One) | Ollama ($20/mo) |

A few honest caveats:

- "Implementation time" is wall-clock between commits, not active model think-time. It includes any pauses, retries, or tool waits the agent didn't actively bill against.
- All three started from the same `458d83c` baseline (the spec commit). The clock starts at each agent's first phase commit so kickoff lag isn't counted.
- **go-glm**'s extra hour is mid-run rework, not after-the-fact debugging: clean cadence through Phase 12, then ~41 minutes across two bundled "Phase 12–14" / "Phase 14–18" commits that revisit earlier work. Post-Phase-19 commits (a directory restructure and a dark-mode fix) are not included.
- **go-claude**'s file count is an architecture choice — one TypeScript module per lesson — not 2× the work. The other two used a small handful of registry modules.
- Token usage and model think-time aren't shown; git can't see them. Subscription cost is the flat monthly rate, not the marginal cost of this run.
- All three runs were driven from the same workstation — an **M4 Max MacBook Pro (36 GB)** — but inference happened in each provider's cloud, so the laptop spec didn't influence the comparison.

## What this is

Three coding agents — **Claude Code**, **Google Antigravity**, and the **Pi coding agent** running **GLM-5.1** — were each handed the same brief and the same set of GitHub issues, then turned loose to build an interactive Go tutorial autonomously.

The [spec](/spec) is the brief that defines the product. The [prompt](/prompt) is the meta-instruction that told each agent how to work. The [issues](/issues/epic) are the phased breakdown all three followed.

This site is the read-only docs surface. The three apps themselves are linked above.
