import type { Lesson } from '../types';

const errorInterface: Lesson = {
  slug: 'error-interface',
  title: 'The error interface, sentinels, errors.Is/As',
  sectionId: 'errors',
  order: 31,
  runMode: 'playground',
  body: `\`error\` is \`interface { Error() string }\`. A sentinel is a package-level value callers compare against; \`errors.Is\` walks the wrap chain and compares with \`==\` at each level. \`errors.As\` walks the chain looking for a specific error type and assigns it to your pointer.

Use \`errors.Is\` instead of \`==\` once wrapping exists; \`==\` only matches the outermost error. Use \`errors.As\` when the caller needs fields off a custom error type.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

type ValidationError struct{ Field string }

func (e *ValidationError) Error() string { return "invalid field: " + e.Field }

func lookup(name string) error {
	if name == "" {
		return &ValidationError{Field: "name"}
	}
	return fmt.Errorf("lookup %q: %w", name, ErrNotFound)
}

func main() {
	err := lookup("widget")
	fmt.Println(err)
	fmt.Println("is not found:", errors.Is(err, ErrNotFound))

	err = lookup("")
	var ve *ValidationError
	if errors.As(err, &ve) {
		fmt.Println("validation field:", ve.Field)
	}
}
`,
  gotcha:
    '`err == ErrNotFound` fails across a wrapping boundary. `errors.Is(err, ErrNotFound)` follows the chain; use it for every sentinel comparison.',
};

const errorWrapping: Lesson = {
  slug: 'error-wrapping',
  title: 'Wrapping with %w',
  sectionId: 'errors',
  order: 32,
  runMode: 'playground',
  body: `\`fmt.Errorf("context: %w", err)\` wraps an error and records it in the chain. \`%v\` formats without wrapping; \`%w\` is what preserves \`errors.Is\`/\`errors.As\` behavior. Wrap once per layer, adding context the lower layer cannot know.

Do not wrap twice in the same layer or log and return the same error — both produce noise. The returned error travels; the caller decides whether to log it.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
)

var ErrDiskFull = errors.New("disk full")

func write() error { return ErrDiskFull }

func save() error {
	if err := write(); err != nil {
		return fmt.Errorf("save: %w", err)
	}
	return nil
}

func main() {
	err := save()
	fmt.Println(err)
	fmt.Println("unwrap once:", errors.Unwrap(err))
	fmt.Println("still matches:", errors.Is(err, ErrDiskFull))

	wrapped := fmt.Errorf("api: %w", err)
	fmt.Println(wrapped)
	fmt.Println("two levels deep:", errors.Is(wrapped, ErrDiskFull))
}
`,
  gotcha:
    '`%v` instead of `%w` flattens the chain: the message looks right but `errors.Is` returns false. The difference is invisible in a log line.',
};

const panicRecover: Lesson = {
  slug: 'panic-recover',
  title: 'panic and recover',
  sectionId: 'errors',
  order: 33,
  runMode: 'playground',
  body: `\`panic\` unwinds the stack, running deferred calls, and crashes the program if nothing recovers. \`recover\` inside a deferred function stops that unwind and returns the panic value. It works only when called directly by a deferred function in the panicking goroutine.

Panic is for programmer errors and impossible states — nil dereference, index out of range, broken invariants. It is not exception handling. Recover at goroutine or server boundaries, translate to an error there, and let ordinary errors do the rest.`,
  starterCode: `package main

import (
	"errors"
	"fmt"
)

func safeDivide(a, b int) (result int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("recovered: %v", r)
		}
	}()
	return a / b, nil
}

func main() {
	q, err := safeDivide(10, 2)
	fmt.Println(q, err)

	q, err = safeDivide(1, 0)
	fmt.Println(q, err)

	err = errors.New("ordinary failure")
	fmt.Println("errors stay errors:", err)
}
`,
  gotcha:
    '"panic is not exception handling." Do not use panic/recover for expected failures or to control flow; return an error instead. Recover is a boundary guard, not a catch block.',
};

export const sectionGLessons: Lesson[] = [
  errorInterface,
  errorWrapping,
  panicRecover,
  {
    slug: 'section-g-checkpoint',
    title: 'Section G checkpoint',
    sectionId: 'errors',
    order: 33.5,
    runMode: 'annotated',
    body: 'Four questions on sentinels, wrapping, and the difference between an error and a panic.',
    checkpoint: {
      id: 'checkpoint-errors',
      sectionId: 'errors',
      title: 'Errors checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'An error is wrapped once with `%w`. Which check still succeeds?',
          options: ['err == sentinel', 'errors.Is(err, sentinel)', 'err.Error() == sentinel.Error()', 'errors.As(err, sentinel)'],
          correctIndex: 1,
          explanation:
            'errors.Is walks the wrap chain; direct equality only matches the outermost error.',
        },
        {
          kind: 'mcq',
          prompt: 'What is the practical difference between `%v` and `%w` in `fmt.Errorf`?',
          options: [
            'None; both wrap',
            '%w preserves the error chain for Is/As; %v formats only',
            '%v is faster',
            '%w only works with panics',
          ],
          correctIndex: 1,
          explanation:
            'Only %w links the original error into the chain so errors.Is and errors.As can find it.',
        },
        {
          kind: 'fill',
          prompt: 'Which built-in stops a panic inside a deferred function?',
          acceptedAnswers: ['recover', 'recover()'],
          explanation:
            'recover, called directly from a deferred function, stops the unwind and returns the panic value.',
        },
        {
          kind: 'mcq',
          prompt: 'When is panic appropriate?',
          options: [
            'A file is missing',
            'A user sends bad input',
            'An impossible invariant is violated',
            'A network call times out',
          ],
          correctIndex: 2,
          explanation:
            'Expected failures return errors; panic marks programmer errors and broken invariants.',
        },
      ],
    },
  },
];
