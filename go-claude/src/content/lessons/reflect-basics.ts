import type { Lesson } from '../types';

export const reflectBasics: Lesson = {
  slug: 'reflect-basics',
  title: 'reflect — TypeOf, ValueOf, Kind',
  sectionId: 'low-level',
  order: 45,
  runMode: 'playground',
  body: `\`reflect\` lets you inspect (and sometimes manipulate) values at runtime. \`Kind\` tells you the underlying flavor (\`Int\`, \`Struct\`, \`Slice\`); \`Type\` includes the user-defined type name.

It's slow and bypasses static guarantees — keep it at the edges (serializers, generic-ish frameworks). Most app code never needs it.`,
  starterCode: `package main

import (
	"fmt"
	"reflect"
)

type Cents int

func main() {
	var c Cents = 199
	v := reflect.ValueOf(c)
	t := reflect.TypeOf(c)
	fmt.Println("Type:", t, " Kind:", v.Kind()) // main.Cents int
}
`,
};
