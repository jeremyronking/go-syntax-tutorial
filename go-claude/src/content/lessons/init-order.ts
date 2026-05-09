import type { Lesson } from '../types';

export const initOrder: Lesson = {
  slug: 'init-order',
  title: 'init() and package initialization order',
  sectionId: 'packages',
  order: 42,
  runMode: 'playground',
  body: `Package-level \`var\` declarations are initialized in dependency order. Each file's \`init()\` function (you may have several, even per file) runs after all that file's vars are set. Imports' inits run first — depth-first, in import order.

\`init()\` is good for one-time wiring (registering drivers, parsing flags, validating config). It's bad for anything that should be tested.`,
  starterCode: `package main

import "fmt"

var Greeting = compute()

func compute() string {
	fmt.Println("computing var")
	return "hi"
}

func init() {
	fmt.Println("init ran, Greeting =", Greeting)
}

func main() {
	fmt.Println("main:", Greeting)
}
`,
};
