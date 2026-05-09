import type { Lesson } from '../types';

export const loopVariableCapture: Lesson = {
  slug: 'loop-variable-capture',
  title: 'Loop variable capture (1.22+ semantics)',
  sectionId: 'control-flow',
  order: 10,
  runMode: 'playground',
  body: `Pre-1.22, a single loop variable was reused across iterations. Closures and goroutines that captured it all saw the *final* value — a real-world footgun that bit nearly every Go programmer once.

In **Go 1.22+** (the Playground's runtime), each iteration gets a fresh variable. Closures capture per-iteration. The example below would have surprised you under 1.21.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	for i := range 3 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			fmt.Println(i) // 0, 1, 2 in some order under 1.22+
		}()
	}
	wg.Wait()
}
`,
  gotcha: `If you ship code that must work on Go 1.21 or older, copy the loop variable explicitly: \`i := i\` at the top of the body. Under 1.22+ that's a no-op but harmless.`,
};
