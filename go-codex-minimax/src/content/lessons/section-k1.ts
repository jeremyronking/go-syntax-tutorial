import type { Lesson } from '../types';

// K1. go run, go build, output paths, -o
export const toolchainBuild: Lesson = {
  slug: 'toolchain-build',
  title: '`go run`, `go build`, output paths, `-o`',
  section: 'K',
  order: 49,
  runMode: 'terminal',
  body: `\`go run ./cmd/hello\` compiles and immediately executes the program;
no binary is left on disk by default. \`go build ./cmd/hello\` writes a binary
named after the directory into the current working directory; \`go build -o bin/hello ./cmd/hello\` writes it to a path of your choice.

\`go build ./...\` builds every package in the module. Without an entry point
(\`package main\`), the build produces no binary but still verifies compilation.`,
  terminalOutput: [
    { kind: 'command', text: 'mkdir -p cmd/hello && cat > cmd/hello/main.go <<EOF' },
    { kind: 'stdout', text: 'package main' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'import "fmt"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func main() { fmt.Println("hi") }' },
    { kind: 'stdout', text: 'EOF' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go run ./cmd/hello' },
    { kind: 'stdout', text: 'hi' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go build -o bin/hello ./cmd/hello' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: './bin/hello' },
    { kind: 'stdout', text: 'hi' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go build ./...' },
    { kind: 'stdout', text: '' },
  ],
};

// K2. go install, GOBIN
export const toolchainInstall: Lesson = {
  slug: 'toolchain-install',
  title: '`go install` and `GOBIN`',
  section: 'K',
  order: 50,
  runMode: 'terminal',
  body: `\`go install ./cmd/hello\` is the older command to compile a \`main\`
package and copy the binary to \`$GOBIN\` (defaulting to \`$GOPATH/bin\`, or
\`$HOME/go/bin\` with default \`GOPATH\`). Since Go 1.18, \`go install\` only
builds; it does not install dependencies.

The order of resolution for the destination: \`$GOBIN\` if set, otherwise
\`$GOPATH/bin\` (which itself defaults to \`$HOME/go/bin\`). Add that directory
to your \`PATH\` to run installed binaries.`,
  terminalOutput: [
    { kind: 'command', text: 'go env GOBIN GOPATH' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: '/home/me/go/bin' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'GOBIN=/usr/local/bin go install ./cmd/hello' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'ls /usr/local/bin/hello' },
    { kind: 'stdout', text: '/usr/local/bin/hello' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'which hello' },
    { kind: 'stdout', text: '/usr/local/bin/hello' },
  ],
};

// K3. go mod commands
export const toolchainModules: Lesson = {
  slug: 'toolchain-modules',
  title: '`go mod init` / `tidy` / `get` / `why` / `graph` / `replace` / `vendor`',
  section: 'K',
  order: 51,
  runMode: 'terminal',
  body: `The module commands:

- \`go mod init <path>\` creates a new \`go.mod\`.
- \`go mod tidy\` adds missing modules and removes unused ones.
- \`go get foo@version\` adds or upgrades a dependency; \`go get foo@latest\`
  picks the latest released version.
- \`go mod why -m foo\` explains why the module is in the build.
- \`go mod graph\` prints the module graph.
- \`replace\` directives in \`go.mod\` redirect a module path to a local path
  or a fork.
- \`go mod vendor\` copies every dependency into a local \`vendor/\` directory
  for reproducible offline builds.`,
  terminalOutput: [
    { kind: 'command', text: 'go mod init example.com/proj' },
    { kind: 'stdout', text: 'go: creating new go.mod: module example.com/proj' },
    { kind: 'stdout', text: 'go: to add module requirements and sums:' },
    { kind: 'stdout', text: '    go mod tidy' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go get github.com/google/uuid@latest' },
    { kind: 'stdout', text: 'go: added github.com/google/uuid v1.6.0' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go mod why -m github.com/google/uuid' },
    { kind: 'stdout', text: '# github.com/google/uuid' },
    { kind: 'stdout', text: 'example.com/proj' },
    { kind: 'stdout', text: 'github.com/google/uuid' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go mod graph | head -3' },
    { kind: 'stdout', text: 'example.com/proj github.com/google/uuid@v1.6.0' },
  ],
};

// K4. go work
export const toolchainWorkspaces: Lesson = {
  slug: 'toolchain-workspaces',
  title: '`go work` multi-module workspaces',
  section: 'K',
  order: 52,
  runMode: 'terminal',
  body: `Multi-module workspaces (\`go.work\`) let you work on several modules at
once without \`replace\` directives. \`go work init ./mod-a ./mod-b\` creates a
\`go.work\` file that adds those directories to the workspace; subsequent
\`go build\` invocations read all of them.

The \`go.work\` file is local tooling and should not be committed if it
points at private forks. The \`use\` directive in \`go.work\` is the
workspace analog of \`require\` in \`go.mod\`.`,
  terminalOutput: [
    { kind: 'command', text: 'mkdir -p mod-a mod-b' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'cd mod-a && go mod init example.com/a && cd ..' },
    { kind: 'stdout', text: 'go: creating new go.mod: module example.com/a' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'cd mod-b && go mod init example.com/b && cd ..' },
    { kind: 'stdout', text: 'go: creating new go.mod: module example.com/b' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go work init ./mod-a ./mod-b' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'cat go.work' },
    { kind: 'stdout', text: 'go 1.22' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'use (' },
    { kind: 'stdout', text: '\t./mod-a' },
    { kind: 'stdout', text: '\t./mod-b' },
    { kind: 'stdout', text: ')' },
  ],
};
