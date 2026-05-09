import type { Lesson } from "../types";

export const sectionA: Lesson[] = [
  {
    slug: "hello-world",
    title: "Hello, World",
    section: "A",
    order: 1,
    body: `Every Go program starts with a \`package\` declaration and a \`main\` function. The \`main\` function is the entry point — when you run the program, execution begins here.

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World")
}
\`\`\`

**Key points:**

- \`package main\` tells Go this is an executable, not a library.
- \`import "fmt"\` brings in the \`fmt\` package for formatted I/O.
- \`fmt.Println\` writes a line to standard output.

Hit **Run** (or Cmd/Ctrl+Enter) to see it execute.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World")
}`,
    gotcha: "The package name `main` is mandatory for executables. A file with `package somethingelse` compiles as a library but `go run` will complain there's no `main` function.",
  },
  {
    slug: "go-run-vs-go-build",
    title: "go run vs go build",
    section: "A",
    order: 2,
    body: `\`go run\` compiles and immediately executes a Go file. \`go build\` compiles but leaves the binary on disk.

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Built and running!")
}
\`\`\`

- \`go run main.go\` — compile to a temp directory, run, delete the binary.
- \`go build -o myapp main.go\` — produce \`./myapp\` (or \`myapp.exe\` on Windows).
- \`go install\` — build and install the binary to \`$GOBIN\`.

This is a brief overview. The full toolchain tour lives in **Section K**.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Built and running!")
}`,
  },
  {
    slug: "variables",
    title: "Variables: var, :=, multiple assignment, blank identifier",
    section: "A",
    order: 3,
    body: `Go has two ways to declare variables. The \`:=\` short declaration is the most common inside functions.

\`\`\`go
package main

import "fmt"

func main() {
    // Short declaration (most common)
    x := 42
    name := "Go"

    // var keyword (needed for zero-value or package-level)
    var y int
    var z string = "explicit"

    // Multiple assignment
    a, b := 1, 2

    // Blank identifier — discard a value
    _, remainder := divmod(17, 5)

    fmt.Println(x, name, y, z, a, b, remainder)
}

func divmod(a, b int) (int, int) {
    return a / b, a % b
}
\`\`\`

- \`:=\` can only be used inside functions.
- At least one new variable must appear on the left of \`:=\`.
- The blank identifier \`_\` discards a return value you don't need.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    x := 42
    name := "Go"

    var y int
    var z string = "explicit"

    a, b := 1, 2

    _, remainder := divmod(17, 5)

    fmt.Println(x, name, y, z, a, b, remainder)
}

func divmod(a, b int) (int, int) {
    return a / b, a % b
}`,
    gotcha: "At least one new variable on the left of `:=` must not already be declared in that scope. `x, err := f()` works if `x` is new, even if `err` was already declared — but only in the same scope.",
  },
  {
    slug: "constants-and-iota",
    title: "Constants & iota",
    section: "A",
    order: 4,
    body: `Constants are known at compile time. \`iota\` generates consecutive integer constants within a \`const\` block.

\`\`\`go
package main

import "fmt"

type Role int

const (
    Reader Role = iota // 0
    Writer             // 1
    Admin              // 2
)

// Bit-flag pattern
type Perm int

const (
    ReadPerm  Perm = 1 << iota // 1
    WritePerm                   // 2
    ExecPerm                    // 4
)

func main() {
    fmt.Println(Reader, Writer, Admin)
    fmt.Println(ReadPerm, WritePerm, ExecPerm)

    // Expression repetition: iota resets per const block
    const (
        _  = iota // skip 0
        KB = 1 << (10 * iota) // 1024
        MB                      // 1 << 20
        GB                      // 1 << 30
    )
    fmt.Println(KB, MB, GB)
}
\`\`\`

- \`iota\` starts at 0 in each \`const\` block.
- The expression repeats (with \`iota\` incrementing) for subsequent lines.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

type Role int

const (
    Reader Role = iota
    Writer
    Admin
)

type Perm int

const (
    ReadPerm  Perm = 1 << iota
    WritePerm
    ExecPerm
)

func main() {
    fmt.Println(Reader, Writer, Admin)
    fmt.Println(ReadPerm, WritePerm, ExecPerm)

    const (
        _  = iota
        KB = 1 << (10 * iota)
        MB
        GB
    )
    fmt.Println(KB, MB, GB)
}`,
  },
  {
    slug: "basic-types-zero-values",
    title: "Basic types, zero values, type conversions",
    section: "A",
    order: 5,
    body: `Every Go type has a zero value — the default when you don't explicitly initialize.

\`\`\`go
package main

import "fmt"

func main() {
    var i int       // 0
    var s string    // "" (not nil)
    var f float64   // 0.0
    var b bool      // false
    var p *int      // nil

    fmt.Println(i, s, f, b, p)

    // No implicit conversion — you must be explicit
    var x int = 42
    var y float64 = float64(x)  // explicit
    // var z int = y            // compile error

    // Conversions between string and numeric types
    fmt.Println(string(65))  // "A" — rune to string
    fmt.Println(int('A'))    // 65   — rune to int
}
\`\`\`

Go has **no implicit numeric conversions**. If you need to add an \`int\` to a \`float64\`, you must convert one explicitly.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    var i int
    var s string
    var f float64
    var b bool
    var p *int

    fmt.Println(i, s, f, b, p)

    var x int = 42
    var y float64 = float64(x)

    fmt.Println(y)
    fmt.Println(string(65))
    fmt.Println(int('A'))
}`,
    gotcha: "A nil map panics on write. A nil slice is valid for append. A nil channel blocks forever. Always check the zero-value semantics of each type.",
  },
  {
    slug: "strings-runes-bytes",
    title: "Strings, runes, bytes; UTF-8 iteration",
    section: "A",
    order: 6,
    body: `A Go string is a read-only slice of bytes. A rune is a single Unicode code point (\`int32\`).

\`\`\`go
package main

import "fmt"

func main() {
    s := "Go语言"

    // len returns byte count, not character count
    fmt.Println("bytes:", len(s))     // 8

    // range over string yields runes
    for i, r := range s {
        fmt.Printf("byte offset %d: rune %U char %c\\n", i, r, r)
    }

    // Convert string ↔ []rune ↔ []byte
    runes := []rune(s)
    fmt.Println("runes:", len(runes), runes) // 4 code points

    bytes := []byte(s)
    fmt.Println("bytes slice:", len(bytes), bytes)
}
\`\`\`

- \`len(string)\` is byte length, **not** character count.
- \`for i, r := range str\` gives byte offsets and decoded runes.
- Convert to \`[]rune\` if you need character indexing.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    s := "Go语言"

    fmt.Println("bytes:", len(s))

    for i, r := range s {
        fmt.Printf("byte offset %d: rune %U char %c\n", i, r, r)
    }

    runes := []rune(s)
    fmt.Println("runes:", len(runes), runes)

    bytes := []byte(s)
    fmt.Println("bytes slice:", len(bytes), bytes)
}`,
    gotcha: "`s[0]` gives a byte, not a character. Use `[]rune(s)[0]` for the first Unicode code point. For multibyte characters, byte indexing can split a rune — always use `range` for safe iteration.",
  },
  {
    slug: "numeric-types",
    title: "Numeric types, overflow, untyped constants",
    section: "A",
    order: 7,
    body: `Go has sized integers (\`int8\`–\`int64\`), unsigned integers (\`uint8\`–\`uint64\`), and architecture-sized \`int\`/\`uint\`. Overflow wraps around — there's no trap.

\`\`\`go
package main

import "fmt"

func main() {
    // Overflow wraps
    var x uint8 = 255
    x++ // wraps to 0
    fmt.Println("overflow:", x)

    // Untyped constants have arbitrary precision
    const big = 1 << 100
    // const overflow uint8 = big  // compile error: overflows uint8
    const y int64 = 1 << 62 // fine: fits in int64
    fmt.Println("big constant (truncated to fit):", y)

    // float64 is the default for untyped floating-point
    const pi = 3.14159
    fmt.Println(pi)

    // int vs int64 are different types
    var a int = 42
    // var b int64 = a // compile error
    var b int64 = int64(a) // must convert
    fmt.Println(a, b)
}
\`\`\`

- Untyped constants have **arbitrary precision** until assigned to a typed variable.
- Once assigned, overflow and wrapping follow the target type's rules.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    var x uint8 = 255
    x++
    fmt.Println("overflow:", x)

    const big = 1 << 100
    const y int64 = 1 << 62
    fmt.Println("big constant (as int64):", y)

    const pi = 3.14159
    fmt.Println(pi)

    var a int = 42
    var b int64 = int64(a)
    fmt.Println(a, b)
}`,
  },
];