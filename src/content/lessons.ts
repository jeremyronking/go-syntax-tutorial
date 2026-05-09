import type { Lesson } from "./types";

const helloWorld: Lesson = {
  slug: "hello-world",
  title: "Hello, World",
  section: "A",
  order: 1,
  body: `
Every Go program starts with a \`package\` declaration and a \`main\` function.
The \`main\` function is the entry point — when you run the program, execution
begins here.

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World")
}
\`\`\`

**Key points:**

- \`package main\` tells Go this is an executable, not a library.
- \`import "fmt"\` brings in the \`fmt\` package for formatted I/O.
- \`fmt.Println\` writes a line to standard output.

Hit **Run** (or Cmd/Ctrl+Enter) to see it execute.
`,
  runMode: "playground",
  starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World")
}`,
  gotcha: "The package name `main` is mandatory for executables. A file with `package somethingelse` compiles, but `go run` will complain there's no `main` function.",
};

export const lessons: Lesson[] = [helloWorld];

const lessonMap = new Map(lessons.map((l) => [l.slug, l]));

export function lessonBySlug(slug: string): Lesson | undefined {
  return lessonMap.get(slug);
}

export function lessonsBySection(section: string): Lesson[] {
  return lessons.filter((l) => l.section === section).sort((a, b) => a.order - b.order);
}

export const sections: string[] = [...new Set(lessons.map((l) => l.section))].sort();