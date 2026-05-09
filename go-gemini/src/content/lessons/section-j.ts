import type { Lesson } from '../types'

export const sectionJLessons: Lesson[] = [
  {
    slug: 'reflect-basics',
    title: '45. reflect basics',
    section: 'Section J: Reflection & low-level',
    order: 45,
    runMode: 'playground',
    body: `
Reflection in computing is the ability of a program to examine its own structure, particularly through types; it's a form of metaprogramming.

In Go, reflection is provided by the \`reflect\` package. The two most important types are \`reflect.Type\` and \`reflect.Value\`.
You get them via \`reflect.TypeOf(v)\` and \`reflect.ValueOf(v)\`.

A Type's **Kind** describes the specific, underlying classification of a type (e.g., struct, slice, pointer), rather than its named type.
    `,
    starterCode: `package main

import (
    "fmt"
    "reflect"
)

type MyInt int

func main() {
    var x MyInt = 42
    
    t := reflect.TypeOf(x)
    v := reflect.ValueOf(x)
    
    fmt.Println("Type:", t)
    fmt.Println("Kind:", t.Kind()) // The underlying kind is 'int'
    fmt.Println("Value:", v)
}`,
  },
  {
    slug: 'unsafe-pointer',
    title: '46. unsafe.Pointer',
    section: 'Section J: Reflection & low-level',
    order: 46,
    runMode: 'terminal',
    body: `
The \`unsafe\` package contains operations that step around the type safety of Go programs. 

\`unsafe.Pointer\` is a special pointer type. A pointer of any type can be converted to an \`unsafe.Pointer\`, and an \`unsafe.Pointer\` can be converted back to a pointer of any type. Furthermore, an \`unsafe.Pointer\` can be converted to a \`uintptr\` (an integer large enough to hold the bit pattern of any pointer), allowing pointer arithmetic.

This is highly discouraged for normal programs.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat main.go' },
      { kind: 'stdout', text: `package main

import (
    "fmt"
    "unsafe"
)

func main() {
    arr := [3]int{10, 20, 30}
    
    // Convert pointer to array element 0 into unsafe.Pointer
    ptr := unsafe.Pointer(&arr[0])
    
    // Perform pointer arithmetic by casting to uintptr, adding size of int, and casting back
    nextPtr := (*int)(unsafe.Pointer(uintptr(ptr) + unsafe.Sizeof(arr[0])))
    
    fmt.Println("Next element:", *nextPtr)
}` },
      { kind: 'command', text: '$ go run main.go' },
      { kind: 'stdout', text: 'Next element: 20' }
    ],
  },
  {
    slug: 'cgo',
    title: '47. cgo',
    section: 'Section J: Reflection & low-level',
    order: 47,
    runMode: 'terminal',
    body: `
\`cgo\` enables the creation of Go packages that call C code. 

If a Go source file imports the pseudo-package \`"C"\`, it is using cgo. The cgo tool will look for comments immediately preceding the \`import "C"\` line and compile them as C headers.

While cgo provides a bridge to the massive ecosystem of C libraries, it breaks Go's fast compilation, cross-compilation simplicity, and garbage collector optimization. Cgo should be used only when rewriting the library in Go is not feasible.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ cat main.go' },
      { kind: 'stdout', text: `package main

/*
#include <stdio.h>
#include <stdlib.h>

void myprint(char* s) {
    printf("%s\\n", s);
}
*/
import "C"
import "unsafe"

func main() {
    cs := C.CString("Hello from C!")
    C.myprint(cs)
    C.free(unsafe.Pointer(cs))
}` },
      { kind: 'command', text: '$ go run main.go' },
      { kind: 'stdout', text: 'Hello from C!' }
    ],
  },
  {
    slug: 'build-tags',
    title: '48. Build tags',
    section: 'Section J: Reflection & low-level',
    order: 48,
    runMode: 'playground',
    body: `
A build constraint, also known as a **build tag**, is a line comment that begins with \`//go:build\` that dictates the conditions under which a file should be included in the package.

They are placed near the top of the file, preceded only by blank lines and other line comments.

They are commonly used for OS-specific implementations, architecture-specific assembly, or custom build flags (e.g., \`//go:build linux\`).
    `,
    starterCode: `//go:build playground || linux
// +build playground linux

// The +build line is for older Go versions, //go:build is preferred.
// The Go Playground uses the "playground" build tag, so this compiles here!

package main

import "fmt"

func main() {
    fmt.Println("This code compiles because the 'playground' tag is active.")
}`,
    checkpoint: {
      id: 'checkpoint-j',
      questions: [
        {
          id: 'cp-j-1',
          prompt: 'In `reflect`, what is the difference between Type and Kind?',
          type: 'mcq',
          options: ['They are the same thing', 'Type is the specific named type; Kind is the underlying category (e.g. struct)', 'Kind is for interfaces only'],
          correctIndex: 1,
          explanation: 'If `type MyInt int`, its Type is MyInt, but its Kind is int.'
        },
        {
          id: 'cp-j-2',
          prompt: 'What package must you import to perform pointer arithmetic in Go?',
          type: 'mcq',
          options: ['math', 'pointers', 'unsafe', 'syscall'],
          correctIndex: 2,
          explanation: 'The unsafe package allows casting to uintptr for pointer arithmetic.'
        },
        {
          id: 'cp-j-3',
          prompt: 'What pseudo-package is used to bridge Go with C code?',
          type: 'mcq',
          options: ['"ffi"', '"C"', '"unsafe"'],
          correctIndex: 1,
          explanation: 'import "C" activates cgo, allowing Go code to call C functions.'
        }
      ]
    }
  }
]
