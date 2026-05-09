import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'cat main.go' },
  { kind: 'stdout', text: `package main

import "fmt"

var Version = "dev" // overridden at link time

func main() { fmt.Println("myapp", Version) }
` },
  { kind: 'command', text: 'go build -ldflags="-X main.Version=v1.2.3 -s -w" -trimpath -o bin/myapp .' },
  { kind: 'command', text: './bin/myapp' },
  { kind: 'stdout', text: 'myapp v1.2.3\n' },
  { kind: 'command', text: '# -s -w strip the symbol/dwarf tables; -trimpath drops /Users/you absolute paths from the binary.' },
];

export const toolchainLdflags: Lesson = {
  slug: 'toolchain-ldflags',
  title: '-ldflags, -trimpath, build modes',
  sectionId: 'toolchain',
  order: 62,
  runMode: 'terminal',
  body: `\`-ldflags="-X pkg.Var=value"\` rewrites a string variable at link time — the canonical way to stamp version, commit, or build date into a binary without touching the source. \`-s -w\` strip symbol/DWARF data (smaller binary, no \`go tool nm\` insight). \`-trimpath\` removes absolute paths so binaries don't leak your username.

\`-buildmode\` selects archive/c-archive/c-shared/plugin etc. — niche but powerful.`,
  terminalOutput: lines,
};
