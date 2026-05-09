import type { Lesson } from "../types";

export const sectionK1: Lesson[] = [
  {
    slug: "go-run-build",
    title: "go run, go build, output paths, -o",
    section: "K1",
    order: 49,
    body: `- \`go run .\` compiles to a temp directory and immediately executes.
- \`go build .\` compiles and leaves the binary in the current directory.
- \`go build -o path .\` specifies the output path.
- \`go run\` is for development; \`go build\` is for production.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"cat main.go"},{"kind":"stdout","text":"package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello!\")\n}"},{"kind":"command","text":"go run ."},{"kind":"stdout","text":"Hello!"},{"kind":"command","text":"go build -o myapp ."},{"kind":"command","text":"./myapp"},{"kind":"stdout","text":"Hello!"},{"kind":"command","text":"go build -o /tmp/gotour ."},{"kind":"command","text":"# -o specifies output path"},{"kind":"command","text":"# go run compiles to temp dir and runs, no binary left behind"}],
  },
  {
    slug: "go-install",
    title: "go install and GOBIN",
    section: "K1",
    order: 50,
    body: `\`go install\` compiles and installs binaries to \`$GOBIN\` (defaulting to \`$GOPATH/bin\`).

- Set \`GOBIN\` to customize the install location.
- Useful for installing CLI tools globally.
- For local development, \`go run .\` is usually preferred.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"go install example.com/myproject@latest"},{"kind":"stdout","text":"# Installs binary to $GOBIN (defaults to $GOPATH/bin)"},{"kind":"command","text":"echo $GOBIN"},{"kind":"stdout","text":"/home/user/go/bin"},{"kind":"command","text":"$GOBIN/myproject"},{"kind":"stdout","text":"Hello!"},{"kind":"command","text":"# go install also works for local packages:"},{"kind":"command","text":"go install ."},{"kind":"stdout","text":"# Installs current module's main package to GOBIN"}],
  },
  {
    slug: "go-mod",
    title: "go mod init/tidy/get/why/replace/vendor",
    section: "K1",
    order: 51,
    body: `Module management commands:

- \`go mod init\` — create a new module.
- \`go mod tidy\` — add missing deps, remove unused ones.
- \`go get pkg@version\` — add or update a dependency.
- \`go mod why pkg\` — explain why a dependency is needed.
- \`go mod graph\` — print the full dependency graph.
- \`go mod vendor\` — copy deps to \`vendor/\` for offline builds.
- \`go mod replace\` — redirect a dependency to a local path or fork.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"mkdir myapp && cd myapp"},{"kind":"command","text":"go mod init example.com/myapp"},{"kind":"stdout","text":"go: creating new go.mod: module example.com/myapp"},{"kind":"command","text":"go get github.com/foo/bar@v1.2.0"},{"kind":"stdout","text":"go: added github.com/foo/bar v1.2.0"},{"kind":"command","text":"go mod tidy"},{"kind":"stdout","text":"# Removes unused deps, adds missing ones"},{"kind":"command","text":"go mod why github.com/foo/bar"},{"kind":"stdout","text":"# github.com/foo/bar\n# myapp imports github.com/foo/bar"},{"kind":"command","text":"go mod vendor"},{"kind":"stdout","text":"# Copies deps to vendor/ directory"},{"kind":"command","text":"go mod graph"},{"kind":"stdout","text":"# Prints module dependency graph"}],
  },
  {
    slug: "go-work",
    title: "go work multi-module workspaces",
    section: "K1",
    order: 52,
    body: `\`go work\` manages multi-module workspaces.

- \`go work init ./mod1 ./mod2\` creates a \`go.work\` file.
- Changes in local modules are immediately visible — no \`go mod replace\` needed.
- \`go work sync\` syncs checksums.
- Ideal for developing multiple modules in tandem.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"go work init ./lib ./cmd"},{"kind":"stdout","text":"# Creates go.work file:"},{"kind":"command","text":"cat go.work"},{"kind":"stdout","text":"go 1.23\n\nuse (\n    ./lib\n    ./cmd\n)"},{"kind":"command","text":"# Edit code in ./lib, changes are immediately"},{"kind":"command","text":"# visible to ./cmd without go mod replace"},{"kind":"command","text":"go work sync"},{"kind":"stdout","text":"# Syncs go.work.sum with module checksums"}],
  },
  {
    slug: "go-env",
    title: "go env, GOPATH, GOMODCACHE, GOPROXY, GOPRIVATE",
    section: "K1",
    order: 53,
    body: `- \`go env\` prints all Go environment variables.
- \`GOPATH\` — default workspace (bin, pkg, src).
- \`GOMODCACHE\` — where downloaded modules are cached.
- \`GOPROXY\` — module proxy (default: \`proxy.golang.org,direct\`).
- \`GOPRIVATE\` — skip proxy for matching modules (private repos).
- \`GOFLAGS\` — default flags for Go commands.`,
    runMode: "terminal",
    terminalOutput: [{"kind":"command","text":"go env"},{"kind":"stdout","text":"GOARCH=\"amd64\"\nGOOS=\"linux\"\nGOPATH=\"/home/user/go\"\nGOMODCACHE=\"/home/user/go/pkg/mod\"\nGOPROXY=\"https://proxy.golang.org,direct\"\nGOPRIVATE=\"\"\nGOFLAGS=\"\""},{"kind":"command","text":"go env GOPATH"},{"kind":"stdout","text":"/home/user/go"},{"kind":"command","text":"# GOPROXY controls where Go downloads modules from"},{"kind":"command","text":"# GOPRIVATE skip proxies for private repos"},{"kind":"command","text":"GOPRIVATE=corp.example.com go mod tidy"},{"kind":"stdout","text":"# Downloads corp.example.com modules directly"}],
  }
];
