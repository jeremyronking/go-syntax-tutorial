# Contributing to GoTour

## Adding a lesson

1. **Pick a section.** Sections are defined in `src/content/sections.ts`. The `id` of the section you target goes into the lesson's `sectionId` field.

2. **Pick an order number.** Lessons sort by `order` ascending within their section. Use the next free integer for the section, or pick something between two existing lessons if you're inserting.

3. **Pick a `runMode`:**
   - `'playground'` — fully runnable on the Go Playground. Provide `starterCode`. Optional `streamReplay: true` if the lesson's pedagogical point depends on output timing (concurrency lessons mostly).
   - `'terminal'` — pre-baked terminal output for things the sandbox can't run (toolchain commands, `unsafe`, `cgo`, multi-package projects). Provide `terminalOutput: TerminalLine[]`.
   - `'annotated'` — static syntax-highlighted snippet, no run controls. Provide `starterCode`. Rarely the right choice; prefer `terminal` if you can supply realistic output.

4. **Write the file.** Create `src/content/lessons/<slug>.ts`:

   ```ts
   import type { Lesson } from '../types';

   export const myLesson: Lesson = {
     slug: 'my-lesson',
     title: 'Title that fits the sidebar',
     sectionId: 'fundamentals',          // matches sections.ts
     order: 99,
     runMode: 'playground',
     body: `~150 words of prose. Use code spans for keywords like \`defer\`. Markdown supported.`,
     starterCode: `package main\n\nimport "fmt"\n\nfunc main() { fmt.Println("hi") }\n`,
     gotcha: `Optional. Lives in the bottom callout box. Reserve for non-obvious idioms or surprising behavior.`,
   };
   ```

5. **Register it.** Import the new lesson in `src/content/lessons.ts` and add it to the `lessons` array.

6. **Verify.** `pnpm typecheck && pnpm build && pnpm lint`. Visit `/lesson/<slug>` and run the snippet against the live Playground.

## Adding a checkpoint

A checkpoint belongs to one section. Authoring is similar:

1. Create `src/content/checkpoints/<section-id>.ts`:

   ```ts
   import type { Checkpoint } from '../types';

   export const mySectionCheckpoint: Checkpoint = {
     id: 'cp-my-section',
     sectionId: 'my-section',
     title: 'Section X · Title',
     questions: [
       {
         kind: 'mcq',
         prompt: '…?',
         options: ['…', '…', '…'],
         correctIndex: 1,
         explanation: 'One sentence about why.',
       },
       {
         kind: 'fill',
         prompt: '…?',
         acceptedAnswers: ['answer', 'alt'],
         explanation: '…',
       },
     ],
   };
   ```

2. Register in `src/content/checkpoints.ts` (import + array).

3. Visit `/checkpoint/<section-id>`.

## Style guide

- **Prose target: ~150 words + heavier code.** Senior engineers skim. Trust them; pack the lesson into the snippet.
- **Gotcha boxes** are for the things the language *itself* will surprise the reader with. Don't use them for general best-practice rambling.
- **Concurrency lessons** should set `concurrencyNote: true` so the deterministic-clock note appears.
- **Show real compiler errors** if the lesson covers them — never hand-waved or paraphrased. They're the most important learning signal.
- **Keep snippets self-contained.** No multi-file projects in `playground` lessons.

## Running the proxy locally

```bash
pnpm --filter go-claude-proxy dev
PLAYGROUND_UPSTREAM=https://play.golang.org/compile pnpm --filter go-claude-proxy dev
```

The smoke test (`pnpm --filter go-claude-proxy test:smoke`) round-trips a hello-world program against the upstream.

## Pull requests

- One commit per lesson is fine.
- `pnpm lint && pnpm typecheck && pnpm build` must pass.
- New lessons that meaningfully change navigation should include a screenshot in the PR description.
