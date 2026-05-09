import type { Checkpoint } from '../types';

export const functionsCheckpoint: Checkpoint = {
  id: 'cp-functions',
  sectionId: 'functions',
  title: 'Section D · Functions',
  questions: [
    {
      kind: 'mcq',
      prompt:
        'A method `func (c Counter) Inc() { c.n++ }`, called as `c.Inc()`, will …',
      options: [
        'Increment c.n on the original receiver',
        'Operate on a copy; original is unchanged',
        'Compile error',
        'Panic at runtime',
      ],
      correctIndex: 1,
      explanation:
        'Value receivers operate on a copy. Use a pointer receiver `func (c *Counter) Inc()` to mutate.',
    },
    {
      kind: 'mcq',
      prompt: 'To pass a `[]int` to a `func sum(xs ...int)`, what do you write?',
      options: [
        '`sum(s)`',
        '`sum(...s)`',
        '`sum(s...)`',
        '`sum(spread(s))`',
      ],
      correctIndex: 2,
      explanation:
        'The spread operator is `s...` — trailing dots after the value being expanded.',
    },
    {
      kind: 'mcq',
      prompt:
        'Closures in Go capture outer variables by …',
      options: [
        'Value (snapshot at creation)',
        'Reference (closure sees subsequent mutations)',
        'Lazy evaluation',
        'Channels',
      ],
      correctIndex: 1,
      explanation:
        'Closures share the storage with the outer scope; mutations are visible inside the closure.',
    },
    {
      kind: 'fill',
      prompt:
        'What operator takes the address of a value (e.g., turns x into a *T)?',
      acceptedAnswers: ['&', 'ampersand'],
      explanation: '&x yields a *T. The dereference operator is *p.',
    },
  ],
};
