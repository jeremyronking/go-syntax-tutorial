# GoTour — go-deepseek

An interactive Go syntax and toolchain tutorial for experienced engineers. Vite + React 18 +
TypeScript + Tailwind, Monaco editor, and a proxy to the public Go Playground for live execution.

## Prerequisites

- Node 20+
- pnpm 9+

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at http://localhost:5173 |
| `pnpm build` | Type-check and produce `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm format` | Prettier |

The production proxy lives in `server/`; see the README there.

## Layout

```
src/
  components/   UI: layout, sidebar, lesson view, runner, checkpoints
  content/      Typed lesson registry (one module per section)
  lib/          Playground client, storage, search
  pages/        Landing and lesson routes
  store/        zustand stores
```
