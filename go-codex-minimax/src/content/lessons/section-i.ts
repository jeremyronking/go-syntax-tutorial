import type { Lesson } from '../types';

// 41. Packages & visibility
export const packagesVisibility: Lesson = {
  slug: 'packages-visibility',
  title: 'Packages, exported vs unexported (capitalization rule)',
  section: 'I',
  order: 41,
  runMode: 'playground',
  body: `A package is a directory of \`.go\` files compiled together. An identifier
is **exported** (visible outside the package) if its name starts with a capital
letter; otherwise it is unexported (package-private). There's no \`public\` or
\`private\` keyword — capitalization is the rule.

\`package main\` is special: it produces an executable, not a library.`,
  starterCode: `package main

import (
    "fmt"
    "math"
)

func main() {
    fmt.Println(math.Pi)        // exported
    // fmt.Println(math.pi)     // would be a compile error: unexported
    fmt.Println(math.Sqrt(2))   // exported
}
`,
};

// 42. init() and package-level init order
export const initOrder: Lesson = {
  slug: 'init-order',
  title: '`init()` order, package-level variable initialization',
  section: 'I',
  order: 42,
  runMode: 'playground',
  body: `Package-level variables initialize in declaration order, and \`init\`
functions run after all variables are initialized. Across files in a package,
the order is determined by the file name (lexical) and the order of declarations
within each file.

\`import\` blocks can include \`_\` for side effects only (e.g. \`image/png\`
registers an image format with \`image.Decode\`).`,
  starterCode: `package main

import "fmt"

var a = initVar("a", 1)
var b = initVar("b", a.n+1)

func initVar(name string, n int) *struct{ name string; n int } {
    v := &struct{ name string; n int }{name, n}
    fmt.Println("var", name, "=", n)
    return v
}

func init() { fmt.Println("init 1") }
func init() { fmt.Println("init 2") }

func main() {
    fmt.Println("main: a.n =", a.n, "b.n =", b.n)
}
`,
};

// 43. internal/
export const internalModules: Lesson = {
  slug: 'internal-modules',
  title: '`internal/` directories, import paths, `go.mod` module path',
  section: 'I',
  order: 43,
  runMode: 'terminal',
  body: `A directory named \`internal/\` is accessible only to code in the
parent of that directory (and its subtrees). The Go toolchain enforces this
at compile time: an \`internal/x/y\` package can be imported by packages under
\`...\`, where \`...\` is the parent of \`internal\`.

\`go.mod\` declares the **module path** — the unique prefix all import paths
in the module share. The path can be a domain you control (e.g.
\`github.com/you/project\`) or a local-only name for closed-source work.`,
  terminalOutput: [
    { kind: 'command', text: 'cat go.mod' },
    { kind: 'stdout', text: 'module example.com/gotour' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'go 1.22' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'ls internal/' },
    { kind: 'stdout', text: 'secrets' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: '# Only example.com/gotour/... can import example.com/gotour/internal/secrets' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go list -f "{{.ImportPath}}" ./internal/secrets' },
    { kind: 'stdout', text: 'example.com/gotour/internal/secrets' },
  ],
};

// 44. //go:embed
export const embedFiles: Lesson = {
  slug: 'embed-files',
  title: '`//go:embed`',
  section: 'I',
  order: 44,
  runMode: 'terminal',
  body: `The \`embed\` package exposes \`//go:embed\` directives that bundle files
into the binary. Embedding is read-only at runtime, and files must live in
the same package (or a subdirectory).

Three variable types are available: \`string\`, \`[]byte\`, and \`embed.FS\`.
The latter is the most flexible — \`fs.ReadFile(fs, "file.txt")\`.`,
  terminalOutput: [
    { kind: 'command', text: 'cat assets/greeting.txt' },
    { kind: 'stdout', text: 'hello from an embedded file' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'cat assets.go' },
    { kind: 'stdout', text: 'package main' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'import _ "embed"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: '//go:embed assets/greeting.txt' },
    { kind: 'stdout', text: 'var greeting string' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go run .' },
    { kind: 'stdout', text: 'hello from an embedded file' },
  ],
};
