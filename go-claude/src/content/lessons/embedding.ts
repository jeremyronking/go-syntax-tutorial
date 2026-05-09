import type { Lesson } from '../types';

export const embedding: Lesson = {
  slug: 'embedding',
  title: 'Embedding — methods promote',
  sectionId: 'interfaces',
  order: 26,
  runMode: 'playground',
  body: `Embed a type by declaring an anonymous field. The methods of the embedded type promote to the outer type. Interface embedding does the analogous thing — composing larger interfaces from smaller ones (\`io.ReadWriter\` is \`Reader\` + \`Writer\`).

This is Go's chosen alternative to inheritance. There's no override; you can shadow promoted methods by defining the same name on the outer type.`,
  starterCode: `package main

import "fmt"

type Logger struct{ Prefix string }
func (l Logger) Log(msg string) { fmt.Println(l.Prefix, msg) }

type Service struct {
	Logger // embedded
	Name string
}

func main() {
	s := Service{Logger: Logger{Prefix: "[svc]"}, Name: "billing"}
	s.Log("started") // promoted from Logger
}
`,
};
