import type { Lesson } from '../types';

const interfaces: Lesson = {
  slug: 'interfaces',
  title: 'Interfaces and implicit satisfaction',
  sectionId: 'interfaces',
  order: 24,
  runMode: 'playground',
  body: `An interface is a method set. A type satisfies it by having those methods — there is no \`implements\` keyword and no declaration at the type. That is why standard-library interfaces like \`fmt.Stringer\` work on your types without imports of each other.

\`any\` is an alias for \`interface{}\`: a value of any type, with no methods. Use it at true boundaries; reach for a real interface when you need behavior.`,
  starterCode: `package main

import (
	"fmt"
	"sort"
)

type Speaker interface{ Speak() string }

type Dog struct{}

func (Dog) Speak() string { return "woof" }

type ByLen []string

func (b ByLen) Len() int           { return len(b) }
func (b ByLen) Less(i, j int) bool { return len(b[i]) < len(b[j]) }
func (b ByLen) Swap(i, j int)      { b[i], b[j] = b[j], b[i] }

func main() {
	var s Speaker = Dog{}
	fmt.Println(s.Speak())

	names := []string{"gopher", "go", "c"}
	sort.Sort(ByLen(names))
	fmt.Println(names)

	var x any = 42
	fmt.Printf("%T %v\\n", x, x)
}
`,
  gotcha:
    'Interface satisfaction is checked at assignment, not declaration. A missing method surfaces where you pass the value, sometimes several calls away from the type.',
};

const typeAssertions: Lesson = {
  slug: 'type-assertions',
  title: 'Type assertions and comma-ok',
  sectionId: 'interfaces',
  order: 25,
  runMode: 'playground',
  body: `\`v.(T)\` asserts that the dynamic type of \`v\` is \`T\` and panics if it is not. \`v, ok := v.(T)\` never panics; \`ok\` reports whether the assertion held, and \`v\` is the zero value otherwise.

Assertions also work against interfaces, not just concrete types: \`v.(io.Reader)\` asks whether the value has \`Read\`. Type switches are the readable form when you have more than one case.`,
  starterCode: `package main

import (
	"fmt"
	"io"
	"strings"
)

func main() {
	var v any = "hello"

	if s, ok := v.(string); ok {
		fmt.Println("string of", len(s))
	}
	if n, ok := v.(int); !ok {
		fmt.Println("not an int:", n)
	}

	var r any = strings.NewReader("data")
	if _, ok := r.(io.Reader); ok {
		fmt.Println("implements io.Reader")
	}

	switch t := v.(type) {
	case string:
		fmt.Println("switch string:", t)
	case int:
		fmt.Println("switch int:", t)
	}
}
`,
  gotcha:
    'The single-value form panics on a miss: `n := v.(int)`. Use comma-ok unless a panic is genuinely what you want.',
};

const embedding: Lesson = {
  slug: 'embedding',
  title: 'Embedding: struct and interface',
  sectionId: 'interfaces',
  order: 26,
  runMode: 'playground',
  body: `Embedding puts a type inside another without a field name. Its exported fields and methods are promoted, so the outer type appears to have them. For interfaces, embedding unions method sets: \`interface { Reader; Writer }\` requires both.

Embedding is composition, not inheritance. The outer value is not an instance of the inner type, and there is no virtual dispatch to the outer type from inner methods.`,
  starterCode: `package main

import "fmt"

type Reader interface{ Read() string }
type Writer interface{ Write(s string) string }
type ReadWriter interface {
	Reader
	Writer
}

type pipe struct{ data string }

func (p *pipe) Read() string          { return p.data }
func (p *pipe) Write(s string) string { p.data += s; return p.data }

type Logger struct{ prefix string }

func (l Logger) Log(msg string) { fmt.Println(l.prefix + msg) }

type Service struct {
	Logger
	Name string
}

func main() {
	var rw ReadWriter = &pipe{}
	rw.Write("hello ")
	rw.Write("world")
	fmt.Println(rw.Read())

	s := Service{Logger: Logger{prefix: "[svc] "}, Name: "api"}
	s.Log("started " + s.Name)
}
`,
  gotcha:
    'Promoted methods keep their original receiver. An embedded value receiver still copies the embedded value; it does not magically see the outer struct.',
};

const stdlibInterfaces: Lesson = {
  slug: 'stdlib-interfaces',
  title: 'error, Stringer, io.Reader/Writer',
  sectionId: 'interfaces',
  order: 27,
  runMode: 'playground',
  body: `Four interfaces cover most Go code you will read. \`error\` is one method, \`Error() string\`. \`fmt.Stringer\` is \`String() string\`, used by \`fmt\` when printing. \`io.Reader\` and \`io.Writer\` are the byte-stream contracts that compose into almost everything in \`io\`.

Implementing \`String()\` changes how your type prints with \`%v\` and \`Println\`. The interface checks \`var _ fmt.Stringer = T{}\` are compile-time assertions that your type still satisfies the contract.`,
  starterCode: `package main

import (
	"fmt"
	"io"
	"strings"
)

type Temp float64

func (t Temp) String() string { return fmt.Sprintf("%.1f°C", float64(t)) }

type NotEmpty string

func (n NotEmpty) Error() string { return "empty " + string(n) }

var _ fmt.Stringer = Temp(0)
var _ error = NotEmpty("field")

func main() {
	fmt.Println(Temp(21.5))
	fmt.Printf("%v and %s\\n", Temp(0), Temp(-3))

	r := strings.NewReader("stream bytes")
	b, err := io.ReadAll(r)
	fmt.Println(string(b), err)

	var w io.Writer = &strings.Builder{}
	fmt.Fprint(w, "written")
	fmt.Println(w.(fmt.Stringer).String())
}
`,
  gotcha:
    'Printing a value whose `String()` panics or whose `Error()` dereferences nil will take down `fmt.Println`. Keep String methods total and nil-safe on pointer receivers.',
};

export const sectionELessons: Lesson[] = [
  interfaces,
  typeAssertions,
  embedding,
  stdlibInterfaces,
  {
    slug: 'section-e-checkpoint',
    title: 'Section E checkpoint',
    sectionId: 'interfaces',
    order: 27.5,
    runMode: 'annotated',
    body: 'Four questions on satisfaction, assertions, embedding, and the standard-library contracts.',
    checkpoint: {
      id: 'checkpoint-interfaces',
      sectionId: 'interfaces',
      title: 'Interfaces checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'A type has a method `func (t *T) String() string`. Which value satisfies `fmt.Stringer`?',
          options: ['T', '*T', 'Both T and *T', 'Neither'],
          correctIndex: 1,
          explanation:
            'Pointer-receiver methods belong to *T\'s method set only; T does not satisfy the interface.',
        },
        {
          kind: 'mcq',
          prompt: 'What does `n := v.(int)` do when v holds a string?',
          options: ['Returns 0', 'Panics', 'Returns an error', 'Returns nil'],
          correctIndex: 1,
          explanation:
            'The single-value assertion panics on a type mismatch; the comma-ok form is the safe version.',
        },
        {
          kind: 'fill',
          prompt: '`any` is an alias for which interface?',
          acceptedAnswers: ['interface{}', 'interface {}', 'the empty interface'],
          explanation:
            'any spells interface{} exactly; it is not a new type.',
        },
        {
          kind: 'mcq',
          prompt: 'Embedding `Reader` and `Writer` in an interface...',
          options: [
            'Creates two fields',
            'Requires implementers to provide both method sets',
            'Allows either method set',
            'Is not legal for interfaces',
          ],
          correctIndex: 1,
          explanation:
            'Interface embedding unions the method sets, so a value must implement all promoted methods.',
        },
      ],
    },
  },
];
