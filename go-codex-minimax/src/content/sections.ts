import type { Section, SectionId } from './types';

export const SECTIONS: Section[] = [
  { id: 'A', title: 'Language fundamentals', blurb: 'Hello world through zero values and untyped constants.' },
  { id: 'B', title: 'Control flow', blurb: 'if, for, switch, type switch, defer, goto.' },
  { id: 'C', title: 'Composite types', blurb: 'Arrays, slices (and aliasing), maps, structs, pointers.' },
  { id: 'D', title: 'Functions', blurb: 'Multi-return, variadics, closures, methods, receivers.' },
  { id: 'E', title: 'Interfaces & polymorphism', blurb: 'Implicit satisfaction, assertions, embedding, stdlib shapes.' },
  { id: 'F', title: 'Generics', blurb: 'Type parameters, constraints, and when not to reach for them.' },
  { id: 'G', title: 'Errors, panic, recover', blurb: 'error as a value, %w wrapping, when panic is appropriate.' },
  { id: 'H', title: 'Concurrency', blurb: 'Goroutines, channels, select, sync, context.' },
  { id: 'I', title: 'Packages & project layout', blurb: 'init order, internal/, //go:embed.' },
  { id: 'J', title: 'Reflection & low-level', blurb: 'reflect, unsafe.Pointer, cgo, build tags.' },
  { id: 'K', title: 'Toolchain', blurb: 'go run/build, modules, test, fmt, vet, doc, pprof.' },
];

export function sectionById(id: SectionId): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}
