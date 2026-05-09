import type { Lesson } from '../types';

export const typeSwitchLesson: Lesson = {
  slug: 'type-switch',
  title: 'Type switch',
  sectionId: 'control-flow',
  order: 12,
  runMode: 'playground',
  body: `\`switch v := x.(type)\` extracts the dynamic type behind an \`any\` (or any interface). Inside each case, \`v\` is bound to that type. Use it to discriminate over a closed set of variants — the Go shape of a sum type.`,
  starterCode: `package main

import "fmt"

func describe(x any) {
	switch v := x.(type) {
	case nil:
		fmt.Println("nil")
	case int:
		fmt.Printf("int: %d\\n", v)
	case string:
		fmt.Printf("string of len %d\\n", len(v))
	case []byte:
		fmt.Printf("%d bytes\\n", len(v))
	default:
		fmt.Printf("unknown %T\\n", v)
	}
}

func main() {
	describe(42)
	describe("hello")
	describe([]byte{1, 2, 3})
	describe(3.14)
}
`,
};
