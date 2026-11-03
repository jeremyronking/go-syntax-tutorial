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

## Deploying the proxy

The app is static; only the proxy needs a host. Build the image and run it on port 8787:

```bash
docker build -t go-deepseek-proxy server/
docker run -p 8787:8787 -e PLAYGROUND_UPSTREAM=https://play.golang.org/compile go-deepseek-proxy
```

- **Fly.io** — `fly launch --dockerfile server/Dockerfile`, then `fly deploy` and point the static
  host's `/api/compile` at the app's hostname.
- **Render** — create a Web Service from this repo, root directory `server/`, Dockerfile path
  `Dockerfile`, and set `PLAYGROUND_UPSTREAM` in the environment.

`PLAYGROUND_UPSTREAM` defaults to `https://play.golang.org/compile`. Upstream errors are passed
through unmodified.

## Layout

```
src/
  components/   UI: layout, sidebar, lesson view, runner, checkpoints
  content/      Typed lesson registry (one module per section)
  lib/          Playground client, storage, search
  pages/        Landing and lesson routes
  store/        zustand stores
```
