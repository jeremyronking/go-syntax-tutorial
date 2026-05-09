import type { Lesson } from '../types';

export const labelsGoto: Lesson = {
  slug: 'labels-goto',
  title: 'Labels: labeled break/continue (and goto)',
  sectionId: 'control-flow',
  order: 14,
  runMode: 'playground',
  body: `Labels target a specific outer loop for \`break\` or \`continue\`. They're rare but cleaner than a sentinel boolean when you need to bail from nested loops.

\`goto\` exists too, but is restricted: it can't jump over variable declarations or into a block. The most defensible use is forward-only error handling at the bottom of a function — and even that loses to \`defer\` in modern Go.`,
  starterCode: `package main

import "fmt"

func main() {
outer:
	for r := range 3 {
		for c := range 3 {
			if r == 1 && c == 2 {
				fmt.Println("bailing at", r, c)
				break outer
			}
			fmt.Println(r, c)
		}
	}
}
`,
};
