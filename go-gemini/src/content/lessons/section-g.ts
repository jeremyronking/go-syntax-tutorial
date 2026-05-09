import type { Lesson } from '../types'

export const sectionGLessons: Lesson[] = [
  {
    slug: 'errors-interface',
    title: '31. The error interface',
    section: 'Section G: Errors, panic, recover',
    order: 31,
    runMode: 'playground',
    body: `
In Go, error handling is explicit and uses standard return values. Go programs express error state with \`error\` values.

The \`error\` type is a built-in interface similar to \`fmt.Stringer\`:
\`type error interface { Error() string }\`

Functions often return an \`error\` value, and calling code should handle errors by testing whether the error equals \`nil\`. A \`nil\` error denotes success; a non-nil error denotes failure.

You can create errors using \`errors.New("...")\` or \`fmt.Errorf("...")\`. You can test for specific "sentinel" errors using \`errors.Is\`, or cast errors using \`errors.As\`.
    `,
    starterCode: `package main

import (
    "errors"
    "fmt"
)

// A sentinel error
var ErrDivideByZero = errors.New("cannot divide by zero")

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, ErrDivideByZero
    }
    return a / b, nil
}

func main() {
    result, err := divide(4, 0)
    
    // Explicit error check
    if err != nil {
        if errors.Is(err, ErrDivideByZero) {
            fmt.Println("Special handling for division by zero!")
        } else {
            fmt.Println("Other error:", err)
        }
        return
    }
    
    fmt.Println("Result:", result)
}`,
  },
  {
    slug: 'error-wrapping',
    title: '32. Error wrapping',
    section: 'Section G: Errors, panic, recover',
    order: 32,
    runMode: 'playground',
    body: `
Often, you receive an error from a function and want to add context to it before returning it. 

You can **wrap** an error using \`fmt.Errorf\` with the \`%w\` verb. This creates a new error that contains the original error.

When you use \`errors.Is\` or \`errors.As\`, Go will automatically unwrap the error chain to see if the target error is anywhere inside the chain.
    `,
    starterCode: `package main

import (
    "errors"
    "fmt"
)

var ErrDatabase = errors.New("database connection failed")

func connectDB() error {
    return ErrDatabase // simulate failure
}

func fetchUser() error {
    err := connectDB()
    if err != nil {
        // Wrap the error with context
        return fmt.Errorf("fetchUser failed: %w", err)
    }
    return nil
}

func main() {
    err := fetchUser()
    fmt.Println("Received error:", err)
    
    // errors.Is can still find the wrapped ErrDatabase
    if errors.Is(err, ErrDatabase) {
        fmt.Println("-> It was a database issue!")
    }
}`,
  },
  {
    slug: 'panic-recover',
    title: '33. Panic & recover',
    section: 'Section G: Errors, panic, recover',
    order: 33,
    runMode: 'playground',
    body: `
Go uses \`panic\` and \`recover\` for truly exceptional, unrecoverable situations—not for normal control flow or expected errors.

**Panic** stops normal execution of the current goroutine. Defers are executed, and the program crashes.
**Recover** is a built-in function that regains control of a panicking goroutine. It is only useful inside deferred functions.

Below is the Checkpoint for Section G.
    `,
    gotcha: "Panic is not exception handling! Do not use panic/recover for normal error handling. Use it only for truly fatal states, like out-of-bounds array access or unrecoverable initialization failures.",
    starterCode: `package main

import "fmt"

func riskyOperation() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    
    fmt.Println("About to panic...")
    panic("Something went terribly wrong!")
    fmt.Println("This line is never executed.")
}

func main() {
    riskyOperation()
    fmt.Println("Program continued execution.")
}`,
    checkpoint: {
      id: 'checkpoint-g',
      questions: [
        {
          id: 'cp-g-1',
          prompt: 'What does a `nil` error indicate in Go?',
          type: 'mcq',
          options: ['A fatal crash', 'Success (no error occurred)', 'An unhandled exception', 'A warning'],
          correctIndex: 1,
          explanation: 'In Go, error values are nil when an operation succeeds.'
        },
        {
          id: 'cp-g-2',
          prompt: 'How do you test if an error matches a specific sentinel error, even if it has been wrapped?',
          type: 'mcq',
          options: ['err == ErrNotFound', 'errors.Is(err, ErrNotFound)', 'err.Equals(ErrNotFound)'],
          correctIndex: 1,
          explanation: 'errors.Is unpacks wrapped errors and checks the entire chain for a match.'
        },
        {
          id: 'cp-g-3',
          prompt: 'Which formatting verb is used with `fmt.Errorf` to wrap an error?',
          type: 'fill',
          acceptedAnswers: ['%w'],
          explanation: '%w wraps the error so it can be unwrapped later by errors.Is or errors.As.'
        },
        {
          id: 'cp-g-4',
          prompt: 'Should `panic` and `recover` be used for standard error handling like "file not found"?',
          type: 'mcq',
          options: ['Yes', 'No'],
          correctIndex: 1,
          explanation: 'Panic/recover are reserved for catastrophic failures. Standard control flow should use explicit `error` returns.'
        }
      ]
    }
  }
]
