import type { Lesson } from '../types';

const CLOCK_NOTE =
  'The Playground uses a deterministic fake clock; real runtime scheduling will differ.';

// 34. Goroutines
export const goroutines: Lesson = {
  slug: 'goroutines',
  title: 'Goroutines (cost, lifecycle)',
  section: 'H',
  order: 34,
  runMode: 'playground',
  note: CLOCK_NOTE,
  body: `A goroutine is a lightweight thread managed by the Go runtime. The
\`go\` keyword starts one; the call returns immediately. Goroutines start with
a tiny stack (~2KB) that grows as needed, so creating thousands is cheap.

Goroutines have no parent-child relationship: \`main\` does not wait for them.
When \`main\` returns, the program exits — even if other goroutines are still
running. Synchronize with channels, \`sync.WaitGroup\`, or a \`context\`.`,
  starterCode: `package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 3; i++ {
        time.Sleep(50 * time.Millisecond)
        fmt.Println(s, i)
    }
}

func main() {
    go say("hello")
    say("sync")
    // give the goroutine a moment to finish before main exits
    time.Sleep(200 * time.Millisecond)
}
`,
  streamReplay: true,
};

// 35. Channels
export const channels: Lesson = {
  slug: 'channels',
  title: 'Channels: unbuffered vs buffered, send/receive',
  section: 'H',
  order: 35,
  runMode: 'playground',
  note: CLOCK_NOTE,
  body: `Channels are typed conduits. \`make(chan int)\` is an **unbuffered** channel:
sends block until a receiver is ready, and vice versa. \`make(chan int, 3)\` is
buffered: sends succeed up to the buffer size without a receiver.

\`ch <- v\` sends; \`v := <-ch\` receives. The send/receive operator is
directional — \`chan<- int\` is a send-only type, \`<-chan int\` is receive-only.`,
  starterCode: `package main

import "fmt"

func main() {
    ch := make(chan string, 2)
    ch <- "a"
    ch <- "b"
    fmt.Println(<-ch, <-ch)

    sync := make(chan struct{})
    go func() {
        fmt.Println("from goroutine")
        close(sync)
    }()
    <-sync
}
`,
  streamReplay: true,
};

// 36. close, range, nil channels
export const closeRange: Lesson = {
  slug: 'close-range',
  title: '`close`, `range` over channels, nil channel behavior',
  section: 'H',
  order: 36,
  runMode: 'playground',
  note: CLOCK_NOTE,
  body: `\`close(ch)\` marks a channel as exhausted. Receiving from a closed
channel returns the zero value immediately; \`v, ok := <-ch\` reports
\`ok = false\`. \`for v := range ch\` consumes values until the channel is
closed.

\`close\` should only be called by the sender, never the receiver, and only
once. Sending on a closed channel **panics**.

A nil channel blocks forever on both send and receive. That makes it useful
in \`select\`: assigning \`ch = nil\` disables a case.`,
  starterCode: `package main

import "fmt"

func main() {
    jobs := make(chan int, 3)
    for i := 1; i <= 3; i++ {
        jobs <- i
    }
    close(jobs)
    for j := range jobs {
        fmt.Println("got job", j)
    }
    // This would panic: close(jobs); jobs <- 4
}
`,
  streamReplay: true,
  gotcha: 'Sending on a closed channel panics with "send on closed channel." Only the sender should close, and at most once.',
};

// 37. select
export const selectStatement: Lesson = {
  slug: 'select',
  title: '`select` (default case, timeouts with `time.After`)',
  section: 'H',
  order: 37,
  runMode: 'playground',
  note: CLOCK_NOTE,
  body: `\`select\` waits on multiple channel operations. If multiple are ready,
one is chosen at random. The \`default\` case fires immediately when no other
case is ready — a non-blocking \`select\`.

A common pattern is a timeout: a \`time.After\` channel sends once after a
duration, and the \`select\` selects whichever fires first.`,
  starterCode: `package main

import (
    "fmt"
    "time"
)

func main() {
    ch := make(chan string, 1)
    go func() {
        time.Sleep(100 * time.Millisecond)
        ch <- "slow result"
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
};

// 38. sync
export const syncMutex: Lesson = {
  slug: 'sync-mutex',
  title: '`sync`: `Mutex`, `RWMutex`, `WaitGroup`, `Once`, `Cond`',
  section: 'H',
  order: 38,
  runMode: 'playground',
  body: `\`sync.Mutex\` serializes access; \`sync.RWMutex\` allows concurrent reads
but exclusive writes. \`sync.WaitGroup\` is the simplest way to wait for a
batch of goroutines to finish. \`sync.Once\` guarantees a function runs at
most once across all goroutines.

\`sync.Cond\` is the right tool when goroutines need to wait for a state
change rather than a count, but channels usually replace it in modern code.`,
  starterCode: `package main

import (
    "fmt"
    "sync"
)

func main() {
    var wg sync.WaitGroup
    var mu sync.Mutex
    n := 0

    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            mu.Lock()
            n++
            mu.Unlock()
        }()
    }
    wg.Wait()
    fmt.Println("n =", n)
}
`,
};

// 39. sync/atomic
export const atomics: Lesson = {
  slug: 'atomics',
  title: '`sync/atomic` and the memory model in one paragraph',
  section: 'H',
  order: 39,
  runMode: 'playground',
  body: `\`sync/atomic\` provides lock-free operations on primitive types:
\`atomic.AddInt64\`, \`atomic.LoadInt64\`, \`atomic.StoreInt64\`, etc. The
generic helpers \`atomic.Int64{}\` and friends (Go 1.19+) are usually what
you want.

The Go memory model says: in a single goroutine, reads and writes happen in
program order. Across goroutines, synchronization (channels, mutexes, atomic
ops) is required to establish a happens-before relationship. Without it, the
compiler and CPU are free to reorder.`,
  starterCode: `package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {
    var n atomic.Int64
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() { defer wg.Done(); n.Add(1) }()
    }
    wg.Wait()
    fmt.Println("n =", n.Load())
}
`,
};

// 40. context.Context
export const context: Lesson = {
  slug: 'context',
  title: '`context.Context` — cancellation, deadlines, values (with anti-patterns)',
  section: 'H',
  order: 40,
  runMode: 'playground',
  body: `\`context.Context\` carries deadlines, cancellation signals, and
request-scoped values across API boundaries. A function that does I/O or
might block should accept a \`ctx\` as its first argument.

\`ctx.Done()\` returns a channel that closes when the context is cancelled
or its deadline expires. \`ctx.Err()\` explains why. Anti-patterns: putting
*required* values (user IDs, auth tokens) in a context — use explicit
parameters. \`context.Background()\` is the root; \`context.WithCancel\`,
\`WithTimeout\`, and \`WithDeadline\` derive from it.`,
  starterCode: `package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
    defer cancel()
    select {
    case <-time.After(500 * time.Millisecond):
        fmt.Println("work done")
    case <-ctx.Done():
        fmt.Println("cancelled:", ctx.Err())
    }
}
`,
  gotcha: 'Never put required values in a context. Context values are for request-scoped metadata, not for plumbing function arguments you could have passed directly.',
};
