import type { Lesson } from '../types';

export const slices: Lesson = {
  slug: 'slices',
  title: 'Slices — header, append, aliasing traps',
  sectionId: 'composite-types',
  order: 16,
  runMode: 'playground',
  body: `A slice is a header: pointer + length + capacity. It points into a backing array. \`s[i:j]\` shares the array, so mutations through one slice can be seen through another.

\`append\` may grow the backing array (typically doubling), at which point the new slice is **disconnected** from the old. Whether append shares or not depends on capacity — that's the source of the canonical aliasing bug.`,
  starterCode: `package main

import "fmt"

func main() {
	a := []int{1, 2, 3, 4, 5}
	b := a[1:4] // shares backing array
	b[0] = 99
	fmt.Println("a:", a) // [1 99 3 4 5]
	fmt.Println("b:", b) // [99 3 4]

	// Three-index slicing limits capacity:
	c := a[1:3:3] // len=2, cap=2 — append will allocate
	c = append(c, 777)
	fmt.Println("a:", a) // unchanged
	fmt.Println("c:", c)
}
`,
  gotcha: `If you pass a slice to a function and it appends, the caller may or may not see the new elements depending on whether append reallocated. Don't write APIs that rely on either behavior — return the result like \`append\` does.`,
};
