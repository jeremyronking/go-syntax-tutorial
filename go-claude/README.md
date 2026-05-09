# GoTour (`go-claude`)

Interactive tour of Go's language syntax and standard toolchain — for engineers who already write code professionally and want to learn the way Go specifically spells things.

## Stack
Vite + React 18 + TypeScript + Tailwind. Monaco editor for live snippets. Zustand + localStorage for persistence. Fuse.js for client-side fuzzy search. Express proxy in `server/` for the prod path to the Go Playground.

## Prerequisites
- Node ≥ 20
- pnpm ≥ 9 (project pins via `corepack` in the Dockerfile; locally `npm i -g pnpm`)

## Commands
```bash
pnpm install                    # workspace install for root + server
pnpm dev                        # frontend on http://localhost:5173 (proxies /api/compile)
pnpm build && pnpm preview      # production build + preview
pnpm typecheck
pnpm lint

pnpm --filter go-claude-proxy dev          # production-style proxy on :8787
pnpm --filter go-claude-proxy test:smoke   # round-trip a hello-world against the upstream
```

## Code execution
Snippets compile against `https://play.golang.org/compile`. Vite's dev proxy handles the CORS rewrite locally; in production the Express service in `server/` does the same and exposes `POST /api/compile`.

Lessons that the Playground sandbox can't run (toolchain commands, `unsafe`, `cgo`, multi-package programs, `//go:embed` of external files) render in a **terminal pane** with pre-baked output. There is a "copy command" affordance on each command line.

## Keyboard shortcuts
| Key | Action |
|-----|--------|
| `⌘`/`Ctrl` + `Enter` | Run the current snippet |
| `⌘`/`Ctrl` + `K` | Open command palette / search |
| `↑` / `↓` | Navigate palette results |
| `Enter` | Open the highlighted result |
| `Esc` | Close the palette |

## Persistence
Progress lives in `localStorage` under the key `gotour:v1`:

- `progress` — per-slug status (`unstarted` / `in-progress` / `complete`)
- `editorDrafts` — your in-progress edits per lesson (debounced)
- `checkpointScores` — best score + last-attempt timestamp per checkpoint

Plus `gotour:v1:theme` and `gotour:v1:sidebar` for UI state. Use the **Reset progress** link in the footer to clear everything.

## Sections & lessons

### A. Language fundamentals
- 01. `hello-world` — Hello, world
- 02. `go-run-vs-build` — go run vs go build
- 03. `variables` — Variables, := and the blank identifier
- 04. `constants-iota` — Constants & iota
- 05. `basic-types` — Basic types & zero values
- 06. `strings-runes-bytes` — Strings, runes, bytes
- 07. `numeric-types` — Numeric types & untyped constants

### B. Control flow
- 08. `if-statement` — if and the init statement
- 09. `for-loop` — for is the only loop
- 10. `loop-variable-capture` — Loop variable capture (1.22+)
- 11. `switch` — switch — no implicit fallthrough
- 12. `type-switch` — Type switch
- 13. `defer` — defer (LIFO, eager argument capture)
- 14. `labels-goto` — Labels: labeled break/continue (and goto)

### C. Composite types
- 15. `arrays` — Arrays — fixed length, value semantics
- 16. `slices` — Slices — header, append, aliasing traps
- 17. `maps` — Maps — comma-ok and the nil-map panic
- 18. `structs` — Structs — literals, tags, embedding
- 19. `pointers` — Pointers — no arithmetic, addressable values

### D. Functions
- 20. `functions` — Functions — multi-return, named returns
- 21. `variadic` — Variadics & slice spread
- 22. `closures` — First-class functions & closures
- 23. `methods` — Methods — value vs pointer receivers

### E. Interfaces & polymorphism
- 24. `interfaces` — Interfaces — implicit satisfaction
- 25. `type-assertions` — Type assertions & comma-ok
- 26. `embedding` — Embedding — methods promote
- 27. `stdlib-interfaces` — Stdlib interfaces — error, Stringer, io.Reader/Writer

### F. Generics
- 28. `type-parameters` — Generics — type parameters & inference
- 29. `constraints` — Constraints — comparable & ~T sets
- 30. `when-not-generics` — When NOT to reach for generics

### G. Errors, panic, recover
- 31. `error-interface` — error — sentinels, errors.Is, errors.As
- 32. `error-wrapping` — Wrapping with %w
- 33. `panic-recover` — panic, recover — and when each is right

### H. Concurrency
- 34. `goroutines` — Goroutines — cheap, scheduled, leakable
- 35. `channels` — Channels — unbuffered vs buffered
- 36. `close-range` — close, range over channel, nil channel
- 37. `select` — select — wait on multiple channels
- 38. `sync-mutex` — sync — Mutex, WaitGroup, Once
- 39. `atomics` — sync/atomic & the memory model
- 40. `context` — context.Context — cancellation & deadlines

### I. Packages & project layout
- 41. `packages-visibility` — Packages & visibility
- 42. `init-order` — init() and package initialization order
- 43. `internal-modules` — Module path & internal/ visibility
- 44. `embed-files` — //go:embed — assets in the binary

### J. Reflection & low-level
- 45. `reflect-basics` — reflect — TypeOf, ValueOf, Kind
- 46. `unsafe-pointer` — unsafe — Sizeof, Offsetof, raw pointers
- 47. `cgo` — cgo — calling C from Go (and what it costs)
- 48. `build-tags` — Build tags — //go:build constraints

### K. Toolchain
- 49. `toolchain-build` — go run, go build, -o
- 50. `toolchain-install` — go install & GOBIN
- 51. `toolchain-modules` — go mod — init, tidy, get, why, graph, vendor
- 52. `toolchain-workspaces` — go work — multi-module workspaces
- 53. `toolchain-test` — go test — table tests, subtests, t.Parallel
- 54. `toolchain-bench-fuzz` — go test — benchmarks, examples, fuzz
- 55. `toolchain-race-cover` — go test -race, -cover
- 56. `toolchain-fmt` — go fmt, gofmt, goimports
- 57. `toolchain-vet` — go vet — static analysis baked in
- 58. `toolchain-doc` — go doc & pkg.go.dev conventions
- 59. `toolchain-generate` — go generate — directive-driven codegen
- 60. `toolchain-env` — go env — GOPATH, GOPROXY, GOFLAGS, GOPRIVATE
- 61. `toolchain-cross-compile` — Cross compilation — GOOS, GOARCH, CGO_ENABLED=0
- 62. `toolchain-ldflags` — -ldflags, -trimpath, build modes
- 63. `toolchain-pprof` — go tool pprof & go tool trace

Each section ends in a checkpoint quiz at `/checkpoint/<section-id>`. Passing ≥ 80% marks every lesson in the section complete. **Failing never blocks any lesson** — navigation is fully open per the design notes.

## Deploying the proxy
The Express service in `server/` is what handles `POST /api/compile` in production.

### Fly.io
```bash
cd server
fly launch --no-deploy
fly deploy
```

### Render
1. New → Web Service → Docker, root: `go-claude/server`
2. Default `CMD` is `node dist/index.js`
3. Env: `PLAYGROUND_UPSTREAM=https://play.golang.org/compile`

## Adding a lesson
See [CONTRIBUTING.md](./CONTRIBUTING.md). Short version: drop a TS file in `src/content/lessons/`, register it in `src/content/lessons.ts`, optional `gotcha`, optional checkpoint.
