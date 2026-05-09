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

Subsequent phases add the Playground proxy, the layout, the lesson framework, the code runner, content, and polish. See repo issue #1 for the phase tracker.
