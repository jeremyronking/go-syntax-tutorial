import type { Lesson } from '../types';

export const typeAssertions: Lesson = {
  slug: 'type-assertions',
  title: 'Type assertions & comma-ok',
  sectionId: 'interfaces',
  order: 25,
  runMode: 'playground',
  body: `\`x.(T)\` extracts the concrete type behind an interface value. The single-result form panics if the dynamic type isn't \`T\`; the two-result \`v, ok := x.(T)\` returns \`ok=false\` instead. Always use comma-ok unless you've already proven the type.`,
  starterCode: `package main

import "fmt"

func main() {
	var x any = "hello"

	if s, ok := x.(string); ok {
		fmt.Println("string len", len(s))
	}

	if _, ok := x.(int); !ok {
		fmt.Println("not an int — handled gracefully")
	}

	// This would panic:
	// n := x.(int)
	_ = "n"
}
`,
};
