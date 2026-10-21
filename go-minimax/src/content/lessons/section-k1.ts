import type { Lesson } from '../types';

/**
 * Section K group 1 — the build/run/module workflow. Every lesson in this
 * file is `terminal` mode: the Playground sandbox cannot run toolchain
 * commands, so each transcript is captured from a real go1.27 workspace.
 */

export const buildAndRun: Lesson = {
  slug: 'build-and-run',
  title: '`go build`, `go run` & output paths',
  sectionId: 'toolchain',
  order: 49,
  runMode: 'terminal',
  body: `\`go build\` compiles a package and leaves the binary behind; \`go run\`
compiles and runs it in one step. The compiler, the linker and the build
cache are identical in both cases — the difference is only *when* the
binary is produced and whether it is kept.

**Where the binary lands.** \`go build\` writes the executable into the
*current directory*, named after the package's import path:

\`\`\`
go build ./cmd/greet     ->  ./greet
go build ./...           ->  ./greet  (one per main package)
go build ./internal/x    ->  nothing (not a main package)
\`\`\`

The name comes from the last element of the import path, not the directory
name. For a module \`example.com/awesome-tool/v2\`, the package
\`example.com/awesome-tool/v2/tools/cli\` builds to \`cli\`.

**\`go build\` on a library writes nothing.** A package without a \`main\`
function is compiled, type-checked and cached, but produces no file. This
is why \`go build ./...\` at the root of a module is a fast way to check
that everything still compiles.

**\`go run\` and the arguments.** \`go run\` takes the package arguments
first and everything after the package is passed to the program:

\`\`\`
go run ./cmd/greet gopher      ->  the program sees "gopher"
go run . gopher                ->  same, for the package in this directory
\`\`\`

The gotcha is that a *file list* swallows the arguments: \`go run a.go b.go
extra\` treats \`extra\` as another source file, not as an argument to the
program. Use a package path, not a file list, when you want to pass
arguments.

**\`go build -o\` sets the output path.** \`-o\` takes either a file or a
directory:

\`\`\`
go build -o bin/greet ./cmd/greet   ->  ./bin/greet
go build -o dist/ ./cmd/greet       ->  ./dist/greet
go build -o greet-1.2.3 ./cmd/greet ->  ./greet-1.2.3
\`\`\`

If \`-o\` names a directory, the binary inside it keeps its default name.
The directory must already exist — \`go build\` does not create it for you.

**Other useful flags.**

- \`go build -v\` prints the names of the packages as they are compiled.
- \`go build -x\` prints every command the toolchain runs, including the
  linker invocation. Useful when you want to see exactly what flags your
  build uses.
- \`go build -race\` enables the race detector.
- \`go build -tags dev\` sets a custom build tag.

**The build cache is the reason builds are fast.** The toolchain caches
compiled packages keyed by their content, their compiler version and their
build flags. A second \`go build\` of an unchanged package reuses the
cached object and does nothing. \`go clean -cache\` empties it.

**Which to use.** \`go run\` while you are iterating — it is one command.
\`go build\` when you are about to run the binary more than once, when you
want to measure its startup time, or when you are shipping it: \`go run\`
pays the compile cost on every invocation, and the executable is deleted
when the process exits.`,
  terminalOutput: [
    { kind: 'command', text: 'go build ./...' },
    { kind: 'stdout', text: 'greet\n' },
    { kind: 'command', text: 'ls' },
    { kind: 'stdout', text: 'cmd\ngo.mod\ngreet\n' },
    { kind: 'command', text: 'go build -o bin/greet ./cmd/greet' },
    { kind: 'command', text: 'ls -l bin/' },
    {
      kind: 'stdout',
      text: 'total 4752\n-rwxr-xr-x  1 king  staff  2429714 Oct 20 21:56 greet\n',
    },
    { kind: 'command', text: 'go build -o dist/ ./cmd/greet' },
    { kind: 'command', text: 'ls -l dist/' },
    {
      kind: 'stdout',
      text: 'total 4752\n-rwxr-xr-x  1 king  staff  2429714 Oct 20 21:56 greet\n',
    },
    { kind: 'command', text: 'go run ./cmd/greet gopher' },
    { kind: 'stdout', text: 'hello, gopher\n' },
    { kind: 'command', text: './bin/greet gopher' },
    { kind: 'stdout', text: 'hello, gopher\n' },
  ],
  gotcha: `\`go build -o\` will not create the output directory for you — the
build fails with \`open bin/greet: no such file or directory\`. Create it
first, or use \`go build -o dist/ ./cmd/greet\`, which still needs \`dist/\`
to exist.`,
};

export const goInstall: Lesson = {
  slug: 'go-install',
  title: '`go install` & `GOBIN`',
  sectionId: 'toolchain',
  order: 50,
  runMode: 'terminal',
  body: `\`go install\` compiles a program and puts the binary in your
\`PATH\`, rather than in the current directory. It is how you install a
command-line tool.

**Two completely different modes.** The \`@version\` suffix is the tell:

\`\`\`
go install ./cmd/greet            # from the current module
go install example.com/x/y/cmd@v1.2.3   # from a module version
\`\`\`

The second form runs in *module-aware* mode outside your current module:
it ignores your \`go.mod\` entirely, downloads the named version, and
installs it. That is the form to use for tools:

\`\`\`
go install golang.org/x/tools/cmd/goimports@latest
go install honnef.co/go/tools/cmd/staticcheck@2025.1.1
\`\`\`

Without \`@version\`, \`go install\` is a *build* of the current module and
behaves like \`go build\` except for the destination: the binary goes to
\`$GOBIN\`, or to \`$GOPATH/bin\` if \`GOBIN\` is unset. It does **not** add
anything to your \`go.mod\` — you are installing a program, not adding a
dependency.

**\`GOBIN\` decides where.** \`go env GOBIN\` prints the destination:

\`\`\`
$ go env GOBIN GOPATH
/Users/king/go/bin
/Users/king/go
\`\`\`

If \`GOBIN\` is empty, the binary goes to \`$GOPATH/bin\`. On a typical
install, \`GOPATH\` is \`$HOME/go\`, so that is \`$HOME/go/bin\`. You have to
put that directory on your \`PATH\` yourself — the toolchain will not do it
for you.

**\`go install\` only installs programs.** A package without a \`main\`
function is a no-op:

\`\`\`
$ go install ./internal/calc
$ go install golang.org/x/tools/cmd/goimports@latest
\`\`\`

**Version pinning is the point.** \`@latest\` tracks the newest release,
which means a fresh machine can get a different tool than last week. For
CI, pin the version: \`go install golang.org/x/tools/cmd/goimports@v0.36.0\`.
The result is reproducible.

**Check what is installed.** \`go version -m <binary>\` prints the build
metadata the toolchain embedded — the module path, the version, the
dependencies, and the build flags:

\`\`\`
$ go version -m $(which goimports)
bin/goimports: go1.27.1
\tpath\tgolang.org/x/tools/cmd/goimports
\tmod\tgolang.org/x/tools\tv0.52.0
\tdep\tgolang.org/x/mod\tv0.42.0
\tbuild\t-buildmode=exe
\tbuild\tGOARCH=arm64
\tbuild\tGOOS=darwin
\`\`\`

**\`go install\` versus \`go get\`.** \`go get\` adds a dependency to your
module; \`go install\` adds a program to your \`PATH\`. Since Go 1.18,
\`go get\` no longer installs binaries at all — it is purely a dependency
operation.

**Versioned module paths.** A module with a \`/v2\` suffix is a *different*
module from the unsuffixed one. \`go install example.com/x/y/cmd/v2@latest\`
installs the v2 command; \`example.com/x/y/cmd@latest\` installs v1. The
suffix is part of the path, not a tag.`,
  terminalOutput: [
    { kind: 'command', text: 'go env GOBIN GOPATH' },
    { kind: 'stdout', text: '/Users/king/go/bin\n/Users/king/go\n' },
    { kind: 'command', text: 'go install ./cmd/greet' },
    { kind: 'command', text: 'ls -l "$(go env GOPATH)/bin/greet"' },
    {
      kind: 'stdout',
      text:
        '-rwxr-xr-x  1 king  staff  2429714 Oct 20 21:56 /Users/king/go/bin/greet\n',
    },
    { kind: 'command', text: 'go install golang.org/x/tools/cmd/goimports@latest' },
    {
      kind: 'stdout',
      text: 'go: downloading golang.org/x/tools v0.52.0\n',
    },
    { kind: 'command', text: 'go version -m "$(go env GOPATH)/bin/goimports"' },
    {
      kind: 'stdout',
      text:
        '/Users/king/go/bin/goimports: go1.27.1\n\tpath\tgolang.org/x/tools/cmd/goimports\n\tmod\tgolang.org/x/tools\tv0.52.0\th1:ryxg4U63oaUYk7uOLTF37n43f4qgtGvqV4Ioit1BaEs=\n\tdep\tgolang.org/x/mod\tv0.42.0\th1:ICeL3t2L30ljSPHHxDnR4fqVcBt/zR2zJAb9juavmQg=\n\tbuild\t-buildmode=exe\n\tbuild\t-compiler=gc\n\tbuild\tCGO_ENABLED=1\n\tbuild\tGOARCH=arm64\n\tbuild\tGOOS=darwin\n',
    },
  ],
  gotcha: `\`go install ./cmd/tool\` inside a module does **not** update your
\`go.mod\`, and \`go install pkg@version\` ignores your \`go.mod\` entirely.
They also do different things: \`go install\` puts a program on your
\`PATH\`, \`go get\` adds a dependency to your module.`,
};

export const moduleManagement: Lesson = {
  slug: 'module-management',
  title: '`go.mod`, `go mod tidy` and the module commands',
  sectionId: 'toolchain',
  order: 51,
  runMode: 'terminal',
  body: `A Go module is a directory tree with a \`go.mod\` file at its root.
The file declares the module's path, the Go version it targets, and its
dependencies.

\`\`\`
module example.com/toolchain-demo

go 1.27.1

require github.com/google/uuid v1.6.0
\`\`\`

**The module path is the root of every import path in the module.** The
directory \`internal/calc\` in that module has the import path
\`example.com/toolchain-demo/internal/calc\`. A \`/v2\` suffix is part of
the path, so \`example.com/x/y/v2\` is a *different module* from
\`example.com/x/y\` — which is how v2+ releases stay compatible with v1.

**\`go mod init\` creates the file.** Run it once, at the root of the
project:

\`\`\`
$ go mod init example.com/toolchain-demo
go: creating new go.mod: module example.com/toolchain-demo
\`\`\`

**\`go mod tidy\` is the command you run most often.** It reads every
import in the module, adds the missing requirements, removes the ones
nothing needs, and updates \`go.sum\`. Run it before every commit: it is
what keeps \`go.mod\` honest, and a CI job that runs \`go mod tidy\` and
then \`git diff --exit-code\` will catch a stale \`go.mod\` for you.

**\`go get\` adds a dependency.** It resolves the version, updates
\`go.mod\` and \`go.sum\`, and downloads the module. Use \`@latest\`,
\`@v1.2.3\`, or \`@none\`. Importantly, \`go get\` in Go 1.18+ does **not**
build or install anything — it only edits the module files.

**\`go mod why\` explains a dependency.** It prints the import path that
pulls a package in:

\`\`\`
$ go mod why github.com/google/uuid
# github.com/google/uuid
example.com/toolchain-demo
github.com/google/uuid
\`\`\`

If the package is not needed, the output says
\`(main module does not need package …)\`.

**\`go mod graph\` shows the module graph** — one line per edge:

\`\`\`
$ go mod graph
example.com/toolchain-demo github.com/google/uuid@v1.6.0
example.com/toolchain-demo go@1.27.1
go@1.27.1 toolchain@go1.27.1
\`\`\`

**\`go mod edit\` edits \`go.mod\` without the network.** It is the
scriptable way to add or change requirements:

\`\`\`
$ go mod edit -require=github.com/google/uuid@v1.6.0
$ go mod edit -replace=github.com/google/uuid=github.com/google/uuid@v1.5.0
$ go mod edit -dropreplace=github.com/google/uuid
\`\`\`

**\`replace\` redirects a module.** It is a local, uncommitted override
that points at a different version, a different fork or a local
directory. It only applies to the main module — a dependency's
\`replace\` directives are ignored, which is exactly why you should never
rely on them in a library.

\`\`\`
replace example.com/lib => ../lib
replace github.com/google/uuid => github.com/myfork/uuid v1.5.0
\`\`\`

**\`go mod vendor\` copies the dependencies into \`vendor/\`.** The
directory then holds only the packages you actually import, and the
toolchain builds from it automatically (since Go 1.14, when a
\`vendor/modules.txt\` file is present and consistent with \`go.mod\`).
Vendoring is how you get hermetic, network-free builds — common in
corporate environments and in CI images that must not reach the
internet.

**Other commands worth knowing.**

- \`go mod download\` — populate the module cache without building.
- \`go mod verify\` — check the cached modules against their hashes.
- \`go mod tidy -diff\` (Go 1.23+) — report what \`tidy\` would change
  without changing it.
- \`go mod edit -json\` — print \`go.mod\` as JSON, for scripts.`,
  terminalOutput: [
    { kind: 'command', text: 'go mod init example.com/toolchain-demo' },
    {
      kind: 'stdout',
      text: 'go: creating new go.mod: module example.com/toolchain-demo\n',
    },
    { kind: 'command', text: 'go get github.com/google/uuid@latest' },
    { kind: 'stdout', text: 'go: added github.com/google/uuid v1.6.0\n' },
    { kind: 'command', text: 'cat go.mod' },
    {
      kind: 'stdout',
      text:
        'module example.com/toolchain-demo\n\ngo 1.27.1\n\nrequire github.com/google/uuid v1.6.0\n',
    },
    { kind: 'command', text: 'go mod why github.com/google/uuid' },
    {
      kind: 'stdout',
      text:
        '# github.com/google/uuid\nexample.com/toolchain-demo\ngithub.com/google/uuid\n',
    },
    { kind: 'command', text: 'go mod graph' },
    {
      kind: 'stdout',
      text:
        'example.com/toolchain-demo github.com/google/uuid@v1.6.0\nexample.com/toolchain-demo go@1.27.1\ngo@1.27.1 toolchain@go1.27.1\n',
    },
    { kind: 'command', text: 'go mod verify' },
    { kind: 'stdout', text: 'all modules verified\n' },
    { kind: 'command', text: 'go mod edit -replace=github.com/google/uuid=github.com/google/uuid@v1.5.0' },
    { kind: 'command', text: 'cat go.mod' },
    {
      kind: 'stdout',
      text:
        'module example.com/toolchain-demo\n\ngo 1.27.1\n\nrequire github.com/google/uuid v1.6.0\n\nreplace github.com/google/uuid => github.com/google/uuid v1.5.0\n',
    },
    { kind: 'command', text: 'go mod vendor' },
    { kind: 'command', text: 'find vendor -type f | sort' },
    {
      kind: 'stdout',
      text:
        'vendor/github.com/google/uuid/CHANGELOG.md\nvendor/github.com/google/uuid/CONTRIBUTING.md\nvendor/github.com/google/uuid/LICENSE\nvendor/github.com/google/uuid/doc.go\nvendor/github.com/google/uuid/hash.go\nvendor/github.com/google/uuid/marshal.go\nvendor/github.com/google/uuid/node.go\nvendor/github.com/google/uuid/null.go\nvendor/github.com/google/uuid/uuid.go\nvendor/github.com/google/uuid/version4.go\nvendor/github.com/google/uuid/version7.go\nvendor/modules.txt\n',
    },
  ],
  gotcha: `A \`replace\` directive only applies to the **main** module. A
dependency's \`replace\` lines are ignored when your module depends on it —
which is exactly why libraries must never rely on \`replace\`.`,
};

export const goWork: Lesson = {
  slug: 'go-work',
  title: '`go work` — multi-module workspaces',
  sectionId: 'toolchain',
  order: 52,
  runMode: 'terminal',
  body: `A **workspace** lets you work on several modules at once, without
publishing any of them. It is what you want when a library and its
consumer live in the same repository, or when you are developing a
change to a dependency you also depend on.

**The file is \`go.work\`, at the root of the workspace.**

\`\`\`
$ go work init ./service ./lib
$ cat go.work
go 1.27.1

use (
\t./lib
\t./service
)
\`\`\`

**Without a workspace, the build fails.** The service's \`go.mod\` requires
a published version of the library, or none at all:

\`\`\`
$ go build ./...
main.go:6:2: no required module provides package example.com/lib; to add it:
\tgo get example.com/lib
\`\`\`

With a workspace, the toolchain resolves \`example.com/lib\` to the local
directory, and the build works with no network access and no published
version.

**The commands.**

- \`go work init [dirs...]\` — create a \`go.work\` with the given modules.
- \`go work use [dirs...]\` — add modules to an existing workspace.
  \`go work use -r .\` adds every module found under the current
  directory.
- \`go work sync\` — push the workspace's resolved dependency versions
  back into each module's \`go.mod\`.
- \`go work edit\` — edit \`go.work\` the same way \`go mod edit\` edits
  \`go.mod\`. \`-json\` prints it.
- \`go env GOWORK\` — print the path of the workspace file in effect, or
  an empty string if you are not in one.

**\`go work sync\` resolves version conflicts.** If two modules in the
workspace require different versions of the same dependency, the
workspace picks the highest one and *both* modules use it. Running
\`go work sync\` writes that choice back into each module's \`go.mod\`, so
the modules agree even outside the workspace.

**A workspace overrides everything.** While \`go.work\` is in effect, the
toolchain uses it in preference to each module's own \`go.mod\` — the
\`replace\` directives in your modules are ignored. That is powerful and
also dangerous: a bug that reproduces in the workspace may not reproduce
for your colleagues.

**Turn it off when you need to.** \`GOWORK=off\` makes the toolchain ignore
\`go.work\` entirely:

\`\`\`
$ GOWORK=off go build ./...
\`\`\`

**Do not commit \`go.work\` blindly.** Many projects do commit it, because
every developer on the team should be building the same combination. But
it also overrides \`replace\` directives, so a project that relies on
local \`replace\` lines will break. Check with your team.

**Workspaces and \`go.work.sum\`.** A workspace has its own checksum file,
\`go.work.sum\`, which records the hashes of the modules the workspace
resolved. It is committed alongside \`go.work\` when the workspace file
is.`,
  terminalOutput: [
    { kind: 'command', text: 'cd service && go build ./...' },
    {
      kind: 'stderr',
      text:
        'main.go:6:2: no required module provides package example.com/lib; to add it:\n\tgo get example.com/lib\n',
    },
    { kind: 'command', text: 'cd .. && go work init ./service ./lib' },
    { kind: 'command', text: 'cat go.work' },
    {
      kind: 'stdout',
      text: 'go 1.27.1\n\nuse (\n\t./lib\n\t./service\n)\n',
    },
    { kind: 'command', text: 'cd service && go run .' },
    { kind: 'stdout', text: 'hello, gopher\n' },
    { kind: 'command', text: 'cd .. && go env GOWORK' },
    {
      kind: 'stdout',
      text:
        '/private/var/folders/r6/zq0vzqbd2g14rs2dypk9ky2c0000gn/T/opencode/wsdemo/go.work\n',
    },
    { kind: 'command', text: 'go work edit -json' },
    {
      kind: 'stdout',
      text:
        '{\n\t"Go": "1.27.1",\n\t"Use": [\n\t\t{\n\t\t\t"DiskPath": "./lib"\n\t\t},\n\t\t{\n\t\t\t"DiskPath": "./service"\n\t\t}\n\t]\n}\n',
    },
    { kind: 'command', text: 'cd service && GOWORK=off go build ./...' },
    {
      kind: 'stderr',
      text:
        'main.go:6:2: no required module provides package example.com/lib; to add it:\n\tgo get example.com/lib\n',
    },
  ],
  gotcha: `A workspace **overrides** the \`replace\` directives in your
modules — while \`go.work\` is in effect they are ignored entirely. Set
\`GOWORK=off\` to build the way your CI does.`,
};
