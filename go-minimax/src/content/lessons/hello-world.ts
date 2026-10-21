import type { Lesson } from '../types';

export const helloWorld: Lesson = {
  slug: 'hello-world',
  title: 'Hello, world & program structure',
  sectionId: 'fundamentals',
  order: 1,
  runMode: 'playground',
  body: `A Go program is a package plus a set of top-level declarations. The entry point is
\`func main()\` in package \`main\`; nothing runs until the program starts, and nothing in
\`main\` is special beyond its name and signature.

Three rules cover most of what you need on day one:

- Every file belongs to exactly one package, declared on the first line (before any
  other declaration, comments included).
- Imports are file-scoped and must be used or the program will not compile.
- \`func main\` takes no arguments and returns nothing. Exiting is implicit when
  \`main\` returns; \`os.Exit\` skips deferred calls, which is occasionally what you
  want and usually is not.

The order of declarations does not matter. Go has no requirement that a function be
defined before it is called, so files can be organised by topic rather than by
dependency order. The compiler resolves the whole package at once.

Note what is *not* here: no \`package main\` boilerplate beyond the declaration, no
\`public static void main\`, no namespace imports. There is one \`main\` package per
binary, and everything else is addressed by import path.

Run it:

\`\`\`bash
go run hello.go
\`\`\`

or build a binary with \`go build -o hello hello.go\` and run \`./hello\`. The two are
nearly equivalent, but \`go run\` recompiles every time and leaves the temporary binary
behind; \`go build\` does not run the result.`,
  starterCode: `package main

import "fmt"

func main() {
	fmt.Println("Hello, world")
}
`,
  gotcha: `\`fmt.Println\` writes to \`os.Stdout\`, but \`log.Println\` writes to \`os.Stderr\`.
Mixing them up in a shell pipeline changes where the output goes.`,
};
