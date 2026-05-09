import type { Lesson } from '../types';

export const closeRange: Lesson = {
  slug: 'close-range',
  title: 'close, range over channel, nil channel',
  sectionId: 'concurrency',
  order: 36,
  runMode: 'playground',
  body: `Only the **sender** should \`close\` a channel — to signal "no more values". \`for v := range ch\` exits when the channel is closed and drained. Receiving from a closed channel returns the zero value with \`ok=false\` (\`v, ok := <-ch\`).

Sending on a closed channel panics. Reads from a **nil** channel block forever — actually useful inside \`select\` to disable a case.`,
  starterCode: `package main

import "fmt"

func produce(ch chan<- int) {
	for i := range 3 {
		ch <- i
	}
	close(ch)
}

func main() {
	ch := make(chan int)
	go produce(ch)
	for v := range ch {
		fmt.Println(v)
	}
	v, ok := <-ch
	fmt.Println("after close:", v, ok) // 0 false
}
`,
  gotcha: `Sending on a closed channel **panics**, doesn't error. Receivers see closed-and-empty as the zero value with ok=false. The convention "only senders close" exists to make panics impossible.`,
  concurrencyNote: true,
};
