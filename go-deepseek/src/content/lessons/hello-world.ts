import type { Lesson } from '../types';

export const helloWorld: Lesson = {
  slug: 'hello-world',
  title: 'Hello, world & program structure',
  sectionId: 'fundamentals',
  order: 1,
  runMode: 'playground',
  body: `A Go executable is a \`package main\` with a \`func main()\`. Imports sit between the package clause and your declarations; the compiler rejects unused ones. \`fmt.Println\` writes its arguments to stdout separated by spaces, then a newline.

The program below is the whole shape: package, import, function. Change the greeting and run it again.`,
  starterCode: `package main

import "fmt"

func main() {
	fmt.Println("hello, world")
}
`,
};
