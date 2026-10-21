import type { SectionId } from './types';

export type { SectionId };

export type Section = {
  id: SectionId;
  letter: string;
  title: string;
  blurb: string;
};

export const sections: Section[] = [
  {
    id: 'fundamentals',
    letter: 'A',
    title: 'Language fundamentals',
    blurb: 'Program structure, declarations, zero values, conversions, strings and runes.',
  },
  {
    id: 'control-flow',
    letter: 'B',
    title: 'Control flow',
    blurb: 'if, the one true for, switch, type switch, defer, labels.',
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
    blurb: 'Multiple returns, variadics, closures, methods, receiver semantics.',
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
    blurb: 'Type parameters, constraints, ~T type sets, when not to reach for them.',
  },
  {
    id: 'errors',
    letter: 'G',
    title: 'Errors, panic, recover',
    blurb: 'Sentinel errors, errors.Is/As, wrapping, and when a panic is appropriate.',
  },
  {
    id: 'concurrency',
    letter: 'H',
    title: 'Concurrency',
    blurb: 'Goroutines, channels, select, sync primitives, atomics, context.',
  },
  {
    id: 'packages',
    letter: 'I',
    title: 'Packages & project layout',
    blurb: 'Visibility, init order, internal/, import paths, go:embed.',
  },
  {
    id: 'low-level',
    letter: 'J',
    title: 'Reflection & low-level',
    blurb: 'reflect, unsafe and cgo (both briefly), build tags.',
  },
  {
    id: 'toolchain',
    letter: 'K',
    title: 'Toolchain',
    blurb: 'run/build/install, modules, workspaces, test, fmt/vet/doc, generate, pprof.',
  },
];

export const sectionById = new Map(sections.map((s) => [s.id, s] as const));
