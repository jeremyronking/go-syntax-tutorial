# GoTour (go-minimax)

An interactive tour of Go's **language syntax** and **standard toolchain**, written for engineers
who already know how to program. Every lesson is a short prose note plus a snippet you can actually
run against the Go Playground.

Dark-first, IDE-adjacent, no fluff.

- **63 lessons** across **11 sections**, each section ending in a scored checkpoint.
- **43 lessons** run live in the browser against `play.golang.org`.
- **16 lessons** are terminal transcripts or annotated snippets — shell and toolchain behaviour
  that the Playground cannot show you.
- **11 checkpoints** — pass 80% to mark a section complete. Failing one never blocks you.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 20 | `node --version` |
| pnpm | ≥ 9 | `corepack enable pnpm` if you don't have it |
| Docker | optional | only needed to build the proxy image |
| Go | optional | only needed to reproduce the terminal-pane transcripts locally |

## Commands

```bash
pnpm install        # install workspace deps (app + server)

pnpm dev            # Vite dev server on http://localhost:5173
pnpm build          # typecheck + production bundle into dist/
pnpm preview        # serve the production bundle on http://localhost:4173
pnpm lint           # ESLint (no `any` outside tests)
pnpm typecheck      # tsc --noEmit
pnpm format         # Prettier, write mode

cd server && pnpm install && pnpm dev   # production proxy on :8787
```

`pnpm dev` proxies `POST /api/compile` to the real Go Playground, so the editor works out of the
box with no credentials. If you would rather not hit the public Playground, point the proxy at your
own instance:

```bash
PLAYGROUND_UPSTREAM=https://play.golang.org/compile pnpm dev
```

## Project layout

```
.
├── index.html
├── vite.config.ts            # dev server + /api/compile proxy (Phase 02)
├── tailwind.config.ts        # design tokens
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/           # Layout, Sidebar, CodeRunner, …
│   ├── content/              # manifest + lazy-loaded lessons + checkpoints
│   ├── lib/                  # playground client, search, storage helpers
│   ├── store/                # zustand stores (progress, theme, sidebar)
│   └── styles/globals.css
├── server/                   # Express proxy for POST /api/compile
├── CONTRIBUTING.md
└── README.md
```

### How the content is loaded

The tour's prose is by far the largest thing the app ships, and almost none of it is needed to
draw the chrome. So it is split in two:

- `src/content/manifest.ts` — an eager list of every lesson's slug, title, section and order.
  The sidebar, the landing page and the prev/next links read only this.
- `src/content/lessons/*.ts` — the prose itself, grouped one file per section. Each file exports a
  `lessons` record keyed by slug, and the lazy loader in `src/content/lessonLoader.ts` fetches the
  right chunk when a lesson is opened.

Checkpoints work the same way: `SECTIONS_WITH_CHECKPOINT` in `src/content/checkpoints.ts` is eager
so the sidebar can show the link, and the questions are loaded on the checkpoint route.

The result is a ~208 kB main bundle instead of ~630 kB, and a lesson page that renders its prose
without waiting for the rest of the tour.

## Deploying the proxy

The Go Playground compile endpoint does not send CORS headers, so the browser cannot call it
directly. Both the dev server and the production server proxy `POST /api/compile` to
`https://play.golang.org/compile`.

- **Dev** — Vite proxies `/api/compile` automatically (see `vite.config.ts`).
- **Prod** — run `server/`, either directly or as a container.

The upstream is overridable with the `PLAYGROUND_UPSTREAM` environment variable
(default `https://play.golang.org/compile`).

The static site is a plain Vite build: `pnpm build` emits `dist/`, which any static host can serve.
Set `<base>` in `vite.config.ts` if you deploy it under a sub-path, and configure the host to
rewrite unknown paths to `/index.html` so client-side routes resolve.

### Build the container

```bash
docker build -t go-minimax-proxy server/
docker run --rm -p 8787:8787 go-minimax-proxy
```

### Fly.io

```bash
cd server
fly launch --no-deploy
fly secrets set PLAYGROUND_UPSTREAM=https://play.golang.org/compile
fly deploy
```

### Render

1. New → Web Service → Docker
2. Root directory: `go-minimax/server` (build with the included Dockerfile)
3. Env var: `PLAYGROUND_UPSTREAM=https://play.golang.org/compile`

### Smoke test

```bash
cd server && pnpm smoke
```

Posts a hello-world program through the proxy and asserts the Playground response shape
(`Errors` / `Events` / `Status`) plus the expected stdout. `pnpm mock` starts a fake upstream on
`:9999` if you want to prove the `PLAYGROUND_UPSTREAM` override is honoured.

## Keyboard shortcuts

| Shortcut | Action | Where |
|---|---|---|
| `Cmd/Ctrl + K` | Open the command palette | Anywhere |
| `Esc` | Close the command palette | Command palette |
| `↑` / `↓` | Move through the results | Command palette |
| `Enter` | Open the highlighted lesson | Command palette |
| `Tab` / `Shift + Tab` | Cycle focus inside the palette | Command palette |
| `Cmd/Ctrl + Enter` | Run the program in the editor | Code editor |

## Storage

Everything is kept in `localStorage` under the `gotour:v1` namespace — no account, no server.

| Key | Contents |
|---|---|
| `gotour:v1` | Lesson progress, editor drafts, checkpoint scores |
| `gotour:v1:theme` | `light` / `dark` / `system` |
| `gotour:v1:sidebar` | Which sections are collapsed |

**Reset progress** in the footer clears the whole namespace and reloads the page.

## Accessibility

- Keyboard-operable throughout: the command palette is focus-trapped, the sidebar is a real list of
  links, and the editor has a `Cmd/Ctrl + Enter` shortcut for running code.
- `prefers-reduced-motion: reduce` is respected globally — CSS transitions and animations are
  disabled, and the streamed stdout replay in the concurrency lessons is skipped and replaced by the
  final output.
- The palette is a labelled `role="dialog"` with `aria-modal`, and the program output pane is a
  `role="log"` with `aria-live="polite"`.

## Lesson index

Auto-generated from `src/content/manifest.ts`. The slug is the last path segment of
`/lesson/<slug>`.

<!-- BEGIN SLUG TABLE -->

### A · Language fundamentals (7)

| # | Slug | Title |
|---|---|---|
| 1 | `hello-world` | Hello, world & program structure |
| 2 | `go-run-vs-build` | `go run` vs `go build` |
| 3 | `variables` | Variables: `var`, `:=`, and the blank identifier |
| 4 | `constants-iota` | Constants & `iota` |
| 5 | `basic-types` | Basic types, zero values & conversions |
| 6 | `strings-runes-bytes` | Strings, runes & bytes |
| 7 | `numeric-types` | Numeric types, overflow & untyped constants |

### B · Control flow (7)

| # | Slug | Title |
|---|---|---|
| 8 | `if-statements` | `if` and its init statement |
| 9 | `for-loops` | `for`: three clauses, `while`, and `range` |
| 10 | `loop-variable-capture` | Loop variable capture: pre-1.22 vs 1.22+ |
| 11 | `switch` | `switch`: no fallthrough, expression-less, multi-value |
| 12 | `type-switch` | `switch` on types: the type switch |
| 13 | `defer` | `defer`: LIFO order and argument evaluation timing |
| 14 | `goto-and-labels` | `goto`, labels, and labeled `break`/`continue` |

### C · Composite types (5)

| # | Slug | Title |
|---|---|---|
| 15 | `arrays` | Arrays: fixed length, value semantics |
| 16 | `slices` | Slices: header, `append`, slicing & aliasing |
| 17 | `maps` | Maps: nil, comma-ok, deletion & random iteration |
| 18 | `structs` | Structs: literals, tags, embedding & comparability |
| 19 | `pointers` | Pointers: no arithmetic, `new`, and addressability |

### D · Functions (4)

| # | Slug | Title |
|---|---|---|
| 20 | `functions` | Functions, multiple returns & named results |
| 21 | `variadic-functions` | Variadic functions & slice spreading |
| 22 | `closures` | First-class functions & closures |
| 23 | `methods` | Methods, receivers & method sets |

### E · Interfaces & polymorphism (4)

| # | Slug | Title |
|---|---|---|
| 24 | `interfaces` | Interfaces & implicit satisfaction |
| 25 | `type-assertions` | Type assertions & the comma-ok form |
| 26 | `embedding` | Embedding & method promotion |
| 27 | `stdlib-interfaces` | Standard library interfaces: `error`, `Stringer`, `io` |

### F · Generics (3)

| # | Slug | Title |
|---|---|---|
| 28 | `generics` | Type parameters & inference |
| 29 | `constraints` | Constraints, `comparable` & type sets |
| 30 | `when-not-generics` | When *not* to reach for generics |

### G · Errors, panic, recover (3)

| # | Slug | Title |
|---|---|---|
| 31 | `error-interface` | The `error` interface, sentinels & `errors.Is`/`As` |
| 32 | `error-wrapping` | Wrapping errors with `%w` |
| 33 | `panic-recover` | `panic` & `recover` — and why panic is not exception handling |

### H · Concurrency (7)

| # | Slug | Title |
|---|---|---|
| 34 | `goroutines` | Goroutines: cost & lifecycle |
| 35 | `channel-basics` | Channels: unbuffered vs buffered |
| 36 | `channel-close` | `close`, `range` over channels & nil channels |
| 37 | `select` | `select`: multiplexing, `default` & timeouts |
| 38 | `sync-primitives` | `sync`: Mutex, RWMutex, WaitGroup, Once, Cond |
| 39 | `atomics` | `sync/atomic` & the memory model in one paragraph |
| 40 | `context` | `context.Context`: cancellation, deadlines, values |

### I · Packages & project layout (4)

| # | Slug | Title |
|---|---|---|
| 41 | `packages` | Packages: exported vs unexported |
| 42 | `init-order` | `init()` order & package-level variable initialisation |
| 43 | `internal-and-module` | `internal/` directories, import paths & `go.mod` |
| 44 | `go-embed` | `//go:embed` — shipping files inside the binary |

### J · Reflection & low-level (4)

| # | Slug | Title |
|---|---|---|
| 45 | `reflection` | `reflect`: `TypeOf`, `ValueOf`, kind vs type |
| 46 | `unsafe` | `unsafe.Pointer` and `unsafe.Sizeof` |
| 47 | `cgo` | `cgo`: calling C from Go |
| 48 | `build-tags` | Build constraints: `//go:build` |

### K · Toolchain (15)

| # | Slug | Title |
|---|---|---|
| 49 | `build-and-run` | `go build`, `go run` & output paths |
| 50 | `go-install` | `go install` & `GOBIN` |
| 51 | `module-management` | `go.mod`, `go mod tidy` and the module commands |
| 52 | `go-work` | `go work` — multi-module workspaces |
| 53 | `go-test-basics` | `go test`: table tests, subtests, `-run` and `t.Parallel` |
| 54 | `go-test-failures` | Reading a `--- FAIL` and the other test outcomes |
| 55 | `benchmarks-and-fuzzing` | `go test`: benchmarks, examples and fuzzing |
| 56 | `race-and-coverage` | `go test -race` and coverage |
| 57 | `formatting` | `go fmt`, `gofmt` and `goimports` |
| 58 | `vet-and-doc` | `go vet` and `go doc` |
| 59 | `go-generate` | `go generate` directives |
| 60 | `go-env` | `go env`, `GOPATH`, `GOMODCACHE` and `GOPROXY` |
| 61 | `cross-compilation` | Cross compilation: `GOOS`, `GOARCH` and `CGO_ENABLED` |
| 62 | `ldflags-and-trimpath` | `-ldflags`, `-trimpath` and build modes |
| 63 | `profiling` | `go tool pprof` and `go tool trace` |

<!-- END SLUG TABLE -->

## Checkpoints

| Section | Route | Questions |
|---|---|---|
| A · Language fundamentals | `/checkpoint/fundamentals` | 5 |
| B · Control flow | `/checkpoint/control-flow` | 5 |
| C · Composite types | `/checkpoint/composite-types` | 5 |
| D · Functions | `/checkpoint/functions` | 5 |
| E · Interfaces & polymorphism | `/checkpoint/interfaces` | 5 |
| F · Generics | `/checkpoint/generics` | 5 |
| G · Errors, panic, recover | `/checkpoint/errors` | 5 |
| H · Concurrency | `/checkpoint/concurrency` | 5 |
| I · Packages & project layout | `/checkpoint/packages` | 4 |
| J · Reflection & low-level | `/checkpoint/low-level` | 4 |
| K · Toolchain | `/checkpoint/toolchain` | 5 |

## License

MIT
