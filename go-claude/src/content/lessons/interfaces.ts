import type { Lesson } from '../types';

export const interfacesLesson: Lesson = {
  slug: 'interfaces',
  title: 'Interfaces — implicit satisfaction',
  sectionId: 'interfaces',
  order: 24,
  runMode: 'playground',
  body: `Interfaces declare a method set. A type satisfies an interface by *having* the methods — there's no \`implements\` keyword, no declaration of intent. This makes interfaces composable across packages without coordination.

\`any\` is an alias for \`interface{}\` — the empty interface, which every type satisfies. Use it sparingly; it erases types and forces type assertions to recover them.`,
  starterCode: `package main

import "fmt"

type Greeter interface {
	Greet() string
}

type English struct{ Name string }
func (e English) Greet() string { return "Hello, " + e.Name }

type Klingon struct{ Name string }
func (k Klingon) Greet() string { return "nuqneH, " + k.Name }

func say(g Greeter) { fmt.Println(g.Greet()) }

func main() {
	say(English{"Ada"})
	say(Klingon{"Worf"})
}
`,
};
