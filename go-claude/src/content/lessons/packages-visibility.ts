import type { Lesson } from '../types';

export const packagesVisibility: Lesson = {
  slug: 'packages-visibility',
  title: 'Packages & visibility — capitalization is the contract',
  sectionId: 'packages',
  order: 41,
  runMode: 'playground',
  body: `An identifier is **exported** iff its first letter is uppercase. \`User\` is public; \`user\` is package-private. This applies to types, functions, methods, fields, constants — everything.

A file's \`package\` clause names the package; a directory contains one package. Imports use the **module path** plus subdirectory.`,
  starterCode: `package main

import "fmt"

// Exported (visible from other packages):
type Order struct {
	ID    int
	Total int
	// internal is unexported — fine within this package
	internal string
}

func (o Order) Public()  { fmt.Println("public") }
func (o Order) private() { fmt.Println("private") }

func main() {
	o := Order{ID: 1, Total: 100, internal: "secret"}
	o.Public()
	o.private() // OK in same package
	fmt.Println(o.internal)
}
`,
};
