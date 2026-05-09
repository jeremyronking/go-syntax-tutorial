import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'cat main.go' },
  { kind: 'stdout', text: `package main

import "fmt"

func main() { fmt.Println("hi") }
` },
  { kind: 'command', text: 'go run .' },
  { kind: 'stdout', text: 'hi\n' },
  { kind: 'command', text: 'go build .' },
  { kind: 'stdout', text: '' },
  { kind: 'command', text: 'ls -lh ./<your-pkg-name>' },
  { kind: 'stdout', text: '-rwxr-xr-x  2.0M  hello\n' },
  { kind: 'command', text: 'go build -o bin/hello .' },
  { kind: 'command', text: './bin/hello' },
  { kind: 'stdout', text: 'hi\n' },
];

export const toolchainBuild: Lesson = {
  slug: 'toolchain-build',
  title: 'go run, go build, -o',
  sectionId: 'toolchain',
  order: 49,
  runMode: 'terminal',
  body: `\`go run .\` compiles to a temporary directory and executes — gone the moment it exits. \`go build .\` produces a binary named after the directory's package. \`-o path\` overrides the output location. Both compile from the **package** in the current directory, hence the trailing \`.\`.`,
  terminalOutput: lines,
};
