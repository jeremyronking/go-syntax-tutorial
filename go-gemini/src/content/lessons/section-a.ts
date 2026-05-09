import type { Lesson } from '../types'

export const sectionALessons: Lesson[] = [
  {
    slug: 'hello-world',
    title: '1. Hello, world & program structure',
    section: 'Section A: Language fundamentals',
    order: 1,
    runMode: 'playground',
    body: `
Welcome to the GoTour!

Go programs are organized into **packages**. A package is a collection of source files in the same directory that are compiled together. 
Every Go program must start with a \`package\` declaration. The \`main\` package is special—it defines a standalone executable program rather than a library.

To print to the console, we use the \`fmt\` (format) package from the standard library.

Click **Run** to execute the program.
    `,
    starterCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}`,
  },
  {
    slug: 'run-vs-build',
    title: '2. go run vs go build',
    section: 'Section A: Language fundamentals',
    order: 2,
    runMode: 'terminal',
    body: `
Unlike scripting languages, Go is a compiled language. However, it provides tools that make it feel almost as fast as a script.

* \`go build\` compiles the packages named by the import paths, along with their dependencies, but it does not install the results. It produces an executable binary.
* \`go run\` compiles and then immediately runs the resulting executable. It is commonly used for quick testing and development.

In this lesson, we show what happens when you run these commands in a terminal.
    `,
    terminalOutput: [
      { kind: 'command', text: '$ go build hello.go' },
      { kind: 'command', text: '$ ./hello' },
      { kind: 'stdout', text: 'Hello, world!' },
      { kind: 'command', text: '$ go run hello.go' },
      { kind: 'stdout', text: 'Hello, world!' }
    ],
  },
  {
    slug: 'variables',
    title: '3. Variables',
    section: 'Section A: Language fundamentals',
    order: 3,
    runMode: 'playground',
    body: `
The \`var\` statement declares a list of variables; as in function argument lists, the type is last.

Inside a function, the \`:=\` short assignment statement can be used in place of a \`var\` declaration with implicit type.
Outside a function, every statement begins with a keyword (\`var\`, \`func\`, and so on) and so the \`:=\` construct is not available.

You can also assign multiple variables at once.

The **blank identifier** \`_\` can be used to discard unwanted return values or variables.
    `,
    gotcha: "Variables declared in Go *must* be used. If you declare a local variable and do not use it, the compiler will throw an error. Use the blank identifier `_` if you must assign to a variable but intend not to use it.",
    starterCode: `package main

import "fmt"

var c, python, java bool

func main() {
    var i, j int = 1, 2
    k := 3
    c, python, java := true, false, "no!"

    fmt.Println(i, j, k, c, python, java)
    
    // Multiple assignment
    a, b := 10, 20
    a, b = b, a // swap!
    
    // Blank identifier
    _, _ = a, b
}`,
  },
  {
    slug: 'constants-iota',
    title: '4. Constants & iota',
    section: 'Section A: Language fundamentals',
    order: 4,
    runMode: 'playground',
    body: `
Constants are declared like variables, but with the \`const\` keyword. They can be character, string, boolean, or numeric values. Constants cannot be declared using the \`:=\` syntax.

Go's \`iota\` identifier is used in \`const\` declarations to simplify definitions of incrementing numbers. Because it can be used in expressions, it provides a generality beyond that of simple enumerations.

It evaluates to 0 on the first line of the \`const\` block, and increments by 1 for each subsequent line.
    `,
    starterCode: `package main

import "fmt"

const Pi = 3.14

const (
    // iota is reset to 0
    A = iota  // 0
    B         // 1 (implicitly B = iota)
    C         // 2
)

// Bit-flag pattern
const (
    Read = 1 << iota  // 1 << 0 = 1
    Write             // 1 << 1 = 2
    Execute           // 1 << 2 = 4
)

func main() {
    fmt.Println("Pi:", Pi)
    fmt.Println("A, B, C:", A, B, C)
    fmt.Printf("Read: %b, Write: %b, Execute: %b\\n", Read, Write, Execute)
}`,
  },
  {
    slug: 'basic-types',
    title: '5. Basic types, zero values, conversions',
    section: 'Section A: Language fundamentals',
    order: 5,
    runMode: 'playground',
    body: `
Variables declared without an explicit initial value are given their **zero value**.
The zero value is:
- \`0\` for numeric types,
- \`false\` for the boolean type, and
- \`""\` (the empty string) for strings.

Unlike in C, in Go assignment between items of different type requires an explicit conversion. There is no implicit type conversion.
    `,
    starterCode: `package main

import (
    "fmt"
    "math"
)

func main() {
    // Zero values
    var i int
    var f float64
    var b bool
    var s string
    fmt.Printf("%v %v %v %q\\n", i, f, b, s)
    
    // Type conversions
    var x, y int = 3, 4
    var fNum float64 = math.Sqrt(float64(x*x + y*y)) // Explicit conversion
    var z uint = uint(fNum) // Explicit conversion
    fmt.Println(x, y, z)
}`,
  },
  {
    slug: 'strings-runes',
    title: '6. Strings, runes, bytes',
    section: 'Section A: Language fundamentals',
    order: 6,
    runMode: 'playground',
    body: `
In Go, a string is in effect a read-only slice of bytes. 

Go uses the \`rune\` type (an alias for \`int32\`) to represent a Unicode code point. A string might contain multiple bytes for a single rune if it's a multi-byte UTF-8 character.

To iterate over runes instead of bytes, use the \`range\` loop. It decodes one UTF-8-encoded rune on each iteration.
    `,
    starterCode: `package main

import "fmt"

func main() {
    s := "Hello, 世界" // "世界" means "world" in Chinese
    
    fmt.Println("Length in bytes:", len(s))
    
    // Iterating over bytes
    fmt.Print("Bytes: ")
    for i := 0; i < len(s); i++ {
        fmt.Printf("%x ", s[i])
    }
    fmt.Println()
    
    // Iterating over runes
    fmt.Print("Runes: ")
    for i, r := range s {
        fmt.Printf("%d:%c ", i, r)
    }
    fmt.Println()
}`,
  },
  {
    slug: 'numeric-types',
    title: '7. Numeric types & untyped constants',
    section: 'Section A: Language fundamentals',
    order: 7,
    runMode: 'playground',
    body: `
Go has various numeric types. \`int\` and \`uint\` are generally 32 bits wide on 32-bit systems and 64 bits wide on 64-bit systems.
Other types include \`int8\`, \`int16\`, \`int32\`, \`int64\`, and their unsigned variants.

Numeric constants are high-precision *values*. An **untyped constant** takes the type needed by its context.

Below is the Checkpoint for Section A.
    `,
    starterCode: `package main

import "fmt"

const (
    // Create a huge number by shifting a 1 bit left 100 places.
    // In other words, the binary number that is 1 followed by 100 zeroes.
    Big = 1 << 100
    // Shift it right again 99 places, so we end up with 1<<1, or 2.
    Small = Big >> 99
)

func needInt(x int) int { return x * 10 }
func needFloat(x float64) float64 { return x * 0.1 }

func main() {
    fmt.Println(needInt(Small))
    fmt.Println(needFloat(Small))
    fmt.Println(needFloat(Big))
    
    // Overflow example:
    var i uint8 = 255
    i++ // Wraps around to 0
    fmt.Println("uint8 255 + 1 =", i)
}`,
    checkpoint: {
      id: 'checkpoint-a',
      questions: [
        {
          id: 'cp-a-1',
          prompt: 'What is the zero value of a string in Go?',
          type: 'mcq',
          options: ['null', 'nil', '"" (empty string)', 'undefined'],
          correctIndex: 2,
          explanation: 'Strings in Go are initialized to an empty string (""), not nil.'
        },
        {
          id: 'cp-a-2',
          prompt: 'Which pattern is `iota` commonly used for?',
          type: 'mcq',
          options: ['Bit-flag enums', 'Loop counters', 'Memory addresses', 'Generics'],
          correctIndex: 0,
          explanation: 'iota increments on each line of a const block, making it perfect for bit-flags (1 << iota) and enumerations.'
        },
        {
          id: 'cp-a-3',
          prompt: 'What type does a numeric constant have before it is assigned?',
          type: 'mcq',
          options: ['int', 'float64', 'It is an untyped constant', 'int32'],
          correctIndex: 2,
          explanation: 'Numeric constants are untyped until they are used in a context that requires a specific type.'
        },
        {
          id: 'cp-a-4',
          prompt: 'Does Go allow implicit type conversion?',
          type: 'mcq',
          options: ['Yes', 'No'],
          correctIndex: 1,
          explanation: 'Go requires explicit conversions (e.g., int(myFloat)) between different types to avoid subtle bugs.'
        },
        {
          id: 'cp-a-5',
          prompt: 'A rune in Go is an alias for which type?',
          type: 'fill',
          acceptedAnswers: ['int32'],
          explanation: 'A rune represents a Unicode code point and is an alias for int32.'
        }
      ]
    }
  }
]
