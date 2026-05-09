import type { Lesson } from "./types";
import { sectionA } from "./lessons/sectionA";
import { sectionB, sectionACheckpoint } from "./lessons/sectionB";

// Add the checkpoint to the last lesson of section A
const lessonA7 = { ...sectionA[6], checkpoint: sectionACheckpoint };

const allLessons: Lesson[] = [
  ...sectionA.slice(0, 6),
  lessonA7,
  ...sectionB,
];

export const lessons: Lesson[] = allLessons;

const lessonMap = new Map(lessons.map((l) => [l.slug, l]));

export function lessonBySlug(slug: string): Lesson | undefined {
  return lessonMap.get(slug);
}

export function lessonsBySection(section: string): Lesson[] {
  return lessons.filter((l) => l.section === section).sort((a, b) => a.order - b.order);
}

export const sections: string[] = [...new Set(lessons.map((l) => l.section))].sort();