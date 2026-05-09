import type { Lesson } from '../types';

export const ifStatement: Lesson = {
  slug: 'if-statement',
  title: 'if and the init statement',
  sectionId: 'control-flow',
  order: 8,
  runMode: 'playground',
  body: `\`if\` takes an optional **init statement** before the condition, and any variable declared there is scoped to the if/else chain. This is the canonical "call a function, check the return, branch" pattern.

No parentheses, mandatory braces. \`else\` and \`else if\` go on the same line as the closing brace.`,
  starterCode: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	if n, err := strconv.Atoi("42"); err == nil {
		fmt.Println("parsed:", n)
	} else {
		fmt.Println("oops:", err)
	}
	// n and err are NOT in scope here.
}
`,
};
