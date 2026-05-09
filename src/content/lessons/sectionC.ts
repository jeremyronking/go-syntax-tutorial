import type { Lesson } from "../types";

export const sectionC: Lesson[] = [
  {
    slug: "arrays",
    title: "Arrays (fixed length, value semantics)",
    section: "C",
    order: 15,
    body: `Go arrays have a fixed size that is part of the type. They are copied by value.

\`\`\`go
package main

import "fmt"

func main() {
    var a [3]int           // [0 0 0]
    b := [...]int{1, 2, 3} // size inferred

    c := b // copy — b and c are independent
    c[0] = 99
    fmt.Println(b, c) // [1 2 3] [99 2 3]

    fmt.Printf("type: %T\n", a) // [3]int
}
\`\`\`

- Arrays are rarely used directly — in practice you almost always want a **slice**.
- The size is part of the type: \`[3]int\` and \`[4]int\` are different types.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    var a [3]int
    b := [...]int{1, 2, 3}

    c := b
    c[0] = 99
    fmt.Println(b, c)

    fmt.Printf("type: %T\n", a)
}`,
  },
  {
    slug: "slices",
    title: "Slices (header, append, three-index, copy, aliasing)",
    section: "C",
    order: 16,
    body: `A slice is a descriptor pointing to an underlying array. Slices are the go-to for dynamic lists.

\`\`\`go
package main

import "fmt"

func main() {
    s := []int{1, 2, 3, 4, 5}

    // Slice expression: s[low:high]
    fmt.Println(s[1:3]) // [2 3]

    // Three-index: s[low:high:max] — caps capacity at max-low
    sub := s[1:3:4]
    fmt.Println(sub, "len:", len(sub), "cap:", cap(sub))

    // append grows the slice
    s = append(s, 6, 7)
    fmt.Println(s)

    // copy to avoid aliasing
    dst := make([]int, len(s))
    copy(dst, s)
    dst[0] = 99
    fmt.Println("original:", s, "copy:", dst)
}
\`\`\`,
`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    s := []int{1, 2, 3, 4, 5}

    fmt.Println(s[1:3])

    sub := s[1:3:4]
    fmt.Println(sub, "len:", len(sub), "cap:", cap(sub))

    s = append(s, 6, 7)
    fmt.Println(s)

    dst := make([]int, len(s))
    copy(dst, s)
    dst[0] = 99
    fmt.Println("original:", s, "copy:", dst)
}`,
    gotcha: "Slices alias their underlying array. `a[i:j]` shares storage with `a`. Modifying the sub-slice modifies the original. Use `copy` to break the alias, or use the three-index slice `a[i:j:k]` to prevent `append` from overwriting shared memory.",
  },
  {
    slug: "maps",
    title: "Maps (nil, comma-ok, deletion, iteration order)",
    section: "C",
    order: 17,
    body: `Maps are unordered key-value collections. A nil map behaves like an empty map for reads, but **panics** on writes.

\`\`\`go
package main

import "fmt"

func main() {
    // Map literal
    m := map[string]int{"a": 1, "b": 2}

    // comma-ok to check presence
    v, ok := m["a"]
    fmt.Println(v, ok) // 1 true

    v, ok = m["z"]
    fmt.Println(v, ok) // 0 false — zero value + absent

    // Delete a key
    delete(m, "a")
    fmt.Println(m)

    // Iteration order is random
    for k, v := range m {
        fmt.Println(k, v)
    }

    // nil map: reads work, writes panic
    var nilMap map[string]int
    fmt.Println(nilMap["x"]) // 0 — ok
    // nilMap["x"] = 1        // panic!
    _ = nilMap
}
\`\`\`

- Always use \`make(map[K]V)\` or a map literal before writing.
- Iterate with \`range\` — order is not guaranteed.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func main() {
    m := map[string]int{"a": 1, "b": 2}

    v, ok := m["a"]
    fmt.Println(v, ok)

    v, ok = m["z"]
    fmt.Println(v, ok)

    delete(m, "a")
    fmt.Println(m)

    for k, v := range m {
        fmt.Println(k, v)
    }

    var nilMap map[string]int
    fmt.Println(nilMap["x"])
    _ = nilMap
}`,
    gotcha: "Writing to a nil map panics at runtime. Always initialize maps with `make` or a map literal before inserting.",
  },
  {
    slug: "structs",
    title: "Structs (composite literals, field tags, anonymous fields, comparability)",
    section: "C",
    order: 18,
    body: `Structs group named fields. Go supports composite literals, field tags (for JSON, DB), and embedding.

\`\`\`go
package main

import (
    "encoding/json"
    "fmt"
)

type Point struct {
    X, Y float64
}

type Person struct {
    Name string \`json:"name"\`
    Age  int    \`json:"age"\`
}

func main() {
    p := Point{X: 1, Y: 2}
    fmt.Println(p)

    // Structs are value types — comparing works if all fields are comparable
    p2 := Point{X: 1, Y: 2}
    fmt.Println(p == p2) // true

    // JSON tags in action
    person := Person{Name: "Ada", Age: 36}
    b, _ := json.Marshal(person)
    fmt.Println(string(b)) // {"name":"Ada","age":36}
}
\`\`\``,
    runMode: "playground",
    starterCode: `package main

import (
    "encoding/json"
    "fmt"
)

type Point struct {
    X, Y float64
}

type Person struct {
    Name string \`json:"name"\`
    Age  int    \`json:"age"\`
}

func main() {
    p := Point{X: 1, Y: 2}
    fmt.Println(p)

    p2 := Point{X: 1, Y: 2}
    fmt.Println(p == p2)

    person := Person{Name: "Ada", Age: 36}
    b, _ := json.Marshal(person)
    fmt.Println(string(b))
}`,
  },
  {
    slug: "pointers",
    title: "Pointers (no arithmetic, new, address of composite literal)",
    section: "C",
    order: 19,
    body: `Go has pointers, but no pointer arithmetic. Use \`&\` to take an address and \`*\` to dereference.

\`\`\`go
package main

import "fmt"

type Point struct{ X, Y int }

func main() {
    // Taking the address of a composite literal
    p := &Point{X: 10, Y: 20}
    fmt.Println(p, *p)

    // new allocates zero-valued memory and returns a pointer
    n := new(int)
    fmt.Println(n, *n) // 0xc000... 0
    *n = 42
    fmt.Println(*n) // 42

    // Pointers let functions mutate callers' data
    x := 1
    inc(&x)
    fmt.Println(x) // 2
}

func inc(n *int) {
    *n++
}
\`\`\`

- No pointer arithmetic means pointers are safe — you can't corrupt memory.
- Prefer returning values to mutating through pointers, unless the intent is clear.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

type Point struct{ X, Y int }

func main() {
    p := &Point{X: 10, Y: 20}
    fmt.Println(p, *p)

    n := new(int)
    fmt.Println(n, *n)
    *n = 42
    fmt.Println(*n)

    x := 1
    inc(&x)
    fmt.Println(x)
}

func inc(n *int) {
    *n++
}`,
  },
];

export const sectionCCheckpoint: Lesson["checkpoint"] = {
  id: "checkpoint-c",
  sectionSlug: "C",
  questions: [
    {
      type: "mcq",
      prompt: "What does this program print?\n\n```go\na := []int{1, 2, 3}\nb := a[1:2]\nb = append(b, 99)\nfmt.Println(a)\n```",
      options: [
        "[1 2 3]",
        "[1 2 99]",
        "[1 2 3 99]",
        "Compile error",
      ],
      correctIndex: 1,
      explanation: "The sub-slice b shares the underlying array with a. `append(b, 99)` overwrites a[2] because b has capacity to extend. This is slice aliasing in action.",
    },
    {
      type: "mcq",
      prompt: "What happens when you write to a nil map?",
      options: [
        "The value is stored with key as zero value",
        "Runtime panic",
        "Compile error",
        "Returns the zero value",
      ],
      correctIndex: 1,
      explanation: "Writing to a nil map panics at runtime. Reads from a nil map return the zero value safely.",
    },
    {
      type: "mcq",
      prompt: "What is the zero value of a slice?",
      options: [
        "An empty slice with capacity 0",
        "nil",
        "[]int{}",
        "Undefined",
      ],
      correctIndex: 1,
      explanation: "The zero value of a slice is nil. `var s []int` gives you nil, not an empty initialized slice.",
    },
    {
      type: "fill",
      prompt: "Write a three-index slice expression that takes elements 1-3 of slice `s` with capacity limited to 3:",
      acceptedAnswers: ["s[1:4:4]", "s[1:3:4]", "s[1:4:5]"],
      explanation: "s[low:high:max] gives length=high-low and capacity=max-low. The exact expression depends on what you need, but the key idea is that max caps the capacity.",
    },
    {
      type: "mcq",
      prompt: "Can you compare two structs with `==`?",
      options: [
        "Always, all structs are comparable",
        "Only if all fields are comparable",
        "Never, use reflect.DeepEqual",
        "Only if they have exported fields",
      ],
      correctIndex: 1,
      explanation: "Structs are comparable with == only if all their fields are comparable. If a struct contains a slice or map, == is a compile error.",
    },
  ],
};