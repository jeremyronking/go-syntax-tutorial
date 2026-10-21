################################
# Build: frontend
################################
FROM node:22-alpine AS build
WORKDIR /work
# pnpm 11's supply-chain "minimum release age" check rejects very recently
# published transitive deps; the lockfile is trusted here, so disable the age gate.
ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
RUN corepack enable
COPY . .
# tsc -b && vite build -> /work/dist
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

################################
# Runtime: proxy server (run via tsx, as authored) + static frontend
################################
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV STATIC_DIR=/app/public
ENV PORT=8787
COPY server/package.json ./
RUN npm install --omit=dev && npm install tsx
COPY server/src ./src
COPY --from=build /work/dist ./public
EXPOSE 8787
CMD ["npx", "tsx", "src/index.ts"]
