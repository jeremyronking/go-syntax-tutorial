import type { Lesson } from './types';
import { helloWorld } from './lessons/hello-world';

export const lessons: Lesson[] = [helloWorld];

const slugIndex = new Map(lessons.map((l) => [l.slug, l] as const));

export function lessonBySlug(slug: string): Lesson | undefined {
  return slugIndex.get(slug);
}

export function lessonsBySection(sectionId: string): Lesson[] {
  return lessons.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);
}
