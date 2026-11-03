# Contributing to GoTour

## Adding a lesson

1. Add the lesson to the module for its section in `src/content/lessons/` (for example `section-c.ts` for composite types). A new lesson can be a new exported `Lesson` object in that file.
2. Give it a unique `slug`, a `title`, the correct `sectionId`, and the next `order` number. Section ids come from `src/content/sections.ts`.
3. Register it by including it in that file's exported array. `src/content/lessons.ts` collects every section module, so no other registration is needed.
4. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Open the lesson in `pnpm dev`.

### Lesson fields

```ts
type Lesson = {
  slug: string;
  title: string;
  sectionId: string;
  order: number;
  body: string;                 // markdown
  runMode: 'playground' | 'terminal' | 'annotated';
  starterCode?: string;
  terminalOutput?: TerminalLine[];
  streamReplay?: boolean;
  concurrencyNote?: boolean;
  gotcha?: string;
  checkpoint?: Checkpoint;
};
```

`TerminalLine` is `{ kind: 'command' | 'stdout' | 'stderr'; text: string }`. Do not include the `$` prompt; the pane adds it.

### Choosing a run mode

- Use `playground` when the standard library can run it on `play.golang.org`. The snippet needs `package main` and `func main`, and must compile and produce output.
- Use `terminal` when the lesson is about toolchain commands, or when the sandbox forbids the behavior (`unsafe`, `cgo`, multi-package layouts, `//go:embed`). Capture real command output rather than writing plausible output.
- Use `annotated` for a read-only snippet or for a checkpoint lesson with no code.

### Prose

Aim for one or two short paragraphs, roughly 150 words. The reader already programs. Explain how Go spells the concept and what trips people up. Put a single gotcha in `gotcha`; it renders in a callout below the code.

Concurrency lessons should set `concurrencyNote: true`, which shows the deterministic fake clock note. Set `streamReplay: true` when output timing is part of the lesson.

### Checkpoints

A checkpoint is a lesson with a `checkpoint` field and `runMode: 'annotated'`. Questions are `mcq` or `fill`:

```ts
{
  kind: 'mcq',
  prompt: 'What happens when you send on a closed channel?',
  options: ['ignored', 'blocks', 'panics', 'reopens'],
  correctIndex: 2,
  explanation: 'Sending on a closed channel panics; only the sender should close, once.',
}
```

Use 3 to 5 questions per section. Prefer traps that appear in real code (slice aliasing, defer timing, receiver choice) over trivia. The checkpoint id is stored in localStorage, so do not reuse an id for a different quiz.

### Adding a section

Add an entry to `src/content/sections.ts` with an `id`, a one-letter label, a title, a blurb, and the slug of its first lesson. The landing page and sidebar derive their lists from that file.

## Style rules

- No `any` outside test files. ESLint fails the build on it.
- Comments only where the reason is not obvious from the code.
- Code samples in prose use fenced blocks; inline code uses backticks.
- Run `pnpm format` before opening a pull request.
