import type { Checkpoint } from '../types';

export const genericsCheckpoint: Checkpoint = {
  id: 'cp-generics',
  sectionId: 'generics',
  title: 'Section F · Generics',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What does the `~` prefix do in a constraint type set?',
      options: [
        'Negates the type',
        'Includes types whose underlying type matches',
        'Marks the constraint as optional',
        'Is a typo of `^`',
      ],
      correctIndex: 1,
      explanation:
        '`~int` includes any type whose underlying type is `int` — e.g., `type Cents int`. Without `~` you get only `int` itself.',
    },
    {
      kind: 'mcq',
      prompt: 'Which built-in constraint allows `==` and `!=`?',
      options: ['any', 'comparable', 'ordered', 'numeric'],
      correctIndex: 1,
      explanation: '`comparable` is the predeclared constraint for types that support equality.',
    },
    {
      kind: 'mcq',
      prompt: 'When should you reach for generics?',
      options: [
        'On every public function for flexibility',
        'When you have at least two concrete callers and need to preserve type relationships',
        'Whenever a function takes any',
        'Never — they are not idiomatic Go',
      ],
      correctIndex: 1,
      explanation:
        'Generics earn their place when type relationships matter (e.g., Map[T,U]). One-off code is cleaner with concrete types or interfaces.',
    },
  ],
};
