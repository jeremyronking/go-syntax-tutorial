import Fuse from 'fuse.js'
import { lessons } from '../content/lessons'

export const fuse = new Fuse(lessons, {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'section', weight: 2 },
    { name: 'body', weight: 1 },
  ],
  includeMatches: true,
  threshold: 0.3,
  ignoreLocation: true,
})

export function searchLessons(query: string) {
  if (!query) return []
  return fuse.search(query)
}
