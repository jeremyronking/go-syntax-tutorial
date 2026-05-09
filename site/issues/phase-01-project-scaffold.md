---
title: "Phase 01: Project scaffold & dev environment"
---

# Phase 01: Project scaffold & dev environment

> Issue [#2](https://github.com/jeremyronking/go-syntax-tutorial/issues/2) · open

> Part of [#1](/issues/epic).

## What this phase delivers
A working Vite + React 18 + TypeScript + Tailwind dev environment with the project file structure, lint/format tooling, and dark-first theme tokens. No app behavior yet — just a "hello GoTour" placeholder.

## Scope
- `package.json` with pnpm, Node ≥ 20 engines, scripts: `dev`, `build`, `preview`, `lint`, `typecheck`.
- `vite.config.ts` with React plugin (proxy added in Phase 02).
- `tailwind.config.ts` + `postcss.config.js`. Theme tokens: dark-first, accent `#00ADD8`, JetBrains Mono via `@fontsource/jetbrains-mono`.
- `tsconfig.json` with `strict: true`.
- ESLint (typescript-eslint, react, react-hooks) + Prettier; rule banning `any` outside `*.test.ts`.
- `src/main.tsx`, `src/App.tsx` rendering a placeholder.
- Empty trees for `src/components/`, `src/content/`, `src/lib/`, `src/store/`, `server/`.
- README skeleton with prereqs and command list.

## Acceptance criteria
- [ ] `pnpm install && pnpm dev` boots Vite at `localhost:5173` showing the placeholder.
- [ ] `pnpm build && pnpm preview` produces a working production preview.
- [ ] `pnpm lint` and `pnpm typecheck` pass with zero warnings.
- [ ] No `any` in `src/` (verified by ESLint).
- [ ] Tailwind dark theme renders gopher-cyan accent on the placeholder.

## Dependencies
**Requires:** None (foundation phase).
**Unblocks:** [#3](/issues/phase-02-playground-proxy), [#4](/issues/phase-03-layout-routing).

## Out of scope
- Routing (Phase 03). Lesson content. Any runtime behavior.

## Decision references
D1.1, D1.5, D8.1–D8.6, D11.2.

---
**Estimate:** 5–7h.

