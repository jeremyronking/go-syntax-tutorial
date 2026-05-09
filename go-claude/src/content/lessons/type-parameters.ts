import type { Lesson } from '../types';

export const typeParameters: Lesson = {
  slug: 'type-parameters',
  title: 'Generics — type parameters & inference',
  sectionId: 'generics',
  order: 28,
  runMode: 'playground',
  body: `\`func F[T any](x T) T\` — the \`[T any]\` clause introduces a type parameter constrained by \`any\`. The compiler infers \`T\` at call sites in most cases; you can also write \`F[int](7)\` explicitly.`,
  starterCode: `package main

import "fmt"

func Map[T, U any](xs []T, f func(T) U) []U {
	out := make([]U, len(xs))
	for i, x := range xs {
		out[i] = f(x)
	}
	return out
}

func main() {
	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	upper := Map([]string{"go", "tour"}, func(s string) string { return s + "!" })
	fmt.Println(upper)
}
`,
};
