import type { Lesson } from './types'
import { helloWorld } from './lessons/hello-world'

export const lessons: Lesson[] = [
  helloWorld,
]

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug)
}
