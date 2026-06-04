import type { Checkpoint } from '../types';

export const fundamentalsCheckpoint: Checkpoint = {
  id: 'fundamentals',
  sectionSlug: 'A',
  title: 'Checkpoint: Language fundamentals',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'fundamentals-iota',
      prompt: 'Given the constant block below, what does `Read | Write` print as binary?\n\n```go\nconst (\n    Read    = 1 << iota\n    Write\n    Execute\n)\n```',
      options: ['0b11', '0b110', '0b111', '0b1000'],
      correctIndex: 0,
      explanation: 'Read = 1 (1 << 0), Write = 2 (1 << 1), Execute = 4 (1 << 2). Read | Write = 3 = 0b11.',
    },
    {
      kind: 'mcq',
      id: 'fundamentals-zerovalue',
      prompt: 'What is the zero value of a `*User` (a pointer to a struct)?',
      options: ['A pointer to a zero-valued User', '`nil`', 'A panic when accessed', 'An uninitialized pointer that segfaults'],
      correctIndex: 1,
      explanation: 'All pointer types have the zero value `nil`. Dereferencing a nil pointer panics, but the zero value itself is `nil`.',
    },
    {
      kind: 'mcq',
      id: 'fundamentals-conversion',
      prompt: 'Which of these compiles?',
      options: [
        '`var x int = 3.14`',
        '`var x int = int(3.14)`',
        '`x := 3 + 4.0`',
        '`x := "3" + 3`',
      ],
      correctIndex: 1,
      explanation: 'Go has no implicit numeric conversion. `int(3.14)` is the explicit form, and it truncates the float.',
    },
    {
      kind: 'fill',
      id: 'fundamentals-rune-len',
      prompt: 'Given `s := "héllo"`, what does `len(s)` return in Go? (number)',
      acceptedAnswers: ['6', 'six'],
      explanation: '`len` returns the byte count, not the rune count. `é` is two bytes in UTF-8 (0xC3 0xA9), so 5 + 1 = 6.',
    },
    {
      kind: 'mcq',
      id: 'fundamentals-untyped',
      prompt: 'An untyped numeric constant can hold arbitrarily large values. What is the catch?',
      options: [
        'It panics at runtime if too large',
        'It still uses 8 bytes of memory',
        'It has no type until used; assigning it to a fixed-width variable triggers a compile error if it does not fit',
        'It is slower than typed arithmetic',
      ],
      correctIndex: 2,
      explanation: 'Untyped constants have arbitrary precision. The moment you assign one to a typed variable, the compiler checks the value fits.',
    },
  ],
};

export const controlFlowCheckpoint: Checkpoint = {
  id: 'control-flow',
  sectionSlug: 'B',
  title: 'Checkpoint: Control flow',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'control-switch',
      prompt: 'A `case` in a `switch` falls through to the next case by default.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Cases in Go do not fall through. Use `fallthrough` explicitly (rarely the right call).',
    },
    {
      kind: 'mcq',
      id: 'control-typeswitch',
      prompt: 'In `switch v := x.(type) { case int: ... }`, what is the type of `v` inside the `int` case?',
      options: ['`any`', '`interface{}`', '`int`', '`reflect.Type`'],
      correctIndex: 2,
      explanation: 'Inside each case of a type switch, `v` has the concrete type of that case. You can use it as a regular `int`.',
    },
    {
      kind: 'mcq',
      id: 'control-defer-eval',
      prompt: 'What does this print?\n\n```go\nfunc main() {\n    for i := 0; i < 3; i++ {\n        defer fmt.Println(i)\n    }\n}\n```',
      options: ['0 1 2', '2 1 0', '0 0 0', 'Compile error'],
      correctIndex: 1,
      explanation: 'Defers are LIFO. The argument `i` is captured at defer time, so the last iteration\'s `i` (2) prints first, then 1, then 0.',
    },
    {
      kind: 'fill',
      id: 'control-defer-loop',
      prompt: 'Name one common gotcha when `defer` is used inside a `for` loop that opens files (one short word).',
      acceptedAnswers: ['leak', 'leaks', 'leak/leaks'],
      explanation: 'Each `defer file.Close()` is queued until the surrounding function returns, so all files stay open. Use a per-iteration function or `sync.Pool`.',
    },
    {
      kind: 'mcq',
      id: 'control-loop-capture',
      prompt: 'In Go 1.22+, capturing the loop variable in a goroutine inside `for _, v := range xs {}` gives you...',
      options: [
        'The same shared binding (latest value)',
        'A fresh binding per iteration (intuitive)',
        'A compile error',
        'An uninitialized value',
      ],
      correctIndex: 1,
      explanation: 'Go 1.22 changed the spec: the per-iteration variable is a fresh binding each turn. Pre-1.22 you had to write `v := v` to avoid capture.',
    },
  ],
};
