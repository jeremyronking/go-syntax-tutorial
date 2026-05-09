# Contributing to GoTour

Thank you for your interest in improving GoTour! This guide covers how to add a new lesson.

## Quick Start

1. Fork and clone the repository
2. `pnpm install && pnpm dev` to start the dev server
3. Make your changes
4. `pnpm typecheck && pnpm lint && pnpm build` to verify
5. Submit a pull request

## Adding a Lesson

### 1. Create the lesson file

Add a TypeScript file in `src/content/lessons/` or modify an existing section file. Each lesson is a typed object:

```typescript
import type { Lesson } from "../types";

// In the appropriate section file (sectionA.ts, sectionB.ts, etc.):
{
  slug: "my-lesson",           // URL-safe, unique
  title: "My Lesson Title",
  section: "A",               // A-K1, K2, K3
  order: 1,                   // Within its section
  body: "Markdown content...", // Supports code fences, bold, links
  runMode: "playground",      // "playground" | "terminal" | "annotated"
  starterCode: "package main\n\nfunc main() {}",
  gotcha: "Optional — shown in a callout box",
  streamReplay: true,         // Optional — for concurrency lessons
}
```

### 2. Run mode guidance

- **`playground`**: The lesson has a live Monaco editor + Run button. Code runs against the Go Playground.
- **`terminal`**: The lesson shows pre-baked terminal output. Use `terminalOutput` array with `{ kind: "command" | "stdout" | "stderr", text: "..." }`.
- **`annotated`**: Static code block with no controls. Rarely used.

### 3. Register the lesson

1. Export the lesson from its section file
2. Import it in `src/content/lessons.ts`
3. Add it to the `allLessons` array in order

### 4. Add a checkpoint (optional)

If you're adding the last lesson in a section, consider attaching a checkpoint:

```typescript
// In the section file:
export const sectionXCheckpoint: Lesson["checkpoint"] = {
  id: "checkpoint-x",
  sectionSlug: "X",
  questions: [
    {
      type: "mcq",
      prompt: "Question text",
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
      explanation: "Why the answer is correct",
    },
    {
      type: "fill",
      prompt: "Write the expression...",
      acceptedAnswers: ["x := 42"],
      explanation: "Short explanation",
    },
  ],
};
```

### 5. Verify

- `pnpm typecheck` — no errors
- `pnpm build` — builds successfully
- Visit `/lesson/my-lesson` — renders correctly
- Run button works (for playground lessons)
- Terminal output looks right (for terminal lessons)

## Code Style

- No `any` in non-test TypeScript (enforced by ESLint)
- Tailwind CSS only — no UI frameworks (shadcn, MUI, etc.)
- Dark-first design, gopher cyan accent (#00ADD8)
- JetBrains Mono for code

## Questions?

Open an issue on GitHub. Thank you!