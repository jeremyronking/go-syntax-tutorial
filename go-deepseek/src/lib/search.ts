import Fuse from 'fuse.js';
import { lessons, orderedLessons } from '../content/lessons';
import { sections } from '../content/sections';
import type { Lesson } from '../content/types';

type SearchDocument = {
  slug: string;
  title: string;
  section: string;
  body: string;
};

const sectionTitle = (sectionId: string): string =>
  sections.find((section) => section.id === sectionId)?.title ?? '';

const documents: SearchDocument[] = lessons.map((lesson) => ({
  slug: lesson.slug,
  title: lesson.title,
  section: sectionTitle(lesson.sectionId),
  body: lesson.body,
}));

const fuse = new Fuse(documents, {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.35,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'section', weight: 0.25 },
    { name: 'body', weight: 0.15 },
  ],
});

export type SearchResult = {
  lesson: Lesson;
  snippet: string;
};

const lessonIndex = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

function snippetFor(lesson: Lesson, query: string): string {
  const body = lesson.body.replace(/\s+/g, ' ').trim();
  if (!query) return body.slice(0, 110) + (body.length > 110 ? '…' : '');

  const at = body.toLowerCase().indexOf(query.toLowerCase());
  if (at === -1) return body.slice(0, 110) + (body.length > 110 ? '…' : '');
  const start = Math.max(0, at - 45);
  const end = Math.min(body.length, at + query.length + 75);
  return `${start > 0 ? '…' : ''}${body.slice(start, end)}${end < body.length ? '…' : ''}`;
}

export function searchLessons(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return orderedLessons()
      .slice(0, 9)
      .map((lesson) => ({ lesson, snippet: snippetFor(lesson, '') }));
  }

  return fuse.search(trimmed).flatMap((hit) => {
    const lesson = lessonIndex.get(hit.item.slug);
    return lesson ? [{ lesson, snippet: snippetFor(lesson, trimmed) }] : [];
  });
}
