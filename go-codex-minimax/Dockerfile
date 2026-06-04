################################
# Build: frontend + server
################################
FROM node:22-alpine AS build
WORKDIR /work
# pnpm 11's supply-chain "minimum release age" check rejects very recently
# published transitive deps (e.g. electron-to-chromium); the lockfile is trusted
# here, so disable the age gate for a reproducible build.
ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
RUN corepack enable
COPY . .
# Frontend (tsc -b && vite build -> /work/dist)
RUN pnpm install --no-frozen-lockfile
RUN pnpm build
# Server (tsc -> /work/server/dist)
RUN pnpm --dir server build

################################
# Runtime: server prod deps + static frontend
################################
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV STATIC_DIR=/app/public
ENV PORT=8787
RUN corepack enable
COPY --from=build /work/server/package.json ./
RUN pnpm install --prod --no-frozen-lockfile
COPY --from=build /work/server/dist ./dist
COPY --from=build /work/dist ./public
EXPOSE 8787
CMD ["node", "dist/index.js"]
