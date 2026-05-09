# GoTour (`go-claude`)

Interactive Go syntax & toolchain tutorial. Vite + React + TypeScript + Tailwind.

## Prerequisites
- Node ≥ 20
- pnpm ≥ 9

## Commands
```bash
pnpm install
pnpm dev          # Vite dev server on http://localhost:5173
pnpm build        # production build
pnpm preview      # serve the production build
pnpm typecheck
pnpm lint
pnpm format
```

## Project layout
```
go-claude/
├── src/
│   ├── components/
│   ├── content/
│   ├── lib/
│   ├── store/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── server/                # Express proxy (added in Phase 02)
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

## Code execution
Snippets compile against the public Go Playground. In dev, Vite proxies `/api/compile` → `https://play.golang.org/compile`. In prod, run the Express service in [`server/`](./server/README.md) and point your hosting at it.

```bash
# from this directory
pnpm --filter go-claude-proxy test:smoke   # round-trip a hello-world against the upstream
pnpm --filter go-claude-proxy dev          # run the prod-style proxy on :8787
```

Subsequent phases add the layout, the lesson framework, the code runner, content, and polish. See repo issue #1 for the phase tracker.
