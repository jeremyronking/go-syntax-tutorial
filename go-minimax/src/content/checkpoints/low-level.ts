import type { Checkpoint } from '../types';

export const lowLevelCheckpoint: Checkpoint = {
  id: 'low-level-checkpoint',
  sectionId: 'low-level',
  title: 'Checkpoint: reflection & low-level',
  questions: [
    {
      kind: 'mcq',
      prompt:
        'For `type MyString string`, what do `reflect.TypeOf(MyString("x")).Kind()` and `.Name()` return?',
      options: [
        '`String` and `MyString` — the kind is the shape, the name is the identity',
        '`MyString` and `MyString`',
        '`String` and `String`',
        '`MyString` and `String`',
      ],
      correctIndex: 0,
      explanation:
        'A `reflect.Kind` is one of the 27 basic shapes, so a named string type has the kind `String`. `reflect.Type.Name()` returns the type\'s own name, `MyString`. The distinction between shape and identity is the one that catches people.',
    },
    {
      kind: 'mcq',
      prompt: 'What does `unsafe.Sizeof([]int{})` return?',
      options: [
        'The size of the slice header (24 bytes on 64-bit), not the backing array',
        '0, because the slice is empty',
        'The size of one `int`',
        'The size of the backing array, which the compiler knows at build time',
      ],
      correctIndex: 0,
      explanation:
        '`unsafe.Sizeof` does not recurse into the elements. For a slice it returns the size of the three-word header — pointer, length, capacity — which is 24 bytes on a 64-bit platform.',
    },
    {
      kind: 'mcq',
      prompt: 'Which of these must be true for a `//go:build` constraint to take effect?',
      options: [
        'The directive appears before the package clause, followed by a blank line',
        'It must be the first line of the file, with no blank line after it',
        'It must come after the package clause',
        'The file must also be listed in `go.mod`',
      ],
      correctIndex: 0,
      explanation:
        'A `//go:build` line must appear before the package clause and be followed by a blank line, so the compiler recognises it as a constraint rather than a comment attached to the package declaration. The old `// +build` form is deprecated but still honoured if it agrees with the new one.',
    },
    {
      kind: 'mcq',
      prompt: 'Why is a memory allocated with `C.CString` freed with `C.free`?',
      options: [
        'Because `C.CString` allocates with C\'s `malloc`, which is outside the Go heap',
        'Because `C.free` is faster',
        'Because Go\'s garbage collector cannot see C allocations at all',
        'Because `C.CString` returns a Go string that leaks',
      ],
      correctIndex: 0,
      explanation:
        '`C.CString` allocates memory with C\'s `malloc`, outside the Go heap and invisible to the Go garbage collector, so you must release it yourself with `C.free(unsafe.Pointer(cstr))`. Forgetting the free is a memory leak.',
    },
  ],
};
