import type { Lesson } from '../types';

export const helloWorld: Lesson = {
  slug: 'hello-world',
  title: 'Hello, world',
  sectionId: 'fundamentals',
  order: 1,
  runMode: 'playground',
  body: `Every executable Go program begins as \`package main\` and runs from \`func main()\`. Imports come from the standard library or any module in your \`go.mod\`. Strings are UTF-8 by default; \`fmt.Println\` writes to stdout with a trailing newline.

Run the snippet to see the Playground round-trip in action. Mutate it freely.`,
  starterCode: `package main

import "fmt"

func main() {
	fmt.Println("hello, world")
}
`,
};
