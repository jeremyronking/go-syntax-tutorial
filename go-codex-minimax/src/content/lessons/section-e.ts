import type { Lesson } from '../types';

// 24. Interfaces
export const interfaces: Lesson = {
  slug: 'interfaces',
  title: 'Interfaces, implicit satisfaction, the empty interface (`any`)',
  section: 'E',
  order: 24,
  runMode: 'playground',
  body: `An interface is a set of method signatures. A type implements an
interface **implicitly** — no \`implements\` keyword. The interface is satisfied
the moment the type's method set is a superset of the interface.

The empty interface, \`interface{}\` (or its alias \`any\`), has no methods, so
*every* type satisfies it. That's why \`fmt.Println\` accepts anything.`,
  starterCode: `package main

import "fmt"

type Stringer interface {
    String() string
}

type User struct{ Name string }
func (u User) String() string { return "user:" + u.Name }

func describe(s Stringer) {
    fmt.Println(s.String())
}

func main() {
    describe(User{Name: "Alex"})
    fmt.Println(123, "hi", []int{1, 2, 3}) // any
}
`,
};

// 25. Type assertions
export const typeAssertions: Lesson = {
  slug: 'type-assertions',
  title: 'Type assertions, comma-ok form, type switches revisited',
  section: 'E',
  order: 25,
  runMode: 'playground',
  body: `\`x.(T)\` is a type assertion: it extracts the concrete value of type \`T\`
from interface \`x\`. The comma-ok form \`v, ok := x.(T)\` returns \`false\` (and a
zero value) when the assertion fails — without panicking.

For more than two cases, prefer a \`switch v := x.(type)\` over a chain of
comma-ok assertions.`,
  starterCode: `package main

import "fmt"

func main() {
    var x any = "hello"
    s, ok := x.(string)
    if ok {
        fmt.Println("string of len", len(s), ":", s)
    } else {
        fmt.Println("not a string")
    }

    // Unsafe assertion — would panic on mismatch
    // n := x.(int)
}
`,
};

// 26. Embedding
export const embedding: Lesson = {
  slug: 'embedding',
  title: 'Embedding (struct, interface, method promotion)',
  section: 'E',
  order: 26,
  runMode: 'playground',
  body: `Embedding composes types by including them as anonymous fields. A struct
that embeds another struct inherits its fields and methods; a struct that
embeds an interface gets all of its methods as forwarding stubs (you can
override individual methods).

Embedding is **not** inheritance — there's no subtype relationship. The
outer struct has the inner type as a *field*; you can access it by name.`,
  starterCode: `package main

import "fmt"

type Logger struct{ prefix string }
func (l Logger) Log(msg string) { fmt.Println(l.prefix, msg) }

type Server struct {
    Logger
    Addr string
}

func main() {
    s := Server{Logger: Logger{"[svc]"}, Addr: ":8080"}
    s.Log("listening on " + s.Addr) // promoted
    s.Logger.Log("explicit access")
}
`,
};

// 27. Common stdlib interfaces
export const stdlibInterfaces: Lesson = {
  slug: 'stdlib-interfaces',
  title: 'Common stdlib interfaces: `error`, `Stringer`, `io.Reader`/`Writer`',
  section: 'E',
  order: 27,
  runMode: 'playground',
  body: `Four small interfaces show up everywhere:

- \`error\`: \`{ Error() string }\`
- \`fmt.Stringer\`: \`{ String() string }\`
- \`io.Reader\`: \`{ Read(p []byte) (n int, err error) }\`
- \`io.Writer\`: \`{ Write(p []byte) (n int, err error) }\`

The \`io\` package is built on these: \`io.Copy(dst, src)\` works for files,
HTTP bodies, network connections, in-memory buffers, anything.`,
  starterCode: `package main

import (
    "fmt"
    "io"
    "os"
    "strings"
)

func main() {
    var r io.Reader = strings.NewReader("hello, world\\n")
    _, _ = io.Copy(os.Stdout, r)
    fmt.Println("done")
}
`,
};
