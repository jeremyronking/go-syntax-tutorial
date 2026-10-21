import type { Lesson } from '../types';

/**
 * A terminal-mode lesson. The Playground sandbox cannot run toolchain
 * commands, so the transcript is captured from a real shell.
 */
export const goRunVsBuild: Lesson = {
  slug: 'go-run-vs-build',
  title: '`go run` vs `go build`',
  sectionId: 'fundamentals',
  order: 2,
  runMode: 'terminal',
  body: `Two commands, one difference: \`go run\` compiles and executes in one step, \`go build\`
compiles and leaves the binary behind. Everything else — the compiler, the linker,
the build cache — is identical.

\`go run\` writes the executable to a temporary file, runs it, and deletes it when the
process exits. That makes it the right tool for a scratch program and the wrong tool
for anything you intend to ship or measure, because the compile time is inside your
measurement.

\`go build\` writes the binary into the current directory, named after the package
(\`main\` becomes the module's last path element, or \`main\` if the module path is
just \`main\`). \`-o\` overrides the name and location.

The build cache is shared between the two. A second \`go build\` of an unchanged
package is a no-op that takes milliseconds, so the difference between the commands
is not "interpreted versus compiled" — it is "run immediately versus run later".`,
  terminalOutput: [
    { kind: 'command', text: 'go run hello.go' },
    { kind: 'stdout', text: 'Hello, world\n' },
    { kind: 'command', text: 'ls' },
    { kind: 'stdout', text: 'hello.go\n' },
    { kind: 'command', text: 'go build hello.go' },
    { kind: 'command', text: 'ls -l hello' },
    { kind: 'stdout', text: '-rwxr-xr-x  1 king  staff  1691712  Jun  4 17:07 hello\n' },
    { kind: 'command', text: './hello' },
    { kind: 'stdout', text: 'Hello, world\n' },
    { kind: 'command', text: 'go build -o bin/greet ./cmd/greet' },
    { kind: 'command', text: 'ls -l bin/' },
    { kind: 'stdout', text: 'total 8\n-rwxr-xr-x  1 king  staff  1691712  Jun  4 17:07 greet\n' },
  ],
  gotcha: `\`go build\` on a package with no \`main\` function writes nothing and reports no
error unless you pass \`-o\`. The "no Go files" error only appears when the package
pattern matches no \`.go\` files at all.`,
};
