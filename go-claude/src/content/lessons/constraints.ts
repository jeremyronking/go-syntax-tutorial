import type { Lesson } from '../types';

export const constraints: Lesson = {
  slug: 'constraints',
  title: 'Constraints — comparable & ~T sets',
  sectionId: 'generics',
  order: 29,
  runMode: 'playground',
  body: `Constraints are interfaces extended with **type sets**. \`comparable\` permits \`==\`/\`!=\`. A type set written \`int | int64 | float64\` permits exactly those types. Prefix with \`~\` (\`~int\`) to also include any type whose **underlying** type is \`int\` — important for user-defined types like \`type Cents int\`.`,
  starterCode: `package main

import "fmt"

type Number interface {
	~int | ~int64 | ~float64
}

func Sum[T Number](xs []T) T {
	var total T
	for _, x := range xs {
		total += x
	}
	return total
}

type Cents int

func main() {
	fmt.Println(Sum([]int{1, 2, 3}))
	fmt.Println(Sum([]Cents{100, 250, 99})) // works because of ~int
	fmt.Println(Sum([]float64{0.1, 0.2, 0.3}))
}
`,
};
