import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'go fmt ./...' },
  { kind: 'stdout', text: 'main.go\nbilling/invoice.go\n' },
  { kind: 'command', text: 'gofmt -d main.go    # show what would change as a diff' },
  { kind: 'stdout', text: '' },
  { kind: 'command', text: 'goimports -w main.go    # also fixes imports' },
  { kind: 'stdout', text: '' },
];

export const toolchainFmt: Lesson = {
  slug: 'toolchain-fmt',
  title: 'go fmt, gofmt, goimports',
  sectionId: 'toolchain',
  order: 56,
  runMode: 'terminal',
  body: `Go has one official formatter; nobody argues about style. \`go fmt ./...\` formats every file in your module. \`gofmt -d\` shows the diff without writing.

\`goimports\` (third-party but standard) goes a step further: it adds and removes imports as you edit. Most editors run it on save.`,
  terminalOutput: lines,
};
