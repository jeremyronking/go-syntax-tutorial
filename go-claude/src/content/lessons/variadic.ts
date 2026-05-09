import type { Lesson } from '../types';

export const variadic: Lesson = {
  slug: 'variadic',
  title: 'Variadics & slice spread',
  sectionId: 'functions',
  order: 21,
  runMode: 'playground',
  body: `\`func f(xs ...int)\` accepts any number of \`int\` args; inside the function \`xs\` is a \`[]int\`. To pass an existing slice through, **spread** it: \`f(s...)\`. The variadic param must be the last one.`,
  starterCode: `package main

import "fmt"

func sum(xs ...int) int {
	total := 0
	for _, x := range xs {
		total += x
	}
	return total
}

func main() {
	fmt.Println(sum(1, 2, 3))

	nums := []int{4, 5, 6}
	fmt.Println(sum(nums...)) // spread

	// fmt.Println is variadic of any:
	fmt.Println("hello", 42, true)
}
`,
};
