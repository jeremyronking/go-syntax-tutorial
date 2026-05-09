import type { Checkpoint } from '../types';

export const interfacesCheckpoint: Checkpoint = {
  id: 'cp-interfaces',
  sectionId: 'interfaces',
  title: 'Section E · Interfaces',
  questions: [
    {
      kind: 'mcq',
      prompt: 'How does a type declare it satisfies an interface?',
      options: [
        '`type X implements I` keyword',
        'A `// implements I` comment',
        'It just has the methods; no declaration needed',
        'It must be in the same package',
      ],
      correctIndex: 2,
      explanation:
        'Interface satisfaction in Go is implicit: a type satisfies an interface iff it has the required methods.',
    },
    {
      kind: 'mcq',
      prompt: 'Which form is safest when narrowing an `any` to a `string`?',
      options: ['s := x.(string)', 's, ok := x.(string)', 'string(x)', 'reflect.ValueOf(x)'],
      correctIndex: 1,
      explanation:
        'The single-result assertion panics if the type does not match. Comma-ok returns ok=false instead.',
    },
    {
      kind: 'mcq',
      prompt: 'A struct embedding `Logger` automatically …',
      options: [
        'Inherits Logger as a parent class',
        'Has Logger\'s methods promoted to it',
        'Implements every interface Logger does, even without methods',
        'Compile error',
      ],
      correctIndex: 1,
      explanation:
        'Embedding promotes methods. There is no inheritance; the outer struct just gains the embedded type\'s methods.',
    },
    {
      kind: 'fill',
      prompt: 'Which `fmt` interface does `%s` and `%v` consult to format a custom type?',
      acceptedAnswers: ['Stringer', 'fmt.Stringer'],
      explanation: '`fmt.Stringer` declares `String() string`. Implement it for nice formatted output.',
    },
  ],
};
