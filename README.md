# GoTour

An interactive Go syntax & toolchain tutorial. This implementation corresponds
to [issue #1](https://github.com/jeremyronking/go-syntax-tutorial/issues/1).

## Prerequisites

- Node.js **≥ 20**
- pnpm **≥ 10**
- (Optional) Docker, for building/running the production proxy image

## Commands

```sh
pnpm install        # install dependencies
pnpm dev            # start Vite dev server on http://localhost:5173
pnpm build          # type-check + production build to ./dist
pnpm preview        # serve the production build on http://localhost:5173
pnpm lint           # ESLint (typescript-eslint + react + react-hooks)
pnpm typecheck      # tsc --noEmit
```

The dev server proxies `/api/compile` to `https://play.golang.org/compile`
through Vite. Override with `PLAYGROUND_UPSTREAM=...` in the environment.

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
├── pnpm-workspace.yaml
├── public/
├── server/                # production Playground proxy
│   ├── src/index.ts
│   ├── Dockerfile
│   └── smoke.sh
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

## Deploying the proxy

In production, the browser cannot call the Playground directly (CORS), so the
app expects a small server that exposes `POST /api/compile` and forwards to
the upstream Playground. The default upstream is
`https://play.golang.org/compile`; override with `PLAYGROUND_UPSTREAM`.

### Local

```sh
pnpm server:dev       # tsx watch on :8787
pnpm server:build     # tsc -> server/dist
PORT=8787 PLAYGROUND_UPSTREAM=https://play.golang.org/compile node server/dist/index.js
```

Smoke-test:

```sh
bash server/smoke.sh http://localhost:8787/api/compile
```

### Docker

```sh
docker build -t gotour-server server/
docker run --rm -p 8787:8787 -e PLAYGROUND_UPSTREAM=https://play.golang.org/compile gotour-server
```

### Fly.io (one-liner)

```sh
fly launch --image-label org.opencontainers.image.title=gotour-server --internal-port 8787 \
  --env PLAYGROUND_UPSTREAM=https://play.golang.org/compile
fly deploy
```

### Render

Create a new **Web Service** from the repo, root directory `server/`,
environment `Node`, build command `pnpm install && pnpm build`, start command
`node dist/index.js`. Add env var `PLAYGROUND_UPSTREAM`.

## License

MIT
