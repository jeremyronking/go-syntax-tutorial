import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'go env GOBIN' },
  { kind: 'stdout', text: '/Users/you/go/bin\n' },
  { kind: 'command', text: 'go install golang.org/x/tools/cmd/godoc@latest' },
  { kind: 'stdout', text: '' },
  { kind: 'command', text: 'ls $(go env GOBIN)' },
  { kind: 'stdout', text: 'godoc\n' },
  { kind: 'command', text: 'go install ./cmd/myapp' },
  { kind: 'stdout', text: '' },
  { kind: 'command', text: 'myapp --version' },
  { kind: 'stdout', text: 'myapp v0.1.0\n' },
];

export const toolchainInstall: Lesson = {
  slug: 'toolchain-install',
  title: 'go install & GOBIN',
  sectionId: 'toolchain',
  order: 50,
  runMode: 'terminal',
  body: `\`go install path@version\` builds and drops a binary into \`$GOBIN\` (defaults to \`$GOPATH/bin\`). For your own packages, \`go install ./cmd/foo\` works too. This is how you get tools onto your \`$PATH\` without managing a separate package manager.

\`@latest\` is convenient for trying tools; pin to a tag (\`@v0.7.0\`) for anything you depend on long-term.`,
  terminalOutput: lines,
};
