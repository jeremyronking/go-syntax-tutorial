import type { Lesson } from '../types';

export const arrays: Lesson = {
  slug: 'arrays',
  title: 'Arrays: fixed length, value semantics',
  sectionId: 'composite-types',
  order: 15,
  runMode: 'playground',
  body: `An array is a fixed-length sequence of values of a single type. The length is
part of the type: \`[3]int\` and \`[4]int\` are different types, and neither is
assignable to the other.

\`\`\`go
var a [3]int          // zero value: [0 0 0]
b := [3]int{1, 2, 3}  // composite literal
c := [3]int{1, 2}     // trailing elements are zeroed
d := [...]int{1, 2, 3} // [...] infers the length
\`\`\`

**Arrays are values.** Assigning an array copies every element:

\`\`\`go
a := [3]int{1, 2, 3}
b := a
b[0] = 99
fmt.Println(a[0]) // 1 — a is unaffected
\`\`\`

The same is true when you pass an array to a function: the function gets a copy.
For a large array that is an expensive copy, which is why arrays are usually
passed as pointers (\`*[3]int\`) or — far more often — you use a slice instead.

Array elements are addressable, so you can take the address of one and get a
pointer into the array:

\`\`\`go
p := &a[1]
*p = 20
\`\`\`

The built-in \`len\` works on arrays, and so does \`range\`. Because the length is
fixed at compile time, the compiler can often unroll or vectorise the loop.

Go's arrays are rarely what you reach for in application code — slices are
almost always the better choice. Arrays earn their keep in fixed-size binary
records, in hash keys, and when you specifically want value semantics.`,
  starterCode: `package main

import "fmt"

func main() {
	// The zero value of an array is all zeroes.
	var a [3]int
	fmt.Println("zero:", a)

	// Composite literals. Trailing elements are zeroed.
	b := [3]int{1, 2, 3}
	c := [3]int{1, 2}
	d := [...]string{"x", "y", "z", "w"}
	fmt.Println("b:", b, "c:", c, "d:", d)

	// len works, and the length is part of the type.
	fmt.Println("len(d):", len(d))

	// Arrays are values: assignment copies.
	e := b
	e[0] = 99
	fmt.Println("b[0] after copy mutated:", b[0], "e[0]:", e[0])

	// Elements are addressable, so you can point into the array.
	p := &b[1]
	*p = 20
	fmt.Println("b after pointer write:", b)

	// range over an array.
	for i, v := range b {
		fmt.Printf("%d:%d ", i, v)
	}
	fmt.Println()

	// A 2-D array is an array of arrays.
	var grid [2][3]int
	grid[1][2] = 7
	fmt.Println("grid:", grid)
}
`,
  gotcha: `Because the length is part of the type, \`[3]int\` and \`[4]int\` are
unrelated types — you cannot assign one to the other, and a function expecting
\`[3]int\` will not accept a \`[4]int\`.`,
};

export const slices: Lesson = {
  slug: 'slices',
  title: 'Slices: header, `append`, slicing & aliasing',
  sectionId: 'composite-types',
  order: 16,
  runMode: 'playground',
  body: `A slice is a small header pointing at a backing array:

\`\`\`go
type sliceHeader struct {
    ptr  *T   // where the data starts
    len  int  // how many elements are visible
    cap  int  // how many are reachable from ptr
}
\`\`\`

Two slices over the same backing array share memory. That is the whole point of
the design — it lets you pass a window of a larger buffer without copying — and
it is also the source of the classic Go bug.

**Slicing shares the backing array.**

\`\`\`go
a := []int{1, 2, 3, 4, 5}
b := a[1:3]      // len 2, cap 4
b[0] = 99
fmt.Println(a)   // [99 2 3 4 5] — a changed too!
\`\`\`

**\`append\` may or may not copy.** If there is room in the capacity, \`append\`
writes into the existing backing array; if not, it allocates a new one and
copies. You cannot tell which from the call site, so never rely on either
behaviour.

\`\`\`go
a := make([]int, 2, 4)
a = append(a, 3)   // writes into the existing array — no copy
\`\`\`

**The three-index slice** \`a[low:high:max]\` caps the capacity, which forces
\`append\` to copy instead of overwriting neighbouring data:

\`\`\`go
b := a[:2:2]        // len 2, cap 2
b = append(b, 99)   // must copy — a is untouched
\`\`\`

\`copy\` copies elements and returns the number copied. It does not shrink the
destination, so clear it yourself if that matters.

A nil slice is usable: \`len\` is 0, \`range\` over it does nothing, and
\`append\` to it allocates.`,
  starterCode: `package main

import "fmt"

func main() {
	// A slice header points at a backing array.
	a := []int{1, 2, 3, 4, 5}
	fmt.Println("a:", a, "len:", len(a), "cap:", cap(a))

	// Slicing shares the backing array.
	b := a[1:3]
	fmt.Println("b:", b, "len:", len(b), "cap:", cap(b))

	// Writing through b is visible in a — the aliasing trap.
	b[0] = 99
	fmt.Println("a after writing to b:", a)

	// append reuses the spare capacity when there is room.
	c := make([]int, 2, 4)
	c = append(c, 3)
	fmt.Println("c:", c, "len:", len(c), "cap:", cap(c))

	// The three-index slice caps capacity, forcing append to copy.
	d := a[:2:2]
	fmt.Println("d:", d, "len:", len(d), "cap:", cap(d))
	d = append(d, 777)
	fmt.Println("d after append:", d)
	fmt.Println("a is untouched:", a)

	// copy copies elements and returns how many were copied.
	e := []int{1, 2, 3}
	f := make([]int, 2)
	n := copy(f, e)
	fmt.Println("copied:", n, "f:", f)

	// A nil slice is perfectly usable.
	var nilSlice []int
	fmt.Println("nil slice len:", len(nilSlice), "cap:", cap(nilSlice))
	for range nilSlice {
		fmt.Println("never")
	}
	nilSlice = append(nilSlice, 1)
	fmt.Println("after append:", nilSlice)
}
`,
  gotcha: `Slices alias. \`b := a[1:3]\` does not copy — writing to \`b\` writes
into \`a\`'s backing array. And \`append\` only copies when it has to: if the
capacity allows, it writes straight into the shared array, so two slices that
overlap can corrupt each other. Use the three-index form \`a[:2:2]\` to force a
copy.`,
};

export const maps: Lesson = {
  slug: 'maps',
  title: 'Maps: nil, comma-ok, deletion & random iteration',
  sectionId: 'composite-types',
  order: 17,
  runMode: 'playground',
  body: `A map is a hash table. Its key type must be comparable — \`string\`,
the numeric types, \`bool\`, pointers, channels, interfaces, and structs or
arrays whose fields are all comparable. Slices, maps and functions are not
comparable and cannot be keys.

**The zero value of a map is nil.** A nil map is safe to read from and safe to
\`range\` over, but writing to it panics. Always make the map:

\`\`\`go
counts := make(map[string]int)
\`\`\`

**Reading a missing key gives the zero value**, and you cannot tell "missing"
from "present and zero" without the comma-ok form:

\`\`\`go
n := counts["missing"]   // 0
n, ok := counts["missing"]  // 0, false
\`\`\`

**Deletion** is \`delete(m, key)\`. Deleting a key that is not there is a no-op.

**Iteration order is random.** Go deliberately randomises the starting bucket, so
two runs of the same program can visit the keys in different orders. If you need
deterministic output, collect the keys and sort them.

Maps are reference types under the hood: passing a map to a function passes the
same map, and a function can mutate the caller's map. That is different from
slices — which also share a backing array — and different from arrays, which
copy.

Maps grow on their own, but they never shrink. A long-lived map that saw a
million keys keeps that memory.`,
  starterCode: `package main

import (
	"fmt"
	"sort"
)

func main() {
	// The zero value is nil — reading is fine, writing panics.
	var nilMap map[string]int
	fmt.Println("read from nil map:", nilMap["missing"], "len:", len(nilMap))
	for range nilMap {
		fmt.Println("never")
	}
	// nilMap["x"] = 1  // panic: assignment to entry in nil map

	// Make the map.
	counts := make(map[string]int)
	counts["go"] = 1
	counts["rust"] = 1
	counts["go"]++

	// Comma-ok distinguishes "missing" from "present and zero".
	fmt.Println("go:", counts["go"])
	n, ok := counts["missing"]
	fmt.Println("missing:", n, "present:", ok)
	n2, ok2 := counts["go"]
	fmt.Println("go:", n2, "present:", ok2)

	// Deletion.
	delete(counts, "rust")
	fmt.Println("after delete:", counts, "len:", len(counts))

	// Iteration order is random — sort the keys for stable output.
	scores := map[string]int{"a": 3, "b": 1, "c": 2}
	keys := make([]string, 0, len(scores))
	for k := range scores {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Printf("%s=%d ", k, scores[k])
	}
	fmt.Println()

	// Maps are reference types: the callee mutates the caller's map.
	bump(counts, "go")
	fmt.Println("after bump:", counts["go"])
}

func bump(m map[string]int, k string) {
	m[k]++
}
`,
  gotcha: `A nil map panics on write, not on read — "assignment to entry in nil
map". Create it with \`make\` at the point of declaration rather than guarding
every write with a nil check.`,
};

export const structs: Lesson = {
  slug: 'structs',
  title: 'Structs: literals, tags, embedding & comparability',
  sectionId: 'composite-types',
  order: 18,
  runMode: 'playground',
  body: `A struct is a typed collection of fields. Fields are laid out in memory in
declaration order, with padding added to keep the alignment right — reorder the
fields and the size changes.

\`\`\`go
type Point struct {
    X, Y int
    Name string
}
\`\`\`

**Composite literals** are positional or keyed. Prefer keyed literals: they
survive reordering and adding fields.

\`\`\`go
p := Point{1, 2}              // positional — fragile
p := Point{X: 1, Y: 2, Name: "a"} // keyed — safe
p := Point{X: 1}              // unmentioned fields are zeroed
\`\`\`

**Field tags** are metadata attached to a field, read via reflection:

\`\`\`go
type User struct {
    Name string \`json:"name"\`
    Age  int    \`json:"age,omitempty"\`
}
\`\`\`

**Embedded fields** (an anonymous field) promote the embedded type's fields and
methods to the outer struct:

\`\`\`go
type Base struct{ ID int }
type User struct {
    Base
    Name string
}
u := User{Base: Base{ID: 1}, Name: "a"}
fmt.Println(u.ID)     // promoted
u.ID = 2             // promoted
\`\`\`

**Comparability:** a struct is comparable if all of its fields are comparable.
A struct containing a slice or a map is not, and cannot be used as a map key
or compared with \`==\`.

**Zero value:** a struct's zero value is the zero value of every field, and it
is often directly usable — no constructor required.

Slices and maps are reference-like inside a struct, so a struct containing them
behaves like a shallow copy when assigned.`,
  starterCode: `package main

import (
	"fmt"
	"reflect"
)

type User struct {
	Name string \`json:"name"\`
	Age  int    \`json:"age,omitempty"\`
}

// An embedded field promotes the inner type's fields and methods.
type Base struct {
	ID int
}

func (b Base) Describe() string {
	return fmt.Sprintf("base %d", b.ID)
}

type Admin struct {
	Base
	Name string
}

func main() {
	// Keyed literal — safe against reordering and new fields.
	u := User{Name: "ada", Age: 36}
	fmt.Println(u)

	// Unmentioned fields are zeroed.
	p := User{Name: "bob"}
	fmt.Println("age:", p.Age)

	// Positional literals are allowed but fragile.
	q := User{"carol", 41}
	fmt.Println(q)

	// Field tags are visible through reflection.
	t := reflect.TypeOf(User{})
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		fmt.Printf("field %s tag=%q\\n", f.Name, f.Tag.Get("json"))
	}

	// Embedded fields are promoted.
	a := Admin{Base: Base{ID: 7}, Name: "root"}
	fmt.Println("promoted ID:", a.ID, "name:", a.Name)
	a.ID = 8
	fmt.Println("after write:", a.Base.ID, a.Describe())

	// Structs with comparable fields can be compared and used as map keys.
	type Point struct{ X, Y int }
	p1 := Point{1, 2}
	p2 := Point{1, 2}
	fmt.Println("equal:", p1 == p2)

	seen := map[Point]string{{1, 2}: "origin"}
	fmt.Println("map key:", seen[Point{1, 2}])

	// A struct containing a slice is not comparable.
	type Bag struct{ Items []int }
	// fmt.Println(Bag{Items: []int{1}} == Bag{Items: []int{1}}) // compile error
	fmt.Println("structs with slices cannot be compared with ==")
}
`,
  gotcha: `A struct containing a slice or a map is not comparable, so it cannot be
used as a map key and \`==\` on it is a compile error. Structs are also copied
shallowly: copying a struct that holds a slice copies the slice header, not the
elements.`,
};

export const pointers: Lesson = {
  slug: 'pointers',
  title: 'Pointers: no arithmetic, `new`, and addressability',
  sectionId: 'composite-types',
  order: 19,
  runMode: 'playground',
  body: `A pointer is an address. \`*T\` is "a pointer to a T", and \`&x\` takes the
address of \`x\`.

Go pointers cannot do arithmetic. There is no \`ptr + 1\`, no \`ptr++\`. If you
need offsets, index into an array or slice instead — and that is usually what
you wanted anyway, because pointer arithmetic in C is how buffer overflows
happen.

\`new(T)\` allocates a zeroed \`T\` and returns a pointer to it:

\`\`\`go
p := new(int)
*p = 42
fmt.Println(*p)   // 42
\`\`\`

In practice you rarely call \`new\` directly. The idiomatic form is to take the
address of a local:

\`\`\`go
x := 42
p := &x
*p = 7
fmt.Println(x)    // 7
\`\`\`

**You cannot take the address of a constant or of a function result.** You *can*
take the address of a composite literal, and Go allocates for it:

\`\`\`go
p := &struct{ X int }{X: 1}
p.X = 2
\`\`\`

**The zero value of a pointer is nil.** Dereferencing a nil pointer panics, and
dereferencing it is the only way to read or write through it.

**Go is pass-by-value, always.** Passing a \`*T\` passes a copy of the pointer,
but both copies point at the same \`T\`, so the callee can mutate the caller's
value. That is the whole difference between passing \`T\` and passing \`*T\`.

A pointer to a struct is also how you avoid copying a large value on every
call, and how you express "this might be absent" (\`nil\`) versus "this is the
zero value".`,
  starterCode: `package main

import "fmt"

type Counter struct {
	n int
}

func (c *Counter) Inc() {
	c.n++
}

func main() {
	// Taking the address of a local.
	x := 42
	p := &x
	*p = 7
	fmt.Println("x:", x, "via pointer:", *p)

	// new allocates a zeroed value.
	q := new(int)
	fmt.Println("new(int):", *q)
	*q = 99
	fmt.Println("after write:", *q)

	// You can take the address of a composite literal.
	s := &struct {
		X, Y int
	}{X: 1, Y: 2}
	s.X = 10
	fmt.Println("literal pointer:", s.X, s.Y)

	// A nil pointer dereference panics.
	var np *int
	// fmt.Println(*np)  // panic: invalid memory address or nil pointer dereference
	fmt.Println("nil pointer is:", np)

	// Pass-by-value: the pointer is copied, the pointee is shared.
	c := Counter{}
	c.Inc()
	c.Inc()
	fmt.Println("counter:", c.n)

	// Pointers avoid copying large values.
	type Big struct{ data [1024]byte }
	big := Big{}
	fmt.Println("big size:", len(big.data))
}
`,
  gotcha: `Go pointers support no arithmetic at all — no \`ptr + 1\`, no
\`unsafe\` tricks in ordinary code. If you find yourself wanting to move a
pointer around, index a slice instead.`,
};

/**
 * The lessons in this file, keyed by slug. The lazy loader imports the
 * section chunk and reads this record, so a lesson never has to be
 * reachable by a hard-coded switch — and the key comes from the lesson
 * itself, so the two can never drift apart.
 */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [arrays, slices, maps, structs, pointers].map((lesson) => [lesson.slug, lesson])
);
