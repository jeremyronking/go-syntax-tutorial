import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'go doc fmt.Sprintf' },
  { kind: 'stdout', text: 'package fmt // import "fmt"\n\nfunc Sprintf(format string, a ...any) string\n    Sprintf formats according to a format specifier and returns the resulting string.\n' },
  { kind: 'command', text: 'go doc -all ./billing | head -20' },
  { kind: 'stdout', text: 'package billing // import "example.com/myapp/billing"\n\nFUNCTIONS\n\nfunc NewInvoice(...) *Invoice\n    NewInvoice creates an Invoice with the given line items.\n\nTYPES\n\ntype Invoice struct{ ... }\n' },
];

export const toolchainDoc: Lesson = {
  slug: 'toolchain-doc',
  title: 'go doc & pkg.go.dev conventions',
  sectionId: 'toolchain',
  order: 58,
  runMode: 'terminal',
  body: `\`go doc symbol\` prints the docs for any exported identifier. \`go doc -all ./pkg\` dumps everything in a package.

The convention: documentation comments **start with the identifier name**, in complete sentences. \`pkg.go.dev\` renders this directly. Doc comments belong to the next exported declaration; package docs go immediately above the \`package\` clause in any file (typically \`doc.go\`).`,
  terminalOutput: lines,
};
