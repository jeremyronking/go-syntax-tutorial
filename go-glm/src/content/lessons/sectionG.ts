import type { Lesson } from "../types";

export const sectionG: Lesson[] = [
  {
    slug: "error-interface",
    title: "The error interface, sentinel errors, errors.Is/As",
    section: "G",
    order: 31,
    body: `Go errors are values. The \`error\` interface is just \`Error() string\`. No exceptions, no try/catch.

\`\`\`go
package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("item not found")

type ValueError struct {
    Field string
    Msg   string
}

func (e ValueError) Error() string {
    return fmt.Sprintf("value error: %s: %s", e.Field, e.Msg)
}

func findItem(id int) (string, error) {
    if id <= 0 {
        return "", ErrNotFound
    }
    if id == 42 {
        return "", ValueError{Field: "id", Msg: "reserved"}
    }
    return "widget", nil
}

func main() {
    for _, id := range []int{0, 42, 7} {
        item, err := findItem(id)
        if err != nil {
            if errors.Is(err, ErrNotFound) {
                fmt.Println("not found:", id)
                continue
            }
            var ve ValueError
            if errors.As(err, &ve) {
                fmt.Printf("value error: field=%s msg=%s\\n", ve.Field, ve.Msg)
                continue
            }
            fmt.Println("unknown error:", err)
            continue
        }
        fmt.Println("found:", item)
    }
}
\`\`\`

- Always check errors. \`if err != nil\` is the Go way.
- \`errors.Is\` compares against sentinel values (including wrapped errors).
- \`errors.As\` extracts a specific error type.`,
    runMode: "playground",
    starterCode: `package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("item not found")

type ValueError struct {
    Field string
    Msg   string
}

func (e ValueError) Error() string {
    return fmt.Sprintf("value error: %s: %s", e.Field, e.Msg)
}

func findItem(id int) (string, error) {
    if id <= 0 {
        return "", ErrNotFound
    }
    if id == 42 {
        return "", ValueError{Field: "id", Msg: "reserved"}
    }
    return "widget", nil
}

func main() {
    for _, id := range []int{0, 42, 7} {
        item, err := findItem(id)
        if err != nil {
            if errors.Is(err, ErrNotFound) {
                fmt.Println("not found:", id)
                continue
            }
            var ve ValueError
            if errors.As(err, &ve) {
                fmt.Printf("value error: field=%s msg=%s
", ve.Field, ve.Msg)
                continue
            }
            fmt.Println("unknown error:", err)
            continue
        }
        fmt.Println("found:", item)
    }
}`,
  },
  {
    slug: "error-wrapping",
    title: "Wrapping with fmt.Errorf, errors.Join",
    section: "G",
    order: 32,
    body: `Use \`fmt.Errorf("...: %w", err)\` to wrap errors, preserving the chain for \`errors.Is\` and \`errors.As\`.

\`\`\`go
package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func db() error {
    return ErrNotFound
}

func service() error {
    if err := db(); err != nil {
        return fmt.Errorf("service: %w", err)
    }
    return nil
}

func handler() error {
    if err := service(); err != nil {
        return fmt.Errorf("handler: %w", err)
    }
    return nil
}

func main() {
    err := handler()
    fmt.Println(err)

    fmt.Println(errors.Is(err, ErrNotFound))

    combined := errors.Join(
        errors.New("err1"),
        errors.New("err2"),
    )
    fmt.Println(combined)
}
\`\`\`

- \`%w\` wraps an error so the chain is preserved.
- Always use \`errors.Is\` / \`errors.As\` instead of \`==\` for error comparison.`,
    runMode: "playground",
    starterCode: `package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func db() error {
    return ErrNotFound
}

func service() error {
    if err := db(); err != nil {
        return fmt.Errorf("service: %w", err)
    }
    return nil
}

func handler() error {
    if err := service(); err != nil {
        return fmt.Errorf("handler: %w", err)
    }
    return nil
}

func main() {
    err := handler()
    fmt.Println(err)
    fmt.Println(errors.Is(err, ErrNotFound))

    combined := errors.Join(
        errors.New("err1"),
        errors.New("err2"),
    )
    fmt.Println(combined)
}`,
  },
  {
    slug: "panic-recover",
    title: "panic / recover and when each is appropriate",
    section: "G",
    order: 33,
    body: `\`panic\` stops normal execution and begins unwinding. \`recover\` catches a panic inside a deferred function. Use panic for **programming errors**, not for normal error handling.

\`\`\`go
package main

import "fmt"

func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("caught panic: %v", r)
        }
    }()
    return a / b, nil
}

func main() {
    r, err := safeDiv(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    }
    fmt.Println(r)
}
\`\`\`

- Use \`panic\` for truly impossible states (programmer errors, invariant violations).
- Use \`error\` return values for **everything** the caller can reasonably handle.
- Recovering from panic is for **library boundaries** and goroutine supervisors — not business logic.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("caught panic: %v", r)
        }
    }()
    return a / b, nil
}

func main() {
    r, err := safeDiv(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    }
    fmt.Println(r)
}`,
    gotcha: "Panic is not exception handling. It's a safety net for bugs. Normal error flow in Go uses error returns. If you find yourself using panic/recover for control flow, rewrite with error returns.",
  }
];

export const sectionGCheckpoint: Lesson["checkpoint"] = {
  "id": "checkpoint-g",
  "sectionSlug": "G",
  "questions": [
    {
      type: "mcq",
      "prompt": "What does errors.Is(err, ErrNotFound) do that err == ErrNotFound doesn't?",
      "options": [
        "Nothing, they're equivalent",
        "It unwraps error chains created with %w",
        "It catches panics",
        "It compares error messages"
      ],
      "correctIndex": 1,
      "explanation": "errors.Is walks the wrap chain. If err was created with fmt.Errorf(\"context: %w\", ErrNotFound), err == ErrNotFound is false but errors.Is(err, ErrNotFound) is true."
    },
    {
      type: "mcq",
      "prompt": "When should you use panic in Go?",
      "options": [
        "When a database query returns no rows",
        "When a user provides invalid input",
        "When a programming invariant is violated",
        "When a network request times out"
      ],
      "correctIndex": 2,
      "explanation": "Panic is for programming errors and impossible states. Everything the caller can handle should use error returns."
    },
    {
      type: "fill",
      "prompt": "Write the verb used in fmt.Errorf to wrap an error for errors.Is to find:",
      "acceptedAnswers": [
        "%w"
      ],
      "explanation": "%w is the wrapping verb. It preserves the error chain so errors.Is and errors.As can traverse it."
    }
  ]
};
