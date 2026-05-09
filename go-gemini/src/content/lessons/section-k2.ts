import type { Lesson } from '../types'

export const sectionK2Lessons: Lesson[] = [
  {
    slug: 'go-test-basics',
    title: '53. go test: basics & subtests',
    section: 'Section K: Toolchain & Workflow',
    order: 53,
    runMode: 'terminal',
    body: `
Go's testing framework is built-in. Files ending in \`_test.go\` are compiled only during \`go test\`.

Test functions must be named \`TestXxx\` and take a \`*testing.T\` argument.
Go encourages **table-driven tests**, where you define a slice of test cases and iterate over them. You can use \`t.Run\` to create **subtests**, which can be run individually or in parallel with \`t.Parallel()\`.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat math_test.go' },
      { kind: 'stdout', text: `package math

import "testing"

func TestAdd(t *testing.T) {
    cases := []struct{ a, b, want int }{
        {1, 1, 2},
        {2, 2, 5}, // intentional failure
    }
    for _, c := range cases {
        t.Run("Adding", func(t *testing.T) {
            got := c.a + c.b
            if got != c.want {
                t.Errorf("Add(%d, %d) == %d, want %d", c.a, c.b, got, c.want)
            }
        })
    }
}` },
      { kind: 'command', text: '$ go test -v' },
      { kind: 'stdout', text: `=== RUN   TestAdd
=== RUN   TestAdd/Adding
=== RUN   TestAdd/Adding#01
    math_test.go:14: Add(2, 2) == 4, want 5
--- FAIL: TestAdd (0.00s)
    --- PASS: TestAdd/Adding (0.00s)
    --- FAIL: TestAdd/Adding#01 (0.00s)
FAIL
exit status 1
FAIL    example.com/math    0.001s` }
    ],
  },
  {
    slug: 'go-test-bench-fuzz',
    title: '54. Benchmarks, examples, fuzzing',
    section: 'Section K: Toolchain & Workflow',
    order: 54,
    runMode: 'terminal',
    body: `
The testing package also supports:

- **Benchmarks**: Functions named \`BenchmarkXxx(b *testing.B)\`. They are executed multiple times to measure performance. Run with \`go test -bench=.\`.
- **Examples**: Functions named \`ExampleXxx()\`. Their standard output is verified against an \`// Output:\` comment. They are also shown in generated documentation.
- **Fuzzing**: Functions named \`FuzzXxx(f *testing.F)\`. Go automatically generates inputs to find edge cases and crashes. Run with \`go test -fuzz=.\`.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go test -bench=.' },
      { kind: 'stdout', text: `goos: darwin
goarch: arm64
pkg: example.com/math
BenchmarkAdd-10         1000000000               0.314 ns/op
PASS
ok      example.com/math        0.654s` },
      { kind: 'command', text: '$ go test -fuzz=FuzzAdd -fuzztime=5s' },
      { kind: 'stdout', text: `fuzz: elapsed: 0s, gathering baseline coverage: 0/10 completed
fuzz: elapsed: 0s, gathering baseline coverage: 10/10 completed, now fuzzing with 10 workers
fuzz: elapsed: 3s, execs: 821394 (273766/sec), new interesting: 0 (total: 10)
fuzz: elapsed: 5s, execs: 1421094 (310234/sec), new interesting: 0 (total: 10)
PASS
ok      example.com/math        5.123s` }
    ],
  },
  {
    slug: 'go-test-race-cover',
    title: '55. Race detector & coverage',
    section: 'Section K: Toolchain & Workflow',
    order: 55,
    runMode: 'terminal',
    body: `
Go includes a built-in **data race detector**. Run your tests or application with the \`-race\` flag to find concurrent accesses to the same memory where at least one access is a write.

You can also measure **test coverage** using \`-cover\`. For detailed analysis, you can generate a cover profile and view it in your browser.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go test -race' },
      { kind: 'stdout', text: `==================
WARNING: DATA RACE
Write at 0x00c0000b2000 by goroutine 7:
  example.com/app.worker()
      /src/app/main.go:12 +0x3c

Previous read at 0x00c0000b2000 by main goroutine:
  example.com/app.main()
      /src/app/main.go:20 +0x48
==================
FAIL    example.com/app 0.012s` },
      { kind: 'command', text: '$ go test -coverprofile=c.out' },
      { kind: 'stdout', text: `PASS
coverage: 87.5% of statements
ok      example.com/math        0.005s` },
      { kind: 'command', text: '$ go tool cover -html=c.out' },
      { kind: 'stdout', text: '(Opens a browser showing lines covered in green and missed in red)' }
    ],
  },
  {
    slug: 'go-fmt',
    title: '56. Formatting (go fmt)',
    section: 'Section K: Toolchain & Workflow',
    order: 56,
    runMode: 'terminal',
    body: `
Go is famous for standardizing code format. \`go fmt\` (or \`gofmt\`) automatically formats your Go source code.

Most developers configure their editors to run \`gofmt\` on save.

Many also use \`goimports\`, a community tool that does everything \`gofmt\` does, but also automatically adds missing imports and removes unused ones.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat messy.go' },
      { kind: 'stdout', text: `package main
func main(){
x:=1
if x==1{println("hi")}
}` },
      { kind: 'command', text: '$ go fmt messy.go' },
      { kind: 'stdout', text: 'messy.go' },
      { kind: 'command', text: '$ cat messy.go' },
      { kind: 'stdout', text: `package main

func main() {
\tx := 1
\tif x == 1 {
\t\tprintln("hi")
\t}
}` }
    ],
  },
  {
    slug: 'go-vet',
    title: '57. Static analysis (go vet)',
    section: 'Section K: Toolchain & Workflow',
    order: 57,
    runMode: 'terminal',
    body: `
\`go vet\` examines Go source code and reports suspicious constructs, such as Printf calls whose arguments do not align with the format string.

It uses heuristics that do not guarantee all reports are genuine problems, but it can find errors not caught by the compiler. It is generally run as a standard part of CI pipelines.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat buggy.go' },
      { kind: 'stdout', text: `package main
import "fmt"
func main() {
    fmt.Printf("Hello %d\\n", "world")
}` },
      { kind: 'command', text: '$ go build buggy.go' },
      { kind: 'stdout', text: '(Compiles successfully!)' },
      { kind: 'command', text: '$ go vet buggy.go' },
      { kind: 'stdout', text: `# command-line-arguments
./buggy.go:4:2: fmt.Printf format %d has arg "world" of wrong type string` }
    ],
  },
  {
    slug: 'go-doc',
    title: '58. Documentation (go doc)',
    section: 'Section K: Toolchain & Workflow',
    order: 58,
    runMode: 'terminal',
    body: `
Go extracts documentation directly from source code comments. A doc comment should immediately precede the declaration it documents, with no blank lines between them.

You can view documentation from the terminal using \`go doc\`.

When you publish open-source Go modules, **pkg.go.dev** automatically parses these comments and serves beautifully rendered documentation for your package.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go doc fmt.Println' },
      { kind: 'stdout', text: `package fmt // import "fmt"

func Println(a ...any) (n int, err error)
    Println formats using the default formats for its operands and writes to
    standard output. Spaces are always added between operands and a newline is
    appended. It returns the number of bytes written and any write error
    encountered.` },
      { kind: 'command', text: '$ go doc -all mypkg' },
      { kind: 'stdout', text: '(Shows documentation for all exported symbols in mypkg)' }
    ],
  }
]
