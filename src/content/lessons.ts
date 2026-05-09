import type { Lesson } from "./types";
import { sectionA } from "./lessons/sectionA";
import { sectionB, sectionACheckpoint } from "./lessons/sectionB";
import { sectionC, sectionCCheckpoint } from "./lessons/sectionC";
import { sectionD, sectionDCheckpoint } from "./lessons/sectionD";

const lessonA7 = { ...sectionA[6], checkpoint: sectionACheckpoint };
const lessonC5 = { ...sectionC[4], checkpoint: sectionCCheckpoint };
const lessonD4 = { ...sectionD[3], checkpoint: sectionDCheckpoint };

const allLessons: Lesson[] = [
  ...sectionA.slice(0, 6),
  lessonA7,
  ...sectionB,
  ...sectionC.slice(0, 4),
  lessonC5,
  ...sectionD.slice(0, 3),
  lessonD4,
];

export const lessons: Lesson[] = allLessons;

const lessonMap = new Map(lessons.map((l: Lesson) => [l.slug, l]));

export function lessonBySlug(slug: string): Lesson | undefined {
  return lessonMap.get(slug);
}

export function lessonsBySection(section: string): Lesson[] {
  return lessons.filter((l: Lesson) => l.section === section).sort((a: Lesson, b: Lesson) => a.order - b.order);
}

export const sections: string[] = [...new Set(lessons.map((l: Lesson) => l.section))].sort();