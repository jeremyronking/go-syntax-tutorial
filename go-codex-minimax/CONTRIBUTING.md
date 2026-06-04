# Contributing to GoTour

Thanks for stopping by. This document is short because the workflow is short.

## Adding a new lesson

Lessons live in two places:

1. **Type definition:** `src/content/types.ts` — the `Lesson` type, plus the
   supporting `RunMode`, `TerminalLine`, and `Question` types.
2. **Data files:** one `.ts` file per lesson (or one per section) in
   `src/content/lessons/`. Each file exports a `Lesson` object literal.
3. **Registry:** `src/content/lessons.ts` imports the lesson and adds it to
   the `lessons` array.

### Run modes

- `playground` — runs the lesson's `starterCode` against the Go Playground
  via `/api/compile`. Use this for most lessons.
- `terminal` — pre-baked command + output. Use this for toolchain lessons,
  anything that needs files, multi-package code, or features the Playground
  sandbox forbids (`unsafe`, cgo, etc.). The lesson's `terminalOutput` is an
  array of `{ kind, text }` lines.
- `annotated` — read-only Monaco block. Use this for snippets you want to
  show verbatim without run/edit affordances.

### Gotchas and notes

- `gotcha?: string` — a callout that appears below the prose body.
- `note?: string` — a small italic note (above the body). Use this for
  deterministic-clock warnings on concurrency lessons.

### Checkpoints

Each section may have one or more checkpoints. Add them in
`src/content/checkpoints/phase-XX.ts` (one file per phase that adds any) and
register in `src/content/checkpoints/registry.ts` under the section id.

A `Question` is a tagged union of `mcq` and `fill`. The `fill` question's
`acceptedAnswers` are normalized (lowercased, trimmed) before comparison.

## Development

```sh
pnpm install
pnpm dev
```

`pnpm dev` runs the Vite dev server (with the `/api/compile` proxy) on
http://localhost:5173. The production proxy lives in `server/`:

```sh
pnpm server:dev
```

The dev server expects the production playground endpoint
`https://play.golang.org/compile`. Override with
`PLAYGROUND_UPSTREAM=https://example.invalid` if you need to point at a
different backend.

## Style

- Strict TypeScript: zero `any` outside test files (enforced by ESLint).
- Tailwind utility classes for styling. No CSS-in-JS.
- Comments only where the *why* is non-obvious. The code is the what.
- One commit per phase. (For solo work, fine to bundle — your call.)

## Running the test suite

There is no test suite. The acceptance criterion for each lesson is
"compiles and runs against the live Go Playground." Smoke-test changes to
the proxy with `bash server/smoke.sh`.

## License

By contributing, you agree that your contributions will be licensed under
the project's MIT license.
