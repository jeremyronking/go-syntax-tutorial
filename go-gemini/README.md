# GoTour

An interactive Go syntax & toolchain tutorial.

## Prerequisites

- Node.js >= 20
- pnpm

## Available Commands

- `pnpm dev`: Start the Vite dev server at localhost:5173
- `pnpm build`: Build the production bundle
- `pnpm preview`: Serve the production bundle locally
- `pnpm lint`: Run ESLint checks
- `pnpm typecheck`: Run TypeScript compilation checks

## Deploying the proxy

To support the live code runner, a proxy server is required to bypass CORS restrictions on the Go Playground.

### Render
1. Create a new Web Service and connect your repository.
2. Root Directory: `server`
3. Environment: `Docker`
4. Set Environment Variable: `PLAYGROUND_UPSTREAM` to `https://play.golang.org/compile`

### Fly.io
From the `server` directory, run:
```bash
fly launch --name go-tour-proxy --dockerfile Dockerfile --env PLAYGROUND_UPSTREAM=https://play.golang.org/compile
fly deploy
```
