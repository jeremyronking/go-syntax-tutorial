import type { Lesson } from '../types';

export const packages: Lesson = {
  slug: 'packages',
  title: 'Packages: exported vs unexported',
  sectionId: 'packages',
  order: 41,
  runMode: 'playground',
  body: `A **package** is a directory of \`.go\` files that all declare the same
package name. The directory path — not the package name — is what you import.

\`\`\`go
package greet   // the package name

import "example.com/mygreet/pkg/greet"   // the import path
\`\`\`

You import the *path* and refer to the package by its *name*. The two are
usually the last element of the path, but not always: a directory
\`pkg/greet\` containing \`package greeter\` is imported as \`"…/pkg/greet"\` and
used as \`greeter\`. This trips people up constantly.

**Capitalisation is the visibility rule.** An identifier is exported if — and
only if — its first letter is a capital:

\`\`\`go
type User struct {
    Name   string   // exported
    secret string   // unexported
}

func (u *User) Describe() string { return u.Name }   // exported
func (u *User) validate() error  { return nil }      // unexported
\`\`\`

The rule is **per package**, not per file. A method declared with a lower-case
name in \`user.go\` is still callable from \`admin.go\` in the same package, and
is invisible to every other package.

**What "unexported" really means.** It is not a security boundary — it is a
convention that says "this is my business, do not depend on it". Other
packages in the same module cannot see it, and neither can anyone outside. If
you genuinely need a boundary, the language has no way to enforce it.

**Why the rule exists.** The whole point is that a package's exported
surface is an API you can evolve. Adding a field to a struct is safe; adding
an *unexported* field is safe too, because nobody outside could have been
using it. But changing the meaning of an exported identifier breaks every
caller.

**Package names should be short and lowercase** — \`greet\`, not
\`GreeterPackage\`. The name is used at every call site, and the import path
already carries the context.

**Two files, one package.** A directory's \`.go\` files may split a package
across several files. Files ending in \`_test.go\` are a special case: they
hold tests and are compiled only for the test binary.`,
  starterCode: `package main

import "fmt"

// An exported type: the name starts with a capital, so other packages
// can see it.
type Exported struct {
	Name   string   // exported field
	secret int      // unexported field
}

// An exported method.
func (e Exported) Describe() string {
	return "an Exported value"
}

// An unexported method — callable from this package, invisible elsewhere.
func (e Exported) whisper() string {
	return "quietly"
}

func main() {
	e := Exported{Name: "ada"}

	// Exported identifiers are reachable from anywhere.
	fmt.Println("Name:", e.Name)
	fmt.Println("Describe:", e.Describe())

	// Unexported identifiers are reachable from the same package only.
	// This file is in package main and the type is in package main, so
	// these work. Move the type to another package and they stop compiling.
	fmt.Println("secret:", e.secret)
	fmt.Println("whisper:", e.whisper())

	// The visibility rule is per package, not per file: this program
	// could be split across main.go and helpers.go and nothing would
	// change.
	fmt.Println("same package, different file — still fine")
}
`,
  gotcha: `Unexported is a *convention*, not a security boundary. A package in
the same module still cannot see another package's unexported identifiers, but
nothing stops a determined caller from using \`unsafe\` or reflection. Treat
"unexported" as "do not depend on this", not "this is protected".`,
};

export const initOrder: Lesson = {
  slug: 'init-order',
  title: '`init()` order & package-level variable initialisation',
  sectionId: 'packages',
  order: 42,
  runMode: 'playground',
  body: `Go has no constructors and no static initialisers you write yourself.
Instead it has a fixed, deterministic order.

**The rules, in order:**

1. **Package-level variables** are initialised in *declaration order*, after
   all imported packages have been initialised.
2. **\`init()\` functions** run after the package's variables are ready, in the
   order they appear in the file. Within a package, files are processed in
   the order the compiler sees them — by file name, sorted.
3. The process repeats for each imported package, **depth first**: a package's
   dependencies are fully initialised before the package itself.
4. \`main.main()\` runs last of all.

So for a single package:

\`\`\`go
var a = f("a")   // 1. variables first, in declaration order
var b = f("b")   // 2.

func init() { ... }   // 3. then init() functions, in file order
func init() { ... }   // 4.

func main() { ... }   // 5. last
\`\`\`

**The important consequence:** a package-level variable's initialiser can
depend on an earlier one in the same package, but *not* on a later one. If
\`b\`'s initialiser reads \`a\`, and \`a\` is declared after \`b\`, \`a\` is still
zero at that point. The compiler will not warn you.

**Why this matters.** \`init()\` is the right place for the things that must
happen exactly once, before anything uses them: opening a database pool,
registering a flag, starting a background goroutine. It is the *wrong* place
for anything that could fail, because an \`init()\` that panics takes the whole
program down with no way to handle it. If setup can fail, do it in an explicit
function that returns an error.

**Initialising an imported package.** The same rules apply across packages.
When \`main\` imports \`greet\`, \`greet\`'s variables and \`init()\`s run to
completion *before* \`main\`'s initialisation begins. So an \`init()\` in
\`greet\` can safely assume that its own package is fully set up.

**\`init()\` cannot be called explicitly.** It is not a function you can
invoke; the runtime calls it for you, exactly once per package.

**A package can be initialised more than once in a test binary** if the test
binary imports it through two different paths — which is rare, but it
explains the occasional "init ran twice" surprise.`,
  starterCode: `package main

import "fmt"

// Package-level variables are initialised first, in declaration order.
var a = describe("a")
var b = describe("b")

func describe(name string) string {
	fmt.Println("initialising", name)
	return name
}

// init functions run after the variables, in the order they appear.
func init() {
	fmt.Println("init 1")
}

func init() {
	fmt.Println("init 2")
}

func main() {
	fmt.Println("main")
	fmt.Println("a =", a, "b =", b)
}
`,
  note: `The Playground runs your program exactly once, so the order above is
the whole story. A real program that imports other packages sees the same
rules, applied depth first: every dependency is fully initialised before the
package that imports it.`,
  gotcha: `A package-level initialiser can read a variable declared *later* in
the same file — and will silently get its zero value, because variables are
initialised in declaration order. The compiler does not warn about this.`,
};

export const internalAndModule: Lesson = {
  slug: 'internal-and-module',
  title: '`internal/` directories, import paths & `go.mod`',
  sectionId: 'packages',
  order: 43,
  runMode: 'terminal',
  body: `**Import paths come from the module path.** A module's \`go.mod\` declares
its path, and every package in the module is addressed relative to it:

\`\`\`
module example.com/gotour

go 1.27
\`\`\`

With that \`go.mod\`, the directory \`pkg/greet\` has the import path
\`example.com/gotour/pkg/greet\`. The module path is what makes the import
path globally unique, so pick a domain you control and use its HTTPS URL —
\`example.com/gotour\` is the conventional placeholder, and the same rule
applies to \`github.com/you/repo\`.

**\`internal/\` is enforced by the compiler.** A directory named \`internal\`
is importable only from within the tree rooted at its *parent*:

\`\`\`
example.com/gotour/                 <- the parent of internal/
  main.go
  internal/secret/secret.go         <- importable only from example.com/gotour/...
  pkg/greet/greet.go                <- importable from anywhere
\`\`\`

The compiler rejects the import with \`use of internal package … not allowed\`.
This is a real language feature, not a convention — the only one in Go that
touches visibility.

**\`internal/\` nests.** \`a/internal/b\` is only importable from \`a/…\`. And
\`internal\` works at any level, including inside a third-party dependency
(\`example.com/gotour/internal/…\` is private to that module).

**The \`cmd/\` and \`internal/\` layout.** The layout the Go team recommends
for a repository with more than one command:

\`\`\`
example.com/gotour/
  go.mod
  cmd/
    gotour/main.go        <- package main, the binary
    hello/main.go
  internal/
    store/store.go        <- not importable by anyone else
  pkg/
    greet/greet.go        <- public API
\`\`\`

**\`go.mod\` is not optional.** Since Go 1.16 the toolchain refuses to build
a package outside a module; \`go mod init\` creates one. Run it in the
directory that is the root of your project.

**Package paths do not have to match the filesystem**, but they nearly always
do: the import path is the module path plus the directory path, with the
module path replaced by a *replace directive* or a version suffix for
dependencies.`,
  terminalOutput: [
    { kind: 'command', text: 'go mod init example.com/gotour' },
    { kind: 'stdout', text: 'go: creating new go.mod: module example.com/gotour\n' },
    { kind: 'command', text: 'cat go.mod' },
    {
      kind: 'stdout',
      text: 'module example.com/gotour\n\ngo 1.27\n',
    },
    { kind: 'command', text: 'go list ./...' },
    {
      kind: 'stdout',
      text: 'example.com/gotour\nexample.com/gotour/internal/secret\nexample.com/gotour/pkg/greet\n',
    },
    { kind: 'command', text: 'go list -f \'{{.ImportPath}} {{.Name}}\' ./...' },
    {
      kind: 'stdout',
      text:
        'example.com/gotour main\nexample.com/gotour/internal/secret secret\nexample.com/gotour/pkg/greet greet\n',
    },
    { kind: 'command', text: 'go build ./...' },
    { kind: 'command', text: 'go run .' },
    { kind: 'stdout', text: 'hello, gopher\n' },
    { kind: 'command', text: 'cd ../outsider && go build ./...' },
    { kind: 'stderr', text: 'package example.com/outsider\n' },
    {
      kind: 'stderr',
      text: '\tmain.go:6:2: use of internal package example.com/gotour/internal/secret not allowed\n',
    },
  ],
  gotcha: `The import path is the module path plus the directory path — not the
package name. A directory \`pkg/greet\` holding \`package greeter\` is imported as
\`"example.com/gotour/pkg/greet"\` and referred to as \`greeter\`.`,
};

export const goEmbed: Lesson = {
  slug: 'go-embed',
  title: '`//go:embed` — shipping files inside the binary',
  sectionId: 'packages',
  order: 44,
  runMode: 'terminal',
  body: `\`//go:embed\` puts files into the binary at build time. A single-file Go
program with an embedded template or a lookup table needs no runtime assets
directory, no installer, and no "file not found" errors.

**The syntax.** Put the directive immediately above a package-level variable
of type \`string\`, \`[]byte\`, or \`embed.FS\`:

\`\`\`go
import "embed"

//go:embed assets/greeting.txt
var greeting string

//go:embed assets
var assets embed.FS
\`\`\`

The pattern is a \`go:embed\` pattern, not a path: \`assets/*\` matches the
contents of \`assets\`, \`assets/*.txt\` matches text files, and a bare
directory name embeds the directory *recursively* but skips files beginning
with \`.\` or \`_\`.

**The rules.**

- The directive must be on a **package-level** variable. It cannot be a local
  variable, and it cannot be applied to a function.
- The variable must be of type \`string\`, \`[]byte\`, or \`embed.FS\`.
- The \`embed\` package must be imported — even if you only use \`string\`. A
  blank import (\`_ "embed"\`) is enough.
- **The files must exist at build time.** A pattern that matches nothing is a
  compile error, not a runtime one.
- Patterns cannot match files outside the package's module, and they cannot
  use \`..\`.
- **Symbolic links are not embedded.** A pattern that resolves to a symlink
  is an error; the link's *target* is not followed.
- Each pattern must match at least one file or non-empty directory, or the
  build fails.

**\`embed.FS\` vs a plain string.** A \`string\` or \`[]byte\` embeds exactly
one file's contents. \`embed.FS\` embeds a whole tree and gives you a
read-only filesystem interface — \`fs.ReadFile\`, \`fs.WalkDir\`, and the
usual \`io/fs\` helpers. It is the right choice for anything more than one
file.

**Files are embedded, not symlinks or special files.** Directories are
embedded as directories; symlinks are not followed. Binary files are fine —
\`embed\` does not care about content.

**\`embed.FS\` paths are slash-separated and relative to the package
directory**, so \`fs.ReadFile(fsys, "assets/greeting.txt")\` — note the
forward slash, even on Windows.

**Why not just read the file at runtime?** Because then you have to ship it
alongside the binary and know where it is. Embedding is how a single static
binary can serve templates, certificates, and configuration with no
filesystem assumptions at all.`,
  terminalOutput: [
    { kind: 'command', text: 'mkdir -p assets && echo "hello from an embedded file" > assets/greeting.txt' },
    { kind: 'command', text: 'go run .' },
    { kind: 'stdout', text: 'hello from an embedded file\n' },
    { kind: 'stdout', text: 'embedded: greeting.txt\nembedded: second.txt\n' },
    { kind: 'command', text: 'cat main.go' },
    {
      kind: 'stdout',
      text:
        'package main\n\nimport (\n\t"embed"\n\t"fmt"\n)\n\n//go:embed assets/greeting.txt\nvar greeting string\n\n//go:embed assets\nvar assets embed.FS\n\nfunc main() {\n\tfmt.Println(greeting)\n\tentries, _ := assets.ReadDir("assets")\n\tfor _, e := range entries {\n\t\tfmt.Println("embedded:", e.Name())\n\t}\n}\n',
    },
    { kind: 'command', text: 'rm assets/greeting.txt && go run .' },
    { kind: 'stderr', text: 'main.go:8:12: pattern assets/greeting.txt: no matching files found\n' },
  ],
  gotcha: `A \`//go:embed\` pattern that matches no file is a **compile** error, not
a runtime one. If the file is generated by another step, make sure that step
runs before the build, or the build fails with \`pattern …: no matching files
found\`.`,
};
