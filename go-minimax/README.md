# GoTour (go-minimax)

An interactive tour of Go's **language syntax** and **standard toolchain**, written for engineers
who already know how to program. Every lesson is a short prose note plus a snippet you can actually
run against the Go Playground.

Dark-first, IDE-adjacent, no fluff.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 20 | `node --version` |
| pnpm | ≥ 9 | `corepack enable pnpm` if you don't have it |
| Docker | optional | only needed to build the proxy image |
| Go | optional | only needed to reproduce the terminal-pane transcripts locally |

## Commands

```bash
pnpm install        # install workspace deps (app + server)

pnpm dev            # Vite dev server on http://localhost:5173
pnpm build          # typecheck + production bundle into dist/
pnpm preview        # serve the production bundle on http://localhost:4173
pnpm lint           # ESLint (no `any` outside tests)
pnpm typecheck      # tsc --noEmit
pnpm format         # Prettier, write mode

cd server && pnpm install && pnpm dev   # production proxy on :8787
```

## Project layout

```
.
├── index.html
├── vite.config.ts            # dev server + /api/compile proxy (Phase 02)
├── tailwind.config.ts        # design tokens
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/           # Layout, Sidebar, CodeRunner, …
│   ├── content/              # typed lesson registry + authored lessons
│   ├── lib/                  # playground client, search, storage helpers
│   ├── store/                # zustand stores (progress, theme, sidebar)
│   └── styles/globals.css
├── server/                   # Express proxy for POST /api/compile
└── README.md
```

## Deploying the proxy

The Go Playground compile endpoint does not send CORS headers, so the browser cannot call it
directly. Both the dev server and the production server proxy `POST /api/compile` to
`https://play.golang.org/compile`.

- **Dev** — Vite proxies `/api/compile` automatically (see `vite.config.ts`).
- **Prod** — run `server/`, either directly or as a container.

The upstream is overridable with the `PLAYGROUND_UPSTREAM` environment variable
(default `https://play.golang.org/compile`).

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + Enter` | Run the focused snippet |
| `Cmd/Ctrl + K` | Open the command palette |

## License

MIT
