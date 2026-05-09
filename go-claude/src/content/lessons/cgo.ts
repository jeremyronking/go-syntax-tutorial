import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'cat hello.go' },
  { kind: 'stdout', text: `package main

/*
#include <stdio.h>
#include <stdlib.h>
*/
import "C"
import "unsafe"

func main() {
	cs := C.CString("hello from C\\n")
	defer C.free(unsafe.Pointer(cs))
	C.printf((*C.char)(cs))
}
` },
  { kind: 'command', text: 'CGO_ENABLED=1 go run hello.go' },
  { kind: 'stdout', text: 'hello from C\n' },
];

export const cgoLesson: Lesson = {
  slug: 'cgo',
  title: 'cgo — calling C from Go (and what it costs)',
  sectionId: 'low-level',
  order: 47,
  runMode: 'terminal',
  body: `\`import "C"\` enables \`cgo\`. The pseudo-package \`C\` lets you call into C, share string/byte memory (with manual free), and use C struct fields. Each Go↔C call is expensive (microseconds), and your binary now depends on a C toolchain.

Avoid cgo unless you genuinely need a C library. Pure Go is portable, fast to build, and easier to cross-compile (\`CGO_ENABLED=0\`).`,
  terminalOutput: lines,
};
