import type { Checkpoint } from '../types';

export const toolchainCheckpoint: Checkpoint = {
  id: 'toolchain-checkpoint',
  sectionId: 'toolchain',
  title: 'Checkpoint: the Go toolchain',
  questions: [
    {
      kind: 'mcq',
      prompt:
        'Which command installs a program into `$GOBIN` (or `$GOPATH/bin`) without touching your `go.mod`?',
      options: [
        '`go install ./cmd/tool`',
        '`go get golang.org/x/tools/cmd/goimports`',
        '`go build -o $GOBIN ./cmd/tool`',
        '`go mod tidy`',
      ],
      correctIndex: 0,
      explanation:
        '`go install` builds a program and puts it on your `PATH`; it does not add a dependency. `go get` only edits the module files — since Go 1.18 it no longer installs binaries. `go build -o` writes into the current directory or wherever `-o` points, not into `GOBIN`.',
    },
    {
      kind: 'mcq',
      prompt:
        'You need `github.com/example/lib` from a local checkout, but you do not want to change the published version other people use. What do you add to `go.mod`?',
      options: [
        'A `replace` directive pointing at the local directory',
        'A `require` directive with a `replace` in `go.work`',
        'A `//go:build local` tag on the importing file',
        'A `vendor/` directory checked into the repository',
      ],
      correctIndex: 0,
      explanation:
        'A `replace` directive redirects a module path to a local directory (`replace example.com/lib => ../lib`) or to a different version or fork. It is a local, uncommitted override, and it only applies to the main module — a dependency\'s `replace` lines are ignored.',
    },
    {
      kind: 'mcq',
      prompt:
        'A `go.work` file is in effect and a module in the workspace needs a local copy of a dependency. What happens to the `replace` directives in the modules\' own `go.mod` files?',
      options: [
        'They are ignored — the workspace takes precedence',
        'They are merged with the workspace\'s replacements',
        'They are applied only in the main module',
        'They cause a `go work sync` error',
      ],
      correctIndex: 0,
      explanation:
        'While `go.work` is in effect the toolchain uses it in preference to each module\'s own `go.mod`, so the modules\' `replace` directives are ignored entirely. Set `GOWORK=off` to build the way your CI does.',
    },
    {
      kind: 'mcq',
      prompt:
        'A `go test` run reports `FAIL example.com/x [build failed]` and there is no `--- FAIL` line. What does that mean?',
      options: [
        'The test binary never ran — the package or its test file does not compile',
        'Every test in the package failed',
        'The package has no test files',
        'The tests were skipped',
      ],
      correctIndex: 0,
      explanation:
        '`[build failed]` is the tell: the package failed to compile, so the test binary was never built and no test ran. A test failure would produce `--- FAIL: TestName` lines and a plain `FAIL` on the package line.',
    },
    {
      kind: 'mcq',
      prompt:
        'You want a statically linked binary for a Linux server, built on your Mac, with no C toolchain available for the target. What do you set?',
      options: [
        '`GOOS=linux GOARCH=amd64 CGO_ENABLED=0`',
        '`GOOS=linux GOARCH=amd64` — cgo is already off when cross-compiling',
        '`GOOS=linux GOARCH=amd64 CGO_ENABLED=1`',
        '`GOFLAGS=-buildmode=pie GOOS=linux`',
      ],
      correctIndex: 0,
      explanation:
        '`CGO_ENABLED=0` disables cgo, and with it the pure-Go implementations are used and the binary is statically linked. Note that cgo is already off by default when you cross-compile, so `CGO_ENABLED=0` is only needed to be explicit — setting `CGO_ENABLED=1` without a cross C compiler fails the build.',
    },
  ],
};
