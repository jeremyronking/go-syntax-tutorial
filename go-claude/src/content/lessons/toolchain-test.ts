import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'cat math_test.go' },
  { kind: 'stdout', text: `package math_test

import "testing"

func TestAdd(t *testing.T) {
	cases := []struct {
		name    string
		a, b    int
		want    int
	}{
		{"both zero", 0, 0, 0},
		{"positive", 1, 2, 3},
		{"negative", -1, 1, 0},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			if got := tc.a + tc.b; got != tc.want {
				t.Errorf("Add(%d,%d) = %d; want %d", tc.a, tc.b, got, tc.want)
			}
		})
	}
}
` },
  { kind: 'command', text: 'go test ./...' },
  { kind: 'stdout', text: 'ok      example.com/myapp/math   0.123s\n' },
  { kind: 'command', text: 'go test -run TestAdd/positive -v ./...' },
  { kind: 'stdout', text: '=== RUN   TestAdd\n=== RUN   TestAdd/positive\n=== PAUSE TestAdd/positive\n--- PASS: TestAdd (0.00s)\n    --- PASS: TestAdd/positive (0.00s)\nPASS\n' },
];

export const toolchainTest: Lesson = {
  slug: 'toolchain-test',
  title: 'go test — table tests, subtests, t.Parallel',
  sectionId: 'toolchain',
  order: 53,
  runMode: 'terminal',
  body: `Tests live in \`*_test.go\` files. Functions named \`TestXxx(t *testing.T)\` are picked up automatically. The idiomatic structure is **table tests**: a slice of structs, then \`t.Run(tc.name, …)\` for subtests. \`t.Parallel()\` lets independent subtests interleave.

\`-run pattern\` filters by name. The pattern matches each component of \`Test/sub/sub2\` independently.`,
  terminalOutput: lines,
};
