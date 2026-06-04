import type { Lesson } from '../types';

// 28. Type parameters
export const typeParameters: Lesson = {
  slug: 'type-parameters',
  title: 'Type parameters, type inference',
  section: 'F',
  order: 28,
  runMode: 'playground',
  body: `Functions and types can be parameterized with type parameters:
\`func Map[T, U any](xs []T, f func(T) U) []U\`. The \`any\` constraint matches any
type. Type inference usually means you don't have to specify \`T\` and \`U\` at
the call site.`,
  starterCode: `package main

import "fmt"

func Map[T, U any](xs []T, f func(T) U) []U {
    out := make([]U, len(xs))
    for i, x := range xs {
        out[i] = f(x)
    }
    return out
}

func main() {
    xs := Map([]int{1, 2, 3}, func(n int) string {
        return fmt.Sprintf("n=%d", n)
    })
    fmt.Println(xs)
}
`,
};

// 29. Constraints
export const constraints: Lesson = {
  slug: 'constraints',
  title: 'Constraints, `comparable`, `~` underlying-type, type sets',
  section: 'F',
  order: 29,
  runMode: 'playground',
  body: `Constraints describe the shape a type parameter must fit. The predeclared
\`comparable\` is an interface for types that support \`==\` and \`!=\`. The
\`~\` token in a constraint means "any type whose *underlying* type is T" — so
\`~int\` matches \`type MyInt int\`.

Type-set constraints (Go 1.18+) let you write
\`interface { ~int | ~string | ~float64 }\` to allow a union of underlying types.`,
  starterCode: `package main

import "fmt"

type Number interface {
    ~int | ~int64 | ~float64
}

func Sum[T Number](xs []T) T {
    var total T
    for _, x := range xs {
        total += x
    }
    return total
}

type Celsius float64

func main() {
    fmt.Println(Sum([]int{1, 2, 3}))        // 6
    fmt.Println(Sum([]float64{1.5, 2.5}))  // 4
    fmt.Println(Sum([]Celsius{20, 22, 18})) // 60
}
`,
  gotcha: `\`~int\` matches *types with an int underlying type*, not the literal
\`int\`'s method set. If you need methods, list them in the interface.`,
};

// 30. When not to use generics
export const whenNotGenerics: Lesson = {
  slug: 'when-not-generics',
  title: 'When *not* to reach for generics',
  section: 'F',
  order: 30,
  runMode: 'playground',
  body: `Generics are the right call when the same algorithm works on a family
of types with no value-specific logic. They're the wrong call when:

- You only have one or two concrete types in practice (just write the function).
- The "generic" body branches on type-specific behavior anyway — you're
  paying complexity for an illusion of generality.
- The interface is just an \`any\` with a type switch inside; that pattern is
  usually better expressed as an interface with real methods.`,
  starterCode: `package main

import "fmt"

// Bad: "generic" that just dispatches on type
func describe(v any) string {
    if s, ok := v.(string); ok {
        return "string:" + s
    }
    if n, ok := v.(int); ok {
        return fmt.Sprintf("int:%d", n)
    }
    return "other"
}

// Better: ask the type itself
type Describable interface{ Describe() string }
type Item struct{ Name string }
func (i Item) Describe() string { return "item:" + i.Name }

func main() {
    fmt.Println(describe("hi"))
    fmt.Println(describe(42))
    fmt.Println(Item{Name: "x"}.Describe())
}
`,
  gotcha: `\`interface{}\` plus a type switch is often generics-shaped code that
should be an interface with methods. Reach for generics when the *algorithm*
is generic, not when the *code* needs to know the type.`,
};
