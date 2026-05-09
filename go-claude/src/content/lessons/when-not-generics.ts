import type { Lesson } from '../types';

export const whenNotGenerics: Lesson = {
  slug: 'when-not-generics',
  title: 'When NOT to reach for generics',
  sectionId: 'generics',
  order: 30,
  runMode: 'playground',
  body: `Generics earn their place in **collection algorithms** (Map, Filter, Min, Max), **container data structures**, and **constraint-driven helpers** like \`comparable\` map keys. They earn their cost (compile time, error messages, indirection) elsewhere.

Don't generify a function that takes one or two interface arguments — interfaces already give you polymorphism. Don't generify "to be future-proof". The Go style guide is clear: prefer concrete types, reach for generics when you have at least two callers.`,
  starterCode: `package main

import "fmt"

// FINE: a real algorithm over an unconstrained type
func First[T any](xs []T) (T, bool) {
	var zero T
	if len(xs) == 0 {
		return zero, false
	}
	return xs[0], true
}

// PROBABLY NOT: a one-liner that takes any
func PrintAny[T any](x T) { fmt.Println(x) }

func main() {
	if v, ok := First([]string{"a", "b"}); ok {
		fmt.Println(v)
	}
}
`,
  gotcha: `Reach for an interface first. Generics are for cases where the relationship between input and output types must be preserved (e.g., \`Map[T, U]\`).`,
};
