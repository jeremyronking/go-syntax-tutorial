import type { Lesson } from '../types'

const fakeClockNote = "*Playground uses a deterministic fake clock; real runtime scheduling will differ.*\\n\\n"

export const sectionHLessons: Lesson[] = [
  {
    slug: 'goroutines',
    title: '34. Goroutines',
    section: 'Section H: Concurrency',
    order: 34,
    runMode: 'playground',
    streamReplay: true,
    body: fakeClockNote + `
A **goroutine** is a lightweight thread managed by the Go runtime. 

\`go f(x, y, z)\` starts a new goroutine running \`f(x, y, z)\`.
The evaluation of \`f\`, \`x\`, \`y\`, and \`z\` happens in the current goroutine and the execution of \`f\` happens in the new goroutine.

Goroutines run in the same address space, so access to shared memory must be synchronized.
    `,
    starterCode: `package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    go say("world")
    say("hello")
}`,
  },
  {
    slug: 'channels',
    title: '35. Channels',
    section: 'Section H: Concurrency',
    order: 35,
    runMode: 'playground',
    streamReplay: true,
    body: fakeClockNote + `
Channels are a typed conduit through which you can send and receive values with the channel operator, \`<-\`.
\`ch <- v\`    // Send v to channel ch.
\`v := <-ch\`  // Receive from ch, and assign value to v.

Like maps and slices, channels must be created before use: \`ch := make(chan int)\`.

By default, sends and receives block until the other side is ready. This allows goroutines to synchronize without explicit locks or condition variables.

Channels can be **buffered**. Provide the buffer length as the second argument to \`make\` to initialize a buffered channel: \`ch := make(chan int, 100)\`.
    `,
    gotcha: "Sends to a buffered channel block only when the buffer is full. Receives block when the buffer is empty.",
    starterCode: `package main

import "fmt"

func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum // send sum to c
}

func main() {
    s := []int{7, 2, 8, -9, 4, 0}

    c := make(chan int)
    go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)
    
    // We expect two results from the two goroutines
    x, y := <-c, <-c // receive from c

    fmt.Println(x, y, x+y)
    
    // Buffered channel
    ch := make(chan int, 2)
    ch <- 1
    ch <- 2
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}`,
  },
  {
    slug: 'close-range-nil-channel',
    title: '36. close, range, and nil channels',
    section: 'Section H: Concurrency',
    order: 36,
    runMode: 'playground',
    streamReplay: true,
    body: fakeClockNote + `
A sender can \`close\` a channel to indicate that no more values will be sent. Receivers can test whether a channel has been closed by assigning a second parameter: \`v, ok := <-ch\`.
\`ok\` is \`false\` if there are no more values to receive and the channel is closed.

The loop \`for i := range c\` receives values from the channel repeatedly until it is closed.

Sending on a closed channel will cause a **panic**.
A **nil channel** (uninitialized) blocks forever on both sends and receives.
    `,
    gotcha: "Only the sender should close a channel, never the receiver. Sending on a closed channel will panic.",
    starterCode: `package main

import (
    "fmt"
)

func fibonacci(n int, c chan int) {
    x, y := 0, 1
    for i := 0; i < n; i++ {
        c <- x
        x, y = y, x+y
    }
    close(c) // close the channel to break the range loop
}

func main() {
    c := make(chan int, 10)
    go fibonacci(cap(c), c)
    
    // Range receives until the channel is closed
    for i := range c {
        fmt.Println(i)
    }
}`,
  },
  {
    slug: 'select',
    title: '37. select',
    section: 'Section H: Concurrency',
    order: 37,
    runMode: 'playground',
    streamReplay: true,
    body: fakeClockNote + `
The \`select\` statement lets a goroutine wait on multiple communication operations.

A \`select\` blocks until one of its cases can run, then it executes that case. It chooses one at random if multiple are ready.

The \`default\` case in a \`select\` is run if no other case is ready. Use a \`default\` case to try a send or receive without blocking.
    `,
    starterCode: `package main

import (
    "fmt"
    "time"
)

func main() {
    tick := time.Tick(100 * time.Millisecond)
    boom := time.After(500 * time.Millisecond)
    
    for {
        select {
        case <-tick:
            fmt.Println("tick.")
        case <-boom:
            fmt.Println("BOOM!")
            return
        default:
            fmt.Println("    .")
            time.Sleep(50 * time.Millisecond)
        }
    }
}`,
  },
  {
    slug: 'sync-primitives',
    title: '38. sync package',
    section: 'Section H: Concurrency',
    order: 38,
    runMode: 'playground',
    body: fakeClockNote + `
Channels are great for communication, but sometimes you just need to synchronize execution or protect shared state. The \`sync\` package provides traditional concurrency primitives:

- **\`sync.Mutex\` / \`sync.RWMutex\`**: Mutual exclusion locks to protect shared memory.
- **\`sync.WaitGroup\`**: Wait for a collection of goroutines to finish.
- **\`sync.Once\`**: Ensure a function is only executed exactly once.
- **\`sync.Cond\`**: Wait for or announce the occurrence of an event.
    `,
    starterCode: `package main

import (
    "fmt"
    "sync"
    "time"
)

// SafeCounter is safe to use concurrently.
type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

// Inc increments the counter for the given key.
func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock() // Use defer to ensure the mutex is unlocked
    c.v[key]++
}

// Value returns the current value of the counter for the given key.
func (c *SafeCounter) Value(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.v[key]
}

func main() {
    c := SafeCounter{v: make(map[string]int)}
    var wg sync.WaitGroup
    
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Inc("somekey")
        }()
    }

    wg.Wait()
    fmt.Println("Final count:", c.Value("somekey"))
}`,
  },
  {
    slug: 'sync-atomic',
    title: '39. sync/atomic',
    section: 'Section H: Concurrency',
    order: 39,
    runMode: 'playground',
    body: fakeClockNote + `
The \`sync/atomic\` package provides low-level atomic memory primitives useful for implementing synchronization algorithms. 

For simple counters or state flags, atomic operations (\`atomic.AddInt64\`, \`atomic.LoadUint32\`, \`atomic.Value\`) can be significantly faster than using a \`sync.Mutex\`. However, they require careful adherence to the Go Memory Model and should generally be avoided in favor of channels or mutexes unless performance is absolutely critical.
    `,
    starterCode: `package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {
    var ops uint64
    var wg sync.WaitGroup

    for i := 0; i < 50; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for c := 0; c < 1000; c++ {
                // Safely increment the counter atomically
                atomic.AddUint64(&ops, 1)
            }
        }()
    }

    wg.Wait()
    fmt.Println("Total operations:", atomic.LoadUint64(&ops))
}`,
  },
  {
    slug: 'context',
    title: '40. context.Context',
    section: 'Section H: Concurrency',
    order: 40,
    runMode: 'playground',
    body: fakeClockNote + `
The \`context\` package defines the \`Context\` type, which carries deadlines, cancellation signals, and other request-scoped values across API boundaries and between processes.

Incoming requests to a server should create a \`Context\`, and outgoing calls to servers should accept a \`Context\`. The chain of function calls between them must propagate the \`Context\`.

**Anti-pattern**: Do not store Contexts inside a struct type; instead, pass a Context explicitly to each function that needs it, usually as the first parameter.
    `,
    starterCode: `package main

import (
    "context"
    "fmt"
    "time"
)

func doWork(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            // The context was cancelled!
            fmt.Println("Work cancelled:", ctx.Err())
            return
        case <-time.After(500 * time.Millisecond):
            fmt.Println("Working...")
        }
    }
}

func main() {
    // Create a context that cancels after 1.2 seconds
    ctx, cancel := context.WithTimeout(context.Background(), 1200*time.Millisecond)
    defer cancel() // Always defer cancel to release resources
    
    go doWork(ctx)
    
    // Wait for the context to be done before exiting main
    <-ctx.Done()
    
    // Sleep briefly to allow the goroutine to print its exit message
    time.Sleep(100 * time.Millisecond)
    fmt.Println("Main exiting.")
}`,
    checkpoint: {
      id: 'checkpoint-h',
      questions: [
        {
          id: 'cp-h-1',
          prompt: 'What happens if you send a value on a closed channel?',
          type: 'mcq',
          options: ['The value is discarded', 'The send blocks forever', 'The program panics', 'It returns an error'],
          correctIndex: 2,
          explanation: 'Sending on a closed channel causes a runtime panic. Channels should only be closed by the sender.'
        },
        {
          id: 'cp-h-2',
          prompt: 'What does a `default` case do in a `select` statement?',
          type: 'mcq',
          options: ['Executes if all other cases panic', 'Executes if no other communication is ready', 'Executes after all other cases', 'It acts as a fallback channel'],
          correctIndex: 1,
          explanation: 'The default case runs immediately if no other case in the select is ready to proceed.'
        },
        {
          id: 'cp-h-3',
          prompt: 'Which sync primitive would you use to wait for 10 goroutines to finish their work?',
          type: 'mcq',
          options: ['sync.Mutex', 'sync.Once', 'sync.WaitGroup', 'sync.Cond'],
          correctIndex: 2,
          explanation: 'A sync.WaitGroup is designed specifically to wait for a collection of goroutines to finish executing.'
        },
        {
          id: 'cp-h-4',
          prompt: 'What happens if you try to receive from an uninitialized (nil) channel?',
          type: 'mcq',
          options: ['It panics', 'It returns the zero value immediately', 'It blocks forever', 'It returns false for `ok`'],
          correctIndex: 2,
          explanation: 'Operations (both send and receive) on a nil channel block forever.'
        },
        {
          id: 'cp-h-5',
          prompt: 'What is the recommended way to pass a `context.Context` through an API boundary?',
          type: 'mcq',
          options: ['As a field in a struct', 'As the first parameter of a function', 'As a global variable', 'In a context channel'],
          correctIndex: 1,
          explanation: 'The standard Go convention is to pass the Context explicitly as the first parameter to functions that need it.'
        }
      ]
    }
  }
]
