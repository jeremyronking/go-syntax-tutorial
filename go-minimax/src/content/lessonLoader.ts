import type { Lesson } from './types';
import { lessonManifest, type LessonSlug } from './manifest';

/**
 * Lazy loading of lesson prose.
 *
 * The manifest tells us *which* lessons exist; this module fetches one
 * when it is actually needed. The content is already grouped into section
 * files, so each section becomes one chunk: opening any lesson of a
 * section fetches that section's prose, and the rest of the section
 * arrives with it.
 *
 * Every chunk exports a `lessons` record keyed by slug, so adding a
 * lesson to a section file is enough — there is no switch to update and
 * no way to forget one.
 */

type SectionModule = {
  lessons: Record<string, Lesson>;
};

const SECTION_CHUNKS: Record<string, () => Promise<SectionModule>> = {
  fundamentals: () => import('./lessons/section-a'),
  'control-flow': () => import('./lessons/section-b'),
  'composite-types': () => import('./lessons/section-c'),
  functions: () => import('./lessons/section-d'),
  interfaces: () => import('./lessons/section-efg'),
  generics: () => import('./lessons/section-efg'),
  errors: () => import('./lessons/section-efg'),
  concurrency: () => import('./lessons/section-h'),
  packages: () => import('./lessons/section-i'),
  'low-level': () => import('./lessons/section-j'),
  toolchain: () => import('./lessons/section-k'),
};

/** The two standalone lessons that are not part of a numbered section. */
const STANDALONE: Record<string, () => Promise<SectionModule>> = {
  'hello-world': () => import('./lessons/hello-world'),
  'go-run-vs-build': () => import('./lessons/go-run-vs-build'),
};

const cache = new Map<string, Lesson>();
const inflight = new Map<string, Promise<Lesson | undefined>>();

/**
 * The lessons of a section, in reading order. A section's lessons live in
 * its chunk, but a couple of them are standalone files that share the
 * section's id — those are loaded from their own chunk.
 */
export async function loadSectionLessons(sectionId: string): Promise<Lesson[]> {
  const metas = lessonManifest.filter((m) => m.sectionId === sectionId);
  if (metas.length === 0) return [];

  const load = SECTION_CHUNKS[sectionId];
  const mod = load ? await load() : null;

  const out: Lesson[] = [];
  for (const meta of metas) {
    const standalone = STANDALONE[meta.slug];
    const lesson = mod?.lessons[meta.slug]
      ?? (standalone ? (await standalone()).lessons[meta.slug] : undefined);
    if (lesson) {
      cache.set(meta.slug, lesson);
      out.push(lesson);
    }
  }
  return out.sort((a, b) => a.order - b.order);
}

/**
 * Load one lesson. Returns the lesson, or undefined when the slug is not
 * in the manifest.
 */
export async function loadLesson(slug: string): Promise<Lesson | undefined> {
  const cached = cache.get(slug);
  if (cached) return cached;

  const pending = inflight.get(slug);
  if (pending) return pending;

  const promise = (async (): Promise<Lesson | undefined> => {
    const meta = lessonManifest.find((m) => m.slug === slug);
    if (!meta) return undefined;

    const standalone = STANDALONE[slug];
    if (standalone) {
      const mod = await standalone();
      const lesson = mod.lessons[slug];
      if (lesson) cache.set(slug, lesson);
      return lesson;
    }

    const loadSection = SECTION_CHUNKS[meta.sectionId];
    if (!loadSection) return undefined;

    const mod = await loadSection();
    const lesson = mod.lessons[slug];
    if (lesson) cache.set(slug, lesson);
    return lesson;
  })();

  inflight.set(slug, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(slug);
  }
}

/** Type guard: is this a slug the tour knows about? */
export function isKnownSlug(slug: string): slug is LessonSlug {
  return lessonManifest.some((m) => m.slug === slug);
}
