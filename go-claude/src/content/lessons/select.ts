import type { Lesson } from '../types';

export const selectLesson: Lesson = {
  slug: 'select',
  title: 'select — wait on multiple channels',
  sectionId: 'concurrency',
  order: 37,
  runMode: 'playground',
  body: `\`select\` blocks until one of its cases can proceed. If multiple cases are ready, one is chosen at random. A \`default\` case makes \`select\` non-blocking — useful for "try, otherwise back off".

\`time.After(d)\` returns a channel that fires after \`d\` — the canonical timeout pattern.`,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan string)
	go func() {
		time.Sleep(100 * time.Millisecond)
		ch <- "result"
	}()

	select {
	case v := <-ch:
		fmt.Println("got:", v)
	case <-time.After(50 * time.Millisecond):
		fmt.Println("timed out")
	}
}
`,
  streamReplay: true,
  concurrencyNote: true,
};
