import type { Lesson } from '../types';

// K11. go generate
export const toolchainGenerate: Lesson = {
  slug: 'toolchain-generate',
  title: '`go generate` directives',
  section: 'K',
  order: 59,
  runMode: 'terminal',
  body: `\`go generate\` runs commands embedded in source files as \`//go:generate\`
directives, sorted by filename then line. The commands are not part of \`go
build\`; you run them when source files change. Common generators: stringer
(enum methods), easyjson (fast codecs), mockgen, protoc.

Run with \`go generate ./...\` (or \`go generate path/to/file.go\`). Generators
should be reproducible — running twice should yield the same result.`,
  terminalOutput: [
    { kind: 'command', text: 'grep -rn "//go:generate" .' },
    { kind: 'stdout', text: './pkg/poke/poke.go://go:generate stringer -type=Pokemon' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go install golang.org/x/tools/cmd/stringer@latest' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go generate ./...' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'ls pkg/poke/' },
    { kind: 'stdout', text: 'poke.go   pokemon_string.go' },
  ],
};

// K12. go env, GOPATH, GOMODCACHE, GOPROXY, GOPRIVATE, GOFLAGS
export const toolchainEnv: Lesson = {
  slug: 'toolchain-env',
  title: '`go env`, `GOPATH`, `GOMODCACHE`, `GOPROXY`, `GOPRIVATE`, `GOFLAGS`',
  section: 'K',
  order: 60,
  runMode: 'terminal',
  body: `\`go env KEY\` prints a single variable; \`go env\` alone dumps all of
them. The most relevant:

- \`GOPATH\` — workspace root. Defaults to \`$HOME/go\`. Modules live here in
  \`pkg/mod/\` regardless of where your project is.
- \`GOMODCACHE\` — usually \`$GOPATH/pkg/mod\`. \`go clean -modcache\` wipes it.
- \`GOPROXY\` — comma-separated list of module proxies; \`direct\` skips them
  all.
- \`GOPRIVATE\` — comma-separated list of module paths whose proxies and
  checksum databases should be skipped. Required for private modules.
- \`GOFLAGS\` — flags passed to every \`go\` invocation (\`-mod=mod\`, etc.).`,
  terminalOutput: [
    { kind: 'command', text: 'go env GOPATH GOMODCACHE GOPROXY' },
    { kind: 'stdout', text: '/home/me/go' },
    { kind: 'stdout', text: '/home/me/go/pkg/mod' },
    { kind: 'stdout', text: 'https://proxy.golang.org,direct' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: '# Tell Go to skip proxies for an internal module path' },
    { kind: 'command', text: 'export GOPRIVATE=git.internal.example.com' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'export GOPROXY=https://proxy.golang.org,direct' },
    { kind: 'stdout', text: '' },
  ],
};

// K13. Cross compilation
export const toolchainCrossCompile: Lesson = {
  slug: 'toolchain-cross-compile',
  title: 'Cross compilation: `GOOS`/`GOARCH` matrix, `CGO_ENABLED=0`',
  section: 'K',
  order: 61,
  runMode: 'terminal',
  body: `\`GOOS\` and \`GOARCH\` select the target. \`go env GOOS GOARCH\` shows the
host's defaults. \`go tool dist list\` enumerates every supported combination.

Cross compilation is easiest with pure Go: \`GOOS=linux GOARCH=amd64 go build
-o dist/app .\`. If your code uses cgo, you also need a C cross-toolchain —
or set \`CGO_ENABLED=0\` to disable cgo for the build.`,
  terminalOutput: [
    { kind: 'command', text: 'go tool dist list | head -8' },
    { kind: 'stdout', text: 'aix/ppc64' },
    { kind: 'stdout', text: 'android/amd64' },
    { kind: 'stdout', text: 'android/arm' },
    { kind: 'stdout', text: 'android/arm64' },
    { kind: 'stdout', text: 'darwin/amd64' },
    { kind: 'stdout', text: 'darwin/arm64' },
    { kind: 'stdout', text: 'dragonfly/amd64' },
    { kind: 'stdout', text: 'freebsd/386' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'mkdir -p dist && GOOS=linux  GOARCH=amd64 CGO_ENABLED=0 go build -o dist/app-linux-amd64  ./cmd/app' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build -o dist/app-darwin-arm64 ./cmd/app' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -o dist/app-windows-amd64.exe ./cmd/app' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'ls -1 dist' },
    { kind: 'stdout', text: 'app-darwin-arm64' },
    { kind: 'stdout', text: 'app-linux-amd64' },
    { kind: 'stdout', text: 'app-windows-amd64.exe' },
  ],
};

// K14. ldflags / trimpath / build modes
export const toolchainLdflags: Lesson = {
  slug: 'toolchain-ldflags',
  title: '`-ldflags` (stamping versions), `-trimpath`, build modes',
  section: 'K',
  order: 62,
  runMode: 'terminal',
  body: `\`-ldflags "-s -w"\` strips debug info to shrink the binary. \`-X
'pkg.Var=value'\` overwrites a string variable at link time — the standard
trick to stamp a version into your binary at build time.

\`-trimpath\` removes absolute paths from the binary (and from stack traces),
which makes the artifact reproducible regardless of where it was built.`,
  terminalOutput: [
    { kind: 'command', text: 'cat cmd/app/main.go | head' },
    { kind: 'stdout', text: 'package main' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'var version = "dev"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func main() { println("gotour", version) }' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go build -trimpath -ldflags -X main.version=1.4.2 -o dist/app ./cmd/app' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: './dist/app' },
    { kind: 'stdout', text: 'gotour 1.4.2' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'ls -lh dist/app' },
    { kind: 'stdout', text: '-rwxr-xr-x 1 me me 1.6M  dist/app' },
  ],
};

// K15. pprof + trace
export const toolchainPprof: Lesson = {
  slug: 'toolchain-pprof',
  title: '`go tool pprof` and `go tool trace`',
  section: 'K',
  order: 63,
  runMode: 'terminal',
  body: `The runtime serves CPU, heap, and goroutine profiles over HTTP when
\`import _ "net/http/pprof"\` is loaded and a debug port is exposed. Save a
profile with \`curl -o cpu.pprof localhost:6060/debug/pprof/profile?seconds=30\`,
then \`go tool pprof cpu.pprof\` to inspect it. \`top\`, \`list\`, and \`web\`
are the most useful commands.

\`go tool trace\` consumes execution traces — useful for visualizing scheduler
events, goroutine state changes, and GC pauses. Sample collection with
\`runtime/trace\` or \`net/http/pprof/debug/pprof/trace?seconds=5\`.`,
  terminalOutput: [
    { kind: 'command', text: '# CPU profile for 10s, then top 5 hotspots' },
    { kind: 'command', text: 'curl -sS -o cpu.pprof http://localhost:6060/debug/pprof/profile?seconds=10' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go tool pprof -top -nodecount=5 cpu.pprof' },
    { kind: 'stdout', text: 'File: app' },
    { kind: 'stdout', text: 'Type: cpu' },
    { kind: 'stdout', text: 'Time: Jun 3, 2025 at 10:00am (UTC)' },
    { kind: 'stdout', text: 'Duration: 10s, Total samples = 80ms' },
    { kind: 'stdout', text: 'Showing nodes accounting for 60ms, 75% of 80ms total' },
    { kind: 'stdout', text: '      flat  flat%   sum%        cum   cum%' },
    { kind: 'stdout', text: '         20ms 25.00% 25.00%      30ms 37.50%  runtime.scanobject' },
    { kind: 'stdout', text: '         15ms 18.75% 43.75%      25ms 31.25%  mypkg.heavyWork' },
    { kind: 'stdout', text: '         10ms 12.50% 56.25%      10ms 12.50%  runtime.mallocgc' },
    { kind: 'stdout', text: '         10ms 12.50% 68.75%      10ms 12.50%  mypkg.unmarshal' },
    { kind: 'stdout', text: '          5ms  6.25% 75.00%       5ms  6.25%  bufio.Reader.Read' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: '# Trace capture and browser viewer' },
    { kind: 'command', text: 'curl -sS -o trace.out http://localhost:6060/debug/pprof/trace?seconds=5' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go tool trace trace.out   # opens a browser with timeline views' },
  ],
};
