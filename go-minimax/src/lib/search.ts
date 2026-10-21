import Fuse from 'fuse.js';
import { lessonManifest, type LessonMeta } from '../content/manifest';
import { sectionById } from '../content/sections';
import { loadLesson } from '../content/lessonLoader';

export type SearchResult = {
  slug: string;
  title: string;
  sectionId: string;
  sectionTitle: string;
  sectionLetter: string;
  /** Short excerpt around the match, when the prose is what matched. */
  snippet?: string;
};

type Indexed = {
  slug: string;
  title: string;
  section: string;
  body: string;
};

/**
 * Search runs over the lesson prose, which is loaded lazily.
 *
 * The index is built on first use and kept for the session: after the
 * first search, every lesson's prose is in memory, so subsequent searches
 * are instant. Until then, the index is empty and only titles match.
 */
let indexed: Indexed[] | null = null;
let indexPromise: Promise<Indexed[]> | null = null;

async function buildIndex(): Promise<Indexed[]> {
  const lessons = await Promise.all(
    lessonManifest.map((m) => loadLesson(m.slug).catch(() => undefined))
  );

  const rows: Indexed[] = [];
  for (const lesson of lessons) {
    if (!lesson) continue;
    const section = sectionById.get(lesson.sectionId);
    rows.push({
      slug: lesson.slug,
      title: lesson.title,
      section: section?.title ?? lesson.sectionId,
      body: lesson.body,
    });
  }
  return rows;
}

function getIndex(): Promise<Indexed[]> {
  if (indexed) return Promise.resolve(indexed);
  if (!indexPromise) {
    indexPromise = buildIndex().then((rows) => {
      indexed = rows;
      return rows;
    });
  }
  return indexPromise;
}

/** Warm the index so the first keystroke has something to search. */
export function primeSearchIndex(): void {
  void getIndex();
}

/** Titles and section names are the strong signals; prose is a weak one. */
function makeFuses(rows: Indexed[]) {
  const titleFuse = new Fuse(rows, {
    keys: [
      { name: 'title', weight: 0.75 },
      { name: 'section', weight: 0.25 },
    ],
    threshold: 0.4,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });

  const bodyFuse = new Fuse(rows, {
    keys: [{ name: 'body', weight: 1 }],
    threshold: 0.35,
    minMatchCharLength: 3,
    ignoreLocation: true,
  });

  return { titleFuse, bodyFuse };
}

/**
 * Search. Titles are matched synchronously against the manifest; prose is
 * matched against the lazily-built index.
 */
export async function search(query: string, max = 12): Promise<SearchResult[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return lessonManifest.slice(0, max).map((m) => toResult(m));
  }

  const rows = await getIndex();
  const { titleFuse, bodyFuse } = makeFuses(rows);

  const bySlug = new Map<string, SearchResult>();

  for (const match of titleFuse.search(trimmed, { limit: max })) {
    bySlug.set(match.item.slug, toResult(metaOf(match.item.slug)));
  }

  for (const match of bodyFuse.search(trimmed, { limit: max })) {
    const slug = match.item.slug;
    if (bySlug.has(slug)) continue;
    // Fuzzy prose matching is noisy ("channel" hits "unchanged"), so require
    // a real word in the prose to start with the query.
    const snippet = excerpt(match.item.body, trimmed);
    if (!snippet) continue;
    const result = toResult(metaOf(slug));
    result.snippet = snippet;
    bySlug.set(slug, result);
  }

  return Array.from(bySlug.values()).slice(0, max);
}

function metaOf(slug: string) {
  return lessonManifest.find((m) => m.slug === slug)!;
}

function toResult(meta: LessonMeta): SearchResult {
  const section = sectionById.get(meta.sectionId);
  return {
    slug: meta.slug,
    title: meta.title,
    sectionId: meta.sectionId,
    sectionTitle: section?.title ?? meta.sectionId,
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
    if (
      word.trim().length > 0 &&
      word
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .startsWith(needle)
    ) {
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
