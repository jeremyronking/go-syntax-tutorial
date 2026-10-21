import Fuse from 'fuse.js';
import { lessons } from '../content/lessons';
import { sectionById } from '../content/sections';
import type { Lesson } from '../content/types';

export type SearchResult = {
  lesson: Lesson;
  sectionTitle: string;
  sectionLetter: string;
  /** Short excerpt around the first match, when the body is what matched. */
  snippet?: string;
};

type Indexed = {
  lesson: Lesson;
  title: string;
  section: string;
  body: string;
};

const indexed: Indexed[] = lessons.map((lesson) => {
  const section = sectionById.get(lesson.sectionId);
  return {
    lesson,
    title: lesson.title,
    section: section?.title ?? lesson.sectionId,
    body: lesson.body,
  };
});

const fuse = new Fuse(indexed, {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'section', weight: 0.25 },
    { name: 'body', weight: 0.15 },
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

export function search(query: string, max = 12): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return indexed.slice(0, max).map((i) => toResult(i.lesson));
  }

  return fuse.search(trimmed, { limit: max }).map((match) => {
    const result = toResult(match.item.lesson);
    const bodyMatch = excerpt(match.item.body, trimmed);
    if (bodyMatch) result.snippet = bodyMatch;
    return result;
  });
}

function toResult(lesson: Lesson): SearchResult {
  const section = sectionById.get(lesson.sectionId);
  return {
    lesson,
    sectionTitle: section?.title ?? lesson.sectionId,
    sectionLetter: section?.letter ?? '?',
  };
}

/** Pull a short window of prose around the first literal occurrence of the query. */
function excerpt(body: string, query: string): string | undefined {
  const needle = query.toLowerCase();
  const haystack = body.toLowerCase();
  const at = haystack.indexOf(needle);
  if (at < 0) return undefined;

  const start = Math.max(0, at - 48);
  const end = Math.min(body.length, at + query.length + 96);
  const slice = body.slice(start, end).replace(/\s+/g, ' ').trim();
  return `${start > 0 ? '…' : ''}${slice}${end < body.length ? '…' : ''}`;
}
