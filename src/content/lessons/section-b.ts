import type { Lesson } from '../types';

// 8. if
export const ifStatement: Lesson = {
  slug: 'if-statement',
  title: '`if` (incl. init statement)',
  section: 'B',
  order: 8,
  runMode: 'playground',
  body: `\`if\` runs a statement before the condition. The variable declared in
that statement is scoped to the if/else chain — a tidy way to limit a value's
lifetime. No parens around the condition; braces are mandatory.`,
  starterCode: `package main

import "fmt"

func main() {
    if n := 9; n%2 == 0 {
        fmt.Println("even")
    } else {
        fmt.Println("odd:", n)
    }
}
`,
};

// 9. for
export const forLoop: Lesson = {
  slug: 'for-loop',
  title: '`for` (the only loop)',
  section: 'B',
  order: 9,
  runMode: 'playground',
  body: `Go has a single loop keyword, \`for\`, that plays three roles:

- Three-clause: \`for i := 0; i < n; i++ {}\`
- While-style: \`for cond {}\`
- Infinite: \`for {}\`
- Range: \`for k, v := range slice {}\` (or map, channel, string)`,
  starterCode: `package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        fmt.Println("three-clause:", i)
    }
    n := 0
    for n < 3 {
        n++
    }
    fmt.Println("while-style end:", n)

    for i, c := range []string{"a", "b", "c"} {
        fmt.Println("range:", i, c)
    }
}
`,
};

// 10. Loop variable capture
export const loopVariableCapture: Lesson = {
  slug: 'loop-variable-capture',
  title: 'Loop variable capture (pre-1.22 vs 1.22+)',
  section: 'B',
  order: 10,
  runMode: 'playground',
  body: `Pre-1.22, the loop variable in \`for k, v := range xs\` was a single
binding reused on each iteration. Capturing \`v\` in a goroutine or closure
captured the *latest* value — a classic footgun.

Go 1.22 changed the semantics: the spec now defines the per-iteration variable
as a fresh binding each loop turn. Existing programs keep working; new programs
get the intuitive behavior by default.

This Playground runs Go 1.22+, so both loops below print 1, 2, 3.`,
  starterCode: `package main

import "fmt"

func main() {
    vals := []int{1, 2, 3}
    out := make([]func() int, len(vals))
    for i, v := range vals {
        v := v // pre-1.22 workaround; on 1.22+ this is a no-op
        out[i] = func() int { return v }
    }
    for _, fn := range out {
        fmt.Println(fn())
    }
}
`,
  gotcha: `If you have to support pre-1.22 toolchains, declare a fresh
\`v := v\` (or use the index) inside the loop. On 1.22+ the spec makes that
unnecessary, but it is harmless.`,
};

// 11. switch
export const switchStatement: Lesson = {
  slug: 'switch',
  title: '`switch` (no fallthrough, expression-less, multi-value cases)',
  section: 'B',
  order: 11,
  runMode: 'playground',
  body: `Cases don't fall through by default — a case ends at its closing brace.
Use \`fallthrough\` (rare, often wrong) to continue. A case can list multiple
values: \`case "yes", "y":\`. The switch expression is optional: \`switch {}\`
behaves like an if/else chain.`,
  starterCode: `package main

import "fmt"

func main() {
    for _, s := range []string{"yes", "no", "Y"} {
        switch s {
        case "yes", "y", "Y":
            fmt.Println(s, "→ affirmative")
        case "no", "n", "N":
            fmt.Println(s, "→ negative")
        default:
            fmt.Println(s, "→ ?")
        }
    }
}
`,
};

// 12. type switch
export const typeSwitch: Lesson = {
  slug: 'type-switch',
  title: '`type switch`',
  section: 'B',
  order: 12,
  runMode: 'playground',
  body: `A type switch dispatches on the *dynamic* type of an interface value.
Use \`switch v := x.(type)\`; within each case \`v\` has the concrete type. The
\`default\` case covers anything not listed, including \`nil\`.`,
  starterCode: `package main

import "fmt"

func describe(x any) {
    switch v := x.(type) {
    case int:
        fmt.Println("int:", v)
    case string:
        fmt.Printf("string of len %d: %q\\n", len(v), v)
    default:
        fmt.Printf("other: %T %v\\n", v, v)
    }
}

func main() {
    describe(7)
    describe("hi")
    describe(3.14)
}
`,
};

// 13. defer
export const deferStatement: Lesson = {
  slug: 'defer',
  title: '`defer` (LIFO, argument evaluation, gotchas in loops)',
  section: 'B',
  order: 13,
  runMode: 'playground',
  body: `\`defer f(x)\` schedules \`f\` to run when the surrounding function returns.
Arguments are evaluated *immediately*, even though the call itself runs later.
Defers are LIFO: the most recently deferred runs first.

Common gotcha in loops: \`defer file.Close()\` inside a loop defers all closes
to the end of the function. For many open files at once, that's a leak. Use
a closure or scope the loop body in its own function.`,
  starterCode: `package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        defer fmt.Println("defer:", i)
    }
    fmt.Println("loop done")
    // Output order: loop done, defer 2, defer 1, defer 0
}
`,
  gotcha: `\`defer recover()\` in a loop only catches a panic from the last
iteration. If you want per-iteration recovery, factor the body into its own
function.`,
};

// 14. goto, labels
export const labelsGoto: Lesson = {
  slug: 'labels-goto',
  title: '`goto`, labels, labeled `break`/`continue`',
  section: 'B',
  order: 14,
  runMode: 'playground',
  body: `\`goto\` is rarely the right tool but it's there: it jumps to a label in
the same function. \`break\` and \`continue\` accept an optional label to exit
or skip a specific enclosing loop — handy for nested loops.`,
  starterCode: `package main

import "fmt"

func main() {
    matrix := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
search:
    for i, row := range matrix {
        for j, v := range row {
            if v == 5 {
                fmt.Println("found at", i, j)
                break search
            }
        }
    }
}
`,
  gotcha: `\`goto\` cannot jump over variable declarations. If you must use it,
declare variables before the label, not after.`,
};
