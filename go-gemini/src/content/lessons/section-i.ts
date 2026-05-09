import type { Lesson } from '../types'

export const sectionILessons: Lesson[] = [
  {
    slug: 'packages-exported',
    title: '41. Packages & exported names',
    section: 'Section I: Packages & project layout',
    order: 41,
    runMode: 'playground',
    body: `
In Go, a name is exported if it begins with a capital letter. For example, \`Pi\` is an exported name, which is exported from the \`math\` package.

\`pi\` does not start with a capital letter, so it is unexported. Unexported names are not accessible from outside the package they are defined in.

When importing a package, you can refer only to its exported names. Any "unexported" names are invisible outside the package.
    `,
    starterCode: `package main

import (
    "fmt"
    "math"
)

func main() {
    // math.Pi is exported, so we can access it.
    fmt.Println("Pi is", math.Pi)
    
    // Uncommenting the next line will cause a compilation error
    // fmt.Println(math.pi)
}`,
  },
  {
    slug: 'init-functions',
    title: '42. Package initialization',
    section: 'Section I: Packages & project layout',
    order: 42,
    runMode: 'playground',
    body: `
Variables declared at the package level are evaluated before the \`init\` functions.

Each package can contain one or more \`init\` functions. They are called automatically after all variable declarations in the package have evaluated their initializers, and those are evaluated only after all the imported packages have been initialized.

\`main.main\` is called after all \`init\` functions have finished.
    `,
    starterCode: `package main

import "fmt"

var packageVar = initializeVar()

func initializeVar() string {
    fmt.Println("1. Package-level variable initialized")
    return "Hello"
}

func init() {
    fmt.Println("2. init() function called")
}

func main() {
    fmt.Println("3. main() function called")
    fmt.Println("Value of packageVar:", packageVar)
}`,
  },
  {
    slug: 'modules-internal',
    title: '43. Modules & internal packages',
    section: 'Section I: Packages & project layout',
    order: 43,
    runMode: 'terminal',
    body: `
A Go module is a collection of related Go packages that are versioned together. A \`go.mod\` file at the root of the directory tree declares the module path.

Go enforces a special rule for directories named \`internal\`. Code in or below an \`internal\` directory is importable only by code in the directory tree rooted at the parent of \`internal\`.

This allows you to hide packages from consumers of your module, enforcing proper API boundaries.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat go.mod' },
      { kind: 'stdout', text: 'module github.com/user/project\n\ngo 1.21' },
      { kind: 'command', text: '$ tree .' },
      { kind: 'stdout', text: '.\n├── go.mod\n├── main.go\n└── internal\n    └── secret\n        └── secret.go' },
      { kind: 'command', text: '$ go build .' },
      { kind: 'stdout', text: 'Success. `main.go` can import `github.com/user/project/internal/secret`' }
    ],
  },
  {
    slug: 'go-embed',
    title: '44. //go:embed',
    section: 'Section I: Packages & project layout',
    order: 44,
    runMode: 'terminal',
    body: `
The \`embed\` package provides access to files embedded in the running Go program.

By using the \`//go:embed\` directive before a variable declaration of type \`string\`, \`[]byte\`, or \`embed.FS\`, you can tell the compiler to bundle static files (like HTML templates, SQL migrations, or images) directly into your compiled binary.

This allows you to ship a single, standalone executable without worrying about missing local files at runtime.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat static/hello.txt' },
      { kind: 'stdout', text: 'Hello from an embedded file!' },
      { kind: 'command', text: '$ cat main.go' },
      { kind: 'stdout', text: `package main

import (
    _ "embed"
    "fmt"
)

//go:embed static/hello.txt
var helloText string

func main() {
    fmt.Print(helloText)
}` },
      { kind: 'command', text: '$ go run main.go' },
      { kind: 'stdout', text: 'Hello from an embedded file!' }
    ],
    checkpoint: {
      id: 'checkpoint-i',
      questions: [
        {
          id: 'cp-i-1',
          prompt: 'How do you export a function so it can be used by other packages?',
          type: 'mcq',
          options: ['Use the `export` keyword', 'Capitalize the first letter of its name', 'Put it in a public.go file'],
          correctIndex: 1,
          explanation: 'In Go, names that begin with a capital letter are automatically exported.'
        },
        {
          id: 'cp-i-2',
          prompt: 'Which executes first when a Go program starts?',
          type: 'mcq',
          options: ['main.main()', 'Package-level variable initializers', 'init() functions'],
          correctIndex: 1,
          explanation: 'Package-level variables are initialized first, then init() functions run, and finally main() runs.'
        },
        {
          id: 'cp-i-3',
          prompt: 'Who can import a package located at `mypkg/internal/helper`?',
          type: 'mcq',
          options: ['Any package in the world', 'Only packages inside `mypkg` or its subdirectories', 'Only the `main` package'],
          correctIndex: 1,
          explanation: 'The compiler prevents packages outside the tree rooted at the parent of `internal` from importing it.'
        },
        {
          id: 'cp-i-4',
          prompt: 'What does the `//go:embed` directive do?',
          type: 'mcq',
          options: ['Embeds a struct inside another struct', 'Compiles static files directly into the Go binary', 'Links a C library'],
          correctIndex: 1,
          explanation: 'go:embed tells the compiler to bundle files into the resulting binary as strings, byte slices, or file systems.'
        }
      ]
    }
  }
]
