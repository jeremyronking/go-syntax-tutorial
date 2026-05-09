import type { Lesson } from "../types";

export const sectionH: Lesson[] = [
  {
    slug: "goroutines",
    title: "Goroutines (cost, lifecycle)",
    section: "H",
    order: 34,
    body: `A goroutine is a lightweight thread managed by the Go runtime. Launch one with the \`go\` keyword.

\`\`\`go
package main

import (
    "fmt"
    "time"
)

func say(msg string) {
    for i := 0; i < 3; i++ {
        fmt.Println(msg)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    go say("world")
    say("hello")
}
\`\`\`

- Goroutines are cheap — thousands can run concurrently.
- The main function exits when \`main\` returns, killing all goroutines.
- No parent-child relationship — goroutines are independent.`,
    runMode: "playground",
    starterCode: `package main

import (
    "fmt"
    "time"
)

func say(msg string) {
    for i := 0; i < 3; i++ {
        fmt.Println(msg)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    go say("world")
    say("hello")
}`,
    streamReplay: true,
    gotcha: "The Playground uses a deterministic fake clock; real runtime scheduling will differ. Concurrency output order is non-deterministic — don't rely on it.",
  },
  {
    slug: "channels",
    title: "Channels: unbuffered vs buffered, send/receive",
    section: "H",
    order: 35,
    body: `Channels connect goroutines. Unbuffered channels block until both sender and receiver are ready.

\`\`\`go
package main

import "fmt"

func main() {
    // Unbuffered — blocks until receiver reads
    ch := make(chan int)
    go func() { ch <- 42 }()
    fmt.Println(<-ch)

    // Buffered — doesn't block until buffer is full
    buf := make(chan int, 2)
    buf <- 1
    buf <- 2
    // buf <- 3  // would block — buffer is full
    fmt.Println(<-buf)
    fmt.Println(<-buf)
}
\`\`\`

- \`make(chan int)\` creates an unbuffered channel.
- \`make(chan int, 2)\` creates a buffered channel with capacity 2.
- Send blocks when the channel (or buffer) is full; receive blocks when empty.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    ch := make(chan int)
    go func() { ch <- 42 }()
    fmt.Println(<-ch)

    buf := make(chan int, 2)
    buf <- 1
    buf <- 2
    fmt.Println(<-buf)
    fmt.Println(<-buf)
}`,
    streamReplay: true,
    gotcha: "Sending on a closed channel panics. Always close from the sender side, never from the receiver.",
  },
  {
    slug: "close-range-channels",
    title: "close, range over channels, nil channel behavior",
    section: "H",
    order: 36,
    body: `\`close\` signals that no more values will be sent. \`range\` over a channel reads until it's closed.

\`\`\`go
package main

import "fmt"

func fibonacci(n int, ch chan int) {
    x, y := 0, 1
    for i := 0; i < n; i++ {
        ch <- x
        x, y = y, x+y
    }
    close(ch)
}

func main() {
    ch := make(chan int)
    go fibonacci(10, ch)
    for v := range ch {
        fmt.Println(v)
    }
}
\`\`\`

- \`range\` on a channel reads values until the channel is closed.
- A nil channel blocks forever — useful for disabling branches in \`select\`.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func fibonacci(n int, ch chan int) {
    x, y := 0, 1
    for i := 0; i < n; i++ {
        ch <- x
        x, y = y, x+y
    }
    close(ch)
}

func main() {
    ch := make(chan int)
    go fibonacci(10, ch)
    for v := range ch {
        fmt.Println(v)
    }
}`,
    streamReplay: true,
    gotcha: "A nil channel never sends or receives — it blocks forever. Sending on a closed channel panics. These are the most common channel bugs.",
  },
  {
    slug: "select",
    title: "select (default case, timeouts)",
    section: "H",
    order: 37,
    body: `\`select\` lets a goroutine wait on multiple channel operations.

\`\`\`go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(100 * time.Millisecond)
        ch1 <- "one"
    }()
    go func() {
        time.Sleep(200 * time.Millisecond)
        ch2 <- "two"
    }()

    for i := 0; i < 2; i++ {
        select {
        case msg := <-ch1:
            fmt.Println("received", msg)
        case msg := <-ch2:
            fmt.Println("received", msg)
        }
    }
}
\`\`\`

- \`select\` picks a ready case at random if multiple are ready.
- \`default\` case runs immediately if no case is ready (non-blocking).
- Use \`time.After\` for timeouts.`,
    runMode: "playground",
    starterCode: `package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(100 * time.Millisecond)
        ch1 <- "one"
    }()
    go func() {
        time.Sleep(200 * time.Millisecond)
        ch2 <- "two"
    }()

    for i := 0; i < 2; i++ {
        select {
        case msg := <-ch1:
            fmt.Println("received", msg)
        case msg := <-ch2:
            fmt.Println("received", msg)
        }
    }
}`,
    streamReplay: true,
  },
  {
    slug: "sync-package",
    title: "sync: Mutex, RWMutex, WaitGroup, Once, Cond",
    section: "H",
    order: 38,
    body: `The \`sync\` package provides low-level synchronization primitives.

\`\`\`go
package main

import (
    "fmt"
    "sync"
)

var counter int

func main() {
    var wg sync.WaitGroup
    var mu sync.Mutex

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            mu.Lock()
            counter++
            mu.Unlock()
            wg.Done()
        }()
    }

    wg.Wait()
    fmt.Println("counter:", counter)
}
\`\`\`

- \`sync.Mutex\` protects shared state — Lock/Unlock.
- \`sync.RWMutex\` allows multiple readers or one writer.
- \`sync.WaitGroup\` waits for a collection of goroutines to finish.
- \`sync.Once\` ensures a function runs exactly once.`,
    runMode: "playground",
    starterCode: `package main

import (
    "fmt"
    "sync"
)

var counter int

func main() {
    var wg sync.WaitGroup
    var mu sync.Mutex

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            mu.Lock()
            counter++
            mu.Unlock()
            wg.Done()
        }()
    }

    wg.Wait()
    fmt.Println("counter:", counter)
}`,
    streamReplay: true,
  },
  {
    slug: "sync-atomic",
    title: "sync/atomic and the memory model",
    section: "H",
    order: 39,
    body: `For simple counters and flags, \`sync/atomic\` is faster than a mutex and avoids data races.

\`\`\`go
package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {
    var counter int64
    var wg sync.WaitGroup

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            atomic.AddInt64(&counter, 1)
            wg.Done()
        }()
    }

    wg.Wait()
    fmt.Println("counter:", atomic.LoadInt64(&counter))
}
\`\`\`

- \`atomic.AddInt64\`, \`atomic.LoadInt64\`, \`atomic.StoreInt64\`, \`atomic.CompareAndSwapInt64\`
- Use atomic operations for simple counters, not for complex state.
- The Go memory model: a send on a channel happens-before the corresponding receive.`,
    runMode: "playground",
    starterCode: `package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {
    var counter int64
    var wg sync.WaitGroup

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            atomic.AddInt64(&counter, 1)
            wg.Done()
        }()
    }

    wg.Wait()
    fmt.Println("counter:", atomic.LoadInt64(&counter))
}`,
    streamReplay: true,
  },
  {
    slug: "context",
    title: "context.Context — cancellation, deadlines, values",
    section: "H",
    order: 40,
    body: `\`context.Context\` is the standard way to carry deadlines, cancellation, and request-scoped values.

\`\`\`go
package main

import (
    "context"
    "fmt"
    "time"
)

func longTask(ctx context.Context) error {
    select {
    case <-time.After(5 * time.Second):
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}

func main() {
    // Cancel after 100ms
    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
    defer cancel()

    if err := longTask(ctx); err != nil {
        fmt.Println("task failed:", err)
    }
}
\`\`\`

- \`context.Background()\` is the root context.
- \`WithTimeout\`, \`WithCancel\`, \`WithDeadline\` derive cancelable contexts.
- Pass \`ctx\` as the first parameter to every function that does I/O.
- Do NOT use context values for passing business data — that's an anti-pattern.`,
    runMode: "playground",
    starterCode: `package main

import (
    "context"
    "fmt"
    "time"
)

func longTask(ctx context.Context) error {
    select {
    case <-time.After(5 * time.Second):
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
    defer cancel()

    if err := longTask(ctx); err != nil {
        fmt.Println("task failed:", err)
    }
}`,
    streamReplay: true,
    gotcha: "Context values should carry request-scoped data (trace IDs, auth tokens), not business parameters. If you're passing a user ID via context, reconsider your API design.",
  }
];

export const sectionHCheckpoint: Lesson["checkpoint"] = {
  "id": "checkpoint-h",
  "sectionSlug": "H",
  "questions": [
    {
      type: "mcq",
      "prompt": "What happens when you send on a closed channel?",
      "options": [
        "The send blocks forever",
        "The send returns a zero value",
        "The program panics",
        "The send succeeds with a zero value"
      ],
      "correctIndex": 2,
      "explanation": "Sending on a closed channel panics at runtime. Always close from the sender side, never from the receiver."
    },
    {
      type: "mcq",
      "prompt": "What does an unbuffered channel do when you send to it?",
      "options": [
        "Stores the value and returns immediately",
        "Blocks until a receiver is ready",
        "Buffers up to N values",
        "Panics if no goroutine is waiting"
      ],
      "correctIndex": 1,
      "explanation": "An unbuffered channel blocks the sender until a receiver reads the value. This is the synchronization guarantee."
    },
    {
      type: "mcq",
      "prompt": "What does select do when multiple cases are ready?",
      "options": [
        "Picks the first case in order",
        "Picks the last case in order",
        "Picks one at random",
        "Picks the case with the highest priority"
      ],
      "correctIndex": 2,
      "explanation": "When multiple select cases are ready, Go picks one at random. There's no priority ordering."
    },
    {
      type: "mcq",
      "prompt": "What does a nil channel do in a select statement?",
      "options": [
        "Causes a panic",
        "Is never selected (effectively disabled)",
        "Returns a zero value immediately",
        "Blocks forever"
      ],
      "correctIndex": 1,
      "explanation": "A nil channel is never selected in a select — it's effectively disabled. This is a useful pattern for dynamically enabling/disabling select branches."
    },
    {
      type: "mcq",
      "prompt": "What should context.Values NOT be used for?",
      "options": [
        "Carrying trace IDs",
        "Passing request-scoped auth tokens",
        "Passing business parameters like user IDs",
        "Carrying cancellation signals"
      ],
      "correctIndex": 2,
      "explanation": "Context values should carry request-scoped cross-cutting concerns (trace IDs, auth tokens), not business logic parameters."
    }
  ]
};
