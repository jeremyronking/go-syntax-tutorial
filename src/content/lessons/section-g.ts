import type { Lesson } from '../types';

// 31. error interface, sentinel errors, errors.Is/As
export const errorInterface: Lesson = {
  slug: 'error-interface',
  title: 'The `error` interface, sentinel errors, `errors.Is` / `errors.As`',
  section: 'G',
  order: 31,
  runMode: 'playground',
  body: `\`error\` is a one-method interface: \`{ Error() string }\`. Anything that
implements it can be returned as an error.

**Sentinel errors** are package-level \`var ErrX = errors.New(...)\` values.
Compare with \`==\` when you mean exactly that value; check with
\`errors.Is(err, ErrX)\` when the error might be wrapped. **Custom error
types** that carry data (e.g. \`*os.PathError\`) are extracted with
\`errors.As(err, &target)\`.`,
  starterCode: `package main

import (
    "errors"
    "fmt"
)

var ErrNegative = errors.New("value must be non-negative")

func Sqrt(x float64) (float64, error) {
    if x < 0 {
        return 0, fmt.Errorf("Sqrt(%g): %w", x, ErrNegative)
    }
    return 1, nil // placeholder
}

func main() {
    _, err := Sqrt(-1)
    if errors.Is(err, ErrNegative) {
        fmt.Println("got expected sentinel:", err)
    }
}
`,
};

// 32. Wrapping
export const errorWrapping: Lesson = {
  slug: 'error-wrapping',
  title: 'Wrapping with `fmt.Errorf("...: %w", err)`',
  section: 'G',
  order: 32,
  runMode: 'playground',
  body: `\`fmt.Errorf("...: %w", err)\` returns an error that wraps \`err\` — the
message gains context, but \`errors.Is\` and \`errors.As\` can still see through
the wrapper to the original cause. Prefer \`%w\` (wrap) over \`%v\` or \`%s\` (string)
when you want the chain to be inspectable.`,
  starterCode: `package main

import (
    "errors"
    "fmt"
)

func read() error {
    return errors.New("disk I/O failure")
}

func process() error {
    if err := read(); err != nil {
        return fmt.Errorf("process: read: %w", err)
    }
    return nil
}

func main() {
    err := process()
    if err != nil {
        fmt.Println("msg:", err)
        if errors.Is(err, errors.Unwrap(err)) {
            fmt.Println("wraps the original")
        }
    }
}
`,
};

// 33. panic / recover
export const panicRecover: Lesson = {
  slug: 'panic-recover',
  title: '`panic` / `recover` and when each is appropriate',
  section: 'G',
  order: 33,
  runMode: 'playground',
  body: `\`panic\` is for "the program cannot continue" — an unrecoverable
invariant violation. **It is not exception handling.** Don't reach for
\`panic\` when you should return an \`error\`.

\`recover\` regains control inside a deferred function; the return value of
the deferred function becomes the value passed to \`recover\`. Use it at
boundaries (HTTP server, RPC handler) where you must keep the process alive,
not as a control flow tool.`,
  starterCode: `package main

import "fmt"

func safeDiv(a, b int) (result int, ok bool) {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("recovered:", r)
            ok = false
        }
    }()
    return a / b, true
}

func main() {
    v, ok := safeDiv(10, 0)
    fmt.Println(v, ok)
    v, ok = safeDiv(10, 2)
    fmt.Println(v, ok)
}
`,
  gotcha: `\`panic\` is **not** exception handling. If you find yourself
catching your own panics to keep the program running, you should have
returned an \`error\` instead.`,
};
