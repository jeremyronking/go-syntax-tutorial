import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/myapp-linux-amd64 .' },
  { kind: 'command', text: 'GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -o bin/myapp-linux-arm64 .' },
  { kind: 'command', text: 'GOOS=darwin GOARCH=arm64 go build -o bin/myapp-darwin-arm64 .' },
  { kind: 'command', text: 'GOOS=windows GOARCH=amd64 go build -o bin/myapp.exe .' },
  { kind: 'command', text: 'go tool dist list | head -8' },
  { kind: 'stdout', text: 'aix/ppc64\nandroid/386\nandroid/amd64\nandroid/arm\nandroid/arm64\ndarwin/amd64\ndarwin/arm64\ndragonfly/amd64\n' },
];

export const toolchainCrossCompile: Lesson = {
  slug: 'toolchain-cross-compile',
  title: 'Cross compilation — GOOS, GOARCH, CGO_ENABLED=0',
  sectionId: 'toolchain',
  order: 61,
  runMode: 'terminal',
  body: `Setting \`GOOS\` and \`GOARCH\` retargets the build. \`go tool dist list\` prints every supported pair. \`CGO_ENABLED=0\` is required when cross-compiling for a platform you don't have a C cross-toolchain for — gives you a static binary that runs on any kernel of that arch.

This is one of Go's quietly excellent features: cross-builds with no Docker, no toolchain juggling.`,
  terminalOutput: lines,
};
