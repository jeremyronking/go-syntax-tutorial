import type { Checkpoint } from '../types';

export const controlFlowCheckpoint: Checkpoint = {
  id: 'control-flow-checkpoint',
  sectionId: 'control-flow',
  title: 'Checkpoint: control flow',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What does this program print?',
      options: [
        '0 0 0',
        '2 1 0',
        '1 2 3',
        'It does not compile — `i` is out of scope in the deferred call',
      ],
      correctIndex: 0,
      explanation:
        '`defer fmt.Println(i)` evaluates `i` immediately, at the `defer` statement, so all three deferred calls capture the value 0. They then run LIFO at the end of `main`. Use `defer func() { fmt.Println(i) }()` to read `i` at call time.',
    },
    {
      kind: 'mcq',
      prompt: 'In Go 1.22+, what does the following print?',
      options: [
        '0 1 2',
        '2 2 2',
        '0 0 0',
        'It does not compile — you cannot take the address of a loop variable',
      ],
      correctIndex: 0,
      explanation:
        'Since Go 1.22 each iteration of a `for` loop gets its own copy of the loop variable, so each goroutine sees a distinct value. Before 1.22 all three goroutines shared one variable and printed 2.',
    },
    {
      kind: 'mcq',
      prompt:
        'A value of dynamic type `*myError` is switched with `switch v := i.(type) { case error, string: ... }`. Does the case match, and what is the type of `v` inside it?',
      options: [
        'It matches (via the `error` half), and `v` keeps the interface type',
        'It matches, and `v` has type `*myError`',
        'It does not match — a multi-type case must match exactly',
        'It matches, and `v` has type `error`',
      ],
      correctIndex: 0,
      explanation:
        'A case that lists an interface type matches any value implementing it, so `*myError` matches `case error, string` on the `error` half. But because the case lists more than one type, `v` keeps the static type of the switched expression — you need an assertion to reach the concrete value. A single-type case would give `v` the type of that one type.',
    },
    {
      kind: 'mcq',
      prompt: 'In a `switch` with an expression, what happens after a matching case body finishes?',
      options: [
        'The switch ends — Go does not fall through',
        'It continues with the next case',
        'It restarts the switch from the first case',
        'It panics',
      ],
      correctIndex: 0,
      explanation:
        'Go switches never fall through implicitly. You can opt in with an explicit `fallthrough` statement, which must be the last statement in the case body.',
    },
    {
      kind: 'mcq',
      prompt:
        'How do you leave *both* loops of a nested `for` from the inner one?',
      options: [
        'Label the outer loop and use `break outer`',
        'Use `break` twice',
        'Use `return` from inside the inner loop',
        'Use `continue` with a label',
      ],
      correctIndex: 0,
      explanation:
        'A plain `break` only leaves the innermost loop. A labeled `break outer` leaves the labeled loop. `continue outer` skips to the next iteration of the outer loop instead of leaving it.',
    },
  ],
};
