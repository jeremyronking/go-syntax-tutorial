import type { Lesson } from '../types';

export const functions: Lesson = {
  slug: 'functions',
  title: 'Functions, multiple returns & named results',
  sectionId: 'functions',
  order: 20,
  runMode: 'playground',
  body: `Functions are declared with \`func\`. Parameters may be typed individually
or grouped, and results may be named:

\`\`\`go
func add(a, b int) int { return a + b }
func divmod(a, b int) (int, int) { return a / b, a % b }
\`\`\`

**Multiple return values** are how Go reports errors. The convention is that
the last result is an \`error\`, and \`nil\` means success:

\`\`\`go
func parse(s string) (int, error) {
    n, err := strconv.Atoi(s)
    if err != nil {
        return 0, fmt.Errorf("parse %q: %w", s, err)
    }
    return n, nil
}
\`\`\`

Callers use the comma-ok form to pick out the value they care about:

\`\`\`go
n, err := parse("42")
if err != nil { ... }
\`\`\`

**Named results** are declared in the signature and are scoped to the function
body. They start at their zero value, and a bare \`return\` returns whatever
they currently hold:

\`\`\`go
func countLines(s string) (n int, err error) {
    for range s {
        n++
    }
    return
}
\`\`\`

Named results are legal but rarely what you want — a bare \`return\` no longer
says what it returns, and the zero-value-plus-mutation pattern is easy to get
wrong. Use them for short functions where the names genuinely clarify.

A function with no results still needs the \`return\` keyword if you want to
exit early:

\`\`\`go
func log(msg string) {
    if msg == "" {
        return
    }
    ...
}
\`\`\`

Go has no default arguments and no function overloading. Variadic parameters
cover the "optional arguments" case.`,
  starterCode: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func add(a, b int) int {
	return a + b
}

// Multiple results — the last one is conventionally an error.
func divmod(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divmod: division by zero")
	}
	return a / b, nil
}

// Named results, plus a bare return.
func countWords(s string) (words int, err error) {
	if s == "" {
		err = fmt.Errorf("countWords: empty input")
		return
	}
	for _, w := range split(s) {
		if w != "" {
			words++
		}
	}
	return
}

func split(s string) []string {
	return strings.Fields(s)
}

// The comma-ok form at the call site.
func parse(s string) (int, error) {
	return strconv.Atoi(s)
}

func main() {
	fmt.Println("add:", add(2, 3))

	q, err := divmod(17, 5)
	fmt.Println("divmod:", q, err)

	_, err = divmod(1, 0)
	fmt.Println("divmod by zero:", err)

	w, err := countWords("the quick brown fox")
	fmt.Println("words:", w, err)

	_, err = countWords("")
	fmt.Println("empty:", err)

	n, err := parse("123")
	fmt.Println("parse:", n, err)
}
`,
  gotcha: `Go has neither default arguments nor overloading. Two functions with the
same name collide, and a caller must pass every parameter or use the variadic
form.`,
};

export const variadicFunctions: Lesson = {
  slug: 'variadic-functions',
  title: 'Variadic functions & slice spreading',
  sectionId: 'functions',
  order: 21,
  runMode: 'playground',
  body: `The last parameter of a function may be variadic — declared with \`...T\`.
Inside the function it is a slice:

\`\`\`go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}
\`\`\`

Call it with any number of arguments, including none:

\`\`\`go
sum()          // 0
sum(1, 2, 3)  // 6
\`\`\`

**A \`...\` in the call spreads a slice into individual arguments:**

\`\`\`go
nums := []int{1, 2, 3}
sum(nums...)   // same as sum(1, 2, 3)
\`\`\`

The same works for the variadic parameter of a function you are forwarding to:

\`\`\`go
func wrapper(nums ...int) int {
    return sum(nums...)
}
\`\`\`

Without the \`...\`, the slice is passed as a *single* argument — which is why a
variadic function cannot be called with a bare slice:

\`\`\`go
sum(nums)     // compile error: cannot use nums ([]int) as int value
\`\`\`

A variadic parameter of type \`...any\` is how \`fmt.Println\` and \`fmt.Printf\`
accept a variable number of arguments of mixed type.

One trap: if you pass a slice with \`...\` to a variadic function whose parameter
is \`...any\`, the element types must be assignable to \`any\` — they always are,
so that works. But spreading a \`[]int\` into a \`...string\` parameter is a
compile error, not a runtime one.

Another subtlety: inside the variadic function, the slice is a fresh slice
header over the arguments, but appending to it does not affect the caller.`,
  starterCode: `package main

import (
	"fmt"
	"strings"
)

func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

func average(nums ...float64) float64 {
	if len(nums) == 0 {
		return 0
	}
	total := 0.0
	for _, n := range nums {
		total += n
	}
	return total / float64(len(nums))
}

// ...any accepts mixed types.
func describe(prefix string, values ...any) string {
	parts := make([]string, 0, len(values))
	for _, v := range values {
		parts = append(parts, fmt.Sprintf("%v", v))
	}
	return prefix + strings.Join(parts, ", ")
}

// Forwarding: ... spreads the slice back out.
func wrapper(nums ...int) int {
	return sum(nums...)
}

// A non-variadic function takes a plain slice.
func sumSlice(nums []int) int {
	return sum(nums...)
}

func main() {
	// Any number of arguments, including none.
	fmt.Println("sum():", sum())
	fmt.Println("sum(1, 2, 3):", sum(1, 2, 3))

	// Spreading a slice into individual arguments.
	nums := []int{4, 5, 6}
	fmt.Println("sum(nums...):", sum(nums...))
	fmt.Println("sumSlice(nums):", sumSlice(nums), "<- slice as one argument")

	// Forwarding.
	fmt.Println("wrapper:", wrapper(nums...))

	// Mixed types via ...any.
	fmt.Println(describe("values:", 1, "two", 3.0, true))

	// Floating point.
	fmt.Println("average:", average(1, 2, 3, 4))
	fmt.Println("average of none:", average())

	// The variadic slice is independent of the caller's slice.
	inner := []int{1, 2, 3}
	outer := append(inner[:0:0], inner...)
	outer = append(outer, 99)
	fmt.Println("inner:", inner, "outer:", outer)
}
`,
  gotcha: `Passing a slice without \`...\` passes the slice as a single argument —
\`sum(nums)\` inside the function sees one element of type \`[]int\`, not three
\`int\`s, and will not compile for a \`...int\` parameter.`,
};

export const closures: Lesson = {
  slug: 'closures',
  title: 'First-class functions & closures',
  sectionId: 'functions',
  order: 22,
  runMode: 'playground',
  body: `Functions are values. You can assign them to variables, pass them to
other functions, and return them.

\`\`\`go
var format func(int) string = func(n int) string { return strconv.Itoa(n) }
add := func(a, b int) int { return a + b }
\`\`\`

A **closure** is a function that captures variables from the enclosing scope.
The captured variables outlive the enclosing function, and the closure sees
their *current* values:

\`\`\`go
func counter() func() int {
    n := 0
    return func() int {
        n++
        return n
    }
}
\`\`\`

Each call to \`counter()\` creates a fresh \`n\`, so two counters are
independent. But a single counter called twice shares its \`n\`:

\`\`\`go
c := counter()
fmt.Println(c()) // 1
fmt.Println(c()) // 2
\`\`\`

**The classic loop-capture bug** is the same one the 1.22 loop-variable change
fixed. Before Go 1.22, a closure capturing a loop variable saw the last value;
now each iteration has its own variable. Outside a loop, the rule has always
been per-declaration: two closures over the same variable share it.

Closures are how Go does dependency injection, callbacks, and memoisation
without an interface. They are also how you capture loop state deliberately:

\`\`\`go
func makeCounter(start int) func() int {
    return func() int {
        start++
        return start
    }
}
\`\`\`

Beware capturing a loop variable *by reference* inside a long-lived closure —
the value it sees may not be the one you expected when the closure finally
runs.`,
  starterCode: `package main

import "fmt"

func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func makeAdder(n int) func(int) int {
	return func(x int) int { return x + n }
}

// A closure over shared state, with a mutex-free demonstration.
func makeAccumulator() (func(int) int, func() int) {
	sum := 0
	add := func(n int) int {
		sum += n
		return sum
	}
	total := func() int { return sum }
	return add, total
}

func apply(f func(int) int, xs []int) []int {
	out := make([]int, 0, len(xs))
	for _, x := range xs {
		out = append(out, f(x))
	}
	return out
}

func main() {
	// Functions are values.
	double := func(x int) int { return x * 2 }
	fmt.Println("double(21):", double(21))

	// A closure keeps its captured variable alive.
	c := counter()
	fmt.Println(c(), c(), c())

	// Each call to counter() gets a fresh variable.
	c2 := counter()
	fmt.Println("independent:", c2(), c(), c2())

	// Closures capture the current value of the variable.
	add5 := makeAdder(5)
	add10 := makeAdder(10)
	fmt.Println(add5(1), add10(1))

	// Higher-order functions.
	fmt.Println("apply double:", apply(double, []int{1, 2, 3}))

	// Two closures over one variable.
	acc, total := makeAccumulator()
	acc(5)
	acc(7)
	fmt.Println("total:", total())

	// Go 1.22+: each loop iteration has its own variable.
	fns := make([]func() int, 0, 3)
	for i := 0; i < 3; i++ {
		fns = append(fns, func() int { return i })
	}
	for _, f := range fns {
		fmt.Print(f(), " ")
	}
	fmt.Println()
}
`,
  gotcha: `A closure captures the *variable*, not a snapshot of its value. Two
closures over the same variable share it, and a closure that outlives the loop
that created it sees whatever the variable holds when it finally runs.`,
};

export const methods: Lesson = {
  slug: 'methods',
  title: 'Methods, receivers & method sets',
  sectionId: 'functions',
  order: 23,
  runMode: 'playground',
  body: `A method is a function with a receiver. The receiver is the first
parameter, and it must be a named type defined in the same package:

\`\`\`go
type Counter struct{ n int }

func (c Counter) Get() int { return c.n }
func (c *Counter) Inc() { c.n++ }
\`\`\`

**Value vs pointer receivers.** A value receiver gets a *copy* of the
receiver; a pointer receiver gets a pointer to the original.

- Use a **pointer receiver** when the method mutates the receiver. A value
  receiver cannot mutate anything.
- Use a **pointer receiver** when the type is large — a copy per call is
  expensive.
- **Be consistent.** A type should have all value receivers or all pointer
  receivers, not a mix. Mixing is how you get a method that mysteriously does
  nothing.

\`\`\`go
c := Counter{}
c.Inc()      // pointer receiver — c is addressable, so Go takes &c for you
d := c
d.Inc()      // mutates d, not c
\`\`\`

**Method sets** decide what satisfies an interface:

- The method set of type \`T\` contains only the methods with value receivers.
- The method set of \`*T\` contains the methods with value receivers *and*
  pointer receivers.

So \`*T\` has a strictly larger method set than \`T\`. If an interface requires
a pointer-receiver method, only \`*T\` satisfies it — a plain \`T\` value does
not, even though \`T\` and \`*T\` are interchangeable in most other contexts.

**Addressability** is why \`c.Inc()\` works when \`c\` is a variable. You cannot
call a pointer-receiver method on a non-addressable value:

\`\`\`go
Counter{}.Inc()      // compile error
\`\`\`

But you *can* call a value-receiver method on a pointer, and Go dereferences
automatically.`,
  starterCode: `package main

import "fmt"

type Counter struct {
	n    int
	name string
}

// Value receiver: gets a copy.
func (c Counter) Get() int { return c.n }

// Pointer receiver: mutates the original.
func (c *Counter) Inc() { c.n++ }

// A value receiver cannot mutate anything.
func (c Counter) TryInc() { c.n++ }

// Both kinds are in the method set of *Counter.
type Getter interface{ Get() int }

func main() {
	c := Counter{name: "hits"}
	c.Inc()
	c.Inc()
	fmt.Println("counter:", c.Get(), c.name)

	// Copying the struct copies the value.
	d := c
	d.Inc()
	fmt.Println("c:", c.Get(), "d:", d.Get())

	// A value receiver mutates only its copy.
	e := Counter{}
	e.TryInc()
	fmt.Println("after TryInc:", e.Get())

	// Method sets: *Counter satisfies Getter, Counter does not.
	var g Getter = &c
	fmt.Println("via interface:", g.Get())

	// A non-addressable value cannot take the address, so a pointer-receiver
	// method is not callable on it:
	// Counter{}.Inc()  // compile error: cannot call pointer method on Counter literal

	// But a value-receiver method is fine.
	fmt.Println("literal value receiver:", Counter{n: 5}.Get())

	// A pointer can call value-receiver methods too.
	p := &c
	fmt.Println("via pointer:", p.Get())
}
`,
  gotcha: `A method with a value receiver cannot mutate the receiver — \`c.n++\`
inside \`func (c Counter) Inc()\` changes a copy and is silently lost. Use a
pointer receiver for anything that mutates, and keep one receiver style per
type.`,
};

/**
 * The lessons in this file, keyed by slug. The lazy loader imports the
 * section chunk and reads this record, so a lesson never has to be
 * reachable by a hard-coded switch — and the key comes from the lesson
 * itself, so the two can never drift apart.
 */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [functions, variadicFunctions, closures, methods].map((lesson) => [lesson.slug, lesson])
);
