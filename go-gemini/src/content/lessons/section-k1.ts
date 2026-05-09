import type { Lesson } from '../types'

export const sectionK1Lessons: Lesson[] = [
  {
    slug: 'go-build-run',
    title: '49. go run & go build',
    section: 'Section K: Toolchain & Workflow',
    order: 49,
    runMode: 'terminal',
    body: `
The Go toolchain is built around source code, not Makefiles or build scripts.

- \`go run\` compiles and immediately runs a Go program. It creates a temporary executable and cleans it up after the program exits.
- \`go build\` compiles the program and produces an executable binary in the current directory. You can specify the output filename with the \`-o\` flag.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go run main.go' },
      { kind: 'stdout', text: 'Hello, world!' },
      { kind: 'command', text: '$ go build -o myapp main.go' },
      { kind: 'command', text: '$ ls' },
      { kind: 'stdout', text: 'main.go  myapp' },
      { kind: 'command', text: '$ ./myapp' },
      { kind: 'stdout', text: 'Hello, world!' }
    ],
  },
  {
    slug: 'go-install',
    title: '50. go install & GOBIN',
    section: 'Section K: Toolchain & Workflow',
    order: 50,
    runMode: 'terminal',
    body: `
\`go install\` compiles and installs packages and dependencies. 

When you run \`go install\`, the resulting executable is placed in the directory specified by the \`GOBIN\` environment variable, which defaults to \`$GOPATH/bin\` or \`$HOME/go/bin\`. 

You can also use \`go install\` with a package version to install third-party tools globally.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go install .' },
      { kind: 'command', text: '$ ls ~/go/bin' },
      { kind: 'stdout', text: 'myapp' },
      { kind: 'command', text: '$ myapp' },
      { kind: 'stdout', text: 'Hello, world!' },
      { kind: 'command', text: '$ go install golang.org/x/tools/cmd/goimports@latest' },
      { kind: 'stdout', text: 'go: downloading golang.org/x/tools v0.14.0' },
      { kind: 'command', text: '$ ls ~/go/bin' },
      { kind: 'stdout', text: 'goimports  myapp' }
    ],
  },
  {
    slug: 'go-modules',
    title: '51. go mod (init, tidy, get)',
    section: 'Section K: Toolchain & Workflow',
    order: 51,
    runMode: 'terminal',
    body: `
Go modules are the standard for dependency management.

- \`go mod init <module-path>\`: Initialize a new module, creating a \`go.mod\` file.
- \`go get <pkg>\`: Add a dependency to your module and download it.
- \`go mod tidy\`: Add missing modules required to build the current packages and remove unused modules. Always run this before committing!
- \`go mod vendor\`: Copy all dependencies into a \`vendor\` directory.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go mod init example.com/hello' },
      { kind: 'stdout', text: 'go: creating new go.mod: module example.com/hello' },
      { kind: 'command', text: '$ go get github.com/google/uuid' },
      { kind: 'stdout', text: 'go: downloading github.com/google/uuid v1.3.1\ngo: added github.com/google/uuid v1.3.1' },
      { kind: 'command', text: '$ go mod tidy' },
      { kind: 'command', text: '$ cat go.mod' },
      { kind: 'stdout', text: 'module example.com/hello\n\ngo 1.23\n\nrequire github.com/google/uuid v1.3.1' }
    ],
  },
  {
    slug: 'go-workspaces',
    title: '52. go work (workspaces)',
    section: 'Section K: Toolchain & Workflow',
    order: 52,
    runMode: 'terminal',
    body: `
Go 1.18 introduced **multi-module workspaces**, allowing you to work on multiple interacting modules at the same time without needing to edit \`go.mod\` files or use \`replace\` directives.

Initialize a workspace using \`go work init\`, then add modules with \`go work use\`. This creates a \`go.work\` file which the Go tools will automatically detect and use to resolve dependencies locally across the workspace.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ tree -L 1' },
      { kind: 'stdout', text: '.\n├── myapp\n└── mylib' },
      { kind: 'command', text: '$ go work init' },
      { kind: 'command', text: '$ go work use ./myapp ./mylib' },
      { kind: 'command', text: '$ cat go.work' },
      { kind: 'stdout', text: 'go 1.23\n\nuse (\n\t./myapp\n\t./mylib\n)' },
      { kind: 'command', text: '$ cd myapp' },
      { kind: 'command', text: '$ go run .' },
      { kind: 'stdout', text: 'Calling mylib locally... Success!' }
    ],
  }
]
