import type { Checkpoint } from '../types';

export const compositeTypesCheckpoint: Checkpoint = {
  id: 'composite-types-checkpoint',
  sectionId: 'composite-types',
  title: 'Checkpoint: composite types',
  questions: [
    {
      kind: 'mcq',
      prompt:
        'What does this print?\n\n```go\na := []int{1, 2, 3, 4, 5}\nb := a[1:3]\nb[0] = 99\nfmt.Println(a)\n```',
      options: [
        '[1 2 3 4 5]',
        '[1 99 3 4 5]',
        '[99 2 3 4 5]',
        '[1 99 3]',
      ],
      correctIndex: 1,
      explanation:
        'Slicing shares the backing array — `b` is a window onto `a`. Writing `b[0]` writes into the same memory, so `a` becomes `[1 99 3 4 5]`. Only `copy` or a three-index slice forces a fresh array.',
    },
    {
      kind: 'mcq',
      prompt: 'What is the zero value of a map?',
      options: [
        'An empty map you can write to',
        '`nil` — reading is fine, writing panics',
        'A map with one empty entry',
        'It does not exist; maps must be created with `make`',
      ],
      correctIndex: 1,
      explanation:
        'The zero value of a map is `nil`. Reading from it and ranging over it are safe, but writing panics with "assignment to entry in nil map". Create it with `make(map[K]V)`.',
    },
    {
      kind: 'mcq',
      prompt: 'What is the method set of type `T` versus `*T`?',
      options: [
        'They are identical',
        '`T` has value-receiver methods; `*T` has both value- and pointer-receiver methods',
        '`T` has pointer-receiver methods; `*T` has only value-receiver methods',
        'Only `*T` has any methods',
      ],
      correctIndex: 1,
      explanation:
        'The method set of `T` contains only value-receiver methods; the method set of `*T` contains both. That is why `*T` satisfies an interface requiring a pointer-receiver method while `T` does not.',
    },
    {
      kind: 'mcq',
      prompt: 'Which struct can be used as a map key?',
      options: [
        'A struct with two `int` fields',
        'A struct with a `string` and an `int` field',
        'A struct containing a `[]int` field',
        'A struct containing a `map[string]int` field',
      ],
      correctIndex: 1,
      explanation:
        'A struct is comparable if all of its fields are comparable. Slices and maps are not comparable, so a struct containing either cannot be a map key or compared with `==`.',
    },
    {
      kind: 'fill',
      prompt:
        'What built-in function allocates a zeroed value and returns a pointer to it? (Name the function.)',
      acceptedAnswers: ['new', 'new()'],
      explanation:
        '`new(T)` allocates a zeroed `T` and returns `*T`. In practice you usually take the address of a local instead.',
    },
  ],
};
