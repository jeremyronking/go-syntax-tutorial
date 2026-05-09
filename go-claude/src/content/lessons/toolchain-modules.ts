import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'go mod init example.com/myapp' },
  { kind: 'stdout', text: 'go: creating new go.mod: module example.com/myapp\n' },
  { kind: 'command', text: 'go get github.com/google/uuid@latest' },
  { kind: 'stdout', text: 'go: added github.com/google/uuid v1.6.0\n' },
  { kind: 'command', text: 'go mod tidy' },
  { kind: 'stdout', text: '' },
  { kind: 'command', text: 'go mod why github.com/google/uuid' },
  { kind: 'stdout', text: '# github.com/google/uuid\nexample.com/myapp\ngithub.com/google/uuid\n' },
  { kind: 'command', text: 'go mod graph | head -3' },
  { kind: 'stdout', text: 'example.com/myapp github.com/google/uuid@v1.6.0\n' },
  { kind: 'command', text: 'go mod vendor' },
  { kind: 'stdout', text: '' },
];

export const toolchainModules: Lesson = {
  slug: 'toolchain-modules',
  title: 'go mod — init, tidy, get, why, graph, vendor',
  sectionId: 'toolchain',
  order: 51,
  runMode: 'terminal',
  body: `Modules are Go's units of versioning and dependency resolution.

- \`go mod init <module-path>\` creates \`go.mod\`
- \`go get pkg@version\` adds or upgrades a dependency
- \`go mod tidy\` adds what's used and removes what isn't (run before commits)
- \`go mod why <pkg>\` explains why a package is needed
- \`go mod graph\` prints the dependency graph
- \`go mod vendor\` materializes deps into \`./vendor\` (rare in modern Go; useful for hermetic builds)

\`replace\` directives in \`go.mod\` redirect imports — handy for local development against a fork.`,
  terminalOutput: lines,
};
