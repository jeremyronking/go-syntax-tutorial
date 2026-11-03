############################
# Build: frontend + proxy
############################
FROM node:22-alpine AS build
WORKDIR /work
ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
RUN corepack enable
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm build
RUN pnpm --dir server install --no-frozen-lockfile
RUN pnpm --dir server build

############################
# Runtime: proxy + static frontend
############################
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV STATIC_DIR=/app/public
ENV PORT=8787
ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
RUN corepack enable
COPY --from=build /work/server/package.json ./
RUN pnpm install --prod --no-frozen-lockfile
COPY --from=build /work/server/dist ./dist
COPY --from=build /work/dist ./public
EXPOSE 8787
CMD ["node", "dist/index.js"]
