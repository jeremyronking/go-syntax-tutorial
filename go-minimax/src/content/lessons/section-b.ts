import type { Lesson } from '../types';

export const ifStatements: Lesson = {
  slug: 'if-statements',
  title: '`if` and its init statement',
  sectionId: 'control-flow',
  order: 8,
  runMode: 'playground',
  body: `Go's \`if\` is the one control construct that has a built-in scope. The
condition is a boolean expression — no truthiness, no \`!= 0\`, no \`null\` check.

The optional *init statement* is the part worth knowing:

\`\`\`go
if v, err := strconv.Atoi(s); err != nil {
    // v and err are visible here
} else {
    // and here too
}
// v and err are gone out here
\`\`\`

The declared variables are scoped to the whole \`if\`/\`else\` chain, which makes
the "parse it, check the error, use the value" pattern a single statement instead
of three. The idiomatic form puts the error check first and returns early, so the
happy path stays at the left margin:

\`\`\`go
if err := doThing(); err != nil {
    return err
}
\`\`\`

Two more details:

- The \`else\` binds to the nearest \`if\`, but Go's "no dangling else" rule means
  the compiler figures it out for you. You can still indent the \`else\` under the
  closing brace of the \`if\` for readability — \`gofmt\` preserves that.
- An \`if\` with an init statement can shadow an outer variable of the same name.
  This is often what you want and occasionally a bug factory.

There is no \`do...while\`. Use a \`for\` loop, or \`for { ... }\` with a \`break\`.`,
  starterCode: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	// The init statement's variables are scoped to the if/else.
	if v, err := strconv.Atoi("42"); err != nil {
		fmt.Println("bad number:", err)
	} else {
		fmt.Println("parsed:", v, v*2)
	}

	// The idiomatic error-first shape: check the error, then use the value.
	if n, err := strconv.Atoi("oops"); err != nil {
		fmt.Println("expected failure:", err)
	} else {
		fmt.Println("parsed:", n)
	}

	// The scope ends at the end of the chain.
	// fmt.Println(v)  // undefined: v

	// Short-circuit evaluation: && stops as soon as the left side is false,
	// so the right side is never evaluated.
	count := 0
	if count != 0 && bump(&count) {
		fmt.Println("never")
	}
	fmt.Println("count is still:", count) // 0 — bump was never called

	// With a true left side, the right side does run.
	if count == 0 && bump(&count) {
		fmt.Println("bump ran")
	}
	fmt.Println("count is now:", count) // 1

	// else-if chains are ordinary; there is no switch needed for a ladder.
	grade := 87
	switch {
	case grade >= 90:
		fmt.Println("A")
	case grade >= 80:
		fmt.Println("B")
	default:
		fmt.Println("C or below")
	}
}

func bump(n *int) bool {
	*n++
	return true
}
`,
  gotcha: `Variables declared in an \`if\` init statement are scoped to the whole
if/else chain, but the \`else\` branch is optional. If you write

    if v, err := f(); err != nil {
        return err
    }
    use(v)

that is a compile error — \`v\` is out of scope on the next line. Declare the value
outside the \`if\` if you need it afterwards.`,
};

export const forLoops: Lesson = {
  slug: 'for-loops',
  title: '`for`: three clauses, `while`, and `range`',
  sectionId: 'control-flow',
  order: 9,
  runMode: 'playground',
  body: `Go has one loop keyword, and it covers every case. The three-clause form is
the C form, minus the parentheses:

\`\`\`go
for i := 0; i < 10; i++ {
    // ...
}
\`\`\`

All three clauses are optional, and each omission changes the meaning:

| Form | Meaning |
|---|---|
| \`for i := 0; i < 10; i++ {}\` | classic counted loop |
| \`for i < 10 { i++ }\` | while-style |
| \`for {}\` | infinite loop |
| \`for range xs {}\` | iterate over anything iterable |

There is no \`while\` and no \`do...while\` in Go — the \`for\` form covers both. A
\`do...while\` is \`for { ...; if !cond { break } }\`.

The \`range\` form is the one you will use most. It iterates over a slice, array,
string, map, or channel, and it gives you an index and a value:

\`\`\`go
for i, v := range xs { ... }
for _, v := range xs { ... }   // ignore the index
for i := range xs { ... }      // ignore the value
\`\`\`

The single-variable form (\`for v := range xs\`) only works for a slice, array or
string, where the one value is the element (or the rune). Over a map it gives
you the *key*, and over a channel it gives you the received value.

Range over a **map** gives you keys and values in *random* order — the runtime
randomises the start point, so never depend on map iteration order. If you need
deterministic order, sort the keys.

Range over a **string** decodes UTF-8 and gives you a byte index and a rune.
Range over a **channel** receives until the channel is closed.

The loop variable is declared by the \`for\` itself in the three-clause form, so
\`for i := 0; ...\` gives you an \`i\` scoped to the loop.`,
  starterCode: `package main

import "fmt"

func main() {
	// Three-clause form.
	sum := 0
	for i := 1; i <= 10; i++ {
		sum += i
	}
	fmt.Println("sum 1..10:", sum)

	// While-style: only the condition.
	i := 0
	for i < 3 {
		fmt.Println("while i:", i)
		i++
	}

	// Infinite loop with a break.
	count := 0
	for {
		count++
		if count == 3 {
			break
		}
	}
	fmt.Println("count:", count)

	// range over a slice.
	fruits := []string{"apple", "pear", "plum"}
	for idx, name := range fruits {
		fmt.Printf("%d: %s\\n", idx, name)
	}

	// Blank identifier when you only need one of the two.
	for _, name := range fruits {
		fmt.Println("fruit:", name)
	}

	// range over a string decodes UTF-8.
	for off, r := range "héllo" {
		fmt.Printf("byte %d -> %c\\n", off, r)
	}

	// range over a map: order is deliberately random.
	scores := map[string]int{"a": 1, "b": 2, "c": 3}
	for k, v := range scores {
		fmt.Println("map:", k, v)
	}
}
`,
  gotcha: `Range over a map visits keys in a random order, and Go deliberately
randomises the starting bucket. Two runs of the same program can print the map in
different orders. Sort the keys if you need stable output.`,
};

export const loopVariableCapture: Lesson = {
  slug: 'loop-variable-capture',
  title: 'Loop variable capture: pre-1.22 vs 1.22+',
  sectionId: 'control-flow',
  order: 10,
  runMode: 'playground',
  body: `Go's loop variable is a single variable that is reused across iterations.
For decades that meant a classic footgun:

\`\`\`go
for _, v := range values {
    go func() { fmt.Println(v) }()   // all print the LAST value
}
\`\`\`

The goroutines share one \`v\`, and by the time they run, the loop has finished
overwriting it. The fix used to be to pass a copy into the closure:

\`\`\`go
for _, v := range values {
    v := v                        // shadow with a per-iteration copy
    go func() { fmt.Println(v) }()
}
\`\`\`

**Go 1.22 changed this.** As of Go 1.22, each iteration of a \`for\` loop creates
*new* variables for the loop variable, so the per-iteration copy is the default
and the old bug is gone. Modules whose \`go.mod\` says \`go 1.22\` or later get
the new semantics; modules declaring an older version keep the old behaviour.

This is a compatibility-preserving change, and it is one of the rare cases where
a new Go release silently changes the behaviour of old code — in a good
direction, but old code that *relied* on the shared variable (a rare but real
pattern) will behave differently.

The new semantics also apply to the three-clause form and to \`range\` loops, and
they apply to closures *and* to goroutines, and even to pointer-to-loop-variable
patterns.

The lesson below demonstrates the 1.22+ behaviour. To see the old behaviour, add
\`v := v\` back and the goroutines will all print the last value again.`,
  starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	values := []string{"first", "second", "third"}

	// Go 1.22+: each iteration has its own loop variable.
	var wg sync.WaitGroup
	for _, v := range values {
		wg.Add(1)
		go func() {
			defer wg.Done()
			fmt.Println("goroutine sees:", v)
		}()
	}
	wg.Wait()

	// The same holds for the three-clause form.
	var wg2 sync.WaitGroup
	for i := 0; i < 3; i++ {
		wg2.Add(1)
		go func() {
			defer wg2.Done()
			fmt.Println("index:", i)
		}()
	}
	wg2.Wait()

	// Taking the address is per-iteration too, so the pointers are distinct.
	ptrs := make([]*int, 0, 3)
	for i := 0; i < 3; i++ {
		ptrs = append(ptrs, &i)
	}
	for _, p := range ptrs {
		fmt.Println("pointed to:", *p)
	}
}
`,
  note: 'This lesson shows the Go 1.22+ per-iteration loop variable. Modules declaring `go 1.21` or earlier keep the old shared-variable semantics.',
  gotcha: `The 1.22 fix only applies to modules whose \`go.mod\` declares \`go 1.22\`
or later. The Playground always runs a modern toolchain, so you will see the new
behaviour here even if the code you paste into an older repository behaves
differently.`,
};

export const switchStatement: Lesson = {
  slug: 'switch',
  title: '`switch`: no fallthrough, expression-less, multi-value',
  sectionId: 'control-flow',
  order: 11,
  runMode: 'playground',
  body: `Go's \`switch\` is more capable than C's. Three variations matter.

**No fallthrough.** Unlike C, cases do not fall through to the next one. Each
matching case runs and then the switch ends. You can opt back in with an explicit
\`fallthrough\` statement, which is rare but occasionally useful for grouped
behaviour.

**Expression-less switch.** A switch with no expression is \`if\`/\`else\` in
disguise, with a much tidier syntax:

\`\`\`go
switch {
case score >= 90:
    // ...
case score >= 80:
    // ...
}
\`\`\`

This is the only way to write an \`if\`/\`else if\` chain in Go — there is no
\`else if\` keyword, but a switch without an expression handles it.

**Multi-value switch.** A switch with no expression can compare a comma-separated
list of expressions against each case, like a pattern match:

\`\`\`go
switch x, y := f(); {
case x < y:
    // ...
}
\`\`\`

Cases can also be expression lists, and they are evaluated in order:

\`\`\`go
switch day {
case "sat", "sun":
    // weekend
}
\`\`\`

A \`switch\` on a value can also have a \`default\`. The default is optional and
runs when no case matches. \`break\` inside a case is redundant — the switch
already stops there — but it is the way to break out of a case that contains a
loop.`,
  starterCode: `package main

import "fmt"

func main() {
	// Expression switch, no fallthrough.
	switch day := "sat"; day {
	case "sat", "sun":
		fmt.Println("weekend")
	case "fri":
		fmt.Println("nearly there")
	default:
		fmt.Println("weekday")
	}

	// Cases are evaluated in order; the first match wins.
	switch n := 2; {
	case n > 5:
		fmt.Println("big")
	case n > 1:
		fmt.Println("medium")
	case n > 0:
		fmt.Println("small")
	default:
		fmt.Println("not positive")
	}

	// Expression-less switch: an if/else chain.
	score := 84
	switch {
	case score >= 90:
		fmt.Println("A")
	case score >= 80:
		fmt.Println("B")
	default:
		fmt.Println("C")
	}

	// Multi-value switch: compare several values at once.
	switch x, y := 3, 8; {
	case x < y:
		fmt.Println("x is less than y")
	case x == y:
		fmt.Println("equal")
	default:
		fmt.Println("x is greater")
	}

	// fallthrough is explicit if you want it.
	switch n := 1; n {
	case 1:
		fmt.Println("one")
		fallthrough
	case 2:
		fmt.Println("one or two")
	default:
		fmt.Println("something else")
	}
}
`,
  gotcha: `Go's \`switch\` does not fall through by default, so a stack of cases that
each need the previous one's work requires an explicit \`fallthrough\` — and
\`fallthrough\` must be the last statement in the case body, and it cannot be used
in a type switch.`,
};

export const typeSwitch: Lesson = {
  slug: 'type-switch',
  title: '`switch` on types: the type switch',
  sectionId: 'control-flow',
  order: 12,
  runMode: 'playground',
  body: `A type switch dispatches on the *dynamic* type of an interface value:

\`\`\`go
switch v := i.(type) {
case int:
    // v has type int
case string:
    // v has type string
default:
    // v has the type of i
}
\`\`\`

Note the \`v := i.(type)\` form. It declares a new variable whose type changes
per case — inside \`case int\`, \`v\` is an \`int\`; in \`default\`, it has the
static type of \`i\`. If you do not need the value, write \`switch i.(type)\` and
the cases simply test the type.

**The rule for what a case matches.** A case that lists *concrete* types matches
the dynamic type exactly: a value whose dynamic type is \`int\` does not match
\`case int64\`. But a case that lists an *interface* type matches anything that
implements it:

\`\`\`go
var i any = &myError{"boom"}
switch i.(type) {
case error:      // matches — *myError implements error
    // ...
}
\`\`\`

That interface rule still applies when the case lists several types. In
\`case error, string\`, the value matches if it implements \`error\` *or* is a
\`string\` — a \`*myError\` matches on the \`error\` half. A type that implements
neither, like \`*plain\`, does not match.

The consequence to remember: the type of the \`v\` variable. A case listing
exactly one type gives \`v\` that type — so inside \`case error\`, \`v\` has the
*concrete* type \`*myError\`, not \`error\`. As soon as a case lists more than
one type, \`v\` keeps the static type of the switched expression, and you have
to assert to get anything more specific.

**Ordering matters.** The first matching case wins, so put the most specific
cases first. \`case nil\` matches when the interface value itself is nil — but
only if it comes before the general cases, and it must be written \`case nil\`,
not \`case nil:\` with a type.

A type switch is the idiomatic way to handle "I have no idea what concrete type
this is" without a chain of assertions. It is also how \`encoding/json\` and
friends decode into \`any\`.`,
  starterCode: `package main

import "fmt"

func describe(i any) string {
	// The v := i.(type) form gives v the case's concrete type.
	switch v := i.(type) {
	case int:
		return fmt.Sprintf("int %d, doubled is %d", v, v*2)
	case string:
		return fmt.Sprintf("string %q, length %d", v, len(v))
	case bool:
		return fmt.Sprintf("bool %v", v)
	case []int:
		return fmt.Sprintf("slice of %d ints", len(v))
	case nil:
		return "nil interface"
	default:
		return fmt.Sprintf("unknown type %T", v)
	}
}

// A type that implements the error interface.
type myError struct{ msg string }

func (e *myError) Error() string { return e.msg }

func main() {
	fmt.Println(describe(21))
	fmt.Println(describe("hello"))
	fmt.Println(describe(true))
	fmt.Println(describe([]int{1, 2, 3}))
	fmt.Println(describe(nil))

	// A case listing an interface type matches anything implementing it,
	// so *myError hits the error case below — and v keeps its concrete type.
	var i any = &myError{"boom"}
	switch v := i.(type) {
	case error:
		fmt.Println("matched error; v's type is", fmt.Sprintf("%T", v))
	default:
		fmt.Println("did NOT match error — type is", fmt.Sprintf("%T", i))
	}

	// Adding a second type does not disable the interface rule: the value
	// matches on the error half. A type implementing neither would miss.
	switch i.(type) {
	case error, string:
		fmt.Println("multi-type case matched (via the error half)")
	default:
		fmt.Println("multi-type case did NOT match — type is", fmt.Sprintf("%T", i))
	}

	// But the type of v changes: with more than one type in the case, v
	// keeps the static type of the switched expression, so you need an
	// assertion to reach the concrete value.
	switch v := i.(type) {
	case error, string:
		if e, ok := v.(error); ok {
			fmt.Println("asserted back to error:", e)
		}
	}

	// A type assertion uses the interface, and has a comma-ok form.
	if e, ok := i.(error); ok {
		fmt.Println("assertion succeeded:", e)
	}

	// Without the comma-ok form it panics on failure.
	// _ = i.(int)
}
`,
  gotcha: `A type switch case that lists an interface type matches any value
implementing it — \`case error\` catches a \`*myError\`, and so does
\`case error, string\`. The rule that bites is the type of the \`v\` variable: a
single-type case gives \`v\` that exact type, but a multi-type case leaves \`v\`
as the interface type, so you need an assertion to use it.`,
};

export const deferStatement: Lesson = {
  slug: 'defer',
  title: '`defer`: LIFO order and argument evaluation timing',
  sectionId: 'control-flow',
  order: 13,
  runMode: 'playground',
  body: `\`defer\` schedules a call to run when the *enclosing function* returns. The
function must be a call — \`defer fmt.Println("x")\` is fine, \`defer someBool\` is
not.

Three rules, and the third one surprises everybody:

**1. Deferred calls run in LIFO order.** The last one deferred runs first.

**2. Deferred calls run when the function returns** — including on an early
\`return\`, and including on a panic (during unwinding). They do *not* run if the
process exits via \`os.Exit\`.

**3. Arguments are evaluated immediately, at the \`defer\` statement — not when
the deferred call actually runs.** The function is called later; its arguments
are computed now.

That third rule is the gotcha. This is a **bug**:

\`\`\`go
func main() {
    for i := 0; i < 3; i++ {
        defer fmt.Println("deferred", i)
    }
}
\`\`\`

…if the intent was to print 2, 1, 0, it still prints 0, 0, 0, because \`i\` is
evaluated to 0 three times, right away. The fix is to wrap the call in a closure
so the read happens later:

\`\`\`go
defer func() { fmt.Println("deferred", i) }()
\`\`\`

The closure form now prints 2, 1, 0 — the value is read when the deferred call
actually runs. Passing \`i\` to a *helper function* has the same problem: the
argument is still evaluated at the \`defer\` statement, so
\`defer printIt(i)\` also captures 0. Only a closure defers the read.

The other classic trap is deferring inside a loop: you accumulate one deferred
call per iteration, and they all fire at the end of the function, not at the end
of the iteration. For per-iteration cleanup, move the loop body into its own
function so each iteration's defers run when that function returns.

\`defer\` also takes a timing cost — the runtime stores the call in a stack —
which is why it is not free in a hot loop.`,
  starterCode: `package main

import "fmt"

func work() {
	defer fmt.Println("deferred 1 (runs last)")
	defer fmt.Println("deferred 2 (runs first)")
	fmt.Println("body runs here")
}

func counter() (result int) {
	// Arguments are evaluated NOW...
	x := 41
	defer fmt.Println("deferred, x =", x) // prints 41, not 42
	x++

	// ...but the call happens later, and can even change the result.
	defer func() { result++ }()
	return 10
}

func main() {
	work()
	fmt.Println("counter returned:", counter())

	// Defer inside a loop: all three fire at the end, with the value
	// captured at defer time — so all three print 0.
	for i := 0; i < 3; i++ {
		defer fmt.Println("loop defer", i)
	}
	fmt.Println("loop done")

	// The closure form reads the variable at call time: 2, 1, 0.
	for i := 0; i < 3; i++ {
		defer func() { fmt.Println("closure defer", i) }()
	}
	fmt.Println("closure loop done")
}
`,
  gotcha: `\`defer f(x)\` evaluates \`x\` immediately but calls \`f\` later. If you
need the value as of the moment the deferred call runs, wrap it in a closure:
\`defer func() { f(x) }()\`. The same rule explains why \`defer\` inside a loop
prints the same value every time.`,
};

export const gotoAndLabels: Lesson = {
  slug: 'goto-and-labels',
  title: '`goto`, labels, and labeled `break`/`continue`',
  sectionId: 'control-flow',
  order: 14,
  runMode: 'playground',
  body: `Go has a \`goto\` statement, and it is famously discouraged by the style
guide. It cannot jump into a block or over a variable declaration, and it is
almost never the right answer. The real use of labels is \`break\` and
\`continue\`.

**Labeled \`break\`** exits the labeled loop, not just the innermost one:

\`\`\`go
outer:
for i := 0; i < 3; i++ {
    for j := 0; j < 3; j++ {
        if j == 1 {
            break outer   // leaves both loops
        }
    }
}
\`\`\`

**Labeled \`continue\`** continues the *labeled* loop rather than the innermost
one, which is how you skip the rest of the current iteration of an outer loop:

\`\`\`go
outer:
for i := 0; i < 3; i++ {
    for j := 0; j < 3; j++ {
        if j == 1 {
            continue outer   // next iteration of the outer loop
        }
        fmt.Println(i, j)
    }
}
\`\`\`

Labeled \`continue\` is a rare, hard-to-read tool. If you find yourself needing
it, a helper function with an early \`return\` usually reads better.

A plain \`goto\` is legal as long as it does not jump over variable declarations
into their scope. \`goto done\` at the end of a long function, with \`done:\
at the bottom, is an accepted way to express "jump to cleanup" without a nest of
\`if\`s — but it is still frowned upon in most codebases.

The one thing to never do is use \`goto\` to emulate a loop; \`for\` exists.`,
  starterCode: `package main

import "fmt"

func main() {
	// Labeled break: leaves both loops.
outer:
	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			if j == 1 {
				break outer
			}
			fmt.Println("inner:", i, j)
		}
	}
	fmt.Println("after labeled break")

	// Labeled continue: next iteration of the outer loop.
outer2:
	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			if j == 1 {
				continue outer2
			}
			fmt.Println("kept:", i, j)
		}
	}
	fmt.Println("after labeled continue")

	// goto: legal, but use sparingly.
	i := 0
loop:
	if i < 3 {
		fmt.Println("goto loop:", i)
		i++
		goto loop
	}
	fmt.Println("after goto")

	// A goto that jumps over a declaration into its scope is a compile error:
	// goto skip
	// x := 1
	// skip:
	// fmt.Println(x)
}
`,
  gotcha: `A \`goto\` may not jump over a variable declaration into that variable's
scope — the compiler rejects it. And \`break\` inside a \`switch\` only leaves the
switch, not the surrounding loop; use a label to break out of both.`,
};

/**
 * The lessons in this file, keyed by slug. The lazy loader imports the
 * section chunk and reads this record, so a lesson never has to be
 * reachable by a hard-coded switch — and the key comes from the lesson
 * itself, so the two can never drift apart.
 */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [
    ifStatements,
    forLoops,
    loopVariableCapture,
    switchStatement,
    typeSwitch,
    deferStatement,
    gotoAndLabels,
  ].map((lesson) => [lesson.slug, lesson])
);
