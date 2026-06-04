import type { Lesson } from '../types';

// K5. go test basics
export const toolchainTest: Lesson = {
  slug: 'toolchain-test',
  title: '`go test`: table tests, subtests with `t.Run`, `-run` regex, `t.Parallel`',
  section: 'K',
  order: 53,
  runMode: 'terminal',
  body: `\`go test ./...\` runs every \`*_test.go\` file in the module. Table
tests put cases in a slice and run them with a single test function or
subtests via \`t.Run\`. \`-run\` filters by regex; \`t.Parallel\` lets a test
opt in to running alongside others (call it before any blocking operation).`,
  terminalOutput: [
    { kind: 'command', text: 'cat mathx/mathx.go' },
    { kind: 'stdout', text: 'package mathx' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func Abs(n int) int {' },
    { kind: 'stdout', text: '    if n < 0 { return -n }' },
    { kind: 'stdout', text: '    return n' },
    { kind: 'stdout', text: '}' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'cat mathx/mathx_test.go' },
    { kind: 'stdout', text: 'package mathx' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'import "testing"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func TestAbs(t *testing.T) {' },
    { kind: 'stdout', text: '    cases := []struct{ in, want int }{' },
    { kind: 'stdout', text: '        {-1, 1}, {0, 0}, {1, 1}, {-42, 42},' },
    { kind: 'stdout', text: '    }' },
    { kind: 'stdout', text: '    for _, c := range cases {' },
    { kind: 'stdout', text: '        t.Run(fmt.Sprintf("n=%d", c.in), func(t *testing.T) {' },
    { kind: 'stdout', text: '            if got := Abs(c.in); got != c.want {' },
    { kind: 'stdout', text: '                t.Errorf("Abs(%d)=%d, want %d", c.in, got, c.want)' },
    { kind: 'stdout', text: '            }' },
    { kind: 'stdout', text: '        })' },
    { kind: 'stdout', text: '    }' },
    { kind: 'stdout', text: '}' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go test ./mathx -run TestAbs -v' },
    { kind: 'stdout', text: '=== RUN   TestAbs' },
    { kind: 'stdout', text: '=== RUN   TestAbs/n=-1' },
    { kind: 'stdout', text: '=== RUN   TestAbs/n=0' },
    { kind: 'stdout', text: '=== RUN   TestAbs/n=1' },
    { kind: 'stdout', text: '=== RUN   TestAbs/n=-42' },
    { kind: 'stdout', text: '--- PASS: TestAbs (0.00s)' },
    { kind: 'stdout', text: '    --- PASS: TestAbs/n=-1 (0.00s)' },
    { kind: 'stdout', text: '    --- PASS: TestAbs/n=0 (0.00s)' },
    { kind: 'stdout', text: '    --- PASS: TestAbs/n=1 (0.00s)' },
    { kind: 'stdout', text: '    --- PASS: TestAbs/n=-42 (0.00s)' },
    { kind: 'stdout', text: 'PASS' },
    { kind: 'stdout', text: 'ok      example.com/proj/mathx    0.003s' },
  ],
};

// K6. benchmarks / examples / fuzz
export const toolchainBenchFuzz: Lesson = {
  slug: 'toolchain-bench-fuzz',
  title: '`go test`: benchmarks, examples, fuzzing (`-fuzz`)',
  section: 'K',
  order: 54,
  runMode: 'terminal',
  body: `A **benchmark** has signature \`func BenchmarkXxx(b *testing.B)\` and loops
\`b.N\` times. \`go test -bench .\` runs them. An **example** has signature
\`func ExampleFoo()\` and its \`// Output:\` comment becomes the assertion.
**Fuzz tests** have signature \`func FuzzFoo(f *testing.F)\`; seed the corpus
with \`f.Add(...)\` and call \`go test -fuzz=FuzzFoo\`.`,
  terminalOutput: [
    { kind: 'command', text: 'cat mathx/abs_bench_test.go' },
    { kind: 'stdout', text: 'package mathx' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'import "testing"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func BenchmarkAbs(b *testing.B) {' },
    { kind: 'stdout', text: '    for i := 0; i < b.N; i++ { _ = Abs(-i) }' },
    { kind: 'stdout', text: '}' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go test ./mathx -bench . -benchtime=1x' },
    { kind: 'stdout', text: 'goos: linux' },
    { kind: 'stdout', text: 'goarch: amd64' },
    { kind: 'stdout', text: 'pkg: example.com/proj/mathx' },
    { kind: 'stdout', text: 'BenchmarkAbs-8      1        1.2 ns/op' },
    { kind: 'stdout', text: 'PASS' },
    { kind: 'stdout', text: 'ok      example.com/proj/mathx    0.002s' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: '# Fuzz tests run with -fuzz and never finish by default; Ctrl-C stops them.' },
    { kind: 'stdout', text: '# Seed them, then provide mutators that take (T) and test invariants.' },
  ],
};

// K7. -race / -cover
export const toolchainRaceCover: Lesson = {
  slug: 'toolchain-race-cover',
  title: '`go test -race`, `-cover`, `-coverprofile`, `go tool cover`',
  section: 'K',
  order: 55,
  runMode: 'terminal',
  body: `\`go test -race ./...\` instruments with the race detector; it costs ~2-20×
runtime but catches concurrent reads/writes that the regular build would
miss.

\`-cover\` prints a percentage; \`-coverprofile=cover.out\` writes an HTML-able
profile. \`go tool cover -html=cover.out\` opens a browser view that
highlights uncovered lines in red.`,
  terminalOutput: [
    { kind: 'command', text: 'go test ./mathx -cover' },
    { kind: 'stdout', text: 'ok      example.com/proj/mathx    0.003s  coverage: 100.0% of statements' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go test ./mathx -coverprofile=cover.out' },
    { kind: 'stdout', text: 'ok      example.com/proj/mathx    0.003s  coverage: 100.0% of statements' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go tool cover -func=cover.out | tail -5' },
    { kind: 'stdout', text: 'mathx/mathx.go:4:  Abs     100.0%' },
    { kind: 'stdout', text: 'total:                  (statements)    100.0%' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: '# go test -race ./... is the same invocation with a different flag.' },
  ],
};

// K8. fmt / gofmt / goimports
export const toolchainFmt: Lesson = {
  slug: 'toolchain-fmt',
  title: '`go fmt` / `gofmt` / `goimports`',
  section: 'K',
  order: 56,
  runMode: 'terminal',
  body: `\`gofmt\` is the canonical formatter that ships with Go; \`go fmt ./...\`
is a thin wrapper that runs it. \`goimports\` (from golang.org/x/tools) is
\`gofmt\` plus import sorting and grouping. Both write to stdout by default;
add \`-w\` to overwrite in place. Configure your editor to run one of them on
save.`,
  terminalOutput: [
    { kind: 'command', text: 'gofmt -d ./mathx' },
    { kind: 'stdout', text: '# (no diff output if already formatted)' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'gofmt -l ./mathx' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go fmt ./...' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: '# goimports -w .  # installs with: go install golang.org/x/tools/cmd/goimports@latest' },
  ],
};

// K9. go vet
export const toolchainVet: Lesson = {
  slug: 'toolchain-vet',
  title: '`go vet` and common analyzers',
  section: 'K',
  order: 57,
  runMode: 'terminal',
  body: `\`go vet ./...\` runs the standard analyzers — common mistakes the
compiler can't catch (printf format mismatches, lock copies, unreachable
cases, \`time.Sleep\` in test helpers, etc.). \`staticcheck\` is a popular
third-party superset.

CI should run \`go vet\` as a minimum. Many projects also wire it into a
pre-commit hook.`,
  terminalOutput: [
    { kind: 'command', text: 'go vet ./...' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go install honnef.co/go/tools/cmd/staticcheck@latest' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'staticcheck ./...' },
    { kind: 'stdout', text: '' },
  ],
};

// K10. go doc
export const toolchainDoc: Lesson = {
  slug: 'toolchain-doc',
  title: '`go doc` and pkg.go.dev conventions',
  section: 'K',
  order: 58,
  runMode: 'terminal',
  body: `\`go doc fmt.Println\` prints the doc comment for a symbol, scanning the
module's source. A doc comment begins with the symbol name and is a complete
sentence. \`go doc -all ./...\` dumps everything in the module. Push the module
to a public host and pkg.go.dev will render the same doc comments as a
website.`,
  terminalOutput: [
    { kind: 'command', text: 'go doc fmt.Println' },
    { kind: 'stdout', text: 'package fmt // import "fmt"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func Println(a ...any) (n int, err error)' },
    { kind: 'stdout', text: '    Println formats using the default formats for its operands and writes' },
    { kind: 'stdout', text: '    to standard output. Spaces are always added between operands and a' },
    { kind: 'stdout', text: '    newline is appended. It returns the number of bytes written and any' },
    { kind: 'stdout', text: '    write error encountered.' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go doc -all ./mathx | head -20' },
    { kind: 'stdout', text: 'package mathx // import "example.com/proj/mathx"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func Abs(n int) int' },
  ],
};
