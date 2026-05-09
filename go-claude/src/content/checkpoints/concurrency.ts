import type { Checkpoint } from '../types';

export const concurrencyCheckpoint: Checkpoint = {
  id: 'cp-concurrency',
  sectionId: 'concurrency',
  title: 'Section H · Concurrency',
  questions: [
    {
      kind: 'mcq',
      prompt: 'Sending on a closed channel does what?',
      options: ['Returns false', 'Reopens the channel', 'Panics', 'Blocks forever'],
      correctIndex: 2,
      explanation:
        'Sending on a closed channel panics. The convention "only senders close" exists precisely to make this impossible.',
    },
    {
      kind: 'mcq',
      prompt: 'A receive from a nil channel does what?',
      options: ['Returns the zero value immediately', 'Panics', 'Blocks forever', 'Compile error'],
      correctIndex: 2,
      explanation:
        'Both send and receive on a nil channel block forever — actually useful in select to disable a branch.',
    },
    {
      kind: 'mcq',
      prompt: 'In a select statement with default, what happens if no case is ready?',
      options: ['Blocks until one is', 'Runs default — non-blocking', 'Panics', 'Loops forever'],
      correctIndex: 1,
      explanation:
        '`default` makes select non-blocking. Without `default`, select blocks until at least one case is ready.',
    },
    {
      kind: 'mcq',
      prompt: 'Which is true of `context.WithTimeout`?',
      options: [
        'You can skip calling cancel() if it timed out',
        'You should `defer cancel()` even on the success path',
        'It returns one value',
        'It panics on cancellation',
      ],
      correctIndex: 1,
      explanation:
        'Always `defer cancel()` to release the context\'s resources, even when you didn\'t hit the timeout.',
    },
    {
      kind: 'fill',
      prompt: 'What method on a context returns a channel that closes when cancelled?',
      acceptedAnswers: ['Done', 'Done()', 'ctx.Done', 'ctx.Done()'],
      explanation: '`ctx.Done()` returns a channel; receive from it to detect cancellation.',
    },
  ],
};
