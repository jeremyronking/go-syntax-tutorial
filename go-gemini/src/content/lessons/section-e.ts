import type { Lesson } from '../types'

export const sectionELessons: Lesson[] = [
  {
    slug: 'interfaces',
    title: '24. Interfaces, implicit satisfaction, any',
    section: 'Section E: Interfaces',
    order: 24,
    runMode: 'playground',
    body: `
An **interface type** is defined as a set of method signatures. A value of interface type can hold any value that implements those methods.

Interfaces are implemented **implicitly**. A type implements an interface by implementing its methods. There is no explicit declaration of intent, no "implements" keyword.

The interface type that specifies zero methods is known as the **empty interface**: \`interface{}\`. In Go 1.18+, the predeclared identifier \`any\` is an alias for \`interface{}\`.
An empty interface may hold values of any type.
    `,
    starterCode: `package main

import "fmt"

type Abser interface {
    Abs() float64
}

type MyFloat float64

func (f MyFloat) Abs() float64 {
    if f < 0 {
        return float64(-f)
    }
    return float64(f)
}

func main() {
    var a Abser
    f := MyFloat(-math.Sqrt2) // wait, no math package! Let's just use -1.414
    f = MyFloat(-1.414)
    a = f  // a MyFloat implements Abser
    fmt.Println(a.Abs())
    
    // The empty interface / any
    var i any = "hello"
    fmt.Println(i)
    i = 42
    fmt.Println(i)
}`,
  },
  {
    slug: 'type-assertions',
    title: '25. Type assertions & switches',
    section: 'Section E: Interfaces',
    order: 25,
    runMode: 'playground',
    body: `
A **type assertion** provides access to an interface value's underlying concrete value.

\`t := i.(T)\` asserts that the interface value \`i\` holds the concrete type \`T\` and assigns the underlying \`T\` value to the variable \`t\`.

To test whether an interface value holds a specific type, a type assertion can return two values: the underlying value and a boolean value that reports whether the assertion succeeded. This is the **"comma ok" idiom**: \`t, ok := i.(T)\`
    `,
    starterCode: `package main

import "fmt"

func main() {
    var i any = "hello"

    s := i.(string)
    fmt.Println(s)

    s, ok := i.(string)
    fmt.Println(s, ok)

    f, ok := i.(float64)
    fmt.Println(f, ok)

    // A type switch
    switch v := i.(type) {
    case string:
        fmt.Printf("%q is a string\\n", v)
    case int:
        fmt.Printf("%d is an int\\n", v)
    default:
        fmt.Printf("Unknown type %T\\n", v)
    }
}`,
  },
  {
    slug: 'embedding',
    title: '26. Embedding & method promotion',
    section: 'Section E: Interfaces',
    order: 26,
    runMode: 'playground',
    body: `
Go does not support classical inheritance, but it does support **composition** via **embedding**.

You can embed structs within structs and interfaces within interfaces. An embedded field is declared with a type but no explicit field name.

When a struct embeds another struct, the fields and methods of the embedded struct are **promoted** to the embedding struct. This allows the outer struct to call methods or access fields of the inner struct directly.
    `,
    starterCode: `package main

import "fmt"

type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return "I am " + a.Name
}

type Dog struct {
    Animal // Embedded struct
    Breed  string
}

func main() {
    d := Dog{
        Animal: Animal{Name: "Buddy"},
        Breed:  "Golden Retriever",
    }
    
    // The Speak method is promoted from Animal to Dog!
    fmt.Println(d.Speak())
    
    // The Name field is also promoted.
    fmt.Println(d.Name)
}`,
  },
  {
    slug: 'stdlib-interfaces',
    title: '27. Common stdlib interfaces',
    section: 'Section E: Interfaces',
    order: 27,
    runMode: 'playground',
    body: `
The standard library defines several interfaces that are ubiquitous in Go code:

- \`error\`: A built-in interface for describing error conditions. (More on this in Section G).
- \`fmt.Stringer\`: Implemented by any value that has a \`String() string\` method. Defines the "native" format for that value when printing.
- \`io.Reader\` / \`io.Writer\`: Essential interfaces for stream I/O. Used by files, network connections, buffers, and more.

Below is the Checkpoint for Section E.
    `,
    starterCode: `package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

// Implements fmt.Stringer
func (p Person) String() string {
    return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
}

func main() {
    a := Person{"Arthur Dent", 42}
    z := Person{"Zaphod Beeblebrox", 9001}
    
    // Println automatically calls String() because Person implements Stringer
    fmt.Println(a, z)
}`,
    checkpoint: {
      id: 'checkpoint-e',
      questions: [
        {
          id: 'cp-e-1',
          prompt: 'How do you explicitly declare that a type implements an interface?',
          type: 'mcq',
          options: ['Using the `implements` keyword', 'Using the `:` operator', 'You do not; it is implicit', 'In a `.impl` file'],
          correctIndex: 2,
          explanation: 'Interfaces are implemented implicitly. If a type has the required methods, it implements the interface.'
        },
        {
          id: 'cp-e-2',
          prompt: 'What happens if a type assertion `t := i.(T)` fails?',
          type: 'mcq',
          options: ['It returns nil', 'It returns the zero value of T', 'It panics', 'It returns an error'],
          correctIndex: 2,
          explanation: 'A single-value type assertion panics if it fails. Use the comma-ok idiom `t, ok := i.(T)` to fail gracefully.'
        },
        {
          id: 'cp-e-3',
          prompt: 'Which predeclared identifier is an alias for the empty interface `interface{}`?',
          type: 'fill',
          acceptedAnswers: ['any'],
          explanation: 'As of Go 1.18, `any` is a built-in alias for `interface{}`.'
        },
        {
          id: 'cp-e-4',
          prompt: 'When a struct `S` embeds a struct `Inner`, how can `S` call a method `Foo()` defined on `Inner`?',
          type: 'mcq',
          options: ['s.Inner.Foo() only', 's.Foo() (it is promoted)', 'S cannot call Inner methods'],
          correctIndex: 1,
          explanation: 'Methods of embedded structs are promoted to the embedding struct, so `s.Foo()` works directly.'
        }
      ]
    }
  }
]
