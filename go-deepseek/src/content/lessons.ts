import type { Lesson } from './types';
import { sections } from './sections';
import { sectionALessons } from './lessons/section-a';
import { sectionBLessons } from './lessons/section-b';
import { sectionCLessons } from './lessons/section-c';
import { sectionDLessons } from './lessons/section-d';
import { sectionELessons } from './lessons/section-e';
import { sectionFLessons } from './lessons/section-f';
import { sectionGLessons } from './lessons/section-g';
import { sectionHLessons } from './lessons/section-h';

/**
 * Every lesson, in reading order. Content phases append their section modules here.
 */
export const lessons: Lesson[] = [
  ...sectionALessons,
  ...sectionBLessons,
  ...sectionCLessons,
  ...sectionDLessons,
  ...sectionELessons,
  ...sectionFLessons,
  ...sectionGLessons,
  ...sectionHLessons,
];

const byOrder = [...lessons].sort((a, b) => a.order - b.order);

export function lessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function lessonsInSection(sectionId: string): Lesson[] {
  return byOrder.filter((lesson) => lesson.sectionId === sectionId);
}

export function orderedLessons(): Lesson[] {
  return byOrder;
}

export function neighbouringLessons(slug: string): { prev?: Lesson; next?: Lesson } {
  const index = byOrder.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return {};
  return { prev: byOrder[index - 1], next: byOrder[index + 1] };
}

export function sectionForLesson(lesson: Lesson) {
  return sections.find((section) => section.id === lesson.sectionId);
}
