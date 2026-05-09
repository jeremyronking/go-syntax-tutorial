import type { Lesson } from '../types';

export const constantsIota: Lesson = {
  slug: 'constants-iota',
  title: 'Constants & iota',
  sectionId: 'fundamentals',
  order: 4,
  runMode: 'playground',
  body: `\`const\` values are computed at compile time and are *untyped* until assigned. That lets \`const Pi = 3.14\` flow into either \`float32\` or \`float64\` without conversion.

\`iota\` is a per-\`const\` block counter that resets to 0 and increments per spec. Repeating an expression on the next line is implicit: \`a; b\` makes \`b\` use the same expression as \`a\` with the new \`iota\`. That's how you express bit flags compactly.`,
  starterCode: `package main

import "fmt"

const (
	_  = iota             // 0, discarded
	KB = 1 << (10 * iota) // 1<<10
	MB                    // 1<<20 (expression repeats with iota=2)
	GB                    // 1<<30
)

type Perm int

const (
	Read Perm = 1 << iota // 1
	Write                 // 2
	Exec                  // 4
)

func main() {
	fmt.Printf("KB=%d MB=%d GB=%d\\n", KB, MB, GB)
	fmt.Printf("RW=%b\\n", Read|Write)
}
`,
  gotcha: `\`iota\` is *per const-block* and increments **per ConstSpec line**, not per identifier. Multiple identifiers on one line all see the same \`iota\`.`,
};
