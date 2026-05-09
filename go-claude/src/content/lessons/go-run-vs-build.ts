import type { Lesson } from '../types';

export const goRunVsBuild: Lesson = {
  slug: 'go-run-vs-build',
  title: 'go run vs go build',
  sectionId: 'fundamentals',
  order: 2,
  runMode: 'playground',
  body: `\`go run main.go\` compiles to a temp binary, runs it, throws the binary away — fastest feedback loop while you're iterating. \`go build\` produces a real artifact in the current directory (or wherever \`-o\` says). Both commands invoke the same compiler, so behavior is identical at runtime.

The Playground always runs your snippet via \`go run\`-equivalent semantics. The full toolchain demos live in Section K.`,
  starterCode: `package main

import "fmt"

func main() {
	// Same code, two invocation styles:
	//   go run main.go     -> compile + execute, no artifact
	//   go build -o app    -> produces ./app, run it yourself
	fmt.Println("identical at runtime")
}
`,
};
