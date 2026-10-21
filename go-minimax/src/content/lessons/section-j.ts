import type { Lesson } from '../types';

export const reflection: Lesson = {
  slug: 'reflection',
  title: '`reflect`: `TypeOf`, `ValueOf`, kind vs type',
  sectionId: 'low-level',
  order: 45,
  runMode: 'playground',
  body: `The \`reflect\` package lets a program inspect values and types at
runtime. It is what \`encoding/json\`, \`fmt\`'s \`%v\`, \`text/template\` and
most of the standard library's generic machinery is built on.

**Two entry points.**

\`\`\`go
t := reflect.TypeOf(x)    // the type of x
v := reflect.ValueOf(x)   // a reflect.Value wrapping x
\`\`\`

\`reflect.TypeOf\` takes an \`interface{}\`, so it sees the *dynamic* type — the
same rule as a type switch. \`reflect.ValueOf\` returns a \`reflect.Value\`, a
wrapper you can ask questions about and read through.

**Kind vs type.** A \`reflect.Kind\` is one of the 27 basic shapes: \`Int\`,
\`String\`, \`Slice\`, \`Struct\`, \`Func\`, \`Map\`, \`Ptr\`, and so on. A
\`reflect.Type\` is the full type, including the name, the package path, and
the element types.

\`\`\`go
type MyString string

reflect.TypeOf(MyString("x")).Kind()   // String
reflect.TypeOf(MyString("x")).Name()   // MyString
\`\`\`

This distinction is the one that catches people: a \`Kind\` is the *shape*,
a \`Type\` is the *identity*.

**Reading a value.** A \`reflect.Value\` has a \`Kind\` and a \`Type\`, and
you must check the kind before you call the matching accessor:

\`\`\`go
v := reflect.ValueOf(x)
switch v.Kind() {
case reflect.Int:
    n := v.Int()          // panics if x is not an int
case reflect.String:
    s := v.String()
}
\`\`\`

Calling \`v.Int()\` on a string panics. The accessors are not
type-checked — that is the price of reflection.

**\`IsZero\`, \`IsValid\` and \`IsNil\`.** \`reflect.ValueOf(nil)\` gives an
*invalid* value, and calling anything on it panics. \`v.IsValid()\` is the
guard. \`v.IsNil()\` is valid only for the nilable kinds (pointer, map, slice,
channel, func, interface).

**Setting a value.** \`v.SetInt(42)\` writes to the value, but only if it is
*addressable* — that is, obtained from a pointer. Values that come straight
out of \`reflect.ValueOf(x)\` are not settable.

\`\`\`go
x := 42
reflect.ValueOf(&x).Elem().SetInt(99)   // x is now 99
\`\`\`

**Reading struct fields.** \`v.Field(i)\` gets a field, \`v.NumField()\`
counts them, and \`v.FieldByName("Name")\` looks one up. Unexported fields
come back as read-only values — reading them is possible via
\`v.Field(i)\`, but writing is not, because the \`CanSet\` flag is false.

**When to use it.** Almost never, in application code. Reach for it when you
are writing a library that must handle types it cannot know at compile time —
serialisation, templating, ORMs, test helpers, dependency injection
containers. \`encoding/json\` is the canonical example.

**The alternatives, first.** Before reaching for reflection, check:

- An **interface** — if you only need one method, ask for the method.
- A **type switch** — if there are a handful of concrete types.
- **Generics** — if you need type safety rather than runtime inspection.

Reflection is the last resort, not the first. It is slow (not that slow, but
noticeably slower than a direct call), it moves errors from compile time to
run time, and it loses static type checking entirely.`,
  starterCode: `package main

import (
	"fmt"
	"reflect"
)

type MyString string

type User struct {
	Name   string
	Age    int
	secret string
}

func main() {
	// TypeOf sees the dynamic type.
	t := reflect.TypeOf(MyString("x"))
	fmt.Println("Kind:", t.Kind())   // String — the shape
	fmt.Println("Name:", t.Name())   // MyString — the identity
	fmt.Println("PkgPath:", t.PkgPath())

	// ValueOf wraps a value; Kind tells you how to read it.
	v := reflect.ValueOf(User{Name: "ada", Age: 36})
	fmt.Println("Kind:", v.Kind(), "fields:", v.NumField())

	// Read a field by name.
	name := v.FieldByName("Name")
	fmt.Println("Name field:", name.String(), "CanInterface:", name.CanInterface())

	// An unexported field is readable but not settable.
	secret := v.FieldByName("secret")
	fmt.Println("secret is set:", secret.String() != "", "CanSet:", secret.CanSet())

	// Iterate the fields.
	for i := 0; i < v.NumField(); i++ {
		f := v.Type().Field(i)
		fmt.Printf("  %s %s exported=%v\\n", f.Name, f.Type, f.IsExported())
	}

	// A Value is not settable unless it came from a pointer.
	x := 42
	rx := reflect.ValueOf(x)
	fmt.Println("ValueOf(x) CanSet:", rx.CanSet())
	rv := reflect.ValueOf(&x).Elem()
	fmt.Println("ValueOf(&x).Elem() CanSet:", rv.CanSet())
	rv.SetInt(99)
	fmt.Println("x after SetInt:", x)

	// A slice of a type: the element type is available.
	s := []MyString{"a", "b"}
	fmt.Println("slice elem type:", reflect.TypeOf(s).Elem(), "len:", reflect.ValueOf(s).Len())

	// reflect.TypeOf(nil) is nil.
	var nilPtr *User
	fmt.Println("TypeOf(nil pointer):", reflect.TypeOf(nilPtr))
	fmt.Println("ValueOf(nil pointer) IsNil:", reflect.ValueOf(nilPtr).IsNil())

	// reflect.TypeOf of an untyped nil interface is nil.
	var nilIface any
	fmt.Println("TypeOf(nil interface):", reflect.TypeOf(nilIface))
	fmt.Println("ValueOf(nil interface) IsValid:", reflect.ValueOf(nilIface).IsValid())
}
`,
  gotcha: `A \`reflect.Value\` obtained straight from \`reflect.ValueOf(x)\` is not
settable — \`v.SetInt(42)\` panics with \`reflect: reflect.Value.SetInt using
unaddressable value\`. Go through a pointer: \`reflect.ValueOf(&x).Elem()\`.`,
};

export const unsafePackage: Lesson = {
  slug: 'unsafe',
  title: '`unsafe.Pointer` and `unsafe.Sizeof`',
  sectionId: 'low-level',
  order: 46,
  runMode: 'terminal',
  body: `The \`unsafe\` package gives you exactly what its name says: escape
hatches from the type system. It exists so that the runtime and a handful of
performance-critical libraries can do things Go's safe subset cannot.

**\`unsafe.Sizeof\` and friends are safe.** They are *compile-time constants*
that answer questions about memory layout:

\`\`\`go
unsafe.Sizeof(int(0))     // 8 on 64-bit
unsafe.Sizeof(Point{})    // depends on the struct
unsafe.Alignof(Point{})   // required alignment
unsafe.Offsetof(s.Field)  // byte offset of a field
\`\`\`

\`Sizeof\` on a struct returns the size *including* padding. That is why
\`struct{ X, Y int }\` is 16 bytes and not some surprising number: the
compiler adds padding to keep fields aligned. Reordering fields can shrink
your struct — that is a real optimisation, and the \`fieldalignment\`
analyzer (shipped separately, as \`golang.org/x/tools/go/analysis/passes/fieldalignment\`)
can find them for you.

**\`unsafe.Sizeof\` does not recurse.** For a slice, it returns the size of
the *slice header* — 24 bytes on 64-bit (a pointer, a length and a
capacity) — not the size of the backing array.

**\`unsafe.Pointer\` is where the danger starts.** It is a pointer to memory
that the compiler cannot type-check. You can convert it to any other pointer
type and back:

\`\`\`go
x := 42
p := unsafe.Pointer(&x)
n := *(*int)(p)          // reads x's memory as an int
*(*int)(p) = 99          // writes to it
\`\`\`

**The rules you must not break.**

- A pointer to memory outside the object it points to is invalid. The Go
  garbage collector tracks pointers, and \`unsafe.Pointer\` values that point
  into the middle of an object can confuse it.
- You must not convert a pointer to a type with a *different* size and read
  it. \`(*int32)(unsafe.Pointer(&int64Var))\` reads 4 bytes of an 8-byte
  value and is undefined behaviour.
- You must not write a Go pointer into memory that the GC does not scan.
- \`unsafe.Pointer\` values must point *into* a Go object, not to memory you
  allocated with C.

**The pointer rules (\`go vet\`'s \`unsafeptr\` check)** say that converting
\`uintptr\` to \`unsafe.Pointer\` is only valid if the \`uintptr\` was produced
by the very same expression — because the GC may move the object in between.

**When you need it.** Almost never in application code. The realistic uses:

- **Interfacing with C** via \`cgo\`, where you need \`unsafe.Pointer\` to
  pass Go memory to C.
- **Zero-allocation conversions** between a slice header and a struct with
  the same layout.
- **Performance** in hot paths, where a bounds check or a copy dominates.
- **Runtime and compiler work**, where the \`unsafe\` package is unavoidable.

**\`unsafe.Slice\` and \`unsafe.String\`.** Go 1.17 and 1.20 added
\`unsafe.Slice(ptr, len)\` and \`unsafe.String(ptr, len)\`, which are the
*safe-ish* way to build a slice or a string from existing memory without
copying. The rules are narrower: the pointer must point to memory allocated
by \`make\`, the length must not exceed the allocation, and the memory must
not be modified while the slice or string exists.

**\`go vet\` catches the obvious mistakes**, but it cannot catch all of them.
Code that misuses \`unsafe\` is not "fast Go" — it is Go with the compiler
watching.`,
  terminalOutput: [
    { kind: 'command', text: 'cat main.go' },
    {
      kind: 'stdout',
      text:
        'package main\n\nimport (\n\t"fmt"\n\t"reflect"\n\t"unsafe"\n)\n\ntype Point struct {\n\tX, Y int\n}\n\nfunc main() {\n\tfmt.Println("Sizeof(int):", unsafe.Sizeof(int(0)))\n\tfmt.Println("Sizeof(Point):", unsafe.Sizeof(Point{}))\n\tfmt.Println("Sizeof(string):", unsafe.Sizeof(""))\n\tfmt.Println("Sizeof([]int):", unsafe.Sizeof([]int{}))\n\tfmt.Println("Sizeof(*Point):", unsafe.Sizeof(&Point{}))\n\tfmt.Println("Alignof(Point):", unsafe.Alignof(Point{}))\n\n\tx := 42\n\tp := unsafe.Pointer(&x)\n\tfmt.Println("read through unsafe.Pointer:", *(*int)(p))\n\t*(*int)(p) = 99\n\tfmt.Println("x after write:", x)\n\n\tfmt.Println("slice header size:", unsafe.Sizeof(struct {\n\t\tptr unsafe.Pointer\n\t\tlen int\n\t\tcap int\n\t}{}))\n\n\tfmt.Println("reflect Sizeof int:", reflect.TypeOf(int(0)).Size())\n\tfmt.Println("reflect Sizeof Point:", reflect.TypeOf(Point{}).Size())\n}\n',
    },
    { kind: 'command', text: 'go run main.go' },
    {
      kind: 'stdout',
      text:
        'Sizeof(int): 8\nSizeof(Point): 16\nSizeof(string): 16\nSizeof([]int): 24\nSizeof(*Point): 8\nAlignof(Point): 8\nread through unsafe.Pointer: 42\nx after write: 99\nslice header size: 24\nreflect Sizeof int: 8\nreflect Sizeof Point: 16\n',
    },
    { kind: 'command', text: 'go vet ./...' },
  ],
  gotcha: `\`unsafe.Sizeof\` on a slice returns the size of the *slice header*
(24 bytes on 64-bit), not the size of the backing array. And on a struct it
includes padding, so reordering fields can shrink it.`,
};

export const cgo: Lesson = {
  slug: 'cgo',
  title: '`cgo`: calling C from Go',
  sectionId: 'low-level',
  order: 47,
  runMode: 'terminal',
  body: `\`cgo\` lets a Go program call C code. It is a special import that
carries a C preamble:

\`\`\`go
package main

/*
#include <stdlib.h>

static int add(int a, int b) {
    return a + b;
}
*/
import "C"

import "fmt"

func main() {
    fmt.Println(int(C.add(3, 4)))
}
\`\`\`

The comment immediately above \`import "C"\` is the C source. It is compiled
into a separate object file, and \`C.foo\` refers to the C function \`foo\`.
Only *static* functions declared in the preamble are visible; you cannot call
arbitrary functions from a linked library without declaring them first.

**C types have Go counterparts.** \`C.int\` is a Go \`int32\`,
\`C.char\` is a byte, \`C.double\` is a float64, and \`C.CString\` /
\`C.GoString\` convert between NUL-terminated C strings and Go strings.

**\`C.CString\` allocates with C's \`malloc\`, so you must free it:**

\`\`\`go
cstr := C.CString("hello")
defer C.free(unsafe.Pointer(cstr))
fmt.Println(C.GoString(cstr))
\`\`\`

Forgetting the \`free\` is a memory leak, and passing a Go string to C without
copying is a crash waiting to happen: Go strings are not NUL-terminated, and
the garbage collector may move the underlying memory.

**The cost.** cgo is not free:

- **The build gets slower.** A cgo package needs a C compiler, and the
  whole dependency graph of the C library has to be present.
- **Calls are much slower than a Go call.** Crossing the language boundary
  costs hundreds of nanoseconds against a couple of nanoseconds for a Go
  call. A cgo call in a hot loop is usually a mistake.
- **The GC has to scan C memory.** Go's collector has to know about pointers
  held by C code, which it does through cgo's pointer-passing rules.
- **Portability suffers.** A cgo package is compiled against the local
  toolchain and its headers, and cross-compiling needs a C cross-compiler.

**\`CGO_ENABLED=0\`** disables cgo entirely. A package that imports "C" then
fails to build with "build constraints exclude all Go files", which is why
pure-Go libraries avoid cgo — it lets them keep working on platforms where
no C toolchain exists (js/wasm, for example).

**Should you use it?** Usually not. The cases where you might:

- You need to call an existing C library with no Go equivalent — a
  specialised compression algorithm, a hardware driver, a legacy system.
- You are porting C code and want to keep it as C.
- You need a C library that is already battle-tested and licensed.

If a pure-Go implementation exists, prefer it: it will be faster, easier to
build, and easier to reason about.`,
  terminalOutput: [
    { kind: 'command', text: 'cat main.go' },
    {
      kind: 'stdout',
      text:
        'package main\n\n/*\n#include <stdlib.h>\n#include <string.h>\n\nstatic int add(int a, int b) {\n\treturn a + b;\n}\n*/\nimport "C"\n\nimport (\n\t"fmt"\n\t"unsafe"\n)\n\nfunc main() {\n\tsum := C.add(3, 4)\n\tfmt.Println("3 + 4 =", int(sum))\n\n\tcstr := C.CString("hello from C")\n\tdefer C.free(unsafe.Pointer(cstr))\n\tfmt.Println("C string:", C.GoString(cstr))\n\tfmt.Println("C string len:", len(C.GoString(cstr)))\n}\n',
    },
    { kind: 'command', text: 'go run .' },
    {
      kind: 'stdout',
      text: '3 + 4 = 7\nC string: hello from C\nC string len: 12\n',
    },
    { kind: 'command', text: 'go env CGO_ENABLED CC GOOS GOARCH' },
    { kind: 'stdout', text: '1\ncc\ndarwin\narm64\n' },
    { kind: 'command', text: 'CGO_ENABLED=0 go build ./...' },
    { kind: 'stderr', text: 'go: warning: "./..." matched no packages\n' },
  ],
  gotcha: `\`C.CString\` allocates with C's \`malloc\`, so it must be freed with
\`C.free(unsafe.Pointer(cstr))\` — otherwise it leaks. And a Go string cannot
be passed to C as a \`char*\`: Go strings are not NUL-terminated, and the
garbage collector may move the memory out from under C.`,
};

export const buildTags: Lesson = {
  slug: 'build-tags',
  title: 'Build constraints: `//go:build`',
  sectionId: 'low-level',
  order: 48,
  runMode: 'playground',
  body: `A build constraint tells the toolchain to include a file only under
certain conditions. It is how one source tree supports several platforms, or
several build variants, without duplicating code.

**The modern form** is a \`//go:build\` line, which must appear before the
package clause and be followed by a blank line:

\`\`\`go
//go:build linux

package main
\`\`\`

The expression is the same syntax as a build constraint in the old
\`// +build\` style: terms are OR-ed, space-separated terms are AND-ed, and
each term is \`!tag\`, \`tag\`, \`tag1,tag2\` (AND) or \`tag1 || tag2\` (OR).
Parentheses are allowed.

**The old form** is \`// +build linux\`. It is still honoured, but it is
deprecated: if a file has both, they must agree. The compiler does not
complain, but \`go vet\` does — it reports
\`+build lines do not match //go:build condition\`. Running \`gofmt\` on such
a file adds the modern \`//go:build\` line alongside the old one.

**The standard tags** you will meet:

| Tag | True when |
|---|---|
| \`go1.1\` … \`go1.27\` | the toolchain is at least that version |
| \`linux\`, \`darwin\`, \`windows\`, \`js\`, \`wasm\` | the target OS matches |
| \`amd64\`, \`arm64\`, \`386\`, \`arm\` | the target architecture matches |
| \`unix\` | the target OS is Unix-like |
| \`cgo\` | cgo is enabled |
| \`gc\` | the gc compiler is in use (not gccgo) |
| \`race\` | the race detector is enabled |
| \`msan\`, \`asan\` | the corresponding sanitiser is enabled |
| \`custom_tag\` | you passed \`-tags custom_tag\` |

**\`//go:build ignore\`** is a special case. It excludes the file from every
build, which is how the Go team keeps the example programs in the standard
library's source tree from being compiled as part of the package.

**Files with a platform suffix are handled automatically.** \`foo_linux.go\`
is only built on Linux, \`foo_windows.go\` only on Windows, \`foo_test.go\` only
for tests. The recognised suffixes are \`_GOOS\`, \`_GOARCH\`, and
\`_GOOS_GOARCH\` — and the rule is "the file matches if *any* of the implied
constraints hold", which is the opposite of a \`//go:build\` line.

**The "not this platform" pattern.** A file named \`foo.go\` with
\`//go:build !windows\` is the default file, and \`foo_windows.go\` overrides
it. This is how the standard library provides platform-specific
implementations without a maze of conditionals.

**\`GOOS\` and \`GOARCH\` set the target.** \`GOOS=windows go build\` cross
compiles without a C toolchain. Build tags follow the *target*, not the
machine you are on.

**A file excluded by its constraints is not an error.** But if a package ends
up with *no* files at all, you get
\`build constraints exclude all Go files in …\` — which is a confusing error
if you expected the file to be included.`,
  starterCode: `//go:build linux

package main

import (
	"fmt"
	"runtime"
)

func main() {
	// This file is only compiled on Linux. The Playground runs Linux, so
	// the program below is the one you see.
	fmt.Println("this file was built for linux")
	fmt.Println("runtime.GOOS =", runtime.GOOS)
	fmt.Println("runtime.GOARCH =", runtime.GOARCH)
	fmt.Println("runtime.Version() =", runtime.Version())
}
`,
  note: `The Playground always compiles for \`linux/amd64\`, so a
\`//go:build linux\` constraint always matches here. The constraint is still
real — the same file is excluded when you cross-compile with
\`GOOS=windows go build\`.`,
  gotcha: `A file whose build constraints exclude it is silently skipped — but
if that leaves the package with *no* files, the error is
\`build constraints exclude all Go files in …\`, which reads like a missing
file rather than an excluded one.`,
};
