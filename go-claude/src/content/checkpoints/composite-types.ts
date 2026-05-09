import type { Checkpoint } from '../types';

export const compositeTypesCheckpoint: Checkpoint = {
  id: 'cp-composite-types',
  sectionId: 'composite-types',
  title: 'Section C · Composite types',
  questions: [
    {
      kind: 'mcq',
      prompt:
        'a := []int{1,2,3,4,5}; b := a[1:4]; b[0] = 99 — what is a[1]?',
      options: ['2', '99', '0', 'panic'],
      correctIndex: 1,
      explanation:
        'b shares a backing array with a. Mutating b[0] mutates the same memory cell as a[1].',
    },
    {
      kind: 'mcq',
      prompt: 'What does sending to a nil map do?',
      options: [
        'Allocates the map for you',
        'Returns silently',
        'Panics at runtime',
        'Compile error',
      ],
      correctIndex: 2,
      explanation:
        'Reading from a nil map returns the zero value; writing panics. Always initialize maps with make() or a literal.',
    },
    {
      kind: 'mcq',
      prompt: 'A struct with a slice field is …',
      options: [
        'Comparable with ==',
        'Not comparable; using == is a compile error',
        'Comparable only if both slices are nil',
        'Always equal',
      ],
      correctIndex: 1,
      explanation:
        'Slices are not comparable, so any struct that contains one is not comparable either.',
    },
    {
      kind: 'mcq',
      prompt: 'Which is the safest mental model for `append(s, x)`?',
      options: [
        'Always mutates s in place',
        'Always allocates a new backing array',
        'May or may not — assign the result back to s',
        'Returns nil unless s has capacity',
      ],
      correctIndex: 2,
      explanation:
        'append returns a slice header that may share or replace the backing array depending on capacity. Always reassign: s = append(s, x).',
    },
    {
      kind: 'fill',
      prompt:
        'What three-index slice form would you use to make append definitely allocate?',
      acceptedAnswers: ['s[i:j:j]', 's[a:b:b]', 'a[i:j:j]'],
      explanation:
        's[low:high:max] caps the capacity. Any append beyond high must allocate.',
    },
  ],
};
