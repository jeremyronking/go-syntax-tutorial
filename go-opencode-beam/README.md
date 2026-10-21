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

## Keyboard shortcuts
- Cmd/Ctrl+Enter: run snippet
- Cmd/Ctrl+K: search
