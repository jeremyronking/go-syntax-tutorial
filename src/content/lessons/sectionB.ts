import type { Lesson } from "../types";

export const sectionB: Lesson[] = [
  {
    slug: "if-statement",
    title: "if (init statement)",
    section: "B",
    order: 8,
    body: `Go's \`if\` supports an init statement that runs before the condition. The variable it declares is scoped to the \`if\` and its \`else\`.

\`\`\`go
package main

import "fmt"

func main() {
    if x := 10; x > 5 {
        fmt.Println("x is big:", x)
    } else {
        fmt.Println("x is small:", x)
    }
    // x is not accessible here
}
\`\`\`

- The init-statement pattern is common with \`err\` checks: \`if err := doSomething(); err != nil {\`.
- Braces are mandatory — no parenthesized conditions.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    if x := 10; x > 5 {
        fmt.Println("x is big:", x)
    } else {
        fmt.Println("x is small:", x)
    }
}`,
  },
  {
    slug: "for-loops",
    title: "for (3-clause, while-style, infinite, range)",
    section: "B",
    order: 9,
    body: `Go has one loop construct: \`for\`. It covers C-style, while-style, and infinite loops, plus \`range\` for collections.

\`\`\`go
package main

import "fmt"

func main() {
    // 3-clause
    for i := 0; i < 5; i++ {
        if i == 2 {
            continue
        }
        fmt.Print(i, " ")
    }
    fmt.Println()

    // while-style
    n := 1
    for n < 100 {
        n *= 2
    }
    fmt.Println("powers of 2:", n)

    // range over slice
    nums := []string{"a", "b", "c"}
    for i, v := range nums {
        fmt.Println(i, v)
    }

    // range over map (order is not guaranteed)
    m := map[string]int{"x": 1, "y": 2}
    for k, v := range m {
        fmt.Println(k, v)
    }
}
\`\`\`

- There is no \`while\` keyword — \`for condition {}\` serves that role.
- \`range\` on a slice gives index and value; you can skip either with \`_\`.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
        if i == 2 {
            continue
        }
        fmt.Print(i, " ")
    }
    fmt.Println()

    n := 1
    for n < 100 {
        n *= 2
    }
    fmt.Println("powers of 2:", n)

    nums := []string{"a", "b", "c"}
    for i, v := range nums {
        fmt.Println(i, v)
    }

    m := map[string]int{"x": 1, "y": 2}
    for k, v := range m {
        fmt.Println(k, v)
    }
}`,
  },
  {
    slug: "loop-variable-capture",
    title: "Loop variable capture (pre-1.22 vs 1.22+)",
    section: "B",
    order: 10,
    body: `Before Go 1.22, \`for\` loop variables were shared across iterations. Capturing them in a closure would capture the **final** value. Starting in Go 1.22, each iteration gets its own variable.

\`\`\`go
package main

import "fmt"

func main() {
    // Go 1.22+: each iteration has its own 'i'
    var funcs []func()
    for i := 0; i < 3; i++ {
        funcs = append(funcs, func() {
            fmt.Println(i)
        })
    }
    for _, f := range funcs {
        f()
    }
    // Output: 0 1 2 (correct in 1.22+)
}
\`\`\`

**Go 1.22+ semantic change:** This is one of the most impactful behavioral changes in Go's history. Before 1.22, the output would have been \`3 3 3\` — the classic closure-over-loop-variable bug. If you're reading older Go code, watch for this pattern.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    var funcs []func()
    for i := 0; i < 3; i++ {
        funcs = append(funcs, func() {
            fmt.Println(i)
        })
    }
    for _, f := range funcs {
        f()
    }
}`,
    gotcha: "Before Go 1.22, the loop variable was shared across iterations. The fix was `i := i` inside the loop body. In Go 1.22+, each iteration creates a fresh variable — no workaround needed.",
  },
  {
    slug: "switch",
    title: "switch (no fallthrough, expression-less, multi-value)",
    section: "B",
    order: 11,
    body: `Go \`switch\` does **not** fall through by default. Each case breaks automatically. Use \`fallthrough\` explicitly if you need it.

\`\`\`go
package main

import "fmt"

func main() {
    // Basic switch
    day := "tue"
    switch day {
    case "mon", "tue", "wed", "thu", "fri":
        fmt.Println("weekday")
    case "sat", "sun":
        fmt.Println("weekend")
    default:
        fmt.Println("unknown")
    }

    // Expression-less switch (like if/else chain)
    x := 42
    switch {
    case x < 0:
        fmt.Println("negative")
    case x == 0:
        fmt.Println("zero")
    default:
        fmt.Println("positive")
    }
}
\`\`\`

- Multi-value cases: \`case "mon", "tue":\`.
- Expression-less switch is equivalent to an \`if\`/\`else if\`/\`else\` chain.
- \`fallthrough\` is explicit and rarely needed.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    day := "tue"
    switch day {
    case "mon", "tue", "wed", "thu", "fri":
        fmt.Println("weekday")
    case "sat", "sun":
        fmt.Println("weekend")
    default:
        fmt.Println("unknown")
    }

    x := 42
    switch {
    case x < 0:
        fmt.Println("negative")
    case x == 0:
        fmt.Println("zero")
    default:
        fmt.Println("positive")
    }
}`,
  },
  {
    slug: "type-switch",
    title: "type switch",
    section: "B",
    order: 12,
    body: `A type switch inspects the concrete type of an interface value.

\`\`\`go
package main

import "fmt"

func describe(v interface{}) {
    switch t := v.(type) {
    case string:
        fmt.Printf("string of length %d: %s\\n", len(t), t)
    case int:
        fmt.Printf("int: %d\\n", t)
    case bool:
        fmt.Printf("bool: %t\\n", t)
    default:
        fmt.Printf("unexpected: %T\\n", t)
    }
}

func main() {
    describe("hello")
    describe(42)
    describe(true)
    describe(3.14)
}
\`\`\`

- In each case, \`t\` is automatically the asserted type — no separate cast needed.
- The \`v.(type)\` syntax is only valid inside a \`switch\` statement.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func describe(v interface{}) {
    switch t := v.(type) {
    case string:
        fmt.Printf("string of length %d: %s\n", len(t), t)
    case int:
        fmt.Printf("int: %d\n", t)
    case bool:
        fmt.Printf("bool: %t\n", t)
    default:
        fmt.Printf("unexpected: %T\n", t)
    }
}

func main() {
    describe("hello")
    describe(42)
    describe(true)
    describe(3.14)
}`,
  },
  {
    slug: "defer",
    title: "defer (LIFO, arg evaluation, gotchas)",
    section: "B",
    order: 13,
    body: `\`defer\` schedules a function call to run when the surrounding function returns. Defers execute in **LIFO** order and arguments are evaluated at the \`defer\` call, not at execution time.

\`\`\`go
package main

import "fmt"

func main() {
    // LIFO order
    defer fmt.Println("first registered")
    defer fmt.Println("second registered")
    // Output: "second registered" then "first registered"

    // Argument evaluated immediately
    x := 1
    defer fmt.Println("deferred x:", x) // prints 1, not 2
    x = 2
    fmt.Println("current x:", x)
}
\`\`\`

Common uses: closing files, unlocking mutexes, closing HTTP response bodies.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    defer fmt.Println("first registered")
    defer fmt.Println("second registered")

    x := 1
    defer fmt.Println("deferred x:", x)
    x = 2
    fmt.Println("current x:", x)
}`,
    gotcha: "Deferred function arguments are evaluated at the `defer` call, not at function return. In a loop, `defer fmt.Println(i)` captures the value of `i` at each iteration — but if you meant to defer a close, all defers pile up until the function returns, which can leak resources. Prefer `defer` right after the resource acquisition.",
  },
  {
    slug: "goto-labels",
    title: "goto, labels, labeled break/continue",
    section: "B",
    order: 14,
    body: `Go has \`goto\` and labeled \`break\`/\`continue\` for breaking out of nested loops. Use sparingly.

\`\`\`go
package main

import "fmt"

func main() {
    // Labeled break — exit outer loop
outer:
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            if i == 1 && j == 1 {
                break outer
            }
            fmt.Printf("(%d,%d) ", i, j)
        }
    }
    fmt.Println()

    // goto — forward jumps only, no jumping over variable declarations
    x := 0
    if x == 0 {
        goto done
    }
    fmt.Println("skipped")
done:
    fmt.Println("done")
}
\`\`\`

- Labeled \`break\` and \`continue\` are the idiomatic way to exit nested loops.
- \`goto\` cannot jump over variable declarations and cannot jump into other blocks.
- Prefer restructuring code over using \`goto\`.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
outer:
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            if i == 1 && j == 1 {
                break outer
            }
            fmt.Printf("(%d,%d) ", i, j)
        }
    }
    fmt.Println()

    x := 0
    if x == 0 {
        goto done
    }
    fmt.Println("skipped")
done:
    fmt.Println("done")
}`,
  },
];

// Section A checkpoint
export const sectionACheckpoint: Lesson["checkpoint"] = {
  id: "checkpoint-a",
  sectionSlug: "A",
  questions: [
    {
      type: "mcq",
      prompt: "What does `iota` represent in the second line of a const block that started with `const _ = iota`?",
      options: [
        "0",
        "1",
        "The same value as line 1",
        "Compile error",
      ],
      correctIndex: 1,
      explanation: "iota increments by 1 for each line in a const block. If line 0 used iota=0, line 1 gets iota=1.",
    },
    {
      type: "mcq",
      prompt: `What is the zero value of a \`\`string\`\` in Go?`,
      options: [
        "nil",
        `"\"" ""`,
        "undefined",
        "null",
      ],
      correctIndex: 1,
      explanation: 'The zero value of a string is the empty string "". It is not nil — strings in Go are never nil.',
    },
    {
      type: "mcq",
      prompt: "What happens when you overflow a `uint8` variable set to 255 and add 1?",
      options: [
        "Runtime panic",
        "Wraps to 0",
        "Becomes -1",
        "Promotes to uint16",
      ],
      correctIndex: 1,
      explanation: "Go integer types wrap on overflow. uint8(255) + 1 wraps to 0. There's no trap or promotion.",
    },
    {
      type: "mcq",
      prompt: "What does `len(\"Go语言\")` return?",
      options: [
        "2",
        "4",
        "8",
        "6",
      ],
      correctIndex: 2,
      explanation: 'len returns the byte count, not the character count. "Go语言" is 2 bytes (ASCII) + 6 bytes (CJK) = 8 bytes in UTF-8.',
    },
    {
      type: "fill",
      prompt: "Write the short variable declaration that declares x to be 42:",
      acceptedAnswers: ["x := 42"],
      explanation: "Short variable declarations use := and can only appear inside functions.",
    },
  ],
};
// Section B checkpoint
export const sectionBCheckpoint: Lesson["checkpoint"] = {
  id: "checkpoint-b",
  sectionSlug: "B",
  questions: [
    {
      type: "mcq",
      prompt: "In what order do deferred functions execute in Go?",
      options: [
        "FIFO (first deferred, first executed)",
        "LIFO (last deferred, first executed)",
        "Random order",
        "In the order they appear in the function body",
      ],
      correctIndex: 1,
      explanation: "Deferred functions execute in LIFO (stack) order. The last defer registered runs first when the function returns.",
    },
    {
      type: "mcq",
      prompt: "What does this code print?\n\ndefer fmt.Println(\"first\")\ndefer fmt.Println(\"second\")",
      options: [
        "first then second",
        "second then first",
        "Compile error",
        "Only second",
      ],
      correctIndex: 1,
      explanation: "Defers execute in LIFO order, so 'second' is registered last and runs first.",
    },
    {
      type: "mcq",
      prompt: "What does this print?\n\nx := 1\ndefer fmt.Println(x)\nx = 2",
      options: [
        "2",
        "1",
        "Compile error",
        "Undefined",
      ],
      correctIndex: 1,
      explanation: "defer evaluates arguments immediately at the defer call. x is 1 when the defer is registered, so it prints 1 even though x becomes 2.",
    },
    {
      type: "mcq",
      prompt: "In Go 1.22+, what does this print?\n\nfor i := 0; i < 3; i++ {\n  go func() { fmt.Println(i) }()\n}",
      options: [
        "333 (all goroutines see final value)",
        "012 (each goroutine captures its own i)",
        "Random order but always 0, 1, 2",
        "Compile error",
      ],
      correctIndex: 1,
      explanation: "Go 1.22 changed loop variable semantics — each iteration gets its own variable. Before 1.22, this would print 333.",
    },
    {
      type: "mcq",
      prompt: "What does switch without an expression do in Go?",
      options: [
        "Compile error — switch always needs an expression",
        "It's equivalent to if/else if/else",
        "It matches on the type of the variable",
        "It always falls through to default",
      ],
      correctIndex: 1,
      explanation: "A switch without an expression is equivalent to switch true { case ... }. It's a cleaner way to write if/else if/else chains.",
    },
  ],
};
