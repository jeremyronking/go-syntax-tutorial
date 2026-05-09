import type { Lesson } from '../types';

export const atomics: Lesson = {
  slug: 'atomics',
  title: 'sync/atomic & the memory model',
  sectionId: 'concurrency',
  order: 39,
  runMode: 'playground',
  body: `\`sync/atomic\` provides lock-free integer operations: \`atomic.AddInt64\`, \`atomic.LoadInt64\`, etc. Modern Go offers \`atomic.Int64\` and \`atomic.Pointer[T]\` typed wrappers with method syntax.

The Go memory model is happens-before-based: synchronization primitives (channel ops, mutex unlocks, atomic ops) establish ordering between reads and writes. Without them, you have a data race — undefined behavior.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var n atomic.Int64
	var wg sync.WaitGroup
	for range 1000 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			n.Add(1)
		}()
	}
	wg.Wait()
	fmt.Println(n.Load())
}
`,
  concurrencyNote: true,
};
