import type { Checkpoint } from '../types';

export const genericsCheckpoint: Checkpoint = {
  id: 'generics-checkpoint',
  sectionId: 'generics',
  title: 'Checkpoint: generics',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What does the `~` in a constraint like `~int` mean?',
      options: [
        'Approximation — it matches any type whose underlying type is `int`',
        'It marks the constraint as optional',
        'It means "and also"',
        'It makes the type parameter nullable',
      ],
      correctIndex: 0,
      explanation:
        '`~int` matches `int` and any named type whose underlying type is `int` (like `type MyInt int`). A bare `int` matches only the exact type.',
    },
    {
      kind: 'mcq',
      prompt: 'What is the type set of the predeclared `comparable` constraint?',
      options: [
        'Every type',
        'The strictly comparable types — slices, maps and functions are excluded',
        'Only the numeric types',
        'Only types that implement `error`',
      ],
      correctIndex: 1,
      explanation:
        '`comparable` admits the strictly comparable types. Slices, maps and functions are not comparable and cannot satisfy it.',
    },
    {
      kind: 'mcq',
      prompt: 'When is an interface the better tool than a generic?',
      options: [
        'Always — generics are experimental',
        'When you need to call behaviour on the value and accept any type that provides it',
        'When you are writing a container type',
        'Never — generics are strictly better',
      ],
      correctIndex: 1,
      explanation:
        'Use generics for containers and algorithms that operate on a type parameter without needing its behaviour. Use interfaces when the code calls methods on the value — an interface accepts any future type that implements it, a generic does not.',
    },
    {
      kind: 'mcq',
      prompt: 'What happens to a generic type parameter at runtime?',
      options: [
        'It is erased — the compiler generates a specialised copy per type argument',
        'It is boxed into an interface value',
        'It is looked up via reflection on every call',
        'It is stored in a global registry',
      ],
      correctIndex: 0,
      explanation:
        'Type parameters erase: the compiler generates a separate instantiation for each type argument, so there is no boxing cost and no reflection overhead. The cost is binary size — one copy per instantiation.',
    },
    {
      kind: 'fill',
      prompt:
        'What predeclared constraint admits every type? (Name the constraint.)',
      acceptedAnswers: ['any', 'interface{}', 'any / interface{}'],
      explanation:
        '`any` is an alias for `interface{}` — the empty interface, satisfied by every type. It is also the default constraint for a type parameter.',
    },
  ],
};
