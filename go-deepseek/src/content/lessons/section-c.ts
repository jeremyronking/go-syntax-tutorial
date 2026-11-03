import type { Lesson } from '../types';

const arrays: Lesson = {
  slug: 'arrays',
  title: 'Arrays: fixed length, value semantics',
  sectionId: 'composite-types',
  order: 15,
  runMode: 'playground',
  body: `An array's length is part of its type: \`[3]int\` and \`[4]int\` are unrelated. Assignment and function passing copy the whole array, which makes arrays predictable and occasionally expensive.

Literal sizes can be inferred with \`[...]int{...}\`. In practice you will use slices for almost everything and arrays when the fixed size is the point — buffers, lookup tables, keys.`,
  starterCode: `package main

import "fmt"

func mutate(a [3]int) {
	a[0] = 100
}

func main() {
	a := [3]int{1, 2, 3}
	b := a
	b[0] = 9
	fmt.Println(a, b)

	mutate(a)
	fmt.Println("after call:", a)

	grid := [2][2]int{{1, 2}, {3, 4}}
	fmt.Println(grid, len(grid))
}
`,
  gotcha:
    'Arrays are values. Passing one to a function copies it; changing the copy does nothing to the original. Use a slice or a pointer when you mean to share.',
};

const slices: Lesson = {
  slug: 'slices',
  title: 'Slices: header, append, aliasing',
  sectionId: 'composite-types',
  order: 16,
  runMode: 'playground',
  body: `A slice is a three-word header: pointer, length, capacity. Slicing does not copy — it produces a new header over the same backing array. \`append\` writes into spare capacity when it can, and allocates a new array when it cannot.

Three-index slicing \`s[low:high:max]\` pins capacity so an append cannot reach into the parent's tail. \`copy\` moves elements and returns how many it moved.`,
  starterCode: `package main

import "fmt"

func main() {
	a := []int{1, 2, 3}
	b := a[:2]
	b[0] = 99
	fmt.Println("shared:", a, b)

	c := append(b, 100)
	fmt.Println("append wrote into a:", a, c)

	guarded := a[0:2:2]
	d := append(guarded, 7)
	fmt.Println("three-index protects a:", a, d)

	e := make([]int, 2)
	fmt.Println("copied:", copy(e, a), e)
}
`,
  gotcha:
    'Appending to a subslice can overwrite the parent when capacity remains. `b := a[:2]; append(b, x)` writes `a[2]`. Three-index slicing (`a[0:2:2]`) prevents it.',
};

const maps: Lesson = {
  slug: 'maps',
  title: 'Maps: nil, comma-ok, deletion, order',
  sectionId: 'composite-types',
  order: 17,
  runMode: 'playground',
  body: `A map's zero value is nil. Reading from a nil map is fine and returns the zero value; writing to one panics. \`make\` or a literal allocates it.

Lookups use the comma-ok form to distinguish "missing" from "present but zero." \`delete\` is a no-op on missing keys. Iteration order is deliberately randomized, so anything order-sensitive needs an explicit sort.`,
  starterCode: `package main

import (
	"fmt"
	"sort"
)

func main() {
	var m map[string]int
	fmt.Println("nil read:", m["x"], len(m))

	m = make(map[string]int)
	m["a"] = 1
	m["b"] = 2

	if v, ok := m["a"]; ok {
		fmt.Println("found", v)
	}
	if v, ok := m["z"]; !ok {
		fmt.Println("missing, zero:", v)
	}

	delete(m, "b")
	delete(m, "never")

	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	fmt.Println(keys)
}
`,
  gotcha:
    'Writing to a nil map panics at runtime — `var m map[string]int; m["x"] = 1`. Declaring with `map[string]int{}` or `make` avoids it.',
};

const structs: Lesson = {
  slug: 'structs',
  title: 'Structs: literals, tags, embedding',
  sectionId: 'composite-types',
  order: 18,
  runMode: 'playground',
  body: `Structs group named fields. Keyed literals are stable; unkeyed literals break when fields move. Field tags are strings the reflection and encoding packages read; they do not affect the type system.

Anonymous fields embed a type and promote its fields and methods. Embedding is composition, not inheritance — the outer type still has its own method set.`,
  starterCode: `package main

import (
	"fmt"
	"reflect"
)

type Animal struct {
	Name string
}

func (a Animal) Speak() string { return a.Name + " speaks" }

type Dog struct {
	Animal
	Breed string
}

type User struct {
	Name string \`json:"name"\`
	Age  int    \`json:"age,omitempty"\`
}

func main() {
	u := User{Name: "Ada", Age: 36}
	fmt.Println(u)

	field, _ := reflect.TypeOf(u).FieldByName("Name")
	fmt.Println("tag:", field.Tag.Get("json"))

	d := Dog{Animal: Animal{Name: "Rex"}, Breed: "collie"}
	fmt.Println(d.Speak(), d.Name)
	fmt.Println(Animal{"Rex"} == Animal{"Rex"})
}
`,
  gotcha:
    'A struct is comparable only if all its fields are. Adding a slice or map field makes `==` a compile error for the whole struct.',
};

const pointers: Lesson = {
  slug: 'pointers',
  title: 'Pointers: no arithmetic, new, address-of',
  sectionId: 'composite-types',
  order: 19,
  runMode: 'playground',
  body: `A pointer holds an address; \`&\` takes one and \`*\` dereferences. Go pointers support no arithmetic — you cannot walk an array with \`p++\`. \`new(T)\` allocates a zeroed T and returns *T.

Struct pointers auto-dereference for field access: \`p.X\` means \`(*p).X\`. You can take the address of a composite literal, which is the idiomatic way to get a pointer to a small struct.`,
  starterCode: `package main

import "fmt"

type Point struct{ X, Y int }

func scale(p *Point, by int) {
	p.X *= by
	p.Y *= by
}

func main() {
	p := &Point{X: 1, Y: 2}
	scale(p, 3)
	fmt.Println(*p, p.X)

	n := new(int)
	fmt.Println("new int:", *n)
	*n = 5

	q := &Point{7, 8}
	fmt.Println(q.Y)
}
`,
  gotcha:
    'Dereferencing a nil pointer panics. `var p *Point; p.X = 1` crashes — allocate first with `&Point{}` or `new(Point)`.',
};

export const sectionCLessons: Lesson[] = [
  arrays,
  slices,
  maps,
  structs,
  pointers,
  {
    slug: 'section-c-checkpoint',
    title: 'Section C checkpoint',
    sectionId: 'composite-types',
    order: 19.5,
    runMode: 'annotated',
    body: 'Five questions on arrays vs slices, aliasing, nil maps, struct comparability, and pointer behavior.',
    checkpoint: {
      id: 'checkpoint-composite-types',
      sectionId: 'composite-types',
      title: 'Composite types checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt:
            'What does this print?\n\n`a := []int{1, 2, 3}; b := a[:2]; b[0] = 9; c := append(b, 4); fmt.Println(a, c)`',
          options: [
            '[1 2 3] [9 2 4]',
            '[9 2 3] [9 2 4]',
            '[9 2 4] [9 2 4]',
            '[1 2 3] [9 2 3 4]',
          ],
          correctIndex: 2,
          explanation:
            'b shares a backing array with a, so b[0]=9 changes a[0]; append writes into a[2] because b has spare capacity, changing both.',
        },
        {
          kind: 'mcq',
          prompt: 'Which of these is legal?',
          options: [
            'var m map[string]int; m["x"] = 1',
            'var m map[string]int; _ = m["x"]',
            'var a [3]int; a = append(a, 1)',
            'var s []int; s[0] = 1',
          ],
          correctIndex: 1,
          explanation:
            'Reading a nil map is safe; writing to it panics. Arrays do not take append, and writing index 0 of a nil slice panics.',
        },
        {
          kind: 'fill',
          prompt: 'Which function returns both a map value and a boolean presence flag? (name the idiom)',
          acceptedAnswers: ['comma-ok', 'comma ok', 'comma, ok'],
          explanation:
            '`v, ok := m[k]` is the comma-ok idiom; ok distinguishes a missing key from a stored zero value.',
        },
        {
          kind: 'mcq',
          prompt: 'Adding a `[]string` field to a struct makes the struct...',
          options: [
            'Still comparable with ==',
            'Not comparable with ==',
            'Comparable only field by field',
            'A compile error at declaration',
          ],
          correctIndex: 1,
          explanation:
            'Struct comparability requires every field to be comparable; slices are not, so the struct is not.',
        },
        {
          kind: 'mcq',
          prompt: '`p := new(Point)` where `type Point struct{ X, Y int }`. What is `*p`?',
          options: ['nil', 'Point{0, 0}', 'undefined until assigned', 'a compile error'],
          correctIndex: 1,
          explanation:
            'new(T) allocates a zeroed T, so the pointed-to struct has all-zero fields.',
        },
      ],
    },
  },
];
