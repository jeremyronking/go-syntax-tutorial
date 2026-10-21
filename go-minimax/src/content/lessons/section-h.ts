import type { Lesson } from '../types';

const DETERMINISTIC_NOTE =
  'Playground uses a deterministic fake clock; real runtime scheduling will differ.';

export const goroutines: Lesson = {
  slug: 'goroutines',
  title: 'Goroutines: cost & lifecycle',
  sectionId: 'concurrency',
  order: 34,
  runMode: 'playground',
  streamReplay: true,
  note: DETERMINISTIC_NOTE,
  body: `A goroutine is a lightweight thread managed by the Go runtime, not by the
OS. Starting one costs a few kilobytes of stack, where an OS thread costs
megabytes. You can have hundreds of thousands of them.

\`\`\`go
go doSomething()   // start and move on
\`\`\`

The \`go\` statement does not wait. The calling function continues
immediately, and the goroutine runs concurrently.

**\`main\` exiting kills everything.** When \`main\` returns, the program exits
and every other goroutine is terminated mid-flight. This is why the classic
"hello from a goroutine" sometimes prints nothing — the program finished
first. A \`time.Sleep\` in \`main\` usually hides the bug; a
\`sync.WaitGroup\` fixes it properly.

**Goroutines are not threads and not tasks.** They are cheap enough that the
idiomatic Go answer to "run this concurrently" is just "start a goroutine",
not "add a worker pool". The runtime multiplexes them onto OS threads.

**Leaked goroutines are the real hazard.** A goroutine blocked forever on a
channel, a mutex, or a timer keeps its stack alive for the life of the
program. If its lifetime is not tied to the work it is doing, you have a leak.
Every long-lived goroutine should have a clear way to stop.

The standard library's concurrency primitives — \`sync.WaitGroup\`,
\`sync.Mutex\`, \`context.Context\` — are all about making goroutine lifetime
explicit and safe.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
	"time"
)

func worker(id int, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Printf("worker %d started\\n", id)
	time.Sleep(200 * time.Millisecond)
	fmt.Printf("worker %d finished\\n", id)
}

func main() {
	// A goroutine runs concurrently with the caller.
	go fmt.Println("from a goroutine")

	// The main function keeps going.
	fmt.Println("main continues")

	// Without a WaitGroup, main may exit before the goroutine finishes.
	var wg sync.WaitGroup
	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go worker(i, &wg)
	}

	// Wait for all of them.
	wg.Wait()
	fmt.Println("all workers done")
}
`,
  gotcha: `A goroutine that is still running when \`main\` returns is killed
outright. If you see output missing at the end of a program, this is why —
and a \`time.Sleep\` is not the fix; a \`sync.WaitGroup\` is.`,
};

export const channelBasics: Lesson = {
  slug: 'channel-basics',
  title: 'Channels: unbuffered vs buffered',
  sectionId: 'concurrency',
  order: 35,
  runMode: 'playground',
  streamReplay: true,
  note: DETERMINISTIC_NOTE,
  body: `A channel is a typed, thread-safe queue with a fixed capacity. Sending on
an unbuffered channel blocks until a receiver is ready; sending on a buffered
channel blocks only when the buffer is full.

The unbuffered channel is a synchronisation point. The send and the receive
are guaranteed to happen at the same moment, so a value cannot be produced
before a consumer is ready for it. That is why an unbuffered channel is the
right default when you want the sender to apply back-pressure.

A buffered channel decouples the two. The sender fills the buffer and moves on;
the receiver drains it later. Capacity 1 is a common "mailbox" pattern — it
lets one goroutine produce ahead while another catches up, and it makes the
handoff non-blocking in the common case.

Both block the sender when the channel is full, and both block the receiver
when the channel is empty. The difference is only in how much slack the buffer
absorbs.

The direction of the flow matters more than the buffer size. A channel of
\`chan int\` sends ints; to build a pipeline where stage two sends back to
stage one you need a second channel with the opposite direction, not a
bidirectional one.

**The sender owns the channel.** By convention, the goroutine that creates a
channel sends on it and the goroutine that receives from it does not close
it. Closing is the sender's job, and it happens exactly once.`,
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

	// The third send would block — the buffer is full.
	// buffered <- 3

	go func() {
		time.Sleep(300 * time.Millisecond)
		fmt.Println("buffered: receiver draining")
		for v := range buffered {
			fmt.Println("buffered: got", v)
		}
	}()

	// A channel is directional by type: chan int only sends ints.
	// (Go 1.23+ has directional types, but they are rare in practice.)
}
`,
  gotcha: `A buffered channel does not change the *type* of the value it carries,
and it does not make the send non-blocking forever — only while there is room.
\`len(ch)\` and \`cap(ch)\` are the same for a freshly made channel, and differ
once values are buffered.`,
};

export const channelClose: Lesson = {
  slug: 'channel-close',
  title: '`close`, `range` over channels & nil channels',
  sectionId: 'concurrency',
  order: 36,
  runMode: 'playground',
  streamReplay: true,
  note: DETERMINISTIC_NOTE,
  body: `\`close(ch)\` signals that no more values will be sent. A receiver can
tell the difference between "the value is zero" and "the channel is done":

\`\`\`go
v, ok := <-ch
// ok is false when the channel is closed and drained
\`\`\`

**\`range\` over a channel** is the idiomatic consumer loop. It blocks until a
value arrives, and exits when the channel is closed *and* drained:

\`\`\`go
for v := range ch {
    fmt.Println(v)
}
// this line runs after the channel is closed
\`\`\`

**The rules:**

- Only the *sender* closes a channel. Closing from the receiver is a bug.
- Close a channel **once**. Closing twice panics.
- **Sending on a closed channel panics.** This is the classic race: goroutine A
  closes while goroutine B sends.
- **Receiving from a closed channel does not panic** — it returns the zero
  value immediately, forever. That is why the comma-ok form exists.
- You do not have to close a channel at all. It only matters when a receiver
  needs to know that no more values are coming. If the receiver just wants N
  values, close is unnecessary.

**A nil channel blocks forever.** Reading from or sending to a nil channel
blocks the goroutine indefinitely — it does not panic and it does not return.
This is occasionally useful (a channel variable that is "off" simply parks its
goroutine) but it is far more often a bug: a channel that was never
initialised.

\`select\` on a nil channel always takes the other branch, which is why a nil
channel is a clean way to disable a case.`,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func producer(ch chan<- int) {
	for i := 1; i <= 3; i++ {
		ch <- i
		time.Sleep(150 * time.Millisecond)
	}
	close(ch) // the sender closes, exactly once
}

func main() {
	ch := make(chan int)

	go producer(ch)

	// range exits when the channel is closed and drained.
	for v := range ch {
		fmt.Println("received", v)
	}
	fmt.Println("channel closed, range loop exited")

	// Receiving from a closed channel returns the zero value, with ok=false.
	closed := make(chan int)
	close(closed)
	v, ok := <-closed
	fmt.Printf("from closed channel: value=%d ok=%v\\n", v, ok)

	// A nil channel blocks forever — this goroutine never proceeds.
	var nilCh chan int
	go func() {
		fmt.Println("about to receive from a nil channel...")
		<-nilCh
		fmt.Println("this line never runs")
	}()

	time.Sleep(200 * time.Millisecond)
	fmt.Println("main is not blocked — the nil receive is parked in its own goroutine")
}
`,
  gotcha: `Sending on a closed channel panics — including from a different
goroutine, and including when the close and the send race. Only the sender
closes, and only once.`,
};

export const selectStatement: Lesson = {
  slug: 'select',
  title: '`select`: multiplexing, `default` & timeouts',
  sectionId: 'concurrency',
  order: 37,
  runMode: 'playground',
  streamReplay: true,
  note: DETERMINISTIC_NOTE,
  body: `\`select\` waits on several channel operations at once. It is Go's
multiplexer:

\`\`\`go
select {
case v := <-a:
    // a had a value
case v := <-b:
    // b had a value
}
\`\`\`

**Exactly one ready case is chosen.** If several are ready, one is picked
*pseudo-randomly* — not by priority, not by source order. If none is ready,
the \`select\` blocks.

**The \`default\` case makes it non-blocking.** If no other case is ready, the
default runs immediately:

\`\`\`go
select {
case v := <-ch:
    use(v)
default:
    // nothing was ready — carry on
}
\`\`\`

This is the non-blocking send and receive, and it is a common way to avoid
deadlocks.

**Timeouts** use \`time.After\`, which returns a channel that fires once:

\`\`\`go
select {
case v := <-ch:
    use(v)
case <-time.After(2 * time.Second):
    return errors.New("timed out")
}
\`\`\`

**Cancellation** is the same shape with a \`context.Context.Done()\` channel.

A \`select\` inside a \`for\` loop with a \`default\` is a spin loop, and a
spin loop burns CPU. Prefer blocking.

**A nil channel in a \`select\` is never ready**, so that case is simply
skipped — which makes nil channels a clean way to disable a branch:

\`\`\`go
var stop chan struct{}   // nil
select {
case <-stop:      // never ready while stop is nil
    return
case v := <-work:
    use(v)
}
\`\`\``,
  starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	a := make(chan string)
	b := make(chan string)

	// Two senders, one receiver.
	go func() {
		time.Sleep(200 * time.Millisecond)
		a <- "from a"
	}()
	go func() {
		time.Sleep(350 * time.Millisecond)
		b <- "from b"
	}()

	// select waits on both; the first to become ready wins.
	select {
	case msg := <-a:
		fmt.Println("got:", msg)
	case msg := <-b:
		fmt.Println("got:", msg)
	}
	fmt.Println("select returned")

	// The default case makes select non-blocking.
	empty := make(chan int)
	select {
	case v := <-empty:
		fmt.Println("got", v)
	default:
		fmt.Println("nothing was ready — default ran")
	}

	// A timeout. time.After returns a channel that fires once.
	slow := make(chan int)
	select {
	case v := <-slow:
		fmt.Println("got", v)
	case <-time.After(300 * time.Millisecond):
		fmt.Println("timed out")
	}

	// A nil channel is never ready, so that case is skipped entirely.
	var stop chan struct{}
	work := make(chan int, 1)
	work <- 7
	select {
	case <-stop:
		fmt.Println("never")
	case v := <-work:
		fmt.Println("got from work:", v)
	}
}
`,
  gotcha: `A \`select\` with several ready cases picks one at random, and a
\`select\` with no \`default\` blocks forever when nothing is ready. If several
goroutines send on the same channel, you cannot control which one a receiver
sees.`,
};

export const syncPrimitives: Lesson = {
  slug: 'sync-primitives',
  title: '`sync`: Mutex, RWMutex, WaitGroup, Once, Cond',
  sectionId: 'concurrency',
  order: 38,
  runMode: 'playground',
  streamReplay: true,
  note: DETERMINISTIC_NOTE,
  body: `The \`sync\` package has the primitives you need to coordinate goroutines
sharing state.

**\`sync.WaitGroup\`** waits for a set of goroutines to finish. \`Add\` before
starting, \`Done\` when finished, \`Wait\` to block:

\`\`\`go
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        work()
    }()
}
wg.Wait()
\`\`\`

Always \`defer wg.Done()\` so it runs even if the goroutine panics.

**\`sync.Mutex\`** guards a critical section. \`Lock\`/\`Unlock\`, and always
\`defer mu.Unlock()\`:

\`\`\`go
mu.Lock()
counter++
mu.Unlock()
\`\`\`

**\`sync.RWMutex\`** allows many concurrent readers or one exclusive writer. It
is only worth it when reads genuinely dominate — the bookkeeping is not free.

**\`sync.Once\`** runs a function exactly once, even under concurrent calls.
It is the clean way to do lazy initialisation:

\`\`\`go
var once sync.Once
var config *Config
func getConfig() *Config {
    once.Do(func() { config = loadConfig() })
    return config
}
\`\`\`

**\`sync.Cond\`** is a condition variable — a goroutine waits for a
notification rather than spinning. It is the low-level building block under
the hood, and you rarely need it directly.

**\`sync.Map\`** is a map optimised for one pattern: many goroutines reading a
stable key set and occasionally writing. For anything else, use a plain map
with a mutex — \`sync.Map\` has worse performance for the general case and a
subtler API.

**\`copy\` under a lock, not pointers.** The classic bug is returning a
pointer to a slice element while another goroutine appends, which reallocates
the backing array. Copy the data out while holding the lock.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
	"time"
)

type Counter struct {
	mu sync.Mutex
	n  int
}

func (c *Counter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}

func (c *Counter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.n
}

func main() {
	// WaitGroup: wait for a set of goroutines.
	var wg sync.WaitGroup
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			time.Sleep(time.Duration(5*(5-id)) * time.Millisecond)
			fmt.Printf("task %d done\\n", id)
		}(i)
	}
	wg.Wait()
	fmt.Println("all tasks finished")

	// Mutex: protect a counter from concurrent increments.
	c := &Counter{}
	var wg2 sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg2.Add(1)
		go func() {
			defer wg2.Done()
			c.Inc()
		}()
	}
	wg2.Wait()
	fmt.Println("counter:", c.Value())

	// Once: initialise exactly once, even if many goroutines ask.
	var once sync.Once
	var lazy *string
	get := func() *string {
		once.Do(func() {
			s := "initialised once"
			lazy = &s
		})
		return lazy
	}
	var wg3 sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg3.Add(1)
		go func() {
			defer wg3.Done()
			_ = get()
		}()
	}
	wg3.Wait()
	fmt.Println("lazy:", *lazy)

	// RWMutex: many readers, one writer.
	var rw sync.RWMutex
	data := map[string]int{"a": 1}
	read := func() {
		rw.RLock()
		defer rw.RUnlock()
		_ = data["a"]
	}
	write := func() {
		rw.Lock()
		defer rw.Unlock()
		data["b"] = 2
	}
	var wg4 sync.WaitGroup
	for i := 0; i < 5; i++ {
		wg4.Add(1)
		go func() { defer wg4.Done(); read() }()
		wg4.Add(1)
		go func() { defer wg4.Done(); write() }()
	}
	wg4.Wait()
	fmt.Println("data size:", len(data))
}
`,
  gotcha: `Always \`defer mu.Unlock()\` and \`defer wg.Done()\`. If the critical
section returns early or panics, the deferred call is what prevents the
program from deadlocking on the next acquisition.`,
};

export const atomicsAndMemoryModel: Lesson = {
  slug: 'atomics',
  title: '`sync/atomic` & the memory model in one paragraph',
  sectionId: 'concurrency',
  order: 39,
  runMode: 'playground',
  streamReplay: true,
  note: DETERMINISTIC_NOTE,
  body: `A mutex is often more than you need. For a single counter or a flag,
\`sync/atomic\` is faster and simpler:

\`\`\`go
var n atomic.Int64
n.Add(1)
fmt.Println(n.Load())
\`\`\`

The modern API is type-specific (\`atomic.Int64\`, \`atomic.Bool\`,
\`atomic.Pointer[T]\`) and is available since Go 1.19. The older
\`atomic.AddInt64(&n, 1)\` functions still work.

Atomic operations are *sequentially consistent* in Go's memory model: they
behave as if there were a single total order of atomic operations across all
goroutines, and a read observes the most recent write before it in that order.

**The memory model in one paragraph.** Go's memory model says: a
goroutine's *program order* is preserved, and a read of a variable \`x\`
observes the write that happens-before it. Synchronisation primitives
(channels, \`sync.Mutex\`, \`atomic\`, \`WaitGroup\`) create *happens-before*
edges. A \`go\` statement happens-before the goroutine it starts, and a channel
send happens-before the corresponding receive. Without such an edge, the
program has a **data race**, and the Go memory model does not define what you
will see — the compiler is allowed to reorder, cache, or eliminate the reads
and writes.

**The practical rule:** if two goroutines access the same variable and at
least one of them writes, you need synchronisation. If they only read, you are
fine.

**\`atomic.Pointer[T]\`** is the modern way to publish an immutable value
atomically — readers get a consistent snapshot without a lock.

The race detector (\`go test -race\`) will find data races for you. Run it
always; it is far cheaper than debugging a heisenbug.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

type Config struct {
	Name string
	Port int
}

var counter atomic.Int64
var flag atomic.Bool
var current atomic.Pointer[Config]

func main() {
	// Atomic counter — no mutex needed. The goroutines interleave, but
	// every Add is atomic, so the total is exact.
	var wg sync.WaitGroup
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			time.Sleep(time.Duration(20*(5-id)) * time.Millisecond)
			fmt.Printf("goroutine %d incremented to %d\\n", id, counter.Add(1))
		}(i)
	}
	wg.Wait()
	fmt.Println("atomic counter:", counter.Load())

	// Atomic bool.
	flag.Store(true)
	fmt.Println("flag:", flag.Load(), "swapped:", flag.CompareAndSwap(true, false))
	fmt.Println("flag after swap:", flag.Load())

	// Atomic pointer: publish an immutable value.
	cfg := &Config{Name: "api", Port: 8080}
	current.Store(cfg)
	read := current.Load()
	fmt.Printf("published: %s:%d\\n", read.Name, read.Port)

	// Swap lets you atomically replace the value.
	old := current.Swap(&Config{Name: "api-v2", Port: 9090})
	fmt.Printf("old: %s:%d new: %s:%d\\n", old.Name, old.Port,
		current.Load().Name, current.Load().Port)

	// The classic mutex version, for comparison — same answer, slower.
	var mu sync.Mutex
	n := 0
	var wg2 sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg2.Add(1)
		go func() {
			defer wg2.Done()
			mu.Lock()
			n++
			mu.Unlock()
		}()
	}
	wg2.Wait()
	fmt.Println("mutex counter:", n)
}
`,
  gotcha: `Atomics give you atomicity, not compound operations. \`x = atomic.AddInt64(&x, 1) + 1\`
is a race unless every access to \`x\` goes through the atomic. If you need to
read-modify-write a *set* of fields together, use a mutex.`,
};

export const contextPackage: Lesson = {
  slug: 'context',
  title: '`context.Context`: cancellation, deadlines, values',
  sectionId: 'concurrency',
  order: 40,
  runMode: 'playground',
  streamReplay: true,
  note: DETERMINISTIC_NOTE,
  body: `\`context.Context\` carries a deadline, a cancellation signal, and
request-scoped values across API boundaries.

**The two rules:**

1. Never store a \`Context\` in a struct. Pass it as the first argument, and
   name it \`ctx\`.
2. Never pass \`nil\` — use \`context.Background()\` for the root and
   \`context.TODO()\` when you are not sure yet.

**Cancellation.** \`context.WithCancel\` returns a context and a cancel
function. Call the cancel function when you are done — always \`defer\` it:

\`\`\`go
ctx, cancel := context.WithCancel(parent)
defer cancel()
\`\`\`

The \`Done()\` channel closes when the context is cancelled, and
\`ctx.Err()\` reports why.

**Deadlines and timeouts.** \`context.WithTimeout\` and
\`context.WithDeadline\` cancel the context automatically after a duration.
This is how you bound how long an operation may take.

**Values.** \`context.WithValue\` attaches a key/value pair. The key must be a
comparable type, and the convention is a private struct type so no other
package can collide with it.

**Anti-patterns:**

- Do not use a context to pass *required* function arguments. A context is for
  request-scoped metadata, not for the function's real inputs.
- Do not use \`context.WithValue\` as a general-purpose argument bag. If the
  value is needed by every layer, make it a parameter.
- Do not put a context in a struct field.
- Do not ignore the cancel function — a leaked context keeps its timer and its
  children alive.

**\`ctx.Done()\` in a \`select\`** is how you make any blocking operation
cancellable:

\`\`\`go
select {
case res := <-ch:
    return res
case <-ctx.Done():
    return ctx.Err()
}
\`\`\`

The rule of thumb: if a function takes a \`ctx\`, it should honour it.`,
  starterCode: `package main

import (
	"context"
	"fmt"
	"time"
)

// A private key type, so no other package can collide with it.
type ctxKey string

const requestIDKey ctxKey = "requestID"

func slowOperation(ctx context.Context, work time.Duration) (string, error) {
	select {
	case <-time.After(work):
		return "work finished", nil
	case <-ctx.Done():
		return "", fmt.Errorf("cancelled: %w", ctx.Err())
	}
}

func main() {
	// The root context.
	fmt.Println("background err:", context.Background().Err())

	// Cancellation.
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		time.Sleep(200 * time.Millisecond)
		fmt.Println("cancelling")
		cancel()
	}()
	result, err := slowOperation(ctx, 2*time.Second)
	fmt.Println("cancelled op:", result, err)

	// A timeout.
	tctx, tcancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
	defer tcancel()
	result, err = slowOperation(tctx, 2*time.Second)
	fmt.Println("timed out op:", result, err)

	// Values travel with the context.
	vctx := context.WithValue(context.Background(), requestIDKey, "req-42")
	fmt.Println("request id:", vctx.Value(requestIDKey))

	// A context can be cancelled from a parent.
	parent, cancelParent := context.WithCancel(context.Background())
	child, cancelChild := context.WithCancel(parent)
	defer cancelChild()
	go func() {
		time.Sleep(100 * time.Millisecond)
		cancelParent()
	}()
	<-child.Done()
	fmt.Println("child cancelled too:", child.Err())

	// ctx.Err() reports the reason.
	fmt.Println("deadline exceeded?", tctx.Err())
}
`,
  gotcha: `Never store a \`Context\` in a struct, and never pass \`nil\`. A
context that is never cancelled leaks its timer and its children for as long as
the parent lives — always \`defer cancel()\`.`,
};
