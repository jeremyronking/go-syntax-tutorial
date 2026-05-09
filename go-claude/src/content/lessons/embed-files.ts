import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'cat assets/welcome.txt' },
  { kind: 'stdout', text: 'hello from disk\n' },
  { kind: 'command', text: 'cat main.go' },
  { kind: 'stdout', text: `package main

import (
	"embed"
	"fmt"
)

//go:embed assets/welcome.txt
var welcome string

//go:embed assets
var fs embed.FS

func main() {
	fmt.Print(welcome)
	entries, _ := fs.ReadDir("assets")
	for _, e := range entries {
		fmt.Println("found:", e.Name())
	}
}
` },
  { kind: 'command', text: 'go run .' },
  { kind: 'stdout', text: 'hello from disk\nfound: welcome.txt\n' },
];

export const embedFiles: Lesson = {
  slug: 'embed-files',
  title: '//go:embed — assets in the binary',
  sectionId: 'packages',
  order: 44,
  runMode: 'terminal',
  body: `\`//go:embed\` is a directive that bakes files into the binary at build time. Embed a single file as \`string\` or \`[]byte\`; embed a directory as \`embed.FS\` (read-only \`io/fs\` interface).

Requires multi-file projects, so it's pre-baked here. The directive must directly precede the variable declaration.`,
  terminalOutput: lines,
};
