import type { Lesson } from '../types';

const goRunBuild: Lesson = {
  slug: 'go-run-build',
  title: 'go run, go build, output paths',
  sectionId: 'toolchain',
  order: 49,
  runMode: 'terminal',
  body: `\`go run .\` compiles the named package to a temporary binary and runs it. \`go build .\` writes an executable into the current directory, named after the package directory unless the module path says otherwise. \`-o\` chooses the path and name.

Both commands take package patterns: \`.\` (current directory), \`./...\` (everything below), or an import path. Use \`go run\` for the edit-run loop and \`go build\` when you need the artifact — the binary is what you deploy, copy, or profile.`,
  terminalOutput: [
    { kind: 'command', text: 'go run .' },
    { kind: 'stdout', text: 'hello, build' },
    { kind: 'command', text: 'go build .' },
    { kind: 'command', text: 'go build -o bin/app .' },
    { kind: 'command', text: './bin/app' },
    { kind: 'stdout', text: 'hello, build' },
    { kind: 'command', text: 'ls -lh bin/app' },
    { kind: 'stdout', text: '2.3M bin/app' },
  ],
  gotcha:
    '`go build .` names the binary after the package directory, not the module. `go build -o bin/app .` is the predictable form when scripts consume the output.',
};

const goInstall: Lesson = {
  slug: 'go-install',
  title: 'go install and GOBIN',
  sectionId: 'toolchain',
  order: 50,
  runMode: 'terminal',
  body: `\`go install\` compiles and places the binary in \`$GOBIN\`, or \`$GOPATH/bin\` when GOBIN is empty. With a package path that includes a version — \`go install example.com/tool@latest\` — it builds from the module cache without touching your go.mod.

For local development, \`GOBIN=$PWD/bin go install .\` keeps tools inside the project. Make sure the directory is on \`PATH\` if you expect to invoke the command by name.`,
  terminalOutput: [
    { kind: 'command', text: 'GOBIN=$PWD/bin go install .' },
    { kind: 'command', text: 'ls bin' },
    { kind: 'stdout', text: 'cli' },
    { kind: 'command', text: './bin/cli' },
    { kind: 'stdout', text: 'hello from install' },
  ],
  gotcha:
    '`GOBIN` must already exist and be writable, and it must be on `PATH` for the installed command to resolve. `go env GOBIN` prints the current value.',
};

const goModules: Lesson = {
  slug: 'go-modules',
  title: 'go mod: init, tidy, get, why, graph, replace, vendor',
  sectionId: 'toolchain',
  order: 51,
  runMode: 'terminal',
  body: `\`go mod init example.com/demo\` creates go.mod and sets the module path that every internal import uses. \`go mod tidy\` adds missing requirements and drops unused ones. \`go get module@version\` adds or upgrades a requirement. \`go mod why\` explains why a module is in the graph; \`go mod graph\` prints the raw edges.

\`go mod edit -replace old=./local\` points an import at a local directory — useful for developing two modules together. \`go mod vendor\` copies dependencies under \`vendor/\`, and builds then use that tree. Commit go.mod and go.sum; vendor is a choice.`,
  terminalOutput: [
    { kind: 'command', text: 'go mod init example.com/demo' },
    { kind: 'stdout', text: 'go: creating new go.mod: module example.com/demo' },
    { kind: 'stdout', text: 'go: to add module requirements and sums:' },
    { kind: 'stdout', text: '\tgo mod tidy' },
    { kind: 'command', text: 'go mod tidy' },
    { kind: 'stdout', text: 'go: finding module for package github.com/google/uuid' },
    { kind: 'stdout', text: 'go: found github.com/google/uuid in github.com/google/uuid v1.6.0' },
    { kind: 'command', text: 'go get github.com/google/uuid@v1.6.0' },
    { kind: 'command', text: 'cat go.mod' },
    { kind: 'stdout', text: 'module example.com/demo' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'go 1.27.3' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'require github.com/google/uuid v1.6.0' },
    { kind: 'command', text: 'go mod why github.com/google/uuid' },
    { kind: 'stdout', text: '# github.com/google/uuid' },
    { kind: 'stdout', text: 'example.com/demo' },
    { kind: 'stdout', text: 'github.com/google/uuid' },
    { kind: 'command', text: 'go mod graph' },
    { kind: 'stdout', text: 'example.com/demo github.com/google/uuid@v1.6.0' },
    { kind: 'stdout', text: 'example.com/demo go@1.27.3' },
    { kind: 'command', text: 'go mod edit -replace example.com/old=./local' },
    { kind: 'command', text: 'go mod vendor' },
    { kind: 'command', text: 'ls vendor/github.com/google/uuid' },
    { kind: 'stdout', text: 'CHANGELOG.md  CONTRIBUTING.md  CONTRIBUTORS  dce.go  doc.go' },
  ],
  gotcha:
    'A `replace` to a local path that exists only on your machine breaks everyone else\'s build. Keep development replaces out of committed go.mod, or use a workspace instead.',
};

const goWork: Lesson = {
  slug: 'go-work',
  title: 'go work: multi-module workspaces',
  sectionId: 'toolchain',
  order: 52,
  runMode: 'terminal',
  body: `A workspace ties several modules together for local development. \`go work init ./lib ./app\` writes \`go.work\` with a \`use\` block; builds from anywhere in the workspace resolve those modules from disk instead of the module cache or a proxy.

Workspaces are for development. A library release should not depend on them; CI should either build each module independently or commit a deliberate go.work. The workspace also gets its own \`go.work.sum\`.`,
  terminalOutput: [
    { kind: 'command', text: 'go work init ./lib ./app' },
    { kind: 'command', text: 'cat go.work' },
    { kind: 'stdout', text: 'go 1.27.3' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'use (' },
    { kind: 'stdout', text: '\t./app' },
    { kind: 'stdout', text: '\t./lib' },
    { kind: 'stdout', text: ')' },
    { kind: 'command', text: 'go run ./app' },
    { kind: 'stdout', text: 'lib says: 42' },
  ],
  gotcha:
    '`go build ./...` from the workspace root fails — the root is not a module. Run it inside a module or pass module-qualified patterns like `./app/...`.',
};

export const sectionK1Lessons: Lesson[] = [goRunBuild, goInstall, goModules, goWork];
