# GoTour

GoTour is an interactive learning platform for the Go programming language, inspired by the official "Tour of Go". It runs entirely in the browser using WebAssembly to execute Go code in a local playground, providing a fast and secure learning experience.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) package manager
- [Go](https://golang.org/) (for local backend development/evaluation, though the frontend uses Wasm)

## Local Development

To start the development server:

```bash
pnpm install
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Production Build

To build the project for production:

```bash
pnpm build
```

This will create an optimized build in the `dist` directory. You can preview it locally using:

```bash
pnpm preview
```

## Deployment

GoTour is a static site and can be deployed to any static hosting provider. Here are examples for popular services:

### Fly.io

You can deploy using the official Go static server or standard web servers (like Nginx). Ensure your `fly.toml` is configured to serve the `dist` directory.

### Render

For Render, set up a "Static Site" with:
- Build Command: `pnpm install && pnpm build`
- Publish Directory: `dist`

## Keyboard Shortcuts

- **Cmd/Ctrl + K**: Open the Command Palette to search lessons and checkpoints.
- **Cmd/Ctrl + Enter**: Run the code in the playground.
- **Escape**: Close modals or the Command Palette.

## Available Lessons

- \`hello-world\`
- \`run-vs-build\`
- \`variables\`
- \`constants-iota\`
- \`basic-types\`
- \`strings-runes\`
- \`numeric-types\`
- \`if-statement\`
- \`for-loop\`
- \`loop-variable-capture\`
- \`switch-statement\`
- \`type-switch\`
- \`defer\`
- \`goto-labels\`
- \`arrays\`
- \`slices\`
- \`maps\`
- \`structs\`
- \`pointers\`
- \`functions\`
- \`variadic-functions\`
- \`closures\`
- \`methods\`
- \`interfaces\`
- \`type-assertions\`
- \`embedding\`
- \`stdlib-interfaces\`
- \`generics-type-parameters\`
- \`generics-constraints\`
- \`generics-when-not-to-use\`
- \`errors-interface\`
- \`error-wrapping\`
- \`panic-recover\`
- \`goroutines\`
- \`channels\`
- \`close-range-nil-channel\`
- \`select\`
- \`sync-primitives\`
- \`sync-atomic\`
- \`context\`
- \`packages-exported\`
- \`init-functions\`
- \`modules-internal\`
- \`go-embed\`
- \`reflect-basics\`
- \`unsafe-pointer\`
- \`cgo\`
- \`build-tags\`
- \`go-build-run\`
- \`go-install\`
- \`go-modules\`
- \`go-workspaces\`
- \`go-test-basics\`
- \`go-test-bench-fuzz\`
- \`go-test-race-cover\`
- \`go-fmt\`
- \`go-vet\`
- \`go-doc\`
- \`go-generate\`
- \`go-env\`
- \`cross-compilation\`
- \`ldflags\`
- \`pprof-trace\`
