import Fuse from 'fuse.js';
import { lessons } from '../content/lessons';
import { sectionById } from '../content/sections';
import type { Lesson } from '../content/types';

export type SearchResult = {
  lesson: Lesson;
  sectionTitle: string;
  sectionLetter: string;
  /** Short excerpt around the match, when the prose is what matched. */
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

/** Titles and section names are the strong signals; prose is a weak one. */
const titleFuse = new Fuse(indexed, {
  keys: [
    { name: 'title', weight: 0.75 },
    { name: 'section', weight: 0.25 },
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

const bodyFuse = new Fuse(indexed, {
  keys: [{ name: 'body', weight: 1 }],
  threshold: 0.35,
  minMatchCharLength: 3,
  ignoreLocation: true,
});

export function search(query: string, max = 12): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return indexed.slice(0, max).map((i) => toResult(i.lesson));
  }

  const bySlug = new Map<string, SearchResult>();

  for (const match of titleFuse.search(trimmed, { limit: max })) {
    bySlug.set(match.item.lesson.slug, toResult(match.item.lesson));
  }

  for (const match of bodyFuse.search(trimmed, { limit: max })) {
    const slug = match.item.lesson.slug;
    if (bySlug.has(slug)) continue;
    // Fuzzy prose matching is noisy ("channel" hits "unchanged"), so require
    // a real word in the prose to start with the query.
    const snippet = excerpt(match.item.body, trimmed);
    if (!snippet) continue;
    const result = toResult(match.item.lesson);
    result.snippet = snippet;
    bySlug.set(slug, result);
  }

  return Array.from(bySlug.values()).slice(0, max);
}

function toResult(lesson: Lesson): SearchResult {
  const section = sectionById.get(lesson.sectionId);
  return {
    lesson,
    sectionTitle: section?.title ?? lesson.sectionId,
    sectionLetter: section?.letter ?? '?',
  };
}

/**
 * Pull a short window of prose around the first word that starts with the
 * query. Returns undefined when no such word exists.
 */
function excerpt(body: string, query: string): string | undefined {
  const needle = query.toLowerCase();
  const words = body.split(/(\s+)/);
  let offset = 0;
  let at = -1;

  for (const word of words) {
    if (word.trim().length > 0 && word.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(needle)) {
      at = offset;
      break;
    }
    offset += word.length;
  }

  if (at < 0) return undefined;

  const start = Math.max(0, at - 48);
  const end = Math.min(body.length, at + query.length + 96);
  const slice = body.slice(start, end).replace(/\s+/g, ' ').trim();
  return `${start > 0 ? '…' : ''}${slice}${end < body.length ? '…' : ''}`;
}
