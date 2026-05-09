import type { Lesson } from '../types';

export const arrays: Lesson = {
  slug: 'arrays',
  title: 'Arrays — fixed length, value semantics',
  sectionId: 'composite-types',
  order: 15,
  runMode: 'playground',
  body: `An array's length is part of its type. \`[3]int\` and \`[4]int\` are distinct types. Arrays are **values**: passing one to a function copies it. That's why most production code uses slices instead.

You'll meet arrays mostly as fixed-size headers, hash digests, and SIMD payloads.`,
  starterCode: `package main

import "fmt"

func main() {
	var a [3]int
	a[0], a[1], a[2] = 1, 2, 3
	fmt.Println(a, len(a))

	b := a       // COPY, not alias
	b[0] = 99
	fmt.Println("a:", a, "b:", b)

	// Array literals:
	c := [...]string{"x", "y", "z"} // length inferred as 3
	fmt.Println(c, len(c))
}
`,
};
