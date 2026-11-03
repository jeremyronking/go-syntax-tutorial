import type { Lesson } from '../types';

const packages: Lesson = {
  slug: 'packages',
  title: 'Packages: exported vs unexported',
  sectionId: 'packages',
  order: 41,
  runMode: 'playground',
  body: `A package is a directory. Every file in it declares the same \`package\` name, and identifiers are shared across those files as if they were one.

Case is the visibility keyword: \`Name\` is exported, \`name\` is not. Exported identifiers are the public API that another package can import. Unexported ones are still reachable from any file in the same package, which is why same-package tests can touch internals. There is no \`friend\` or \`protected\`.`,
  starterCode: `package main

import "fmt"

type Config struct {
	Name string // exported: other packages can set it
	port int    // unexported: only package main can touch it
}

func (c Config) Address() string { return fmt.Sprintf("%s:%d", c.Name, c.port) }

func main() {
	c := Config{Name: "api", port: 8080}
	fmt.Println(c.Address())

	// From another package, Config{port: 8080} is a compile error:
	// cannot refer to unexported field port.
}
`,
  gotcha:
    'Changing an exported field or method is a breaking API change for every importer. Prefer returning interfaces or keeping structs behind constructors when the type is public.',
};

const initOrder: Lesson = {
  slug: 'init-order',
  title: 'init() order and package-level initialization',
  sectionId: 'packages',
  order: 42,
  runMode: 'playground',
  body: `Imports initialize first, depth-first, each package once. Within a package, variables initialize in dependency order regardless of declaration order; all package-level variables finish before any \`init()\` runs. Then \`init()\` functions run in the order they appear across files (file order is lexical by filename, though relying on that is fragile). Then \`main\`.

Use \`init\` only for things that cannot be expressed as a variable initializer — registration side effects, flag binding. Logic in \`init\` is invisible at the call site and hard to test.`,
  starterCode: `package main

import "fmt"

func trace(s string) string {
	fmt.Println("init:", s)
	return s
}

var a = trace("a")
var b = trace("b depends on " + a)

func init() { trace("first init") }
func init() { trace("second init") }

func main() {
	fmt.Println("main sees:", b)
}
`,
  gotcha:
    'A package-level variable whose initializer calls into another package can observe that package before its `init` has run. Keep cross-package initialization out of variable declarations.',
};

const internalLayout: Lesson = {
  slug: 'internal-layout',
  title: 'internal/, import paths, module paths',
  sectionId: 'packages',
  order: 43,
  runMode: 'terminal',
  body: `The \`module\` line in \`go.mod\` is the prefix for every import in the module: \`module example.com/shop\` makes \`example.com/shop/internal/store\` importable inside the module. Publish that path and the world can import it; keep it local and the module is still buildable, just not go-installable.

Anything under an \`internal/\` directory is importable only by code rooted at the parent of \`internal\`. The compiler enforces it. Use it for implementation details you refuse to support as public API, and put \`cmd/\` next to it for binaries.`,
  terminalOutput: [
    { kind: 'command', text: 'go list ./...' },
    { kind: 'stdout', text: 'example.com/shop/cmd/api' },
    { kind: 'stdout', text: 'example.com/shop/internal/store' },
    { kind: 'command', text: 'go build ./...' },
    { kind: 'command', text: 'go run ./cmd/api' },
    { kind: 'stdout', text: 'serving on :8080 with 2 products' },
  ],
  gotcha:
    '`internal/` protection follows the directory, not the module. A nested module under `internal/` does not escape the rule — imports are still checked by path.',
};

const goEmbed: Lesson = {
  slug: 'go-embed',
  title: '//go:embed',
  sectionId: 'packages',
  order: 44,
  runMode: 'terminal',
  body: `\`//go:embed\` bakes files into the binary at build time. It needs the \`embed\` import (blank if you only use the directive with a string or \`[]byte\`), and the pattern is relative to the source file. The directive must sit immediately above the variable it fills.

Embedding trades binary size for runtime independence: no working-directory lookups, no missing static assets in a container. The files are read-only and fixed at compile time.`,
  terminalOutput: [
    { kind: 'command', text: 'go run .' },
    { kind: 'stdout', text: 'embedded 2 files: [static/index.html static/style.css]' },
    { kind: 'stdout', text: '<h1>GoTour</h1>' },
    { kind: 'stdout', text: '<p>served from the binary</p>' },
    { kind: 'command', text: 'go build -o web .' },
    { kind: 'command', text: 'ls -lh web' },
    { kind: 'stdout', text: '2.4M web' },
  ],
  gotcha:
    'The directive cannot reach outside the package directory (`../static` is invalid), and `//go:embed` with no `embed` import is a compile error.',
};

export const sectionILessons: Lesson[] = [
  packages,
  initOrder,
  internalLayout,
  goEmbed,
  {
    slug: 'section-i-checkpoint',
    title: 'Section I checkpoint',
    sectionId: 'packages',
    order: 44.5,
    runMode: 'annotated',
    body: 'Four questions on visibility, initialization order, `internal/`, and embedding.',
    checkpoint: {
      id: 'checkpoint-packages',
      sectionId: 'packages',
      title: 'Packages checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'Which identifier is visible to another package?',
          options: ['name', 'Name', '_name', 'name_'],
          correctIndex: 1,
          explanation:
            'Only identifiers starting with an uppercase letter are exported.',
        },
        {
          kind: 'mcq',
          prompt: 'Within a package, what runs before any `init()` function?',
          options: [
            'main',
            'Package-level variable initialization',
            'Nothing; init runs first',
            'Test functions',
          ],
          correctIndex: 1,
          explanation:
            'Variables initialize first (in dependency order), then init functions, then main.',
        },
        {
          kind: 'fill',
          prompt: 'Which directory name limits imports to the subtree above it?',
          acceptedAnswers: ['internal', 'internal/', 'an internal directory'],
          explanation:
            'Code under internal/ is importable only by packages rooted at internal\'s parent.',
        },
        {
          kind: 'mcq',
          prompt: '`//go:embed static` is placed above a variable. Which import does the file need?',
          options: ['os', 'embed', 'io/fs only', 'None'],
          correctIndex: 1,
          explanation:
            'The embed package provides embed.FS and must be imported (blank import suffices for string/[]byte embeds).',
        },
      ],
    },
  },
];
