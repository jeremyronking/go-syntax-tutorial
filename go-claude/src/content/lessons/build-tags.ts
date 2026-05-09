import type { Lesson } from '../types';

export const buildTags: Lesson = {
  slug: 'build-tags',
  title: 'Build tags — //go:build constraints',
  sectionId: 'low-level',
  order: 48,
  runMode: 'playground',
  body: `Build tags conditionally include a file based on GOOS, GOARCH, or custom tags passed via \`-tags\`. The directive lives at the top, before the \`package\` clause:

\`\`\`go
//go:build linux && amd64
\`\`\`

A custom tag like \`integration\` lets you keep slow tests out of the default \`go test ./...\` run.`,
  starterCode: `//go:build linux || darwin

package main

import "fmt"

func main() {
	fmt.Println("This file only compiles on linux or darwin.")
	fmt.Println("(The Playground compiles for linux/amd64, so it runs.)")
}
`,
};
