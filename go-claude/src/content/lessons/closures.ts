import type { Lesson } from '../types';

export const closures: Lesson = {
  slug: 'closures',
  title: 'First-class functions & closures',
  sectionId: 'functions',
  order: 22,
  runMode: 'playground',
  body: `Functions are values. They can be assigned, passed, returned. A function literal that references variables outside its own body is a closure — those variables are captured **by reference**, so the closure sees subsequent mutations.`,
  starterCode: `package main

import "fmt"

func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func main() {
	c := counter()
	fmt.Println(c(), c(), c()) // 1 2 3

	// Closures capture by reference:
	x := 1
	bump := func() { x++ }
	bump()
	bump()
	fmt.Println(x) // 3
}
`,
};
