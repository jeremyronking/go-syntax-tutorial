import type { Lesson } from './types'
import { sectionALessons } from './lessons/section-a'
import { sectionBLessons } from './lessons/section-b'

export const lessons: Lesson[] = [
  ...sectionALessons,
  ...sectionBLessons,
]

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug)
}
