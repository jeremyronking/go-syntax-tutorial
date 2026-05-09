export type Section = {
  id: string;
  letter: string;
  title: string;
  blurb: string;
};

export const sections: Section[] = [
  {
    id: 'fundamentals',
    letter: 'A',
    title: 'Language fundamentals',
    blurb: 'Programs, declarations, basic types, strings & runes, untyped constants.',
  },
  {
    id: 'control-flow',
    letter: 'B',
    title: 'Control flow',
    blurb: 'if, for, switch, type switch, defer, labels.',
  },
  {
    id: 'composite-types',
    letter: 'C',
    title: 'Composite types',
    blurb: 'Arrays, slices, maps, structs, pointers — and the aliasing traps.',
  },
  {
    id: 'functions',
    letter: 'D',
    title: 'Functions',
    blurb: 'Multi-return, variadics, closures, methods, receiver semantics.',
  },
  {
    id: 'interfaces',
    letter: 'E',
    title: 'Interfaces & polymorphism',
    blurb: 'Implicit satisfaction, type assertions, embedding, stdlib interfaces.',
  },
  {
    id: 'generics',
    letter: 'F',
    title: 'Generics',
    blurb: 'Type parameters, constraints, ~T sets, when not to reach for generics.',
  },
  {
    id: 'errors',
    letter: 'G',
    title: 'Errors, panic, recover',
    blurb: 'error wrapping, Is/As, sentinel patterns, when to panic.',
  },
  {
    id: 'concurrency',
    letter: 'H',
    title: 'Concurrency',
    blurb: 'Goroutines, channels, select, sync, atomics, context.',
  },
  {
    id: 'packages',
    letter: 'I',
    title: 'Packages & project layout',
    blurb: 'Visibility, init order, internal/, go:embed.',
  },
  {
    id: 'low-level',
    letter: 'J',
    title: 'Reflection & low-level',
    blurb: 'reflect, unsafe (briefly), cgo (briefly), build tags.',
  },
  {
    id: 'toolchain',
    letter: 'K',
    title: 'Toolchain',
    blurb: 'go run/build/install, modules, test, fmt/vet, generate, env, cross-compile, pprof.',
  },
];
