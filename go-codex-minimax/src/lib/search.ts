import Fuse, { type IFuseOptions, type FuseResult } from 'fuse.js';
import lessons from '../content/lessons';
import type { Lesson } from '../content/types';

const FUSE_OPTIONS: IFuseOptions<Lesson> = {
  includeScore: true,
  threshold: 0.4,
  ignoreLocation: true,
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'section', weight: 0.2 },
    { name: 'body', weight: 0.3 },
  ],
};

const fuse = new Fuse(lessons, FUSE_OPTIONS);

export interface SearchHit {
  lesson: Lesson;
  snippet: string;
  score: number;
}

export function searchLessons(query: string, limit = 20): SearchHit[] {
  const q = query.trim();
  if (q.length === 0) return [];
  const results: FuseResult<Lesson>[] = fuse.search(q, { limit });
  return results.map((r) => ({
    lesson: r.item,
    score: r.score ?? 1,
    snippet: makeSnippet(r.item.body, q),
  }));
}

function makeSnippet(body: string, query: string): string {
  if (!body) return '';
  const lower = body.toLowerCase();
  const needle = query.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx === -1) {
    return body.replace(/\s+/g, ' ').slice(0, 120) + (body.length > 120 ? '…' : '');
  }
  const start = Math.max(0, idx - 30);
  const end = Math.min(body.length, idx + needle.length + 80);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < body.length ? '…' : '';
  return prefix + body.slice(start, end).replace(/\s+/g, ' ') + suffix;
}
