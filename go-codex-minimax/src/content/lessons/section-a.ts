import type { Lesson } from '../types';

// 1. Hello, world & program structure
export const helloWorld: Lesson = {
  slug: 'hello-world',
  title: 'Hello, world & program structure',
  section: 'A',
  order: 1,
  runMode: 'playground',
  body: `A Go program is one or more \`*.go\` files in the same \`package\`. Executables
start with \`package main\` and define a \`func main()\` — the runtime calls it for
you. The \`import\` block pulls in only the packages you need; the compiler
errors out on unused imports.

\`fmt.Println\` writes to stdout with a trailing newline. Run this in the editor
on the right; the response will round-trip through the public Go Playground.`,
  starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, GoTour")
}
`,
  gotcha: `There is no implicit \`;\`. The Go formatter (\`gofmt\`) inserts semicolons
based on the line break — the canonical style puts opening braces on the same
line as the declaration.`,
};

// 2. go run vs go build (terminal — toolchain preview)
export const goRunVsBuild: Lesson = {
  slug: 'go-run-vs-build',
  title: '`go run` vs `go build` (brief)',
  section: 'A',
  order: 2,
  runMode: 'terminal',
  body: `\`go run\` compiles and immediately executes a program in a temporary
location. \`go build\` writes a real binary to the current directory (or
discards it with \`-o /dev/null\`). \`go install\` writes the binary to
\`$GOBIN\` (or \`$GOPATH/bin\`).

For quick iteration, \`go run\` is fine. For shipping, build a real binary
and ship that — it's reproducible and easy to inspect (\`go version -m ./bin\`).`,
  terminalOutput: [
    { kind: 'command', text: 'go run ./cmd/hello' },
    { kind: 'stdout', text: 'Hello, GoTour' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go build -o bin/hello ./cmd/hello' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: './bin/hello' },
    { kind: 'stdout', text: 'Hello, GoTour' },
  ],
};

// 3. Variables
export const variables: Lesson = {
  slug: 'variables',
  title: 'Variables: `var`, `:=`, multiple assignment, blank identifier',
  section: 'A',
  order: 3,
  runMode: 'playground',
  body: `\`var name T = value\` declares a variable with explicit type. \`name := value\`
is the short form — the type is inferred from \`value\`, and the variable must
be new (no shadowing surprises).

\`a, b = b, a\` swaps two values; \`a, b = b, a\` evaluates the right side fully
before assignment, so no temporary is needed. The blank identifier \`_\` discards
a value and counts as a use — useful when you only care about one return value.`,
  starterCode: `package main

import "fmt"

func main() {
    var x int = 1
    y := 2
    x, y = y, x
    _, z := 7, 8
    fmt.Println(x, y, z)
}
`,
};

// 4. Constants & iota
export const constantsIota: Lesson = {
  slug: 'constants-iota',
  title: 'Constants & `iota` (bit-flag pattern, expression repetition)',
  section: 'A',
  order: 4,
  runMode: 'playground',
  body: `\`const\` declarations are compile-time values; they can be untyped and pick up
a type when used. \`iota\` resets to 0 at each \`const\` block and increments by one
per line, so the line with the type (\`= 1 << iota\`) repeats for every constant
that follows it.

The classic use is bit flags: each constant is a power of two, and \`OR\`-ing them
gives a permission set.`,
  starterCode: `package main

import "fmt"

type Perm uint8

const (
    Read Perm = 1 << iota
    Write
    Execute
)

func main() {
    p := Read | Write
    fmt.Printf("%b\\n", p)
}
`,
  gotcha: `Inside an expression list, the right-hand side is reused. So
\`Read = 1 << iota\` is enough — you don't write \`1 << iota\` for every line.
Adding \`_\` in the first slot shifts the rest; without it, \`Read\` would be 0.`,
};

// 5. Basic types
export const basicTypes: Lesson = {
  slug: 'basic-types',
  title: 'Basic types, zero values, type conversions',
  section: 'A',
  order: 5,
  runMode: 'playground',
  body: `Go has a small, fixed set of basic types: booleans; signed and unsigned
ints (\`int\`, \`int8\`–\`int64\`); floats (\`float32\`, \`float64\`); complex numbers;
strings (immutable UTF-8); runes (\`int32\`, a code point); and bytes (\`uint8\`,
an alias).

Every type has a **zero value** — the value a variable holds before assignment.
\`0\` for numbers, \`false\` for bools, \`""\` for strings, \`nil\` for pointers/slices/maps.

There is **no implicit conversion** between numeric types. \`int(3.7)\` truncates;
\`float64(x)\` widens. Mixing \`int\` and \`int64\` in an expression is a compile error.`,
  starterCode: `package main

import "fmt"

func main() {
    var i int
    var f float64
    var s string
    var b bool
    fmt.Printf("%v %v %q %v\\n", i, f, s, b)

    var x int = 3
    y := float64(x) / 2
    fmt.Println(y)
}
`,
};

// 6. Strings, runes, bytes
export const stringsRunesBytes: Lesson = {
  slug: 'strings-runes-bytes',
  title: 'Strings, runes, bytes; UTF-8 iteration with `range`',
  section: 'A',
  order: 6,
  runMode: 'playground',
  body: `A Go string is an immutable sequence of bytes — *not* characters.
\`len(s)\` returns the byte count, not the rune count. To count characters, use
\`utf8.RuneCountInString\`. \`range\` over a string yields the byte index and the
rune at that position, decoding UTF-8 for you.

A rune literal uses single quotes: \`'a'\` is \`int32\` 97. \`byte\` is an alias
for \`uint8\`. \`string([]rune{...})\` allocates a new string.`,
  starterCode: `package main

import (
    "fmt"
    "unicode/utf8"
)

func main() {
    s := "héllo, 世界"
    fmt.Println("bytes:", len(s))
    fmt.Println("runes:", utf8.RuneCountInString(s))
    for i, r := range s {
        fmt.Printf("%d %c\\n", i, r)
    }
}
`,
  gotcha: `Indexing a string (\`s[i]\`) returns a single byte, not a rune. To get
the i-th rune, walk the string or convert: \`[]rune(s)[i]\`.`,
};

// 7. Numeric types
export const numericTypes: Lesson = {
  slug: 'numeric-types',
  title: 'Numeric types, overflow, untyped constants',
  section: 'A',
  order: 7,
  runMode: 'playground',
  body: `\`int\` is at least 32 bits and matches the platform word size on a
modern machine — 64 on amd64/arm64. \`uint\` is its unsigned sibling. Use
explicit-width types (\`int32\`, \`uint64\`) at API boundaries and on disk.

Signed integer overflow **wraps** silently. \`int8(127) + 1\` is \`-128\`, no panic.
The compiler inserts wraparound arithmetic — \`math.MaxInt8 + 1\` is not a constant
error.

Untyped numeric constants have arbitrary precision; \`const huge = 1 << 100\`
is fine until you try to assign it to a fixed-width variable.`,
  starterCode: `package main

import (
    "fmt"
    "math"
)

func main() {
    const huge = 1 << 100
    small := uint8(1) // tiny typed value; just to show imports
    _ = small
    fmt.Println("huge constant compiles; assigning to int8 will fail")

    var x int8 = math.MaxInt8
    fmt.Println("wrap:", x+1)
}
`,
  gotcha: `Don't rely on overflow. If you need checked arithmetic, use
\`math/big\` or validate before adding. Wraparound is "fast Go," not "safe Go."`,
};
