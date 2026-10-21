# GoTour (go-opencode-beam)

Interactive Go syntax & toolchain tutorial.

## Prereqs
Node 20+, pnpm.

## Dev
```
pnpm install
pnpm dev
```
Open http://localhost:5173. Proxy at /api/compile.

## Prod
```
pnpm build && pnpm preview
```

## Proxy
```
cd server && pnpm install && pnpm dev
```
Env: PLAYGROUND_UPSTREAM (default https://play.golang.org/compile).

## Docker
```
docker build -t go-opencode-beam .
docker run -p 8787:8787 go-opencode-beam
```
The top-level Dockerfile builds the frontend and runs the proxy, which serves the built app from `STATIC_DIR` with an SPA fallback. In the repo-root `docker-compose.yml` it runs as `go-opencode-beam` on port 8185 (go-beam.jking.ai).

## Keyboard shortcuts
- Cmd/Ctrl+Enter: run snippet
- Cmd/Ctrl+K: search
