import type { Lesson } from '../types';

const goTestBasics: Lesson = {
  slug: 'go-test-basics',
  title: 'go test: tables, subtests, -run, t.Parallel',
  sectionId: 'toolchain',
  order: 53,
  runMode: 'terminal',
  body: `Tests live in \`_test.go\` files next to the package and run with \`go test ./...\`. A table test loops over cases; \`t.Run("name", func(t *testing.T){...})\` turns each into a named subtest you can select with \`-run TestAdd/positive\`.

\`t.Parallel()\` lets subtests run concurrently — call it at the top of the subtest body, and be sure the loop variable is per-iteration (it is, since Go 1.22). \`t.Fatalf\` stops the current test; \`t.Errorf\` records and continues.`,
  terminalOutput: [
    { kind: 'command', text: 'go test ./...' },
    { kind: 'stdout', text: 'ok  \texample.com/k2/calc\t0.200s' },
    { kind: 'command', text: 'go test -run TestAdd/positive -v ./calc' },
    { kind: 'stdout', text: '=== RUN   TestAdd' },
    { kind: 'stdout', text: '=== RUN   TestAdd/positive' },
    { kind: 'stdout', text: '=== PAUSE TestAdd/positive' },
    { kind: 'stdout', text: '=== CONT  TestAdd/positive' },
    { kind: 'stdout', text: '--- PASS: TestAdd (0.00s)' },
    { kind: 'stdout', text: '    --- PASS: TestAdd/positive (0.00s)' },
    { kind: 'stdout', text: 'PASS' },
    { kind: 'stdout', text: 'ok  \texample.com/k2/calc\t0.259s' },
    { kind: 'command', text: 'go test -run TestBroken -v ./calc' },
    { kind: 'stdout', text: '=== RUN   TestBroken' },
    { kind: 'stderr', text: '    broken_test.go:7: Add(1,1) = 2, want 3' },
    { kind: 'stderr', text: '--- FAIL: TestBroken (0.00s)' },
    { kind: 'stderr', text: 'FAIL' },
    { kind: 'stderr', text: 'FAIL\texample.com/k2/calc\t0.212s' },
    { kind: 'stderr', text: 'FAIL' },
  ],
  gotcha:
    '`t.Parallel` inside a table loop shares the loop variable unless the variable is per-iteration. Before Go 1.22 that required `tc := tc`; now it does not, but vendored older toolchains still bite.',
};

const goTestBenchFuzz: Lesson = {
  slug: 'go-test-bench-fuzz',
  title: 'Benchmarks, examples, fuzzing',
  sectionId: 'toolchain',
  order: 54,
  runMode: 'terminal',
  body: `A benchmark is a test with \`*testing.B\`; the framework calls the body repeatedly until timing is stable, so the measured work belongs inside the loop. \`-benchmem\` adds allocations per operation — usually the more actionable number.

An \`Example\` function is executable documentation: its \`// Output:\` comment is asserted by \`go test\`. \`FuzzXxx\` runs seeded inputs with \`go test\`, and explores new inputs under \`-fuzz\`, saving any crasher to \`testdata/fuzz\`.`,
  terminalOutput: [
    { kind: 'command', text: 'go test -bench . -benchmem ./calc' },
    { kind: 'stdout', text: 'goos: darwin' },
    { kind: 'stdout', text: 'goarch: arm64' },
    { kind: 'stdout', text: 'pkg: example.com/k2/calc' },
    { kind: 'stdout', text: 'cpu: Apple M4 Max' },
    { kind: 'stdout', text: 'BenchmarkAdd-14   1000000000   0.2296 ns/op   0 B/op   0 allocs/op' },
    { kind: 'stdout', text: 'PASS' },
    { kind: 'stdout', text: 'ok  \texample.com/k2/calc\t0.457s' },
    { kind: 'command', text: 'go test -run Example -v ./calc' },
    { kind: 'stdout', text: '=== RUN   ExampleAdd' },
    { kind: 'stdout', text: '--- PASS: ExampleAdd (0.00s)' },
    { kind: 'stdout', text: 'PASS' },
    { kind: 'command', text: 'go test -fuzz FuzzAdd -fuzztime 3s ./calc' },
    { kind: 'stdout', text: 'fuzz: elapsed: 0s, gathering baseline coverage: 1/1 completed, now fuzzing with 14 workers' },
    { kind: 'stdout', text: 'fuzz: elapsed: 3s, execs: 3053426 (1017704/sec), new interesting: 0 (total: 1)' },
    { kind: 'stdout', text: 'PASS' },
    { kind: 'stdout', text: 'ok  \texample.com/k2/calc\t3.346s' },
  ],
  gotcha:
    'A benchmark that does not use `b.N` measures nothing useful. Put the operation inside `for i := 0; i < b.N; i++ {}` or call `b.ResetTimer()` around setup.',
};

const goTestRaceCoverage: Lesson = {
  slug: 'go-test-race-coverage',
  title: 'go test -race, coverage, go tool cover',
  sectionId: 'toolchain',
  order: 55,
  runMode: 'terminal',
  body: `\`-race\` instruments memory accesses and reports data races at runtime; it is slower, so run it in CI rather than on every save. A race report names the two conflicting accesses and the goroutines involved — read it before trying to "fix" it with a sleep.

\`-cover\` reports statement coverage; \`-coverprofile\` writes the profile that \`go tool cover\` reads. \`-func\` prints per-function percentages, \`-html\` opens an annotated source view. Coverage tells you what ran, not what is correct.`,
  terminalOutput: [
    { kind: 'command', text: 'go test -race ./...' },
    { kind: 'stdout', text: 'ok  \texample.com/k2/calc\t1.238s' },
    { kind: 'command', text: 'go test -cover ./...' },
    { kind: 'stdout', text: 'ok  \texample.com/k2/calc\t0.201s\tcoverage: 75.0% of statements' },
    { kind: 'command', text: 'go test -coverprofile=cover.out ./...' },
    { kind: 'stdout', text: 'ok  \texample.com/k2/calc\t0.199s\tcoverage: 75.0% of statements' },
    { kind: 'command', text: 'go tool cover -func=cover.out' },
    { kind: 'stdout', text: 'example.com/k2/calc/calc.go:7:\tAdd\t\t100.0%' },
    { kind: 'stdout', text: 'example.com/k2/calc/calc.go:10:\tDiv\t\t66.7%' },
    { kind: 'stdout', text: 'total:\t\t\t(statements)\t75.0%' },
  ],
  gotcha:
    '`-race` needs cgo or the race runtime build; `CGO_ENABLED=0` disables it. A race that only appears under load usually means the test needs more concurrency, not fewer runs.',
};

const gofmtGoimports: Lesson = {
  slug: 'gofmt-goimports',
  title: 'gofmt and goimports',
  sectionId: 'toolchain',
  order: 56,
  runMode: 'terminal',
  body: `\`gofmt\` is the canonical formatter: tabs, alignment, brace placement, and nothing configurable. \`gofmt -l .\` lists files that differ; \`gofmt -w .\` rewrites them. Editors run it on save, and CI should check it, because formatting diffs are noise.

\`goimports\` does everything gofmt does and also adds missing imports and removes unused ones — with a blank line between stdlib and third-party groups. It is the tool most editors actually call.`,
  terminalOutput: [
    { kind: 'command', text: 'gofmt -l .' },
    { kind: 'stdout', text: 'messy/messy.go' },
    { kind: 'command', text: 'gofmt -w .' },
    { kind: 'command', text: 'gofmt -l .' },
    { kind: 'command', text: 'cat messy/messy.go' },
    { kind: 'stdout', text: 'package messy' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func Add(a, b int) int { return a + b }' },
    { kind: 'command', text: 'goimports -l .' },
    { kind: 'stdout', text: 'messy/imports.go' },
    { kind: 'command', text: 'goimports -w .' },
    { kind: 'command', text: 'goimports -l .' },
  ],
  gotcha:
    '`gofmt -l` exits 0 whether or not files are listed. A CI check needs `test -z "$(gofmt -l .)"` or an equivalent, not just the command exit code.',
};

const goVet: Lesson = {
  slug: 'go-vet',
  title: 'go vet and common analyzers',
  sectionId: 'toolchain',
  order: 57,
  runMode: 'terminal',
  body: `\`go vet\` runs a suite of analyzers for suspicious constructs the compiler accepts: printf verbs that disagree with arguments, unreachable code, lost cancel functions, struct tag mistakes, and copylocks among them. It is fast, static, and has very few false positives.

Vet runs automatically in \`go test\`, which is why a test command can fail with a vet error before any test runs. Run it directly in CI to fail earlier and get a clean report.`,
  terminalOutput: [
    { kind: 'command', text: 'go vet ./...' },
    { kind: 'stderr', text: 'vet.go:6:14: fmt.Printf format %d has arg "many" of wrong type string' },
  ],
  gotcha:
    '`go vet` is not a linter suite. For style, dead code, and complexity you need staticcheck or golangci-lint; vet deliberately stays high-signal.',
};

const goDoc: Lesson = {
  slug: 'go-doc',
  title: 'go doc and pkg.go.dev conventions',
  sectionId: 'toolchain',
  order: 58,
  runMode: 'terminal',
  body: `\`go doc\` renders documentation from source: package comments, exported declarations, and doc comments directly above them. \`go doc fmt.Println\` works for the standard library; \`go doc example.com/k2/calc.Add\` works for your module.

pkg.go.dev renders the same comments, so the doc comment is the API's first impression. Start it with the identifier's name ("Add returns..."), keep it one paragraph, and put usage notes below. Every exported identifier deserves one.`,
  terminalOutput: [
    { kind: 'command', text: 'go doc example.com/k2/calc.Add' },
    { kind: 'stdout', text: 'package calc // import "example.com/k2/calc"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func Add(a, b int) int' },
    { kind: 'stdout', text: '    Add returns a + b.' },
    { kind: 'command', text: 'go doc example.com/k2/calc' },
    { kind: 'stdout', text: 'package calc // import "example.com/k2/calc"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'Package calc does tiny integer arithmetic for the GoTour toolchain lesson.' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func Add(a, b int) int' },
    { kind: 'stdout', text: 'func Div(a, b int) (int, error)' },
    { kind: 'command', text: 'go doc fmt.Println' },
    { kind: 'stdout', text: 'package fmt // import "fmt"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func Println(a ...any) (n int, err error)' },
    { kind: 'stdout', text: '    Println formats using the default formats for its operands and writes to' },
    { kind: 'stdout', text: '    standard output. Spaces are always added between operands and a newline' },
    { kind: 'stdout', text: '    is appended. It returns the number of bytes written and any write error' },
    { kind: 'stdout', text: '    encountered.' },
  ],
  gotcha:
    'A doc comment separated from its declaration by a blank line is not a doc comment — `go doc` ignores it and pkg.go.dev shows nothing.',
};

export const sectionK2Lessons: Lesson[] = [
  goTestBasics,
  goTestBenchFuzz,
  goTestRaceCoverage,
  gofmtGoimports,
  goVet,
  goDoc,
];
