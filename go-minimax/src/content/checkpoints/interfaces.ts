import type { Checkpoint } from '../types';

export const interfacesCheckpoint: Checkpoint = {
  id: 'interfaces-checkpoint',
  sectionId: 'interfaces',
  title: 'Checkpoint: interfaces & polymorphism',
  questions: [
    {
      kind: 'mcq',
      prompt: 'How does a type satisfy an interface in Go?',
      options: [
        'By listing the interface in its declaration (`type Dog struct implements Speaker`)',
        'Implicitly, by having the interface’s methods',
        'By embedding the interface in the struct',
        'By registering it at runtime',
      ],
      correctIndex: 1,
      explanation:
        'Satisfaction is structural: a type satisfies an interface simply by having the right methods. That is why any type, including ones from other packages written long before your interface existed, can satisfy it.',
    },
    {
      kind: 'mcq',
      prompt:
        'What is `s == nil` when `var d *Dog` (nil) and `var s Speaker = d`?',
      options: [
        'true — the interface is nil',
        'false — the interface holds the type `*Dog` and a nil value',
        'It panics',
        'It does not compile',
      ],
      correctIndex: 1,
      explanation:
        'An interface value carries both a type and a value. A nil pointer stored in an interface makes the interface non-nil. Only `var s Speaker` — with neither a type nor a value — is genuinely nil.',
    },
    {
      kind: 'mcq',
      prompt: 'What does `v, ok := i.(T)` do when `i` does not hold a `T`?',
      options: [
        'It panics',
        'It returns the zero value of `T` and `false`',
        'It returns `nil` and `false`',
        'It converts `i` to `T`',
      ],
      correctIndex: 1,
      explanation:
        'The comma-ok form never panics: it returns the zero value of `T` and `false`. The single-value form `i.(T)` panics on mismatch.',
    },
    {
      kind: 'mcq',
      prompt: 'What happens when a struct embeds two types that both define a method with the same name?',
      options: [
        'The outer method wins automatically',
        'The selector is ambiguous and fails to compile',
        'The last embedded type wins',
        'It is a runtime panic',
      ],
      correctIndex: 1,
      explanation:
        'Ambiguous selectors are a compile error. You resolve them by naming the embedded type explicitly: `x.Left.Describe()`.',
    },
    {
      kind: 'fill',
      prompt:
        'Which standard library interface is satisfied by a type with a `String() string` method?',
      acceptedAnswers: ['fmt.Stringer', 'Stringer', 'fmt.stringer'],
      explanation:
        '`fmt.Stringer` is `interface { String() string }`. Implementing it makes `%v` and `fmt.Println` render your type the way you want.',
    },
  ],
};
