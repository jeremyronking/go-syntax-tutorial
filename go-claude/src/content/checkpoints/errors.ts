import type { Checkpoint } from '../types';

export const errorsCheckpoint: Checkpoint = {
  id: 'cp-errors',
  sectionId: 'errors',
  title: 'Section G · Errors, panic, recover',
  questions: [
    {
      kind: 'mcq',
      prompt: 'How do you wrap an error so `errors.Is` can find it?',
      options: [
        '`fmt.Errorf("ctx: %v", err)`',
        '`fmt.Errorf("ctx: %w", err)`',
        '`errors.Wrap(err, "ctx")`',
        '`error.New("ctx: " + err.Error())`',
      ],
      correctIndex: 1,
      explanation:
        'Use `%w`. `%v` formats the error string but does not preserve the chain; `errors.Wrap` is from a third-party package.',
    },
    {
      kind: 'mcq',
      prompt: '`recover()` works only when called …',
      options: [
        'Inside an `if` statement',
        'Inside a deferred function',
        'In a goroutine that panicked',
        'In any function the panicking goroutine called',
      ],
      correctIndex: 1,
      explanation:
        '`recover` returns non-nil only when invoked from a deferred function in the panicking goroutine.',
    },
    {
      kind: 'mcq',
      prompt: 'When is `panic` the right tool?',
      options: [
        'Anytime you would `throw` in Java',
        'For invariants you should never reach (programmer errors)',
        'For network timeouts',
        'For user input validation',
      ],
      correctIndex: 1,
      explanation:
        'Predictable failures are `error`s. Use panic for "this branch is impossible" / impossible state cases.',
    },
    {
      kind: 'fill',
      prompt: 'Which function checks whether an error chain contains a target sentinel?',
      acceptedAnswers: ['errors.Is', 'Is'],
      explanation: '`errors.Is(err, target)` walks the wrap chain comparing against `target`.',
    },
  ],
};
