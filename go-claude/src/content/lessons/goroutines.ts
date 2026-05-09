import type { Lesson } from '../types';

export const goroutines: Lesson = {
  slug: 'goroutines',
  title: 'Goroutines — cheap, scheduled, leakable',
  sectionId: 'concurrency',
  order: 34,
  runMode: 'playground',
  body: `\`go f()\` runs \`f\` on a goroutine — a lightweight thread the runtime multiplexes onto OS threads. Stacks start tiny (~2 KB) and grow on demand. You can have millions.

There is **no goroutine handle** — no \`.Join()\`, no cancellation primitive. Communicate via channels and contexts, or you'll leak goroutines.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var wg sync.WaitGroup
	for i := range 4 {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			time.Sleep(time.Duration(id) * 50 * time.Millisecond)
			fmt.Println("goroutine", id, "done")
		}(i)
	}
	wg.Wait()
	fmt.Println("all done")
}
`,
  streamReplay: true,
  concurrencyNote: true,
};
