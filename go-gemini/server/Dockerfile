FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json ./
# We can use npm for docker builds to avoid pnpm setup overhead
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV PORT=8787
ENV PLAYGROUND_UPSTREAM=https://play.golang.org/compile
EXPOSE 8787

CMD ["npm", "start"]
