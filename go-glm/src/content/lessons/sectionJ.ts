import type { Lesson } from "../types";

export const sectionJ: Lesson[] = [
  {
    slug: "reflect-basics",
    title: "reflect basics — TypeOf, ValueOf, kind vs type",
    section: "J",
    order: 45,
    body: `The \`reflect\` package lets you inspect types and values at runtime. Use it sparingly — prefer interfaces when possible.

\`\`\`go
package main

import (
    "fmt"
    "reflect"
)

func main() {
    x := 42
    s := "hello"
    sl := []int{1, 2, 3}

    fmt.Println(reflect.TypeOf(x))   // int
    fmt.Println(reflect.TypeOf(s))   // string
    fmt.Println(reflect.TypeOf(sl)) // []int

    v := reflect.ValueOf(x)
    fmt.Println(v.Kind()) // int
    fmt.Println(v.Int())  // 42
}
\`\`\`

- \`reflect.TypeOf\` returns the dynamic type.
- \`reflect.ValueOf\` returns a \`reflect.Value\` you can query and manipulate.
- \`Kind\` is the underlying kind (int, struct, slice…) vs the named type.`,
    runMode: "playground",
    starterCode: `package main

import (
    "fmt"
    "reflect"
)

func main() {
    x := 42
    s := "hello"
    sl := []int{1, 2, 3}

    fmt.Println(reflect.TypeOf(x))
    fmt.Println(reflect.TypeOf(s))
    fmt.Println(reflect.TypeOf(sl))

    v := reflect.ValueOf(x)
    fmt.Println(v.Kind())
    fmt.Println(v.Int())
}`,
  },
  {
    slug: "unsafe-pointer",
    title: "unsafe.Pointer and unsafe.Sizeof",
    section: "J",
    order: 46,
    body: `\`unsafe.Pointer\` bypasses Go's type system to convert between pointer types. \`unsafe.Sizeof\` and \`unsafe.Offsetof\` are informational — they don't violate safety.

- \`unsafe.Pointer\` can convert \`*int\` to \`*float64\`, for example.
- The Playground sandbox restricts unsafe operations.
- Use \`unsafe\` only when you have a proven need — it breaks Go's memory safety guarantees.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat main.go"},{"kind":"stdout","text":"package main\n\nimport (\n    \"fmt\"\n    \"unsafe\"\n)\n\ntype MyStruct struct {\n    A int64\n    B int32\n    C int8\n}\n\nfunc main() {\n    s := MyStruct{}\n    fmt.Println(\"Size:\", unsafe.Sizeof(s))\n    fmt.Println(\"Offset of B:\", unsafe.Offsetof(s.B))\n}"},{"kind":"command","text":"go run ."},{"kind":"stdout","text":"Size: 16\nOffset of B: 8"},{"kind":"command","text":"# unsafe.Pointer can convert between pointer types"},{"kind":"command","text":"# The Playground sandbox forbids unsafe operations"},{"kind":"command","text":"# Use unsafe sparingly — it breaks Go's safety guarantees"}],
    gotcha: "The Go Playground sandbox forbids most unsafe operations. If you need unsafe, you must run locally.",
  },
  {
    slug: "cgo",
    title: "cgo (one-paragraph awareness page)",
    section: "J",
    order: 47,
    body: `\`cgo\` lets Go call C functions and vice versa. It's powerful but comes with significant trade-offs.

- Crosses the Go/C boundary has overhead (stack switches, GC considerations).
- Increases compile time and binary size.
- The Go Playground does **not** support cgo.
- If you need to call C, consider writing a pure Go wrapper or using \`CGO_ENABLED=0\` for most builds.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat main.go"},{"kind":"stdout","text":"package main\n\n/*\n#include <stdio.h>\nvoid say_hi() {\n    printf(\"Hello from C!\\n\");\n}\n*/\nimport \"C\"\n\nfunc main() {\n    C.say_hi()\n}"},{"kind":"command","text":"# cgo requires a C compiler (gcc/clang) and CGO_ENABLED=1"},{"kind":"command","text":"# The Playground sandbox does not support cgo"},{"kind":"command","text":"# Run cgo programs locally with: CGO_ENABLED=1 go run ."}],
  },
  {
    slug: "build-tags",
    title: "Build tags (//go:build) and conditional compilation",
    section: "J",
    order: 48,
    body: `Build tags conditionally include or exclude files during compilation. The \`//go:build\` directive is the modern syntax (Go 1.17+).

\`\`\`go
// File: stats_linux.go
//go:build linux

package stats

func Platform() string {
    return "linux"
}
\`\`\`

\`\`\`go
// File: stats_darwin.go
//go:build darwin

package stats

func Platform() string {
    return "darwin"
}
\`\`\`

\`\`\`go
// File: stats_other.go
//go:build !linux && !darwin

package stats

func Platform() string {
    return "other"
}
\`\`\`

- \`//go:build\` replaces the old \`// +build\` syntax.
- Tags use boolean expressions: \`linux\`, \`!windows\`, \`linux && amd64\`.
- Files can have different implementations for different platforms.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func Platform() string {
    return "this platform"
}

func main() {
    fmt.Println("Running on:", Platform())
}`,
  }
];

export const sectionJCheckpoint: Lesson["checkpoint"] = {
  "id": "checkpoint-j",
  "sectionSlug": "J",
  "questions": [
    {
      type: "mcq",
      "prompt": "What does reflect.Kind tell you that reflect.Type does not?",
      "options": [
        "The exact named type (e.g., MyStruct)",
        "The underlying category (e.g., struct, int, slice)",
        "The memory address of the value",
        "Nothing — they're identical"
      ],
      "correctIndex": 1,
      "explanation": "Kind gives the underlying category (struct, int, slice…), while Type gives the full named type (e.g., MyStruct). They differ for custom types."
    },
    {
      type: "mcq",
      "prompt": "Can you use unsafe.Pointer in the Go Playground?",
      "options": [
        "Yes, without restrictions",
        "No, the sandbox blocks most unsafe operations",
        "Only with a special import",
        "Yes, but only for Sizeof"
      ],
      "correctIndex": 1,
      "explanation": "The Play sandbox restricts unsafe operations. Sizeof and Offsetof work, but actual pointer conversions don't."
    },
    {
      type: "fill",
      "prompt": "Write the build tag for a file that should only compile on Linux:",
      "acceptedAnswers": [
        "//go:build linux"
      ],
      "explanation": "Modern build tags use //go:build with boolean expressions."
    },
    {
      type: "mcq",
      "prompt": "What does cgo enable?",
      "options": [
        "Go code that runs faster",
        "Calling C functions from Go and vice versa",
        "Cross-compiling Go programs",
        "Running Go in the browser"
      ],
      "correctIndex": 1,
      "explanation": "cgo is the bridge between Go and C. It lets you call C functions from Go and Go functions from C, but it comes with overhead and the Playground doesn't support it."
    }
  ]
};
