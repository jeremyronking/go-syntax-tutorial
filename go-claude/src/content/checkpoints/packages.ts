import type { Checkpoint } from '../types';

export const packagesCheckpoint: Checkpoint = {
  id: 'cp-packages',
  sectionId: 'packages',
  title: 'Section I · Packages & layout',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What controls whether an identifier is exported from a package?',
      options: [
        'A `public` keyword',
        'The first letter\'s case (uppercase = exported)',
        'Position in the file',
        'A `go:export` directive',
      ],
      correctIndex: 1,
      explanation:
        'Capitalization is the contract. `Foo` is exported; `foo` is package-private. There is no other keyword.',
    },
    {
      kind: 'mcq',
      prompt: 'Importing `example.com/x/internal/y` from another module …',
      options: [
        'Works if the package is exported',
        'Is forbidden by the compiler',
        'Works only in tests',
        'Requires a -mod=full flag',
      ],
      correctIndex: 1,
      explanation:
        '`internal/` packages are visible only to other packages within the same module rooted at the parent of `internal`.',
    },
    {
      kind: 'mcq',
      prompt: 'When does package-level `init()` run?',
      options: [
        'Lazily, on first use of the package',
        'After all package vars are initialized, before main',
        'After main exits',
        'When you call init() yourself',
      ],
      correctIndex: 1,
      explanation:
        'init runs after the file\'s package vars are set, in import-dependency order. main starts after every imported init has finished.',
    },
    {
      kind: 'fill',
      prompt: 'Which directive embeds a file into the binary?',
      acceptedAnswers: ['//go:embed', 'go:embed'],
      explanation: '`//go:embed path` directly above a `string`, `[]byte`, or `embed.FS` variable.',
    },
  ],
};
