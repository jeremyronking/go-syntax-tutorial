import type { Checkpoint } from '../types';

export const controlFlowCheckpoint: Checkpoint = {
  id: 'cp-control-flow',
  sectionId: 'control-flow',
  title: 'Section B · Control flow',
  questions: [
    {
      kind: 'mcq',
      prompt:
        'A function does `x := 1; defer fmt.Println(x); x = 99`. What does the deferred print?',
      options: ['1', '99', 'nothing — defer is skipped', 'Compile error'],
      correctIndex: 0,
      explanation:
        'Deferred call ARGUMENTS are evaluated at the defer statement. `x` was 1 when the defer was registered.',
    },
    {
      kind: 'mcq',
      prompt: 'Cases in a Go `switch` …',
      options: [
        'Fall through by default',
        'Do not fall through; use `fallthrough` to opt in',
        'Cannot use expressions',
        'Require parentheses',
      ],
      correctIndex: 1,
      explanation:
        'Opposite of C: cases break by default. `fallthrough` exists but is rarely the right tool.',
    },
    {
      kind: 'mcq',
      prompt: 'In Go 1.22+, this loop launches three goroutines. What do they print (in some order)?',
      options: [
        '3, 3, 3 — all see the final value',
        '0, 1, 2 — each sees its own iteration value',
        'panic: race detected',
        'Nothing — closures capture by name',
      ],
      correctIndex: 1,
      explanation:
        'Since 1.22 each iteration gets a fresh loop variable, so closures capture per-iteration. Pre-1.22 it would have been 3,3,3.',
    },
    {
      kind: 'mcq',
      prompt: 'Which form correctly bails out of nested loops?',
      options: [
        '`break` (always exits the outermost loop)',
        '`break outer` with `outer:` labeling the outer loop',
        '`exit 1`',
        'Set a sentinel `done` boolean (Go has no other way)',
      ],
      correctIndex: 1,
      explanation:
        'Labeled break targets the labeled loop. `break` alone exits only the innermost loop.',
    },
    {
      kind: 'fill',
      prompt: 'Which keyword schedules a call to run when the surrounding function returns?',
      acceptedAnswers: ['defer'],
      explanation: '`defer` runs LIFO; canonical for resource cleanup.',
    },
  ],
};
