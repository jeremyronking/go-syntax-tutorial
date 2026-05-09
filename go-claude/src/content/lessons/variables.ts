import type { Lesson } from '../types';

export const variables: Lesson = {
  slug: 'variables',
  title: 'Variables, := and the blank identifier',
  sectionId: 'fundamentals',
  order: 3,
  runMode: 'playground',
  body: `\`var x int\` declares with the zero value. \`var x = 7\` infers the type. Inside a function, \`:=\` is the short form: declares **and** initializes. You may not use \`:=\` at package scope.

Multiple assignment swaps without a temp: \`a, b = b, a\`. The blank identifier \`_\` discards a value (you'll meet it next to ignored returns and unused imports — the compiler treats both as errors otherwise).`,
  starterCode: `package main

import "fmt"

func main() {
	var x int            // 0
	var name = "Ada"     // type inferred: string
	pi := 3.14159        // short decl, function scope only
	a, b := 1, 2
	a, b = b, a          // swap

	_, err := tryThing() // discard the value, keep the error
	if err != nil {
		fmt.Println("err:", err)
	}

	fmt.Println(x, name, pi, a, b)
}

func tryThing() (int, error) {
	return 42, nil
}
`,
  gotcha: `Unused local variables and unused imports are **compile errors** in Go, not warnings. \`_ = x\` and \`_ "pkg"\` are the escape hatches. This is intentional — it prevents drift between the code you wrote and the code that's actually used.`,
};
