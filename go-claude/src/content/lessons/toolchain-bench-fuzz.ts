import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'cat bench_test.go' },
  { kind: 'stdout', text: `package math_test

import "testing"

func BenchmarkSum(b *testing.B) {
	xs := make([]int, 1000)
	for i := range xs { xs[i] = i }
	b.ResetTimer()
	for range b.N {
		var total int
		for _, x := range xs { total += x }
		_ = total
	}
}

func ExampleSum() {
	// Output: 6
}
` },
  { kind: 'command', text: 'go test -bench=. -benchmem ./...' },
  { kind: 'stdout', text: 'goos: linux\ngoarch: amd64\nBenchmarkSum-8         5142186          230.6 ns/op       0 B/op       0 allocs/op\nPASS\nok      example.com/myapp/math   1.502s\n' },
  { kind: 'command', text: 'go test -fuzz=FuzzAdd -fuzztime 5s ./...' },
  { kind: 'stdout', text: 'fuzz: elapsed: 5s, gathering baseline coverage: 0/24 completed\nfuzz: elapsed: 5s, execs: 412330 (82460/sec), new interesting: 7 (total: 31)\nPASS\nok      example.com/myapp/math   5.003s\n' },
];

export const toolchainBenchFuzz: Lesson = {
  slug: 'toolchain-bench-fuzz',
  title: 'go test — benchmarks, examples, fuzz',
  sectionId: 'toolchain',
  order: 54,
  runMode: 'terminal',
  body: `\`BenchmarkXxx(b *testing.B)\` runs \`b.N\` times — the framework picks N. \`-benchmem\` adds allocations per op. \`ExampleXxx\` functions double as documentation; their last comment \`// Output: …\` is verified.

\`go test -fuzz=FuzzXxx\` mutates inputs looking for crashes; \`-fuzztime\` bounds the run.`,
  terminalOutput: lines,
};
