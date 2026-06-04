# GoTour

An interactive Go syntax & toolchain tutorial. This implementation corresponds
to [issue #1](https://github.com/jeremyronking/go-syntax-tutorial/issues/1).

> **Status:** Phase 01 — project scaffold only. Each subsequent phase lands in
> its own commit on this branch.

## Prerequisites

- Node.js **≥ 20**
- pnpm **≥ 9**

## Commands

```sh
pnpm install        # install dependencies
pnpm dev            # start Vite dev server on http://localhost:5173
pnpm build          # type-check + production build to ./dist
pnpm preview        # serve the production build on http://localhost:5173
pnpm lint           # ESLint (typescript-eslint + react + react-hooks)
pnpm typecheck      # tsc --noEmit
```

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Tailwind CSS (dark-first)
- Monaco editor (added in Phase 05)
- Zustand for state, Fuse.js for search
- `localStorage` for persistence

## Layout

```
.
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig*.json
├── eslint.config.js
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/    # UI primitives
    ├── content/       # lesson registry (Phase 04+)
    ├── lib/           # cross-cutting helpers
    ├── store/         # zustand stores
    ├── pages/         # route components
    └── styles/globals.css
```

## License

MIT
