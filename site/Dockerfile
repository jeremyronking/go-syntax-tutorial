# Build the VitePress site, then serve the static output via nginx.
# Build context is the repo root, so we can pull in go-glm/specs/requirements.md
# (the spec page does an @include of it).

FROM node:20-alpine AS build
WORKDIR /work

# Lockfile-free install — pin VitePress in package.json instead.
COPY site/package.json ./site/package.json
RUN corepack enable && cd site && npm install --no-audit --no-fund

# Source files needed at build time.
COPY site ./site
COPY go-glm/specs/requirements.md ./go-glm/specs/requirements.md

RUN cd site && npm run build

FROM nginx:alpine
COPY --from=build /work/site/.vitepress/dist /usr/share/nginx/html
