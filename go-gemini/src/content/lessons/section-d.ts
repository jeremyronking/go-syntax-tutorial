import type { Lesson } from '../types'

export const sectionDLessons: Lesson[] = [
  {
    slug: 'functions',
    title: '20. Functions & returns',
    section: 'Section D: Functions',
    order: 20,
    runMode: 'playground',
    body: `
A function can take zero or more arguments. When two or more consecutive named function parameters share a type, you can omit the type from all but the last.

A function can return any number of results.

Go's return values may be named. If so, they are treated as variables defined at the top of the function. A \`return\` statement without arguments returns the named return values. This is known as a **"naked" return**. Naked returns should be used sparingly, primarily in short functions.
    `,
    starterCode: `package main

import "fmt"

func swap(x, y string) (string, string) {
    return y, x
}

// Named return values
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return // Naked return
}

func main() {
    a, b := swap("hello", "world")
    fmt.Println(a, b)
    
    fmt.Println(split(17))
}`,
  },
  {
    slug: 'variadic-functions',
    title: '21. Variadic functions',
    section: 'Section D: Functions',
    order: 21,
    runMode: 'playground',
    body: `
Functions may be variadic, meaning they can be called with any number of trailing arguments.

For example, \`fmt.Println\` is a common variadic function. You declare a variadic function by using \`...\` before the type of the last parameter. Inside the function, the variadic parameter acts like a slice of that type.

You can also unpack a slice and pass it as variadic arguments using the \`...\` operator on the caller side.
    `,
    starterCode: `package main

import "fmt"

func sum(nums ...int) int {
    fmt.Print(nums, " ")
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2))
    fmt.Println(sum(1, 2, 3))

    // Slice spread
    nums := []int{1, 2, 3, 4}
    fmt.Println(sum(nums...))
}`,
  },
  {
    slug: 'closures',
    title: '22. First-class functions & closures',
    section: 'Section D: Functions',
    order: 22,
    runMode: 'playground',
    body: `
Go functions are values too. They can be passed around just like other values. Function values may be used as function arguments and return values.

Go functions may be closures. A closure is a function value that references variables from outside its body. The function may access and assign to the referenced variables; in this sense the function is "bound" to the variables.
    `,
    starterCode: `package main

import "fmt"

// adder returns a closure. Each closure is bound to its own sum variable.
func adder() func(int) int {
    sum := 0
    return func(x int) int {
        sum += x
        return sum
    }
}

func main() {
    pos, neg := adder(), adder()
    for i := 0; i < 10; i++ {
        fmt.Println(
            pos(i),
            neg(-2*i),
        )
    }
}`,
  },
  {
    slug: 'methods',
    title: '23. Methods',
    section: 'Section D: Functions',
    order: 23,
    runMode: 'playground',
    body: `
Go does not have classes. However, you can define methods on types. A method is a function with a special **receiver** argument.

The receiver appears in its own argument list between the \`func\` keyword and the method name.

You can declare a method with a value receiver or a pointer receiver. Pointer receivers can modify the value to which the receiver points. Since methods often need to modify their receiver, pointer receivers are more common than value receivers.

Below is the Checkpoint for Section D.
    `,
    gotcha: "If a method needs to modify its receiver, or if the receiver is a large struct, use a pointer receiver (`*T`). If you use a value receiver, the method operates on a *copy* of the original value.",
    starterCode: `package main

import (
    "fmt"
    "math"
)

type Vertex struct {
    X, Y float64
}

// Value receiver
func (v Vertex) Abs() float64 {
    return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// Pointer receiver
func (v *Vertex) Scale(f float64) {
    v.X = v.X * f
    v.Y = v.Y * f
}

func main() {
    v := Vertex{3, 4}
    v.Scale(10) // Modifies v
    fmt.Println(v.Abs())
}`,
    checkpoint: {
      id: 'checkpoint-d',
      questions: [
        {
          id: 'cp-d-1',
          prompt: 'What does a naked `return` do in a function with named return values?',
          type: 'mcq',
          options: ['Returns nil', 'Returns the named return values', 'Throws an error', 'Returns only the first value'],
          correctIndex: 1,
          explanation: 'A naked return automatically returns the current values of the named return variables.'
        },
        {
          id: 'cp-d-2',
          prompt: 'How do you unpack a slice `s` to pass its elements to a variadic function?',
          type: 'mcq',
          options: ['s...', '*s', '&s', '...s'],
          correctIndex: 0,
          explanation: 'The slice spread operator is placed after the slice variable, like `s...`.'
        },
        {
          id: 'cp-d-3',
          prompt: 'Can a function return another function in Go?',
          type: 'mcq',
          options: ['Yes', 'No'],
          correctIndex: 0,
          explanation: 'Yes, functions in Go are first-class values and can be returned from other functions to create closures.'
        },
        {
          id: 'cp-d-4',
          prompt: 'If a method needs to mutate its receiver struct, which receiver type MUST it use?',
          type: 'mcq',
          options: ['Value receiver (T)', 'Pointer receiver (*T)', 'Interface receiver'],
          correctIndex: 1,
          explanation: 'A value receiver gets a copy of the struct. To mutate the original struct, you must use a pointer receiver (*T).'
        }
      ]
    }
  }
]
