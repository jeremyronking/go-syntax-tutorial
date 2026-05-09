import Fuse from 'fuse.js';
import { lessons } from '../content/lessons';
import { sections } from '../content/sections';
import type { Lesson } from '../content/types';

export type SearchResult = {
  lesson: Lesson;
  sectionTitle: string;
  sectionLetter: string;
};

const indexed = lessons.map((l) => ({
  lesson: l,
  title: l.title,
  section: sections.find((s) => s.id === l.sectionId)?.title ?? l.sectionId,
  body: l.body,
}));

const fuse = new Fuse(indexed, {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'section', weight: 0.25 },
    { name: 'body', weight: 0.15 },
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
});

export function search(query: string, max = 12): SearchResult[] {
  if (!query.trim()) {
    return lessons.slice(0, max).map((l) => toResult(l));
  }
  return fuse
    .search(query, { limit: max })
    .map((m) => toResult(m.item.lesson));
}

function toResult(lesson: Lesson): SearchResult {
  const section = sections.find((s) => s.id === lesson.sectionId);
  return {
    lesson,
    sectionTitle: section?.title ?? lesson.sectionId,
    sectionLetter: section?.letter ?? '?',
  };
}
