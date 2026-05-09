import type { Lesson } from './types'
import { sectionALessons } from './lessons/section-a'
import { sectionBLessons } from './lessons/section-b'
import { sectionCLessons } from './lessons/section-c'
import { sectionDLessons } from './lessons/section-d'

export const lessons: Lesson[] = [
  ...sectionALessons,
  ...sectionBLessons,
  ...sectionCLessons,
  ...sectionDLessons,
]

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug)
}
