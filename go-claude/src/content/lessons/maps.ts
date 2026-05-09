import type { Lesson } from '../types';

export const maps: Lesson = {
  slug: 'maps',
  title: 'Maps — comma-ok and the nil-map panic',
  sectionId: 'composite-types',
  order: 17,
  runMode: 'playground',
  body: `Maps are reference types. The zero value is \`nil\` — reading from a nil map is fine and returns the zero value of the value type, but **writing** panics. Initialize with \`make\` or a literal.

\`v, ok := m[key]\` is the comma-ok idiom — it tells you "key absent" vs "key present with the zero value". Iteration order is randomized; never rely on it.`,
  starterCode: `package main

import "fmt"

func main() {
	m := map[string]int{"a": 1, "b": 2}
	if v, ok := m["c"]; ok {
		fmt.Println("c =", v)
	} else {
		fmt.Println("no c")
	}

	delete(m, "a")
	fmt.Println(m)

	// Nil map: read OK, write panics.
	var nilMap map[string]int
	fmt.Println(nilMap["x"]) // 0
	// nilMap["x"] = 1       // <-- would panic at runtime
}
`,
  gotcha: `A struct field that is a nil map is silently broken. Initialize maps in your constructor, not lazily — or you'll panic the first time someone assigns to it.`,
};
