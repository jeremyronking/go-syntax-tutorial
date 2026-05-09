import type { Lesson } from "../types";

export const sectionF: Lesson[] = [
  {
    slug: "type-parameters",
    title: "Type parameters, type inference",
    section: "F",
    order: 28,
    body: `Go 1.18 added generics via type parameters. Functions and types can be parameterized by type.

\`\`\`go
package main

import "fmt"

// Generic function
func Map[T any, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}

// Generic type
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    v := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return v, true
}

func main() {
    nums := []int{1, 2, 3}
    doubled := Map(nums, func(n int) int { return n * 2 })
    fmt.Println(doubled)

    s := Stack[string]{}
    s.Push("hello")
    s.Push("world")
    v, ok := s.Pop()
    fmt.Println(v, ok)
}
\`\`\`

- Type inference usually means you don't need to spell out type arguments at call sites.
- Generics are for types, functions, and methods on generic types.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func Map[T any, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}

type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    v := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return v, true
}

func main() {
    nums := []int{1, 2, 3}
    doubled := Map(nums, func(n int) int { return n * 2 })
    fmt.Println(doubled)

    s := Stack[string]{}
    s.Push("hello")
    s.Push("world")
    v, ok := s.Pop()
    fmt.Println(v, ok)
}`,
  },
  {
    slug: "constraints-type-sets",
    title: "Constraints, comparable, ~ approximation, type sets",
    section: "F",
    order: 29,
    body: `Constraining what types a generic can accept uses interfaces as constraints. The \`comparable\` constraint matches any type that supports \`==\` and \`!=\`.

\`\`\`go
package main

import "fmt"

type Number interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
    ~float32 | ~float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

func Contains[T comparable](s []T, v T) bool {
    for _, x := range s {
        if x == v {
            return true
        }
    }
    return false
}

type MyInt int // ~int matches this underlying type

func main() {
    fmt.Println(Sum([]int{1, 2, 3}))
    fmt.Println(Sum([]float64{1.1, 2.2}))
    fmt.Println(Sum([]MyInt{10, 20, 30}))

    fmt.Println(Contains([]string{"a", "b", "c"}, "b"))
    fmt.Println(Contains([]string{"a", "b", "c"}, "z"))
}
\`\`\`

- \`~T\` means "any type whose underlying type is T" — so \`~int\` matches \`type MyInt int\`.
- Union constraints (\`|\`) define type sets, not method sets.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

type Number interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
    ~float32 | ~float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

func Contains[T comparable](s []T, v T) bool {
    for _, x := range s {
        if x == v {
            return true
        }
    }
    return false
}

type MyInt int

func main() {
    fmt.Println(Sum([]int{1, 2, 3}))
    fmt.Println(Sum([]float64{1.1, 2.2}))
    fmt.Println(Sum([]MyInt{10, 20, 30}))

    fmt.Println(Contains([]string{"a", "b", "c"}, "b"))
    fmt.Println(Contains([]string{"a", "b", "c"}, "z"))
}`,
  },
  {
    slug: "when-not-generics",
    title: "When not to reach for generics",
    section: "F",
    order: 30,
    body: `Generics solve real problems — but not all of them. Reach for generics when:

1. You have **identical logic** across multiple types (collections, sorting, option/result types).
2. The type parameter provides **real compile-time safety** beyond what \`any\` + type switches give you.

Don't reach for generics when:

- An \`interface{}\` + type switch is sufficient and the set of types is small and known.
- You're trying to replace method-based polymorphism. A well-designed interface is almost always clearer.
- The generic function is only called with one or two types — just write separate functions.
- The constraint becomes a union of 15 types — that's a code smell, not a feature.

\`\`\`go
package main

import "fmt"

func First[T any](s []T) (T, bool) {
    if len(s) == 0 {
        var zero T
        return zero, false
    }
    return s[0], true
}

func main() {
    nums := []int{10, 20, 30}
    v, ok := First(nums)
    fmt.Println(v, ok)

    words := []string{"a", "b"}
    v2, ok := First(words)
    fmt.Println(v2, ok)
}
\`\`\`

Write for clarity first. Add generics when the repetition is genuine and painful.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func First[T any](s []T) (T, bool) {
    if len(s) == 0 {
        var zero T
        return zero, false
    }
    return s[0], true
}

func main() {
    nums := []int{10, 20, 30}
    v, ok := First(nums)
    fmt.Println(v, ok)

    words := []string{"a", "b"}
    v2, ok := First(words)
    fmt.Println(v2, ok)
}`,
    gotcha: "Don't add generics just because you can. If you're writing a constraint that lists 15 types, an interface with a method is almost certainly cleaner. Generics are for when you need compile-time type safety over truly generic algorithms.",
  }
];

export const sectionFCheckpoint: Lesson["checkpoint"] = {
  "id": "checkpoint-f",
  "sectionSlug": "F",
  "questions": [
    {
      type: "mcq",
      "prompt": "What does ~int mean in a constraint like type Number interface { ~int }?",
      "options": [
        "Exactly int, no aliases",
        "Any type whose underlying type is int (including type MyInt int)",
        "Negation: any type that is NOT int",
        "A pointer to int"
      ],
      "correctIndex": 1,
      "explanation": "The tilde ~ means \"any type whose underlying type is\". So ~int matches both int and type MyInt int."
    },
    {
      type: "mcq",
      "prompt": "When should you NOT use generics?",
      "options": [
        "When you need compile-time type safety over a truly generic algorithm",
        "When an interface with a method already captures the abstraction cleanly",
        "When you're writing a reusable data structure like a Stack[T]",
        "When implementing Map[T, U] over multiple types"
      ],
      "correctIndex": 1,
      "explanation": "Generics are for when interfaces can't express what you need. If an interface with a method cleanly captures the behavior, prefer that."
    },
    {
      type: "mcq",
      "prompt": "What constraint should you use for a Contains[T](s []T, v T) function?",
      "options": [
        "any",
        "comparable",
        "Number",
        "Ordered"
      ],
      "correctIndex": 1,
      "explanation": "Contains needs == to compare elements, so comparable is the right constraint."
    }
  ]
};
