import type { Lesson } from '../types';

const functions: Lesson = {
  slug: 'functions',
  title: 'Functions, multiple returns, named results',
  sectionId: 'functions',
  order: 20,
  runMode: 'playground',
  body: `Functions return any number of values; the error-as-last-return convention is the one you will see everywhere. Named results are pre-declared variables in the function's scope, and a bare \`return\` returns their current values.

Named returns are useful for documentation and defer-based manipulation. They are a liability in long functions, where a naked \`return\` hides what is being returned.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
	"strings"
)

func divmod(a, b int) (int, int, error) {
	if b == 0 {
		return 0, 0, errors.New("division by zero")
	}
	return a / b, a % b, nil
}

func split(s string) (head, tail string) {
	parts := strings.SplitN(s, ":", 2)
	if len(parts) == 1 {
		return parts[0], ""
	}
	head, tail = parts[0], parts[1]
	return
}

func main() {
	q, r, err := divmod(17, 5)
	fmt.Println(q, r, err)

	h, t := split("host:port")
	fmt.Println(h, t)
}
`,
  gotcha:
    'A naked `return` with named results is legal but easy to misread. In anything longer than a few lines, return explicitly.',
};

const variadicFunctions: Lesson = {
  slug: 'variadic-functions',
  title: 'Variadic functions and slice spread',
  sectionId: 'functions',
  order: 21,
  runMode: 'playground',
  body: `A variadic parameter \`...T\` accepts zero or more arguments and arrives as a \`[]T\`. Inside the function it is just a slice, so \`len\`, \`range\`, and passing it on work normally.

To pass an existing slice, append \`...\`: \`f(s...)\`. Without the spread, a \`[]T\` is one argument of the wrong type. Only the final parameter can be variadic.`,
  starterCode: `package main

import "fmt"

func sum(label string, nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	fmt.Print(label, "=", total, " ")
	return total
}

func main() {
	sum("none")
	sum("pair", 1, 2)
	nums := []int{4, 5, 6}
	sum("spread", nums...)
	fmt.Println()
}
`,
  gotcha:
    'Passing a slice without `...` is a type error: `sum(s)` passes one `[]int`, not its elements. `sum(s...)` spreads them.',
};

const closures: Lesson = {
  slug: 'closures',
  title: 'First-class functions and closures',
  sectionId: 'functions',
  order: 22,
  runMode: 'playground',
  body: `Functions are values: assign them, pass them, return them, store them in maps. A function literal that references variables from its enclosing scope is a closure, and it keeps those variables alive.

Closures are the usual way to build small stateful helpers without a struct. Because loop variables are per-iteration since Go 1.22, the classic capture bug is gone — but closures still capture by reference, so mutating shared state inside one is visible outside.`,
  starterCode: `package main

import "fmt"

func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func apply(x int, f func(int) int) int { return f(x) }

func main() {
	next := counter()
	fmt.Print(next(), next(), next(), " ")

	ops := map[string]func(int, int) int{
		"add": func(a, b int) int { return a + b },
		"mul": func(a, b int) int { return a * b },
	}
	fmt.Println(ops["add"](2, 3), ops["mul"](2, 3))

	x := 10
	inc := func() { x++ }
	inc()
	fmt.Println(apply(x, func(v int) int { return v * 2 }))
}
`,
  gotcha:
    'Closures capture variables, not snapshots. If two closures see the same `x`, changing it in one is visible in the other.',
};

const methodsReceivers: Lesson = {
  slug: 'methods-receivers',
  title: 'Methods: value vs pointer receivers',
  sectionId: 'functions',
  order: 23,
  runMode: 'playground',
  body: `A method is a function with a receiver. A value receiver gets a copy; a pointer receiver gets the address and can mutate. Use a pointer receiver when the method mutates, when the struct is large, or when consistency with other methods matters.

Method sets decide interface satisfaction: \`T\` has the value-receiver methods, \`*T\` has both. That is why a type with any pointer-receiver method only satisfies an interface through its pointer.`,
  starterCode: `package main

import "fmt"

type Counter struct{ n int }

func (c Counter) Snapshot() int { return c.n }

func (c Counter) WrongInc() { c.n++ }

func (c *Counter) Inc() { c.n++ }

func main() {
	c := Counter{}
	c.WrongInc()
	c.Inc()
	c.Inc()
	fmt.Println("mutated:", c.n, "snapshot:", c.Snapshot())

	// Counter{}.Inc() does not compile: a composite literal is not addressable.
	p := &Counter{}
	p.Inc()
	fmt.Println(p.n)
}
`,
  gotcha:
    'A value receiver mutates a copy. `func (c Counter) Inc() { c.n++ }` compiles and silently does nothing to the caller\'s value.',
};

export const sectionDLessons: Lesson[] = [
  functions,
  variadicFunctions,
  closures,
  methodsReceivers,
  {
    slug: 'section-d-checkpoint',
    title: 'Section D checkpoint',
    sectionId: 'functions',
    order: 23.5,
    runMode: 'annotated',
    body: 'Four questions on returns, variadic spread, closures, and receiver choice.',
    checkpoint: {
      id: 'checkpoint-functions',
      sectionId: 'functions',
      title: 'Functions checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'Which receiver should a `Scale(factor int)` method use if it mutates the receiver?',
          options: [
            'Value receiver, because it is simpler',
            'Pointer receiver, because it mutates',
            'Either; Go copies automatically',
            'A receiver cannot mutate',
          ],
          correctIndex: 1,
          explanation:
            'Only a pointer receiver mutates the caller\'s value; a value receiver works on a copy.',
        },
        {
          kind: 'mcq',
          prompt: 'Given `func sum(nums ...int) int` and `s := []int{1, 2}`, which call passes the elements?',
          options: ['sum(s)', 'sum(s...)', 'sum(&s)', 'sum(s[0], s[1]) only'],
          correctIndex: 1,
          explanation:
            'The `...` spread expands the slice into the variadic parameter.',
        },
        {
          kind: 'fill',
          prompt: 'A `*T` method set contains the methods of `T` plus the methods declared with a ___ receiver.',
          acceptedAnswers: ['pointer', '*T', 'pointer receiver'],
          explanation:
            'Pointer types have both value- and pointer-receiver methods; value types have only value-receiver methods.',
        },
        {
          kind: 'mcq',
          prompt: 'What does `defer` do to arguments passed to the deferred call?',
          options: [
            'Evaluates them when the deferred call runs',
            'Evaluates them at the defer statement',
            'Evaluates them at function entry',
            'Nothing special',
          ],
          correctIndex: 1,
          explanation:
            'Arguments are evaluated immediately at the defer statement; the call itself runs at return.',
        },
      ],
    },
  },
];
