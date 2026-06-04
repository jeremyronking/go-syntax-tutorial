import type { Lesson } from '../types';

// 15. Arrays
export const arrays: Lesson = {
  slug: 'arrays',
  title: 'Arrays (fixed length, value semantics)',
  section: 'C',
  order: 15,
  runMode: 'playground',
  body: `Arrays in Go are fixed-length sequences of a single type. They are
**value types**: assignment and function calls copy the whole array. For
almost every use case, prefer slices; arrays are useful when the size is part
of the type's contract (\`[32]byte\` for hashing) or when the value semantics
are exactly what you want.`,
  starterCode: `package main

import "fmt"

func main() {
    var a [3]int
    a[0] = 1
    b := a
    b[0] = 99
    fmt.Println(a, b) // a is unchanged: value semantics
}
`,
};

// 16. Slices
export const slices: Lesson = {
  slug: 'slices',
  title: 'Slices (header, `append`, three-index slicing, `copy`, aliasing)',
  section: 'C',
  order: 16,
  runMode: 'playground',
  body: `A slice is a three-word header: a pointer into a backing array, a length,
and a capacity. \`s[i:j]\` makes a new header sharing the same backing array;
\`s[i:j:k]\` caps the capacity too (use it to prevent accidental \`append\` from
mutating the original).

\`append\` may grow the backing array. If capacity is sufficient, it mutates the
underlying array in place — that's the aliasing trap. \`copy\` writes into the
destination, not from a shared buffer, so it is the safe way to clone.`,
  starterCode: `package main

import "fmt"

func main() {
    s := []int{1, 2, 3, 4}
    a := s[:2]    // share backing array
    b := s[:2:2]  // same data, capacity capped at 2
    a = append(a, 99)
    fmt.Println("s:", s) // may show 1 2 99 4
    fmt.Println("b:", b) // safe: 1 2
    fmt.Println("s cap:", cap(s))
}
`,
  gotcha: `\`append\` on a slice with spare capacity mutates the *backing
array*. If two slices share that backing array, both see the change. The
three-index form \`s[:2:2]\` prevents this by capping the capacity.`,
};

// 17. Maps
export const maps: Lesson = {
  slug: 'maps',
  title: 'Maps (zero value is nil, comma-ok, deletion, iteration order)',
  section: 'C',
  order: 17,
  runMode: 'playground',
  body: `The zero value of a map is \`nil\`. Reading from a nil map returns the
zero value; *writing* to a nil map panics. Always \`make\` (or use a composite
literal) before storing keys.

\`v, ok := m[key]\` is the comma-ok form: \`ok\` is false if the key is absent.
\`delete(m, k)\` is a no-op when the key is missing. Iteration order is
intentionally randomized — never rely on it.`,
  starterCode: `package main

import "fmt"

func main() {
    var m map[string]int
    if v, ok := m["a"]; ok {
        fmt.Println(v)
    } else {
        fmt.Println("nil map reads fine:", v, ok)
    }

    m = map[string]int{"a": 1, "b": 2}
    m["c"] = 3
    delete(m, "missing")
    for k, v := range m {
        fmt.Println(k, v)
    }
}
`,
  gotcha: `Maps are not safe for concurrent read/write. Use a \`sync.RWMutex\`,
\`sync.Map\`, or channels — never share a map across goroutines without one.`,
};

// 18. Structs
export const structs: Lesson = {
  slug: 'structs',
  title: 'Structs (composite literals, field tags, anonymous fields, comparability)',
  section: 'C',
  order: 18,
  runMode: 'playground',
  body: `Structs are typed collections of fields. Field names are part of the type
identity: \`type A struct { X int }\` and \`type B struct { X int }\` are not
assignable. Field tags (backtick strings after the field) are metadata, usually
for JSON/YAML encoders — \`json:"name,omitempty"\`.

A struct is comparable with \`==\` only if *all* its fields are comparable. Maps
and slices are not; structs that contain them aren't either.`,
  starterCode: `package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    Name string \`json:"name"\`
    Age  int    \`json:"age,omitempty"\`
}

func main() {
    u := User{Name: "Alex", Age: 30}
    b, _ := json.Marshal(u)
    fmt.Println(string(b))
}
`,
};

// 19. Pointers
export const pointers: Lesson = {
  slug: 'pointers',
  title: 'Pointers (no arithmetic, `new`, address of a composite literal)',
  section: 'C',
  order: 19,
  runMode: 'playground',
  body: `Pointers hold the address of a value. There is no pointer arithmetic —
\`p++\` is a type error. \`new(T)\` allocates a zero-valued \`T\` and returns a
\`*T\`. Taking the address of a composite literal (\`&Point{X: 1}\`) is a
common Go idiom for heap-allocated values without a temporary variable.`,
  starterCode: `package main

import "fmt"

type Point struct{ X, Y int }

func main() {
    p := &Point{X: 1, Y: 2}
    p.X = 10 // Go auto-dereferences for field access
    fmt.Println(*p)
}
`,
};
