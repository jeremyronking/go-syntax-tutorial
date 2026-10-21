import type { Checkpoint } from '../types';

export const packagesCheckpoint: Checkpoint = {
  id: 'packages-checkpoint',
  sectionId: 'packages',
  title: 'Checkpoint: packages & project layout',
  questions: [
    {
      kind: 'mcq',
      prompt: 'Which identifiers are visible to another package?',
      options: [
        'Those whose name begins with a capital letter',
        'All of them — Go has no visibility rules',
        'Only the ones declared in a file named `export.go`',
        'Only the ones marked with an `//export` comment',
      ],
      correctIndex: 0,
      explanation:
        'Visibility in Go is decided by capitalisation: an identifier is exported if its first letter is a capital. The rule is per package, not per file — a lowercase method in one file of a package is still callable from the other files of that same package.',
    },
    {
      kind: 'mcq',
      prompt:
        'Which import path may a package outside the module import from `example.com/gotour/internal/secret`?',
      options: [
        'None — `internal/` packages are importable only from within the tree rooted at the parent of `internal/`',
        'Any package, if it uses a `replace` directive',
        'Only packages whose path starts with `example.com`',
        'Only the `main` package of the same module',
      ],
      correctIndex: 0,
      explanation:
        '`internal/` is enforced by the compiler, not by convention. A package under `example.com/gotour/internal/...` is importable only from within `example.com/gotour/...`. Attempting it from outside produces `use of internal package … not allowed`.',
    },
    {
      kind: 'mcq',
      prompt:
        'In a package with `var a = f()`, `var b = f()`, two `init()` functions, and `main()`, what is the execution order?',
      options: [
        '`a`, `b`, the two `init()`s, then `main`',
        'The two `init()`s, then `a`, `b`, then `main`',
        '`a`, `b`, `main`, then the two `init()`s',
        'The order the declarations appear across all files in the package',
      ],
      correctIndex: 0,
      explanation:
        'Package-level variables are initialised first, in declaration order. Then `init()` functions run, in file order within the package. `main` runs last. Across packages the same rules apply depth first: every dependency is fully initialised before the package that imports it.',
    },
    {
      kind: 'mcq',
      prompt:
        'A package-level initialiser reads a variable declared *later* in the same file. What happens?',
      options: [
        'It reads the zero value, silently — the compiler does not warn',
        'It is a compile error',
        'The initialisers are reordered so the dependency is satisfied',
        'It panics at run time',
      ],
      correctIndex: 0,
      explanation:
        'Package-level variables are initialised in declaration order, so an initialiser that reads a later variable sees that variable\'s zero value. Go does not analyse initialiser dependencies and does not warn about it.',
    },
  ],
};
