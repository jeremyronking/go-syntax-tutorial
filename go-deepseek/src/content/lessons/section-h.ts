import type { Lesson } from '../types';

const goroutines: Lesson = {
  slug: 'goroutines',
  title: 'Goroutines: cost, lifecycle, leaks',
  sectionId: 'concurrency',
  order: 34,
  runMode: 'playground',
  streamReplay: true,
  concurrencyNote: true,
  body: `\`go f()\` starts f on a goroutine: a few kilobytes of stack that grows as needed. The Go scheduler multiplexes them onto OS threads; you do not manage threads, and you should not think in thread counts.

A goroutine ends when its function returns. Nothing can stop one from outside, so the only lifecycle control you have is making the function return — usually by closing or canceling something it selects on. A goroutine blocked forever on a send or receive is a leak, and the program will not notice until memory or handles run out.`,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func worker(id int, done chan<- string) {
	time.Sleep(time.Duration(id) * 100 * time.Millisecond)
	done <- fmt.Sprintf("worker %d done", id)
}

func main() {
	done := make(chan string, 3)
	for i := 1; i <= 3; i++ {
		go worker(i, done)
	}
	for i := 0; i < 3; i++ {
		fmt.Println(<-done)
	}
}
`,
  gotcha:
    'Starting a goroutine you never join or cancel leaks it. If the function only sends on a channel nobody reads, it stays blocked for the life of the process.',
};

const channels: Lesson = {
  slug: 'channels',
  title: 'Channels: unbuffered vs buffered',
  sectionId: 'concurrency',
  order: 35,
  runMode: 'playground',
  streamReplay: true,
  concurrencyNote: true,
  body: `An unbuffered channel is a rendezvous: a send blocks until a receive is ready, and vice versa. A buffered channel decouples them up to its capacity; send blocks only when the buffer is full, receive only when it is empty.

\`make(chan T)\` is unbuffered, \`make(chan T, n)\` is buffered. \`len\` reports queued values, \`cap\` the buffer size. Buffering is not a performance knob you turn up by default — it changes synchronization semantics.`,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	handshake := make(chan int)
	go func() {
		fmt.Println("sender: about to block")
		time.Sleep(80 * time.Millisecond)
		handshake <- 42
	}()
	fmt.Println("receiver got", <-handshake)

	buffered := make(chan int, 2)
	buffered <- 1
	buffered <- 2
	fmt.Println("buffered len/cap:", len(buffered), cap(buffered))
	fmt.Println(<-buffered, <-buffered)
}
`,
  gotcha:
    'An unbuffered send blocks until a receiver arrives. If the only receiver is later in the same goroutine, you deadlock with a helpful "all goroutines are asleep" panic.',
};

const channelCloseRange: Lesson = {
  slug: 'channel-close-range',
  title: 'close, range, and nil channels',
  sectionId: 'concurrency',
  order: 36,
  runMode: 'playground',
  streamReplay: true,
  concurrencyNote: true,
  body: `\`close(ch)\` tells receivers no more values are coming. \`range ch\` drains until close, then exits. A receive from a closed channel succeeds immediately with the zero value and \`ok == false\`.

Only the sender should close, and only once. Sending on a closed channel panics; closing twice panics too. A nil channel blocks forever on send and receive — which makes it a useful "disabled case" in a \`select\`.`,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan int, 3)
	go func() {
		for i := 0; i < 3; i++ {
			time.Sleep(40 * time.Millisecond)
			ch <- i * 10
		}
		close(ch)
	}()

	for v := range ch {
		fmt.Println("value", v)
	}

	v, ok := <-ch
	fmt.Println("after close:", v, ok)

	var nilCh chan int
	select {
	case <-nilCh:
		fmt.Println("unreachable")
	default:
		fmt.Println("nil channel is disabled")
	}
}
`,
  gotcha:
    'Sending on a closed channel panics: `close(ch); ch <- 1` crashes with "send on closed channel". Closing is the sender\'s job, never the receiver\'s.',
};

const selectStatement: Lesson = {
  slug: 'select',
  title: 'select: readiness, default, timeouts',
  sectionId: 'concurrency',
  order: 37,
  runMode: 'playground',
  streamReplay: true,
  concurrencyNote: true,
  body: `\`select\` blocks until one case can proceed, then runs that case. If several are ready at once, it picks one uniformly at random — do not depend on case order. A \`default\` case makes the select non-blocking: if nothing is ready, it runs immediately.

Timeouts come from \`time.After(d)\`, which returns a channel that fires once. In a loop, prefer a \`time.Timer\` you reset or a context deadline; \`time.After\` allocates a timer per iteration.`,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	a := make(chan string)
	b := make(chan string)
	go func() { time.Sleep(20 * time.Millisecond); a <- "a ready" }()
	go func() { time.Sleep(50 * time.Millisecond); b <- "b ready" }()

	for i := 0; i < 2; i++ {
		select {
		case v := <-a:
			fmt.Println(v)
		case v := <-b:
			fmt.Println(v)
		}
	}

	select {
	case v := <-a:
		fmt.Println(v)
	default:
		fmt.Println("nothing ready: default runs")
	}

	select {
	case v := <-b:
		fmt.Println(v)
	case <-time.After(10 * time.Millisecond):
		fmt.Println("timed out")
	}
}
`,
  gotcha:
    'With multiple ready cases, select picks randomly. A loop that assumes one channel always wins will flake the first time both are buffered.',
};

const syncPackage: Lesson = {
  slug: 'sync-package',
  title: 'sync: Mutex, RWMutex, WaitGroup, Once, Cond',
  sectionId: 'concurrency',
  order: 38,
  runMode: 'playground',
  concurrencyNote: true,
  body: `\`sync.Mutex\` guards shared state; lock around every access, not just writes. \`sync.RWMutex\` allows concurrent readers until a writer arrives — worth it only when reads dominate. \`sync.WaitGroup\` is the join primitive: \`Add\` before starting, \`Done\` at the end, \`Wait\` to block. \`sync.Once\` runs a function exactly once across goroutines.

\`sync.Cond\` wakes waiters when a condition changes; it is rare in modern Go — channels or \`WaitGroup\` usually read better. Every sync type must not be copied after first use.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var (
		mu      sync.Mutex
		wg      sync.WaitGroup
		counter int
	)
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock()
			counter++
			mu.Unlock()
		}()
	}
	wg.Wait()
	fmt.Println("counter:", counter)

	var once sync.Once
	for i := 0; i < 3; i++ {
		once.Do(func() { fmt.Println("once ran") })
	}

	var rw sync.RWMutex
	value := 1
	rw.RLock()
	fmt.Println("read:", value)
	rw.RUnlock()
}
`,
  gotcha:
    'Never copy a type containing a Mutex (or WaitGroup). `func f(m sync.Mutex)` takes a copy and locks the wrong mutex; pass `*sync.Mutex` or embed it in a struct used by pointer.',
};

const atomicMemoryModel: Lesson = {
  slug: 'atomic-memory-model',
  title: 'sync/atomic and the memory model',
  sectionId: 'concurrency',
  order: 39,
  runMode: 'playground',
  concurrencyNote: true,
  body: `The memory model is the contract for what one goroutine may observe after another writes. In short: a read observes a write only when a synchronization edge orders them — a channel operation, a mutex, or an atomic.

\`sync/atomic\` supplies indivisible loads, stores, adds, and compare-and-swap on integers and pointers. Atomics are not a replacement for a mutex when several fields must change together; they are for single values and flag-style state.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var counter atomic.Int64
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			counter.Add(1)
		}()
	}
	wg.Wait()
	fmt.Println("count:", counter.Load())

	var ready atomic.Bool
	ready.Store(true)
	fmt.Println("ready:", ready.Load())

	var value atomic.Int64
	fmt.Println("CAS:", value.CompareAndSwap(0, 7), value.Load())
}
`,
  gotcha:
    'Two atomics are not one atomic operation. Updating a counter and a "last updated" timestamp separately lets readers observe a torn pair; use a mutex for that.',
};

const contextPackage: Lesson = {
  slug: 'context',
  title: 'context.Context: cancellation, deadlines, values',
  sectionId: 'concurrency',
  order: 40,
  runMode: 'playground',
  streamReplay: true,
  concurrencyNote: true,
  body: `\`context.Context\` carries cancellation, a deadline, and request-scoped values across API boundaries. Pass it as the first parameter, never store it in a struct. Derived contexts (\`WithCancel\`, \`WithTimeout\`) must have their cancel called to release resources.

Use \`ctx.Done()\` in long operations and select against it. Use values for request metadata that crosses package boundaries, not for optional parameters — a context value is untyped at the call site and invisible in signatures.`,
  starterCode: `package main

import (
	"context"
	"fmt"
	"time"
)

func worker(ctx context.Context, out chan<- string) {
	for i := 0; i < 5; i++ {
		select {
		case <-ctx.Done():
			out <- "canceled: " + ctx.Err().Error()
			return
		case <-time.After(20 * time.Millisecond):
			out <- fmt.Sprintf("step %d", i)
		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	out := make(chan string)

	go worker(ctx, out)
	fmt.Println(<-out)
	fmt.Println(<-out)
	cancel()
	fmt.Println(<-out)

	deadline, stop := context.WithTimeout(context.Background(), 15*time.Millisecond)
	defer stop()
	<-deadline.Done()
	fmt.Println("deadline:", deadline.Err())
}
`,
  gotcha:
    'Do not pass `nil` contexts or store one in a struct. `context.TODO()` exists for the first case; for the second, pass the context through the function that needs it.',
};

export const sectionHLessons: Lesson[] = [
  goroutines,
  channels,
  channelCloseRange,
  selectStatement,
  syncPackage,
  atomicMemoryModel,
  contextPackage,
  {
    slug: 'section-h-checkpoint',
    title: 'Section H checkpoint',
    sectionId: 'concurrency',
    order: 40.5,
    runMode: 'annotated',
    body: 'Five questions on the concurrency failures that show up in production: closed channels, nil channels, select behavior, and mutex copies.',
    checkpoint: {
      id: 'checkpoint-concurrency',
      sectionId: 'concurrency',
      title: 'Concurrency checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'What happens when you send on a closed channel?',
          options: ['The send is ignored', 'The send blocks forever', 'The program panics', 'The channel reopens'],
          correctIndex: 2,
          explanation:
            'Sending on a closed channel panics with "send on closed channel"; only the sender should close, and only once.',
        },
        {
          kind: 'mcq',
          prompt: 'A `select` with a `default` case and no ready channels...',
          options: [
            'Blocks until one is ready',
            'Runs default immediately',
            'Panics',
            'Picks a random case and blocks',
          ],
          correctIndex: 1,
          explanation:
            'default makes the select non-blocking; it runs when no other case can proceed.',
        },
        {
          kind: 'mcq',
          prompt: 'Receiving from a nil channel...',
          options: ['Returns the zero value', 'Panics', 'Blocks forever', 'Returns ok=false'],
          correctIndex: 2,
          explanation:
            'A nil channel is never ready; a plain receive blocks forever, which is why nil cases are used inside select to disable them.',
        },
        {
          kind: 'fill',
          prompt: 'Which sync type joins N goroutines? (name the type)',
          acceptedAnswers: ['WaitGroup', 'sync.WaitGroup'],
          explanation:
            'WaitGroup.Add before starting, Done when finished, Wait to block until the count reaches zero.',
        },
        {
          kind: 'mcq',
          prompt: 'Why is `func f(m sync.Mutex)` a bug?',
          options: [
            'Mutex cannot be a parameter',
            'It copies the mutex, so the lock is not shared',
            'It deadlocks immediately',
            'It is fine',
          ],
          correctIndex: 1,
          explanation:
            'sync types must not be copied after first use; the function locks a copy that no other goroutine sees.',
        },
      ],
    },
  },
];
