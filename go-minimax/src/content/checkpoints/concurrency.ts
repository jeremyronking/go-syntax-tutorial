import type { Checkpoint } from '../types';

export const concurrencyCheckpoint: Checkpoint = {
  id: 'concurrency-checkpoint',
  sectionId: 'concurrency',
  title: 'Checkpoint: concurrency',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What happens if a goroutine sends on a channel that has already been closed?',
      options: [
        'The send blocks forever',
        'The send panics with "send on closed channel"',
        'The send succeeds and the value is discarded',
        'The channel is reopened',
      ],
      correctIndex: 1,
      explanation:
        'Sending on a closed channel panics. Only the sender closes a channel, and only once. Receiving from a closed channel is safe — it returns the zero value with `ok == false`.',
    },
    {
      kind: 'mcq',
      prompt: 'What does a `select` with a `default` case do when no other case is ready?',
      options: [
        'It blocks until a case becomes ready',
        'It takes the `default` branch immediately',
        'It panics',
        'It retries in a tight loop',
      ],
      correctIndex: 1,
      explanation:
        'The `default` case makes a `select` non-blocking: if no other case is ready, `default` runs straight away. That is how you write a non-blocking send or receive.',
    },
    {
      kind: 'mcq',
      prompt: 'What does receiving from a nil channel do?',
      options: [
        'It returns the zero value immediately',
        'It panics',
        'It blocks forever',
        'It closes the channel',
      ],
      correctIndex: 2,
      explanation:
        'A nil channel blocks forever — it neither sends nor receives. Inside a `select` a nil channel is never ready, so that case is simply skipped, which is a clean way to disable a branch.',
    },
    {
      kind: 'mcq',
      prompt: 'Which statement about `select` is true?',
      options: [
        'Cases are evaluated in source order, so the first listed wins',
        'Exactly one ready case is chosen, pseudo-randomly',
        'All ready cases run',
        'It always blocks until every case is ready',
      ],
      correctIndex: 1,
      explanation:
        'A `select` picks exactly one ready case, and when several are ready the choice is pseudo-random — not by priority or source order. With no ready case and no `default`, it blocks.',
    },
    {
      kind: 'mcq',
      prompt: 'You need to increment a counter from many goroutines. What is the minimum correct approach?',
      options: [
        'A plain `int` — the writes are "close enough"',
        'A mutex, or an atomic type such as `atomic.Int64`',
        'A buffered channel with capacity 1',
        'A `sync.Once`',
      ],
      correctIndex: 1,
      explanation:
        'Concurrent writes to a shared variable are a data race. Use a mutex to guard the critical section, or an atomic type for a single counter. `sync.Once` runs a function once — it is not a general lock.',
    },
  ],
};
