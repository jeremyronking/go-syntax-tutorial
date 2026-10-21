import type { Lesson } from '../types';

export const channels: Lesson = {
  slug: 'channels',
  title: 'Channels: unbuffered vs buffered',
  sectionId: 'concurrency',
  order: 35,
  runMode: 'playground',
  streamReplay: true,
  note: 'Playground uses a deterministic fake clock; real runtime scheduling will differ.',
  body: `A channel is a typed, thread-safe queue with a fixed capacity. Sending on an
unbuffered channel blocks until a receiver is ready; sending on a buffered channel
blocks only when the buffer is full.

The unbuffered channel is a synchronisation point. The send and the receive are
guaranteed to happen at the same moment, so a value cannot be produced before a
consumer is ready for it. That is why an unbuffered channel is the right default when
you want the sender to apply back-pressure.

A buffered channel decouples the two. The sender fills the buffer and moves on; the
receiver drains it later. Capacity 1 is a common "mailbox" pattern — it lets one
goroutine produce ahead while another catches up, and it makes the handoff
non-blocking in the common case.

Both block the sender when the channel is full, and both block the receiver when the
channel is empty and closed. The difference is only in how much slack the buffer
absorbs.

The direction of the flow matters more than the buffer size. A channel of
\`chan int\` sends ints; to build a pipeline where stage two sends back to stage one
you need a second channel with the opposite direction, not a bidirectional one.`,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	// Unbuffered: the send blocks until the receiver is ready.
	unbuffered := make(chan int)

	go func() {
		time.Sleep(300 * time.Millisecond)
		fmt.Println("unbuffered: sending")
		unbuffered <- 42
	}()

	fmt.Println("unbuffered: waiting")
	value := <-unbuffered
	fmt.Println("unbuffered: received", value)

	// Buffered: the send completes immediately, up to the capacity.
	buffered := make(chan int, 2)
	buffered <- 1
	buffered <- 2
	fmt.Println("buffered: len", len(buffered), "cap", cap(buffered))

	go func() {
		time.Sleep(300 * time.Millisecond)
		fmt.Println("buffered: receiver draining")
		for v := range buffered {
			fmt.Println("buffered: got", v)
		}
	}()
}
`,
  gotcha: `A buffered channel does not change the *type* of the value it carries, and it does
not make the send non-blocking forever — only while there is room. \`len(ch)\` and
\`cap(ch)\` are the same for a freshly made channel, and differ once values are
buffered.`,
};
