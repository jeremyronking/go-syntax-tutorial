import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'tree -L 2' },
  { kind: 'stdout', text: `monorepo/
├── go.work
├── api/
│   ├── go.mod   # module example.com/api
│   └── ...
└── lib/
    ├── go.mod   # module example.com/lib
    └── ...
` },
  { kind: 'command', text: 'cat go.work' },
  { kind: 'stdout', text: `go 1.23

use (
    ./api
    ./lib
)
` },
  { kind: 'command', text: 'cd api && go build .' },
  { kind: 'stdout', text: '# imports of example.com/lib resolve from ../lib, not the proxy\n' },
];

export const toolchainWorkspaces: Lesson = {
  slug: 'toolchain-workspaces',
  title: 'go work — multi-module workspaces',
  sectionId: 'toolchain',
  order: 52,
  runMode: 'terminal',
  body: `\`go work\` lets you develop several modules in one checkout without \`replace\` directives. The top-level \`go.work\` lists each module via \`use\`. While \`go.work\` is present, builds resolve those modules locally — perfect for cross-module changes that need to land together.

\`go.work\` is a developer concern; do **not** commit it for shared use. Commit \`go.mod\` for releases.`,
  terminalOutput: lines,
};
