import type { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    slug: "hello-world",
    title: "Hello, world & program structure",
    section: "Section A \u2014 Language fundamentals",
    sectionSlug: "section-a",
    order: 1,
    body: "Every Go program starts with `package main` and `func main()`. Imports are grouped; unused imports are compile errors.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, GoTour!\")\n}\n",
  },
  {
    slug: "go-run-vs-build",
    title: "go run vs go build",
    section: "Section A \u2014 Language fundamentals",
    sectionSlug: "section-a",
    order: 2,
    body: "`go run` compiles and runs in one step (temp binary). `go build` produces a binary in the current dir (or `-o`). See Section K.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"go run is for dev; go build for artifacts\")\n}\n",
  },
  {
    slug: "variables",
    title: "Variables: var, :=, multiple, blank identifier",
    section: "Section A \u2014 Language fundamentals",
    sectionSlug: "section-a",
    order: 3,
    body: "`var` declares with zero value; `:=` infers. Multiple assignment and `_` blank identifier are idiomatic.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var x int\n    y := 42\n    a, b := 1, 2\n    _, _ = x, y\n    fmt.Println(a, b)\n}\n",
    gotcha: "Zero values differ by type; `:=` only inside functions.",
  },
  {
    slug: "constants-iota",
    title: "Constants & iota",
    section: "Section A \u2014 Language fundamentals",
    sectionSlug: "section-a",
    order: 4,
    body: "`const` for untyped/typed constants. `iota` resets per const block and increments per line.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nconst (\n    Read = 1 << iota\n    Write\n    Exec\n)\n\nfunc main() {\n    fmt.Printf(\"%b %b %b\\n\", Read, Write, Exec)\n}\n",
    gotcha: "iota increments per const spec line, including blank lines.",
  },
  {
    slug: "basic-types",
    title: "Basic types, zero values, conversions",
    section: "Section A \u2014 Language fundamentals",
    sectionSlug: "section-a",
    order: 5,
    body: "No implicit conversions. Zero values make types useful without constructors.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var i int\n    var s string\n    var b bool\n    fmt.Printf(\"%d %q %v\\n\", i, s, b)\n    x := int(3.14)\n    fmt.Println(x)\n}\n",
  },
  {
    slug: "strings-runes",
    title: "Strings, runes, bytes; UTF-8 range",
    section: "Section A \u2014 Language fundamentals",
    sectionSlug: "section-a",
    order: 6,
    body: "Strings are immutable byte slices. `range` decodes UTF-8 into runes.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    s := \"Go \ud83d\udc39\"\n    for i, r := range s {\n        fmt.Printf(\"%d: %U %c\\n\", i, r, r)\n    }\n    fmt.Println(\"bytes:\", len(s))\n}\n",
  },
  {
    slug: "numeric-types",
    title: "Numeric types, overflow, untyped constants",
    section: "Section A \u2014 Language fundamentals",
    sectionSlug: "section-a",
    order: 7,
    body: "Typed overflow wraps (for ints) in Go 1.17+? Actually overflow is a compile error for constants; runtime wraps for typed vars. Untyped constants have arbitrary precision.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    const big = 1e20\n    var x int8 = 127\n    x++\n    fmt.Println(x, big)\n}\n",
    gotcha: "Overflow of untyped constants is a compile error; typed variables wrap.",
  },
  {
    slug: "if-init",
    title: "if (incl. init statement)",
    section: "Section B \u2014 Control flow",
    sectionSlug: "section-b",
    order: 8,
    body: "`if` supports an init statement scoped to the block.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    if v := 42; v > 10 {\n        fmt.Println(\"big\", v)\n    }\n}\n",
  },
  {
    slug: "for-loop",
    title: "for: 3-clause, while-style, infinite, range",
    section: "Section B \u2014 Control flow",
    sectionSlug: "section-b",
    order: 9,
    body: "Go has only `for`. Range over slices/maps/channels/strings.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    for i := 0; i < 3; i++ { fmt.Print(i) }\n    fmt.Println()\n    n := 0\n    for n < 3 { n++ }\n    fmt.Println(n)\n    for { break }\n    for i, v := range []string{\"a\",\"b\"} { fmt.Println(i, v) }\n}\n",
  },
  {
    slug: "loop-var-capture",
    title: "Loop variable capture (pre-1.22 vs 1.22+)",
    section: "Section B \u2014 Control flow",
    sectionSlug: "section-b",
    order: 10,
    body: "Before Go 1.22, all iterations shared one variable. Since 1.22 each iteration has its own.",
    runMode: "playground",
    starterCode: "//go:build go1.22\n\npackage main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 0; i < 3; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            fmt.Println(i)\n        }()\n    }\n    wg.Wait()\n}\n",
    gotcha: "Go 1.22+ gives per-iteration variables; older code needed `i := i`.",
  },
  {
    slug: "switch",
    title: "switch: no fallthrough, expression-less, multi-value",
    section: "Section B \u2014 Control flow",
    sectionSlug: "section-b",
    order: 11,
    body: "No implicit fallthrough. Expression-less switch is idiomatic for long if-chains.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    x := 2\n    switch x {\n    case 1, 2:\n        fmt.Println(\"one or two\")\n    default:\n        fmt.Println(\"other\")\n    }\n    switch {\n    case x > 10:\n        fmt.Println(\"big\")\n    default:\n        fmt.Println(\"small\")\n    }\n}\n",
  },
  {
    slug: "type-switch",
    title: "type switch",
    section: "Section B \u2014 Control flow",
    sectionSlug: "section-b",
    order: 12,
    body: "Type switch asserts dynamic type of an interface value.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc describe(v any) {\n    switch t := v.(type) {\n    case int:\n        fmt.Println(\"int\", t)\n    case string:\n        fmt.Println(\"str\", t)\n    default:\n        fmt.Printf(\"other %T\\n\", t)\n    }\n}\n\nfunc main() {\n    describe(42)\n    describe(\"hi\")\n    describe(3.14)\n}\n",
  },
  {
    slug: "defer",
    title: "defer: LIFO, arg evaluation timing, gotchas",
    section: "Section B \u2014 Control flow",
    sectionSlug: "section-b",
    order: 13,
    body: "`defer` runs at function return, LIFO. Arguments evaluate at defer statement time.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    for i := 0; i < 3; i++ {\n        defer fmt.Println(i)\n    }\n    fmt.Println(\"done\")\n}\n",
    gotcha: "Defer args are evaluated immediately; common gotcha in loops.",
  },
  {
    slug: "goto-labels",
    title: "goto, labels, labeled break/continue",
    section: "Section B \u2014 Control flow",
    sectionSlug: "section-b",
    order: 14,
    body: "`goto` exists; labeled break/continue escape nested loops.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\nouter:\n    for i := 0; i < 3; i++ {\n        for j := 0; j < 3; j++ {\n            if i == 1 && j == 1 {\n                break outer\n            }\n            fmt.Printf(\"%d,%d \", i, j)\n        }\n    }\n    fmt.Println()\n}\n",
  },
  {
    slug: "arrays",
    title: "Arrays: fixed length, value semantics",
    section: "Section C \u2014 Composite types",
    sectionSlug: "section-c",
    order: 15,
    body: "Arrays are values; assigning copies. Length is part of the type.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    a := [3]int{1, 2, 3}\n    b := a\n    b[0] = 99\n    fmt.Println(a, b)\n}\n",
  },
  {
    slug: "slices",
    title: "Slices: header, append, three-index, copy, aliasing",
    section: "Section C \u2014 Composite types",
    sectionSlug: "section-c",
    order: 16,
    body: "Slices share backing arrays; append may alias. Use three-index slicing to limit capacity.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    s := []int{1, 2, 3}\n    t := s[:2]\n    t[0] = 99\n    fmt.Println(s, t)\n    u := append(s, 4)\n    fmt.Println(u)\n}\n",
    gotcha: "Slice aliasing is the #1 Go gotcha; mutations leak through shared backing arrays.",
  },
  {
    slug: "maps",
    title: "Maps: nil zero, comma-ok, delete, iteration order",
    section: "Section C \u2014 Composite types",
    sectionSlug: "section-c",
    order: 17,
    body: "Zero value of map is nil (read ok, write panics). Iteration order is randomized.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    m := map[string]int{\"a\": 1}\n    v, ok := m[\"b\"]\n    fmt.Println(v, ok)\n    delete(m, \"a\")\n    fmt.Println(m)\n    var nilmap map[string]int\n    fmt.Println(nilmap[\"x\"]) // read ok\n}\n",
  },
  {
    slug: "structs",
    title: "Structs: composite literals, tags, anonymous, comparability",
    section: "Section C \u2014 Composite types",
    sectionSlug: "section-c",
    order: 18,
    body: "Structs support tags for JSON/DB. Anonymous fields promote methods. Comparable if all fields comparable.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"encoding/json\"\n    \"fmt\"\n)\n\ntype User struct {\n    Name string `json:\"name\"`\n    Age  int    `json:\"age\"`\n}\n\nfunc main() {\n    u := User{Name: \"Ada\", Age: 30}\n    b, _ := json.Marshal(u)\n    fmt.Println(string(b))\n}\n",
  },
  {
    slug: "pointers",
    title: "Pointers: no arithmetic, new, address of composite",
    section: "Section C \u2014 Composite types",
    sectionSlug: "section-c",
    order: 19,
    body: "No pointer arithmetic. `new(T)` returns *T. Can take address of composite literal.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\ntype P struct{ X int }\n\nfunc main() {\n    p := &P{X: 5}\n    fmt.Println(p.X)\n    q := new(P)\n    q.X = 7\n    fmt.Println(q)\n}\n",
  },
  {
    slug: "functions",
    title: "Functions, multi-return, named returns, naked return",
    section: "Section D \u2014 Functions",
    sectionSlug: "section-d",
    order: 20,
    body: "Multiple returns common. Named returns + naked return for small functions.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc div(a, b int) (q, r int, err error) {\n    if b == 0 {\n        err = fmt.Errorf(\"div by zero\")\n        return\n    }\n    q, r = a/b, a%b\n    return\n}\n\nfunc main() {\n    q, r, err := div(10, 3)\n    fmt.Println(q, r, err)\n}\n",
  },
  {
    slug: "variadic",
    title: "Variadic functions, slice spread with ...",
    section: "Section D \u2014 Functions",
    sectionSlug: "section-d",
    order: 21,
    body: "Variadic params collect into a slice; spread with `...`.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc sum(nums ...int) int {\n    t := 0\n    for _, n := range nums { t += n }\n    return t\n}\n\nfunc main() {\n    fmt.Println(sum(1, 2, 3))\n    s := []int{4, 5}\n    fmt.Println(sum(s...))\n}\n",
  },
  {
    slug: "closures",
    title: "First-class functions & closures",
    section: "Section D \u2014 Functions",
    sectionSlug: "section-d",
    order: 22,
    body: "Functions are values. Closures capture variables by reference.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc counter() func() int {\n    n := 0\n    return func() int { n++; return n }\n}\n\nfunc main() {\n    c := counter()\n    fmt.Println(c(), c(), c())\n}\n",
  },
  {
    slug: "methods",
    title: "Methods, value vs pointer receivers, method sets",
    section: "Section D \u2014 Functions",
    sectionSlug: "section-d",
    order: 23,
    body: "Pointer receivers mutate and satisfy more interfaces. Value receivers work on addressable values.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\ntype T struct{ N int }\n\nfunc (t T) Value() int { return t.N }\nfunc (t *T) Inc() { t.N++ }\n\nfunc main() {\n    t := T{N: 1}\n    t.Inc()\n    fmt.Println(t.Value())\n}\n",
    gotcha: "Use pointer receivers for mutators; consistency across a type's methods.",
  },
  {
    slug: "interfaces",
    title: "Interfaces, implicit satisfaction, any",
    section: "Section E \u2014 Interfaces & polymorphism",
    sectionSlug: "section-e",
    order: 24,
    body: "Satisfaction is implicit. `any` is an alias for `interface{}`.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\ntype Speaker interface { Speak() string }\n\ntype Dog struct{}\nfunc (Dog) Speak() string { return \"woof\" }\n\nfunc main() {\n    var s Speaker = Dog{}\n    fmt.Println(s.Speak())\n    var x any = 42\n    fmt.Println(x)\n}\n",
  },
  {
    slug: "type-assertions",
    title: "Type assertions, comma-ok, type switches",
    section: "Section E \u2014 Interfaces & polymorphism",
    sectionSlug: "section-e",
    order: 25,
    body: "Use comma-ok to avoid panics. Type switches dispatch on dynamic type.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var x any = \"hi\"\n    if s, ok := x.(string); ok {\n        fmt.Println(s)\n    }\n    switch v := x.(type) {\n    case string:\n        fmt.Println(\"string\", v)\n    }\n}\n",
  },
  {
    slug: "embedding",
    title: "Embedding: struct, interface, method promotion",
    section: "Section E \u2014 Interfaces & polymorphism",
    sectionSlug: "section-e",
    order: 26,
    body: "Embedded fields promote methods. Interface embedding composes contracts.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\ntype Base struct{ X int }\nfunc (b Base) Show() { fmt.Println(b.X) }\n\ntype Wrapper struct {\n    Base\n    Y int\n}\n\nfunc main() {\n    w := Wrapper{Base: Base{X: 5}, Y: 9}\n    w.Show()\n}\n",
  },
  {
    slug: "stdlib-interfaces",
    title: "Common stdlib interfaces: error, Stringer, io.Reader/Writer",
    section: "Section E \u2014 Interfaces & polymorphism",
    sectionSlug: "section-e",
    order: 27,
    body: "Implement `Error()`, `String()`, `Read`/`Write` to plug into the ecosystem.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"fmt\"\n    \"strings\"\n)\n\ntype MyErr struct{ Msg string }\nfunc (e MyErr) Error() string { return e.Msg }\n\nfunc main() {\n    var e error = MyErr{\"boom\"}\n    fmt.Println(e)\n    r := strings.NewReader(\"hello\")\n    buf := make([]byte, 3)\n    n, _ := r.Read(buf)\n    fmt.Println(n, string(buf))\n}\n",
  },
  {
    slug: "generics-basics",
    title: "Type parameters, type inference",
    section: "Section F \u2014 Generics",
    sectionSlug: "section-f",
    order: 28,
    body: "Generic functions take type params in brackets; inference often avoids explicit args.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc Map[T, U any](s []T, f func(T) U) []U {\n    out := make([]U, len(s))\n    for i, v := range s { out[i] = f(v) }\n    return out\n}\n\nfunc main() {\n    fmt.Println(Map([]int{1,2,3}, func(n int) int { return n*2 }))\n}\n",
  },
  {
    slug: "constraints",
    title: "Constraints, comparable, ~, type sets",
    section: "Section F \u2014 Generics",
    sectionSlug: "section-f",
    order: 29,
    body: "Constraints are interfaces. `~int` includes types with underlying int. `comparable` for map keys.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc Min[T comparable](a, b T) T {\n    // comparable only; demo with int\n    return a\n}\n\nfunc main() {\n    fmt.Println(\"use constraints from stdlib in real code\")\n}\n",
    gotcha: "`golang.org/x/exp/constraints` may not be in Playground stdlib; use builtin comparable instead.",
  },
  {
    slug: "when-not-generics",
    title: "When not to reach for generics",
    section: "Section F \u2014 Generics",
    sectionSlug: "section-f",
    order: 30,
    body: "Generics add complexity. Prefer interfaces and concrete types until duplication hurts.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"prefer interfaces; generics for containers/algorithms\")\n}\n",
    gotcha: "Generics everywhere is an anti-pattern.",
  },
  {
    slug: "errors",
    title: "error interface, sentinel errors, errors.Is/As",
    section: "Section G \u2014 Errors, panic, recover",
    sectionSlug: "section-g",
    order: 31,
    body: "Errors are values. Sentinels + `errors.Is`; typed errors + `errors.As`.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n)\n\nvar ErrNotFound = errors.New(\"not found\")\n\ntype Wrapped struct{ E error }\nfunc (w Wrapped) Error() string { return w.E.Error() }\nfunc (w Wrapped) Unwrap() error { return w.E }\n\nfunc main() {\n    err := fmt.Errorf(\"wrap: %w\", ErrNotFound)\n    fmt.Println(errors.Is(err, ErrNotFound))\n}\n",
  },
  {
    slug: "error-wrapping",
    title: "Wrapping with fmt.Errorf ... %w",
    section: "Section G \u2014 Errors, panic, recover",
    sectionSlug: "section-g",
    order: 32,
    body: "`%w` makes the error unwrappable; `%v` does not.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n)\n\nfunc main() {\n    base := errors.New(\"base\")\n    w := fmt.Errorf(\"ctx: %w\", base)\n    fmt.Println(errors.Is(w, base))\n    v := fmt.Errorf(\"ctx: %v\", base)\n    fmt.Println(errors.Is(v, base))\n}\n",
  },
  {
    slug: "panic-recover",
    title: "panic / recover and when each is appropriate",
    section: "Section G \u2014 Errors, panic, recover",
    sectionSlug: "section-g",
    order: 33,
    body: "Panic for programmer errors; recover only at boundaries. Not exception handling.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    defer func() {\n        if r := recover(); r != nil {\n            fmt.Println(\"recovered\", r)\n        }\n    }()\n    panic(\"boom\")\n}\n",
    gotcha: "Panic is not exception handling.",
  },
  {
    slug: "goroutines",
    title: "Goroutines: cost, lifecycle",
    section: "Section H \u2014 Concurrency",
    sectionSlug: "section-h",
    order: 34,
    body: "Goroutines are cheap. Always manage lifecycle (WaitGroup/context).",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 0; i < 3; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            fmt.Println(\"hi\", n)\n        }(i)\n    }\n    wg.Wait()\n}\n",
    streamReplay: true,
  },
  {
    slug: "channels",
    title: "Channels: unbuffered vs buffered",
    section: "Section H \u2014 Concurrency",
    sectionSlug: "section-h",
    order: 35,
    body: "Unbuffered synchronizes sender/receiver. Buffered decouples up to capacity.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    ch := make(chan int, 2)\n    ch <- 1\n    ch <- 2\n    fmt.Println(<-ch, <-ch)\n}\n",
    streamReplay: true,
  },
  {
    slug: "close-range",
    title: "close, range over channels, nil channel",
    section: "Section H \u2014 Concurrency",
    sectionSlug: "section-h",
    order: 36,
    body: "close signals completion; range exits when closed. Nil channels block forever (useful in select).",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    ch := make(chan int, 3)\n    ch <- 1; ch <- 2; close(ch)\n    for v := range ch { fmt.Println(v) }\n    var nilch chan int\n    select {\n    case <-nilch:\n    default:\n        fmt.Println(\"nil channel never ready\")\n    }\n}\n",
    streamReplay: true,
  },
  {
    slug: "select-stmt",
    title: "select: default case, timeouts",
    section: "Section H \u2014 Concurrency",
    sectionSlug: "section-h",
    order: 37,
    body: "`select` waits on multiple channel ops. `default` makes it non-blocking; `time.After` for timeouts.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"fmt\"\n    \"time\"\n)\n\nfunc main() {\n    ch := make(chan int)\n    select {\n    case v := <-ch:\n        fmt.Println(v)\n    case <-time.After(10 * time.Millisecond):\n        fmt.Println(\"timeout\")\n    }\n}\n",
    streamReplay: true,
  },
  {
    slug: "sync-primitives",
    title: "sync: Mutex, RWMutex, WaitGroup, Once, Cond",
    section: "Section H \u2014 Concurrency",
    sectionSlug: "section-h",
    order: 38,
    body: "Mutex protects state; WaitGroup waits; Once runs once; Cond for signaling.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var mu sync.Mutex\n    var wg sync.WaitGroup\n    var once sync.Once\n    for i := 0; i < 3; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            once.Do(func() { fmt.Println(\"once\") })\n            mu.Lock()\n            mu.Unlock()\n        }()\n    }\n    wg.Wait()\n}\n",
    streamReplay: true,
  },
  {
    slug: "atomic-memory",
    title: "sync/atomic and the memory model",
    section: "Section H \u2014 Concurrency",
    sectionSlug: "section-h",
    order: 39,
    body: "Atomic ops for simple counters. Memory model defines happens-before; prefer channels/mutexes for complex state.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"fmt\"\n    \"sync/atomic\"\n)\n\nfunc main() {\n    var n int64\n    atomic.AddInt64(&n, 1)\n    fmt.Println(atomic.LoadInt64(&n))\n}\n",
  },
  {
    slug: "context",
    title: "context.Context: cancellation, deadlines, values",
    section: "Section H \u2014 Concurrency",
    sectionSlug: "section-h",
    order: 40,
    body: "Context carries deadlines/cancellation/values across API boundaries. Don't store in structs.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"context\"\n    \"fmt\"\n    \"time\"\n)\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)\n    defer cancel()\n    select {\n    case <-ctx.Done():\n        fmt.Println(ctx.Err())\n    case <-time.After(1 * time.Second):\n        fmt.Println(\"done\")\n    }\n}\n",
    gotcha: "Context anti-pattern: storing in struct fields.",
  },
  {
    slug: "packages-export",
    title: "Packages, exported vs unexported",
    section: "Section I \u2014 Packages & project layout",
    sectionSlug: "section-i",
    order: 41,
    body: "Capitalized identifiers are exported. Package name != directory necessarily but convention.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\ntype Foo struct{ Bar int } // exported\nfunc (f Foo) baz() int { return f.Bar } // unexported\n\nfunc main() { fmt.Println(Foo{Bar: 1}.baz()) }\n",
  },
  {
    slug: "init-order",
    title: "init() order, package-level var init",
    section: "Section I \u2014 Packages & project layout",
    sectionSlug: "section-i",
    order: 42,
    body: "Package-level vars init first (in order), then init() functions, then main. init order across packages by imports.",
    runMode: "playground",
    starterCode: "package main\n\nimport \"fmt\"\n\nvar x = f()\n\nfunc f() int { fmt.Println(\"var init\"); return 1 }\n\nfunc init() { fmt.Println(\"init\") }\n\nfunc main() { fmt.Println(\"main\", x) }\n",
  },
  {
    slug: "internal-imports",
    title: "internal/, import paths, go.mod module path",
    section: "Section I \u2014 Packages & project layout",
    sectionSlug: "section-i",
    order: 43,
    body: "`internal/` restricts imports. Module path declared in go.mod. Multi-package demo (terminal).",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go mod init example.com/demo"}, {"kind": "stdout", "text": "go: creating new go.mod: module example.com/demo"}, {"kind": "command", "text": "go build ./..."}, {"kind": "stdout", "text": ""}],
  },
  {
    slug: "go-embed",
    title: "//go:embed",
    section: "Section I \u2014 Packages & project layout",
    sectionSlug: "section-i",
    order: 44,
    body: "Embed files at build time. Requires files alongside source (terminal demo).",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go run ."}, {"kind": "stdout", "text": "embedded content here"}],
  },
  {
    slug: "reflect-basics",
    title: "reflect: TypeOf, ValueOf, kind vs type",
    section: "Section J \u2014 Reflection & low-level",
    sectionSlug: "section-j",
    order: 45,
    body: "reflect inspects types/values at runtime. Kind is the underlying category.",
    runMode: "playground",
    starterCode: "package main\n\nimport (\n    \"fmt\"\n    \"reflect\"\n)\n\nfunc main() {\n    x := 42\n    t := reflect.TypeOf(x)\n    v := reflect.ValueOf(x)\n    fmt.Println(t, t.Kind(), v.Int())\n}\n",
  },
  {
    slug: "unsafe",
    title: "unsafe.Pointer and unsafe.Sizeof",
    section: "Section J \u2014 Reflection & low-level",
    sectionSlug: "section-j",
    order: 46,
    body: "unsafe bypasses type safety; mention only. Sandbox forbids in Playground (terminal).",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go run main.go"}, {"kind": "stdout", "text": "size of int: 8"}],
  },
  {
    slug: "cgo",
    title: "cgo (awareness)",
    section: "Section J \u2014 Reflection & low-level",
    sectionSlug: "section-j",
    order: 47,
    body: "cgo lets Go call C. Requires C toolchain; disabled in sandbox.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go build"}, {"kind": "stdout", "text": "# example\ncgo not available in sandbox"}],
  },
  {
    slug: "build-tags",
    title: "Build tags //go:build",
    section: "Section J \u2014 Reflection & low-level",
    sectionSlug: "section-j",
    order: 48,
    body: "Conditional compilation via build constraints.",
    runMode: "playground",
    starterCode: "//go:build !windows\n\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"not windows\")\n}\n",
  },
  {
    slug: "go-run-build",
    title: "go run, go build, -o",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 49,
    body: "Build/run basics. `-o` sets output path.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go run ."}, {"kind": "stdout", "text": "hello"}, {"kind": "command", "text": "go build -o app ."}, {"kind": "stdout", "text": ""}, {"kind": "command", "text": "./app"}, {"kind": "stdout", "text": "hello"}],
  },
  {
    slug: "go-install",
    title: "go install and GOBIN",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 50,
    body: "`go install` puts binary in GOBIN (or GOPATH/bin).",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go install ."}, {"kind": "stdout", "text": ""}, {"kind": "command", "text": "which mytool"}, {"kind": "stdout", "text": "/Users/you/go/bin/mytool"}],
  },
  {
    slug: "go-mod",
    title: "go mod init/tidy/get/why/graph/replace/vendor",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 51,
    body: "Module management commands.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go mod tidy"}, {"kind": "stdout", "text": ""}, {"kind": "command", "text": "go mod why github.com/foo/bar"}, {"kind": "stdout", "text": "# github.com/foo/bar\n(main module does not need package ...)"}],
  },
  {
    slug: "go-work",
    title: "go work multi-module workspaces",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 52,
    body: "Workspaces link multiple modules locally.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go work init ./moda ./modb"}, {"kind": "stdout", "text": ""}, {"kind": "command", "text": "go work sync"}, {"kind": "stdout", "text": ""}],
  },
  {
    slug: "go-test-basics",
    title: "go test: table tests, subtests, -run, t.Parallel",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 53,
    body: "Table-driven tests with t.Run subtests.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go test -run TestAdd -v ./..."}, {"kind": "stdout", "text": "=== RUN   TestAdd/case_0\n--- PASS: TestAdd/case_0 (0.00s)\nPASS"}],
  },
  {
    slug: "go-test-bench",
    title: "go test: benchmarks, examples, fuzzing",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 54,
    body: "Benchmarks with b.N; examples serve as docs/tests; fuzzing with -fuzz.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go test -bench=. -benchmem"}, {"kind": "stdout", "text": "BenchmarkAdd-8   1000000000   0.3 ns/op"}],
  },
  {
    slug: "go-test-race",
    title: "go test -race, -cover, -coverprofile",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 55,
    body: "Race detector; coverage reporting.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go test -race -coverprofile=cover.out ./..."}, {"kind": "stdout", "text": "coverage: 85.7% of statements"}, {"kind": "command", "text": "go tool cover -html=cover.out"}],
  },
  {
    slug: "go-fmt",
    title: "go fmt / gofmt / goimports",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 56,
    body: "Canonical formatting; goimports adds imports.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "gofmt -w main.go"}, {"kind": "stdout", "text": ""}, {"kind": "command", "text": "goimports -w main.go"}, {"kind": "stdout", "text": ""}],
  },
  {
    slug: "go-vet",
    title: "go vet and common analyzers",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 57,
    body: "Static analysis for suspicious constructs.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go vet ./..."}, {"kind": "stdout", "text": "# example\n./main.go:10: Printf format %d has arg of wrong type"}],
  },
  {
    slug: "go-doc",
    title: "go doc and pkg.go.dev",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 58,
    body: "Local docs via go doc; published on pkg.go.dev.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go doc fmt.Println"}, {"kind": "stdout", "text": "func Println(a ...any) (n int, err error)"}],
  },
  {
    slug: "go-generate",
    title: "go generate directives",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 59,
    body: "`//go:generate` runs code generators.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go generate ./..."}, {"kind": "stdout", "text": ""}],
  },
  {
    slug: "go-env",
    title: "go env, GOPATH, GOMODCACHE, GOPROXY, GOPRIVATE, GOFLAGS",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 60,
    body: "Environment variables governing toolchain.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go env GOPATH GOMODCACHE GOPROXY"}, {"kind": "stdout", "text": "/Users/you/go\n/Users/you/go/pkg/mod\nhttps://proxy.golang.org,direct"}],
  },
  {
    slug: "cross-compile",
    title: "Cross compilation: GOOS/GOARCH, CGO_ENABLED=0",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 61,
    body: "Build for other platforms.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o app-linux ."}, {"kind": "stdout", "text": ""}, {"kind": "command", "text": "GOOS=darwin GOARCH=arm64 go build -o app-mac ."}, {"kind": "stdout", "text": ""}],
  },
  {
    slug: "ldflags",
    title: "-ldflags stamping, -trimpath, build modes",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 62,
    body: "Inject version via ldflags; trim paths for reproducible builds.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go build -ldflags \"-X main.version=1.2.3\" -trimpath ."}, {"kind": "stdout", "text": ""}],
  },
  {
    slug: "pprof-trace",
    title: "go tool pprof and go tool trace",
    section: "Section K \u2014 Toolchain",
    sectionSlug: "section-k",
    order: 63,
    body: "Profiling CPU/heap and execution traces.",
    runMode: "terminal",
    terminalOutput: [{"kind": "command", "text": "go test -cpuprofile=cpu.out ./..."}, {"kind": "stdout", "text": "PASS"}, {"kind": "command", "text": "go tool pprof cpu.out"}, {"kind": "stdout", "text": "(pprof) top"}],
  },
  {
    "slug": "checkpoint-section-a",
    "title": "Checkpoint: Section A \u2014 Language fundamentals",
    "section": "Section A \u2014 Language fundamentals",
    "sectionSlug": "section-a",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-a",
      "sectionSlug": "section-a",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "What is the zero value of an untyped int?",
          "options": [
            "0",
            "nil",
            "\"\"",
            "false"
          ],
          "correctIndex": 0,
          "explanation": "Numeric zero value is 0."
        },
        {
          "kind": "mcq",
          "prompt": "iota in a const block:",
          "options": [
            "resets each const",
            "increments per line",
            "is a function",
            "only for ints"
          ],
          "correctIndex": 1,
          "explanation": "iota increments per const spec line."
        },
        {
          "kind": "fill",
          "prompt": "Untyped constants have ____ precision.",
          "acceptedAnswers": [
            "arbitrary",
            "unlimited"
          ],
          "explanation": "Untyped constants have arbitrary precision."
        },
        {
          "kind": "mcq",
          "prompt": "Converting float64 to int requires:",
          "options": [
            "implicit cast",
            "explicit conversion",
            "nothing"
          ],
          "correctIndex": 1,
          "explanation": "Go has no implicit conversions."
        },
        {
          "kind": "mcq",
          "prompt": "Range over string yields:",
          "options": [
            "bytes",
            "runes with index"
          ],
          "correctIndex": 1,
          "explanation": "range decodes UTF-8 into runes."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-b",
    "title": "Checkpoint: Section B \u2014 Control flow",
    "section": "Section B \u2014 Control flow",
    "sectionSlug": "section-b",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-b",
      "sectionSlug": "section-b",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "defer arguments evaluate:",
          "options": [
            "at defer time",
            "at return time"
          ],
          "correctIndex": 0,
          "explanation": "Args evaluate immediately at defer statement."
        },
        {
          "kind": "mcq",
          "prompt": "switch cases fall through by default?",
          "options": [
            "yes",
            "no"
          ],
          "correctIndex": 1,
          "explanation": "No implicit fallthrough; use fallthrough keyword."
        },
        {
          "kind": "mcq",
          "prompt": "Go 1.22 loop variable:",
          "options": [
            "shared",
            "per-iteration"
          ],
          "correctIndex": 1,
          "explanation": "1.22 gives per-iteration variables."
        },
        {
          "kind": "fill",
          "prompt": "Expression-less switch is like:",
          "acceptedAnswers": [
            "if/else chain",
            "long if chain"
          ],
          "explanation": "Expression-less switch replaces if-chains."
        },
        {
          "kind": "mcq",
          "prompt": "Labeled break exits:",
          "options": [
            "inner loop",
            "labeled loop"
          ],
          "correctIndex": 1,
          "explanation": "Labeled break targets the labeled statement."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-c",
    "title": "Checkpoint: Section C \u2014 Composite types",
    "section": "Section C \u2014 Composite types",
    "sectionSlug": "section-c",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-c",
      "sectionSlug": "section-c",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "Slice aliasing mutation leaks because:",
          "options": [
            "shared backing array",
            "copy on write",
            "value semantics"
          ],
          "correctIndex": 0,
          "explanation": "Slices share backing arrays."
        },
        {
          "kind": "mcq",
          "prompt": "Map zero value is:",
          "options": [
            "empty map",
            "nil (read ok, write panics)"
          ],
          "correctIndex": 1,
          "explanation": "Nil map reads ok, writes panic."
        },
        {
          "kind": "mcq",
          "prompt": "Arrays are:",
          "options": [
            "reference types",
            "value types"
          ],
          "correctIndex": 1,
          "explanation": "Arrays are values; assignment copies."
        },
        {
          "kind": "mcq",
          "prompt": "Struct tags are used by:",
          "options": [
            "compiler",
            "reflection/encoding"
          ],
          "correctIndex": 1,
          "explanation": "Tags consumed by reflect and encoders."
        },
        {
          "kind": "mcq",
          "prompt": "Taking address of composite literal:",
          "options": [
            "allowed",
            "forbidden"
          ],
          "correctIndex": 0,
          "explanation": "&T{} is allowed."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-d",
    "title": "Checkpoint: Section D \u2014 Functions",
    "section": "Section D \u2014 Functions",
    "sectionSlug": "section-d",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-d",
      "sectionSlug": "section-d",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "Mutator method should use:",
          "options": [
            "value receiver",
            "pointer receiver"
          ],
          "correctIndex": 1,
          "explanation": "Pointer receiver for mutation."
        },
        {
          "kind": "mcq",
          "prompt": "Variadic spread uses:",
          "options": [
            "*",
            "..."
          ],
          "correctIndex": 1,
          "explanation": "Spread with ellipsis."
        },
        {
          "kind": "mcq",
          "prompt": "Closures capture variables by:",
          "options": [
            "value",
            "reference"
          ],
          "correctIndex": 1,
          "explanation": "Closures capture by reference."
        },
        {
          "kind": "mcq",
          "prompt": "Named returns allow:",
          "options": [
            "naked return",
            "no errors"
          ],
          "correctIndex": 0,
          "explanation": "Naked return returns named values."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-e",
    "title": "Checkpoint: Section E \u2014 Interfaces & polymorphism",
    "section": "Section E \u2014 Interfaces & polymorphism",
    "sectionSlug": "section-e",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-e",
      "sectionSlug": "section-e",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "Interface satisfaction is:",
          "options": [
            "explicit",
            "implicit"
          ],
          "correctIndex": 1,
          "explanation": "Implicit satisfaction."
        },
        {
          "kind": "mcq",
          "prompt": "Empty interface alias:",
          "options": [
            "any",
            "interface{}"
          ],
          "correctIndex": 0,
          "explanation": "any aliases interface{}."
        },
        {
          "kind": "mcq",
          "prompt": "Type assertion comma-ok prevents:",
          "options": [
            "panic",
            "compile error"
          ],
          "correctIndex": 0,
          "explanation": "Comma-ok avoids panic."
        },
        {
          "kind": "mcq",
          "prompt": "Embedding promotes:",
          "options": [
            "fields and methods",
            "only fields"
          ],
          "correctIndex": 0,
          "explanation": "Embedded fields promote methods."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-f",
    "title": "Checkpoint: Section F \u2014 Generics",
    "section": "Section F \u2014 Generics",
    "sectionSlug": "section-f",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-f",
      "sectionSlug": "section-f",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "~T in constraints means:",
          "options": [
            "exactly T",
            "underlying type T"
          ],
          "correctIndex": 1,
          "explanation": "~ allows underlying type."
        },
        {
          "kind": "mcq",
          "prompt": "comparable allows:",
          "options": [
            "map keys",
            "slices"
          ],
          "correctIndex": 0,
          "explanation": "comparable for map keys."
        },
        {
          "kind": "mcq",
          "prompt": "Generics everywhere is:",
          "options": [
            "always good",
            "anti-pattern"
          ],
          "correctIndex": 1,
          "explanation": "Prefer interfaces unless duplication hurts."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-g",
    "title": "Checkpoint: Section G \u2014 Errors, panic, recover",
    "section": "Section G \u2014 Errors, panic, recover",
    "sectionSlug": "section-g",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-g",
      "sectionSlug": "section-g",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "errors.Is checks:",
          "options": [
            "identity",
            "wrapped chain"
          ],
          "correctIndex": 1,
          "explanation": "errors.Is traverses Unwrap."
        },
        {
          "kind": "mcq",
          "prompt": "%w vs %v:",
          "options": [
            "%w wrappable",
            "%v wrappable"
          ],
          "correctIndex": 0,
          "explanation": "%w makes it wrappable."
        },
        {
          "kind": "mcq",
          "prompt": "panic is:",
          "options": [
            "exception handling",
            "programmer error signal"
          ],
          "correctIndex": 1,
          "explanation": "Panic is not exception handling."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-h",
    "title": "Checkpoint: Section H \u2014 Concurrency",
    "section": "Section H \u2014 Concurrency",
    "sectionSlug": "section-h",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-h",
      "sectionSlug": "section-h",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "Send on closed channel:",
          "options": [
            "blocks",
            "panics"
          ],
          "correctIndex": 1,
          "explanation": "Sending on closed channel panics."
        },
        {
          "kind": "mcq",
          "prompt": "Nil channel in select:",
          "options": [
            "ready",
            "never ready"
          ],
          "correctIndex": 1,
          "explanation": "Nil channel blocks forever."
        },
        {
          "kind": "mcq",
          "prompt": "Unbuffered channel:",
          "options": [
            "synchronizes",
            "buffered"
          ],
          "correctIndex": 0,
          "explanation": "Unbuffered synchronizes sender/receiver."
        },
        {
          "kind": "mcq",
          "prompt": "select with default is:",
          "options": [
            "blocking",
            "non-blocking"
          ],
          "correctIndex": 1,
          "explanation": "default makes non-blocking."
        },
        {
          "kind": "mcq",
          "prompt": "context values are for:",
          "options": [
            "passing data broadly",
            "request-scoped values"
          ],
          "correctIndex": 1,
          "explanation": "Context values for request-scoped data only."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-i",
    "title": "Checkpoint: Section I \u2014 Packages & project layout",
    "section": "Section I \u2014 Packages & project layout",
    "sectionSlug": "section-i",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-i",
      "sectionSlug": "section-i",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "Exported identifiers are:",
          "options": [
            "lowercase",
            "capitalized"
          ],
          "correctIndex": 1,
          "explanation": "Capitalized = exported."
        },
        {
          "kind": "mcq",
          "prompt": "init() runs:",
          "options": [
            "before main",
            "after main"
          ],
          "correctIndex": 0,
          "explanation": "init runs before main."
        },
        {
          "kind": "mcq",
          "prompt": "internal/ restricts:",
          "options": [
            "imports",
            "exports"
          ],
          "correctIndex": 0,
          "explanation": "internal restricts imports."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-j",
    "title": "Checkpoint: Section J \u2014 Reflection & low-level",
    "section": "Section J \u2014 Reflection & low-level",
    "sectionSlug": "section-j",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-j",
      "sectionSlug": "section-j",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "reflect Kind vs Type:",
          "options": [
            "same",
            "kind is underlying category"
          ],
          "correctIndex": 1,
          "explanation": "Kind is underlying category."
        },
        {
          "kind": "mcq",
          "prompt": "unsafe is:",
          "options": [
            "encouraged",
            "mention only"
          ],
          "correctIndex": 1,
          "explanation": "unsafe is not encouraged."
        },
        {
          "kind": "mcq",
          "prompt": "Build tags syntax:",
          "options": [
            "//go:build",
            "// +build only"
          ],
          "correctIndex": 0,
          "explanation": "Modern uses //go:build."
        }
      ]
    }
  },
  {
    "slug": "checkpoint-section-k",
    "title": "Checkpoint: Section K \u2014 Toolchain",
    "section": "Section K \u2014 Toolchain",
    "sectionSlug": "section-k",
    "order": 999,
    "body": "Answer the questions to mark this section complete.",
    "runMode": "annotated",
    "checkpoint": {
      "id": "checkpoint-section-k",
      "sectionSlug": "section-k",
      "questions": [
        {
          "kind": "mcq",
          "prompt": "go build -o sets:",
          "options": [
            "output path",
            "package"
          ],
          "correctIndex": 0,
          "explanation": "-o sets output path."
        },
        {
          "kind": "mcq",
          "prompt": "go test -race detects:",
          "options": [
            "data races",
            "type errors"
          ],
          "correctIndex": 0,
          "explanation": "Race detector finds data races."
        },
        {
          "kind": "mcq",
          "prompt": "gofmt formatting is:",
          "options": [
            "canonical",
            "optional"
          ],
          "correctIndex": 0,
          "explanation": "gofmt is canonical."
        },
        {
          "kind": "mcq",
          "prompt": "Cross compile uses:",
          "options": [
            "GOOS/GOARCH",
            "CGO only"
          ],
          "correctIndex": 0,
          "explanation": "GOOS/GOARCH matrix."
        },
        {
          "kind": "mcq",
          "prompt": "ldflags -X sets:",
          "options": [
            "version string",
            "file path"
          ],
          "correctIndex": 0,
          "explanation": "-X sets string variable."
        }
      ]
    }
  },
];

export function lessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}
