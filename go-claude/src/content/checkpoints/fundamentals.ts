import type { Checkpoint } from '../types';

export const fundamentalsCheckpoint: Checkpoint = {
  id: 'cp-fundamentals',
  sectionId: 'fundamentals',
  title: 'Section A · Language fundamentals',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What is `len(s)` for `s := "héllo"`?',
      options: ['5 — characters', '6 — bytes', '4 — runes minus accent', 'Compile error'],
      correctIndex: 1,
      explanation: '`len` on a string returns bytes, not runes. The é encodes to two bytes in UTF-8.',
    },
    {
      kind: 'mcq',
      prompt: 'After `var u uint8 = 255; u++`, what is `u`?',
      options: ['256', 'panic: overflow', '0', 'Compile error'],
      correctIndex: 2,
      explanation:
        'Integer overflow wraps silently in Go — `255 + 1` for a `uint8` is `0`. No panic, no warning.',
    },
    {
      kind: 'mcq',
      prompt: 'In `const ( a = iota; b; c )`, what is `c`?',
      options: ['0', '1', '2', 'undefined'],
      correctIndex: 2,
      explanation:
        'The expression `iota` repeats implicitly on subsequent lines, with iota incrementing each spec. So a=0, b=1, c=2.',
    },
    {
      kind: 'mcq',
      prompt: 'Which is a compile error in Go?',
      options: [
        'A function with no return value',
        'An unused local variable',
        'Returning two values',
        'A `for` loop with no condition',
      ],
      correctIndex: 1,
      explanation:
        'Unused locals and unused imports are compile errors — intentional. `_ = x` or `_ "pkg"` are the escape hatches.',
    },
    {
      kind: 'fill',
      prompt: 'What single character discards a value at the receiver position?',
      acceptedAnswers: ['_', 'underscore'],
      explanation: 'The blank identifier `_` discards values you must accept but don’t want.',
    },
  ],
};
