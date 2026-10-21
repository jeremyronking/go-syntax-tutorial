import type { Lesson } from '../types';

export const variables: Lesson = {
  slug: 'variables',
  title: 'Variables: `var`, `:=`, and the blank identifier',
  sectionId: 'fundamentals',
  order: 3,
  runMode: 'playground',
  body: `Go gives you three ways to declare a variable, and the difference between them is
mostly about scope and intent.

\`var\` declares in the enclosing scope and works anywhere. Inside a function it
declares a local; at package level it declares a package-scoped variable. The type
may be given (\`var x int\`), inferred from the initialiser (\`var x = 3\`), or
omitted entirely if the zero value is what you want.

\`:=\` is a short variable declaration. It only works inside a function, it always
infers the type, and it creates a *new* variable in the current scope — even if a
variable of that name already exists one scope up. This is the one that surprises
people coming from other languages:

\`\`\`go
x := 1
{
    x := 2  // a different variable, shadowing the outer one
    _ = x    // 2
}
_ = x        // 1
\`\`\`

The short declaration is also the only form that allows multiple assignment:

\`\`\`go
a, b := 1, 2
\`\`\`

and it can mix new and existing variables as long as at least one is new. That is
how you swap without a temporary:

\`\`\`go
a, b = b, a
\`\`\`

Note that \`=\` is plain assignment and \`:=\` is declaration. Using \`=\` where you
meant \`:=\` is the single most common beginner error — it assigns to an existing
variable (or fails to compile if there is none) instead of declaring one.

The blank identifier \`_\` discards a value. It is the only way to legally ignore a
return value:

\`\`\`go
if _, err := os.Stat(path); err != nil {
    // ...
}
\`\`\`

Assigning to \`_\` is a no-op; you cannot read from it.`,
  starterCode: `package main

import "fmt"

func main() {
	// var declares in the enclosing scope, with an explicit or inferred type.
	var a int = 1
	var b = 2 // type inferred
	var c int // zero value: 0

	// := declares in the current scope and infers the type.
	d := 4

	fmt.Println(a, b, c, d) // 1 2 0 4

	// Short declaration can assign several variables at once.
	e, f := 5, 6
	fmt.Println(e, f) // 5 6

	// At least one variable on the left must be new.
	e, g := 7, 8
	fmt.Println(e, g) // 7 8

	// The blank identifier discards a value.
	_, h := 9, 10
	fmt.Println(h) // 10

	// Shadowing: := creates a new variable in the inner scope.
	i := 11
	{
		i := 12
		fmt.Println("inner:", i) // 12
	}
	fmt.Println("outer:", i) // 11
}
`,
  gotcha: `A short variable declaration in an inner scope *shadows* the outer one rather
than assigning to it. If you meant to modify the outer variable, use \`=\` — and
\`go vet\` will not catch the mistake, but \`golangci-lint\` will.`,
};

export const constantsIota: Lesson = {
  slug: 'constants-iota',
  title: 'Constants & `iota`',
  sectionId: 'fundamentals',
  order: 4,
  runMode: 'playground',
  body: `A constant is a value the compiler knows at compile time. It cannot be assigned
to, and it has no memory address — passing one to a function copies the value
rather than a pointer to it.

\`iota\` is a predeclared identifier that holds the index of the current
\`ConstSpec\` within its \`const\` block. It starts at zero and increments for each
line in the block. The important part: **the expression is repeated for every
line**, with only \`iota\` changing. This is what makes the bit-flag pattern work:

\`\`\`go
const (
    Read  = 1 << iota // 1 << 0 == 1
    Write             // 1 << 1 == 2
    Execute           // 1 << 2 == 4
)
\`\`\`

Each constant here has type \`int\`, and the value of \`Read\` is 1, \`Write\` is 2,
\`Execute\` is 4 — the *expression* \`1 << iota\` is what gets re-evaluated, with
\`iota\` now 1 and 2 respectively.

The same machinery gives you sequential values:

\`\`\`go
const (
    Sunday = iota // 0
    Monday        // 1
    Tuesday       // 2
)
\`\`\`

and a typed enum, where you give the first constant a type and the rest inherit
it:

\`\`\`go
const (
    Red Color = iota
    Green
    Blue
)
\`\`\`

A \`const\` block is not a namespace — the names are at the scope where the block
sits, and they shadow package-level identifiers of the same name.`,
  starterCode: `package main

import "fmt"

// Bit flags: the expression is repeated for each line, iota counts up.
const (
	Read    = 1 << iota // 1
	Write               // 2
	Execute             // 4
)

// A typed enum: the type comes from the first constant.
type Color int

const (
	Red Color = iota
	Green
	Blue
)

// Sequential values.
const (
	Sunday = iota
	Monday
	Tuesday
)

func main() {
	fmt.Println("flags:", Read, Write, Execute)
	fmt.Println("combined:", Read|Write)

	// Check a flag with a bitwise AND.
	if Read&Execute == Read {
		fmt.Println("readable")
	} else {
		fmt.Println("not readable")
	}

	fmt.Println("colors:", Red, Green, Blue)
	fmt.Println("days:", Sunday, Monday, Tuesday)

	// iota restarts at 0 in each const block.
	const (
		a = iota
		b
	)
	fmt.Println("second block:", a, b)
}
`,
  gotcha: `A constant's type matters at the point of use. \`const Big = 1 << 40\` is an
untyped constant, so it compiles fine until you assign it to an \`int\` on a 32-bit
platform, where it does not fit. Untyped constants are not a shortcut around
overflow.`,
};

export const basicTypes: Lesson = {
  slug: 'basic-types',
  title: 'Basic types, zero values & conversions',
  sectionId: 'fundamentals',
  order: 5,
  runMode: 'playground',
  body: `Go has no implicit numeric conversion. Assigning an \`int\` to an \`int64\` is a
compile error, and so is assigning a \`float64\` to an \`int\`. Conversions must be
written out, and they can lose data:

\`\`\`go
var i int64 = 42
j := int32(i)   // explicit, may truncate on a 64-bit int
f := float64(i) // explicit
s := string(i)  // explicit — and here it means "the rune with this code point"
\`\`\`

That last one catches people out. \`string(65)\` is \`"A"\`, not \`"65"\`. To render a
number as text, use \`strconv.Itoa\` or \`fmt.Sprint\`.

The zero values of the basic types are the ones that make Go's "usable zero"
design work:

| Type | Zero value |
|---|---|
| \`bool\` | \`false\` |
| numeric | \`0\` |
| \`string\` | \`""\` |
| pointer, slice, map, chan, func, interface | \`nil\` |

\`""\` and \`nil\` are not "empty" in the C sense. A nil slice has no backing array
(\`len\` is 0, \`append\` allocates), a nil map is safe to read but panics on write,
and a nil channel blocks forever.

The composite types get zero values too: an array's elements are zeroed, a struct's
fields are zeroed, and a struct's zero value is often directly usable — no
constructor required.`,
  starterCode: `package main

import "fmt"

func main() {
	// Zero values.
	var b bool
	var i int
	var f float64
	var s string
	var p *int
	var sl []int
	var m map[string]int
	fmt.Printf("%v %v %v %q %v %v %v\\n", b, i, f, s, p, sl, m)

	// No implicit conversion.
	var i64 int64 = 42
	fmt.Println(int32(i64), float64(i64))

	// string(int) is a rune conversion, not a number-to-text conversion.
	fmt.Printf("string(65) = %q\\n", string(65))
	fmt.Printf("string(rune(65)) = %q\\n", string(rune(65)))

	// A nil map is readable...
	fmt.Println(m["missing"], len(m))

	// ...but writing to one panics. Uncomment to see it:
	// m["key"] = 1

	// A nil slice is safe to append to; append allocates.
	sl = append(sl, 1, 2, 3)
	fmt.Println(sl, len(sl), cap(sl))
}
`,
  gotcha: `Writing to a nil map panics with "assignment to entry in nil map". The
idiomatic fix is to initialise it at the point of declaration, not to check for nil
before every write.`,
};

export const stringsRunesBytes: Lesson = {
  slug: 'strings-runes-bytes',
  title: 'Strings, runes & bytes',
  sectionId: 'fundamentals',
  order: 6,
  runMode: 'playground',
  body: `A Go \`string\` is an immutable, read-only slice of bytes. It is *not* a sequence
of characters. There is no \`len\` that counts characters, no \`[0]\` that gives you
the first character, and no way to mutate one.

The three types you need to keep straight:

- \`string\` — a read-only slice of bytes. Comparable, usable as a map key.
- \`[]byte\` (\`[]uint8\`) — a mutable slice of bytes. What the encoding libraries
  speak.
- \`rune\` (\`int32\`) — one Unicode code point.

\`len(s)\` counts bytes. \`utf8.RuneCountInString(s)\` counts code points. Neither
counts what a human calls a "character" — a grapheme cluster can be several code
points, and an emoji like 👨‍👩‍👧‍👦 is seven.

Iterating with \`range\` over a string decodes UTF-8 and yields the code point as
the first value and the byte offset as the second:

\`\`\`go
for i, r := range s {
    // i is a byte index, r is a rune
}
\`\`\`

The byte offset is what makes the \`for i, r := range\` form useful for slicing
correctly — but slicing a string at a non-code-point boundary produces invalid
UTF-8, not an error.

Converting between the three is explicit, and the conversion is not free:
\`[]byte(s)\` copies, and \`string(b)\` copies. Go optimises a few of these when
the result does not escape, but do not rely on it in a hot loop.`,
  starterCode: `package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	s := "héllo"

	// len counts bytes; RuneCount counts code points.
	fmt.Println("bytes:", len(s))
	fmt.Println("runes:", utf8.RuneCountInString(s))
	fmt.Println("runes via range:", countRunes(s))

	// Indexing a string gives a byte, not a character.
	fmt.Printf("s[0] = %d (%q)\\n", s[0], s[0])
	fmt.Printf("s[1] = %d\\n", s[1])

	// range decodes UTF-8 for you.
	for i, r := range s {
		fmt.Printf("byte %d: %c (%d)\\n", i, r, r)
	}

	// Conversions are explicit.
	b := []byte(s)
	fmt.Println("as bytes:", b)
	fmt.Println("back to string:", string(b))
	fmt.Printf("byte slice to string: %q\\n", string([]byte{72, 105}))

	// A rune slice, for when you want characters.
	runes := []rune(s)
	fmt.Println("runes:", runes, len(runes))
}

func countRunes(s string) int {
	n := 0
	for range s {
		n++
	}
	return n
}
`,
  gotcha: `Slicing a string at a byte offset that is not a code point boundary yields
invalid UTF-8 rather than an error. \`s[0:2]\` on "héllo" cuts é in half. Use
\`utf8.RuneStartInString\` to find safe boundaries, or convert to \`[]rune\` and index
there.`,
};

export const numericTypes: Lesson = {
  slug: 'numeric-types',
  title: 'Numeric types, overflow & untyped constants',
  sectionId: 'fundamentals',
  order: 7,
  runMode: 'playground',
  body: `Go's numeric types are sized and explicit: \`int8\`, \`int16\`, \`int32\`,
\`int64\`, \`uint\` and friends, \`float32\`, \`float64\`, \`complex64\`,
\`complex128\`, plus \`uintptr\`. On a 64-bit platform \`int\` is 64 bits wide, on a
32-bit platform it is 32 — which is why \`int\` is a bad choice for anything that
crosses a wire or lands on disk. Use \`int64\` or \`uint32\` for that and convert
explicitly.

Arithmetic on a fixed-width integer wraps around silently. There is no overflow
exception, and \`go vet\` will not catch it. A \`uint8\` counter at 255 becomes 0.

That is why the standard library has \`math.MaxUint8\`, \`math.MaxInt32\` and
friends, and why you will see this pattern:

\`\`\`go
if n > math.MaxInt32 {
    return errTooLarge
}
\`\`\`

Untyped constants are the escape hatch. A constant with no type is an arbitrary
precision number that takes the type of its context:

\`\`\`go
const Big = 1 << 40        // untyped, arbitrary precision
var x int64 = Big          // fine — 40 bits fit in int64
var y int = Big            // fine on 64-bit, compile error on 32-bit
var z float64 = Big        // fine — exactly representable
\`\`\`

An untyped constant that cannot be represented in the target type is a compile
error, not a runtime surprise. That is the property that makes constants safer
than variables.`,
  starterCode: `package main

import (
	"fmt"
	"math"
)

func main() {
	// Fixed-width integers wrap around silently.
	var u8 uint8 = 255
	u8++
	fmt.Println("uint8 overflow:", u8, "max is", math.MaxUint8)

	var i8 int8 = 127
	i8++
	fmt.Println("int8 overflow:", i8, "max is", math.MaxInt8)

	// int is platform-sized.
	fmt.Println("int bits:", 32<<(^uint(0)>>63), "maxint:", int64(math.MaxInt64))

	// Untyped constants are arbitrary precision and take the type of the context.
	const Big = 1 << 40
	var i64 int64 = Big
	var f64 float64 = Big
	fmt.Println("Big as int64:", i64, "as float64:", f64)

	// An untyped constant that does not fit is a compile error:
	// var bad int32 = Big  // cannot use Big (untyped int constant) as int32

	// Conversions between numeric types are explicit and may lose data.
	var large int64 = 3_000_000_000
	fmt.Println("int64 -> int32 (truncates):", int32(large))
	fmt.Println("int64 -> float64:", float64(large))
}
`,
  gotcha: `Integer overflow is silent in Go. \`uint8(255) + 1\` is 0, not an error.
For counters that must not wrap, compare against the max before incrementing, or
use a wider type.`,
};

/**
 * The lessons in this file, keyed by slug. The lazy loader imports the
 * section chunk and reads this record, so a lesson never has to be
 * reachable by a hard-coded switch — and the key comes from the lesson
 * itself, so the two can never drift apart.
 */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [variables, constantsIota, basicTypes, stringsRunesBytes, numericTypes].map((lesson) => [
    lesson.slug,
    lesson,
  ])
);
