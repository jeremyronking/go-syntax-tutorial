import type { Checkpoint } from '../types';

export const compositeTypesCheckpoint: Checkpoint = {
  id: 'composite-types',
  sectionSlug: 'C',
  title: 'Checkpoint: Composite types',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'ct-alias',
      prompt: 'Given `a := []int{1,2,3,4}` and `b := a[:2]`, then `b = append(b, 99)`. What does `fmt.Println(a)` print?',
      options: [
        '[1 2 3 4]',
        '[1 2 99 4] — append reused the backing array',
        '[1 2 99 3 4]',
        'Runtime panic',
      ],
      correctIndex: 1,
      explanation: 'a has spare capacity, so append mutated the backing array in place. Use `a[:2:2]` to cap capacity and avoid this.',
    },
    {
      kind: 'mcq',
      id: 'ct-nilmap',
      prompt: 'Reading from a nil map returns the zero value. What does *writing* to a nil map do?',
      options: ['Returns the zero value', 'Allocates the map', 'Panics with a nil map error', 'Silently does nothing'],
      correctIndex: 2,
      explanation: 'A nil map reads fine; writing panics. Always `make` the map (or use a composite literal) before storing keys.',
    },
    {
      kind: 'mcq',
      id: 'ct-comparable',
      prompt: 'A struct that contains a map field can be compared with `==`.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'Maps (and slices) are not comparable. A struct containing them is not comparable either. Use `reflect.DeepEqual` (or refactor) to compare values.',
    },
    {
      kind: 'mcq',
      id: 'ct-pointer',
      prompt: 'What does `new(T)` return?',
      options: ['A `T` value', 'A `*T` pointing to a zero-valued T', 'A `T` with all fields nil', 'A pointer that may be nil'],
      correctIndex: 1,
      explanation: '`new(T)` allocates a zero-valued T and returns *T. `&T{...}` is similar but lets you set fields inline.',
    },
    {
      kind: 'mcq',
      id: 'ct-slicetricks',
      prompt: 'How do you create a *clone* of a slice (so the clone has its own backing array)?',
      options: [
        '`b := a`',
        '`b := a[:]`',
        '`b := append([]int(nil), a...)` or `b := make([]int, len(a)); copy(b, a)`',
        '`b := &a`',
      ],
      correctIndex: 2,
      explanation: 'Both `a` and `a[:]` share the backing array. The clone must allocate a new array and copy.',
    },
  ],
};

export const functionsCheckpoint: Checkpoint = {
  id: 'functions',
  sectionSlug: 'D',
  title: 'Checkpoint: Functions',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'fn-naked',
      prompt: 'A *naked* `return` does what?',
      options: [
        'Returns the zero values of the named return parameters',
        'Returns the current values of the named return parameters',
        'Causes a compile error if used outside a void function',
        'Returns from the package init() function',
      ],
      correctIndex: 1,
      explanation: 'Naked return sends the current values of the named return parameters. Useful for short functions; harmful in long ones.',
    },
    {
      kind: 'mcq',
      id: 'fn-ptrrecv',
      prompt: 'You have `func (c *Counter) Inc() { c.n++ }`. What receiver type should `Value() int` use?',
      options: [
        'Value receiver `(c Counter)`',
        'Pointer receiver `(c *Counter)`',
        'Either, the method set is the same',
        'No receiver — make it a function',
      ],
      correctIndex: 0,
      explanation: '`Value` is read-only; a value receiver avoids the indirection and documents intent. Stay consistent: pick one receiver style per type.',
    },
    {
      kind: 'mcq',
      id: 'fn-variadic',
      prompt: 'You have `func Sum(xs ...int) int` and a slice `s := []int{1,2,3}`. How do you call Sum with the slice?',
      options: ['`Sum(s)`', '`Sum(s...)`', '`Sum(&s)`', '`Sum(*s)`'],
      correctIndex: 1,
      explanation: 'The `...` spread syntax unpacks the slice as variadic arguments.',
    },
    {
      kind: 'mcq',
      id: 'fn-methodset',
      prompt: 'The method set of `*T` includes...',
      options: [
        'Only value-receiver methods',
        'Only pointer-receiver methods',
        'Both value- and pointer-receiver methods',
        'Methods defined in the same package only',
      ],
      correctIndex: 2,
      explanation: '*T has all of T\'s methods plus its own. T (value) has only the value-receiver methods. That asymmetry is why interfaces often store *T.',
    },
    {
      kind: 'fill',
      id: 'fn-closure-var',
      prompt: 'Name the package providing `errors.New` and `fmt.Errorf` style error helpers (one word).',
      acceptedAnswers: ['errors', 'fmt'],
      explanation: '`errors.New` for sentinel errors, `fmt.Errorf` (with `%w` for wrapping). Both are in the standard library; you don\'t need a third-party package for basic error handling.',
    },
  ],
};
