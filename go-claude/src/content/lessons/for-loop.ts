import type { Lesson } from '../types';

export const forLoop: Lesson = {
  slug: 'for-loop',
  title: 'for is the only loop',
  sectionId: 'control-flow',
  order: 9,
  runMode: 'playground',
  body: `Go has one loop keyword. Three forms:

- C-style: \`for i := 0; i < n; i++ { … }\`
- While: \`for cond { … }\`
- Infinite: \`for { … }\` — exit with \`break\` or \`return\`
- Range: \`for i, v := range coll { … }\` over slices, maps, strings, and (Go 1.22+) channels and integers

\`for i := range 5\` is the integer-range form added in 1.22 — convenient when you don't need a starting value.`,
  starterCode: `package main

import "fmt"

func main() {
	for i := 0; i < 3; i++ {
		fmt.Println("c-style", i)
	}

	xs := []string{"a", "b", "c"}
	for i, v := range xs {
		fmt.Println(i, v)
	}

	// Go 1.22+ integer range:
	for i := range 3 {
		fmt.Println("int-range", i)
	}
}
`,
};
