import type { Lesson } from "./types";
import { sectionA } from "./lessons/sectionA";
import { sectionB, sectionACheckpoint, sectionBCheckpoint } from "./lessons/sectionB";
import { sectionC, sectionCCheckpoint } from "./lessons/sectionC";
import { sectionD, sectionDCheckpoint } from "./lessons/sectionD";
import { sectionE, sectionECheckpoint } from "./lessons/sectionE";
import { sectionF, sectionFCheckpoint } from "./lessons/sectionF";
import { sectionG, sectionGCheckpoint } from "./lessons/sectionG";
import { sectionH, sectionHCheckpoint } from "./lessons/sectionH";
import { sectionI, sectionICheckpoint } from "./lessons/sectionI";
import { sectionJ, sectionJCheckpoint } from "./lessons/sectionJ";
import { sectionK1 } from "./lessons/sectionK1";
import { sectionK2 } from "./lessons/sectionK2";
import { sectionK3, sectionK3Checkpoint } from "./lessons/sectionK3";

// Attach checkpoints to last lesson of each section
const lessonA7 = { ...sectionA[6], checkpoint: sectionACheckpoint };
const lessonB7 = { ...sectionB[6], checkpoint: sectionBCheckpoint };
const lessonC5 = { ...sectionC[4], checkpoint: sectionCCheckpoint };
const lessonD4 = { ...sectionD[3], checkpoint: sectionDCheckpoint };
const lessonE4 = { ...sectionE[3], checkpoint: sectionECheckpoint };
const lessonF3 = { ...sectionF[2], checkpoint: sectionFCheckpoint };
const lessonG3 = { ...sectionG[2], checkpoint: sectionGCheckpoint };
const lessonH7 = { ...sectionH[6], checkpoint: sectionHCheckpoint };
const lessonI4 = { ...sectionI[3], checkpoint: sectionICheckpoint };
const lessonJ4 = { ...sectionJ[3], checkpoint: sectionJCheckpoint };
const lessonK3_5 = { ...sectionK3[4], checkpoint: sectionK3Checkpoint };

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
  ...sectionH.slice(0, 6),
  lessonH7,
  ...sectionI.slice(0, 3),
  lessonI4,
  ...sectionJ.slice(0, 3),
  lessonJ4,
  ...sectionK1,
  ...sectionK2,
  ...sectionK3.slice(0, 4),
  lessonK3_5,
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