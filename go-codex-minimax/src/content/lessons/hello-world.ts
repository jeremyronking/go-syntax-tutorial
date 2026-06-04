import type { Lesson } from '../types';

const lesson: Lesson = {
  slug: 'hello-world',
  title: 'Hello, world & program structure',
  section: 'A',
  order: 1,
  runMode: 'playground',
  body: `A Go program is one or more \`*.go\` files in the same \`package\`. Executables
start with \`package main\` and define a \`func main()\` — the runtime calls it for
you. The \`import\` block pulls in only the packages you need; the compiler
errors out on unused imports.

\`fmt.Println\` writes to stdout with a trailing newline. Run this in the editor
on the right; the response will round-trip through the public Go Playground.`,
  starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, GoTour")
}
`,
  gotcha: `There is no implicit \`;\`. The Go formatter (\`gofmt\`) inserts semicolons
based on the line break — the canonical style puts opening braces on the same
line as the declaration.`,
};

export default lesson;
