# GoTour — Interactive Go Syntax & Toolchain Tutorial

An interactive, browser-based Go tutorial for experienced engineers. Learn Go by running real code against the Go Playground.

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** (Corepack or global install)
- **Go** ≥ 1.22 (optional, for local testing of toolchain lessons)

## Quick Start

```bash
pnpm install
pnpm dev
# Open http://localhost:5173
```

## Production Build

```bash
pnpm build
pnpm preview
```

## Production Proxy (Express)

The Go Playground blocks browser CORS, so a proxy is needed for production:

```bash
cd server
pnpm install
pnpm dev
# Proxy available at http://localhost:8787/api/compile
```

Set `PLAYGROUND_UPSTREAM` to override the upstream Playground URL (default: `https://play.golang.org/compile`).

### Deploy the Proxy

**Fly.io:**
```bash
cd server
fly deploy
```

**Render:**
```bash
# Create a new Web Service pointing to server/
# Build: pnpm install && pnpm build
# Start: pnpm start
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format with Prettier |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Enter` | Run code snippet |
| `Cmd/Ctrl + K` | Open search / command palette |
| `Esc` | Close search palette |

## Lesson Slugs

| # | Slug | Title | Section |
|---|------|-------|---------|
| 1 | hello-world | Hello, World | A |
| 2 | go-run-vs-go-build | go run vs go build | A |
| 3 | variables | Variables: var, :=, multiple assignment, blank identifier | A |
| 4 | constants-and-iota | Constants & iota | A |
| 5 | basic-types-zero-values | Basic types, zero values, type conversions | A |
| 6 | strings-runes-bytes | Strings, runes, bytes; UTF-8 iteration | A |
| 7 | numeric-types | Numeric types, overflow, untyped constants | A |
| 8 | if-statement | if (init statement) | B |
| 9 | for-loops | for (3-clause, while-style, infinite, range) | B |
| 10 | loop-variable-capture | Loop variable capture (pre-1.22 vs 1.22+) | B |
| 11 | switch | switch (no fallthrough, expression-less, multi-value) | B |
| 12 | type-switch | type switch | B |
| 13 | defer | defer (LIFO, arg evaluation, gotchas) | B |
| 14 | goto-labels | goto, labels, labeled break/continue | B |
| 15 | arrays | Arrays (fixed length, value semantics) | C |
| 16 | slices | Slices (header, append, three-index, copy, aliasing) | C |
| 17 | maps | Maps (nil, comma-ok, deletion, iteration order) | C |
| 18 | structs | Structs (composite literals, field tags, embedding) | C |
| 19 | pointers | Pointers (no arithmetic, new, address of composite literal) | C |
| 20 | functions-multi-return | Functions, multi-return, named returns | D |
| 21 | variadic-functions | Variadic functions, slice-spread | D |
| 22 | first-class-functions-closures | First-class functions & closures | D |
| 23 | methods-receivers | Methods, value vs pointer receivers | D |
| 24 | interfaces-implicit-satisfaction | Interfaces, implicit satisfaction, any | E |
| 25 | type-assertions | Type assertions, comma-ok, type switches | E |
| 26 | embedding | Embedding (struct, interface, method promotion) | E |
| 27 | stdlib-interfaces | Common stdlib interfaces | E |
| 28 | type-parameters | Type parameters, type inference | F |
| 29 | constraints-type-sets | Constraints, comparable, ~, type sets | F |
| 30 | when-not-generics | When not to reach for generics | F |
| 31 | error-interface | The error interface, sentinel errors, errors.Is/As | G |
| 32 | error-wrapping | Wrapping with fmt.Errorf | G |
| 33 | panic-recover | panic / recover | G |
| 34 | goroutines | Goroutines (cost, lifecycle) | H |
| 35 | channels | Channels: unbuffered vs buffered | H |
| 36 | close-range-channels | close, range over channels, nil channel behavior | H |
| 37 | select | select (default case, timeouts) | H |
| 38 | sync-package | sync: Mutex, WaitGroup, Once | H |
| 39 | sync-atomic | sync/atomic and the memory model | H |
| 40 | context | context.Context | H |
| 41 | packages-exported | Packages, exported vs unexported | I |
| 42 | init-order | init() order, package-level variable init | I |
| 43 | internal-directories | internal/ directories, import paths | I |
| 44 | go-embed | //go:embed | I |
| 45 | reflect-basics | reflect basics | J |
| 46 | unsafe-pointer | unsafe.Pointer and unsafe.Sizeof | J |
| 47 | cgo | cgo | J |
| 48 | build-tags | Build tags (//go:build) | J |
| 49 | go-run-build | go run, go build, output paths, -o | K1 |
| 50 | go-install | go install and GOBIN | K1 |
| 51 | go-mod | go mod init/tidy/get/why/replace/vendor | K1 |
| 52 | go-work | go work multi-module workspaces | K1 |
| 53 | go-env | go env, GOPATH, GOMODCACHE, GOPROXY | K1 |
| 54 | go-test-table | go test: table tests, subtests | K2 |
| 55 | go-test-bench | go test: benchmarks, examples, fuzzing | K2 |
| 56 | go-test-race-cover | go test -race, -cover | K2 |
| 57 | go-fmt | go fmt / gofmt / goimports | K2 |
| 58 | go-vet | go vet and common analyzers | K2 |
| 59 | go-doc | go doc and pkg.go.dev | K2 |
| 59 | go-generate | go generate directives | K3 |
| 60 | go-env-vars | Environment variables | K3 |
| 61 | cross-compilation | Cross compilation: GOOS/GOARCH | K3 |
| 62 | ldflags | -ldflags, -trimpath, build modes | K3 |
| 63 | pprof-trace | go tool pprof and go tool trace | K3 |

## Tech Stack

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS v4 (dark-first)
- Monaco Editor (Go language)
- Zustand (state + localStorage persistence)
- Fuse.js (client-side search)
- React Router v6
- Express (production Playground proxy)

## License

MIT