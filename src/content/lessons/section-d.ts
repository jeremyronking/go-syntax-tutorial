import type { Lesson } from '../types';

// 20. Functions
export const functionsLesson: Lesson = {
  slug: 'functions',
  title: 'Functions, multi-return, named returns, naked `return`',
  section: 'D',
  order: 20,
  runMode: 'playground',
  body: `Functions can return multiple values; the conventional last value is an
\`error\`. Named return values document the result and let a *naked* \`return\`
send back the current values — useful for short functions, but reduce clarity
in longer ones.`,
  starterCode: `package main

import "fmt"

func div(a, b int) (q, r int) {
    q, r = a/b, a%b
    return // naked return: returns q, r
}

func main() {
    q, r := div(17, 5)
    fmt.Println(q, r)
}
`,
};

// 21. Variadic functions
export const variadic: Lesson = {
  slug: 'variadic',
  title: 'Variadic functions, slice-spread with `...`',
  section: 'D',
  order: 21,
  runMode: 'playground',
  body: `A variadic parameter \`xs ...int\` becomes a slice inside the function.
Calling with a slice uses the \`...\` spread syntax: \`f(s...)\`. The trailing
parameter can be variadic; it cannot precede a non-variadic one.`,
  starterCode: `package main

import "fmt"

func sum(label string, xs ...int) int {
    total := 0
    for _, x := range xs {
        total += x
    }
    fmt.Println(label, "summed", len(xs), "nums")
    return total
}

func main() {
    fmt.Println(sum("a", 1, 2, 3))
    s := []int{4, 5, 6}
    fmt.Println(sum("b", s...))
}
`,
};

// 22. Closures
export const closures: Lesson = {
  slug: 'closures',
  title: 'First-class functions & closures',
  section: 'D',
  order: 22,
  runMode: 'playground',
  body: `Functions are values. A function literal can close over variables in
its enclosing scope. Each closure has its own captured variable; the same
expression in a loop produces distinct closures (on Go 1.22+ for the per-iter
variable).`,
  starterCode: `package main

import "fmt"

func makeCounter() func() int {
    n := 0
    return func() int {
        n++
        return n
    }
}

func main() {
    c := makeCounter()
    fmt.Println(c(), c(), c())

    add := func(a, b int) int { return a + b }
    fmt.Println(add(2, 3))
}
`,
};

// 23. Methods
export const methods: Lesson = {
  slug: 'methods',
  title: 'Methods, value vs pointer receivers, method sets, addressability',
  section: 'D',
  order: 23,
  runMode: 'playground',
  body: `A method is a function with a receiver. The receiver can be a value
or a pointer. Use a pointer receiver when the method mutates the value, when
the type is large (avoid copying), or when you need to keep the method set
consistent across value and pointer types.

The method set of \`T\` (value) includes only value-receiver methods. The
method set of \`*T\` includes both value- and pointer-receiver methods.
That's why \`io.Writer\` variables often hold \`*os.File\` — \`*os.File\` has
the \`Write\` method, which \`os.File\` (the value) does not.`,
  starterCode: `package main

import "fmt"

type Counter struct{ n int }

func (c *Counter) Inc() { c.n++ }
func (c Counter) Value() int { return c.n }

func main() {
    c := &Counter{}
    c.Inc(); c.Inc(); c.Inc()
    fmt.Println(c.Value())
}
`,
  gotcha: `Mixing value and pointer receivers in the same type is allowed but
confusing. Pick one (almost always pointer) and stay consistent.`,
};
