# Contributing to GoTour

Thanks for helping out. This is a teaching app, so the bar for a lesson is: **it must be true.**

## The content accuracy rule

Every behavioural claim in a lesson has to be verified against a real Go toolchain before it is
written down. Not "I believe this is how Go works" — run it.

```bash
go version          # note the version; Go's behaviour has changed across releases
cat > /tmp/check.go <<'EOF'
package main

import "fmt"

func main() { fmt.Println("the thing you are about to claim") }
EOF
go run /tmp/check.go
```

For anything the Playground cannot do — module commands, `go vet`, cross-compilation, `cgo`,
`internal/` rules — reproduce it in a scratch module:

```bash
mkdir -p /tmp/gotour-scratch && cd /tmp/gotour-scratch
go mod init example.com/scratch
# ... write the files, run the commands ...
```

Three rules to keep yourself honest:

1. **Do not describe behaviour you have not run.** If the output is not reproducible, cut the claim.
2. **Copy the real output.** Terminal lessons show actual transcripts; do not paraphrase them.
3. **Say which version you checked.** "In Go 1.22 and later" is useful; "always" is usually wrong.

Some things that are commonly written down incorrectly, and are worth double-checking every time:

- A `defer f(x)` evaluates `x` immediately. Only a closure defers the read.
- Map iteration order is genuinely random.
- A nil *pointer* stored in an interface is not a nil interface — `s == nil` is false.
- Unused loop variables do not cause a compile error (before Go 1.22, they *did*).
- A type switch case listing an interface type matches any value implementing it, even in a
  multi-type case.

## Adding a lesson

A lesson lives in one TypeScript file under `src/content/lessons/`, one file per section:

```
src/content/lessons/
├── hello-world.ts       # standalone
├── go-run-vs-build.ts   # standalone
├── section-a.ts         # section A — Language fundamentals
├── section-b.ts         # section B — Control flow
├── section-c.ts
├── section-d.ts
├── section-efg.ts       # sections E, F and G share a file
├── section-h.ts
├── section-i.ts
├── section-j.ts
├── section-k.ts         # barrel for the toolchain section
├── section-k1.ts
├── section-k2.ts
└── section-k3.ts
```

### 1. Write the lesson

Add an exported constant to the right file. The type is `Lesson` from `src/content/types.ts`.

```ts
import type { Lesson } from '../types';

export const myLesson: Lesson = {
  slug: 'my-lesson',
  title: 'What this lesson is about',
  sectionId: 'fundamentals',
  order: 8,
  runMode: 'playground',
  body: `The prose. Markdown, with \`inline code\` and fenced Go blocks.

\`\`\`go
fmt.Println("hello")
\`\`\`
`,
  starterCode: `package main

import "fmt"

func main() {
	fmt.Println("hello")
}
`,
  gotcha: `The one thing people get wrong about this.`,
};
```

| Field | Required | Notes |
|---|---|---|
| `slug` | yes | URL-safe, kebab-case, unique across the tour. It is the last path segment of `/lesson/<slug>`. |
| `title` | yes | Shown in the sidebar, the search palette and the page heading. Keep it under ~60 characters. |
| `sectionId` | yes | One of the `SectionId` values in `src/content/types.ts`. |
| `order` | yes | The lesson's position in the tour. It must be unique and contiguous within the section. |
| `body` | yes | Markdown prose. This is the lesson. |
| `runMode` | yes | See below. |
| `starterCode` | for `playground` and `annotated` | The program in the editor. |
| `terminalOutput` | for `terminal` | The recorded transcript. |
| `streamReplay` | optional | `true` replays stdout in the order the program produced it. |
| `note` | optional | An italic disclaimer rendered above the prose. Concurrency lessons use it. |
| `gotcha` | optional | The trap box at the end of the lesson. |

### 2. Register it

Two places, and both are needed.

**`src/content/lessons/<file>.ts`** — add the lesson to the file's `lessons` record:

```ts
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [
    variables,
    constantsIota,
    myLesson, // <- here
  ].map((lesson) => [lesson.slug, lesson])
);
```

The key is taken from `lesson.slug`, so the record and the lesson can never drift apart. If you
add a new section file, add the same `lessons` export to it.

**`src/content/manifest.ts`** — add a metadata entry:

```ts
{ slug: "my-lesson", title: "What this lesson is about", sectionId: "fundamentals", order: 8 },
```

The manifest is what the sidebar, the landing page and the search palette read, so a lesson that
is missing from it will not appear in the navigation.

**`src/content/lessonLoader.ts`** — add the section to `SECTION_CHUNKS` if this is a new section:

```ts
const SECTION_CHUNKS: Record<string, () => Promise<SectionModule>> = {
  // ...
  'my-section': () => import('./lessons/section-my'),
};
```

If the lesson belongs to an existing section, you do not need to touch the loader — the section
chunk already carries it.

### 3. Update the README

```bash
pnpm readme:slugs
```

This regenerates the lesson index in `README.md` from the manifest.

### 4. Check it

```bash
pnpm typecheck
pnpm lint
pnpm dev
```

Then open the lesson in the browser. For a `playground` lesson, click **Run** and confirm the
output is what your prose says it will be.

## Run modes

### `playground`

The program runs in the browser against `play.golang.org`. Use this when the lesson is about
something the language *does*.

Requirements:

- `starterCode` compiles and runs cleanly against the Playground. The Playground runs
  **linux/amd64**, and its Go version moves over time — check with:

  ```go
  package main

  import (
  	"fmt"
  	"runtime"
  )

  func main() { fmt.Println(runtime.Version()) }
  ```

  Write code that works on the oldest version you are willing to claim, and say so in the prose
  when behaviour changed ("since Go 1.22…").
- No network access, no files outside the sandbox, no `os.Exit` games.
- Build constraints must be satisfied by the Playground's target — `//go:build linux` works,
  `//go:build windows` does not (the sandbox has no matching files and the compile fails).

### `terminal`

A recorded shell transcript. Use this for anything the Playground cannot show: `go build`,
`go mod`, `go test`, `go vet`, `cgo`, `internal/` violations, `//go:embed` failures.

```ts
terminalOutput: [
  { kind: 'command', text: 'go mod init example.com/gotour' },
  { kind: 'stdout', text: 'go: creating new go.mod: module example.com/gotour' },
  { kind: 'command', text: 'go build ./...' },
  { kind: 'stderr', text: 'main.go:6:2: use of internal package … not allowed' },
],
```

**Every line must be real output.** Reproduce the session locally and paste it in. Keep the
transcript short — enough to make the point, not a full session log.

### `annotated`

A static, syntax-highlighted snippet with no runner. Use this when the code is an excerpt rather
than a complete program, or when running it would add nothing.

## Adding a checkpoint

A checkpoint belongs to a section and is authored in its own file under
`src/content/checkpoints/`:

```ts
import type { Checkpoint } from '../types';

export const fundamentalsCheckpoint: Checkpoint = {
  id: 'fundamentals',
  sectionId: 'fundamentals',
  title: 'Language fundamentals checkpoint',
  questions: [
    {
      kind: 'mcq',
      prompt: 'What does `x := 1` do when `x` already exists in an outer scope?',
      options: [
        'Assigns to the outer `x`',
        'Declares a new `x` that shadows the outer one',
        'Is a compile error',
      ],
      correctIndex: 1,
      explanation: 'A short variable declaration always creates a new variable in the current scope.',
    },
    {
      kind: 'fill',
      prompt: 'Which keyword declares a package-level variable?',
      acceptedAnswers: ['var'],
      explanation: '`var` works at package level; `:=` does not.',
    },
  ],
};
```

Then register it in `src/content/checkpoints.ts`:

- Add the section to `SECTIONS_WITH_CHECKPOINT` — this is eager, and it is what makes the
  "checkpoint" link appear in the sidebar.
- Add the chunk to `checkpointChunks`, with the export name:

```ts
'my-section': {
  exportName: 'mySectionCheckpoint',
  load: () => import('./checkpoints/my-section'),
},
```

Question guidance:

- **4–6 questions per checkpoint.** Enough to check understanding, not enough to grind.
- **Every explanation is shown after submitting.** Explain *why*, not just what.
- **Fill-in questions need `acceptedAnswers`.** Match case-insensitively and trim whitespace —
  the checker in `src/lib/checkpoint.ts` does that.
- **A checkpoint never blocks the tour.** Passing at 80% marks the section complete; failing just
  means you can retake it.

## Style

- **Prose is for someone who already programs.** Skip "a variable is a box that holds a value".
  Explain the Go-specific behaviour, the trap, and the fix.
- **Prefer a concrete example over an abstraction.** A ten-line program that prints the surprising
  result teaches more than a paragraph describing it.
- **The gotcha box is the most valuable part.** If a reader would get this wrong, it belongs there.
- **Keep sentences short.** One idea per paragraph.
- British or American spelling, but be consistent within a file.

### Escaping

The prose lives in a TypeScript template literal, so backticks and `${` have to be escaped:

- Inline code: `` \`fmt.Println\` ``
- A fence: `` \`\`\`go `` … `` \`\`\` ``
- A literal `${`: `\${`

This applies to `body`, `gotcha` and `note` alike. It does **not** apply to `starterCode`, which
is also a template literal — a backtick inside a Go *comment* in `starterCode` will break the
file. Use a regular quoted string or restructure the comment.

## Before you open a pull request

```bash
pnpm typecheck && pnpm lint && pnpm build
```

And then actually use the lesson: open it, read it, run it. A lesson that renders but teaches
nothing is not done.

## Code style

- TypeScript is strict, with `noUncheckedIndexedAccess`. No `any`.
- `pnpm format` runs Prettier over everything.
- The design tokens are Tailwind semantic names (`app`, `surface`, `raised`, `fg`, `fg-muted`,
  `fg-subtle`, `line`) plus the `gopher` accent. Do not hard-code hex values in components.
- The tour's prose is split out of the main bundle on purpose. If you add a heavy import to a
  component that renders in the shell, put it behind a dynamic `import()`.

## License

MIT.
