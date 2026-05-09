import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'tree -L 3' },
  { kind: 'stdout', text: `myapp/
├── go.mod              # module example.com/myapp
├── main.go             # package main
├── billing/
│   └── invoice.go      # package billing
└── internal/
    └── secrets/
        └── secrets.go  # package secrets, package-private to myapp/...
` },
  { kind: 'command', text: 'cat go.mod' },
  { kind: 'stdout', text: `module example.com/myapp

go 1.23
` },
  { kind: 'command', text: 'cat main.go' },
  { kind: 'stdout', text: `package main

import (
	"example.com/myapp/billing"
	"example.com/myapp/internal/secrets" // OK, same module
)

func main() {
	billing.NewInvoice()
	secrets.Load()
}
` },
  { kind: 'command', text: 'go build ./...' },
  { kind: 'stdout', text: 'ok\n' },
  { kind: 'stderr', text: '' },
  { kind: 'command', text: '# In an external module:' },
  { kind: 'command', text: 'go build other.com/foo' },
  { kind: 'stderr', text: 'use of internal package example.com/myapp/internal/secrets not allowed\n' },
];

export const internalModules: Lesson = {
  slug: 'internal-modules',
  title: 'Module path & internal/ visibility',
  sectionId: 'packages',
  order: 43,
  runMode: 'terminal',
  body: `Your \`go.mod\`'s \`module\` line is the import prefix for everything in the repo. Subdirectories named \`internal/\` are visible only within the same module — try to import \`example.com/foo/internal/x\` from \`other.com/bar\` and the compiler refuses.

This shows real project layout. The Playground is single-file, so this lesson is pre-baked terminal output.`,
  terminalOutput: lines,
};
