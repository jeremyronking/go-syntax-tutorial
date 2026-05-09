################################
# Build: frontend + server
################################
FROM node:22-alpine AS build
WORKDIR /work
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm --filter go-claude-proxy build

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
RUN pnpm install --prod
COPY --from=build /work/server/dist ./dist
COPY --from=build /work/dist ./public
EXPOSE 8787
CMD ["node", "dist/index.js"]
