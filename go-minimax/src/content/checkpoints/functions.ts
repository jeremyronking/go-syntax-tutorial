import type { Checkpoint } from '../types';

export const functionsCheckpoint: Checkpoint = {
  id: 'functions-checkpoint',
  sectionId: 'functions',
  title: 'Checkpoint: functions',
  questions: [
    {
      kind: 'mcq',
      prompt:
        'You have a method that needs to update a field of the receiver. Which receiver type should it use?',
      options: [
        'A value receiver — it is simpler to read',
        'A pointer receiver — a value receiver only gets a copy and cannot mutate the original',
        'Either, they behave identically',
        'A value receiver, and mutate a field of the copy',
      ],
      correctIndex: 1,
      explanation:
        'A value receiver receives a copy of the receiver, so any mutation is lost when the method returns. Use a pointer receiver for mutating methods, and keep one receiver style per type.',
    },
    {
      kind: 'mcq',
      prompt: 'What does `sum(nums...)` do when `nums` is a `[]int`?',
      options: [
        'Passes the slice as a single argument',
        'Spreads the slice into individual arguments',
        'Compiles only if `sum` is variadic',
        'Copies the slice and passes the copy',
      ],
      correctIndex: 1,
      explanation:
        'The `...` in the call spreads the slice into the variadic parameter as individual arguments — exactly as if you had written `sum(nums[0], nums[1], ...)`. Without the `...`, the slice is one argument.',
    },
    {
      kind: 'mcq',
      prompt: 'What does a closure capture?',
      options: [
        'A snapshot of the variable’s value at the time the closure was created',
        'The variable itself — the closure sees its current value',
        'A copy of the enclosing function’s stack',
        'Only package-level variables',
      ],
      correctIndex: 1,
      explanation:
        'A closure captures the variable, not a snapshot. Two closures over the same variable share it, which is what makes counters work.',
    },
    {
      kind: 'mcq',
      prompt: 'How does a Go function report an error?',
      options: [
        'By returning a non-zero exit code',
        'By panicking',
        'By returning it as the last result value, with `nil` meaning success',
        'By printing to stderr',
      ],
      correctIndex: 2,
      explanation:
        'The convention is that the last result is an `error`, and `nil` means success. Callers use the comma-ok form: `n, err := parse(s)`.',
    },
    {
      kind: 'fill',
      prompt:
        'What keyword introduces the variadic parameter in a function signature?',
      acceptedAnswers: ['...', 'variadic', 'ellipsis'],
      explanation:
        '`func sum(nums ...int)` — the `...` before the type makes the last parameter variadic. Inside the function it is a slice.',
    },
  ],
};
