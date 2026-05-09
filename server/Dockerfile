FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY dist/ ./dist/
EXPOSE 8787
CMD ["node", "dist/index.js"]