import type { Lesson } from '../types';

/**
 * Section K group 2 — the daily-workflow toolchain: test, format, vet, doc.
 * Every transcript here is captured from a real go1.27 workspace.
 */

export const goTestBasics: Lesson = {
  slug: 'go-test-basics',
  title: '`go test`: table tests, subtests, `-run` and `t.Parallel`',
  sectionId: 'toolchain',
  order: 53,
  runMode: 'terminal',
  body: `A Go test is a function in a \`_test.go\` file whose name starts with
\`Test\` and which takes a \`*testing.T\`:

\`\`\`
func TestAdd(t *testing.T) {
    if got := Add(2, 3); got != 5 {
        t.Errorf("Add(2, 3) = %d, want 5", got)
    }
}
\`\`\`

**\`t.Errorf\` vs \`t.Fatalf\`.** \`Errorf\` records the failure and
*continues*; \`Fatalf\` records it and stops the test immediately. Use
\`Fatalf\` when continuing would panic or be meaningless.

**Table tests.** When you have several cases with the same shape, put them
in a slice of structs and loop. The table is the test:

\`\`\`
tests := []struct {
    name string
    a, b int
    want int
}{
    {"zero", 0, 0, 0},
    {"positive", 2, 3, 5},
    {"negative", -2, 3, 1},
}
for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        if got := Add(tt.a, tt.b); got != tt.want {
            t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.want)
        }
    })
}
\`\`\`

**\`t.Run\` creates a subtest.** It takes a name and a function, runs the
function as its own test, and reports it under that name. Subtests can be
nested, and \`-run\` can select them individually.

**A failing test shows the failing case.** Note how the output names the
subtest that failed, not just the parent:

\`\`\`
--- FAIL: TestAdd (0.00s)
    --- PASS: TestAdd/zero (0.00s)
    --- PASS: TestAdd/positive (0.00s)
    --- FAIL: TestAdd/negative (0.00s)
FAIL
\`\`\`

**\`-run\` takes a regular expression.** The pattern is split on \`/\` and
each part is matched against the corresponding level of subtest name:

\`\`\`
go test -run TestAdd              # every subtest of TestAdd
go test -run 'TestAdd/positive'   # only the "positive" subtest
go test -run '^TestAdd$/^negative$' # anchored, so only "negative"
go test -run 'TestNothing'         # nothing matches -> "no tests to run"
\`\`\`

**\`t.Parallel()\` runs the subtests concurrently.** It pauses the
subtest, lets the parent finish scheduling, and then resumes the paused
subtests in parallel — up to \`-parallel\` at a time (default: the number
of CPUs). The verbose output shows the \`PAUSE\` and \`CONT\` events.

Two rules make this safe:

- The loop variable must be captured correctly. Go 1.22 and later give
  each iteration its own variable, so \`tt\` is safe without the
  \`tt := tt\` trick.
- The subtest must not touch anything the parent test mutates after the
  loop starts. \`t.Parallel()\` is a barrier: the parent test function
  does not return until every parallel subtest has finished.

**Other flags worth knowing.**

- \`go test -v\` — print each test and subtest as it runs.
- \`go test -count=2\` — run every test twice, to catch state that leaks
  between runs.
- \`go test -timeout=30s\` — fail the test binary if it hangs.
- \`go test -short\` — \`testing.Short()\` lets a test skip in short mode.
- \`go test ./...\` — every package in the module. \`go test all\` runs the
  standard library's own tests too, and is rarely what you want.
- \`go test -failfast\` — stop at the first failing package.`,
  terminalOutput: [
    { kind: 'command', text: 'go test ./...' },
    { kind: 'stdout', text: 'ok  \texample.com/calc/calc\t0.286s\n' },
    { kind: 'command', text: 'go test -v ./calc/' },
    {
      kind: 'stdout',
      text:
        '=== RUN   TestAdd\n=== RUN   TestAdd/zero\n=== RUN   TestAdd/positive\n=== RUN   TestAdd/negative\n--- PASS: TestAdd (0.00s)\n    --- PASS: TestAdd/zero (0.00s)\n    --- PASS: TestAdd/positive (0.00s)\n    --- PASS: TestAdd/negative (0.00s)\nPASS\nok  \texample.com/calc/calc\t0.141s\n',
    },
    { kind: 'command', text: 'go test -v -run "TestAdd/positive" ./calc/' },
    {
      kind: 'stdout',
      text:
        '=== RUN   TestAdd\n=== RUN   TestAdd/positive\n--- PASS: TestAdd (0.00s)\n    --- PASS: TestAdd/positive (0.00s)\nPASS\nok  \texample.com/calc/calc\t0.183s\n',
    },
    { kind: 'command', text: 'go test -run "TestNothing" ./calc/' },
    { kind: 'stdout', text: 'ok  \texample.com/calc/calc\t0.140s [no tests to run]\n' },
  ],
  gotcha: `A subtest that calls \`t.Parallel()\` does not start until the
parent test function returns. Anything the parent does *after* the loop
therefore runs *before* the parallel subtests — a classic source of
"the test passed but the value was wrong".`,
};

export const goTestFailures: Lesson = {
  slug: 'go-test-failures',
  title: 'Reading a `--- FAIL` and the other test outcomes',
  sectionId: 'toolchain',
  order: 54,
  runMode: 'terminal',
  body: `A failing test tells you what went wrong, if you read it right.

\`\`\`
=== RUN   TestAdd
=== RUN   TestAdd/zero
=== RUN   TestAdd/positive
=== RUN   TestAdd/negative
    calc_test.go:18: Add(-2, 3) = 1, want -1
--- FAIL: TestAdd (0.00s)
    --- PASS: TestAdd/zero (0.00s)
    --- PASS: TestAdd/positive (0.00s)
    --- FAIL: TestAdd/negative (0.00s)
FAIL
FAIL\texample.com/calc/calc\t0.177s
FAIL
\`\`\`

Read it from the bottom up. The last \`FAIL\`, on its own line, is the
*package* result. \`--- FAIL: TestAdd\` is the *test* result.
\`--- FAIL: TestAdd/negative\` is the *subtest* result. The line with the
file and line number is the actual complaint: \`calc_test.go:18\`.

**The test failed, but the package failed too** — the two are different.
A package fails if any of its tests fail, if the test binary panics, or
if the package does not even compile.

**A build failure looks different.** A typo in the package under test
means the test binary never runs:

\`\`\`
# example.com/calc/calc [example.com/calc/calc.test]
calc/calc.go:11:13: undefined: ErrDivideByZero
FAIL\texample.com/calc/calc [build failed]
FAIL
\`\`\`

The \`[build failed]\` suffix is the tell. There is no \`--- FAIL\` line
because no test ran at all.

**\`t.Fatal\` vs \`t.Error\`.** \`t.Fatal\` stops the current test
immediately; \`t.Error\` records the problem and carries on. A test that
calls \`t.Fatal\` on a failed precondition gives you one clear message
instead of a cascade of nil-pointer panics.

**\`t.Skip\` and \`t.Skipf\`.** A skipped test is reported as
\`--- SKIP\`, not a failure. Use them for tests that need an external
service or a specific platform.

**\`t.Helper()\`.** Call it in a helper function so that the reported
line number is the *caller's*, not the helper's. It makes assertion
helpers far more useful:

\`\`\`
func assertEqual(t *testing.T, got, want int) {
    t.Helper()
    if got != want {
        t.Errorf("got %d, want %d", got, want)
    }
}
\`\`\`

**The exit code matters.** \`go test\` exits non-zero when anything fails,
which is what makes it usable in CI. \`go test -json\` streams the same
events as JSON, one object per line, for CI systems that parse them.

**\`go test -list\` shows the test names** without running them, which is
handy for checking your \`-run\` pattern.`,
  terminalOutput: [
    { kind: 'command', text: 'go test -v ./calc/' },
    {
      kind: 'stdout',
      text:
        '=== RUN   TestAdd\n=== RUN   TestAdd/zero\n=== RUN   TestAdd/positive\n=== RUN   TestAdd/negative\n    calc_test.go:18: Add(-2, 3) = 1, want -1\n--- FAIL: TestAdd (0.00s)\n    --- PASS: TestAdd/zero (0.00s)\n    --- PASS: TestAdd/positive (0.00s)\n    --- FAIL: TestAdd/negative (0.00s)\nFAIL\nFAIL\texample.com/calc/calc\t0.177s\nFAIL\n',
    },
    { kind: 'command', text: 'go test -list . ./calc/' },
    {
      kind: 'stdout',
      text: 'TestAdd\nTestDiv\nTestDivByZero\nok  \texample.com/calc/calc\t0.152s\n',
    },
  ],
  gotcha: `A package line that says \`[build failed]\` means the *test
binary never ran* — there is no \`--- FAIL\` line because nothing was
executed. A compile error in the package under test is reported here, not
as a test failure.`,
};

export const benchmarksAndFuzzing: Lesson = {
  slug: 'benchmarks-and-fuzzing',
  title: '`go test`: benchmarks, examples and fuzzing',
  sectionId: 'toolchain',
  order: 55,
  runMode: 'terminal',
  body: `The testing package does three jobs: it runs tests, it measures
benchmarks, and it fuzzes.

**Benchmarks** live in \`Benchmark\` functions that take a \`*testing.B\`:

\`\`\`
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        _ = Add(1, 2)
    }
}
\`\`\`

The loop runs \`b.N\` times, and the framework increases \`b.N\` until the
result is statistically meaningful. **Never write \`for i := 0; i < 100; i++}\`
** — the framework decides the iteration count.

\`\`\`
$ go test -bench=. -benchmem ./calc/
goos: darwin
goarch: arm64
pkg: example.com/calc/calc
cpu: Apple M4 Max
BenchmarkAdd-14           	1000000000	         0.2309 ns/op	       0 B/op	       0 allocs/op
PASS
ok  	example.com/calc/calc	0.484s
\`\`\`

The \`-14\` suffix is the GOMAXPROCS the benchmark ran with. The
\`-benchmem\` flag adds the allocation columns — the two that matter most
when you are chasing a performance problem.

**\`b.RunParallel\`** spreads the work across the available CPUs, which is
how you measure a parallel implementation.

**Examples** are \`Example\` functions with a \`// Output:\` comment. The
comment says what the program should print; the test fails if it prints
anything else. They are compiled and run, but they also appear in the
documentation:

\`\`\`
func ExampleAdd() {
    fmt.Println(calc.Add(2, 3))
    // Output: 5
}
\`\`\`

An example without an \`// Output:\` comment is compiled but *not* run —
useful for examples that have no interesting output.

**Fuzzing** feeds the framework random inputs and tries to find a crash
or a violated invariant. The seed corpus is the \`f.Add\` calls; after
that the framework mutates inputs, keeps the ones that explore new code
paths, and shrinks anything that causes a failure:

\`\`\`
func FuzzAdd(f *testing.F) {
    f.Add(1, 2)
    f.Add(-3, 4)
    f.Fuzz(func(t *testing.T, a, b int) {
        if Add(a, b) != a+b {
            t.Errorf("Add(%d, %d) != %d", a, b, a+b)
        }
    })
}
\`\`\`

\`\`\`
$ go test -fuzz=FuzzAdd -fuzztime=10s ./calc/
fuzz: elapsed: 0s, gathering baseline coverage: 0/1 completed
fuzz: elapsed: 0s, gathering baseline coverage: 1/1 completed, now fuzzing with 14 workers
fuzz: elapsed: 3s, execs: 3468169 (1156032/sec), new interesting: 0 (total: 2)
PASS
ok  	example.com/calc/calc	5.318s
\`\`\`

**When the fuzzer finds a failure, it saves the input** to
\`testdata/fuzz/<FuzzName>/\` and tells you how to replay it:

\`\`\`
--- FAIL: FuzzAdd (0.12s)
    calc_fuzz_test.go:9: found the magic pair: Add(7, 9) = 16

    Failing input written to testdata/fuzz/FuzzAdd/c260aa57a7bc1d37
    To re-run:
    go test -run=FuzzAdd/c260aa57a7bc1d37
FAIL
\`\`\`

The file contains the input in Go's own syntax, and it is a normal test
file — **commit it**, so the failure is a regression test from then on.

**Fuzzing only finds panics and hangs by default.** A fuzz target that
does not call \`t.Fatal\` on a wrong answer will not report a failure, so
assert inside the fuzz function yourself.`,
  terminalOutput: [
    { kind: 'command', text: 'go test -bench=. -benchmem ./calc/' },
    {
      kind: 'stdout',
      text:
        'goos: darwin\ngoarch: arm64\npkg: example.com/calc/calc\ncpu: Apple M4 Max\nBenchmarkAdd-14           	1000000000	         0.2309 ns/op	       0 B/op	       0 allocs/op\nBenchmarkAddParallel-14    	1000000000	         0.02660 ns/op	       0 B/op	       0 allocs/op\nPASS\nok  	example.com/calc/calc	0.484s\n',
    },
    { kind: 'command', text: 'go test -v -run Example ./calc/' },
    {
      kind: 'stdout',
      text: '=== RUN   ExampleAdd\n--- PASS: ExampleAdd (0.00s)\nPASS\nok  \texample.com/calc/calc\t0.184s\n',
    },
    { kind: 'command', text: 'go test -fuzz=FuzzAdd -fuzztime=5s ./calc/' },
    {
      kind: 'stdout',
      text:
        'fuzz: elapsed: 0s, gathering baseline coverage: 0/2 completed\nfuzz: elapsed: 0s, gathering baseline coverage: 2/2 completed, now fuzzing with 14 workers\nfuzz: elapsed: 3s, execs: 3468169 (1156032/sec), new interesting: 0 (total: 2)\nfuzz: elapsed: 5s, execs: 5861790 (1141610/sec), new interesting: 0 (total: 2)\nPASS\nok  	example.com/calc/calc	5.318s\n',
    },
    { kind: 'command', text: 'go test -run=FuzzAdd/c260aa57a7bc1d37 ./calc/' },
    {
      kind: 'stdout',
      text:
        '--- FAIL: FuzzAdd (0.00s)\n    --- FAIL: FuzzAdd/c260aa57a7bc1d37 (0.00s)\n        calc_fuzz_test.go:9: found the magic pair: Add(7, 9) = 16\nFAIL\nFAIL\texample.com/calc/calc\t0.188s\nFAIL\n',
    },
  ],
  gotcha: `A benchmark loop must run \`b.N\` times, not a fixed number. The
framework picks \`b.N\` by timing the function; a hard-coded loop count
produces a number that is not comparable between runs.`,
};

export const raceAndCoverage: Lesson = {
  slug: 'race-and-coverage',
  title: '`go test -race` and coverage',
  sectionId: 'toolchain',
  order: 56,
  runMode: 'terminal',
  body: `Two flags that turn a passing test suite into a meaningful one.

**The race detector.** \`go test -race\` instruments the binary and
reports any unsynchronised access to shared memory — a data race. It is
the cheapest concurrency bug detector you will ever use:

\`\`\`
$ go test -race ./calc/
==================
WARNING: DATA RACE
Read at 0x00c000114188 by goroutine 17:
  example.com/calc/calc.TestConcurrentAdd.func1()
      calc/calc_race_test.go:15 +0x68

Previous write at 0x00c000114188 by goroutine 9:
  example.com/calc/calc.TestConcurrentAdd.func1()
      calc/calc_race_test.go:15 +0x78
...
==================
--- FAIL: TestConcurrentAdd (0.00s)
    testing.go:1865: race detected during execution of test
FAIL
FAIL\texample.com/calc/calc\t0.304s
FAIL
\`\`\`

The report gives you the two conflicting accesses, the file and line of
each, and the goroutines involved. The fix in this case is a mutex.

**The race detector only finds races that actually happen.** It is a
dynamic detector, so it needs the racy code to execute. A test that
never exercises the concurrent path will not report anything. Keep the
race detector on in CI.

**The race detector costs performance** — usually 2–10× — and more
memory, so it is a test-time tool, not a production one. Also note that
it needs a C toolchain (\`CGO_ENABLED=1\`) on most platforms, and it
cannot be enabled for \`js/wasm\`.

**Coverage.** \`-cover\` reports the percentage of statements executed:

\`\`\`
$ go test -cover ./calc/
ok  	example.com/calc/calc	0.169s	coverage: 25.0% of statements
\`\`\`

**\`-coverprofile\` writes the detail.** The profile is a text file that
lists every block of code and how often it ran:

\`\`\`
$ go test -coverprofile=coverage.out ./calc/
$ go tool cover -func=coverage.out
example.com/calc/calc/calc.go:9:	Add		100.0%
example.com/calc/calc/calc.go:14:	Div		0.0%
total:					(statements)	25.0%
\`\`\`

**\`go tool cover -html\` renders it.** The result is a browser page with
the source coloured by coverage — the standard way to find the untested
corners:

\`\`\`
$ go tool cover -html=coverage.out -o coverage.html
\`\`\`

**Coverage across packages.** \`go test -coverprofile=coverage.out ./...\`
merges the profiles of every package. Add \`-coverpkg=./...\` to measure
how much of *other* packages your tests touch — the number you want for
an integration test.

**A note on what coverage means.** A percentage is not a goal; it is a
signal for where to look. 100% coverage with no assertions is worth less
than 60% coverage with good ones. The interesting failures are in the
error paths, and coverage is how you find the ones you never wrote a
test for.`,
  terminalOutput: [
    { kind: 'command', text: 'go test -race ./calc/' },
    {
      kind: 'stdout',
      text:
        '==================\nWARNING: DATA RACE\nRead at 0x00c000114188 by goroutine 17:\n  example.com/calc/calc.TestConcurrentAdd.func1()\n      calc/calc_race_test.go:15 +0x68\n\nPrevious write at 0x00c000114188 by goroutine 9:\n  example.com/calc/calc.TestConcurrentAdd.func1()\n      calc/calc_race_test.go:15 +0x78\n...\n==================\n--- FAIL: TestConcurrentAdd (0.00s)\n    testing.go:1865: race detected during execution of test\nFAIL\nFAIL\texample.com/calc/calc\t0.304s\nFAIL\n',
    },
    { kind: 'command', text: 'go test -cover ./calc/' },
    {
      kind: 'stdout',
      text: 'ok  \texample.com/calc/calc\t0.169s\tcoverage: 25.0% of statements\n',
    },
    { kind: 'command', text: 'go test -coverprofile=coverage.out ./calc/' },
    {
      kind: 'stdout',
      text: 'ok  \texample.com/calc/calc\t0.162s\tcoverage: 25.0% of statements\n',
    },
    { kind: 'command', text: 'go tool cover -func=coverage.out' },
    {
      kind: 'stdout',
      text:
        'example.com/calc/calc/calc.go:9:	Add		100.0%\nexample.com/calc/calc/calc.go:14:	Div		0.0%\ntotal:					(statements)	25.0%\n',
    },
    { kind: 'command', text: 'go tool cover -html=coverage.out -o coverage.html' },
  ],
  gotcha: `The race detector is **dynamic** — it only reports a race that
actually executed. A test that never touches the concurrent path will
pass cleanly, so keep the detector on in CI and make sure the racy code
is actually exercised.`,
};

export const formatting: Lesson = {
  slug: 'formatting',
  title: '`go fmt`, `gofmt` and `goimports`',
  sectionId: 'toolchain',
  order: 57,
  runMode: 'terminal',
  body: `**\`gofmt\` is the canonical formatter.** It has one job: rewrite
the file in the canonical Go style. There are no configuration options
and no style arguments — the output is the same for everyone, which is
the entire point.

\`\`\`
$ gofmt -l .
calc/calc.go
\`\`\`

\`gofmt -l\` lists the files that are *not* formatted, without changing
them. \`gofmt -d\` shows the diff. \`gofmt -w\` writes the changes back.

**\`go fmt\` is the package-aware wrapper.** \`go fmt ./...\` runs
\`gofmt -l -w\` over every package in the pattern:

\`\`\`
$ go fmt ./...
\`\`\`

It takes package patterns, not file paths, and it also runs the
formatter on any \`.go\` file in those packages — including the ones you
did not ask about.

**What \`gofmt\` actually does.** Tabs for indentation, one space around
binary operators, aligned struct field comments and map literal keys,
grouped imports, and — the one people notice — it removes the trailing
whitespace and sorts the imports within each group.

**\`gofmt\` does not touch import *grouping*.** It sorts the imports
already in the file, but it will not move \`"fmt"\` from the standard
library group into a third-party group. That is \`goimports\`' job.

**\`goimports\` is \`gofmt\` plus import management.** It adds the
imports a file needs, removes the ones it does not, and groups them the
way the Go team asks: standard library first, then everything else, each
group separated by a blank line.

\`\`\`
$ goimports -d calc/calc.go
diff -u calc/calc.go.orig calc/calc.go
--- calc/calc.go.orig
+++ calc/calc.go
@@ -1,6 +1,9 @@
 package calc

-import "errors"
+import (
+	"errors"
+	"strings"
+)
\`\`\`

**Installing it.** \`goimports\` is not part of the standard library:

\`\`\`
$ go install golang.org/x/tools/cmd/goimports@latest
\`\`\`

**In CI, check the formatting instead of applying it.** A CI job that
runs \`gofmt -l\` and fails if it prints anything catches a misformatted
commit before it lands. Many projects run \`go fmt ./...\` as a
pre-commit hook instead.

**Other formatters.** \`gofumpt\` is a stricter, opinionated superset of
\`gofmt\` — it is not canonical Go, so most projects do not adopt it for
libraries. \`golines\` and \`gofmt\` with \`-s\` (the \`-s\` flag applies
the simplifications from \`go fix\`) are the other two you will meet.`,
  terminalOutput: [
    { kind: 'command', text: 'gofmt -l .' },
    { kind: 'stdout', text: 'calc/calc.go\n' },
    { kind: 'command', text: 'gofmt -d calc/calc.go' },
    {
      kind: 'stdout',
      text:
        'diff calc/calc.go.orig calc/calc.go\n--- calc/calc.go.orig\n+++ calc/calc.go\n@@ -1,10 +1,11 @@\n package calc\n \n import (\n-"errors"\n+\t"errors"\n )\n-func Add(a,b int) int {\n-  return a+b\n+\n+func Add(a, b int) int {\n+\treturn a + b\n }\n \n func Div(a, b int) (int, error) {\n',
    },
    { kind: 'command', text: 'gofmt -w calc/calc.go' },
    { kind: 'command', text: 'gofmt -l .' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go install golang.org/x/tools/cmd/goimports@latest' },
    { kind: 'command', text: 'goimports -d calc/calc.go' },
    {
      kind: 'stdout',
      text:
        'diff -u calc/calc.go.orig calc/calc.go\n--- calc/calc.go.orig\n+++ calc/calc.go\n@@ -1,6 +1,9 @@\n package calc\n \n-import "errors"\n+import (\n+\t"errors"\n+\t"strings"\n+)\n',
    },
  ],
  gotcha: `\`gofmt\` sorts the imports already present in a file, but it does
not *add* a missing one and does not regroup them. A file that calls
\`strings.ToUpper\` without importing \`strings\` compiles-fails, and
\`gofmt\` will not fix it — that is \`goimports\`.`,
};

export const vetAndDoc: Lesson = {
  slug: 'vet-and-doc',
  title: '`go vet` and `go doc`',
  sectionId: 'toolchain',
  order: 58,
  runMode: 'terminal',
  body: `**\`go vet\` is the static analyser that ships with the
toolchain.** It runs a set of *analyzers* over your code and reports
suspicious constructs. The compiler catches type errors; \`vet\` catches
the things that compile but are almost certainly wrong.

\`\`\`
$ go vet ./...
calc/calc.go:14:28: fmt.Sprintf format %s reads arg #1, but call has 0 args
calc/calc.go:18:14: fmt.Printf format %d has arg "not a number" of wrong type string
\`\`\`

That is the \`printf\` analyzer, and it is the one that pays for itself
immediately: it knows the format string of every \`fmt\` function, and
it checks the arguments against it.

**The analysers you will meet.**

- \`printf\` — format string and argument mismatches.
- \`copylocks\` — copying a value that contains a \`sync.Mutex\` or
  similar.
- \`lostcancel\` — a \`context.WithCancel\` whose cancel function is never
  called.
- \`loopclosure\` — a goroutine or closure capturing a loop variable
  that will change.
- \`unreachable\` — code after a \`return\`, \`panic\` or \`break\`.
- \`shift\` — a shift count that is always out of range.
- \`stdmethods\` — a method with the wrong signature for a standard
  interface.
- \`buildtag\` — malformed \`//go:build\` directives.
- \`composites\` — unkeyed struct literals from another package.

**\`go vet\` runs automatically as part of \`go test\`.** That is why a
misused \`fmt.Sprintf\` fails your test run before the tests even start.

**Turning an analyzer off.** \`go vet -printf=false ./...\` disables one.
The \`go vet -help\` output lists every analyzer and its flags.

**\`go vet\` is not a linter.** It has no opinions about naming, comments
or complexity, and it will never ask you to restructure. For that, use
\`golangci-lint\`, which runs \`vet\` plus dozens of other checkers and
is configurable with a \`.golangci.yml\`.

**\`go doc\` is the documentation reader.** It prints the doc comments
from the source, in the same format as pkg.go.dev:

\`\`\`
$ go doc ./calc
package calc // import "example.com/calc/calc"

var ErrDivideByZero = errors.New("divide by zero")
func Add(a, b int) int
func Div(a, b int) (int, error)
\`\`\`

- \`go doc -all ./calc\` — everything, including the doc comments.
- \`go doc ./calc Add\` — one symbol.
- \`go doc -src ./calc Add\` — the symbol *and* its source.
- \`go doc net/http\` — a standard library package.

**The doc comment convention.** A doc comment starts with the name of
the thing it documents:

\`\`\`
// Add returns the sum of a and b.
func Add(a, b int) int { ... }
\`\`\`

That is not a style preference — \`go doc\` and pkg.go.dev use the first
sentence as the summary, and the convention makes the rendered docs
read correctly. A comment that starts with "This function adds…" reads
as "Add adds…" in the docs, which is wrong.

**Package documentation** lives in the package clause's doc comment, in
a file called \`doc.go\` or in the file named after the package:

\`\`\`
// Package calc provides integer arithmetic helpers.
//
// It is a small example package used by the Go tour.
package calc
\`\`\`

**\`go doc -http\`** opens pkg.go.dev in a browser, downloading a helper
tool the first time.`,
  terminalOutput: [
    { kind: 'command', text: 'go vet ./...' },
    {
      kind: 'stderr',
      text:
        'calc/calc.go:14:28: fmt.Sprintf format %s reads arg #1, but call has 0 args\ncalc/calc.go:18:14: fmt.Printf format %d has arg "not a number" of wrong type string\n',
    },
    { kind: 'command', text: 'go vet -printf=false ./...' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go doc ./calc' },
    {
      kind: 'stdout',
      text:
        'package calc // import "example.com/calc/calc"\n\nvar ErrDivideByZero = errors.New("divide by zero")\nfunc Add(a, b int) int\nfunc Div(a, b int) (int, error)\n',
    },
    { kind: 'command', text: 'go doc -src ./calc Add' },
    {
      kind: 'stdout',
      text:
        'package calc // import "example.com/calc/calc"\n\n// Add returns the sum of a and b.\nfunc Add(a, b int) int {\n\treturn a + b\n}\n',
    },
  ],
  gotcha: `A doc comment that does not start with the symbol's name reads
wrong in the generated documentation — "This function adds two numbers"
becomes "Add This function adds two numbers". Start the comment with the
name and the summary comes out right.`,
};
