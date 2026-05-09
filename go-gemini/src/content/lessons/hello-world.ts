import type { Lesson } from '../types'

export const helloWorld: Lesson = {
  slug: 'hello-world',
  title: 'Hello, world & program structure',
  section: 'Section A — Language fundamentals',
  order: 1,
  runMode: 'playground',
  body: `
Every Go program starts with a \`package\` declaration. Executable programs must be in \`package main\`.

The \`import\` keyword pulls in other packages, like \`fmt\` from the standard library for formatted I/O.

Finally, the \`main\` function is the entry point. Note that the opening brace \`{\` must be on the same line as the function declaration.
  `,
  starterCode: `package main

import "fmt"

func main() {
\tfmt.Println("Hello, world")
}`,
  gotcha: `Go uses strict brace placement. Placing the opening brace \`{\` on a new line will cause a syntax error because the compiler automatically inserts semicolons at the end of lines.`,
}
