# GoTour

An interactive Go syntax and toolchain tutorial for experienced engineers. 63 runnable lessons, 11 checkpoints, live execution through the public Go Playground, and pre-baked terminal output for the commands a sandbox cannot run.

Stack: Vite, React 18, TypeScript, Tailwind, Monaco, zustand. The production proxy is a small Express app in `server/`.

## Prerequisites

- Node 20 or newer
- pnpm 9 or newer

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Vite dev server at http://localhost:5173 with the Playground proxy |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript with no emit |
| `pnpm format` | Prettier |
| `cd server && pnpm dev` | Production proxy on port 8787 |

## Development

```bash
pnpm install
pnpm dev
```

`vite.config.ts` proxies `/api/compile` to `https://play.golang.org/compile`, so the browser never talks to the Playground directly. Set `PLAYGROUND_UPSTREAM` to point the dev proxy at a different endpoint.

## Production

```bash
pnpm build
pnpm preview
```

The preview serves the static build but does not proxy the Playground. For a production deployment, run the Express app and serve `dist/` from it:

```bash
pnpm build
cd server && pnpm install && STATIC_DIR=../dist pnpm start
```

## Deploying the proxy

The proxy is the only part that needs a server. It accepts `POST /api/compile`, forwards the form body upstream, and returns the Playground JSON unchanged. `PLAYGROUND_UPSTREAM` defaults to `https://play.golang.org/compile`.

The top-level Dockerfile builds the frontend and proxy into one image:

```bash
docker build -t go-deepseek .
docker run -p 8787:8787 -e PLAYGROUND_UPSTREAM=https://play.golang.org/compile go-deepseek
```

Proxy only, with the frontend mounted from the host:

```bash
docker build -t gotour-proxy server/
docker run -p 8787:8787 \
  -e PLAYGROUND_UPSTREAM=https://play.golang.org/compile \
  -e STATIC_DIR=/app/public \
  -v "$PWD/dist:/app/public:ro" \
  gotour-proxy
```

Fly.io:

```bash
fly launch --dockerfile server/Dockerfile
fly deploy
```

Render: create a Web Service from the repository, set the root directory to `server/`, choose the Docker environment, and set `PLAYGROUND_UPSTREAM` if you need a non-default endpoint.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Cmd/Ctrl + Enter` | Run the current snippet |
| `Cmd/Ctrl + K` | Open lesson search |
| `Escape` | Close search |
| `ArrowUp` / `ArrowDown` | Move through search results |
| `Enter` | Open the selected search result |
| `Tab` / `Shift + Tab` | Move focus, including inside the search dialog |

## How the app works

Lessons declare one of three run modes:

- `playground` renders Monaco and runs the snippet through `/api/compile`. Compiler and vet errors are shown verbatim in red. Lessons with `streamReplay: true` replay `Events` using each event's nanosecond `Delay`, and a running replay can be skipped. `prefers-reduced-motion: reduce` turns replay off.
- `terminal` renders captured command output with a copy button on each command. Nothing executes.
- `annotated` renders a read-only highlighted snippet with no controls.

Checkpoints are lessons with a `checkpoint` field. A score of 80% or higher marks every lesson in that section complete. Lower scores do not block navigation. The best score is stored, so retakes cannot lower it.

Progress, editor drafts, checkpoint scores, the theme, and sidebar collapse state live in `localStorage` under `gotour:v1`, `gotour:v1:theme`, and `gotour:v1:sidebar`. The sidebar's reset button clears progress, drafts, and scores.

## Project layout

```
src/
  components/   Layout, sidebar, lesson view, runner, terminal, palette, checkpoints
  content/      Section metadata, typed lesson registry, one module per section
  lib/          Playground client, Fuse search, read-only Go highlighter
  pages/        Landing and lesson routes
  store/        zustand stores for progress, theme, UI, sidebar
server/         Express proxy, smoke test, Dockerfile
```

To add a lesson, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Lessons

| # | Slug | Title |
| --- | --- | --- |
| 1 | `hello-world` | Hello, world & program structure |
| 2 | `go-run-vs-build` | go run vs go build |
| 3 | `variables` | Variables, :=, and the blank identifier |
| 4 | `constants-iota` | Constants and iota |
| 5 | `basic-types` | Basic types, zero values, conversions |
| 6 | `strings-runes-bytes` | Strings, runes, bytes, UTF-8 |
| 7 | `numeric-types` | Numeric types, overflow, untyped constants |
| checkpoint | `section-a-checkpoint` | Section A checkpoint |
| 8 | `if-statements` | if, with an init statement |
| 9 | `for-loops` | for — the only loop |
| 10 | `loop-variable-capture` | Loop variable capture (Go 1.22+) |
| 11 | `switch` | switch: implicit break, expressionless, multi-value |
| 12 | `type-switch` | type switch |
| 13 | `defer` | defer: LIFO, argument timing, loops |
| 14 | `goto-labels` | goto, labels, labeled break/continue |
| checkpoint | `section-b-checkpoint` | Section B checkpoint |
| 15 | `arrays` | Arrays: fixed length, value semantics |
| 16 | `slices` | Slices: header, append, aliasing |
| 17 | `maps` | Maps: nil, comma-ok, deletion, order |
| 18 | `structs` | Structs: literals, tags, embedding |
| 19 | `pointers` | Pointers: no arithmetic, new, address-of |
| checkpoint | `section-c-checkpoint` | Section C checkpoint |
| 20 | `functions` | Functions, multiple returns, named results |
| 21 | `variadic-functions` | Variadic functions and slice spread |
| 22 | `closures` | First-class functions and closures |
| 23 | `methods-receivers` | Methods: value vs pointer receivers |
| checkpoint | `section-d-checkpoint` | Section D checkpoint |
| 24 | `interfaces` | Interfaces and implicit satisfaction |
| 25 | `type-assertions` | Type assertions and comma-ok |
| 26 | `embedding` | Embedding: struct and interface |
| 27 | `stdlib-interfaces` | error, Stringer, io.Reader/Writer |
| checkpoint | `section-e-checkpoint` | Section E checkpoint |
| 28 | `type-parameters` | Type parameters and inference |
| 29 | `constraints` | Constraints, comparable, ~ and type sets |
| 30 | `when-not-generics` | When not to reach for generics |
| checkpoint | `section-f-checkpoint` | Section F checkpoint |
| 31 | `error-interface` | The error interface, sentinels, errors.Is/As |
| 32 | `error-wrapping` | Wrapping with %w |
| 33 | `panic-recover` | panic and recover |
| checkpoint | `section-g-checkpoint` | Section G checkpoint |
| 34 | `goroutines` | Goroutines: cost, lifecycle, leaks |
| 35 | `channels` | Channels: unbuffered vs buffered |
| 36 | `channel-close-range` | close, range, and nil channels |
| 37 | `select` | select: readiness, default, timeouts |
| 38 | `sync-package` | sync: Mutex, RWMutex, WaitGroup, Once, Cond |
| 39 | `atomic-memory-model` | sync/atomic and the memory model |
| 40 | `context` | context.Context: cancellation, deadlines, values |
| checkpoint | `section-h-checkpoint` | Section H checkpoint |
| 41 | `packages` | Packages: exported vs unexported |
| 42 | `init-order` | init() order and package-level initialization |
| 43 | `internal-layout` | internal/, import paths, module paths |
| 44 | `go-embed` | //go:embed |
| checkpoint | `section-i-checkpoint` | Section I checkpoint |
| 45 | `reflect-basics` | reflect: TypeOf, ValueOf, kind vs type |
| 46 | `unsafe-pointer` | unsafe.Pointer and unsafe.Sizeof |
| 47 | `cgo` | cgo: calling C from Go |
| 48 | `build-tags` | Build tags and conditional compilation |
| checkpoint | `section-j-checkpoint` | Section J checkpoint |
| 49 | `go-run-build` | go run, go build, output paths |
| 50 | `go-install` | go install and GOBIN |
| 51 | `go-modules` | go mod: init, tidy, get, why, graph, replace, vendor |
| 52 | `go-work` | go work: multi-module workspaces |
| 53 | `go-test-basics` | go test: tables, subtests, -run, t.Parallel |
| 54 | `go-test-bench-fuzz` | Benchmarks, examples, fuzzing |
| 55 | `go-test-race-coverage` | go test -race, coverage, go tool cover |
| 56 | `gofmt-goimports` | gofmt and goimports |
| 57 | `go-vet` | go vet and common analyzers |
| 58 | `go-doc` | go doc and pkg.go.dev conventions |
| 59 | `go-generate` | go generate directives |
| 60 | `go-env` | go env, GOPATH, GOMODCACHE, GOPROXY, GOFLAGS |
| 61 | `cross-compilation` | Cross compilation: GOOS/GOARCH, CGO_ENABLED=0 |
| 62 | `ldflags-trimpath` | -ldflags, version stamping, -trimpath |
| 63 | `profiling-pprof-trace` | go tool pprof and go tool trace |
| checkpoint | `section-k-checkpoint` | Section K checkpoint |
