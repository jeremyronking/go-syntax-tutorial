import type { Lesson } from '../types';

export const pointers: Lesson = {
  slug: 'pointers',
  title: 'Pointers — no arithmetic, addressable values',
  sectionId: 'composite-types',
  order: 19,
  runMode: 'playground',
  body: `\`&x\` takes the address; \`*p\` dereferences. There is no pointer arithmetic — Go is memory-safe. The compiler runs **escape analysis**: if a local's address leaves the function, it allocates on the heap; otherwise it stays on the stack. You don't \`free\` anything; the GC does.

\`new(T)\` returns \`*T\` pointing at a zero T. \`&T{...}\` is more common because it lets you initialize in one expression.`,
  starterCode: `package main

import "fmt"

type Counter struct{ n int }

func (c *Counter) Inc() { c.n++ }

func main() {
	c := &Counter{}
	c.Inc()
	c.Inc()
	fmt.Println(c.n)

	// Address of a composite literal:
	p := &struct{ x, y int }{x: 1, y: 2}
	fmt.Println(*p)
}
`,
};
