# GoTour — Decision Log

Full traceability for every choice baked into the phased GitHub issues. Each entry has a **source** (`spec` = lifted from `specs/requirements.md`; `subagent` = answered by a Go-learner persona on 2026-05-09; `orchestrator` = my call as the spec-decomposer with explicit reasoning).

The Go-learner subagent: senior engineer (12+ yrs TS/Python/Java/Rust), zero production Go, wants to ship a small CLI next month, learns by *running and tweaking* code.

---

## D1. Tech stack & runtime

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D1.1 | Vite + React 18 + TypeScript + Tailwind | spec | Stated in `## Stack`. |
| D1.2 | Monaco Editor via `@monaco-editor/react`, Go language registered | spec | Stated. Heavier than CodeMirror but matches "IDE-adjacent" design and the learner's "I use VS Code daily" comfort (subagent #10). |
| D1.3 | `react-router-dom` for routing | spec | Stated. |
| D1.4 | `zustand` for global state, `zustand/middleware/persist` for localStorage hydration | spec + orchestrator | Spec says zustand; orchestrator picks the persist middleware as the cleanest binding to the localStorage namespace. |
| D1.5 | Node 20+, pnpm | spec | Stated. |
| D1.6 | Lessons authored as **typed TS objects**, not MDX | orchestrator | Spec said "MDX or typed objects." TS objects give type safety on the lesson schema (run mode, gotcha presence, etc.) without an MDX loader, and the prose is short enough (~150 words) that the markdown-in-string pattern is fine. |
| D1.7 | `react-markdown` + `remark-gfm` for prose rendering | orchestrator | Lightweight, no build step, matches "no UI framework beyond Tailwind" constraint. |
| D1.8 | `Fuse.js` for client-side search | spec | Stated. |
| D1.9 | `@fontsource/jetbrains-mono` for code font | spec | Stated. |

---

## D2. Code execution architecture

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D2.1 | Proxy `POST /api/compile` to `https://play.golang.org/compile` | spec | Playground blocks browser CORS; proxy is mandatory. |
| D2.2 | Vite dev proxy in `vite.config.ts`; Express app in `server/` for prod | spec | Stated. |
| D2.3 | Request body `version=2&body=<src>&withVet=true`, `application/x-www-form-urlencoded` | spec | Stated; matches the public Playground contract. |
| D2.4 | `PLAYGROUND_UPSTREAM` env var on the Express app, default `https://play.golang.org/compile` | spec | Stated. |
| D2.5 | Dockerfile for the proxy + README deploy notes (Fly.io and Render examples) | spec | Stated. |
| D2.6 | Render `Errors` and `VetErrors` **verbatim, in monospace, in red** — no friendly wrapping | subagent #10 | Subagent: "show me stderr verbatim... compiler errors are the single most important learning signal in a typed language; do not get cute with them." This is the failure mode to prevent at all costs. |
| D2.7 | Stream `Events` honoring nanosecond `Delay` only when the lesson opts in (concurrency / timing lessons); otherwise dump output instantly | subagent #4 | Subagent: "replay the delays honestly... but only for concurrency and timing lessons... no one needs a 200ms delay on hello world." |
| D2.8 | "Skip animation" button visible while replay is active | subagent #4 | Subagent explicitly asked for this. |

---

## D3. Persistence

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D3.1 | `localStorage` namespace `gotour:v1` | spec | Stated. |
| D3.2 | Three keys: `progress`, `editorDrafts`, `checkpointScores` (schemas per spec) | spec | Stated. |
| D3.3 | "Reset progress" button in footer | spec | Stated. |
| D3.4 | No backend / no auth / no telemetry | spec | Stated as a constraint. |

---

## D4. Information architecture & navigation

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D4.1 | Three-pane layout on `lg+`, two-pane on `md`, stacked on mobile | spec | Stated. |
| D4.2 | **Brief landing page** at `/` (section overview + "Start from beginning" + "Jump to a topic") rather than auto-redirecting to Lesson 1 | subagent #8 | Subagent: "auto-redirecting me into Hello World on first visit is presumptuous — I might already know `package main`." |
| D4.3 | **Fully open navigation** — every lesson clickable from the sidebar at all times. No linear unlock. | subagent #3 | Subagent: "I am absolutely going to jump to channels and generics on day one... a linear unlock would have me rage-quitting inside ten minutes." |
| D4.4 | Subtle "recommended order" indicator only (numbered prefix in sidebar) — no gating | subagent #3 | Compromise the subagent suggested: number the lessons but never lock. |
| D4.5 | Top bar contents per spec: logo, search trigger, theme toggle | spec | Stated. |

---

## D5. Lesson schema & rendering

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D5.1 | Lesson type fields: `slug`, `title`, `section`, `order`, `body`, `runMode`, `starterCode?`, `terminalOutput?`, `streamReplay?`, `gotcha?`, `checkpoint?` | orchestrator | Extends the spec's schema to capture the new `runMode` axis (D6.1) and the gotcha-callout pattern (D5.4). |
| D5.2 | `runMode` enum: `"playground"` (live execution), `"terminal"` (pre-baked output, see D6.1), `"annotated"` (no execution, just commented snippet) | orchestrator | Required to keep the rendering layer dumb — the lesson declares its mode and the layout follows. |
| D5.3 | Prose target: **~150 words + heavier code**, not 400 | subagent #6 | Subagent: "I learn by reading code and tweaking it. 400 words of prose per lesson across 63 lessons is 25,000 words I'm going to skim anyway." |
| D5.4 | Idioms / gotchas live in a **distinct callout box at the bottom** of each lesson, not inline | subagent #7 | Subagent: "inline gotchas get lost in prose I'm already skimming. A visually distinct box... is something my eye snaps to." |
| D5.5 | Concurrency lessons get a one-line italic note about the Playground's deterministic fake clock | subagent #5 | Subagent: "tell me upfront: 'Playground uses a deterministic fake clock; real runtime scheduling will differ.' One line, italic, done." |

---

## D6. Non-runnable lessons (toolchain, unsafe, cgo)

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D6.1 | Pre-baked **terminal pane** for non-runnable lessons (commands + actual output, terminal-styled). No "annotated only," no "go try locally" CTA. | subagent #1 | Subagent rejected both alternatives explicitly: annotated-only is "a cop-out," run-locally is "a homework assignment, and I'm not going to context-switch to my terminal mid-lesson for fifteen toolchain lessons." |
| D6.2 | Each terminal command line gets a "copy" affordance | subagent #1 | Subagent: "ideally include a tiny 'copy command' affordance for when I do want to try it locally." |
| D6.3 | Terminal pane is visually distinct from the live Monaco runner so the learner immediately knows it's frozen output | subagent #1 | Subagent: "style it like a terminal so I know it's not live." |
| D6.4 | Lessons in `runMode: "terminal"`: all of Section K (15 lessons), `unsafe` (#46), `cgo` (#47), `//go:embed` if multi-file (#44) | orchestrator | Mapped from Playground sandbox capabilities. Build tags (#48) is borderline-runnable and stays on `playground`. |

---

## D7. Checkpoints

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D7.1 | One checkpoint per section (11 total) | spec | Stated. |
| D7.2 | 3–5 questions per checkpoint, MCQ or fill-in-blank, focused on **idiomatic gotchas** (not trivia) | spec | Stated. |
| D7.3 | ≥80% marks the section "complete" but **does NOT block** access to subsequent sections | subagent #2 | Subagent: "hard-gating an experienced engineer behind an 80% quiz is infantilizing." Spec said "passing... marks the section complete" but didn't specify gating; subagent settles it. |
| D7.4 | On submit, show per-question explanation (correct answer + one-sentence why) | orchestrator | Standard learning UX; not contested in spec or subagent. |

---

## D8. Visual design

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D8.1 | Dark-first, IDE-adjacent. Light theme is opt-in via toggle. | spec | Stated. |
| D8.2 | Accent: Go gopher cyan `#00ADD8` | spec | Stated. |
| D8.3 | JetBrains Mono for code | spec | Stated. |
| D8.4 | Prose width capped at ~72ch | spec | Stated. |
| D8.5 | No emoji decoration in UI chrome | spec | Stated. |
| D8.6 | No UI framework beyond Tailwind (no shadcn, no MUI) | spec | Stated as a constraint. |

---

## D9. Toolchain section ordering (Section K)

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D9.1 | **Workflow grouping**, not frequency ordering | subagent #9 | Subagent: "frequency ordering... fragments mental models. `go build` and `go install` belong together..." |
| D9.2 | Three sub-groups: (a) build/run/modules; (b) test/format/vet/doc; (c) advanced (generate, env, cross-compile, ldflags, pprof/trace) | orchestrator | Maps the subagent's grouping to three implementation phases for sane PR sizes. |

---

## D10. Phasing & dependency model

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D10.1 | 19 phases + 1 tracking epic | orchestrator | Sized to the skill's 3–8h-per-phase rule. |
| D10.2 | Phases grouped by area: `infra` (1–3), `framework` (4–10), `content` (11–18), `polish` (19) | orchestrator | Lets the epic show progress by area. |
| D10.3 | Critical path: Scaffold → Proxy → Layout → Lesson framework → Code runner → Terminal pane → Persistence → Sidebar → Search → Checkpoints → 8 content phases → Polish | orchestrator | Each framework phase unblocks specific content needs; content phases are mostly parallelizable once framework is in place. |
| D10.4 | Content phases bundle related sections to keep each phase 4–7h: A+B / C+D / E+F+G / H solo (concurrency complexity) / I+J / K1 / K2 / K3 | orchestrator | 11 sections collapsed to 8 content phases. Section H stays alone because the streaming-replay machinery touches every lesson in it. |
| D10.5 | Initial commit lands on a feature branch (`spec/issue-breakdown`) per global CLAUDE.md rule; PR is the integration point | orchestrator | Matches the user's "ALWAYS use feature branches" directive. |

---

## D11. Quality gates

| ID | Decision | Source | Rationale |
|----|----------|--------|-----------|
| D11.1 | Lighthouse ≥90 perf, ≥95 a11y on production preview | spec | Stated. |
| D11.2 | Zero `any` outside tests; ESLint + Prettier clean | spec | Stated. |
| D11.3 | Each lesson must successfully execute (or render its terminal pane) end-to-end before the phase containing it is closed | orchestrator | Concrete acceptance criterion to back the spec's "every lesson must run" requirement. |

---

## D12. Open items deferred to implementation

These weren't decided here; they're noted so the implementing agent can address them in-phase:

- Exact wording / questions for each section's checkpoint (will be authored alongside the section's content phase).
- Exact pre-baked terminal output for each Section K lesson (must be captured by running the command on a clean Go 1.23+ workspace; see Phase 16/17/18 acceptance criteria).
- Whether to add a "What's new in Go 1.22+" badge on lessons that depend on recent semantics (e.g., loop variable capture). Suggested but not mandated.
- Hosting target for the proxy in production. README must document Fly.io and Render; the actual deploy is the user's call.
