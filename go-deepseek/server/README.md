# go-deepseek proxy

Express proxy for `POST /api/compile` → `https://play.golang.org/compile`. The Go Playground
blocks browser CORS, so both the dev server (Vite proxy) and production go through here.

```bash
pnpm install
pnpm dev        # :8787, default upstream
pnpm test:smoke # compiles a program through the app in-process
```

`PLAYGROUND_UPSTREAM` overrides the upstream URL. Upstream errors and non-200 responses are passed
through unmodified; network failures return Playground-shaped JSON with `Errors` set.
