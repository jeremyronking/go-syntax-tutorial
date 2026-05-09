import type { Lesson } from "../types";

export const sectionD: Lesson[] = [
  {
    slug: "functions-multi-return",
    title: "Functions, multi-return, named returns, naked return",
    section: "D",
    order: 20,
    body: `Go functions can return multiple values. Named return values provide documentation and enable naked returns in short functions.

\`\`\`go
package main

import "fmt"

func divmod(a, b int) (quotient, remainder int) {
    quotient = a / b
    remainder = a % b
    return // naked return — uses named return values
}

func main() {
    q, r := divmod(17, 5)
    fmt.Println(q, r)

    // Common pattern: return value + error
    val, err := safeDiv(10, 0)
    if err != "" {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", val)
    }
}

func safeDiv(a, b int) (int, string) {
    if b == 0 {
        return 0, "division by zero"
    }
    return a / b, ""
}
\`\`\`

- **Naked returns** are fine for short functions. For longer ones, prefer explicit return values for clarity.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func divmod(a, b int) (quotient, remainder int) {
    quotient = a / b
    remainder = a % b
    return
}

func main() {
    q, r := divmod(17, 5)
    fmt.Println(q, r)

    val, err := safeDiv(10, 0)
    if err != "" {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", val)
    }
}

func safeDiv(a, b int) (int, string) {
    if b == 0 {
        return 0, "division by zero"
    }
    return a / b, ""
}`,
  },
  {
    slug: "variadic-functions",
    title: "Variadic functions, slice-spread with …",
    section: "D",
    order: 21,
    body: `Variadic functions accept any number of trailing arguments. Inside the function, the parameter is a slice.

\`\`\`go
package main

import "fmt"

func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))    // 6
    fmt.Println(sum(10, 20, 30))  // 60

    // Spread a slice into variadic args
    numbers := []int{4, 5, 6}
    fmt.Println(sum(numbers...))   // 15
}
\`\`\`

- Only the **last** parameter can be variadic.
- Use \`slice...\` to pass an existing slice.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))
    fmt.Println(sum(10, 20, 30))

    numbers := []int{4, 5, 6}
    fmt.Println(sum(numbers...))
}`,
  },
  {
    slug: "first-class-functions-closures",
    title: "First-class functions & closures",
    section: "D",
    order: 22,
    body: `Functions are values. They can be assigned, passed as arguments, and form closures over their environment.

\`\`\`go
package main

import "fmt"

func adder(base int) func(int) int {
    return func(n int) int {
        return base + n
    }
}

func main() {
    add5 := adder(5)
    fmt.Println(add5(10)) // 15
    fmt.Println(add5(20)) // 25

    // Function as argument
    nums := []int{1, 2, 3, 4, 5}
    evens := filter(nums, func(n int) bool { return n%2 == 0 })
    fmt.Println(evens) // [2 4]
}

func filter(s []int, f func(int) bool) []int {
    var result []int
    for _, v := range s {
        if f(v) {
            result = append(result, v)
        }
    }
    return result
}
\`\`\`

- Closures capture variables **by reference**. See the loop-variable-capture lesson for the classic gotcha.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func adder(base int) func(int) int {
    return func(n int) int {
        return base + n
    }
}

func main() {
    add5 := adder(5)
    fmt.Println(add5(10))
    fmt.Println(add5(20))

    nums := []int{1, 2, 3, 4, 5}
    evens := filter(nums, func(n int) bool { return n%2 == 0 })
    fmt.Println(evens)
}

func filter(s []int, f func(int) bool) []int {
    var result []int
    for _, v := range s {
        if f(v) {
            result = append(result, v)
        }
    }
    return result
}`,
  },
  {
    slug: "methods-receivers",
    title: "Methods, value vs pointer receivers, method sets, addressability",
    section: "D",
    order: 23,
    body: `Go methods are functions with a **receiver**. The receiver can be a value or a pointer — this determines whether the method can mutate and who can call it.

\`\`\`go
package main

import "fmt"

type Counter struct{ count int }

// Value receiver — operates on a copy
func (c Counter) Value() int {
    return c.count
}

// Pointer receiver — can mutate the original
func (c *Counter) Inc() {
    c.count++
}

func (c *Counter) Reset() {
    c.count = 0
}

func main() {
    c := Counter{count: 0}
    c.Inc()
    c.Inc()
    fmt.Println(c.Value()) // 2
    c.Reset()
    fmt.Println(c.Value()) // 0
}
\`\`\`

- **Pointer receivers** can modify the receiver and avoid copying on each call.
- **Value receivers** operate on a copy and are safe for small, immutable types.
- Go automatically takes the address (\`c.Inc()\` works even though \`Inc\` has a pointer receiver) — but only if \`c\` is addressable.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

type Counter struct{ count int }

func (c Counter) Value() int {
    return c.count
}

func (c *Counter) Inc() {
    c.count++
}

func (c *Counter) Reset() {
    c.count = 0
}

func main() {
    c := Counter{count: 0}
    c.Inc()
    c.Inc()
    fmt.Println(c.Value())
    c.Reset()
    fmt.Println(c.Value())
}`,
    gotcha: "A value receiver on `*T` is callable on both `T` and `*T`. A pointer receiver on `T` is only callable on `*T` or an addressable `T`. If a method mutates, use a pointer receiver. A common pattern: pick pointer receivers for all methods on a type to be consistent.",
  },
];

export const sectionDCheckpoint: Lesson["checkpoint"] = {
  id: "checkpoint-d",
  sectionSlug: "D",
  questions: [
    {
      type: "mcq",
      prompt: "Which receiver type should a `Scale(float64)` method on a `Point` struct use if it modifies the point?",
      options: [
        "Value receiver: `func (p Point) Scale(f float64)`",
        "Pointer receiver: `func (p *Point) Scale(f float64)`",
        "Either works identically",
        "Neither — it must be a top-level function",
      ],
      correctIndex: 1,
      explanation: "If the method mutates the receiver, it must use a pointer receiver. Value receivers operate on a copy.",
    },
    {
      type: "mcq",
      prompt: "What does `...int` mean in a function signature `func sum(nums ...int)`?",
      options: [
        "The function takes exactly one slice of int",
        "The function takes zero or more int arguments, collected into a slice",
        "The function takes an optional int",
        "It's a compile error",
      ],
      correctIndex: 1,
      explanation: "Variadic parameters collect any number of trailing arguments into a slice of that type.",
    },
    {
      type: "mcq",
      prompt: "In a naked return, what values are returned?",
      options: [
        "Zero values of the return types",
        "The current values of the named return variables",
        "Compile error — naked returns are not allowed",
        "The values from the last function call",
      ],
      correctIndex: 1,
      explanation: "Naked returns use the current values of the named return variables. They're valid only in short functions.",
    },
    {
      type: "mcq",
      prompt: "Can you call `Counter{count: 5}.Inc()` if `Inc` has a pointer receiver?",
      options: [
        "Yes, if `Inc` takes `*Counter`",
        "No — the literal is not addressable",
        "Only if you store it in a variable first",
        "Compile error",
      ],
      correctIndex: 1,
      explanation: "Composite literals like `Counter{count: 5}` are not addressable, so you can't call pointer-receiver methods on them. Store in a variable first: `c := Counter{count: 5}; c.Inc()`.",
    },
  ],
};