import type { Lesson } from '../types';

export const interfaces: Lesson = {
  slug: 'interfaces',
  title: 'Interfaces & implicit satisfaction',
  sectionId: 'interfaces',
  order: 24,
  runMode: 'playground',
  body: `An interface is a set of method signatures. A type satisfies an interface by
*having* those methods — you never write \`implements\`:

\`\`\`go
type Speaker interface {
    Speak() string
}

type Dog struct{ Name string }
func (d *Dog) Speak() string { return d.Name + " says woof" }

var s Speaker = &Dog{}  // compiles: *Dog has Speak()
\`\`\`

This is the opposite of Java or Rust, where satisfaction is declared
explicitly. The consequence is that **any type anywhere** can satisfy your
interface, including types defined in other packages that were written long
before your interface existed. That is the point: your interface belongs to the
*consumer*, not the producer.

**The empty interface** \`interface{}\` — aliased as \`any\` since Go 1.18 — is
satisfied by every type. It is what \`fmt.Println\` takes, and what
\`encoding/json\` decodes into.

**A value stored in an interface carries two things:** its static type (the type
of the variable) and its dynamic type (the type of the value actually stored).
The dynamic type is what type assertions and type switches look at.

**Nil interfaces are the classic trap.** An interface holding a nil pointer is
*not* a nil interface:

\`\`\`go
var p *Dog = nil
var s Speaker = p   // s != nil! It holds a (*Dog, nil)
if s == nil { ... } // false
\`\`\`

The interface is only nil if both the type and the value are nil. This is why
\`return nil\` on an error return works, but \`return typedNil\` does not.

**Keep interfaces small.** An interface with one method is satisfied by
everything, which is what you want. An interface with fifteen methods is
satisfied by almost nothing and is hard to fake in tests.`,
  starterCode: `package main

import "fmt"

type Speaker interface {
	Speak() string
}

type Dog struct{ Name string }

// A nil-safe method: a nil *Dog still satisfies Speaker.
func (d *Dog) Speak() string {
	if d == nil {
		return "(nil dog)"
	}
	return d.Name + " says woof"
}

type Robot struct{}

func (r Robot) Speak() string { return "beep" }

// A second, unrelated interface. Anything with Speak() satisfies it.
type Sharer interface {
	Speak() string
}

func main() {
	// Implicit satisfaction — no "implements" clause anywhere.
	var s Speaker = &Dog{Name: "Rex"}
	fmt.Println(s.Speak())

	// A completely different type satisfies the same interface.
	s = Robot{}
	fmt.Println(s.Speak())

	// A slice of the interface type holds a mix.
	zoo := []Speaker{&Dog{Name: "Fido"}, Robot{}, &Dog{Name: "Bella"}}
	for _, v := range zoo {
		fmt.Println("  ", v.Speak())
	}

	// The same value satisfies two identical interfaces.
	var any1 Speaker = &Dog{Name: "Sam"}
	var any2 Sharer = any1
	fmt.Println("both interfaces satisfied:", any1.Speak() == any2.Speak())

	// The empty interface accepts anything.
	var x any = 42
	fmt.Printf("any holds %T = %v\\n", x, x)
	x = "now a string"
	fmt.Printf("any holds %T = %v\\n", x, x)

	// The nil-interface trap: a nil pointer in an interface is NOT nil.
	var d *Dog
	var sp Speaker = d
	fmt.Println("sp == nil:", sp == nil)
	fmt.Println("but sp.Speak() still works:", sp.Speak())

	// A truly nil interface.
	var empty Speaker
	fmt.Println("empty == nil:", empty == nil)
}
`,
  gotcha: `An interface holding a nil *pointer* is not a nil interface. \`var p *Dog;
var s Speaker = p\` leaves \`s != nil\`, because the interface carries both a
type and a value. Only \`var s Speaker\` gives you a genuinely nil interface.`,
};

export const typeAssertions: Lesson = {
  slug: 'type-assertions',
  title: 'Type assertions & the comma-ok form',
  sectionId: 'interfaces',
  order: 25,
  runMode: 'playground',
  body: `A type assertion extracts the concrete value out of an interface:

\`\`\`go
v := i.(int)         // panics if i does not hold an int
v, ok := i.(int)     // ok is false if it does not
\`\`\`

The one-value form panics on mismatch. The two-value form does not — it
returns the zero value and \`false\`. **Always prefer the comma-ok form** unless
you are certain of the type.

An assertion to an *interface* type is different: it checks whether the dynamic
type implements that interface.

\`\`\`go
if w, ok := i.(io.Writer); ok {
    w.Write(data)
}
\`\`\`

This is how you reach a specific capability without knowing the concrete type —
the whole point of the \`io.Writer\`, \`fmt.Stringer\` and \`error\` assertions.

**Type switches** are the multi-type version, and they are usually what you
want when you have more than two possibilities. The \`any\` type in a switch
gives you the concrete type directly:

\`\`\`go
switch v := i.(type) {
case int:
    use(v)      // v is an int
case error:
    use(v)      // v is the concrete error type
}
\`\`\`

A failed assertion with a single return value panics with a
\`type assertion failed\` error. If you are not sure, use the comma-ok form or a
type switch.`,
  starterCode: `package main

import (
	"fmt"
	"io"
	"strings"
)

func main() {
	var i any = 42

	// The two-value form: no panic, ok tells you what happened.
	v, ok := i.(int)
	fmt.Println("int:", v, ok)

	// The one-value form panics if the assertion fails.
	fmt.Println("direct:", i.(int))

	// A failed assertion with the one-value form panics.
	// fmt.Println(i.(string))

	// The comma-ok form handles the failure gracefully.
	s, ok := i.(string)
	fmt.Printf("string: %q %v\\n", s, ok)

	// Asserting to an interface type checks for the capability.
	var w io.Writer
	_, isWriter := w.(io.Writer)
	fmt.Println("nil io.Writer is a Writer:", isWriter)

	var r io.Reader = strings.NewReader("hello")
	_, isReader := r.(io.Reader)
	fmt.Println("strings.Reader is a Reader:", isReader)

	// fmt.Stringer is an interface in the standard library.
	type named struct{ name string }
	fmt.Println("named implements Stringer:", implementsStringer(named{}))

	// A type switch is the multi-type version.
	switch val := i.(type) {
	case int:
		fmt.Println("type switch int:", val*2)
	case string:
		fmt.Println("type switch string:", val)
	default:
		fmt.Println("type switch default")
	}
}

func implementsStringer(v any) bool {
	_, ok := v.(fmt.Stringer)
	return ok
}
`,
  gotcha: `A one-value type assertion panics when the type does not match. Use
\`v, ok := i.(T)\` unless you have already established the dynamic type — a
panic in a request handler is a lot more expensive than a \`false\`.`,
};

export const embedding: Lesson = {
  slug: 'embedding',
  title: 'Embedding & method promotion',
  sectionId: 'interfaces',
  order: 26,
  runMode: 'playground',
  body: `Go has no inheritance. It has *embedding*, which is composition with
automatic field and method promotion.

Embedding a struct promotes its fields:

\`\`\`go
type Base struct{ ID int }

type User struct {
    Base
    Name string
}

u := User{Base: Base{ID: 1}, Name: "ada"}
fmt.Println(u.ID)     // promoted field
u.ID = 2             // promoted field write
\`\`\`

Embedding an *interface* promotes its methods, and the outer type then
satisfies that interface — this is the pattern behind \`io.ReadWriter\`,
\`fmt.Stringer\` and most of the "mixin" behaviour in the standard library:

\`\`\`go
type Logger interface{ Log(string) }

type Service struct {
    Logger   // embedded interface
    Name string
}
\`\`\`

**Promotion is shallow.** If \`Base\` embeds \`Deeper\`, and \`Deeper\` has a
method \`M\`, then \`Base.M\` is promoted, and \`User\` (embedding \`Base\`) gets
\`User.M\` at depth two. But \`User\` does not get \`Deeper\`'s *fields* promoted
past one level, and there is no automatic promotion of promoted methods through
*interface* embedding — an interface's method set is exactly the methods it
lists.

**Ambiguity is an error.** If a type embeds two types that both have a method
\`M\`, the selector \`x.M\` is ambiguous and fails to compile. You resolve it by
naming the embedded type explicitly: \`x.Left.M()\`.

**Promoted methods keep their own receiver.** If \`Base.M\` has a pointer
receiver, then \`User.M\` also has a pointer receiver — so \`User\` satisfies an
interface requiring \`M\` only as \`*User\`, not as \`User\`.

Shadowing works like this: a field or method declared directly on the outer
type shadows the promoted one at depth 0.`,
  starterCode: `package main

import "fmt"

// A struct to embed.
type Base struct {
	ID int
}

func (b Base) Describe() string { return fmt.Sprintf("base %d", b.ID) }

// A pointer-receiver method, to show how promotion affects method sets.
type Counter struct{ n int }

func (c *Counter) Inc() { c.n++ }

type Widget struct {
	Counter
	Base
	Name string
}

// An embedded interface.
type Logger interface {
	Log(msg string)
}

type Service struct {
	Logger
	Name string
}

type consoleLogger struct{}

func (consoleLogger) Log(msg string) { fmt.Println("  log:", msg) }

func main() {
	// Struct embedding promotes fields and methods.
	w := Widget{Base: Base{ID: 7}, Name: "gear"}
	fmt.Println("promoted field:", w.ID)
	w.ID = 8
	fmt.Println("promoted method:", w.Describe())

	// You still initialise the embedded field explicitly.
	fmt.Println("explicit:", w.Base.ID)

	// A pointer-receiver method is promoted as a pointer-receiver method.
	w.Inc()
	fmt.Println("counter:", w.Counter.n)

	// An embedded interface promotes its methods, and the outer type
	// satisfies the interface.
	s := Service{Logger: consoleLogger{}, Name: "api"}
	s.Log("starting up")

	// Ambiguity: both Counter and Base could grow a Describe method, so
	// the selector would be ambiguous — you disambiguate by name:
	// w.Left.Describe()
	fmt.Println("no ambiguity here:", w.Describe())
}
`,
  gotcha: `Promotion is shallow and ambiguity is a compile error. If a type
embeds two types that both define \`Describe\`, \`w.Describe()\` will not compile
— you must write \`w.Left.Describe()\`.`,
};

export const stdlibInterfaces: Lesson = {
  slug: 'stdlib-interfaces',
  title: 'Standard library interfaces: `error`, `Stringer`, `io`',
  sectionId: 'interfaces',
  order: 27,
  runMode: 'playground',
  body: `A handful of standard library interfaces cover a surprising amount of
Go's "do the obvious thing" surface.

**\`error\`** is just \`interface { Error() string }\`. If your type has an
\`Error() string\` method, it *is* an error, and callers can use
\`errors.Is\`, \`errors.As\` and \`fmt.Errorf("%w")\`.

**\`fmt.Stringer\`** is \`interface { String() string }\`. Implementing it makes
\`%v\`, \`%s\` and \`fmt.Println\` render your type nicely. The convention is
also to define a \`String()\` method for any type you want readable in logs.

**\`io.Reader\` and \`io.Writer\`** are the workhorses:

\`\`\`go
type Reader interface { Read(p []byte) (n int, err error) }
type Writer interface { Write(p []byte) (n int, err error) }
\`\`\`

Anything that can produce bytes is a \`Reader\`; anything that can consume them
is a \`Writer\`. \`os.File\`, \`bytes.Buffer\`, \`strings.Reader\`,
\`net.Conn\`, \`http.Request\` and \`http.Response\` all satisfy them, and so
does your own type.

**\`io.ReadWriter\`** is both. **\`io.ReadCloser\`** adds \`Close() error\`.

Because these are interfaces, you can write a function that works with any of
them:

\`\`\`go
func countBytes(r io.Reader) (int64, error) {
    return io.Copy(io.Discard, r)
}
\`\`\`

That function works with a file, an HTTP response body, a \`gzip.Reader\`, or a
test double you wrote in five lines.

**Small interfaces, big ecosystem.** This is why Go's standard library is
composable: \`io.Copy\`, \`bufio.Scanner\`, \`fmt.Fprintf\` and
\`encoding/json\` all take interfaces, so they work with anything that
implements them.`,
  starterCode: `package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"strings"
)

// Implement error and fmt.Stringer.
type AppError struct {
	Code int
	Msg  string
}

func (e *AppError) Error() string {
	return fmt.Sprintf("app error %d: %s", e.Code, e.Msg)
}

// A type with a String method.
type Temperature float64

func (t Temperature) String() string {
	return fmt.Sprintf("%.1f°C", float64(t))
}

// Our own io.Reader: it produces n chunks of 32 bytes.
type repeatReader struct {
	n     int
	count int
}

func (r *repeatReader) Read(p []byte) (int, error) {
	if r.count >= r.n {
		return 0, io.EOF
	}
	for i := range p {
		p[i] = 'x'
	}
	r.count++
	return len(p), nil
}

// A function that works with anything that is an io.Reader.
func countBytes(r io.Reader) int64 {
	n, err := io.Copy(io.Discard, r)
	if err != nil {
		return -1
	}
	return n
}

func main() {
	// error: our type satisfies it structurally.
	var err error = &AppError{Code: 42, Msg: "not found"}
	fmt.Println("error:", err)

	// fmt.Stringer changes how the value prints.
	t := Temperature(21.5)
	fmt.Println("stringer:", t)
	fmt.Printf("in a format: %v / %s\\n", t, t)

	// io.Reader: files, buffers, strings, and our own type.
	counts := map[string]int64{}
	counts["strings.Reader"] = countBytes(strings.NewReader("hello"))
	counts["bytes.Buffer"] = countBytes(bytes.NewBufferString("hello world"))
	counts["our repeatReader"] = countBytes(&repeatReader{n: 3})
	for k, v := range counts {
		fmt.Printf("%-18s %d bytes\\n", k, v)
	}
	// io.Writer: anything that accepts bytes.
	var buf bytes.Buffer
	fmt.Fprintf(&buf, "written to a %T", &buf)
	fmt.Println("buffer:", buf.String())

	// bufio.Scanner works over any io.Reader.
	scanner := bufio.NewScanner(strings.NewReader("one\\ntwo\\nthree"))
	for scanner.Scan() {
		fmt.Println("scanned:", scanner.Text())
	}
}
`,
  gotcha: `A \`String() string\` method changes how \`%v\` and \`fmt.Println\`
render your type — including inside a struct. If a type has a \`String\` method
and you want the raw struct, use \`%+v\` with a pointer, or \`%#v\`.`,
};

export const generics: Lesson = {
  slug: 'generics',
  title: 'Type parameters & inference',
  sectionId: 'generics',
  order: 28,
  runMode: 'playground',
  body: `Go 1.18 added type parameters. A generic function declares its type
parameters in square brackets before the parameter list:

\`\`\`go
func Map[T, U any](xs []T, f func(T) U) []U {
    out := make([]U, 0, len(xs))
    for _, x := range xs {
        out = append(out, f(x))
    }
    return out
}
\`\`\`

**Inference** means you usually do not have to name the type parameters:

\`\`\`go
ints := Map([]int{1, 2, 3}, func(n int) string { return strconv.Itoa(n) })
// T is int, U is string — both inferred
\`\`\`

When inference cannot work — typically when the type argument appears only in
the *result* — you name it explicitly: \`Map[int, string](...)\`.

Type parameters can have *methods*? No — but they can have *constraints*, which
are the topic of the next lesson.

**Generic types** work the same way:

\`\`\`go
type Stack[T any] []T

func (s *Stack[T]) Push(v T) { *s = append(*s, v) }
func (s *Stack[T]) Pop() (T, bool) {
    var zero T
    if len(*s) == 0 {
        return zero, false
    }
    v := (*s)[len(*s)-1]
    *s = (*s)[:len(*s)-1]
    return v, true
}
\`\`\`

Note the receiver: \`func (s *Stack[T])\`. A generic type's methods must repeat
the type parameters in the receiver.

**What generics do not do:** they do not create new types at runtime. A
\`Stack[int]\` and a \`Stack[string]\` are different types, but the compiler
erases the type parameter for the code it generates. There is no boxing cost
and no reflection — the code is specialised, like C++ templates, but with
compile-time checking of the body.

Since Go 1.18 the standard library has generics in \`slices\`, \`maps\` and
\`cmp\`: \`slices.Sort\`, \`slices.Contains\`, \`maps.Keys\` (which returns an
iterator in 1.23+).`,
  starterCode: `package main

import (
	"fmt"
	"strconv"
)

// A generic function with two type parameters.
func Map[T, U any](xs []T, f func(T) U) []U {
	out := make([]U, 0, len(xs))
	for _, x := range xs {
		out = append(out, f(x))
	}
	return out
}

// A generic function that uses the type parameter's zero value.
func Zero[T any]() T {
	var zero T
	return zero
}

// A generic type.
type Stack[T any] []T

func (s *Stack[T]) Push(v T) {
	*s = append(*s, v)
}

func (s *Stack[T]) Pop() (T, bool) {
	var zero T
	if len(*s) == 0 {
		return zero, false
	}
	v := (*s)[len(*s)-1]
	*s = (*s)[:len(*s)-1]
	return v, true
}

func main() {
	// Inference: T and U are both worked out from the arguments.
	strs := Map([]int{1, 2, 3}, func(n int) string { return strconv.Itoa(n) })
	fmt.Println("Map:", strs)

	// Explicit type arguments when inference cannot work.
	explicit := Map[int, string]([]int{4, 5}, strconv.Itoa)
	fmt.Println("explicit:", explicit)

	// The zero value of a type parameter.
	fmt.Printf("Zero[int]()=%d Zero[string()]=%q Zero[bool]()=%v\\n",
		Zero[int](), Zero[string](), Zero[bool]())

	// A generic type.
	var s Stack[string]
	s.Push("a")
	s.Push("b")
	top, ok := s.Pop()
	fmt.Println("popped:", top, ok, "remaining:", len(s))

	// Generic types work with the standard library's generic helpers.
	nums := []int{3, 1, 2}
	sortInts(nums)
	fmt.Println("sorted:", nums)
}

func sortInts(xs []int) {
	// A tiny insertion sort, to avoid importing "slices" here.
	for i := 1; i < len(xs); i++ {
		for j := i; j > 0 && xs[j] < xs[j-1]; j-- {
			xs[j], xs[j-1] = xs[j-1], xs[j]
		}
	}
}
`,
  gotcha: `Type parameters erase at runtime — there is no boxing and no
reflection. But the compiler *does* generate a separate instantiation per type
argument, so a generic used with a dozen types means a dozen copies of the
code in your binary.`,
};

export const constraints: Lesson = {
  slug: 'constraints',
  title: 'Constraints, `comparable` & type sets',
  sectionId: 'generics',
  order: 29,
  runMode: 'playground',
  body: `A constraint is an interface that may contain *type terms* as well as
methods. The type terms define the **type set** — the set of types allowed to
instantiate the parameter.

\`\`\`go
type Number interface {
    ~int | ~int64 | ~float64
}
\`\`\`

The \`~\` means "types whose *underlying* type is this". Without it, \`int\`
alone would only allow the exact type \`int\`, and a named type
\`type MyInt int\` would be rejected. With \`~int\`, \`MyInt\` is allowed.

**\`any\`** is \`interface{}\` — the type set of every type.

**\`comparable\`** is a predeclared constraint whose type set is the strictly
comparable types. Note that \`any\` satisfies \`comparable\`'s *method* set
constraint form (everything is comparable to itself with \`==\`), but the
predeclared \`comparable\` constraint is stricter: it excludes types that are
not *strictly* comparable, like a slice.

**A union** of type terms is written with \`|\`:

\`\`\`go
type Ordered interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
        ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |
        ~float32 | ~float64 | ~string
}
\`\`\`

The standard library's \`cmp.Ordered\` is exactly that.

**Constraints can also require methods**, and you can combine both:

\`\`\`go
type Stringer interface {
    fmt.Stringer
    ~int
}
\`\`\`

Two rules to remember:

1. A type set with more than one term is a **union**. Overlapping unions are
   an error — \`~int | MyInt\` is rejected because \`MyInt\` is already in
   \`~int\`.
2. A union cannot contain \`comparable\` or any interface with methods.

**You rarely write constraints by hand.** The common ones are \`any\`,
\`comparable\`, \`cmp.Ordered\`, and \`slices.Ordered\`.`,
  starterCode: `package main

import (
	"fmt"
	"strings"
)

// A union of type terms. The ~ means "underlying type".
type Number interface {
	~int | ~int64 | ~float64
}

// A named type with an int underlying type — allowed by ~int.
type MyInt int

// A constraint combining a method requirement and a type term.
// A type must have an int underlying type AND implement fmt.Stringer.
type Named interface {
	fmt.Stringer
	~int
}

// A constraint that only requires a method.
type Greeter interface {
	Greet() string
}

type hello struct{}

func (hello) Greet() string { return "hello" }

// A generic function constrained to comparable types.
func IndexOf[T comparable](xs []T, target T) int {
	for i, x := range xs {
		if x == target {
			return i
		}
	}
	return -1
}

// A generic function constrained to numbers.
func Sum[T Number](xs []T) T {
	var total T
	for _, x := range xs {
		total += x
	}
	return total
}

// A generic function constrained by a method.
func GreetAll[T Greeter](xs []T) []string {
	out := make([]string, 0, len(xs))
	for _, x := range xs {
		out = append(out, x.Greet())
	}
	return out
}

// A generic function constrained to a combined constraint.
func DescribeAll[T Named](xs []T) []string {
	out := make([]string, 0, len(xs))
	for _, x := range xs {
		out = append(out, x.String())
	}
	return out
}

func main() {
	// ~int admits both int and MyInt.
	fmt.Println("Sum ints:", Sum([]int{1, 2, 3}))
	fmt.Println("Sum MyInt:", Sum([]MyInt{1, 2, 3}))
	fmt.Println("Sum floats:", Sum([]float64{1.5, 2.5}))

	// comparable lets us use ==.
	fmt.Println("IndexOf:", IndexOf([]string{"a", "b", "c"}, "b"))
	fmt.Println("IndexOf missing:", IndexOf([]string{"a"}, "z"))

	// A method constraint.
	fmt.Println("GreetAll:", GreetAll([]hello{hello{}, hello{}}))

	// A combined constraint: an int underlying type AND a String method.
	fmt.Println("DescribeAll:", DescribeAll([]namedInt{5, 6}))

	// fmt.Stringer is satisfied structurally.
	fmt.Println("strings.Builder is a Stringer:", isStringer(&strings.Builder{}))
}

type namedInt int

func (n namedInt) String() string { return fmt.Sprintf("namedInt(%d)", int(n)) }

func isStringer(v any) bool {
	_, ok := v.(fmt.Stringer)
	return ok
}
`,
  gotcha: `Without the \`~\`, \`~int\` vs \`int\` matters: a constraint of \`int\`
alone rejects \`type MyInt int\`, because the constraint matches the exact type,
not the underlying one. Reach for \`~int\` unless you really mean exact.`,
};

export const whenNotGenerics: Lesson = {
  slug: 'when-not-generics',
  title: 'When *not* to reach for generics',
  sectionId: 'generics',
  order: 30,
  runMode: 'playground',
  body: `Generics are a tool for **type-safe containers and algorithms**, not a
general-purpose replacement for interfaces. Here is the case against.

**Interfaces already cover most of the need.** \`io.Reader\`, \`io.Writer\`,
\`fmt.Stringer\` and every callback in the standard library use interfaces. An
interface erases the type at the boundary and dispatches dynamically — cheap
enough, and much more flexible.

**Generics are less flexible.** A generic function works for the types its
constraint allows. If you later need a type that does not satisfy the
constraint, you cannot add it. Interfaces accept anything that has the right
methods, forever.

**Generics add cognitive overhead.** \`func Map[T, U any](xs []T, f func(T) U) []U\`
takes a paragraph to explain. \`func Map(xs []any, f func(any) any) []any\` takes
one line — at the cost of type assertions at every call site. Neither is
free.

**The standard library already did the work.** Before you write a generic
helper, check \`slices\`, \`maps\` and \`cmp\`:

\`\`\`go
slices.Contains(xs, v)
slices.Sort(xs)
slices.SortFunc(xs, func(a, b T) int { ... })
maps.Keys(m)   // returns an iterator
maps.Values(m)
\`\`\`

**Generics do not add methods to existing types.** You cannot write
\`func (s MySlice) Map(...) \` with a new type parameter — a method may not
introduce type parameters of its own, and you cannot add methods to a type from
another package anyway.

**The rule of thumb:** use generics when you are writing a *container* or an
*algorithm* that operates on a type parameter and does not need the concrete
type's behaviour — \`Set[T]\`, \`Map[K,V]\`, \`Filter\`, \`Reduce\`. Use
interfaces when you are writing code that *calls* on a type's behaviour.

A common smell: a generic function whose body immediately type-asserts its
parameter back to \`any\` or to a concrete type. At that point, an interface
would be simpler.`,
  starterCode: `package main

import (
	"fmt"
	"maps"
	"slices"
	"strings"
)

// An interface: flexible, accepts anything with the right method.
type Greeter interface {
	Greet() string
}

type english struct{}
type french struct{}

func (english) Greet() string { return "hello" }
func (french) Greet() string  { return "bonjour" }

func greetAll(gs []Greeter) {
	for _, g := range gs {
		fmt.Println(" ", g.Greet())
	}
}

// A generic: type-safe, but constrained to Ordered types.
func maxOf[T cmpOrdered](xs []T) (T, bool) {
	var zero T
	if len(xs) == 0 {
		return zero, false
	}
	best := xs[0]
	for _, x := range xs[1:] {
		if x > best {
			best = x
		}
	}
	return best, true
}

// The standard library already provides generic algorithms.
type cmpOrdered interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |
		~float32 | ~float64 | ~string
}

func main() {
	// Interfaces: heterogeneous, open to extension.
	greetAll([]Greeter{english{}, french{}})

	// Generics: homogeneous, type-safe, closed to extension.
	m, ok := maxOf([]int{3, 9, 4})
	fmt.Println("max:", m, ok)

	// The standard library's generic helpers.
	xs := []string{"pear", "apple", "fig"}
	slices.Sort(xs)
	fmt.Println("sorted:", xs)
	fmt.Println("contains fig:", slices.Contains(xs, "fig"))

	// slices.SortFunc for a custom ordering.
	type person struct {
		name string
		age  int
	}
	people := []person{{"bo", 40}, {"al", 30}}
	slices.SortFunc(people, func(a, b person) int {
		return a.age - b.age
	})
	fmt.Println("by age:", people)

	// maps.Keys returns an iterator (Go 1.23+).
	counts := map[string]int{"a": 1, "b": 2}
	keys := slices.Sorted(maps.Keys(counts))
	fmt.Println("sorted keys:", keys)

	// A smell: a generic that immediately asserts its parameter back to any.
	fmt.Println(strings.ToUpper("done"))
}
`,
  gotcha: `If your generic function's body immediately converts its type
parameter back to \`any\` — or asserts it to a concrete type — the generic bought
you nothing. An interface is the simpler tool at that point.`,
};

export const errorInterface: Lesson = {
  slug: 'error-interface',
  title: 'The `error` interface, sentinels & `errors.Is`/`As`',
  sectionId: 'errors',
  order: 31,
  runMode: 'playground',
  body: `\`error\` is an interface with one method:

\`\`\`go
type error interface {
    Error() string
}
\`\`\`

Any type with an \`Error() string\` method is an error. Returning \`nil\` from a
function whose result type is \`error\` means "no error" — the interface is
genuinely nil because both its type and value are nil.

**Sentinel errors** are package-level values you compare against:

\`\`\`go
var ErrNotFound = errors.New("not found")

if errors.Is(err, ErrNotFound) { ... }
\`\`\`

Prefer \`errors.Is\` over \`==\`. \`errors.Is\` unwraps the error chain, so it
works even when the error has been wrapped. Use \`==\` only for sentinel values
you know were never wrapped.

**\`errors.As\`** finds the first error in the chain that matches a type:

\`\`\`go
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println("failed at:", pathErr.Path)
}
\`\`\`

The second argument must be a pointer to a type that implements \`error\`. It
is the idiom for pulling structured information out of an error chain.

**Custom error types** should carry structured data, not just a message:

\`\`\`go
type ValidationError struct {
    Field string
    Reason string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("field %s: %s", e.Field, e.Reason)
}
\`\`\`

**Always check the error.** A nil error is the only success signal; there is no
error code to inspect.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
	"os"
)

// A sentinel error.
var ErrNotFound = errors.New("not found")

// A custom error type carrying structured data.
type ValidationError struct {
	Field  string
	Reason string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("field %q: %s", e.Field, e.Reason)
}

func find(id int) error {
	if id < 0 {
		return fmt.Errorf("find %d: %w", id, ErrNotFound)
	}
	if id == 0 {
		return &ValidationError{Field: "id", Reason: "must not be zero"}
	}
	return nil
}

func main() {
	// errors.Is unwraps the chain.
	err := find(-1)
	fmt.Println("err:", err)
	fmt.Println("errors.Is ErrNotFound:", errors.Is(err, ErrNotFound))
	fmt.Println("errors.Is ErrValidation:", errors.Is(err, &ValidationError{Field: "id", Reason: "x"}))

	// errors.As pulls a typed error out of the chain.
	verr := find(0)
	var ve *ValidationError
	if errors.As(verr, &ve) {
		fmt.Println("as ValidationError — field:", ve.Field, "reason:", ve.Reason)
	}

	// errors.As can also find the standard library's types.
	_, statErr := os.Stat("this-file-does-not-exist")
	var pathErr *os.PathError
	if errors.As(statErr, &pathErr) {
		fmt.Println("os.PathError op:", pathErr.Op, "path:", pathErr.Path)
	}

	// errors.Join combines several errors (Go 1.20+).
	joined := errors.Join(ErrNotFound, &ValidationError{Field: "name", Reason: "required"})
	fmt.Println("joined:", joined)
	fmt.Println("joined Is ErrNotFound:", errors.Is(joined, ErrNotFound))

	// A nil error is the only success signal.
	fmt.Println("find(1):", find(1) == nil)
}
`,
  gotcha: `Compare errors with \`errors.Is\`, not \`==\`. \`==\` fails as soon as
the error has been wrapped with \`%w\`, which is exactly the case where you most
want to recognise it.`,
};

export const errorWrapping: Lesson = {
  slug: 'error-wrapping',
  title: 'Wrapping errors with `%w`',
  sectionId: 'errors',
  order: 32,
  runMode: 'playground',
  body: `When a function returns an error from something else, **wrap it** rather
than replacing it:

\`\`\`go
func readConfig(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("read config %s: %w", path, err)
    }
    return data, nil
}
\`\`\`

\`%w\` does two things: it formats the error into the message *and* it records
the original error so \`errors.Is\` and \`errors.As\` can find it later.

Without \`%w\`, the chain is broken — the caller sees only the outer message
and can no longer recognise the underlying sentinel error.

**\`%v\` formats without wrapping.** Use \`%v\` when you want the text but do
not want the chain — usually when logging, where you are about to print the
message anyway.

**Wrapping adds context at every layer.** The convention is that the message
reads as a sentence fragment that the caller will prefix with its own:

\`\`\`go
fmt.Errorf("load config: %w", err)
fmt.Errorf("load config %s: %w", path, err)
\`\`\`

The final error a user sees might be:
\`load config /etc/app.yaml: open /etc/app.yaml: permission denied\` — each
layer contributed one clause.

**\`errors.Join\`** combines multiple errors into one, preserving each of them
in the chain. It is the right tool for validation that checks several fields
at once.

**One error, one return path.** Go does not have exceptions, so every failure
must be returned explicitly. \`if err != nil { return err }\` appears
constantly, and that is the design, not a wart.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
	"os"
)

var ErrNotFound = errors.New("not found")

// A low-level function that wraps.
func readFile(path string) ([]byte, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read %s: %w", path, err)
	}
	return data, nil
}

// A middle layer that adds more context.
func loadConfig(path string) ([]byte, error) {
	data, err := readFile(path)
	if err != nil {
		return nil, fmt.Errorf("load config: %w", err)
	}
	return data, nil
}

// A layer that does NOT wrap — the chain is broken here.
func loadConfigNoWrap(path string) ([]byte, error) {
	data, err := readFile(path)
	if err != nil {
		return nil, fmt.Errorf("load config: %v", err)
	}
	return data, nil
}

func main() {
	// The message accumulates context at every layer.
	_, err := loadConfig("/etc/does-not-exist.yaml")
	fmt.Println("wrapped:  ", err)

	// errors.Is still finds the sentinel through the chain.
	fmt.Println("errors.Is ErrNotFound:", errors.Is(err, os.ErrNotExist))

	// errors.As still finds the structured error.
	var pathErr *os.PathError
	fmt.Println("errors.As PathError:", errors.As(err, &pathErr))

	// With %v the chain is broken: errors.Is no longer matches.
	_, err2 := loadConfigNoWrap("/etc/does-not-exist.yaml")
	fmt.Println("unwrapped:", err2)
	fmt.Println("errors.Is after %v:", errors.Is(err2, os.ErrNotExist))

	// errors.Join combines several errors, keeping each in the chain.
	joined := errors.Join(
		fmt.Errorf("field name: %w", ErrNotFound),
		fmt.Errorf("field age: %w", os.ErrInvalid),
	)
	fmt.Println("joined:", joined)
	fmt.Println("joined Is ErrNotFound:", errors.Is(joined, ErrNotFound))
	fmt.Println("joined Is ErrInvalid:", errors.Is(joined, os.ErrInvalid))
}
`,
  gotcha: `\`%v\` formats the error but drops it from the chain. Use \`%w\` when
the caller might want to inspect the cause with \`errors.Is\` or \`errors.As\`;
use \`%v\` only when you are about to log the message anyway.`,
};

export const panicRecover: Lesson = {
  slug: 'panic-recover',
  title: '`panic` & `recover` — and why panic is not exception handling',
  sectionId: 'errors',
  order: 33,
  runMode: 'playground',
  body: `**Panic is not exception handling.** It is an assertion that the program
cannot continue: a bug, an impossible state, or a failure the caller genuinely
cannot handle. Go's error returns cover everything else.

A panic stops the current goroutine and unwinds the stack, running deferred
calls as it goes. If nothing recovers, the program exits with a stack trace.

\`\`\`go
panic("something impossible happened")
panic(fmt.Errorf("bad state: %d", n))
panic(err)   // re-panicking a non-nil error
\`\`\`

**\`recover\`** only works when called directly from a deferred function of the
panicking goroutine. That is the whole mechanism:

\`\`\`go
func safe() (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    // ... code that might panic
    return nil
}
\`\`\`

**When to panic:**

- Programming errors that should never happen — an impossible switch case, a
  violated invariant.
- **Initialisation** of a package that cannot work without something.
  \`panic("failed to init")\` in an \`init\` function is the standard pattern.
- A library with no way to report the error without inventing a bad API —
  rare, and usually a sign the API is wrong.

**When not to panic:**

- Any error the caller could reasonably handle. Return it.
- Anything on a request path. A panic in a handler kills the goroutine; in a
  server without a recovery middleware it takes down the process.

**Recover** at a boundary — the top of a goroutine, an HTTP handler, a worker
loop — and convert the panic into an error. Do not recover in the middle of
your code: a recovered panic leaves the program in an unknown state, and
swallowing it hides the bug.

\`panic(nil)\` became a \`runtime.PanicNilError\` in Go 1.21, so a bare
\`recover() != nil\` check is now the correct pattern.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
)

var ErrBoom = errors.New("boom")

// A function that recovers at the boundary and converts to an error.
func safe(fn func()) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("recovered: %v", r)
		}
	}()
	fn()
	return nil
}

// A panic with a value.
func mustPositive(n int) {
	if n <= 0 {
		panic(fmt.Sprintf("n must be positive, got %d", n))
	}
	fmt.Println("n is fine:", n)
}

// A panic with an error value.
func mustConfig() {
	panic(ErrBoom)
}

func main() {
	// A panic that is recovered at the boundary.
	err := safe(func() { mustPositive(-1) })
	fmt.Println("recovered as error:", err)

	// A panic carrying an error value.
	err = safe(func() { mustConfig() })
	fmt.Println("recovered panic error:", err)

	// errors.Is works on the recovered value if it was an error.
	var recovered error
	_ = safe(func() {
		defer func() {
			if r := recover(); r != nil {
				if e, ok := r.(error); ok {
					recovered = e
				}
			}
		}()
		mustConfig()
	})
	fmt.Println("recovered error value:", recovered)
	fmt.Println("errors.Is ErrBoom:", errors.Is(recovered, ErrBoom))

	// A panic in a *different* goroutine cannot be recovered by the parent.
	// It crashes the whole program:
	// go func() { panic("in a goroutine") }()

	fmt.Println("done")
}
`,
  gotcha: `A panic in a goroutine that nobody recovers takes down the entire
program — not just that goroutine. Always recover at the top of a goroutine you
start, or use a defer/recover in every worker.`,
};

/**
 * The lessons in this file, keyed by slug. The lazy loader imports the
 * section chunk and reads this record, so a lesson never has to be
 * reachable by a hard-coded switch — and the key comes from the lesson
 * itself, so the two can never drift apart.
 */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [
    interfaces,
    typeAssertions,
    embedding,
    stdlibInterfaces,
    generics,
    constraints,
    whenNotGenerics,
    errorInterface,
    errorWrapping,
    panicRecover,
  ].map((lesson) => [lesson.slug, lesson])
);
