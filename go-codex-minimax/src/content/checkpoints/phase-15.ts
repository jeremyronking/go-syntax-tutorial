import type { Checkpoint } from '../types';

export const packagesCheckpoint: Checkpoint = {
  id: 'packages',
  sectionSlug: 'I',
  title: 'Checkpoint: Packages & project layout',
  passingPct: 80,
  questions: [
    {
      kind: 'mcq',
      id: 'pkg-exported',
      prompt: 'What makes a Go identifier exported?',
      options: [
        'A `public` keyword',
        'A capital first letter',
        'A `_` prefix',
        'A doc comment',
      ],
      correctIndex: 1,
      explanation: 'Capitalization is the rule. `Foo` is exported; `foo` is unexported. There are no access modifiers in Go.',
    },
    {
      kind: 'mcq',
      id: 'pkg-internal',
      prompt: 'A package under `internal/` is accessible to...',
      options: [
        'Any package anywhere',
        'Only packages in or below the parent of `internal/`',
        'Only the package that defines it',
        'Only the standard library',
      ],
      correctIndex: 1,
      explanation: '`internal/` enforces a visibility boundary: only code in the parent subtree can import it. The Go toolchain enforces this at build time.',
    },
    {
      kind: 'mcq',
      id: 'pkg-init',
      prompt: 'When do `init()` functions run?',
      options: [
        'Before the package\'s variables are initialized',
        'After all package variables are initialized, before `main()`',
        'After `main()` returns',
        'Only when explicitly called',
      ],
      correctIndex: 1,
      explanation: 'Variables first (in declaration order), then `init()` functions (in file lexical order), then `main()`.',
    },
    {
      kind: 'mcq',
      id: 'pkg-embed',
      prompt: '`//go:embed assets/*.txt` is valid...',
      options: [
        'Anywhere in the file',
        'Immediately before a `string`, `[]byte`, or `embed.FS` variable declaration at package scope',
        'Only in `main` packages',
        'Only on empty files',
      ],
      correctIndex: 1,
      explanation: '`//go:embed` must precede a package-level variable of the right type, and the files must be in the same package directory.',
    },
  ],
};

export const lowLevelCheckpoint: Checkpoint = {
  id: 'low-level',
  sectionSlug: 'J',
  title: 'Checkpoint: Reflection & low-level',
  passingPct: 75,
  questions: [
    {
      kind: 'mcq',
      id: 'rl-kind',
      prompt: '`reflect.TypeOf([]string{}).Kind()` returns...',
      options: ['`slice`', '`array`', '`string`', '`[]string`'],
      correctIndex: 0,
      explanation: 'Kind is the underlying category. The Type is `[]string`; the Kind is `slice`.',
    },
    {
      kind: 'mcq',
      id: 'rl-unsafe',
      prompt: 'You should reach for `unsafe.Pointer`...',
      options: [
        'Whenever performance matters',
        'Almost never — only when no pure-Go option exists',
        'To write JSON encoders',
        'To define interfaces',
      ],
      correctIndex: 1,
      explanation: '`unsafe` is for the runtime, cgo, and the rare low-level binding. In ordinary code, prefer pure-Go solutions.',
    },
    {
      kind: 'mcq',
      id: 'rl-cgo',
      prompt: 'cgo calls are usually slower than Go-to-Go calls because...',
      options: [
        'C is intrinsically slower',
        'They cross the C/Go boundary (stack switch, scheduler considerations)',
        'cgo forces a network round-trip',
        'cgo disables the GC',
      ],
      correctIndex: 1,
      explanation: 'cgo is a foreign function interface; each call has to switch stacks and is significantly more expensive than a normal Go call.',
    },
    {
      kind: 'mcq',
      id: 'rl-buildtag',
      prompt: '`//go:build linux && amd64` matches when...',
      options: [
        'Either GOOS=linux or GOARCH=amd64',
        'Both GOOS=linux AND GOARCH=amd64',
        'The file is named `linux_amd64.go`',
        'You pass `-tags linux`',
      ],
      correctIndex: 1,
      explanation: '`&&` is logical AND. Use `||` for OR, `!` for negation. The build tag is checked against GOOS/GOARCH and any `-tags` you pass.',
    },
  ],
};
