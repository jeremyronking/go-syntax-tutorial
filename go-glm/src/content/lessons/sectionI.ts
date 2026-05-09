import type { Lesson } from "../types";

export const sectionI: Lesson[] = [
  {
    slug: "packages-exported",
    title: "Packages, exported vs unexported",
    section: "I",
    order: 41,
    body: `Go uses capitalization to control visibility. Names starting with an uppercase letter are **exported** (public); lowercase names are **unexported** (private to the package).

\`\`\`go
package main

import (
    "fmt"
    "math"
)

func main() {
    // Exported: fmt.Println, math.Pi
    fmt.Println("Pi:", math.Pi)

    // Unexported: can't access math.pi (lowercase)
    // fmt.Println(math.pi) // compile error
}
\`\`\`

- \`fmt.Println\` — exported (public).
- \`math.pi\` — unexported (private, lowercase) — can't access from outside.
- This applies to functions, types, constants, variables, and struct fields.`,
    runMode: "playground",
    starterCode: `package main

import (
    "fmt"
    "math"
)

func main() {
    fmt.Println("Pi:", math.Pi)
}`,
  },
  {
    slug: "init-order",
    title: "init() order, package-level variable init",
    section: "I",
    order: 42,
    body: `Each package can have one or more \`init()\` functions. They run after all variable declarations and before \`main()\`, in the order they appear.

\`\`\`go
package main

import "fmt"

var x = initVar()

func initVar() int {
    fmt.Println("initializing x")
    return 42
}

func init() {
    fmt.Println("first init")
}

func init() {
    fmt.Println("second init")
}

func main() {
    fmt.Println("x =", x)
}
\`\`\`

- Package-level variables are initialized before \`init()\` runs.
- Multiple \`init()\` functions run in declaration order within a file.
- Across files in a package, initialization order follows file name order.
- Use \`init()\` sparingly — explicit setup in \`main()\` is usually clearer.`,
    runMode: "playground",
    starterCode: `package main

import "fmt"

var x = initVar()

func initVar() int {
    fmt.Println("initializing x")
    return 42
}

func init() {
    fmt.Println("first init")
}

func main() {
    fmt.Println("x =", x)
}`,
  },
  {
    slug: "internal-directories",
    title: "internal/ directories, import paths, go.mod module path",
    section: "I",
    order: 43,
    body: `The \`internal/\` directory convention restricts imports to the parent module. Packages outside the module tree cannot import \`internal\` packages.

- \`go mod init\` creates a \`go.mod\` file defining the module path.
- \`internal/\` packages are only importable by code in the module's subtree.
- Import paths follow the module path: \`example.com/myproject/internal/config\`.\`

This is enforced by the Go compiler — not a convention.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"mkdir -p myproject/internal/config && cd myproject"},{"kind":"command","text":"go mod init example.com/myproject"},{"kind":"stdout","text":"go: creating new go.mod: module example.com/myproject"},{"kind":"command","text":"cat go.mod"},{"kind":"stdout","text":"module example.com/myproject\n\ngo 1.23"},{"kind":"command","text":"cat internal/config/config.go"},{"kind":"stdout","text":"package config\n\nfunc Load() string {\n    return \"loaded\"\n}"},{"kind":"command","text":"go build ./..."},{"kind":"stdout","text":""},{"kind":"command","text":"# external packages cannot import internal/config"},{"kind":"stdout","text":"# the Go compiler enforces this restriction"}],
  },
  {
    slug: "go-embed",
    title: "//go:embed",
    section: "I",
    order: 44,
    body: `\`//go:embed\` embeds files into the binary at compile time. Supports \`string\`, \`[]byte\`, and \`embed.FS\`.

- \`//go:embed hello.txt\` embeds a single file as a \`string\`.
- \`//go:embed static/*\` embeds a directory tree as \`embed.FS\`.
- The directive must be a // comment (not /* */) directly above the variable.
- Ideal for embedding web assets, templates, and configuration.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat main.go"},{"kind":"stdout","text":"package main\n\nimport (\n    \"embed\"\n    \"fmt\"\n)\n\n//go:embed hello.txt\nvar content string\n\nfunc main() {\n    fmt.Println(content)\n}"},{"kind":"command","text":"echo 'Hello from embedded file!' > hello.txt"},{"kind":"command","text":"go run ."},{"kind":"stdout","text":"Hello from embedded file!"},{"kind":"command","text":"# Works with string, []byte, or embed.FS"}],
  }
];

export const sectionICheckpoint: Lesson["checkpoint"] = {
  "id": "checkpoint-i",
  "sectionSlug": "I",
  "questions": [
    {
      type: "mcq",
      "prompt": "In Go, how do you make a function visible outside its package?",
      "options": [
        "Use the `public` keyword",
        "Start the function name with an uppercase letter",
        "Add an `export` comment",
        "Declare it in the package's header file"
      ],
      "correctIndex": 1,
      "explanation": "Go uses capitalization for visibility. Uppercase first letter = exported (public). Lowercase = unexported (private)."
    },
    {
      type: "mcq",
      "prompt": "In what order do init() functions execute?",
      "options": [
        "Alphabetical by package name",
        "In the order they appear in the source, after package-level variables",
        "Before package-level variable initialization",
        "In reverse declaration order"
      ],
      "correctIndex": 1,
      "explanation": "Package-level variables are initialized first, then init() functions run in declaration order within each file."
    },
    {
      type: "mcq",
      "prompt": "What does the internal/ directory convention enforce?",
      "options": [
        "Code in internal/ has no access to other packages",
        "Packages outside the module cannot import internal/ packages",
        "internal/ code runs in a separate goroutine",
        "Files in internal/ are not compiled"
      ],
      "correctIndex": 1,
      "explanation": "The Go compiler prevents packages outside the module tree from importing internal/ packages. This is enforced, not just conventional."
    },
    {
      type: "fill",
      "prompt": "Write the Go directive that embeds a file called data.json into a string variable:",
      "acceptedAnswers": [
        "//go:embed data.json"
      ],
      "explanation": "//go:embed must be a // comment (not /* */) directly above the variable declaration."
    }
  ]
};
