import type { Lesson } from './types'
import { sectionALessons } from './lessons/section-a'
import { sectionBLessons } from './lessons/section-b'
import { sectionCLessons } from './lessons/section-c'
import { sectionDLessons } from './lessons/section-d'
import { sectionELessons } from './lessons/section-e'
import { sectionFLessons } from './lessons/section-f'
import { sectionGLessons } from './lessons/section-g'
import { sectionHLessons } from './lessons/section-h'
import { sectionILessons } from './lessons/section-i'
import { sectionJLessons } from './lessons/section-j'
import { sectionK1Lessons } from './lessons/section-k1'
import { sectionK2Lessons } from './lessons/section-k2'
import { sectionK3Lessons } from './lessons/section-k3'

export const lessons: Lesson[] = [
  ...sectionALessons,
  ...sectionBLessons,
  ...sectionCLessons,
  ...sectionDLessons,
  ...sectionELessons,
  ...sectionFLessons,
  ...sectionGLessons,
  ...sectionHLessons,
  ...sectionILessons,
  ...sectionJLessons,
  ...sectionK1Lessons,
  ...sectionK2Lessons,
  ...sectionK3Lessons,
]

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug)
}
