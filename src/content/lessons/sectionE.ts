import type { Lesson } from "../types";

export const sectionE: Lesson[] = [
  {
    slug: "interfaces-implicit-satisfaction",
    title: "Interfaces, implicit satisfaction, any",
    section: "E",
    order: 24,
    body: `Go interfaces are satisfied implicitly — if a type has all the methods, it implements the interface. No \`implements\` keyword needed.

\`\`\`go
package main

import "fmt"

type Speaker interface {
    Speak() string
}

type Dog struct{ Name string }
func (d Dog) Speak() string { return d.Name + " says woof" }

type Robot struct{ ID int }
func (r Robot) Speak() string { return fmt.Sprintf("Robot #%d beep", r.ID) }

func greet(s Speaker) { fmt.Println(s.Speak()) }

func main() {
    greet(Dog{Name: "Rex"})
    greet(Robot{ID: 7})

    // The empty interface
    var x any = 42
    x = "now a string"
    fmt.Println(x)
}
\`\`\`

- \`interface{}\` and \`any\` are identical — \`any\` is the alias added in Go 1.18.
- Implicit satisfaction means you can define interfaces **after** the types, including in packages that consume them.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

type Speaker interface {
    Speak() string
}

type Dog struct{ Name string }
func (d Dog) Speak() string { return d.Name + " says woof" }

type Robot struct{ ID int }
func (r Robot) Speak() string { return fmt.Sprintf("Robot #%d beep", r.ID) }

func greet(s Speaker) { fmt.Println(s.Speak()) }

func main() {
    greet(Dog{Name: "Rex"})
    greet(Robot{ID: 7})

    var x any = 42
    x = "now a string"
    fmt.Println(x)
}`,
  },
  {
    slug: "type-assertions",
    title: "Type assertions, comma-ok, type switches",
    section: "E",
    order: 25,
    body: `Use type assertions to extract the concrete value behind an interface. The two-value form prevents panics.

\`\`\`go
package main

import "fmt"

func describe(v any) {
    // Type assertion with comma-ok
    if s, ok := v.(string); ok {
        fmt.Println("string of length", len(s))
        return
    }

    // Type switch
    switch t := v.(type) {
    case int:
        fmt.Println("int:", t)
    case float64:
        fmt.Println("float64:", t)
    default:
        fmt.Printf("other: %T\\n", t)
    }
}

func main() {
    describe("hello")
    describe(42)
    describe(3.14)
    describe(true)
}
\`\`\`

- Single-value assertion (\`v.(string)\`) panics if wrong type.
- Two-value (\`v, ok := i.(string)\`) is safe — always prefer it.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func describe(v any) {
    if s, ok := v.(string); ok {
        fmt.Println("string of length", len(s))
        return
    }

    switch t := v.(type) {
    case int:
        fmt.Println("int:", t)
    case float64:
        fmt.Println("float64:", t)
    default:
        fmt.Printf("other: %T
", t)
    }
}

func main() {
    describe("hello")
    describe(42)
    describe(3.14)
    describe(true)
}`,
  },
  {
    slug: "embedding",
    title: "Embedding (struct, interface, method promotion)",
    section: "E",
    order: 26,
    body: `Embedding promotes methods and fields. It's not inheritance — it's composition through forwarding.

\`\`\`go
package main

import "fmt"

type Logger struct {
    Prefix string
}

func (l Logger) Log(msg string) {
    fmt.Printf("[%s] %s\\n", l.Prefix, msg)
}

type Service struct {
    Logger // embed — Service "inherits" Log and Prefix
    Name   string
}

func main() {
    s := Service{
        Logger: Logger{Prefix: "svc"},
        Name:   "auth",
    }
    // Method promotion — Log is accessible directly
    s.Log("starting")

    // Can also call explicitly
    s.Logger.Log("via embedded field")
}
\`\`\`

- Embedding promotes the inner type's methods to the outer type.
- Interface embedding composes multiple interfaces: \`type ReadWriter interface { Reader; Writer }\`.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

type Logger struct {
    Prefix string
}

func (l Logger) Log(msg string) {
    fmt.Printf("[%s] %s
", l.Prefix, msg)
}

type Service struct {
    Logger
    Name string
}

func main() {
    s := Service{
        Logger: Logger{Prefix: "svc"},
        Name:   "auth",
    }
    s.Log("starting")
    s.Logger.Log("via embedded field")
}`,
  },
  {
    slug: "stdlib-interfaces",
    title: "Common stdlib interfaces: error, Stringer, io.Reader/Writer",
    section: "E",
    order: 27,
    body: `The most-used interfaces in the Go standard library.

\`\`\`go
package main

import (
    "fmt"
    "io"
    "strings"
)

// Stringer — fmt looks for this
type Point struct{ X, Y int }
func (p Point) String() string { return fmt.Sprintf("(%d,%d)", p.X, p.Y) }

// error — just Error() string
type ErrNotFound struct{ Name string }
func (e ErrNotFound) Error() string { return "not found: " + e.Name }

func main() {
    // Stringer
    p := Point{X: 3, Y: 4}
    fmt.Println(p)

    // error
    var err error = ErrNotFound{Name: "Alice"}
    fmt.Println(err)

    // io.Reader
    r := strings.NewReader("hello, go")
    buf := make([]byte, 5)
    n, _ := r.Read(buf)
    fmt.Printf("read %d bytes: %s\\n", n, buf)

    // io.Copy uses io.Reader + io.Writer
    r2 := strings.NewReader("stream me")
    io.Copy(osWriter{}, r2)
}

type osWriter struct{}
func (osWriter) Write(p []byte) (int, error) { fmt.Print(string(p)); return len(p), nil }
\`\`\`

- \`error\` is the most fundamental interface in Go.
- \`fmt.Stringer\` controls how your type prints.
- \`io.Reader\` and \`io.Writer\` are the building blocks of Go's I/O model.`,
    runMode: "playground",
    starterCode: `package main

import (
    "fmt"
    "io"
    "strings"
)

type Point struct{ X, Y int }
func (p Point) String() string { return fmt.Sprintf("(%d,%d)", p.X, p.Y) }

type ErrNotFound struct{ Name string }
func (e ErrNotFound) Error() string { return "not found: " + e.Name }

func main() {
    p := Point{X: 3, Y: 4}
    fmt.Println(p)

    var err error = ErrNotFound{Name: "Alice"}
    fmt.Println(err)

    r := strings.NewReader("hello, go")
    buf := make([]byte, 5)
    n, _ := r.Read(buf)
    fmt.Printf("read %d bytes: %s
", n, buf)

    r2 := strings.NewReader("stream me")
    io.Copy(osWriter{}, r2)
}

type osWriter struct{}
func (osWriter) Write(p []byte) (int, error) { fmt.Print(string(p)); return len(p), nil }`,
  }
];

export const sectionECheckpoint: Lesson["checkpoint"] = {
  "id": "checkpoint-e",
  "sectionSlug": "E",
  "questions": [
    {
      type: "mcq",
      "prompt": "If Dog has a Speak() method that satisfies Speaker, does *Dog also satisfy Speaker?",
      "options": [
        "Yes — pointer receivers are always promoted",
        "No — only the concrete type satisfies the interface",
        "Yes, because Go automatically dereferences *Dog to call Speak",
        "Only if Speak has a pointer receiver"
      ],
      "correctIndex": 2,
      "explanation": "If Dog satisfies Speaker via a value receiver, *Dog also satisfies it because Go can dereference the pointer to reach the value."
    },
    {
      type: "mcq",
      "prompt": "What does var i interface{}; i = 42; s := i.(string) do at runtime?",
      "options": [
        "Returns an empty string",
        "Panics — i holds an int, not a string",
        "Returns (\"\", false)",
        "Compiles but returns nil"
      ],
      "correctIndex": 1,
      "explanation": "A single-value type assertion (i.(string)) panics if the concrete type doesn't match. Use the two-value form v, ok := i.(string) for safety."
    },
    {
      type: "mcq",
      "prompt": "What does embedding Logger in Service give you?",
      "options": [
        "Service inherits Logger's methods — you can call s.Log(\"msg\")",
        "Service copies all of Logger's fields into itself (like inheritance)",
        "Service implements the Logger interface",
        "Compile error — you can't embed structs"
      ],
      "correctIndex": 0,
      "explanation": "Embedding promotes methods and fields, so you can call s.Log(\"msg\") directly. But it's composition, not inheritance — s.Logger.Log(\"msg\") also works."
    },
    {
      type: "fill",
      "prompt": "What single-method interface does the error type require? Write the method signature:",
      "acceptedAnswers": [
        "Error() string"
      ],
      "explanation": "The error interface has one method: Error() string."
    }
  ]
};
