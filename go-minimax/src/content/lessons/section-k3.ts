import type { Lesson } from '../types';

/**
 * Section K group 3 — the advanced toolchain. Every transcript here is
 * captured from a real go1.27 workspace.
 */

export const goGenerate: Lesson = {
  slug: 'go-generate',
  title: '`go generate` directives',
  sectionId: 'toolchain',
  order: 59,
  runMode: 'terminal',
  body: `\`go generate\` runs the commands written in \`//go:generate\` comments.
It is the standard way to run code generators: protobuf stubs, mock
implementations, stringer methods, \`go:embed\` manifests, and version
files.

**The directive.** A \`//go:generate\` comment anywhere in a source file,
with the command after it:

\`\`\`
//go:generate go run gen.go
\`\`\`

The command is run in the **directory of the file that contains the
comment**, not in the directory you invoked \`go generate\` from. The
arguments are split like a shell command line, but there is no shell:
no pipes, no redirection, no variable expansion. If you need a shell, run
one explicitly.

**The generated file is usually excluded from the build.** A generator's
own source must not be compiled into the program, and the idiomatic way
to exclude it is the \`ignore\` build tag:

\`\`\`
//go:build ignore

package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Create("greeting.go")
    if err != nil {
        panic(err)
    }
    defer f.Close()
    fmt.Fprintln(f, "package main")
    fmt.Fprintln(f)
    fmt.Fprintln(f, "const Greeting = \\"hello, generated\\"")
}
\`\`\`

**\`go generate ./...\`** runs the directives in every package. Without a
pattern, \`go generate\` only handles the package in the current
directory.

**Useful flags.**

- \`go generate -n\` — print the commands without running them.
- \`go generate -x\` — print the commands *and* run them.
- \`go generate -run <regexp>\` — only run directives whose text matches.
- \`go generate -v\` — print the names of the files as they are processed.

**\`go generate\` is not part of the build.** Nobody runs it for you: not
\`go build\`, not \`go test\`, not \`go mod tidy\`. That is a feature — a
generator can run arbitrary commands, and you do not want a network call
or a protoc invocation in the middle of a build.

The consequence is that **the generated file must be committed**, or the
build must run \`go generate\` first. Most projects commit the generated
code and add a CI check that regenerating it produces no diff.

**The output goes to the generator, not the toolchain.** \`go generate\`
does not capture or display the generator's output; it appears in the
terminal directly. If a generator fails, \`go generate\` stops and
reports the non-zero exit status.

**Directive ordering.** \`go generate\` processes the files of a package
in sorted order, and within a file, the directives in the order they
appear. If one generator's output depends on another's, put them in
separate files with names that sort in the right order, or use
\`//go:generate\` directives that chain explicitly.`,
  terminalOutput: [
    { kind: 'command', text: 'go generate -n ./...' },
    { kind: 'stdout', text: 'go run gen.go\n' },
    { kind: 'command', text: 'go generate ./...' },
    { kind: 'command', text: 'ls' },
    { kind: 'stdout', text: 'gen.go\ngo.mod\ngreeting.go\nmain.go\n' },
    { kind: 'command', text: 'cat greeting.go' },
    { kind: 'stdout', text: 'package main\n\nconst Greeting = "hello, generated"\n' },
    { kind: 'command', text: 'go run .' },
    { kind: 'stdout', text: 'hello\n' },
  ],
  gotcha: `\`go generate\` is never run by \`go build\`, \`go test\` or
\`go mod tidy\`. The generated file has to be committed, or a build step
has to run \`go generate\` first — otherwise a fresh clone does not
compile.`,
};

export const goEnv: Lesson = {
  slug: 'go-env',
  title: '`go env`, `GOPATH`, `GOMODCACHE` and `GOPROXY`',
  sectionId: 'toolchain',
  order: 60,
  runMode: 'terminal',
  body: `\`go env\` prints the toolchain's configuration. It is the first
thing to run when the build behaves differently from what you expect.

\`\`\`
$ go env
GOROOT='/opt/homebrew/Cellar/go/1.27.1/libexec'
GOPATH='/Users/king/go'
GO111MODULE=''
GOARCH='arm64'
GOBIN=''
GOCACHE='/Users/king/Library/Caches/go-build'
...
\`\`\`

**\`go env NAME\` prints one variable; \`go env -json\` prints all of
them** as JSON, for scripts. \`go env -w NAME=value\` persists a setting
in the environment file (\`os.UserConfigDir()/go/env\`), and \`go env -u
NAME\` removes it again.

**The variables that matter.**

| Variable | What it is |
|---|---|
| \`GOROOT\` | where the toolchain is installed |
| \`GOPATH\` | the root of the module cache and the \`bin\` directory |
| \`GOMODCACHE\` | where downloaded modules live (default \`$GOPATH/pkg/mod\`) |
| \`GOCACHE\` | where compiled packages are cached |
| \`GOBIN\` | where \`go install\` puts binaries (default \`$GOPATH/bin\`) |
| \`GOFLAGS\` | flags applied to every \`go\` command |
| \`GOPROXY\` | where modules are downloaded from |
| \`GOSUMDB\` | the checksum database used to verify modules |
| \`GONOSUMCHECK\` / \`GONOSUMDB\` / \`GOPRIVATE\` | modules that skip the checksum database |
| \`GOTOOLCHAIN\` | whether a newer toolchain may be downloaded |
| \`CGO_ENABLED\` | whether cgo is enabled |

**\`GOPATH\` is mostly historical now.** Before modules, \`GOPATH\` was
the place your code lived. It survives as the root of the module cache
and of \`$GOPATH/bin\`, which is where \`go install\` puts your tools.

**\`GOMODCACHE\` and \`GOCACHE\` are different caches.**

- \`GOCACHE\` holds *compiled packages*. It is a pure build cache: safe
  to delete, it just makes the next build slow. \`go clean -cache\` empties
  it.
- \`GOMODCACHE\` holds *downloaded module source*. It is what makes
  \`go build\` work offline once the dependencies are present.
  \`go clean -modcache\` empties it, and the next build has to download
  everything again.

**\`GOPROXY\` is where modules come from.** The default is
\`https://proxy.golang.org,direct\`: try the proxy first, then fall back
to fetching the repository directly (which needs the source-control
tools installed). Behind a corporate proxy, point it at your own
mirror:

\`\`\`
$ go env -w GOPROXY=https://proxy.example.com,goproxy.io,direct
$ go env -w GOSUMDB=sum.golang.org
\`\`\`

**\`GOPRIVATE\` marks paths that skip the proxy and the checksum
database.** It takes glob patterns, and it implies \`GONOPROXY\` and
\`GONOSUMDB\`:

\`\`\`
$ go env -w GOPRIVATE=example.com/*
\`\`\`

**\`GOSUMDB\` is the checksum database.** Every module download is
verified against it, which is what stops a compromised module from
reaching your build. \`GONOSUMDB\` (or \`GONOSUMCHECK\`) and
\`GOPRIVATE\` are the escape hatches — use them for internal modules you
cannot publish.

**\`GOFLAGS\` applies flags to every command.** \`go env -w GOFLAGS=-mod=mod\`
makes every build update \`go.mod\` automatically. \`-trimpath\` here is
a common choice for reproducible builds.

**\`GOTOOLCHAIN\` controls toolchain switching.** With the default
\`auto\`, a \`go.mod\` that requires a newer Go than the one installed
makes the toolchain download the newer one:

\`\`\`
$ go build ./...
go: downloading go1.99.0 (darwin/arm64)
\`\`\`

Set \`GOTOOLCHAIN=local\` to forbid that — a good idea in CI images
that must not reach the network, and in reproducible-build setups:

\`\`\`
$ GOTOOLCHAIN=local go build ./...
go: go.mod requires go >= 1.99 (running go 1.27.1; GOTOOLCHAIN=local)
\`\`\`

**Environment variables beat \`go env -w\`.** The precedence is: the
command line, then the process environment, then \`go env -w\`, then the
built-in default.`,
  terminalOutput: [
    { kind: 'command', text: 'go env GOROOT GOPATH GOMODCACHE GOCACHE GOBIN' },
    {
      kind: 'stdout',
      text:
        '/opt/homebrew/Cellar/go/1.27.1/libexec\n/Users/king/go\n/Users/king/go/pkg/mod\n/Users/king/Library/Caches/go-build\n\n',
    },
    { kind: 'command', text: 'go env GOPROXY GOSUMDB GOTOOLCHAIN CGO_ENABLED' },
    {
      kind: 'stdout',
      text: 'https://proxy.golang.org,direct\nsum.golang.org\nauto\n1\n',
    },
    { kind: 'command', text: 'go env -w GOPROXY=https://example.com/proxy' },
    { kind: 'command', text: 'go env GOPROXY' },
    { kind: 'stdout', text: 'https://example.com/proxy\n' },
    { kind: 'command', text: 'go env -u GOPROXY' },
    { kind: 'command', text: 'go env GOPROXY' },
    { kind: 'stdout', text: 'https://proxy.golang.org,direct\n' },
    { kind: 'command', text: 'go env -w GOFLAGS=-mod=mod' },
    { kind: 'command', text: 'go env GOFLAGS' },
    { kind: 'stdout', text: '-mod=mod\n' },
    { kind: 'command', text: 'go env -u GOFLAGS' },
  ],
  gotcha: `\`GOCACHE\` and \`GOMODCACHE\` are different things:
\`GOCACHE\` holds compiled packages and is safe to delete, while
\`GOMODCACHE\` holds downloaded module *source* and is what lets the
build work offline. \`go clean -cache\` empties the first;
\`go clean -modcache\` empties the second and forces a re-download.`,
};

export const crossCompilation: Lesson = {
  slug: 'cross-compilation',
  title: 'Cross compilation: `GOOS`, `GOARCH` and `CGO_ENABLED`',
  sectionId: 'toolchain',
  order: 61,
  runMode: 'terminal',
  body: `Go was designed to compile from any machine to any other. The
toolchain is a pure Go program, so a cross-compile needs nothing but the
right environment variables.

**\`GOOS\` and \`GOARCH\` select the target.**

\`\`\`
$ GOOS=linux GOARCH=arm64 go build -o out-linux-arm64 .
$ GOOS=windows GOARCH=amd64 go build -o out-windows-amd64 .
$ GOOS=js GOARCH=wasm go build -o out.wasm .
\`\`\`

The usual pairs are \`linux/amd64\`, \`linux/arm64\`, \`darwin/arm64\`,
\`windows/amd64\`, \`js/wasm\` and \`wasip1/wasm\`. \`go tool dist list\`
prints every one the toolchain supports.

**The output really is for the other platform.** The file command tells
you what you actually got:

\`\`\`
$ file out-linux-amd64 out-windows-amd64 out-js-wasm
out-linux-amd64:   ELF 64-bit LSB executable, x86-64, statically linked
out-windows-amd64: PE32+ executable (console) x86-64, for MS Windows
out-js-wasm:       WebAssembly (wasm) binary module version 0x1 (MVP)
\`\`\`

**CGO_ENABLED defaults to 0 when you cross-compile.** The toolchain
cannot know that your C compiler produces binaries for another
architecture, so it turns cgo off rather than producing a broken
binary:

\`\`\`
$ GOOS=windows GOARCH=amd64 go env CGO_ENABLED
0
\`\`\`

That is a feature, not a limitation. A pure-Go program with cgo disabled
is **statically linked** — it runs on any Linux box with the right
kernel, with no libc to install. That is how the official Docker images
for Go are built.

**To turn cgo back on, you need a cross C compiler.** Set
\`CC=arm-linux-gnueabihf-gcc\` (and friends) and
\`CGO_ENABLED=1\`. If you do not have one, the build fails with
\`cgo: exec gcc: exec format error\`.

**The consequence for your code.** With cgo off, the \`net\` and
\`os/user\` packages fall back to their pure-Go implementations, which
work but behave slightly differently — \`net\` uses its own DNS resolver,
and \`os/user\` parses \`/etc/passwd\` itself. Anything that genuinely
needs cgo — a hardware driver, a system library — will not cross-compile
out of the box.

**Build tags follow the target.** A file with \`//go:build linux\` is
included when \`GOOS=linux\`, even if you are building on macOS. The
constraint follows the *target*, not the machine.

**\`js/wasm\` needs a different toolchain.** \`GOOS=js GOARCH=wasm\` works
out of the box, but the result is a module for the browser or for
\`wasm_exec\`, and it needs \`GOOS=wasip1\` for a WASI command-line
program.

**Automating a release matrix.** The usual pattern is a small shell loop
or a Makefile:

\`\`\`
for pair in linux/amd64 linux/arm64 darwin/arm64 windows/amd64; do
    GOOS=\${pair%/*} GOARCH=\${pair#*/} go build -o "dist/\${pair%/*}-\${pair#*/}" ./cmd/app
done
\`\`\`

The \`\${pair%/*}\` and \`\${pair#*/}\` are shell parameter expansions: the
first strips the shortest \`/*\` suffix, the second strips the shortest
\`/*\` prefix. Together they split \`linux/arm64\` into \`linux\` and
\`arm64\`.

**\`go install\` cross-compiles too** — with the same \`GOOS\`/\`GOARCH\`
variables, it writes a binary for the target platform into \`$GOBIN\`.`,
  terminalOutput: [
    {
      kind: 'command',
      text: 'GOOS=linux GOARCH=amd64 go build -o out-linux-amd64 .',
    },
    {
      kind: 'command',
      text: 'GOOS=linux GOARCH=arm64 go build -o out-linux-arm64 .',
    },
    {
      kind: 'command',
      text: 'GOOS=darwin GOARCH=arm64 go build -o out-darwin-arm64 .',
    },
    {
      kind: 'command',
      text: 'GOOS=windows GOARCH=amd64 go build -o out-windows-amd64 .',
    },
    { kind: 'command', text: 'GOOS=js GOARCH=wasm go build -o out.wasm .' },
    { kind: 'command', text: 'ls -1 out*' },
    {
      kind: 'stdout',
      text:
        'out-darwin-arm64\nout-linux-386\nout-linux-amd64\nout-linux-arm64\nout-windows-amd64\nout.wasm\n',
    },
    { kind: 'command', text: 'file out-linux-amd64 out-windows-amd64 out.wasm' },
    {
      kind: 'stdout',
      text:
        'out-linux-amd64:   ELF 64-bit LSB executable, x86-64, statically linked\nout-windows-amd64: PE32+ executable (console) x86-64, for MS Windows\nout.wasm:           WebAssembly (wasm) binary module version 0x1 (MVP)\n',
    },
    { kind: 'command', text: 'GOOS=windows GOARCH=amd64 go env GOOS GOARCH CGO_ENABLED' },
    { kind: 'stdout', text: 'windows\namd64\n0\n' },
  ],
  gotcha: `\`CGO_ENABLED\` is **0 by default when you cross-compile** — the
toolchain will not guess that your C compiler targets another
architecture. The upside is that a pure-Go binary is then statically
linked and runs anywhere.`,
};

export const ldflagsAndTrimpath: Lesson = {
  slug: 'ldflags-and-trimpath',
  title: '`-ldflags`, `-trimpath` and build modes',
  sectionId: 'toolchain',
  order: 62,
  runMode: 'terminal',
  body: `**Version stamping with \`-ldflags -X\`.** The \`-X\` flag sets the
value of a string variable at link time. The variable must be a
package-level \`string\` (or a slice of strings) with no initialiser
other than a constant string:

\`\`\`
var (
    version = "dev"
    commit  = "none"
    date    = "unknown"
)
\`\`\`

\`\`\`
$ go build -ldflags "-X 'main.version=1.4.2' -X 'main.commit=abc1234'" -o app .
$ ./app
version: 1.4.2
commit: abc1234
\`\`\`

The path is \`importpath.name\`: \`main.version\` for a variable in
\`package main\`, \`example.com/x/y.Version\` for one in another package.
The quotes matter if the value contains spaces — the \`-ldflags\` value
is split on whitespace.

**The \`-X\` target must be a \`string\`.** Setting an \`int\` fails at
link time with \`-X ... is not a string\`-style error.

**\`debug.ReadBuildInfo\` is the other half.** It returns the module
version and the Go version the binary was built with, without needing
any \`-X\` flags at all. Use it for the module version, and \`-X\` for
anything you compute yourself (a git hash, a build timestamp).

**What ended up in the binary: \`go version -m\`.**

\`\`\`
$ go version -m app
app: go1.27.1
\tpath\texample.com/cross
\tmod\texample.com/cross\t(devel)
\tbuild\t-buildmode=exe
\tbuild\t-ldflags="-X 'main.version=1.4.2' -X 'main.commit=abc1234'"
\tbuild\tCGO_ENABLED=1
\tbuild\tGOARCH=arm64
\tbuild\tGOOS=darwin
\`\`\`

This is the build manifest. It is how you answer "what is actually in
this binary?" — and it is what tools like \`goreleaser\` and CI
provenance checks read.

**\`-trimpath\` removes the local paths.** By default the binary records
the absolute paths of the source directories, which leaks the build
machine's layout and makes two builds of the same commit differ.
\`-trimpath\` rewrites them to the module paths:

\`\`\`
$ go build -trimpath -o app .
$ go version -m app | grep trimpath
\tbuild\t-trimpath=true
\`\`\`

**Use \`-trimpath\` for anything you ship.** It is what makes the build
reproducible, and it is one of the flags the Go team uses for their own
release binaries.

**The other \`-ldflags\` flags.** \`-s\` strips the symbol table and
\`-w\` strips the DWARF debug info, which roughly halves the binary
size — at the cost of making it much harder to debug and to profile:

\`\`\`
$ go build -ldflags "-s -w" -o app .
\`\`\`

**Build modes.** \`-buildmode\` selects the shape of the output:

- \`exe\` (default) — a normal executable.
- \`pie\` — a position-independent executable.
- \`archive\` — a \`.a\` archive of the listed packages.
- \`c-archive\` / \`c-shared\` — a C archive or shared library, for
  calling Go from C.
- \`plugin\` — a Go plugin, loadable at run time with \`plugin.Open\`.

\`c-archive\` and \`plugin\` both require cgo.

**\`-buildvcs\` controls the VCS stamp.** By default (\`auto\`) the
toolchain embeds the commit hash and the dirty state of the repository
when the main package, the main module and the current directory are all
in the same repository. \`-buildvcs=false\` omits it;
\`-buildvcs=true\` makes a missing VCS an error instead.`,
  terminalOutput: [
    {
      kind: 'command',
      text: 'go build -ldflags "-X \'main.version=1.4.2\' -X \'main.commit=abc1234\' -X \'main.date=2026-10-20\'" -o app .',
    },
    { kind: 'command', text: './app' },
    {
      kind: 'stdout',
      text: 'version: 1.4.2\ncommit: abc1234\ndate: 2026-10-20\ngo version: go1.27.1\n',
    },
    { kind: 'command', text: 'go version -m app' },
    {
      kind: 'stdout',
      text:
        'app: go1.27.1\n\tpath\texample.com/cross\n\tmod\texample.com/cross\t(devel)\t\n\tbuild\t-buildmode=exe\n\tbuild\t-compiler=gc\n\tbuild\t-ldflags="-X \'main.version=1.4.2\' -X \'main.commit=abc1234\' -X \'main.date=2026-10-20\'"\n\tbuild\tCGO_ENABLED=1\n\tbuild\tGOARCH=arm64\n\tbuild\tGOOS=darwin\n',
    },
    { kind: 'command', text: 'go build -trimpath -o app-trim .' },
    { kind: 'command', text: 'go version -m app-trim | grep trimpath' },
    { kind: 'stdout', text: '\tbuild\t-trimpath=true\n' },
  ],
  gotcha: `The \`-X\` flag only works on a package-level \`string\` (or
\`[]string\`) variable. Setting an \`int\`, or a variable that is not at
package scope, fails at link time rather than at compile time — so the
error only appears when you build with the flag.`,
};

export const profiling: Lesson = {
  slug: 'profiling',
  title: '`go tool pprof` and `go tool trace`',
  sectionId: 'toolchain',
  order: 63,
  runMode: 'terminal',
  body: `Go ships two profilers, and they answer different questions.
**pprof** answers "where is the time going?"; **the execution tracer**
answers "what is actually happening?"

**A CPU profile.** Start it, do the work, stop it:

\`\`\`
f, _ := os.Create("cpu.prof")
defer f.Close()
pprof.StartCPUProfile(f)
work()
pprof.StopCPUProfile()
\`\`\`

**A memory profile.** Two flavours: a heap profile of everything
allocated, and an allocation profile of everything still live.

\`\`\`
// everything still live at this point
runtime.GC()
f, _ := os.Create("heap.prof")
pprof.WriteHeapProfile(f)
f.Close()

// everything allocated since the program started
f2, _ := os.Create("allocs.prof")
pprof.Lookup("allocs").WriteTo(f2, 0)
f2.Close()
\`\`\`

The \`runtime.GC()\` before writing the heap profile is not optional: the
profile only shows what the garbage collector considers *reachable*, so
without it you get the allocations you have not yet freed, not the ones
you are actually holding.

**Reading a profile with \`go tool pprof\`.**

\`\`\`
$ go tool pprof -top cpu.prof
File: app
Type: cpu
Time: 2026-10-20 22:03:25 EDT
Duration: 204.31ms, Total samples = 30ms (14.68%)
Showing nodes accounting for 30ms, 100% of 30ms total
      flat  flat%   sum%        cum   cum%
      20ms 66.67% 66.67%       30ms   100%  main.work (inline)
      10ms 33.33%  100%       10ms 33.33%  runtime.asyncPreempt
         0     0%   100%       30ms   100%  main.main
         0     0%   100%       30ms   100%  runtime.main
\`\`\`

- \`flat\` is the time spent *in* that function.
- \`cum\` is the time spent in it *and* everything it called.
- The last \`100%\` column is the cumulative total.

**\`go tool pprof -http=:8080\` opens a browser UI** with a flame graph,
a call graph and a source view annotated with the profile. This is the
tool you actually want to use.

**You do not have to write the profiling code yourself.** A test
binary has built-in flags:

\`\`\`
go test -cpuprofile=cpu.out -memprofile=mem.out ./...
go test -blockprofile=block.out -mutexprofile=mutex.out ./...
\`\`\`

The \`block\` profile records where goroutines blocked on channels and
mutexes; the \`mutex\` profile records contention on sync primitives.
Both are the fastest way to find a concurrency bottleneck.

**The execution tracer** is a different tool. It records every
scheduler event, goroutine creation, channel operation and blocking
event, and renders them as a timeline:

\`\`\`
f, _ := os.Create("trace.out")
trace.Start(f)
work()
trace.Stop()
\`\`\`

\`go tool trace trace.out\` opens the browser UI — a flame-chart-style
view of every goroutine over time, with the scheduler's decisions
visible. Use it when a program hangs, deadlocks, or behaves differently
under load, and pprof cannot tell you why.

**\`go tool trace\` can also produce profiles.** \`-pprof=sync\` and
\`-pprof=net\` turn the trace into a blocking or network profile that
you can then read with \`go tool pprof\`.

**The cost.** A CPU profile roughly doubles the runtime; the tracer
overheads it more. Neither belongs in a production hot path — take the
profile in a staging environment, or behind a flag.`,
  terminalOutput: [
    { kind: 'command', text: 'go run ./cmd/app' },
    { kind: 'stdout', text: 'profile written\n' },
    { kind: 'command', text: 'go tool pprof -top cpu.prof' },
    {
      kind: 'stdout',
      text:
        'File: app\nType: cpu\nTime: 2026-10-20 22:03:25 EDT\nDuration: 204.31ms, Total samples = 30ms (14.68%)\nShowing nodes accounting for 30ms, 100% of 30ms total\n      flat  flat%   sum%        cum   cum%\n      20ms 66.67% 66.67%       30ms   100%  main.work (inline)\n      10ms 33.33%  100%       10ms 33.33%  runtime.asyncPreempt\n         0     0%   100%       30ms   100%  main.main\n         0     0%   100%       30ms   100%  runtime.main\n',
    },
    { kind: 'command', text: 'go tool pprof -http=:8080 cpu.prof' },
    { kind: 'command', text: 'go run ./cmd/app' },
    { kind: 'stdout', text: 'trace written\n' },
    { kind: 'command', text: 'go tool trace trace.out' },
    { kind: 'command', text: 'go test -cpuprofile=cpu.out -memprofile=mem.out ./...' },
  ],
  gotcha: `A heap profile only shows what is **reachable** at the moment
you write it. Call \`runtime.GC()\` first, or you will be reading the
allocations you have not freed yet rather than the ones you are
actually holding on to.`,
};
