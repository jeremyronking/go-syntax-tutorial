import type { Checkpoint } from '../types';

export const fundamentalsCheckpoint: Checkpoint = {
  id: 'fundamentals-checkpoint',
  sectionId: 'fundamentals',
  title: 'Checkpoint: language fundamentals',
  questions: [
    {
      kind: 'mcq',
      prompt: 'Which declaration produces the value 0 for an `int` without an explicit initialiser?',
      options: ['`var x int`', '`x := 0`', '`x := new(int)`', '`var x = 0`'],
      correctIndex: 0,
      explanation:
        '`var x int` leaves the variable at its zero value, 0. `x := 0` is a short declaration that assigns 0 explicitly, and `new(int)` returns a *int.',
    },
    {
      kind: 'mcq',
      prompt:
        'In a `const` block, what is the value of `Second` given `First = 1 << iota` on the previous line?',
      options: ['1', '2', '4', 'It is an untyped constant error'],
      correctIndex: 1,
      explanation:
        '`iota` counts the ConstSpec index from zero, and the expression is repeated for each line. `First` is 1, `Second` is 2, `Third` is 4.',
    },
    {
      kind: 'mcq',
      prompt: 'What does `const Big = 1 << 40` have to be in order to be assigned to an `int`?',
      options: [
        'It is always an int',
        'It must fit in the target type — on a 32-bit int it does not',
        'It must be explicitly typed `int64`',
        'Untyped constants cannot be used as bit flags',
      ],
      correctIndex: 1,
      explanation:
        'Untyped constants take the type of the context they are used in, and they must be representable in that type. 1 << 40 overflows a 32-bit int but fits an int64.',
    },
    {
      kind: 'fill',
      prompt: 'What is the zero value of a `bool`?',
      acceptedAnswers: ['false', 'False'],
      explanation: 'The zero value of every bool is false.',
    },
    {
      kind: 'mcq',
      prompt: 'How many bytes does `len("héllo")` report?',
      options: ['5', '6', '7', '4'],
      correctIndex: 1,
      explanation:
        'len() on a string counts bytes, not runes. "héllo" is 6 bytes because é is two bytes in UTF-8. range over the string, not len, to count characters.',
    },
  ],
};
