import type { Lesson } from '../types';

export const deferLesson: Lesson = {
  slug: 'defer',
  title: 'defer (LIFO, eager argument capture)',
  sectionId: 'control-flow',
  order: 13,
  runMode: 'playground',
  body: `\`defer\` schedules a call to run when the surrounding function returns — even on panic. Multiple defers run in **LIFO** order. The canonical use is releasing resources next to acquiring them: \`f, _ := os.Open(...); defer f.Close()\`.

Arguments to the deferred call are evaluated **at the defer statement**, not at execution time. This trips up beginners.`,
  starterCode: `package main

import "fmt"

func main() {
	x := 1
	defer fmt.Println("deferred saw x =", x) // captures 1 NOW
	x = 99
	fmt.Println("inline, x is", x) // 99

	// LIFO order:
	for i := 1; i <= 3; i++ {
		defer fmt.Println("defer", i)
	}
	// prints: defer 3, defer 2, defer 1, then "deferred saw x = 1"
}
`,
  gotcha: `\`defer file.Close()\` inside a loop accumulates one defer per iteration and they all run when the function exits — not when the loop iteration ends. For per-iteration cleanup, factor the body into a helper function and \`defer\` there.`,
};
