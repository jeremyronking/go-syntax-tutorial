import type { Lesson } from '../types';

export const syncMutex: Lesson = {
  slug: 'sync-mutex',
  title: 'sync — Mutex, WaitGroup, Once',
  sectionId: 'concurrency',
  order: 38,
  runMode: 'playground',
  body: `Channels aren't always the answer. For shared mutable state, \`sync.Mutex\` (or \`sync.RWMutex\` for read-heavy data) is the right tool. \`sync.WaitGroup\` waits for N goroutines to finish. \`sync.Once.Do(fn)\` runs \`fn\` exactly once across goroutines — perfect for lazy init.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
)

type SafeCounter struct {
	mu sync.Mutex
	n  int
}

func (c *SafeCounter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}

func main() {
	var c SafeCounter
	var wg sync.WaitGroup
	for range 100 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Inc()
		}()
	}
	wg.Wait()
	fmt.Println(c.n)
}
`,
  concurrencyNote: true,
};
