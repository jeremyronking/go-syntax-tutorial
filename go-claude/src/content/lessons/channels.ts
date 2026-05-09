import type { Lesson } from '../types';

export const channels: Lesson = {
  slug: 'channels',
  title: 'Channels — unbuffered vs buffered',
  sectionId: 'concurrency',
  order: 35,
  runMode: 'playground',
  body: `An unbuffered channel hands off synchronously: \`ch <- v\` blocks until another goroutine does \`<-ch\`. A buffered channel \`make(chan T, n)\` lets up to \`n\` sends queue without a receiver.

Channels are typed: \`chan<-\` is send-only, \`<-chan\` is receive-only. Use directional channel types in function signatures to encode intent.`,
  starterCode: `package main

import "fmt"

func main() {
	ch := make(chan int, 2) // buffered: holds 2
	ch <- 1
	ch <- 2
	close(ch)
	for v := range ch {
		fmt.Println(v)
	}
}
`,
  concurrencyNote: true,
};
