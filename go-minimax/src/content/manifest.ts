import type { SectionId } from './types';

/**
 * The manifest: every lesson in the tour, in reading order.
 *
 * The tour's prose is by far the largest thing the app ships, and almost
 * none of it is needed to draw the chrome. The sidebar, the landing page
 * and the prev/next links only need a title, a section and an order — so
 * those live here, eagerly, in the main bundle. The prose itself lives in
 * per-section chunks that are fetched the first time a lesson is opened.
 *
 * The array is `as const`, which gives us the `LessonSlug` union. The
 * loader in `lessons.ts` is typed against that union, so adding a
 * lesson to this file without adding it to the loader is a compile error
 * rather than a blank page.
 */
export type LessonMeta = {
  slug: string;
  title: string;
  sectionId: SectionId;
  order: number;
};

export const lessonManifest = [
  {
    slug: 'hello-world',
    title: 'Hello, world & program structure',
    sectionId: 'fundamentals',
    order: 1,
  },
  { slug: 'go-run-vs-build', title: '`go run` vs `go build`', sectionId: 'fundamentals', order: 2 },
  {
    slug: 'variables',
    title: 'Variables: `var`, `:=`, and the blank identifier',
    sectionId: 'fundamentals',
    order: 3,
  },
  { slug: 'constants-iota', title: 'Constants & `iota`', sectionId: 'fundamentals', order: 4 },
  {
    slug: 'basic-types',
    title: 'Basic types, zero values & conversions',
    sectionId: 'fundamentals',
    order: 5,
  },
  {
    slug: 'strings-runes-bytes',
    title: 'Strings, runes & bytes',
    sectionId: 'fundamentals',
    order: 6,
  },
  {
    slug: 'numeric-types',
    title: 'Numeric types, overflow & untyped constants',
    sectionId: 'fundamentals',
    order: 7,
  },
  {
    slug: 'if-statements',
    title: '`if` and its init statement',
    sectionId: 'control-flow',
    order: 8,
  },
  {
    slug: 'for-loops',
    title: '`for`: three clauses, `while`, and `range`',
    sectionId: 'control-flow',
    order: 9,
  },
  {
    slug: 'loop-variable-capture',
    title: 'Loop variable capture: pre-1.22 vs 1.22+',
    sectionId: 'control-flow',
    order: 10,
  },
  {
    slug: 'switch',
    title: '`switch`: no fallthrough, expression-less, multi-value',
    sectionId: 'control-flow',
    order: 11,
  },
  {
    slug: 'type-switch',
    title: '`switch` on types: the type switch',
    sectionId: 'control-flow',
    order: 12,
  },
  {
    slug: 'defer',
    title: '`defer`: LIFO order and argument evaluation timing',
    sectionId: 'control-flow',
    order: 13,
  },
  {
    slug: 'goto-and-labels',
    title: '`goto`, labels, and labeled `break`/`continue`',
    sectionId: 'control-flow',
    order: 14,
  },
  {
    slug: 'arrays',
    title: 'Arrays: fixed length, value semantics',
    sectionId: 'composite-types',
    order: 15,
  },
  {
    slug: 'slices',
    title: 'Slices: header, `append`, slicing & aliasing',
    sectionId: 'composite-types',
    order: 16,
  },
  {
    slug: 'maps',
    title: 'Maps: nil, comma-ok, deletion & random iteration',
    sectionId: 'composite-types',
    order: 17,
  },
  {
    slug: 'structs',
    title: 'Structs: literals, tags, embedding & comparability',
    sectionId: 'composite-types',
    order: 18,
  },
  {
    slug: 'pointers',
    title: 'Pointers: no arithmetic, `new`, and addressability',
    sectionId: 'composite-types',
    order: 19,
  },
  {
    slug: 'functions',
    title: 'Functions, multiple returns & named results',
    sectionId: 'functions',
    order: 20,
  },
  {
    slug: 'variadic-functions',
    title: 'Variadic functions & slice spreading',
    sectionId: 'functions',
    order: 21,
  },
  {
    slug: 'closures',
    title: 'First-class functions & closures',
    sectionId: 'functions',
    order: 22,
  },
  { slug: 'methods', title: 'Methods, receivers & method sets', sectionId: 'functions', order: 23 },
  {
    slug: 'interfaces',
    title: 'Interfaces & implicit satisfaction',
    sectionId: 'interfaces',
    order: 24,
  },
  {
    slug: 'type-assertions',
    title: 'Type assertions & the comma-ok form',
    sectionId: 'interfaces',
    order: 25,
  },
  { slug: 'embedding', title: 'Embedding & method promotion', sectionId: 'interfaces', order: 26 },
  {
    slug: 'stdlib-interfaces',
    title: 'Standard library interfaces: `error`, `Stringer`, `io`',
    sectionId: 'interfaces',
    order: 27,
  },
  { slug: 'generics', title: 'Type parameters & inference', sectionId: 'generics', order: 28 },
  {
    slug: 'constraints',
    title: 'Constraints, `comparable` & type sets',
    sectionId: 'generics',
    order: 29,
  },
  {
    slug: 'when-not-generics',
    title: 'When *not* to reach for generics',
    sectionId: 'generics',
    order: 30,
  },
  {
    slug: 'error-interface',
    title: 'The `error` interface, sentinels & `errors.Is`/`As`',
    sectionId: 'errors',
    order: 31,
  },
  { slug: 'error-wrapping', title: 'Wrapping errors with `%w`', sectionId: 'errors', order: 32 },
  {
    slug: 'panic-recover',
    title: '`panic` & `recover` — and why panic is not exception handling',
    sectionId: 'errors',
    order: 33,
  },
  {
    slug: 'goroutines',
    title: 'Goroutines: cost & lifecycle',
    sectionId: 'concurrency',
    order: 34,
  },
  {
    slug: 'channel-basics',
    title: 'Channels: unbuffered vs buffered',
    sectionId: 'concurrency',
    order: 35,
  },
  {
    slug: 'channel-close',
    title: '`close`, `range` over channels & nil channels',
    sectionId: 'concurrency',
    order: 36,
  },
  {
    slug: 'select',
    title: '`select`: multiplexing, `default` & timeouts',
    sectionId: 'concurrency',
    order: 37,
  },
  {
    slug: 'sync-primitives',
    title: '`sync`: Mutex, RWMutex, WaitGroup, Once, Cond',
    sectionId: 'concurrency',
    order: 38,
  },
  {
    slug: 'atomics',
    title: '`sync/atomic` & the memory model in one paragraph',
    sectionId: 'concurrency',
    order: 39,
  },
  {
    slug: 'context',
    title: '`context.Context`: cancellation, deadlines, values',
    sectionId: 'concurrency',
    order: 40,
  },
  { slug: 'packages', title: 'Packages: exported vs unexported', sectionId: 'packages', order: 41 },
  {
    slug: 'init-order',
    title: '`init()` order & package-level variable initialisation',
    sectionId: 'packages',
    order: 42,
  },
  {
    slug: 'internal-and-module',
    title: '`internal/` directories, import paths & `go.mod`',
    sectionId: 'packages',
    order: 43,
  },
  {
    slug: 'go-embed',
    title: '`//go:embed` — shipping files inside the binary',
    sectionId: 'packages',
    order: 44,
  },
  {
    slug: 'reflection',
    title: '`reflect`: `TypeOf`, `ValueOf`, kind vs type',
    sectionId: 'low-level',
    order: 45,
  },
  {
    slug: 'unsafe',
    title: '`unsafe.Pointer` and `unsafe.Sizeof`',
    sectionId: 'low-level',
    order: 46,
  },
  { slug: 'cgo', title: '`cgo`: calling C from Go', sectionId: 'low-level', order: 47 },
  {
    slug: 'build-tags',
    title: 'Build constraints: `//go:build`',
    sectionId: 'low-level',
    order: 48,
  },
  {
    slug: 'build-and-run',
    title: '`go build`, `go run` & output paths',
    sectionId: 'toolchain',
    order: 49,
  },
  { slug: 'go-install', title: '`go install` & `GOBIN`', sectionId: 'toolchain', order: 50 },
  {
    slug: 'module-management',
    title: '`go.mod`, `go mod tidy` and the module commands',
    sectionId: 'toolchain',
    order: 51,
  },
  {
    slug: 'go-work',
    title: '`go work` — multi-module workspaces',
    sectionId: 'toolchain',
    order: 52,
  },
  {
    slug: 'go-test-basics',
    title: '`go test`: table tests, subtests, `-run` and `t.Parallel`',
    sectionId: 'toolchain',
    order: 53,
  },
  {
    slug: 'go-test-failures',
    title: 'Reading a `--- FAIL` and the other test outcomes',
    sectionId: 'toolchain',
    order: 54,
  },
  {
    slug: 'benchmarks-and-fuzzing',
    title: '`go test`: benchmarks, examples and fuzzing',
    sectionId: 'toolchain',
    order: 55,
  },
  {
    slug: 'race-and-coverage',
    title: '`go test -race` and coverage',
    sectionId: 'toolchain',
    order: 56,
  },
  {
    slug: 'formatting',
    title: '`go fmt`, `gofmt` and `goimports`',
    sectionId: 'toolchain',
    order: 57,
  },
  { slug: 'vet-and-doc', title: '`go vet` and `go doc`', sectionId: 'toolchain', order: 58 },
  { slug: 'go-generate', title: '`go generate` directives', sectionId: 'toolchain', order: 59 },
  {
    slug: 'go-env',
    title: '`go env`, `GOPATH`, `GOMODCACHE` and `GOPROXY`',
    sectionId: 'toolchain',
    order: 60,
  },
  {
    slug: 'cross-compilation',
    title: 'Cross compilation: `GOOS`, `GOARCH` and `CGO_ENABLED`',
    sectionId: 'toolchain',
    order: 61,
  },
  {
    slug: 'ldflags-and-trimpath',
    title: '`-ldflags`, `-trimpath` and build modes',
    sectionId: 'toolchain',
    order: 62,
  },
  {
    slug: 'profiling',
    title: '`go tool pprof` and `go tool trace`',
    sectionId: 'toolchain',
    order: 63,
  },
] as const satisfies readonly LessonMeta[];

export type LessonSlug = (typeof lessonManifest)[number]['slug'];

const bySlug = new Map<string, LessonMeta>(lessonManifest.map((m) => [m.slug, m] as const));

export function metaBySlug(slug: string): LessonMeta | undefined {
  return bySlug.get(slug);
}

/** The manifest grouped by section, each group in reading order. */
export function manifestBySection(sectionId: string): LessonMeta[] {
  return lessonManifest
    .filter((m) => m.sectionId === sectionId)
    .slice()
    .sort((a, b) => a.order - b.order);
}
