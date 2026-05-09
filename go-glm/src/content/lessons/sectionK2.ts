import type { Lesson } from "../types";

export const sectionK2: Lesson[] = [
  {
    slug: "go-test-table",
    title: "go test: table tests, subtests, -run, t.Parallel",
    section: "K2",
    order: 54,
    body: `Table-driven tests are the Go idiom for testing multiple cases:

- Define a struct slice with input/output pairs.
- Loop over them with \`t.Run\` for named subtests.
- Use \`go test -run\` with a regex to filter.
- Add \`t.Parallel()\` inside \`t.Run\` for parallel execution.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat sum_test.go"},{"kind":"stdout","text":"package main\n\nimport \"testing\"\n\nfunc TestSum(t *testing.T) {\n    tests := []struct {\n        name string\n        a, b, want int\n    }{\n        {\"positive\", 2, 3, 5},\n        {\"zero\", 0, 0, 0},\n        {\"negative\", -1, 1, 0},\n    }\n    for _, tt := range tests {\n        t.Run(tt.name, func(t *testing.T) {\n            if got := Sum(tt.a, tt.b); got != tt.want {\n                t.Errorf(\"Sum(%d, %d) = %d, want %d\", tt.a, tt.b, got, tt.want)\n            }\n        })\n    }\n}"},{"kind":"command","text":"go test -v"},{"kind":"stdout","text":"=== RUN   TestSum\n=== RUN   TestSum/positive\n=== RUN   TestSum/zero\n=== RUN   TestSum/negative\n--- PASS: TestSum (0.00s)\n    --- PASS: TestSum/positive (0.00s)\n    --- PASS: TestSum/zero (0.00s)\n    --- PASS: TestSum/negative (0.00s)\nPASS"},{"kind":"command","text":"go test -run TestSum/positive"},{"kind":"stdout","text":"=== RUN   TestSum/positive\n--- PASS: TestSum/positive (0.00s)\nPASS"}],
  },
  {
    slug: "go-test-bench",
    title: "go test: benchmarks, examples, fuzzing",
    section: "K2",
    order: 55,
    body: `- \`BenchmarkXxx(b *testing.B)\` — run with \`go test -bench=.\`
- \`ExampleXxx()\` — verified by \`// Output:\` comments.
- \`FuzzXxx(f *testing.F)\` — fuzz testing (Go 1.18+).
- \`go test -fuzz=FuzzName\` runs fuzzing continuously.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat sum_test.go"},{"kind":"stdout","text":"package main\n\nimport \"testing\"\n\nfunc BenchmarkSum(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        Sum(1, 2)\n    }\n}\n\nfunc ExampleSum() {\n    fmt.Println(Sum(1, 2))\n    // Output: 3\n}"},{"kind":"command","text":"go test -bench=. -benchmem"},{"kind":"stdout","text":"BenchmarkSum-8    1000000000    0.256 ns/op    0 B/op    0 allocs/op\nPASS"},{"kind":"command","text":"# Fuzzing (Go 1.18+)"},{"kind":"command","text":"cat fuzz_test.go"},{"kind":"stdout","text":"func FuzzSum(f *testing.F) {\n    f.Add(1, 2)\n    f.Fuzz(func(t *testing.T, a, b int) {\n        result := Sum(a, b)\n        if result != a+b {\n            t.Errorf(\"Sum(%d, %d) = %d\", a, b, result)\n        }\n    })\n}"},{"kind":"command","text":"go test -fuzz=FuzzSum"},{"kind":"stdout","text":"fuzz: elapsed: 0s, gathering baseline: 0"}],
  },
  {
    slug: "go-test-race-cover",
    title: "go test -race, -cover, -coverprofile",
    section: "K2",
    order: 56,
    body: `- \`go test -race\` enables the race detector — essential for concurrent code.
- \`go test -cover\` prints coverage percentage.
- \`go test -coverprofile=cover.out\` saves coverage data.
- \`go tool cover -html=cover.out\` generates an HTML report showing covered/uncovered lines.
- Aim for >80% coverage, but 100% is not always worth the effort.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"go test -race ./..."},{"kind":"stdout","text":"PASS\nok  example.com/myapp  0.234s"},{"kind":"command","text":"# -race detects data races at runtime"},{"kind":"command","text":"go test -cover ./..."},{"kind":"stdout","text":"PASS\ncoverage: 87.5% of statements\nok  example.com/myapp  0.123s"},{"kind":"command","text":"go test -coverprofile=coverage.out ./..."},{"kind":"stdout","text":"PASS\ncoverage: 87.5% of statements"},{"kind":"command","text":"go tool cover -html=coverage.out -o coverage.html"},{"kind":"stdout","text":"# Opens HTML coverage report in browser"}],
  },
  {
    slug: "go-fmt",
    title: "go fmt / gofmt / goimports",
    section: "K2",
    order: 57,
    body: `- \`gofmt\` (or \`go fmt\`) is the canonical Go formatter — no configuration needed.
- \`gofmt -w file.go\` writes changes in place.
- \`goimports\` (separate install) also manages imports: adds missing, removes unused.
- Every Go project should run \`gofmt\` (or \`goimports\`) before committing.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat main.go"},{"kind":"stdout","text":"package main\nimport \"fmt\"\nfunc main(){\nfmt.Println(\"hello\")\n}"},{"kind":"command","text":"gofmt -w main.go"},{"kind":"command","text":"cat main.go"},{"kind":"stdout","text":"package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"hello\")\n}"},{"kind":"command","text":"# gofmt is the canonical formatter; go fmt is a wrapper"},{"kind":"command","text":"# goimports also manages imports (requires separate install)"},{"kind":"command","text":"goimports -w main.go"},{"kind":"stdout","text":"# Adds missing imports, removes unused ones"}],
  },
  {
    slug: "go-vet",
    title: "go vet and common analyzers",
    section: "K2",
    order: 58,
    body: `\`go vet\` examines Go source code and reports suspicious constructs.

- Catches common mistakes before they become bugs.
- Run as part of CI — \`go vet ./...\` should pass cleanly.
- Covers: format string mismatches, unreachable code, bad lock usage, unused results, and more.
- \`go vet\` is conservative — if it complains, it's almost always worth fixing.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat main.go"},{"kind":"stdout","text":"package main\n\nimport \"fmt\"\n\nfunc main() {\n    result := fmt.Sprintf(\"%d\", \"hello\")\n    fmt.Println(result)\n}"},{"kind":"command","text":"go vet ./..."},{"kind":"stderr","text":"main.go:6: fmt.Sprintf format %d has arg of wrong type string"},{"kind":"command","text":"# go vet catches common mistakes:"},{"kind":"stdout","text":"# - Printf format mismatches\n# - Unreachable code\n# - Unused variables\n# - Wrong lock copy\n# - etc."}],
  },
  {
    slug: "go-doc",
    title: "go doc and pkg.go.dev conventions",
    section: "K2",
    order: 59,
    body: `- \`go doc\` prints documentation from source code.
- \`go doc -all\` prints everything in a package.
- \`pkg.go.dev\` hosts docs for all public Go packages.
- Good doc comments start with the name being documented: \`// Sum adds two integers...\`.
- Write doc comments for all exported names.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"go doc fmt.Println"},{"kind":"stdout","text":"package fmt // import \"fmt\"\n\nfunc Println(a ...interface{}) (n int, err error)\n    Println formats using the default formats for its operands and writes\n    to standard output. Spaces are always added between operands and a\n    newline is appended. It returns the number of bytes written and any\n    write error encountered."},{"kind":"command","text":"go doc -all fmt"},{"kind":"stdout","text":"# Prints all declarations in the fmt package"},{"kind":"command","text":"# pkg.go.dev hosts Go documentation"},{"kind":"command","text":"# Write doc comments as full sentences, starting with the named item:"},{"kind":"stdout","text":"# // Sum adds two integers and returns the result.\n# func Sum(a, b int) int { ... }"}],
  }
];
