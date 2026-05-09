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

## What this is

Three coding agents — **Claude Code**, **Google Antigravity**, and the **Pi coding agent** running **GLM-5.1** — were each handed the same brief and the same set of GitHub issues, then turned loose to build an interactive Go tutorial autonomously.

The [spec](/spec) is the brief that defines the product. The [prompt](/prompt) is the meta-instruction that told each agent how to work. The [issues](/issues/epic) are the phased breakdown all three followed.

This site is the read-only docs surface. The three apps themselves are linked above.
