import type { Lesson } from '../types'

export const sectionBLessons: Lesson[] = [
  {
    slug: 'if-statement',
    title: '8. if (init statement)',
    section: 'Section B: Control flow',
    order: 8,
    runMode: 'playground',
    body: `
Go's \`if\` statements are like its \`for\` loops; the expression need not be surrounded by parentheses \`( )\`, but the braces \`{ }\` are required.

Like \`for\`, the \`if\` statement can start with a short statement to execute before the condition. Variables declared by the statement are only in scope until the end of the \`if\` (and \`else\`) blocks.
    `,
    starterCode: `package main

import (
    "fmt"
    "math"
)

func pow(x, n, lim float64) float64 {
    if v := math.Pow(x, n); v < lim {
        return v
    } else {
        fmt.Printf("%g >= %g\\n", v, lim)
    }
    // can't use v here
    return lim
}

func main() {
    fmt.Println(
        pow(3, 2, 10),
        pow(3, 3, 20),
    )
}`,
  },
  {
    slug: 'for-loop',
    title: '9. for (3-clause, while, infinite, range)',
    section: 'Section B: Control flow',
    order: 9,
    runMode: 'playground',
    body: `
Go has only one looping construct, the \`for\` loop.

The basic \`for\` loop has three components separated by semicolons:
- the init statement: executed before the first iteration
- the condition expression: evaluated before every iteration
- the post statement: executed at the end of every iteration

The init and post statements are optional. If you drop the semicolons, you get a \`while\` loop. If you omit the condition, you get an infinite loop.

The \`range\` form of the \`for\` loop iterates over a slice or map.
    `,
    starterCode: `package main

import "fmt"

func main() {
    // Basic 3-clause for
    sum := 0
    for i := 0; i < 10; i++ {
        sum += i
    }
    fmt.Println("Sum:", sum)

    // "while" loop equivalent
    n := 1
    for n < 100 {
        n += n
    }
    fmt.Println("While-like:", n)

    // range loop
    nums := []int{2, 4, 6}
    for idx, val := range nums {
        fmt.Printf("index: %d, value: %d\\n", idx, val)
    }
}`,
  },
  {
    slug: 'loop-variable-capture',
    title: '10. Loop variable capture (Go 1.22+)',
    section: 'Section B: Control flow',
    order: 10,
    runMode: 'playground',
    body: `
A classic gotcha in older versions of Go (pre-1.22) was loop variable capture. 

Prior to Go 1.22, the \`for\` loop variable was declared once and updated on each iteration. This meant that closures or goroutines launched inside the loop that referred to the loop variable would all end up referencing the *same* variable (and usually its final value).

**In Go 1.22+, this is fixed!** The loop variable is now re-scoped per iteration, so each closure captures its own distinct variable.
    `,
    gotcha: "If you are working on a legacy Go codebase (pre-1.22), remember to re-assign loop variables locally (e.g. `v := v`) inside the loop before passing them to a closure.",
    starterCode: `package main

import (
    "fmt"
    "time"
)

func main() {
    values := []string{"a", "b", "c"}
    
    for _, v := range values {
        // In Go 1.22+, this prints "a", "b", "c" (in random order)
        // Pre-1.22, it would often print "c", "c", "c"
        go func() {
            fmt.Println(v)
        }()
    }
    
    time.Sleep(100 * time.Millisecond)
}`,
  },
  {
    slug: 'switch-statement',
    title: '11. switch',
    section: 'Section B: Control flow',
    order: 11,
    runMode: 'playground',
    body: `
A \`switch\` statement is a shorter way to write a sequence of \`if - else\` statements.

In Go, a switch only runs the selected case, not all the cases that follow. In effect, the \`break\` statement that is needed at the end of each case in C, C++, or Java is provided automatically in Go.

You can also omit the switch expression entirely. A \`switch\` without a condition is the same as \`switch true\`. This is a clean way to write long if-then-else chains.
    `,
    starterCode: `package main

import (
    "fmt"
    "time"
)

func main() {
    // Standard switch
    fmt.Print("When's Saturday? ")
    today := time.Now().Weekday()
    switch time.Saturday {
    case today + 0:
        fmt.Println("Today.")
    case today + 1:
        fmt.Println("Tomorrow.")
    case today + 2:
        fmt.Println("In two days.")
    default:
        fmt.Println("Too far away.")
    }

    // Expression-less switch
    t := time.Now()
    switch {
    case t.Hour() < 12:
        fmt.Println("Good morning!")
    case t.Hour() < 17:
        fmt.Println("Good afternoon.")
    default:
        fmt.Println("Good evening.")
    }
}`,
  },
  {
    slug: 'type-switch',
    title: '12. type switch',
    section: 'Section B: Control flow',
    order: 12,
    runMode: 'playground',
    body: `
A **type switch** is a construct that permits several type assertions in series.

A type switch is like a regular switch statement, but the cases specify types (not values), and those values are compared against the type of the value held by the given interface value.
    `,
    starterCode: `package main

import "fmt"

func do(i interface{}) {
    switch v := i.(type) {
    case int:
        fmt.Printf("Twice %v is %v\\n", v, v*2)
    case string:
        fmt.Printf("%q is %v bytes long\\n", v, len(v))
    default:
        fmt.Printf("I don't know about type %T!\\n", v)
    }
}

func main() {
    do(21)
    do("hello")
    do(true)
}`,
  },
  {
    slug: 'defer',
    title: '13. defer',
    section: 'Section B: Control flow',
    order: 13,
    runMode: 'playground',
    body: `
A \`defer\` statement defers the execution of a function until the surrounding function returns.

The deferred call's arguments are evaluated immediately, but the function call is not executed until the surrounding function returns.

Deferred function calls are pushed onto a stack. When a function returns, its deferred calls are executed in last-in-first-out (LIFO) order.
    `,
    gotcha: "Defer arguments are evaluated immediately when the `defer` statement is executed, not when the function actually returns. Also, avoid putting `defer` in a tight loop, as deferred calls won't execute until the *entire function* exits.",
    starterCode: `package main

import "fmt"

func main() {
    i := 1
    
    // The argument i is evaluated here (so it's 1), 
    // even though the call prints later.
    defer fmt.Println("Deferred 1, i is:", i)
    
    i++
    defer fmt.Println("Deferred 2, i is:", i)
    
    fmt.Println("Hello, world!")
    
    // Output should be:
    // Hello, world!
    // Deferred 2, i is: 2
    // Deferred 1, i is: 1
}`,
  },
  {
    slug: 'goto-labels',
    title: '14. goto & labels',
    section: 'Section B: Control flow',
    order: 14,
    runMode: 'playground',
    body: `
Go supports \`goto\`, as well as \`break\` and \`continue\` with labels.

While \`goto\` is rarely needed, labeled \`break\` and \`continue\` are extremely useful for breaking out of nested loops without convoluted boolean flags.

Below is the Checkpoint for Section B.
    `,
    starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Starting loop...")

OuterLoop:
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            if i == 1 && j == 1 {
                fmt.Println("Breaking outer loop at", i, j)
                break OuterLoop
            }
            fmt.Printf("i:%d j:%d\\n", i, j)
        }
    }

    // Example of goto
    goto End

    fmt.Println("This is skipped!")

End:
    fmt.Println("Done.")
}`,
    checkpoint: {
      id: 'checkpoint-b',
      questions: [
        {
          id: 'cp-b-1',
          prompt: 'When are the arguments to a deferred function call evaluated?',
          type: 'mcq',
          options: ['When the function returns', 'When the defer statement is executed', 'At compile time', 'When the program exits'],
          correctIndex: 1,
          explanation: 'The arguments are evaluated immediately when the defer statement is executed.'
        },
        {
          id: 'cp-b-2',
          prompt: 'In what order are multiple deferred functions executed?',
          type: 'mcq',
          options: ['First-in-first-out (FIFO)', 'Random order', 'Last-in-first-out (LIFO)'],
          correctIndex: 2,
          explanation: 'Deferred function calls are pushed onto a stack and executed in LIFO order.'
        },
        {
          id: 'cp-b-3',
          prompt: 'How do you create an infinite loop in Go?',
          type: 'mcq',
          options: ['while (true) {}', 'for {}', 'loop {}', 'forever {}'],
          correctIndex: 1,
          explanation: 'Omitting all clauses from a for loop creates an infinite loop.'
        },
        {
          id: 'cp-b-4',
          prompt: 'As of Go 1.22, what happens to the loop variable in a `for` loop?',
          type: 'mcq',
          options: ['It is shared across all iterations', 'It is re-scoped per iteration', 'It becomes read-only', 'It is deprecated'],
          correctIndex: 1,
          explanation: 'Go 1.22 re-scopes the loop variable per iteration to prevent the classic closure capture bug.'
        },
        {
          id: 'cp-b-5',
          prompt: 'Does a `switch` case in Go fall through automatically?',
          type: 'mcq',
          options: ['Yes', 'No'],
          correctIndex: 1,
          explanation: 'Go implicitly breaks after each case. You must explicitly use the `fallthrough` keyword if you want C-style behavior.'
        }
      ]
    }
  }
]
