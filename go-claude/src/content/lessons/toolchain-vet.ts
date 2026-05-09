import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'go vet ./...' },
  { kind: 'stdout', text: '# example.com/myapp/log\n./log.go:14: Printf format %d has arg name of wrong type string\n' },
  { kind: 'command', text: 'go vet -vettool=$(which shadow) ./...' },
  { kind: 'stdout', text: '# example.com/myapp/parse\n./parse.go:21: declaration of "err" shadows declaration at ./parse.go:18\n' },
];

export const toolchainVet: Lesson = {
  slug: 'toolchain-vet',
  title: 'go vet — static analysis baked in',
  sectionId: 'toolchain',
  order: 57,
  runMode: 'terminal',
  body: `\`go vet\` runs a curated set of static analyses bundled with the toolchain — printf format mismatches, suspicious assignments, struct field tags, unreachable code, copy-locking errors. It's run by \`go test\` automatically; running it standalone catches issues without requiring tests.

\`-vettool=<binary>\` plugs in additional analyzers (shadow detection, nilness checks, etc.).`,
  terminalOutput: lines,
};
