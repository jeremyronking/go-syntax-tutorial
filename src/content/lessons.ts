import type { Lesson } from './types';
import {
  helloWorld,
  goRunVsBuild,
  variables,
  constantsIota,
  basicTypes,
  stringsRunesBytes,
  numericTypes,
} from './lessons/section-a';
import {
  ifStatement,
  forLoop,
  loopVariableCapture,
  switchStatement,
  typeSwitch,
  deferStatement,
  labelsGoto,
} from './lessons/section-b';

const lessons: Lesson[] = [
  helloWorld,
  goRunVsBuild,
  variables,
  constantsIota,
  basicTypes,
  stringsRunesBytes,
  numericTypes,
  ifStatement,
  forLoop,
  loopVariableCapture,
  switchStatement,
  typeSwitch,
  deferStatement,
  labelsGoto,
];

export default lessons;

export const lessonsBySlug: Readonly<Record<string, Lesson>> = Object.freeze(
  Object.fromEntries(lessons.map((l) => [l.slug, l])),
);

export function lessonBySlug(slug: string): Lesson | undefined {
  return lessonsBySlug[slug];
}

export function lessonsForSection(section: string): Lesson[] {
  return lessons
    .filter((l) => l.section === section)
    .sort((a, b) => a.order - b.order);
}
