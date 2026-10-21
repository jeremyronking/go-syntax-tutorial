---
name: add-implementation
description: Deploy a newly merged GoTour implementation (go-<agent>-<model>/) to the home server, route its jking.ai subdomain through the Cloudflare tunnel, and add it to the site/ docs and README. Use when the user says a new agent's version was merged and should be deployed or added to the site.
---

# Add a GoTour implementation

Each implementation is an agent-written React/Vite app with an Express proxy for `/api/compile`. Agents never write the deploy surface, so these steps are always needed. Touch the agent's code only where serving requires it.

Ask the user for anything git can't supply: harness, model, provider, subscription plan, and the public label (folder `go-codex-minimax` → label `go-minimax`, `go-opencode-beam` → `go-beam`).

Work on a feature branch from latest `main`.

## 1. Containerize

1. **Static serving.** If `server/src/index.ts` only proxies, add `STATIC_DIR` static serving (no-cache on `index.html`) plus an `app.get('*')` SPA fallback after the API routes. Copy the block from `go-codex-minimax/server/src/index.ts`.
2. **Top-level `Dockerfile`.** Multi-stage, `node:22-alpine`, `ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0`, `pnpm install --no-frozen-lockfile && pnpm build`. The runtime stage sets `STATIC_DIR=/app/public` and `PORT=8787` and runs the server the way the agent wrote it (compiled `dist/` or `tsx`). Templates: `go-codex-minimax/Dockerfile` (compiled server) and `go-opencode-beam/Dockerfile` (tsx).
3. **`.dockerignore`.** Copy it from `go-codex-minimax/`.
4. **pnpm build approval.** pnpm 10+ ignores `"pnpm": {"onlyBuiltDependencies"}` in package.json and fails with `ERR_PNPM_IGNORED_BUILDS`. Add `pnpm-workspace.yaml` containing `allowBuilds:\n  esbuild: true`, and keep `packages:` if the file already lists any.
5. **Compose.** Add a service to `docker-compose.yml` before `go-landing`. The service name and container name are the folder name, the port is the next free `818x:8787`, and `PLAYGROUND_UPSTREAM` is `https://play.golang.org/compile` unless the server appends `/compile` itself (check the server code).
6. **Verify locally:** `docker build`, then `docker run -p 1818x:8787`. `/` and a deep link like `/lessons/x` must return 200, and a `POST /api/compile` with a `body=` Go program must return `Events` with stdout.

## 2. Site and docs

- `site/index.md`: update the hero count (Four → Five …), add a `features` card, and add a "By the numbers" column, a caveat bullet if anything is unusual, and the agent to the "What this is" paragraph.
- `site/.vitepress/config.ts`: add a sidebar link under Implementations, and update the count in `description` and the footer.
- `site/prompt.md`: list every agent, and update the counts and the app links.
- `README.md`: the same changes as `site/index.md`, plus the folder list.
- The app's own README: add a Docker section.
- Run `cd site && pnpm build` to confirm the site builds.

**Metrics** (keep the method identical across columns): baseline is `458d83c`, and `<P19>` is the agent's Phase 19 commit.
- Lines added: `git diff --numstat 458d83c <P19> -- <dir> | grep -vi pnpm-lock.yaml | awk '{s+=$1} END {print s}'`
- Files created: `git diff --diff-filter=A --name-only 458d83c <P19> -- <dir> | grep -vi pnpm-lock | grep -v specs/ | wc -l`
- Time: wall clock from the Phase 01 commit to the Phase 19 commit. Check `git show --shortstat` on the phase commits first. If they are empty or share one timestamp, git can't time the run: use the user's reported time, label it "(reported)", and add a caveat saying why.

Commit, push, and open a PR (signed `--Claude`).

## 3. Deploy

The server copy at `king@king-ubuntu:/home/king/dev/go-syntax-tutorial` is a plain file copy, not a git clone. zsh doesn't word-split string variables, so pass excludes as an array:

```bash
EX=(--exclude=node_modules --exclude=dist --exclude=.vite --exclude='*.tsbuildinfo' --exclude=.DS_Store --exclude=cache)
rsync -az "${EX[@]}" <dir> site king@king-ubuntu:/home/king/dev/go-syntax-tutorial/
rsync -az docker-compose.yml README.md .dockerignore king@king-ubuntu:/home/king/dev/go-syntax-tutorial/
ssh king@king-ubuntu 'cd /home/king/dev/go-syntax-tutorial && docker compose up -d --build <service> go-landing'
```

## 4. DNS (load /cloudflare-cli first)

Hosts route through the remotely managed tunnel `staging-home-tunnel` (`e0526abc-14d3-4e98-8ea4-0ca659c00eea`). Its config is managed in Cloudflare, not in `/etc/cloudflared`.

1. Run `cf tunnels config get <id>` and save the output to the scratchpad. Insert `{"service":"http://localhost:818x","hostname":"<label>.jking.ai","originRequest":{}}` after the previous go-* rule, and keep the catch-all last. An update replaces the whole list.
2. Dry-run, then diff the old and new ingress lists. Exactly one line should be added.
3. Run `cf tunnels config update <id> --body "$(cat new.json)"`.
4. Run `cf dns records create -z jking.ai --body '{"type":"CNAME","name":"<label>","content":"<id>.cfargotunnel.com","proxied":true}'`, dry-running it first.
5. Verify over HTTPS: the app root, a deep link, `/api/compile`, and that go.jking.ai shows the new card.

## 5. Wrap up

Update the project memory (`project_overview.md`, `references.md` ports). Merge the PR only with the user's go-ahead.
