import type { Lesson } from '../types';
import { helloWorld } from './hello-world';

const goRunVsBuild: Lesson = {
  slug: 'go-run-vs-build',
  title: 'go run vs go build',
  sectionId: 'fundamentals',
  order: 2,
  runMode: 'playground',
  body: `\`go run main.go\` compiles into a temporary directory and executes immediately. \`go build\` writes an executable next to your source (or wherever \`-o\` points) and leaves it there. The build cache keys off file contents, so both are fast on repeat; the difference is whether you get an artifact.

Use \`go run\` while iterating and \`go build\` when you need something to ship, benchmark, or inspect. Section K covers output paths, \`-o\`, and cross-compilation in detail.

The snippet asks the runtime what it was built for — a small window into the binary you would otherwise be holding.`,
  starterCode: `package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println("go:", runtime.Version())
	fmt.Println("os/arch:", runtime.GOOS+"/"+runtime.GOARCH)
}
`,
  gotcha:
    '`go run` never leaves a binary behind. If someone asks for the executable, `go run` is the wrong command — use `go build -o app .`.',
};

const variables: Lesson = {
  slug: 'variables',
  title: 'Variables, :=, and the blank identifier',
  sectionId: 'fundamentals',
  order: 3,
  runMode: 'playground',
  body: `\`var\` declares with an explicit type or inferred from an initializer. \`:=\` is shorthand that declares and assigns in one step, and only inside a function. Multiple assignment evaluates the right side first, so swaps need no temporary.

The blank identifier \`_\` discards a value — the idiomatic way to accept a second return value you do not need, or to satisfy an interface check like \`var _ io.Writer = (*buf)(nil)\`.`,
  starterCode: `package main

import "fmt"

func pair() (int, string) { return 7, "seven" }

func main() {
	var count int
	count = 3

	name := "gopher"
	count, name = count+1, "Gopher"

	n, _ := pair()
	fmt.Println(count, name, n)
}
`,
  gotcha:
    '`:=` requires at least one new variable on its left. `x, err := f()` compiles; a later `x, err := g()` does not — use `=` once both names exist.',
};

const constantsIota: Lesson = {
  slug: 'constants-iota',
  title: 'Constants and iota',
  sectionId: 'fundamentals',
  order: 4,
  runMode: 'playground',
  body: `Constants are compile-time values with no address. Inside a \`const\` block, an omitted expression repeats the previous one, and \`iota\` increments per line — that pairing is what makes bit flags readable.

\`iota\` is a line counter, not an enum declaration. It resets at every \`const\` block and it participates in whatever expression you repeat.`,
  starterCode: `package main

import "fmt"

type Perm uint8

const (
	Read Perm = 1 << iota
	Write
	Execute
)

const (
	_  = iota // skip zero
	KB = 1 << (10 * iota)
	MB
	GB
)

func main() {
	fmt.Printf("read|write = %03b\\n", Read|Write)
	fmt.Println("GB in bytes:", GB)
}
`,
  gotcha:
    'An omitted expression repeats the previous line verbatim — including its `iota` reference. Adding a line to a `const` block can shift every value below it.',
};

const basicTypes: Lesson = {
  slug: 'basic-types',
  title: 'Basic types, zero values, conversions',
  sectionId: 'fundamentals',
  order: 5,
  runMode: 'playground',
  body: `Every type has a useful zero: \`0\`, \`""\`, \`false\`, \`nil\` for slices, maps, pointers, channels, and interfaces. A struct's zero value is the zero of each field, which is why Go code leans on "usable without a constructor."

Conversions are always explicit. There is no implicit numeric promotion: \`int32\` and \`int64\` will not meet in an expression. Conversion truncates or reinterprets, it never rounds.`,
  starterCode: `package main

import "fmt"

type Point struct{ X, Y int }

func main() {
	var (
		n int
		s string
		b bool
		p Point
	)
	fmt.Printf("%d %q %v %+v\\n", n, s, b, p)

	f := 3.99
	i := int(f)
	fmt.Println(f, i, int64(i)+1)
}
`,
  gotcha:
    'No implicit conversion exists. Mixing `int` and `int64`, or `float32` and `float64`, is a compile error even when the value obviously fits. Convert explicitly.',
};

const stringsRunesBytes: Lesson = {
  slug: 'strings-runes-bytes',
  title: 'Strings, runes, bytes, UTF-8',
  sectionId: 'fundamentals',
  order: 6,
  runMode: 'playground',
  body: `A string is an immutable sequence of bytes, conventionally UTF-8. \`len(s)\` counts bytes, \`s[i]\` yields a byte, and \`range\` decodes runes and gives you the byte offset of each one. A rune is an \`int32\`; a byte is a \`uint8\`.

Convert with \`[]rune(s)\` when you need character semantics, \`[]byte(s)\` when you need a mutable buffer. The conversion copies.`,
  starterCode: `package main

import "fmt"

func main() {
	s := "héllo, 世界"
	fmt.Println("bytes:", len(s))

	for i, r := range s {
		fmt.Printf("%2d %c %U\\n", i, r, r)
	}

	runes := []rune(s)
	fmt.Println("runes:", len(runes), "second:", string(runes[1]))
}
`,
  gotcha:
    '`s[i]` is a byte. Slicing a string at an arbitrary byte offset can split a multi-byte rune and produce invalid UTF-8; slice `[]rune` instead when positions matter.',
};

const numericTypes: Lesson = {
  slug: 'numeric-types',
  title: 'Numeric types, overflow, untyped constants',
  sectionId: 'fundamentals',
  order: 7,
  runMode: 'playground',
  body: `Go has sized integers (\`int8\`–\`int64\`), unsigned variants, and the platform-sized \`int\`/\`uint\`. Floats are \`float32\`/\`float64\`; \`complex64\`/\`complex128\` exist too. \`int\` is the default for counts and indexes.

Untyped constants have arbitrary precision until they are assigned. That means \`const big = 1 << 62\` is fine, and assigning it to \`int64\` works, while assigning it to \`int32\` is a compile error. Runtime arithmetic, by contrast, wraps silently.`,
  starterCode: `package main

import "fmt"

func main() {
	const big = 1 << 62
	fmt.Println(big / 4)

	var u uint8 = 255
	u++
	fmt.Println("wrapped:", u)

	x := 1.0 / 3.0
	fmt.Printf("%.4f\\n", x)
	fmt.Println(float32(x) == float32(0.3333))
}
`,
  gotcha:
    'Constant overflow is a compile error; runtime overflow wraps. `uint8(255) + 1` as a constant fails to compile, but `var u uint8 = 255; u++` prints 0.',
};

export const sectionALessons: Lesson[] = [
  helloWorld,
  goRunVsBuild,
  variables,
  constantsIota,
  basicTypes,
  stringsRunesBytes,
  numericTypes,
  {
    slug: 'section-a-checkpoint',
    title: 'Section A checkpoint',
    sectionId: 'fundamentals',
    order: 7.5,
    runMode: 'annotated',
    body: `Five questions on the parts of Section A that bite in real code: ` +
      '`iota` arithmetic, zero values, implicit conversion, byte-vs-rune, and `:=` rules. No score gate — a pass marks the section complete.',
    checkpoint: {
      id: 'checkpoint-fundamentals',
      sectionId: 'fundamentals',
      title: 'Fundamentals checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt:
            'Given `const ( A = iota; B; C = iota )`, what is the value of C?',
          options: ['0', '1', '2', 'The block does not compile'],
          correctIndex: 2,
          explanation:
            'iota counts lines within the const block, and C explicitly repeats iota, which is 2 on the third line.',
        },
        {
          kind: 'mcq',
          prompt: 'What is the zero value of a `[]int` variable?',
          options: ['An empty but non-nil slice', 'nil, with len 0', 'A one-element slice', 'A compile error without make'],
          correctIndex: 1,
          explanation:
            'The zero value is nil; len and range work on it, but writing to an index panics until you allocate.',
        },
        {
          kind: 'fill',
          prompt: 'Which identifier discards a value in Go, as in `n, _ := pair()`?',
          acceptedAnswers: ['_', 'blank identifier', 'underscore'],
          explanation:
            'The blank identifier `_` accepts a value and discards it, without introducing a variable.',
        },
        {
          kind: 'mcq',
          prompt: 'Which expression is legal?',
          options: [
            'var x int32 = 1; var y int64 = x',
            'var x int32 = 1; y := int64(x)',
            'var x int32 = 1; y := x + int64(1)',
            'float64(1) + 1',
          ],
          correctIndex: 1,
          explanation:
            'Conversions are explicit; adding two different integer types without converting is a compile error.',
        },
        {
          kind: 'mcq',
          prompt: 'For `s := "é"`, what are `len(s)` and the first value produced by ranging over s?',
          options: [
            'len 1; a byte',
            'len 2; a rune',
            'len 2; a byte',
            'len 1; a rune',
          ],
          correctIndex: 1,
          explanation:
            'len counts bytes (é is two bytes in UTF-8), while range decodes runes.',
        },
      ],
    },
  },
];
