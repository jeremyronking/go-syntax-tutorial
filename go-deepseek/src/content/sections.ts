export type SectionMeta = {
  id: string;
  letter: string;
  title: string;
  blurb: string;
  firstSlug: string;
};

export const sections: SectionMeta[] = [
  {
    id: 'fundamentals',
    letter: 'A',
    title: 'Language fundamentals',
    blurb: 'Program shape, variables, constants, basic types, strings and numbers.',
    firstSlug: 'hello-world',
  },
  {
    id: 'control-flow',
    letter: 'B',
    title: 'Control flow',
    blurb: 'if, for, switch, defer — and the loop-variable change in Go 1.22.',
    firstSlug: 'if-statements',
  },
  {
    id: 'composite-types',
    letter: 'C',
    title: 'Composite types',
    blurb: 'Arrays, slices, maps, structs and pointers, including aliasing traps.',
    firstSlug: 'arrays',
  },
  {
    id: 'functions',
    letter: 'D',
    title: 'Functions',
    blurb: 'Multi-return, variadics, closures, methods and receiver choice.',
    firstSlug: 'functions',
  },
  {
    id: 'interfaces',
    letter: 'E',
    title: 'Interfaces',
    blurb: 'Implicit satisfaction, assertions, embedding and the stdlib contracts.',
    firstSlug: 'interfaces',
  },
  {
    id: 'generics',
    letter: 'F',
    title: 'Generics',
    blurb: 'Type parameters, constraints, type sets — and when to skip them.',
    firstSlug: 'type-parameters',
  },
  {
    id: 'errors',
    letter: 'G',
    title: 'Errors, panic, recover',
    blurb: 'Sentinel errors, wrapping, errors.Is/As, and what panic is not.',
    firstSlug: 'error-interface',
  },
  {
    id: 'concurrency',
    letter: 'H',
    title: 'Concurrency',
    blurb: 'Goroutines, channels, select, sync, atomics and context.',
    firstSlug: 'goroutines',
  },
  {
    id: 'packages',
    letter: 'I',
    title: 'Packages & project layout',
    blurb: 'Export rules, init order, internal/, and go:embed.',
    firstSlug: 'packages',
  },
  {
    id: 'reflection-low-level',
    letter: 'J',
    title: 'Reflection & low-level',
    blurb: 'reflect, unsafe, cgo and build tags.',
    firstSlug: 'reflect-basics',
  },
  {
    id: 'toolchain',
    letter: 'K',
    title: 'Toolchain',
    blurb: 'go run through pprof: the daily commands and the sharp edges.',
    firstSlug: 'go-run-build',
  },
];

export const sectionById = (id: string): SectionMeta | undefined =>
  sections.find((section) => section.id === id);
