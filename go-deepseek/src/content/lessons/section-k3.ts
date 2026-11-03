import type { Lesson } from '../types';

const goGenerate: Lesson = {
  slug: 'go-generate',
  title: 'go generate directives',
  sectionId: 'toolchain',
  order: 59,
  runMode: 'terminal',
  body: `\`//go:generate\` is a comment, not a build step. \`go generate ./...\` scans for those directives and runs each command in the package directory. Nothing runs during \`go build\` or \`go test\`.

Generated files are normal Go files. The \`//go:build ignore\` tag on the generator keeps it out of the build while still letting \`go run gen.go\` execute it. Commit the generated output so builds do not depend on generator tooling, and document the regenerate command.`,
  terminalOutput: [
    { kind: 'command', text: 'go generate ./...' },
    { kind: 'stdout', text: 'generated version_gen.go' },
    { kind: 'command', text: 'cat version_gen.go' },
    { kind: 'stdout', text: 'package main' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'const Version = "v1.2.3"' },
    { kind: 'command', text: 'go run .' },
    { kind: 'stdout', text: 'version: v1.2.3' },
  ],
  gotcha:
    '`go generate` only runs directives in the files it scans — not in the imports of test files and not in vendored packages. It also runs arbitrary commands; review generator directives like code before running them.',
};

const goEnv: Lesson = {
  slug: 'go-env',
  title: 'go env, GOPATH, GOMODCACHE, GOPROXY, GOFLAGS',
  sectionId: 'toolchain',
  order: 60,
  runMode: 'terminal',
  body: `\`go env\` prints the effective toolchain configuration. \`GOPATH\` is the legacy workspace root; with modules it mostly matters for \`GOPATH/bin\`. \`GOMODCACHE\` is where downloaded modules live, and \`GOPROXY\` lists the proxies the resolver tries in order — the default ends in \`direct\`.

\`GOPRIVATE\` exempts matching module paths from the proxy and checksum database, which is how internal modules avoid leaking requests. \`GOFLAGS\` appends flags to every command; useful for \`-mod=vendor\` and dangerous when hidden in a shell profile.`,
  terminalOutput: [
    { kind: 'command', text: 'go env GOOS GOARCH GOMODCACHE GOPROXY GOPRIVATE GOFLAGS' },
    { kind: 'stdout', text: 'darwin' },
    { kind: 'stdout', text: 'arm64' },
    { kind: 'stdout', text: '/Users/king/go/pkg/mod' },
    { kind: 'stdout', text: 'https://proxy.golang.org,direct' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: '' },
  ],
  gotcha:
    '`GOFLAGS=-mod=vendor` set globally makes every module build require a vendor directory. Prefer per-project guidance over a machine-wide override.',
};

const crossCompilation: Lesson = {
  slug: 'cross-compilation',
  title: 'Cross compilation: GOOS/GOARCH, CGO_ENABLED=0',
  sectionId: 'toolchain',
  order: 61,
  runMode: 'terminal',
  body: `Set \`GOOS\` and \`GOARCH\` for the target and run the same \`go build\`. The standard library ships precompiled for every supported pair, so no toolchain install is needed for pure Go. \`CGO_ENABLED=0\` forces a static binary and removes the C toolchain from the equation.

The result is one binary per target; name them clearly. A static Linux binary is what most container images want — combine it with a scratch or distroless base and there is no runtime dependency to break.`,
  terminalOutput: [
    { kind: 'command', text: 'CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o dist/app-linux-amd64 .' },
    { kind: 'command', text: 'CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -o dist/app-darwin-arm64 .' },
    { kind: 'command', text: 'CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o dist/app.exe .' },
    { kind: 'command', text: 'file dist/app-linux-amd64' },
    { kind: 'stdout', text: 'dist/app-linux-amd64: ELF 64-bit LSB executable, x86-64, statically linked, Go BuildID=...' },
    { kind: 'command', text: 'ls -lh dist' },
    { kind: 'stdout', text: '2.3M app-darwin-arm64' },
    { kind: 'stdout', text: '2.3M app-linux-amd64' },
    { kind: 'stdout', text: '2.4M app.exe' },
  ],
  gotcha:
    'cgo breaks naive cross-compilation: importing C requires a C cross-compiler for the target. `CGO_ENABLED=0` works only for pure-Go dependencies.',
};

const ldflagsTrimpath: Lesson = {
  slug: 'ldflags-trimpath',
  title: '-ldflags, version stamping, -trimpath',
  sectionId: 'toolchain',
  order: 62,
  runMode: 'terminal',
  body: `\`-ldflags "-X main.version=v1.2.3"\` sets a string variable in \`package main\` at link time, which is the standard way to stamp version and commit into a release binary. \`-X\` only works on string variables.

\`-s -w\` strips the symbol table and DWARF data — smaller binaries, worse stack traces and no debugger symbols. \`-trimpath\` removes absolute filesystem paths from the binary, making builds reproducible and keeping your home directory out of shipped artifacts.`,
  terminalOutput: [
    { kind: 'command', text: 'go build -o dist/app .' },
    { kind: 'command', text: './dist/app' },
    { kind: 'stdout', text: 'version=dev os=darwin arch=arm64' },
    { kind: 'command', text: 'go build -trimpath -ldflags "-s -w -X main.version=v1.2.3" -o dist/app .' },
    { kind: 'command', text: './dist/app' },
    { kind: 'stdout', text: 'version=v1.2.3 os=darwin arch=arm64' },
    { kind: 'command', text: 'ls -lh dist/app' },
    { kind: 'stdout', text: '1.5M dist/app' },
  ],
  gotcha:
    '`-s -w` removes information your crash reports and profilers want. Do not strip symbols on builds you might need to debug; strip only the final release artifact.',
};

const profiling: Lesson = {
  slug: 'profiling-pprof-trace',
  title: 'go tool pprof and go tool trace',
  sectionId: 'toolchain',
  order: 63,
  runMode: 'terminal',
  body: `\`runtime/pprof\` writes CPU and heap profiles; \`go tool pprof\` reads them. \`-top\` ranks functions by flat and cumulative cost; \`-list=func\` annotates the source; \`-http=:0\` starts the interactive flame-graph UI. Profile a workload long enough to collect samples — a 30ms profile tells you almost nothing.

\`runtime/trace\` records scheduler, GC, and goroutine events. \`go tool trace trace.out\` opens a timeline viewer; \`-pprof=sched\` exports a scheduler-latency profile you can read with pprof. Use coverage to find untested code and pprof to find slow code — different questions.`,
  terminalOutput: [
    { kind: 'command', text: 'go run .' },
    { kind: 'command', text: 'go tool pprof -top -nodecount=6 cpu.out' },
    { kind: 'stdout', text: 'File: prof' },
    { kind: 'stdout', text: 'Type: cpu' },
    { kind: 'stdout', text: 'Duration: 202.92ms, Total samples = 30ms (14.78%)' },
    { kind: 'stdout', text: 'Showing nodes accounting for 30ms, 100% of 30ms total' },
    { kind: 'stdout', text: '      flat  flat%   sum%        cum   cum%' },
    { kind: 'stdout', text: '      30ms   100%   100%       30ms   100%  main.busy (inline)' },
    { kind: 'stdout', text: '         0     0%   100%       30ms   100%  main.main' },
    { kind: 'command', text: 'go tool trace -pprof=sched trace.out > sched.pprof' },
    { kind: 'command', text: 'go tool pprof -top -nodecount=4 sched.pprof' },
    { kind: 'stdout', text: 'Type: delay' },
    { kind: 'stdout', text: 'Showing nodes accounting for 4.03us, 100% of 4.03us total' },
    { kind: 'stdout', text: '    4.03us   100%   100%     4.03us   100%  runtime.asyncPreempt2' },
    { kind: 'stdout', text: '         0     0%   100%     4.03us   100%  main.busy' },
  ],
  gotcha:
    'CPU profiles sample at about 100Hz. On short functions the `flat` cost can be misleadingly zero — use cumulative cost, or run the workload longer before drawing conclusions.',
};

export const sectionK3Lessons: Lesson[] = [
  goGenerate,
  goEnv,
  crossCompilation,
  ldflagsTrimpath,
  profiling,
  {
    slug: 'section-k-checkpoint',
    title: 'Section K checkpoint',
    sectionId: 'toolchain',
    order: 63.5,
    runMode: 'annotated',
    body: 'Five questions spanning the whole toolchain: build and modules, test and format, and the advanced flags.',
    checkpoint: {
      id: 'checkpoint-toolchain',
      sectionId: 'toolchain',
      title: 'Toolchain checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'Where does `go install` place a binary when GOBIN is empty?',
          options: ['The current directory', '$GOPATH/bin', '$GOROOT/bin', '$GOMODCACHE/bin'],
          correctIndex: 1,
          explanation:
            'Without GOBIN, go install writes to GOPATH/bin, which must be on PATH to invoke by name.',
        },
        {
          kind: 'mcq',
          prompt: 'What does `go mod tidy` do?',
          options: [
            'Deletes unused source files',
            'Adds missing module requirements and removes unused ones',
            'Formats go.mod',
            'Vendors all dependencies',
          ],
          correctIndex: 1,
          explanation:
            'tidy reconciles go.mod/go.sum with the imports in the module; go mod vendor is the separate vendoring step.',
        },
        {
          kind: 'mcq',
          prompt: 'Which command builds a static Linux amd64 binary from a pure-Go module on macOS?',
          options: [
            'GOOS=linux GOARCH=amd64 go build',
            'CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build',
            'go build -linux',
            'go build -target linux/amd64',
          ],
          correctIndex: 1,
          explanation:
            'GOOS/GOARCH select the target; CGO_ENABLED=0 guarantees a static, pure-Go binary.',
        },
        {
          kind: 'mcq',
          prompt: 'What does `-ldflags "-X main.version=v1.2.3"` require?',
          options: [
            'A string variable named version in main',
            'A const named version',
            'A build tag named X',
            'An exported function',
          ],
          correctIndex: 0,
          explanation:
            '-X sets a string variable at link time; constants and non-string variables are not candidates.',
        },
        {
          kind: 'fill',
          prompt: 'Which test flag instruments memory accesses to detect data races?',
          acceptedAnswers: ['-race', 'go test -race'],
          explanation:
            '`go test -race` (or `go build -race`) instruments memory accesses and reports races at runtime.',
        },
      ],
    },
  },
];
