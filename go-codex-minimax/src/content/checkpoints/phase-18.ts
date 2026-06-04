import type { Checkpoint } from '../types';

export const toolchainCheckpoint: Checkpoint = {
  id: 'toolchain',
  sectionSlug: 'K',
  title: 'Checkpoint: Toolchain (groups 1, 2, 3)',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'tc-run',
      prompt: 'What is the difference between `go run` and `go build`?',
      options: [
        'They are aliases',
        '`go run` compiles and executes in a temp dir; `go build` writes a binary to the current directory (or `-o`)',
        '`go run` strips debug info; `go build` keeps it',
        '`go build` always produces a static binary',
      ],
      correctIndex: 1,
      explanation: '`go run` is a one-shot build + execute; `go build` leaves a binary. For shipping, build and inspect the binary.',
    },
    {
      kind: 'mcq',
      id: 'tc-test',
      prompt: '`go test -run TestAbs -v` runs...',
      options: [
        'All tests, no verbose output',
        'Only tests whose name matches the regex `TestAbs`, with verbose output',
        'All subtests of TestAbs only',
        'Benchmarks matching TestAbs',
      ],
      correctIndex: 1,
      explanation: '`-run` is a regex on the test name. `-v` prints each run. Combine `-run TestAbs/n=-1` to target a specific subtest.',
    },
    {
      kind: 'mcq',
      id: 'tc-cover',
      prompt: 'You ran `go test -coverprofile=c.out ./...` and want to see which lines are uncovered. What do you do?',
      options: [
        '`go tool cover -html=c.out`',
        '`go cover c.out`',
        '`go test -cover -view c.out`',
        '`go vet c.out`',
      ],
      correctIndex: 0,
      explanation: '`go tool cover -html=c.out` opens a browser with each line colored by coverage status.',
    },
    {
      kind: 'mcq',
      id: 'tc-goos',
      prompt: '`GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build` produces...',
      options: [
        'A native binary for the host',
        'A static Linux/arm64 binary (no cgo)',
        'A source-tree tarball',
        'A failure — you need a C cross-toolchain',
      ],
      correctIndex: 1,
      explanation: '`GOOS`/`GOARCH` select the target. `CGO_ENABLED=0` is the pure-Go path: no cgo, statically linkable.',
    },
    {
      kind: 'mcq',
      id: 'tc-ldflags',
      prompt: '`go build -ldflags "-X main.version=1.0.0"` does what?',
      options: [
        'Sets a compiler flag for the linker',
        'Overwrites the string variable `main.version` at link time',
        'Adds the value 1.0.0 to the binary\'s symtab',
        'Forces the binary to be statically linked',
      ],
      correctIndex: 1,
      explanation: '`-X` is a linker flag that overwrites a string variable. Combine with a `var version = "dev"` default to stamp a version at build time.',
    },
    {
      kind: 'mcq',
      id: 'tc-pprof',
      prompt: 'A CPU profile is collected by...',
      options: [
        '`go profile`',
        '`go tool pprof http://host:port/debug/pprof/profile?seconds=N`',
        '`go vet -profile`',
        '`go test -cpu`',
      ],
      correctIndex: 1,
      explanation: '`net/http/pprof` exposes `/debug/pprof/profile` (CPU) and `/debug/pprof/heap` (memory) for live collection. The CLI fetches and opens them.',
    },
  ],
};
