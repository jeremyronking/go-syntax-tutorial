import type { Lesson } from '../types';

export const numericTypes: Lesson = {
  slug: 'numeric-types',
  title: 'Numeric types & untyped constants',
  sectionId: 'fundamentals',
  order: 7,
  runMode: 'playground',
  body: `Signed and unsigned integers wrap on overflow — they don't panic. \`uint8(255) + 1\` is \`0\`. Use \`math.MaxInt32\` etc. when you need the bound.

Constants are untyped until assigned. \`const c = 1.5\` flows into a \`float32\` field, a \`float64\` parameter, or a \`*big.Float\` constructor without conversion. This is what lets numeric literals "just work" across types.`,
  starterCode: `package main

import (
	"fmt"
	"math"
)

func main() {
	var u uint8 = 255
	u++
	fmt.Println("uint8 wrap:", u) // 0

	fmt.Println(math.MaxInt32, math.MinInt32)

	const c = 1.5
	var f32 float32 = c
	var f64 float64 = c
	fmt.Println(f32, f64)
}
`,
  gotcha: `Integer overflow does NOT panic. Bounds-checking is your job — or use \`math/bits\` helpers like \`bits.Add64\`.`,
};
