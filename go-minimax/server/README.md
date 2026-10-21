# go-minimax proxy

Tiny Express service that forwards `POST /api/compile` to the public Go Playground
(`https://play.golang.org/compile`). The Playground blocks browser CORS, so this exists for
production hosting; in development the Vite dev proxy does the same job.

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:8787
```

Configuration:

- `PORT` (default `8787`)
- `PLAYGROUND_UPSTREAM` (default `https://play.golang.org/compile`)
- `STATIC_DIR` (optional) — serve a built SPA from this directory with a client-routing fallback

## Smoke test

```bash
pnpm smoke
```

Posts a hello-world program through the proxy and asserts the Playground response shape
(`Errors` / `Events` / `Status`) and the expected stdout.

To verify the upstream override, point the proxy at a mock:

```bash
PLAYGROUND_UPSTREAM=http://localhost:9999/compile pnpm dev
```

## Deploy

### Fly.io

```bash
fly launch --no-deploy
fly secrets set PLAYGROUND_UPSTREAM=https://play.golang.org/compile
fly deploy
```

### Render

1. New → Web Service → Docker
2. Root directory: `go-minimax/server` (build with the included Dockerfile)
3. Env var: `PLAYGROUND_UPSTREAM=https://play.golang.org/compile`
