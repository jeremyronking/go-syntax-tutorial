import type { Checkpoint } from '../types';

export const lowLevelCheckpoint: Checkpoint = {
  id: 'cp-low-level',
  sectionId: 'low-level',
  title: 'Section J · Reflection & low-level',
  questions: [
    {
      kind: 'mcq',
      prompt: 'For `type Cents int; var c Cents`, what does `reflect.TypeOf(c).Kind()` return?',
      options: ['Cents', 'int', 'reflect.Int', 'reflect.Cents'],
      correctIndex: 2,
      explanation:
        '`Kind` is the underlying classification (`reflect.Int` here). `Type` is `main.Cents`.',
    },
    {
      kind: 'mcq',
      prompt: 'What does `unsafe.Sizeof(struct{ a int32; b int32 }{})` typically return on amd64?',
      options: ['4', '8', '16', 'undefined'],
      correctIndex: 1,
      explanation: 'Two int32 fields side by side total 8 bytes (no padding needed for alignment).',
    },
    {
      kind: 'mcq',
      prompt: 'A file with `//go:build linux && amd64` will …',
      options: [
        'Compile only on linux/amd64; otherwise the file is skipped',
        'Always compile but log a warning',
        'Compile only with `-tags linux,amd64`',
        'Be ignored entirely',
      ],
      correctIndex: 0,
      explanation:
        'Build constraints gate the file based on GOOS, GOARCH, and custom tags. The file is silently skipped when constraints don\'t match.',
    },
  ],
};
