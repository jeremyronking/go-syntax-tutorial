FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm exec tsc

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8787
ENV PLAYGROUND_UPSTREAM=https://play.golang.org/compile
COPY package.json pnpm-workspace.yaml* ./
RUN corepack enable && pnpm install --prod --frozen-lockfile
COPY --from=build /app/dist ./dist
EXPOSE 8787
CMD ["node", "dist/index.js"]
