FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod=false
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && pnpm install --prod
COPY --from=build /app/dist ./dist
EXPOSE 8787
CMD ["node", "dist/index.js"]
