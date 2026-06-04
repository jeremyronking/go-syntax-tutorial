import type { Lesson } from '../types';

// 45. reflect basics
export const reflectBasics: Lesson = {
  slug: 'reflect-basics',
  title: '`reflect` basics — `TypeOf`, `ValueOf`, kind vs type',
  section: 'J',
  order: 45,
  runMode: 'playground',
  body: `\`reflect.TypeOf\` returns the static type of a value; \`reflect.ValueOf\`
returns a value you can inspect or manipulate. The **Kind** is the underlying
category (\`slice\`, \`map\`, \`struct\`, ...); the **Type** is more specific
(\`[]string\`, \`map[string]int\`, \`pkg.User\`).

Reflection is useful at API boundaries (JSON, ORM, codecs) and rarely anywhere
else. It's slow, type-unsafe, and easy to get wrong.`,
  starterCode: `package main

import (
    "fmt"
    "reflect"
)

func main() {
    xs := []int{1, 2, 3}
    t := reflect.TypeOf(xs)
    fmt.Println("type:", t)
    fmt.Println("kind:", t.Kind())
    fmt.Println("elem kind:", t.Elem().Kind())

    v := reflect.ValueOf(xs)
    fmt.Println("len:", v.Len())
}
`,
};

// 46. unsafe
export const unsafePointer: Lesson = {
  slug: 'unsafe-pointer',
  title: '`unsafe.Pointer` and `unsafe.Sizeof` (mention, don\'t encourage)',
  section: 'J',
  order: 46,
  runMode: 'terminal',
  body: `\`unsafe.Pointer\` is a pointer type that can be converted to and from
any other pointer type. It is the only way to write type-punned code in Go,
and the runtime, cgo, and some performance-critical libraries rely on it.

For everyday code: don't. The compiler can't help you, the GC can move things
in surprising ways, and the rules around when conversion is legal are
subtle. \`unsafe.Sizeof\` reports the size of a value as the language defines it.`,
  terminalOutput: [
    { kind: 'command', text: 'cat sizeof.go' },
    { kind: 'stdout', text: 'package main' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'import (' },
    { kind: 'stdout', text: '    "fmt"' },
    { kind: 'stdout', text: '    "unsafe"' },
    { kind: 'stdout', text: ')' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func main() {' },
    { kind: 'stdout', text: '    var b bool' },
    { kind: 'stdout', text: '    var i int32' },
    { kind: 'stdout', text: '    var s string' },
    { kind: 'stdout', text: '    var p *int' },
    { kind: 'stdout', text: '    fmt.Println(unsafe.Sizeof(b), unsafe.Sizeof(i), unsafe.Sizeof(s), unsafe.Sizeof(p))' },
    { kind: 'stdout', text: '}' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go run sizeof.go' },
    { kind: 'stdout', text: '1 4 16 8' },
  ],
};

// 47. cgo
export const cgoLesson: Lesson = {
  slug: 'cgo',
  title: '`cgo` (one-paragraph awareness page)',
  section: 'J',
  order: 47,
  runMode: 'terminal',
  body: `\`cgo\` lets a Go package call C functions. You write a C-like preamble
in a comment, and the \`go\` command generates the glue at build time. The
cost: cgo calls have non-trivial overhead, the binary needs the C toolchain,
and cross-compilation gets much harder.

Use cgo only when you must interoperate with a C library that has no pure-Go
alternative. For most cases, a pure-Go binding or a different library is the
right answer.`,
  terminalOutput: [
    { kind: 'command', text: 'cat hello.go' },
    { kind: 'stdout', text: 'package main' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: '/*' },
    { kind: 'stdout', text: '#include <stdio.h>' },
    { kind: 'stdout', text: 'static void hello() { puts("hello from C"); }' },
    { kind: 'stdout', text: '*/' },
    { kind: 'stdout', text: 'import "C"' },
    { kind: 'stdout', text: '' },
    { kind: 'stdout', text: 'func main() { C.hello() }' },
    { kind: 'stdout', text: '' },
    { kind: 'command', text: 'go run hello.go' },
    { kind: 'stdout', text: 'hello from C' },
  ],
};

// 48. Build tags
export const buildTags: Lesson = {
  slug: 'build-tags',
  title: 'Build tags `//go:build` and conditional compilation',
  section: 'J',
  order: 48,
  runMode: 'playground',
  body: `\`//go:build\` lines (top of the file) tell the \`go\` command when to
include the file. The old \`// +build\` form still works but is deprecated. Tags
compose with boolean operators: \`//go:build linux && amd64\`. Negation with
\`!\`, alternatives with \`||\`. \`build foo\` matches \`-tags foo\`.

\`go build -tags debug ./...\` is a common way to gate diagnostics.`,
  starterCode: `package main

import (
    "fmt"
    "runtime"
)

func main() {
    fmt.Println("GOOS:", runtime.GOOS, "GOARCH:", runtime.GOARCH)
}
`,
};
