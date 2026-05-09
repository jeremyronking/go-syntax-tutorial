import type { Lesson } from '../types'

export const sectionK3Lessons: Lesson[] = [
  {
    slug: 'go-generate',
    title: '59. go generate',
    section: 'Section K: Toolchain & Workflow',
    order: 59,
    runMode: 'terminal',
    body: `
\`go generate\` automates the running of tools that generate Go source code. 

It works by scanning Go source files for special comments starting with \`//go:generate\`, followed by a command to execute.

This is commonly used for generating string methods for enums (using \`stringer\`), generating mocks for testing (using \`mockgen\`), or compiling protobufs. \`go generate\` is never run automatically by \`go build\` or \`go test\`; it must be invoked explicitly.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat pill.go' },
      { kind: 'stdout', text: `package main

//go:generate stringer -type=Pill
type Pill int

const (
    Placebo Pill = iota
    Aspirin
    Ibuprofen
)` },
      { kind: 'command', text: '$ go generate' },
      { kind: 'command', text: '$ ls' },
      { kind: 'stdout', text: 'pill.go  pill_string.go' },
      { kind: 'command', text: '$ cat pill_string.go' },
      { kind: 'stdout', text: '(Auto-generated code implementing the String() method for Pill)' }
    ],
  },
  {
    slug: 'go-env',
    title: '60. Environment variables (go env)',
    section: 'Section K: Toolchain & Workflow',
    order: 60,
    runMode: 'terminal',
    body: `
The \`go\` command behavior can be modified using environment variables. You can view all current Go environment variables using \`go env\`.

Key variables include:
- \`GOPATH\`: The traditional workspace directory (now mostly legacy, but still defaults to \`~/go\`).
- \`GOMODCACHE\`: Where downloaded modules are cached.
- \`GOPROXY\`: The proxy server used to download modules (defaults to \`https://proxy.golang.org\`).
- \`GOPRIVATE\`: A comma-separated list of module paths that should not be downloaded via proxy or checksum-validated (essential for corporate private repos).
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go env GOPRIVATE GOPROXY' },
      { kind: 'stdout', text: '\nhttps://proxy.golang.org,direct' },
      { kind: 'command', text: '$ go env -w GOPRIVATE=github.com/mycompany/*' },
      { kind: 'command', text: '$ go env GOPRIVATE' },
      { kind: 'stdout', text: 'github.com/mycompany/*' }
    ],
  },
  {
    slug: 'cross-compilation',
    title: '61. Cross compilation',
    section: 'Section K: Toolchain & Workflow',
    order: 61,
    runMode: 'terminal',
    body: `
Go makes cross-compiling trivially easy. By setting the \`GOOS\` (operating system) and \`GOARCH\` (architecture) environment variables before running \`go build\`, you can compile a binary for a different platform from your current machine.

If your code uses \`cgo\`, cross-compilation is much harder because you need a C cross-compiler. Setting \`CGO_ENABLED=0\` disables \`cgo\` and produces a pure Go, statically-linked binary, which is highly recommended for Docker containers.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ GOOS=linux GOARCH=amd64 go build -o myapp-linux main.go' },
      { kind: 'command', text: '$ GOOS=windows GOARCH=amd64 go build -o myapp.exe main.go' },
      { kind: 'command', text: '$ GOOS=darwin GOARCH=arm64 go build -o myapp-mac main.go' },
      { kind: 'command', text: '$ file myapp-linux myapp.exe myapp-mac' },
      { kind: 'stdout', text: `myapp-linux: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked
myapp.exe:   PE32+ executable (console) x86-64 (stripped to external PDB), for MS Windows
myapp-mac:   Mach-O 64-bit executable arm64` }
    ],
  },
  {
    slug: 'ldflags',
    title: '62. -ldflags and build modes',
    section: 'Section K: Toolchain & Workflow',
    order: 62,
    runMode: 'terminal',
    body: `
You can pass flags to the Go linker using \`go build -ldflags\`.

The most common use is "stamping" a binary with version information at build time using the \`-X\` flag, which sets the value of a string variable in the package.

Other common build flags:
- \`-trimpath\`: Removes absolute file system paths from the compiled executable to improve build reproducibility.
- \`-buildmode=plugin\`: Compiles the package as a dynamically loadable plugin (Linux/macOS only).
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat main.go' },
      { kind: 'stdout', text: `package main

import "fmt"

var Version = "development"

func main() {
    fmt.Println("Version:", Version)
}` },
      { kind: 'command', text: '$ go build -ldflags="-X main.Version=v1.0.42" -trimpath -o app main.go' },
      { kind: 'command', text: '$ ./app' },
      { kind: 'stdout', text: 'Version: v1.0.42' }
    ],
  },
  {
    slug: 'pprof-trace',
    title: '63. Profiling (pprof & trace)',
    section: 'Section K: Toolchain & Workflow',
    order: 63,
    runMode: 'terminal',
    body: `
Go has incredible built-in observability tools.

- **\`go tool pprof\`**: Analyzes CPU and memory profiles. You can generate these profiles from \`go test -cpuprofile=cpu.prof\` or by importing \`net/http/pprof\` in your application to expose an HTTP endpoint.
- **\`go tool trace\`**: Analyzes a runtime trace to understand goroutine scheduling, garbage collection pauses, and network blocking over time.

These tools provide web-based UIs and interactive command-line interfaces.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go test -cpuprofile cpu.prof -memprofile mem.prof -bench .' },
      { kind: 'stdout', text: '(Runs benchmarks and writes profile files)' },
      { kind: 'command', text: '$ go tool pprof -http=:8080 cpu.prof' },
      { kind: 'stdout', text: 'Serving web UI on http://localhost:8080' },
      { kind: 'command', text: '$ go tool trace trace.out' },
      { kind: 'stdout', text: 'Parsing trace...\nSplitting trace...\nOpening browser. Trace viewer is listening on http://127.0.0.1:51234' }
    ],
    checkpoint: {
      id: 'checkpoint-k',
      questions: [
        {
          id: 'cp-k-1',
          prompt: 'Which command compiles your Go program and saves the executable to your `GOBIN` directory?',
          type: 'mcq',
          options: ['go build', 'go run', 'go install', 'go get'],
          correctIndex: 2,
          explanation: 'go build leaves the binary in the current directory. go install places it in GOBIN (typically ~/go/bin).'
        },
        {
          id: 'cp-k-2',
          prompt: 'What happens when you run `go mod tidy`?',
          type: 'mcq',
          options: ['It formats your source code', 'It cleans your GOMODCACHE', 'It removes unused dependencies and adds missing ones to go.mod', 'It creates a vendor directory'],
          correctIndex: 2,
          explanation: 'go mod tidy ensures your go.mod and go.sum files exactly match the required dependencies of your source code.'
        },
        {
          id: 'cp-k-3',
          prompt: 'If you want to run a specific test named `TestMath` and nothing else, what flag do you use?',
          type: 'mcq',
          options: ['go test -name=TestMath', 'go test -run=TestMath', 'go test -test=TestMath'],
          correctIndex: 1,
          explanation: 'The -run flag accepts a regular expression to match test names.'
        },
        {
          id: 'cp-k-4',
          prompt: 'Which environment variables are used to specify the target OS and architecture for cross-compilation?',
          type: 'fill',
          acceptedAnswers: ['GOOS GOARCH', 'GOOS, GOARCH', 'GOOS and GOARCH'],
          explanation: 'Setting GOOS (e.g. linux) and GOARCH (e.g. arm64) tells the compiler which platform to target.'
        },
        {
          id: 'cp-k-5',
          prompt: 'What tool would you use to analyze a CPU profile generated by your Go application?',
          type: 'mcq',
          options: ['go tool vet', 'go tool pprof', 'go tool trace', 'go tool cover'],
          correctIndex: 1,
          explanation: 'pprof is the standard Go tool for analyzing CPU, memory, mutex, and goroutine profiles.'
        }
      ]
    }
  }
]
