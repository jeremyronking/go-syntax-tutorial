import type { Checkpoint } from '../types';

export const errorsCheckpoint: Checkpoint = {
  id: 'errors-checkpoint',
  sectionId: 'errors',
  title: 'Checkpoint: errors, panic & recover',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What is the difference between `%w` and `%v` in `fmt.Errorf`?',
      options: [
        '`%w` wraps the error so `errors.Is`/`errors.As` can find it; `%v` only formats the text',
        '`%w` is for strings and `%v` is for errors',
        'They are aliases',
        '`%v` panics if the argument is nil',
      ],
      correctIndex: 0,
      explanation:
        '`%w` records the wrapped error in the chain so `errors.Is` and `errors.As` can walk it. `%v` formats the message but drops the error from the chain.',
    },
    {
      kind: 'mcq',
      prompt: 'Where must `recover()` be called to work?',
      options: [
        'Anywhere in the function that panicked',
        'In a deferred function of the panicking goroutine',
        'In the caller of the panicking function',
        'In a `catch` block',
      ],
      correctIndex: 1,
      explanation:
        '`recover` only stops a panic when it is called directly from a deferred function of the goroutine that is panicking. Anywhere else it returns nil.',
    },
    {
      kind: 'mcq',
      prompt: 'Which of these is a legitimate use of `panic`?',
      options: [
        'Returning an error the caller could handle',
        'A package `init` that cannot proceed without a required configuration value',
        'An invalid HTTP request',
        'Any failure at all — it is the idiomatic replacement for error returns',
      ],
      correctIndex: 1,
      explanation:
        'Panic is an assertion that the program cannot continue — a bug or an impossible state. Package initialisation that cannot work is the standard case. Anything a caller could handle should be returned as an error.',
    },
    {
      kind: 'mcq',
      prompt: 'What does `errors.As(err, &target)` do?',
      options: [
        'Finds the first error in the chain that matches `target`’s type and assigns it',
        'Converts `err` to `target`’s type',
        'Wraps `err` in `target`',
        'Returns the number of errors in the chain',
      ],
      correctIndex: 0,
      explanation:
        '`errors.As` walks the chain looking for an error assignable to the type of `target`, and assigns it. The second argument must be a pointer to a type implementing `error`.',
    },
    {
      kind: 'fill',
      prompt:
        'Which built-in function creates a new error value with a message? (Name the function.)',
      acceptedAnswers: ['errors.New', 'New'],
      explanation:
        '`errors.New("message")` returns a new error value. It is the right way to create a sentinel error for comparison with `errors.Is`.',
    },
  ],
};
