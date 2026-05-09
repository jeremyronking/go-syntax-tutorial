---
title: "Phase 02: Go Playground proxy infrastructure"
---

# Phase 02: Go Playground proxy infrastructure

> Issue [#3](https://github.com/jeremyronking/go-syntax-tutorial/issues/3) · open

> Part of [#1](/issues/epic).

## What this phase delivers
A working `POST /api/compile` path in dev (Vite proxy) and prod (`server/` Express app) proxying to `https://play.golang.org/compile`, plus Dockerfile and deployment notes.

## Scope
- Vite dev proxy in `vite.config.ts`: `/api/compile` → `https://play.golang.org/compile`, preserving form-encoding.
- `server/package.json` + `server/src/index.ts`: Express app with `POST /api/compile`. Default port `8787`.
- `PLAYGROUND_UPSTREAM` env var (default `https://play.golang.org/compile`).
- `server/Dockerfile` (Node 20-alpine).
- Smoke test (shell or vitest): `curl` posting `version=2&body=...&withVet=true` returns `Errors`/`Events`/`Status`.
- README: "Deploying the proxy" with Fly.io and Render snippets.

## Acceptance criteria
- [ ] `/api/compile` from dev returns Playground JSON for a valid program.
- [ ] `cd server && pnpm dev` runs prod proxy on `:8787`; same curl works.
- [ ] `docker build server/` succeeds and the container runs.
- [ ] `PLAYGROUND_UPSTREAM` override works (point at a mock and verify).
- [ ] Upstream errors surface unmodified.

## Dependencies
**Requires:** [#2](/issues/phase-01-project-scaffold).
**Unblocks:** [#6](/issues/phase-05-code-runner).

## Out of scope
- Caching, rate limiting, auth — explicitly excluded.

## Decision references
D2.1–D2.5.

---
**Estimate:** 5–7h.

