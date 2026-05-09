import type { Lesson } from '../types';

export const basicTypes: Lesson = {
  slug: 'basic-types',
  title: 'Basic types & zero values',
  sectionId: 'fundamentals',
  order: 5,
  runMode: 'playground',
  body: `Numerics: \`int\`, \`int8/16/32/64\`, \`uint*\`, \`float32/64\`, \`complex64/128\`. Sized integers are exact widths; \`int\` is platform-sized (32 or 64). Booleans are \`bool\`. Strings are immutable byte sequences (UTF-8 by convention).

Every type has a **zero value** that's safe to use without initialization: \`0\` for numbers, \`false\` for bool, \`""\` for strings, \`nil\` for pointers, slices, maps, channels, interfaces, and functions. Conversions are always explicit: \`int(f64Value)\` — no implicit promotion.`,
  starterCode: `package main

import "fmt"

func main() {
	var (
		i int
		f float64
		b bool
		s string
	)
	fmt.Printf("%v %v %v %q\\n", i, f, b, s)

	// Explicit conversions only:
	var n int = 7
	var x float64 = float64(n) * 0.5
	fmt.Println(x)

	// This would NOT compile: var y float64 = n
}
`,
};
