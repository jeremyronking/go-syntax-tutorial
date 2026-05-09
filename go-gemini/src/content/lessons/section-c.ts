import type { Lesson } from '../types'

export const sectionCLessons: Lesson[] = [
  {
    slug: 'arrays',
    title: '15. Arrays',
    section: 'Section C: Composite types',
    order: 15,
    runMode: 'playground',
    body: `
The type \`[n]T\` is an array of \`n\` values of type \`T\`.

An array's length is part of its type, so arrays cannot be resized. In Go, arrays are **values**. Assigning one array to another copies all the elements. In particular, if you pass an array to a function, it will receive a copy of the array, not a pointer to it.
    `,
    starterCode: `package main

import "fmt"

func main() {
    var a [2]string
    a[0] = "Hello"
    a[1] = "World"
    fmt.Println(a[0], a[1])
    fmt.Println(a)

    primes := [6]int{2, 3, 5, 7, 11, 13}
    fmt.Println(primes)
}`,
  },
  {
    slug: 'slices',
    title: '16. Slices',
    section: 'Section C: Composite types',
    order: 16,
    runMode: 'playground',
    body: `
An array has a fixed size. A **slice**, on the other hand, is a dynamically-sized, flexible view into the elements of an array. In practice, slices are much more common than arrays.

The type \`[]T\` is a slice with elements of type \`T\`.

A slice is formed by specifying two indices, a low and high bound, separated by a colon: \`a[low : high]\`. This selects a half-open range which includes the first element, but excludes the last one.

A slice does not store any data itself, it just describes a section of an underlying array. **Changing the elements of a slice modifies the corresponding elements of its underlying array.**
    `,
    gotcha: "Slice aliasing: Slices are views into an underlying array. If two slices share the same underlying array, changing an element in one will change it in the other!",
    starterCode: `package main

import "fmt"

func main() {
    names := [4]string{
        "John",
        "Paul",
        "George",
        "Ringo",
    }
    fmt.Println(names)

    // Create slices (views into the array)
    a := names[0:2]
    b := names[1:3]
    fmt.Println(a, b)

    // Modifying a slice changes the underlying array
    b[0] = "XXX"
    fmt.Println(a, b)
    fmt.Println(names)
    
    // Append
    var s []int
    s = append(s, 1)
    s = append(s, 2, 3, 4)
    fmt.Println("Appended slice:", s)
}`,
  },
  {
    slug: 'maps',
    title: '17. Maps',
    section: 'Section C: Composite types',
    order: 17,
    runMode: 'playground',
    body: `
A map maps keys to values. The zero value of a map is \`nil\`. A \`nil\` map has no keys, nor can keys be added.

The \`make\` function returns a map of the given type, initialized and ready for use.

You can insert or update elements, retrieve them, and delete them using the \`delete\` built-in. To test if a key is present with a two-value assignment, use the **comma ok** idiom.
    `,
    starterCode: `package main

import "fmt"

func main() {
    m := make(map[string]int)

    m["Answer"] = 42
    fmt.Println("The value:", m["Answer"])

    m["Answer"] = 48
    fmt.Println("The value:", m["Answer"])

    delete(m, "Answer")
    fmt.Println("The value:", m["Answer"])

    // The "comma ok" idiom
    v, ok := m["Answer"]
    fmt.Println("The value:", v, "Present?", ok)
    
    // Map literal
    ages := map[string]int{
        "Alice": 30,
        "Bob":   25,
    }
    fmt.Println("Ages:", ages)
}`,
  },
  {
    slug: 'structs',
    title: '18. Structs',
    section: 'Section C: Composite types',
    order: 18,
    runMode: 'playground',
    body: `
A \`struct\` is a collection of fields.

Struct fields are accessed using a dot. You can also name the fields when initializing a struct using a **struct literal**.

If a struct's fields are all comparable, the struct itself is comparable and can be used as a map key. Structs can also have **anonymous fields** to compose types.
    `,
    starterCode: `package main

import "fmt"

type Vertex struct {
    X int
    Y int
}

func main() {
    v := Vertex{1, 2}
    v.X = 4
    fmt.Println(v.X)
    
    // Struct literals
    var (
        v1 = Vertex{1, 2}  // has type Vertex
        v2 = Vertex{X: 1}  // Y:0 is implicit
        v3 = Vertex{}      // X:0 and Y:0
        p  = &Vertex{1, 2} // has type *Vertex
    )
    fmt.Println(v1, p, v2, v3)
}`,
  },
  {
    slug: 'pointers',
    title: '19. Pointers',
    section: 'Section C: Composite types',
    order: 19,
    runMode: 'playground',
    body: `
Go has pointers. A pointer holds the memory address of a value. The type \`*T\` is a pointer to a \`T\`. Its zero value is \`nil\`.

The \`&\` operator generates a pointer to its operand. The \`*\` operator denotes the pointer's underlying value (dereferencing).

Unlike C, Go has no pointer arithmetic.

Below is the Checkpoint for Section C.
    `,
    starterCode: `package main

import "fmt"

type Vertex struct {
    X, Y int
}

func main() {
    i, j := 42, 2701

    p := &i         // point to i
    fmt.Println(*p) // read i through the pointer
    *p = 21         // set i through the pointer
    fmt.Println(i)  // see the new value of i

    p = &j         // point to j
    *p = *p / 37   // divide j through the pointer
    fmt.Println(j) // see the new value of j
    
    // Pointer to struct
    v := Vertex{1, 2}
    vp := &v
    vp.X = 1e9 // Go allows vp.X instead of (*vp).X
    fmt.Println(v)
}`,
    checkpoint: {
      id: 'checkpoint-c',
      questions: [
        {
          id: 'cp-c-1',
          prompt: 'Which type has a fixed size in Go?',
          type: 'mcq',
          options: ['Array', 'Slice', 'Map', 'String'],
          correctIndex: 0,
          explanation: 'Arrays have a fixed size (the length is part of their type). Slices and maps can grow.'
        },
        {
          id: 'cp-c-2',
          prompt: 'What happens if two slices share the same underlying array and you modify an element in one of the slices?',
          type: 'mcq',
          options: ['Only the modified slice changes', 'The other slice also changes', 'The compiler throws an error', 'The program panics'],
          correctIndex: 1,
          explanation: 'Slices are just views. Modifying the underlying data affects all slices that view that data.'
        },
        {
          id: 'cp-c-3',
          prompt: 'What is the zero value of a map?',
          type: 'mcq',
          options: ['nil', 'An empty map', 'undefined', '0'],
          correctIndex: 0,
          explanation: 'The zero value of a map is nil. A nil map has no keys, and you cannot add keys to it without making it first.'
        },
        {
          id: 'cp-c-4',
          prompt: 'Does Go support pointer arithmetic (like `ptr++`)?',
          type: 'mcq',
          options: ['Yes', 'No'],
          correctIndex: 1,
          explanation: 'Go intentionally omits pointer arithmetic for safety and simplicity.'
        },
        {
          id: 'cp-c-5',
          prompt: 'In a struct literal, what happens to fields you omit?',
          type: 'mcq',
          options: ['They are set to nil', 'They are set to their zero value', 'They cause a compilation error', 'They are undefined'],
          correctIndex: 1,
          explanation: 'Unspecified fields in a struct literal are implicitly set to their zero values (e.g., 0, "", false).'
        }
      ]
    }
  }
]
