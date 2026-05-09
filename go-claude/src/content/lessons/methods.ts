import type { Lesson } from '../types';

export const methods: Lesson = {
  slug: 'methods',
  title: 'Methods — value vs pointer receivers',
  sectionId: 'functions',
  order: 23,
  runMode: 'playground',
  body: `Methods are functions with a receiver. \`func (r T) Name()\` has a value receiver (operates on a copy). \`func (r *T) Name()\` has a pointer receiver (can mutate, avoids copying large values).

The method set of \`*T\` includes pointer-receiver methods; the method set of \`T\` (value) does not. So \`var x T; ifaceVal.Method()\` may compile or not depending on whether \`x\` is addressable. Modern code: be consistent within a type — all pointer or all value.`,
  starterCode: `package main

import "fmt"

type Counter struct{ n int }

func (c Counter) Get() int { return c.n }   // value receiver
func (c *Counter) Inc()    { c.n++ }        // pointer receiver — mutates

func main() {
	var c Counter
	c.Inc() // addressable -> auto &c
	c.Inc()
	fmt.Println(c.Get()) // 2
}
`,
  gotcha: `Pick one receiver kind per type and stick with it. Mixing value and pointer receivers leads to subtle interface-satisfaction bugs (e.g., \`Counter{}\` does not implement an interface with pointer-receiver methods, only \`&Counter{}\` does).`,
};
