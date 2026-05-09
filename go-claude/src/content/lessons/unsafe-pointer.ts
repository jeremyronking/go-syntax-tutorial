import type { Lesson, TerminalLine } from '../types';

const lines: TerminalLine[] = [
  { kind: 'command', text: 'cat unsafe_demo.go' },
  { kind: 'stdout', text: `package main

import (
	"fmt"
	"unsafe"
)

type Header struct {
	Magic uint32
	Size  uint32
}

func main() {
	h := Header{Magic: 0xCAFE, Size: 1024}
	fmt.Println("Sizeof Header:", unsafe.Sizeof(h))
	fmt.Println("Offset Size:", unsafe.Offsetof(h.Size))
	// Pointer arithmetic via unsafe (DON'T DO THIS):
	p := unsafe.Pointer(&h)
	q := unsafe.Add(p, unsafe.Offsetof(h.Size))
	fmt.Println("Size via raw pointer:", *(*uint32)(q))
}
` },
  { kind: 'command', text: 'go run unsafe_demo.go' },
  { kind: 'stdout', text: 'Sizeof Header: 8\nOffset Size: 4\nSize via raw pointer: 1024\n' },
];

export const unsafePointer: Lesson = {
  slug: 'unsafe-pointer',
  title: 'unsafe — Sizeof, Offsetof, raw pointers',
  sectionId: 'low-level',
  order: 46,
  runMode: 'terminal',
  body: `\`unsafe\` lets you escape Go's type system — pointer arithmetic, custom layouts, FFI shims. It compiles to nothing extra; the cost is that you're now responsible for safety.

The Playground sandbox blocks \`unsafe\`, so this is a frozen demo. Production rule: avoid \`unsafe\` unless you're the runtime, the compiler, or writing very specific glue (e.g., \`atomic.Pointer[T]\`).`,
  terminalOutput: lines,
  gotcha: `\`unsafe\`'s name is its disclaimer. Pointer arithmetic that aliases a Go-managed allocation can race the GC and corrupt memory in ways you'll find in a coredump on Sunday at 3am.`,
};
