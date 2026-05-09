import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'go test -race ./...' },
  { kind: 'stdout', text: '==================\nWARNING: DATA RACE\nWrite at 0x00c0000a4008 by goroutine 7:\n  example.com/myapp.(*Counter).Inc()\n      counter.go:11 +0x44\n\nPrevious read at 0x00c0000a4008 by goroutine 6:\n  example.com/myapp.(*Counter).Get()\n      counter.go:7 +0x33\n\nGoroutine 7 (running) created at:\n  example.com/myapp_test.TestRace.func1()\n      counter_test.go:18 +0x6c\n==================\nFAIL    example.com/myapp\n' },
  { kind: 'command', text: 'go test -cover ./...' },
  { kind: 'stdout', text: 'ok      example.com/myapp/math   0.122s   coverage: 87.5% of statements\n' },
  { kind: 'command', text: 'go test -coverprofile=cover.out ./...' },
  { kind: 'command', text: 'go tool cover -func=cover.out' },
  { kind: 'stdout', text: 'example.com/myapp/math/add.go:3:    Add        100.0%\nexample.com/myapp/math/sub.go:3:    Sub         50.0%\ntotal:                              (statements)         87.5%\n' },
];

export const toolchainRaceCover: Lesson = {
  slug: 'toolchain-race-cover',
  title: 'go test -race, -cover',
  sectionId: 'toolchain',
  order: 55,
  runMode: 'terminal',
  body: `\`-race\` instruments the binary with the race detector — slower at runtime but catches data races your tests exercise. Run \`-race\` in CI on at least one job.

\`-cover\` prints summary coverage; \`-coverprofile=cover.out\` writes per-line data. \`go tool cover -func=cover.out\` summarizes by function; \`-html=cover.out\` opens a browser view.`,
  terminalOutput: lines,
};
