import type { Lesson } from './types';

/**
 * Placeholder registry. Phase 04 replaces this with the authored lesson
 * framework (real prose, run modes, checkpoints).
 */
export const lessons: Lesson[] = [
  {
    slug: 'hello-world',
    title: 'Hello, world',
    sectionId: 'fundamentals',
    order: 1,
    body: 'Placeholder lesson body.',
    runMode: 'playground',
    starterCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("hello")\n}\n',
  },
];

const slugIndex = new Map(lessons.map((l) => [l.slug, l] as const));

export function lessonBySlug(slug: string): Lesson | undefined {
  return slugIndex.get(slug);
}
