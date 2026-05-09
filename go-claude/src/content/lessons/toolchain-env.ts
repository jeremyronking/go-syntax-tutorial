import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'go env GOOS GOARCH GOMODCACHE GOPROXY' },
  { kind: 'stdout', text: 'darwin\narm64\n/Users/you/go/pkg/mod\nhttps://proxy.golang.org,direct\n' },
  { kind: 'command', text: 'go env -w GOPRIVATE=github.com/yourcorp/*' },
  { kind: 'stdout', text: '' },
  { kind: 'command', text: 'GOFLAGS=-mod=mod go build .   # one-shot override' },
];

export const toolchainEnv: Lesson = {
  slug: 'toolchain-env',
  title: 'go env — GOPATH, GOPROXY, GOFLAGS, GOPRIVATE',
  sectionId: 'toolchain',
  order: 60,
  runMode: 'terminal',
  body: `\`go env\` shows the toolchain's environment. Notable knobs:

- \`GOPATH\` — historical workspace root (now mostly just the module cache home)
- \`GOMODCACHE\` — where downloaded modules live
- \`GOPROXY\` — module proxy chain (defaults to \`proxy.golang.org\` then \`direct\`)
- \`GOPRIVATE\` — comma-separated globs to **skip** the proxy (typically your private repos)
- \`GOFLAGS\` — default flags injected into every \`go\` invocation

\`go env -w KEY=value\` writes to a per-user config file.`,
  terminalOutput: lines,
};
