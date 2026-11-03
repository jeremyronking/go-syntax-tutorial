import type { Lesson } from '../types';

const ifStatements: Lesson = {
  slug: 'if-statements',
  title: 'if, with an init statement',
  sectionId: 'control-flow',
  order: 8,
  runMode: 'playground',
  body: `\`if\` takes an optional init statement before the condition; anything declared there is scoped to the branch chain. That is the idiomatic place for a function call whose error you are about to check.

Conditions must be boolean — no truthiness. Braces are mandatory, and \`else\` must sit on the closing brace's line.`,
  starterCode: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	if n, err := strconv.Atoi("42"); err == nil {
		fmt.Println("parsed:", n)
	} else {
		fmt.Println("bad input:", err)
	}

	n := 7
	if n%2 == 0 {
		fmt.Println("even")
	} else if n%3 == 0 {
		fmt.Println("divisible by 3")
	} else {
		fmt.Println("neither")
	}
}
`,
  gotcha:
    'Values declared in the init statement do not exist after the `if` chain. This is a feature — no stray `err` leaking into the rest of the function.',
};

const forLoops: Lesson = {
  slug: 'for-loops',
  title: 'for — the only loop',
  sectionId: 'control-flow',
  order: 9,
  runMode: 'playground',
  body: `Go has one loop keyword, \`for\`, in four shapes: three-clause, condition-only (while), bare (infinite), and \`range\`. There is no \`while\` or \`do\`.

\`range\` over a slice yields index and value; over a map it yields key and value; over a string it yields byte offsets and runes. \`break\` and \`continue\` behave as expected, and both can take a label.`,
  starterCode: `package main

import "fmt"

func main() {
	for i := 0; i < 3; i++ {
		fmt.Print(i, " ")
	}
	fmt.Println()

	n := 0
	for n < 3 {
		n++
	}
	fmt.Println("while-style:", n)

	for i := 0; ; i++ {
		if i == 2 {
			break
		}
	}

	for i, v := range []string{"a", "b"} {
		fmt.Println(i, v)
	}
}
`,
  gotcha:
    '`for i := 0; i < n; i++` is not special syntax; all three clauses are optional. `for ; ; {}` is an infinite loop, and `for {}` is too.',
};

const loopVariableCapture: Lesson = {
  slug: 'loop-variable-capture',
  title: 'Loop variable capture (Go 1.22+)',
  sectionId: 'control-flow',
  order: 10,
  runMode: 'playground',
  body: `Before Go 1.22, the loop variables in \`for\` were declared once and reused, so closures captured the final value. Since 1.22, each iteration gets fresh variables, matching the intuition almost everyone had anyway.

The old fix was \`i := i\` inside the loop. That still compiles and is harmless, but it is no longer necessary. Goroutine closures and \`t.Parallel\` subtests were the classic victims.`,
  starterCode: `package main

import "fmt"

func main() {
	var funcs []func() int
	for i := 0; i < 3; i++ {
		funcs = append(funcs, func() int { return i })
	}
	for _, f := range funcs {
		fmt.Print(f(), " ")
	}
	fmt.Println()

	done := make(chan int, 3)
	for i := 0; i < 3; i++ {
		go func() { done <- i }()
	}
	for i := 0; i < 3; i++ {
		fmt.Print(<-done, " ")
	}
	fmt.Println()
}
`,
  gotcha:
    'Under Go 1.21 and earlier, both loops print `3 3 3`. Go 1.22 changed the language semantics, not just the compiler — the code is the same, the result differs.',
};

const switchStatement: Lesson = {
  slug: 'switch',
  title: 'switch: implicit break, expressionless, multi-value',
  sectionId: 'control-flow',
  order: 11,
  runMode: 'playground',
  body: `A Go \`switch\` does not fall through unless you say \`fallthrough\`. Cases accept comma-separated values, and the switch expression itself is optional — \`switch { case cond: }\` is a cleaner \`if/else if\` chain.

The init statement works like \`if\`'s. Type switches use the same keyword with a different form and are covered next.`,
  starterCode: `package main

import "fmt"

func class(n int) string {
	switch {
	case n < 0:
		return "negative"
	case n == 0:
		return "zero"
	default:
		return "positive"
	}
}

func main() {
	for _, n := range []int{-2, 0, 5} {
		fmt.Println(n, class(n))
	}

	switch day := "sat"; day {
	case "sat", "sun":
		fmt.Println("weekend")
	default:
		fmt.Println("weekday")
	}
}
`,
  gotcha:
    '`fallthrough` is allowed only as the final statement of a case and cannot be conditional. Default placement does not matter — it is tried after all other cases.',
};

const typeSwitch: Lesson = {
  slug: 'type-switch',
  title: 'type switch',
  sectionId: 'control-flow',
  order: 12,
  runMode: 'playground',
  body: `\`switch v := x.(type)\` narrows an interface value to its dynamic type, one case at a time. Inside each case, \`v\` has the concrete type. Multiple types in one case leave \`v\` as the interface type.

The usual shape is a function that accepts \`any\` and handles a handful of known types, with a default that either errors or falls back to reflection.`,
  starterCode: `package main

import "fmt"

func describe(v any) string {
	switch x := v.(type) {
	case nil:
		return "nil"
	case int:
		return fmt.Sprintf("int %d", x*2)
	case string:
		return "string " + x
	case []int:
		return fmt.Sprintf("[]int len %d", len(x))
	default:
		return fmt.Sprintf("other %T", x)
	}
}

func main() {
	for _, v := range []any{nil, 21, "go", []int{1, 2}, 3.5} {
		fmt.Println(describe(v))
	}
}
`,
  gotcha:
    'In a multi-type case such as `case int, int64:`, the bound variable keeps the interface type, not a union — you cannot call int methods on it.',
};

const deferStatement: Lesson = {
  slug: 'defer',
  title: 'defer: LIFO, argument timing, loops',
  sectionId: 'control-flow',
  order: 13,
  runMode: 'playground',
  body: `\`defer\` schedules a call to run when the surrounding function returns, in last-in-first-out order. Arguments to the deferred call are evaluated immediately, at the \`defer\` statement — not when it runs.

That timing is the whole gotcha. \`defer fmt.Println(i)\` captures \`i\` now. \`defer func() { fmt.Println(i) }()\` reads \`i\` later, at return.`,
  starterCode: `package main

import "fmt"

func main() {
	for i := 0; i < 3; i++ {
		defer fmt.Println("deferred", i)
	}

	x := 1
	defer fmt.Println("captured:", x)
	x = 99
	defer func() { fmt.Println("closure sees:", x) }()

	fmt.Println("body done")
}
`,
  gotcha:
    'Deferring inside a long loop stacks every call until the function returns. If you need per-iteration cleanup, wrap the body in a function or call it explicitly.',
};

const gotoLabels: Lesson = {
  slug: 'goto-labels',
  title: 'goto, labels, labeled break/continue',
  sectionId: 'control-flow',
  order: 14,
  runMode: 'playground',
  body: `Labels are the escape hatch from nested loops: \`break outer\` exits both loops, \`continue outer\` advances the outer one. \`goto\` jumps within a function under restrictions — it cannot jump over variable declarations, into a block, or across function boundaries.

Most Go code never needs \`goto\`. Labeled break is common enough to be unremarkable; \`goto\` usually signals that a helper function would read better.`,
  starterCode: `package main

import "fmt"

func main() {
outer:
	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			if i*j == 2 {
				fmt.Println("break at", i, j)
				break outer
			}
			if j == 1 {
				continue outer
			}
		}
	}

	i := 0
retry:
	if i < 2 {
		i++
		goto retry
	}
	fmt.Println("goto finished at", i)
}
`,
  gotcha:
    '`break` inside a `switch` or `select` breaks that construct, not an enclosing loop. Add a label to the loop when you mean the loop.',
};

export const sectionBLessons: Lesson[] = [
  ifStatements,
  forLoops,
  loopVariableCapture,
  switchStatement,
  typeSwitch,
  deferStatement,
  gotoLabels,
  {
    slug: 'section-b-checkpoint',
    title: 'Section B checkpoint',
    sectionId: 'control-flow',
    order: 14.5,
    runMode: 'annotated',
    body: 'Five questions on `defer` timing, loop capture, `switch` semantics, and labels — the control-flow mistakes that only show up at runtime.',
    checkpoint: {
      id: 'checkpoint-control-flow',
      sectionId: 'control-flow',
      title: 'Control flow checkpoint',
      questions: [
        {
          kind: 'mcq',
          prompt: 'What does this print? `for i := 0; i < 3; i++ { defer fmt.Print(i) }`',
          options: ['012', '210', '000', '333'],
          correctIndex: 1,
          explanation:
            'Deferred calls run LIFO at return, after i has reached its per-iteration values; the arguments were captured as 0, 1, 2.',
        },
        {
          kind: 'mcq',
          prompt: 'Which defer call prints the final value of `x` after `x = 99`?',
          options: [
            'defer fmt.Println(x)',
            'defer func() { fmt.Println(x) }()',
            'both print 99',
            'neither prints 99',
          ],
          correctIndex: 1,
          explanation:
            'Arguments to a deferred call are evaluated at the defer statement; a closure body reads x at return.',
        },
        {
          kind: 'mcq',
          prompt: 'In Go 1.22+, how many distinct values do loop variables have across iterations of `for i := 0; i < 3; i++`?',
          options: ['One, reused', 'Three, one per iteration', 'Two', 'It depends on GOMAXPROCS'],
          correctIndex: 1,
          explanation:
            'Go 1.22 made loop variables per-iteration, which is why closures no longer all capture the final value.',
        },
        {
          kind: 'mcq',
          prompt: 'What happens at the end of a non-empty `case` in a Go switch?',
          options: [
            'Execution falls through to the next case',
            'Execution exits the switch',
            'The compiler requires an explicit break',
            'Execution restarts the switch',
          ],
          correctIndex: 1,
          explanation:
            'Cases break implicitly; `fallthrough` is the opt-in exception.',
        },
        {
          kind: 'fill',
          prompt: 'Which statement exits both loops at once: `break` with a ___.',
          acceptedAnswers: ['label', 'labeled break', 'label name'],
          explanation:
            '`break outer` targets the labeled outer loop; an unlabeled break only exits the innermost loop, switch, or select.',
        },
      ],
    },
  },
];
