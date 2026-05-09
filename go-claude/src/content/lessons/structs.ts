import type { Lesson } from '../types';

export const structs: Lesson = {
  slug: 'structs',
  title: 'Structs — literals, tags, embedding',
  sectionId: 'composite-types',
  order: 18,
  runMode: 'playground',
  body: `Composite literals can be positional or keyed (use keyed in real code — robust to field reordering). Field tags are string metadata read by reflection (\`json\`, \`db\`, \`validate\` tags etc.). Anonymous fields **embed** another type: methods promote to the outer struct.

Two structs are comparable iff all fields are comparable. A slice or map field makes the whole struct uncomparable.`,
  starterCode: `package main

import "fmt"

type User struct {
	ID    int    \`json:"id"\`
	Name  string \`json:"name"\`
	email string // unexported
}

func main() {
	u := User{ID: 1, Name: "Ada"}
	v := User{ID: 1, Name: "Ada"}
	fmt.Println(u == v) // true — all fields comparable

	// Anonymous (embedded) field:
	type Admin struct {
		User       // embeds User; methods/fields promote
		Level int
	}
	a := Admin{User: u, Level: 9}
	fmt.Println(a.Name, a.Level) // a.Name promoted from User
}
`,
};
