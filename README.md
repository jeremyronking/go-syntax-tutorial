# GoTour — Interactive Go Syntax & Toolchain Tutorial

An interactive, browser-based Go tutorial for experienced engineers. Learn Go by running real code against the Go Playground.

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** (Corepack or global install)
- **Go** ≥ 1.22 (optional, for local testing of toolchain lessons)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (with Playground proxy)
pnpm dev

# Open http://localhost:5173
```

## Production Build

```bash
pnpm build
pnpm preview
```

## Production Proxy (Express)

The Go Playground blocks browser CORS, so a proxy is needed for production:

```bash
cd server
pnpm install
pnpm dev
# Proxy available at http://localhost:8787/api/compile
```

Set `PLAYGROUND_UPSTREAM` to override the upstream Playground URL (default: `https://play.golang.org/compile`).

### Deploy the Proxy

**Fly.io:**
```bash
cd server
fly launch
fly deploy
```

**Render:**
```bash
# Create a new Web Service pointing to server/
# Build: pnpm install && pnpm build
# Start: pnpm start
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format with Prettier |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Enter` | Run code snippet |
| `Cmd/Ctrl + K` | Open search / command palette |
| `Cmd/Ctrl + K` or `Esc` | Close search palette |

## Lesson Slugs

*(Auto-generated from content registry — coming soon)*

## Tech Stack

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS v4 (dark-first)
- Monaco Editor (Go language)
- Zustand (state + localStorage persistence)
- Fuse.js (client-side search)
- React Router v6
- Express (production Playground proxy)

## License

MIT