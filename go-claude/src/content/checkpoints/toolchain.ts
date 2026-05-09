import type { Checkpoint } from '../types';

export const toolchainCheckpoint: Checkpoint = {
  id: 'cp-toolchain',
  sectionId: 'toolchain',
  title: 'Section K · Toolchain',
  questions: [
    {
      kind: 'mcq',
      prompt: 'Which command vendors a copy of every dependency into ./vendor?',
      options: ['go mod copy', 'go mod vendor', 'go vendor', 'go install --vendor'],
      correctIndex: 1,
      explanation: '`go mod vendor` materializes the dependency graph into ./vendor.',
    },
    {
      kind: 'mcq',
      prompt: 'Which env var skips the module proxy for private repos?',
      options: ['GOPROXY', 'GOPRIVATE', 'GONOPROXY', 'GOMODCACHE'],
      correctIndex: 1,
      explanation:
        '`GOPRIVATE` is a comma-separated glob list. Modules matching are fetched directly, bypassing the public proxy.',
    },
    {
      kind: 'mcq',
      prompt: 'A static binary for Linux/arm64 from your Mac, no C deps?',
      options: [
        '`go build .`',
        '`GOOS=linux GOARCH=arm64 go build .`',
        '`GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build .`',
        '`go build -o linux-arm64 .`',
      ],
      correctIndex: 2,
      explanation:
        'Set GOOS, GOARCH, and disable cgo so you don\'t need a C cross-toolchain.',
    },
    {
      kind: 'mcq',
      prompt: 'Which flag stamps a version string at link time?',
      options: [
        '-version',
        '-X pkg.Var=value via -ldflags',
        '-DVERSION=value',
        '-tags version',
      ],
      correctIndex: 1,
      explanation:
        '`go build -ldflags="-X main.Version=v1.0"` rewrites the named string variable.',
    },
    {
      kind: 'fill',
      prompt:
        'Which command runs the bundled static analyzers (printf checks, shadow, etc.)?',
      acceptedAnswers: ['go vet', 'vet'],
      explanation: '`go vet` runs the analyzers bundled with the toolchain.',
    },
  ],
};
