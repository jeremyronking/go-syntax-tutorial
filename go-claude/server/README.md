# `go-claude-proxy`

Tiny Express service that forwards `POST /api/compile` to the public Go Playground (`https://play.golang.org/compile`). The Playground blocks browser CORS, so this exists for production hosting; in development the Vite dev proxy does the same job.

## Run locally
```bash
pnpm install
pnpm dev          # http://localhost:8787
```

Configuration:
- `PORT` (default `8787`)
- `PLAYGROUND_UPSTREAM` (default `https://play.golang.org/compile`)

## Smoke test
```bash
pnpm test:smoke
```
Posts a hello-world program directly to the upstream and checks `stdout`.

## Deploy

### Fly.io
```bash
fly launch --no-deploy
fly secrets set PLAYGROUND_UPSTREAM=https://play.golang.org/compile
fly deploy
```

### Render
1. New → Web Service → Docker
2. Root: `go-claude/server`, Build: (Dockerfile), Start: (default `CMD`)
3. Env: `PLAYGROUND_UPSTREAM=https://play.golang.org/compile`
