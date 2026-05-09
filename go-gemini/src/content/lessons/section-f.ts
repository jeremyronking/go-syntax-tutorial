import type { Lesson } from '../types'

export const sectionFLessons: Lesson[] = [
  {
    slug: 'generics-type-parameters',
    title: '28. Type parameters & inference',
    section: 'Section F: Generics',
    order: 28,
    runMode: 'playground',
    body: `
Go functions and types can be generic. You declare generic types and functions by providing a list of **type parameters** in square brackets \`[ ]\`.

Each type parameter has a **type constraint** that acts as a meta-type for the type parameter. The \`any\` constraint is an alias for \`interface{}\`, meaning any type is allowed.

When calling a generic function, Go can often infer the type parameters from the arguments, so you do not need to explicitly provide them.
    `,
    starterCode: `package main

import "fmt"

// Generic function with a type parameter T constrained by any
func PrintSlice[T any](s []T) {
    for _, v := range s {
        fmt.Print(v, " ")
    }
    fmt.Println()
}

func main() {
    // Explicit type argument
    PrintSlice[int]([]int{1, 2, 3})
    
    // Type inference (no brackets needed)
    PrintSlice([]string{"Hello", "Generics"})
}`,
  },
  {
    slug: 'generics-constraints',
    title: '29. Constraints & underlying types',
    section: 'Section F: Generics',
    order: 29,
    runMode: 'playground',
    body: `
In addition to \`any\`, there is a built-in constraint called \`comparable\`, which restricts the type parameter to types that support the \`==\` and \`!=\` operators. This is crucial for map keys or searching algorithms.

You can also define your own constraints using interfaces. An interface used as a constraint can specify a **type set** using the \`|\` union operator. 

The \`~\` token means "the set of all types whose underlying type is T." This allows custom types (like \`type MyInt int\`) to satisfy the constraint.
    `,
    starterCode: `package main

import "fmt"

// Custom constraint: any type whose underlying type is int or float64
type Number interface {
    ~int | ~float64
}

// A generic function that requires comparable keys
func MapKeys[K comparable, V any](m map[K]V) []K {
    keys := make([]K, 0, len(m))
    for k := range m {
        keys = append(keys, k)
    }
    return keys
}

// A generic function using our custom constraint
func SumNumbers[T Number](s []T) T {
    var sum T
    for _, v := range s {
        sum += v
    }
    return sum
}

func main() {
    m := map[string]int{"a": 1, "b": 2}
    fmt.Println("Keys:", MapKeys(m))
    
    fmt.Println("Sum:", SumNumbers([]int{1, 2, 3}))
}`,
  },
  {
    slug: 'generics-when-not-to-use',
    title: '30. When NOT to use generics',
    section: 'Section F: Generics',
    order: 30,
    runMode: 'playground',
    body: `
Generics are a powerful feature, but they add complexity. 

Go's philosophy strongly favors simplicity and readability. You should write code using concrete types or standard interfaces (\`io.Reader\`, \`any\`) first. Introduce generics only when you notice you are writing the exact same boilerplate code multiple times for different types.

Below is the Checkpoint for Section F.
    `,
    gotcha: "If an interface will do, use an interface! Generics should be a last resort to prevent code duplication, not a default choice for abstraction. Overusing generics can slow down compile times and make code harder to read.",
    starterCode: `package main

import (
    "fmt"
    "io"
    "bytes"
)

// DO NOT DO THIS (Unnecessary generic)
func ReadAllGeneric[R io.Reader](r R) ([]byte, error) {
    return io.ReadAll(r)
}

// DO THIS (Simple interface)
func ReadAllSimple(r io.Reader) ([]byte, error) {
    return io.ReadAll(r)
}

func main() {
    buf := bytes.NewBufferString("Hello")
    data, _ := ReadAllSimple(buf)
    fmt.Printf("%s\\n", data)
}`,
    checkpoint: {
      id: 'checkpoint-f',
      questions: [
        {
          id: 'cp-f-1',
          prompt: 'Which brackets are used to declare type parameters in Go?',
          type: 'mcq',
          options: ['< >', '[ ]', '{ }', '( )'],
          correctIndex: 1,
          explanation: 'Go uses square brackets [ ] for type parameters to distinguish them from regular parameters and avoid ambiguity in the grammar.'
        },
        {
          id: 'cp-f-2',
          prompt: 'What does the `comparable` constraint mean?',
          type: 'mcq',
          options: ['The type can be sorted using < and >', 'The type supports == and != operators', 'The type is an interface', 'The type is a number'],
          correctIndex: 1,
          explanation: 'comparable guarantees that the type can be compared for equality (== and !=), making it safe to use as a map key.'
        },
        {
          id: 'cp-f-3',
          prompt: 'What does the `~` symbol mean in a type constraint like `~int`?',
          type: 'mcq',
          options: ['Bitwise NOT', 'Strict type equality', 'Any type whose underlying type is int', 'Pointer to int'],
          correctIndex: 2,
          explanation: 'The tilde ~ means "underlying type". It allows aliases like `type MyInt int` to satisfy the constraint.'
        },
        {
          id: 'cp-f-4',
          prompt: 'According to Go best practices, should you default to using generics for all abstractions?',
          type: 'mcq',
          options: ['Yes, it makes code more robust', 'No, use concrete types or standard interfaces first'],
          correctIndex: 1,
          explanation: 'Generics should be used sparingly to avoid unnecessary complexity. Interfaces are often simpler and sufficient.'
        }
      ]
    }
  }
]
