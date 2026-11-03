import type { Lesson } from '../types';

const typeParameters: Lesson = {
  slug: 'type-parameters',
  title: 'Type parameters and inference',
  sectionId: 'generics',
  order: 28,
  runMode: 'playground',
  body: `A generic function declares type parameters in square brackets: \`func Map[T, U any](xs []T, f func(T) U) []U\`. Type inference fills them from the arguments, so the call site usually stays clean.

Explicit instantiation is available when inference cannot work — for example, when a type parameter appears only in the result. Prefer the inferred form; if callers constantly spell out types, the generic may not be earning its keep.`,
  starterCode: `package main

import (
	"fmt"
	"sort"
)

func Map[T, U any](xs []T, f func(T) U) []U {
	out := make([]U, 0, len(xs))
	for _, x := range xs {
		out = append(out, f(x))
	}
	return out
}

func Keys[K comparable, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}

func main() {
	lengths := Map([]string{"go", "gopher"}, func(s string) int { return len(s) })
	fmt.Println(lengths)

	keys := Keys(map[string]int{"b": 2, "a": 1})
	sort.Strings(keys)
	fmt.Println(keys)

	explicit := Map[int, string]([]int{1, 2}, func(i int) string { return fmt.Sprint(i) })
	fmt.Println(explicit)
}
`,
  gotcha:
    'A type parameter that appears only in the return type cannot be inferred. `func Zero[T any]() T` requires `Zero[int]()` at every call.',
};

const constraints: Lesson = {
  slug: 'constraints',
  title: 'Constraints, comparable, ~ and type sets',
  sectionId: 'generics',
  order: 29,
  runMode: 'playground',
  body: `A constraint is an interface used to restrict type parameters. It can list method requirements, concrete types, or both: \`interface{ ~int | ~float64 }\`. The \`~\` prefix admits any type whose underlying type is the listed one — including named types like \`type Celsius float64\`.

\`comparable\` is the predeclared constraint for types usable with \`==\`. Maps and switches over type parameters need it. Type sets are the formal name for the union of types a constraint admits.`,
  starterCode: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Sum[T Number](xs []T) T {
	var total T
	for _, x := range xs {
		total += x
	}
	return total
}

func Index[T comparable](xs []T, want T) int {
	for i, x := range xs {
		if x == want {
			return i
		}
	}
	return -1
}

type MyInt int

func main() {
	fmt.Println(Sum([]MyInt{1, 2, 3}))
	fmt.Println(Sum([]float64{1.5, 2.5}))
	fmt.Println(Index([]string{"a", "b"}, "b"))
}
`,
  gotcha:
    'Without `~`, a constraint listing `int` excludes `type MyInt int`. Named types need the tilde form unless you mean exactly the built-in type.',
};

const whenNotGenerics: Lesson = {
  slug: 'when-not-generics',
  title: 'When not to reach for generics',
  sectionId: 'generics',
  order: 30,
  runMode: 'playground',
  body: `Generics pay off when the same algorithm works over several types and the alternative is duplication or \`any\` plus assertions. They cost readability: every reader now holds a type parameter in their head.

If you have one concrete type, write the concrete function. If the types share behavior, an interface is usually clearer than a constraint. If the algorithm needs different code per type, a type switch or separate functions is honest. Do not generify a call site that has exactly one instantiation.`,
  starterCode: `package main

import "fmt"

// Two concrete functions. Boring, obvious, and enough when you have two types.
func SumInts(xs []int) int {
	total := 0
	for _, x := range xs {
		total += x
	}
	return total
}

func SumFloats(xs []float64) float64 {
	var total float64
	for _, x := range xs {
		total += x
	}
	return total
}

// Generics earn their place here: one algorithm, many element types, callers unchanged.
func Filter[T any](xs []T, keep func(T) bool) []T {
	out := make([]T, 0, len(xs))
	for _, x := range xs {
		if keep(x) {
			out = append(out, x)
		}
	}
	return out
}

func main() {
	fmt.Println(SumInts([]int{1, 2}), SumFloats([]float64{1.5, 2.5}))
	fmt.Println(Filter([]string{"go", "rust", "zig"}, func(s string) bool { return len(s) == 2 }))
}
`,
  gotcha:
    'A generic with a single instantiation is abstraction debt. If nothing else will call it with a different type, the type parameter buys nothing and costs clarity.',
};

export const sectionFLessons: Lesson[] = [
  typeParameters,
  constraints,
  whenNotGenerics,
  {
    slug: 'section-f-checkpoint',
    title: 'Section F checkpoint',
    sectionId: 'generics',
    order: 30.5,
    runMode: 'annotated',
    body: 'Four questions on type inference, constraints, `~`, and restraint.',
    checkpoint: {
      id: 'checkpoint-generics',
      sectionId: 'generics',
      title: 'Generics checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does `~int` in a constraint admit that `int` does not?',
          options: [
            'Pointers to int',
            'Named types whose underlying type is int',
            'Larger integer types',
            'Nothing; they are identical',
          ],
          correctIndex: 1,
          explanation:
            'The tilde matches any type with that underlying type, including `type MyInt int`.',
        },
        {
          kind: 'mcq',
          prompt: 'Which operation requires the `comparable` constraint?',
          options: ['Range over a slice', 'Using == on values of a type parameter', 'Calling a method', 'Allocating with make'],
          correctIndex: 1,
          explanation:
            'Equality is only available to type parameters constrained to comparable (or a concrete type set that implies it).',
        },
        {
          kind: 'fill',
          prompt: 'A type parameter that appears only in the return type cannot be ___ at the call site.',
          acceptedAnswers: ['inferred', 'inference', 'deduced'],
          explanation:
            'Inference works from argument types; result-only parameters must be written explicitly.',
        },
        {
          kind: 'mcq',
          prompt: 'You have one concrete type and one call site. What should you write?',
          options: [
            'A generic function with one type parameter',
            'The concrete function',
            'An any-based function with assertions',
            'A code generator',
          ],
          correctIndex: 1,
          explanation:
            'Generics pay off across multiple types; with one instantiation they add cognitive cost for no reuse.',
        },
      ],
    },
  },
];
