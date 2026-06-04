import type { Lesson } from './types';
import helloWorld from './lessons/hello-world';

const lessons: Lesson[] = [helloWorld];

export default lessons;
export const lessonsBySlug: Readonly<Record<string, Lesson>> = Object.freeze(
  Object.fromEntries(lessons.map((l) => [l.slug, l])),
);

export function lessonBySlug(slug: string): Lesson | undefined {
  return lessonsBySlug[slug];
}

export function lessonsForSection(section: string): Lesson[] {
  return lessons
    .filter((l) => l.section === section)
    .sort((a, b) => a.order - b.order);
}
