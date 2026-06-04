import type { Checkpoint } from '../types';

export const interfacesCheckpoint: Checkpoint = {
  id: 'interfaces',
  sectionSlug: 'E',
  title: 'Checkpoint: Interfaces',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'iface-implicit',
      prompt: 'How does a type satisfy an interface in Go?',
      options: [
        'By listing it in an `implements` clause',
        'Implicitly, by implementing the interface\'s method set',
        'By registering with the runtime',
        'By embedding the interface',
      ],
      correctIndex: 1,
      explanation: 'Go has no `implements` keyword. The type satisfies the interface as soon as its method set covers the interface.',
    },
    {
      kind: 'mcq',
      id: 'iface-empty',
      prompt: 'What does `any` (the empty interface) match?',
      options: ['Nothing', 'Only pointers', 'Every type', 'Only types with `Error() string`'],
      correctIndex: 2,
      explanation: 'The empty interface has no methods, so every type satisfies it. That is why `fmt.Println` accepts anything.',
    },
    {
      kind: 'mcq',
      id: 'iface-assertion',
      prompt: '`v, ok := x.(string)` — what is `ok` when `x` is `int(7)`?',
      options: ['`true`', '`false`', 'A runtime panic', '`nil`'],
      correctIndex: 1,
      explanation: 'The comma-ok form returns `false` and a zero value when the assertion fails. Without the comma-ok, it would panic.',
    },
    {
      kind: 'mcq',
      id: 'iface-embedding',
      prompt: 'Embedding an interface in a struct...',
      options: [
        'Is not allowed',
        'Promotes the interface\'s methods on the struct (must be implemented to be useful)',
        'Forbids further embedding',
        'Causes a compile error',
      ],
      correctIndex: 1,
      explanation: 'Embedding an interface field requires the outer struct to provide implementations of those methods (often by delegation). It does not auto-implement anything.',
    },
    {
      kind: 'fill',
      id: 'iface-stdlib',
      prompt: 'Name the stdlib interface with one method `Error() string` (one word).',
      acceptedAnswers: ['error'],
      explanation: '`error` is the universal error interface in Go.',
    },
  ],
};

export const genericsCheckpoint: Checkpoint = {
  id: 'generics',
  sectionSlug: 'F',
  title: 'Checkpoint: Generics',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'gen-when',
      prompt: 'Generics are the right call when...',
      options: [
        'You have exactly two concrete types',
        'The same algorithm works on a family of types without type-specific branches',
        'The "generic" body dispatches on type at runtime',
        'You want to avoid writing tests',
      ],
      correctIndex: 1,
      explanation: 'Use generics when the algorithm itself is type-agnostic. If you need a type switch, the algorithm is not generic; use an interface with methods.',
    },
    {
      kind: 'mcq',
      id: 'gen-approx',
      prompt: 'The constraint `~int` matches...',
      options: [
        'The literal `int` type only',
        'Any type whose underlying type is `int` (e.g. `type MyInt int`)',
        'Any numeric type',
        'Only types defined in the same package',
      ],
      correctIndex: 1,
      explanation: 'The `~` (approximation) constraint matches by underlying type. `~int` matches `MyInt` because its underlying type is `int`.',
    },
    {
      kind: 'mcq',
      id: 'gen-any',
      prompt: '`func F[T any](...)` — what does the `any` constraint mean?',
      options: [
        'Accepts any type with a `String()` method',
        'Accepts any type (no constraint)',
        'Accepts only built-in types',
        'Accepts only interface types',
      ],
      correctIndex: 1,
      explanation: '`any` is the empty interface — every type satisfies it, so any type parameter can be substituted in.',
    },
    {
      kind: 'mcq',
      id: 'gen-infer',
      prompt: 'At a call site, when do you have to specify type arguments explicitly?',
      options: [
        'Always',
        'When type inference cannot determine them (e.g. the type parameter does not appear in any input)',
        'Never; Go always infers',
        'Only in test files',
      ],
      correctIndex: 1,
      explanation: 'Inference works for most calls, but if a type parameter has no constraints to pin it down, you have to specify it explicitly.',
    },
  ],
};

export const errorsCheckpoint: Checkpoint = {
  id: 'errors',
  sectionSlug: 'G',
  title: 'Checkpoint: Errors, panic, recover',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'err-is',
      prompt: '`errors.Is(err, ErrNotFound)` returns true if...',
      options: [
        '`err == ErrNotFound` exactly',
        '`err` is or wraps `ErrNotFound`',
        '`err` has the same message text',
        '`err` is a `*os.PathError`',
      ],
      correctIndex: 1,
      explanation: '`errors.Is` walks the wrap chain. It returns true for an exact match or any wrapped occurrence.',
    },
    {
      kind: 'mcq',
      id: 'err-wrap',
      prompt: 'In `fmt.Errorf("...: %w", err)`, what does `%w` do?',
      options: [
        'Wraps `err` so `errors.Is` and `errors.As` can see through',
        'Truncates the message to width `w`',
        'Writes the error to `os.Stderr`',
        'Converts the error to a warning',
      ],
      correctIndex: 0,
      explanation: '`%w` wraps the error. `%v` or `%s` formats the error to a string but loses the chain.',
    },
    {
      kind: 'mcq',
      id: 'err-panic',
      prompt: 'When is `panic` appropriate?',
      options: [
        'For expected error conditions',
        'For "the program cannot continue" — unrecoverable invariant violations',
        'As a control-flow tool',
        'Whenever you would use `throw` in another language',
      ],
      correctIndex: 1,
      explanation: '`panic` is for "cannot continue" conditions. Use `error` for normal failure paths.',
    },
    {
      kind: 'mcq',
      id: 'err-recover',
      prompt: '`recover()` only works...',
      options: [
        'Anywhere in the program',
        'Inside a deferred function in the same goroutine as the panic',
        'In a separate `try` block',
        'Only at package init time',
      ],
      correctIndex: 1,
      explanation: '`recover` regains control inside a deferred function. It does not cross goroutine boundaries.',
    },
    {
      kind: 'fill',
      id: 'err-sentinel',
      prompt: 'How do you create a sentinel error with no extra data? (function name)',
      acceptedAnswers: ['errors.New', 'errors.New()'],
      explanation: '`errors.New("msg")` returns an `error` value suitable for use as a package-level sentinel.',
    },
  ],
};
