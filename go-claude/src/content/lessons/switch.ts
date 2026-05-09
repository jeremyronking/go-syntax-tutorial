import type { Lesson } from '../types';

export const switchLesson: Lesson = {
  slug: 'switch',
  title: 'switch — no implicit fallthrough',
  sectionId: 'control-flow',
  order: 11,
  runMode: 'playground',
  body: `Cases do **not** fall through by default — opposite of C. Use \`fallthrough\` explicitly when you want it (rare).

Cases can be expressions, not just constants. \`switch { case x > 0: … }\` (no expression after \`switch\`) is the idiomatic if/else-if chain. Multiple values per case go comma-separated.`,
  starterCode: `package main

import "fmt"

func main() {
	x := 7
	switch {
	case x < 0:
		fmt.Println("negative")
	case x == 0:
		fmt.Println("zero")
	case x < 10:
		fmt.Println("small")
	default:
		fmt.Println("big")
	}

	// Multi-value case:
	day := "sat"
	switch day {
	case "sat", "sun":
		fmt.Println("weekend")
	default:
		fmt.Println("weekday")
	}
}
`,
};
