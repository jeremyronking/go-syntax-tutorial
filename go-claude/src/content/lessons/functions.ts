import type { Lesson } from '../types';

export const functions: Lesson = {
  slug: 'functions',
  title: 'Functions — multi-return, named returns',
  sectionId: 'functions',
  order: 20,
  runMode: 'playground',
  body: `Multi-return is idiomatic — \`(value, error)\` is everywhere. Named returns let you mention each return slot in the signature; \`return\` (with no operands) returns whatever each name currently holds. Use them sparingly: they're useful when \`defer\` mutates a return, but make code harder to read.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
)

func divmod(a, b int) (q, r int, err error) {
	if b == 0 {
		err = errors.New("divide by zero")
		return // naked: returns q, r, err with current values
	}
	q, r = a/b, a%b
	return
}

func main() {
	q, r, err := divmod(13, 5)
	fmt.Println(q, r, err) // 2 3 <nil>

	_, _, err = divmod(1, 0)
	fmt.Println(err)
}
`,
  gotcha: `Naked returns shine in short functions. In a 50-line function with a named \`err\`, finding "where does err get set?" becomes a manhunt. Prefer explicit \`return q, r, err\` once functions grow.`,
};
