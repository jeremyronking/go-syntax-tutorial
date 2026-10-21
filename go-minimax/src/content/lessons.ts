import type { Lesson } from './types';
import { lessonManifest, manifestBySection, metaBySlug } from './manifest';

export { lessonManifest, manifestBySection, metaBySlug };
export type { LessonMeta, LessonSlug } from './manifest';

export { loadLesson, loadSectionLessons, isKnownSlug } from './lessonLoader';

/**
 * The registry used to be a plain array of every lesson. It is now a
 * manifest of metadata plus a lazy loader, so the app's main bundle does
 * not carry sixty-odd lessons' worth of prose.
 *
 * These helpers keep the old synchronous shape for the chrome — the
 * sidebar, the landing page and the search index only need titles — and
 * the async loader for the places that genuinely need the prose.
 */
export function lessonMetaBySlug(slug: string) {
  return metaBySlug(slug);
}

export function lessonMetasBySection(sectionId: string) {
  return manifestBySection(sectionId);
}

/** The number of lessons in the tour. */
export const lessonCount = lessonManifest.length;

export type { Lesson };
