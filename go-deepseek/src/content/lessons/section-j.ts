import type { Lesson } from '../types';

const reflectBasics: Lesson = {
  slug: 'reflect-basics',
  title: 'reflect: TypeOf, ValueOf, kind vs type',
  sectionId: 'reflection-low-level',
  order: 45,
  runMode: 'playground',
  body: `\`reflect.TypeOf(x)\` returns a \`Type\` describing the static type; \`reflect.ValueOf(x)\` returns a \`Value\` you can inspect and, when addressable, set. \`Kind\` is the underlying category — \`struct\`, \`int\`, \`slice\` — while \`Name\` is the declared type name. A named type and its underlying type share a Kind but not a Type.

Reflection is how encoders, ORMs, and validators see struct tags and field layouts. It is slow and opaque, so use it at library boundaries, not in hot paths or ordinary application code.`,
  starterCode: `package main

import (
	"fmt"
	"reflect"
)

type MyInt int

type User struct {
	Name string \`json:"name"\`
	Age  int    \`json:"age,omitempty"\`
}

func main() {
	t := reflect.TypeOf(MyInt(3))
	fmt.Println("kind:", t.Kind(), "name:", t.Name())

	u := User{Name: "Ada", Age: 36}
	ut := reflect.TypeOf(u)
	fmt.Println("type:", ut.Name(), "kind:", ut.Kind())
	for i := 0; i < ut.NumField(); i++ {
		f := ut.Field(i)
		fmt.Printf("%s %s tag=%q\\n", f.Name, f.Type, f.Tag.Get("json"))
	}

	v := reflect.ValueOf(u)
	fmt.Println("field:", v.FieldByName("Name").String())
}
`,
  gotcha:
    '`ValueOf` gives an unaddressable copy. To mutate through reflection you need a pointer: `reflect.ValueOf(&u).Elem().FieldByName("Name").SetString("Grace")`.',
};

const unsafePointer: Lesson = {
  slug: 'unsafe-pointer',
  title: 'unsafe.Pointer and unsafe.Sizeof',
  sectionId: 'reflection-low-level',
  order: 46,
  runMode: 'terminal',
  body: `\`unsafe\` exposes the memory layout the type system hides. \`unsafe.Sizeof\` reports a type's size in bytes, \`Offsetof\` a field's offset inside a struct, and \`unsafe.Pointer\` converts freely between pointer types and \`uintptr\`.

It is a one-way door: conversions erase the compiler's guarantees, and \`uintptr\` values can move during garbage collection. The official rules for \`unsafe.Pointer\` exist to keep you out of use-after-free territory. Use it for interop and layout assertions; do not reach for it to avoid a copy.`,
  terminalOutput: [
    { kind: 'command', text: 'go run unsafe_demo.go' },
    { kind: 'stdout', text: 'int: 8 bytes' },
    { kind: 'stdout', text: 'pointer: 8 bytes' },
    { kind: 'stdout', text: 'Header: 24 bytes' },
    { kind: 'stdout', text: 'Size offset: 8' },
  ],
  gotcha:
    'Never keep a `uintptr` across a function call and convert it back later. The GC may move the object, and the pointer is no longer tracked while stored as an integer.',
};

const cgo: Lesson = {
  slug: 'cgo',
  title: 'cgo: calling C from Go',
  sectionId: 'reflection-low-level',
  order: 47,
  runMode: 'terminal',
  body: `A Go file that imports \`"C"\` is a cgo file. The comment immediately above the import holds C declarations; \`C.add\` calls into the compiled C. cgo requires a C toolchain and \`CGO_ENABLED=1\`, which is the default on most developer machines but off in many static builds.

The costs are real: slower calls, a more involved build, cross-compilation pain, and a boundary where Go's memory safety stops. Prefer pure Go. Use cgo when a C library has no reasonable alternative.`,
  terminalOutput: [
    { kind: 'command', text: 'go run cgo_demo.go' },
    { kind: 'stdout', text: 'C added: 42' },
    { kind: 'command', text: 'CGO_ENABLED=0 go run cgo_demo.go' },
    { kind: 'stderr', text: 'go: no Go source files' },
    { kind: 'command', text: 'go env CGO_ENABLED CC' },
    { kind: 'stdout', text: '1' },
    { kind: 'stdout', text: 'cc' },
  ],
  gotcha:
    'Setting `CGO_ENABLED=0` silently removes cgo files from the build. A package with only cgo files then fails with "no Go source files" — it is not a Go syntax error.',
};

const buildTags: Lesson = {
  slug: 'build-tags',
  title: 'Build tags and conditional compilation',
  sectionId: 'reflection-low-level',
  order: 48,
  runMode: 'playground',
  body: `A \`//go:build\` line before the package clause tells the toolchain when to include the file. Tags combine with \`&&\`, \`||\`, and \`!\`; the old \`// +build\` form still parses but should not be written new. Common tags are \`GOOS\`, \`GOARCH\`, \`unix\`, \`cgo\`, and custom names passed with \`-tags\`.

The usual pattern is one file per platform with the same declarations, each guarded by its tag. The old-style blank line after the constraint is mandatory: the directive is a comment, and it must be separated from the package clause.`,
  starterCode: `//go:build linux

package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println("running on", runtime.GOOS)
	fmt.Println("this file is included only when GOOS is linux")
}
`,
  gotcha:
    'A missing blank line after `//go:build` turns it into an ordinary comment; the file then compiles everywhere. `gofmt` will normalize the spacing, so run it.',
};

export const sectionJLessons: Lesson[] = [
  reflectBasics,
  unsafePointer,
  cgo,
  buildTags,
  {
    slug: 'section-j-checkpoint',
    title: 'Section J checkpoint',
    sectionId: 'reflection-low-level',
    order: 48.5,
    runMode: 'annotated',
    body: 'Three questions on reflection, unsafe, and build constraints.',
    checkpoint: {
      id: 'checkpoint-reflection-low-level',
      sectionId: 'reflection-low-level',
      title: 'Reflection & low-level checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'What is the Kind of `type MyInt int` at runtime?',
          options: ['MyInt', 'int', 'struct', 'interface'],
          correctIndex: 1,
          explanation:
            'Kind is the underlying category (int); Name is MyInt. Kind and Type are different questions.',
        },
        {
          kind: 'mcq',
          prompt: 'Which conversion requires `unsafe.Pointer`?',
          options: [
            'int32 to int64',
            '*int to *byte',
            'string to []rune',
            'interface to concrete type',
          ],
          correctIndex: 1,
          explanation:
            'unsafe.Pointer bridges unrelated pointer types; the other conversions are safe language conversions.',
        },
        {
          kind: 'mcq',
          prompt: 'What does `CGO_ENABLED=0` do to a package made only of cgo files?',
          options: [
            'Compiles it with a pure-Go fallback',
            'Excludes those files, often leaving no Go source',
            'Fails with a C compiler error',
            'Nothing',
          ],
          correctIndex: 1,
          explanation:
            'The files are excluded by build constraints, so the package can end up with no buildable Go files.',
        },
      ],
    },
  },
];
