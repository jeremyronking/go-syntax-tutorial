import type { Lesson } from "./types";
import { sectionA } from "./lessons/sectionA";
import { sectionB, sectionACheckpoint, sectionBCheckpoint } from "./lessons/sectionB";
import { sectionC, sectionCCheckpoint } from "./lessons/sectionC";
import { sectionD, sectionDCheckpoint } from "./lessons/sectionD";
import { sectionE, sectionECheckpoint } from "./lessons/sectionE";
import { sectionF, sectionFCheckpoint } from "./lessons/sectionF";
import { sectionG, sectionGCheckpoint } from "./lessons/sectionG";

// Attach checkpoints to the last lesson of each section
const lessonA7 = { ...sectionA[6], checkpoint: sectionACheckpoint };
const lessonB7 = { ...sectionB[6], checkpoint: sectionBCheckpoint };
const lessonC5 = { ...sectionC[4], checkpoint: sectionCCheckpoint };
const lessonD4 = { ...sectionD[3], checkpoint: sectionDCheckpoint };
const lessonE4 = { ...sectionE[3], checkpoint: sectionECheckpoint };
const lessonF3 = { ...sectionF[2], checkpoint: sectionFCheckpoint };
const lessonG3 = { ...sectionG[2], checkpoint: sectionGCheckpoint };

const allLessons: Lesson[] = [
  ...sectionA.slice(0, 6),
  lessonA7,
  ...sectionB.slice(0, 6),
  lessonB7,
  ...sectionC.slice(0, 4),
  lessonC5,
  ...sectionD.slice(0, 3),
  lessonD4,
  ...sectionE.slice(0, 3),
  lessonE4,
  ...sectionF.slice(0, 2),
  lessonF3,
  ...sectionG.slice(0, 2),
  lessonG3,
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