import type { Checkpoint } from '../types';

export const concurrencyCheckpoint: Checkpoint = {
  id: 'concurrency',
  sectionSlug: 'H',
  title: 'Checkpoint: Concurrency',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'conc-send-closed',
      prompt: 'You send a value on a closed channel. What happens?',
      options: [
        'The value is silently dropped',
        'A panic with "send on closed channel"',
        'A deadlock',
        'A compile error',
      ],
      correctIndex: 1,
      explanation: 'Sending on a closed channel panics. Only the sender should call close, and only once.',
    },
    {
      kind: 'mcq',
      id: 'conc-select-default',
      prompt: 'A `select` with a `default` case and no other ready case...',
      options: [
        'Blocks until one is ready',
        'Fires the `default` immediately (non-blocking)',
        'Deadlocks',
        'Compiles but never runs',
      ],
      correctIndex: 1,
      explanation: 'A `default` case turns the select into a non-blocking check.',
    },
    {
      kind: 'mcq',
      id: 'conc-unbuffered',
      prompt: 'An unbuffered channel...',
      options: [
        'Buffers up to one value',
        'Blocks the sender until a receiver is ready, and vice versa',
        'Drops sends when no receiver is ready',
        'Panics if you use it',
      ],
      correctIndex: 1,
      explanation: 'Unbuffered channels are synchronous: both sides must rendezvous. Buffered channels decouple them up to the buffer size.',
    },
    {
      kind: 'mcq',
      id: 'conc-nilchan',
      prompt: 'A nil channel (a channel variable set to nil)...',
      options: [
        'Panics on send/receive',
        'Blocks forever on send and receive',
        'Is a closed channel',
        'Acts like an empty buffer',
      ],
      correctIndex: 1,
      explanation: 'A nil channel blocks forever on both operations. That\'s a useful trick in `select` to disable a case.',
    },
    {
      kind: 'fill',
      id: 'conc-context-arg',
      prompt: 'The first argument to a function that takes a context.Context is conventionally named what? (one word)',
      acceptedAnswers: ['ctx'],
      explanation: 'By convention: `func F(ctx context.Context, ...)`. The linter and Go community expect this name.',
    },
  ],
};
