# Build "GoTour" — an interactive Go syntax & toolchain tutorial

## Audience & tone
The learner is an experienced software engineer (10+ yrs, polyglot). Skip CS fundamentals — no explanations of compilers, static typing, pointers-as-a-concept, concurrency theory, etc. Each lesson should answer "how does Go specifically spell this?" in 2–4 sentences plus a runnable example. Highlight Go's idioms and gotchas (e.g., nil maps panic on write, slice aliasing, `for` loop variable capture pre/post-1.22, value vs pointer receivers, zero-value usefulness, comma-ok idiom, `defer` evaluation timing).

## Stack
- **Vite + React 18 + TypeScript + Tailwind CSS**
- **Monaco Editor** (`@monaco-editor/react`) with the `go` language registered for syntax highlighting
- **react-router-dom** for lesson routing (`/lesson/:slug`)
- **zustand** for global state (current lesson, progress map)
- **Node 20+**, package manager: pnpm

## Code execution architecture
Use the public Go Playground compile endpoint. It blocks browser CORS, so:

1. **Dev:** add a Vite proxy in `vite.config.ts` mapping `/api/compile` → `https://play.golang.org/compile`.
2. **Prod:** ship a tiny `server/` Express (or Fastify) app exposing `POST /api/compile` that proxies to the same endpoint. Include a `Dockerfile` and a README section on deploying the proxy.
3. Request format: `POST` with `Content-Type: application/x-www-form-urlencoded`, body `version=2&body=<urlencoded source>&withVet=true`.
4. Response shape:
   ```ts
   type PlaygroundResponse = {
     Errors: string;
     Events: Array<{ Message: string; Kind: "stdout" | "stderr"; Delay: number }>;
     Status: number;
     IsTest: boolean;
     TestsFailed: number;
     VetErrors?: string;
     VetOK?: boolean;
   };
   ```
5. Render `Errors` and `VetErrors` in red, replay `Events` honoring `Delay` (nanoseconds) so streamed output feels real. Show a "Run" button (Cmd/Ctrl+Enter) and a "Reset" button that restores the original snippet.

## Persistence
Use `localStorage` keyed under `gotour:v1`:
- `progress`: `Record<lessonSlug, "unstarted" | "in-progress" | "complete">`
- `editorDrafts`: `Record<lessonSlug, string>` so edits survive reloads
- `checkpointScores`: `Record<checkpointId, { correct: number; total: number; lastAttempt: ISOString }>`

Sidebar shows a checkmark next to completed lessons and a progress bar per section. A "Reset progress" button in the footer clears the namespace.

## Information architecture
Single-page app, three-pane layout on `lg+` screens:

```
┌──────────────┬───────────────────────────┬──────────────────┐
│  Sidebar     │  Lesson prose (markdown)  │  Monaco editor   │
│  (sections + │  + inline mini-snippets   │  + Run output    │
│   lessons)   │                           │  + Reset         │
└──────────────┴───────────────────────────┴──────────────────┘
```
On `md` collapse to two panes (prose above editor); on mobile, stack vertically.

Top bar: GoTour logo, search (filters lesson titles + content), keyboard-shortcut hint, theme toggle (light/dark, default dark).

## Lesson content (author all of these — full reference tour)

Lessons live as MDX or as typed objects in `src/content/lessons.ts`. Each lesson has: `slug`, `title`, `section`, `body` (markdown), `starterCode`, `expectedOutputHint?`, `checkpoint?`. Aim for ~150–400 words of prose per lesson plus one runnable snippet.

### Section A — Language fundamentals
1. Hello, world & program structure (`package main`, `import`, `func main`)
2. `go run` vs `go build` (brief, links to toolchain section)
3. Variables: `var`, `:=`, multiple assignment, blank identifier
4. Constants & `iota` (incl. bit-flag pattern, expression repetition rule)
5. Basic types, zero values, type conversions (no implicit conversion)
6. Strings, runes, bytes; UTF-8 iteration with `range`
7. Numeric types, overflow, untyped constants

### Section B — Control flow
8. `if` (incl. init statement)
9. `for` (the only loop: 3-clause, while-style, infinite, `range`)
10. Loop variable capture (pre-1.22 vs 1.22+ semantics)
11. `switch` (no fallthrough by default, expression-less, multi-value cases)
12. `type switch`
13. `defer` (LIFO, argument evaluation timing, common gotchas in loops)
14. `goto`, labels, labeled `break`/`continue`

### Section C — Composite types
15. Arrays (fixed length, value semantics)
16. Slices (header layout, `append` growth, three-index slicing, `copy`, aliasing pitfalls)
17. Maps (zero value is nil, comma-ok, deletion, iteration order)
18. Structs (composite literals, field tags, anonymous fields, comparability)
19. Pointers (no arithmetic, `new`, taking address of composite literal)

### Section D — Functions
20. Functions, multi-return, named returns, naked `return`
21. Variadic functions, slice-spread with `...`
22. First-class functions & closures
23. Methods, value vs pointer receivers, method sets, addressability

### Section E — Interfaces & polymorphism
24. Interfaces, implicit satisfaction, the empty interface (`any`)
25. Type assertions, comma-ok form, type switches revisited
26. Embedding (struct embedding, interface embedding, method promotion)
27. Common stdlib interfaces: `error`, `Stringer`, `io.Reader`/`Writer`

### Section F — Generics
28. Type parameters, type inference
29. Constraints, `comparable`, `~` underlying-type approximation, type sets
30. When *not* to reach for generics

### Section G — Errors, panic, recover
31. The `error` interface, sentinel errors, `errors.Is` / `errors.As`
32. Wrapping with `fmt.Errorf("...: %w", err)`
33. `panic` / `recover` and when each is appropriate

### Section H — Concurrency
34. Goroutines (cost, scheduler hand-wave, lifecycle)
35. Channels: unbuffered vs buffered, send/receive semantics
36. `close`, `range` over channels, nil channel behavior
37. `select` (incl. default case, timeouts with `time.After`)
38. `sync`: `Mutex`, `RWMutex`, `WaitGroup`, `Once`, `Cond`
39. `sync/atomic` and the memory model in one paragraph
40. `context.Context` — cancellation, deadlines, values (with anti-patterns)

### Section I — Packages & project layout
41. Packages, exported vs unexported (capitalization rule)
42. `init()` order, package-level variable initialization
43. `internal/` directories, import paths, `go.mod` `module` path
44. `//go:embed`

### Section J — Reflection & low-level
45. `reflect` basics (`TypeOf`, `ValueOf`, kind vs type)
46. `unsafe.Pointer` and `unsafe.Sizeof` (mention, don't encourage)
47. `cgo` (one-paragraph awareness page)
48. Build tags (`//go:build`) and conditional compilation

### Section K — Toolchain
49. `go run`, `go build`, output paths, `-o`
50. `go install` and `GOBIN`
51. `go mod init` / `tidy` / `get` / `why` / `graph` / `replace` / `vendor`
52. `go work` multi-module workspaces
53. `go test`: table tests, subtests with `t.Run`, `-run` regex, `t.Parallel`
54. `go test`: benchmarks, examples, fuzzing (`go test -fuzz`)
55. `go test -race`, `-cover`, `-coverprofile`, `go tool cover`
56. `go fmt` / `gofmt` / `goimports`
57. `go vet` and common analyzers
58. `go doc` and pkg.go.dev conventions
59. `go generate` directives
60. `go env`, `GOPATH`, `GOMODCACHE`, `GOPROXY`, `GOPRIVATE`, `GOFLAGS`
61. Cross compilation: `GOOS`/`GOARCH` matrix, `CGO_ENABLED=0`
62. `-ldflags` (stamping versions), `-trimpath`, build modes
63. `go tool pprof` and `go tool trace` (CPU/heap profiling cheatsheet)

## Checkpoints
After each section, insert a checkpoint lesson with 3–5 multiple-choice or fill-in-the-blank questions targeting *idiomatic Go gotchas* (not trivia). Examples:
- "What does this snippet print?" with a slice-aliasing trap
- "Which receiver type should `Scale` use?" — pointer, because it mutates
- "What happens when you send on a closed channel?" — panic

Score persists in localStorage. A passing score (≥80%) marks the section complete.

## Search
Client-side fuzzy search over `{title, section, body}` with Fuse.js. Cmd/Ctrl+K opens a command palette.

## Visual design
Dark-first, IDE-adjacent. Mono font for code (JetBrains Mono via `@fontsource`). Accent color: Go's gopher cyan `#00ADD8`. Subtle, not playful. Generous whitespace, prose width capped at ~72ch. Code panes use Monaco's `vs-dark` (dark) and `vs` (light). No emoji decoration.

## Project structure
```
.
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts            # incl. /api/compile dev proxy
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── LessonView.tsx
│   │   ├── CodeRunner.tsx        # Monaco + Run + output replay
│   │   ├── Checkpoint.tsx
│   │   ├── CommandPalette.tsx
│   │   └── ProgressBar.tsx
│   ├── content/
│   │   ├── lessons.ts            # typed lesson registry
│   │   └── lessons/              # one .ts (or .mdx) per lesson
│   ├── lib/
│   │   ├── playground.ts         # POST /api/compile, replay Events
│   │   ├── storage.ts            # localStorage helpers
│   │   └── search.ts             # Fuse.js wrapper
│   ├── store/
│   │   └── progress.ts           # zustand store
│   └── styles/
│       └── globals.css
├── server/
│   ├── package.json
│   ├── src/index.ts              # Express proxy for /api/compile
│   └── Dockerfile
└── README.md
```

## Acceptance criteria
- `pnpm install && pnpm dev` boots the app at `localhost:5173` with the dev proxy working against the live Go Playground.
- `pnpm build && pnpm preview` serves a production build.
- `cd server && pnpm install && pnpm dev` runs the prod proxy on `:8787`; document the env var `PLAYGROUND_UPSTREAM` (default `https://play.golang.org/compile`).
- Every lesson listed above exists and runs at least one snippet successfully against the Playground (`Hello, world` and beyond — concurrency lessons must produce expected interleaved output).
- Cmd/Ctrl+Enter runs the focused snippet; Cmd/Ctrl+K opens search.
- Reload preserves: current lesson, editor draft for that lesson, completion state, checkpoint scores.
- Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95 on a desktop run of the deployed `preview`.
- All keyboard shortcuts and the lesson list are documented in `README.md`.
- Zero `any` in non-test TypeScript. ESLint + Prettier configured and clean.

## Constraints
- Do not introduce a UI framework beyond Tailwind (no shadcn, no MUI). Build the few components needed by hand.
- Do not server-render. Pure SPA.
- Do not include analytics, auth, or telemetry.
- Comments in code: only where the *why* is non-obvious. No filler docstrings.
- One commit per section is fine; final state must be working end-to-end.

## Deliverables
1. The full repo as described.
2. A README with: prereqs, dev/prod commands, proxy deployment notes (incl. a one-liner for Fly.io or Render), lesson-content authoring guide, and a list of every lesson slug.
3. A short `CONTRIBUTING.md` describing how to add a new lesson (one file in `src/content/lessons/`, register in `lessons.ts`, optional checkpoint).
