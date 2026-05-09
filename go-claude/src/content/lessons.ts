import type { Lesson } from './types';
import { helloWorld } from './lessons/hello-world';
import { goRunVsBuild } from './lessons/go-run-vs-build';
import { variables } from './lessons/variables';
import { constantsIota } from './lessons/constants-iota';
import { basicTypes } from './lessons/basic-types';
import { stringsRunesBytes } from './lessons/strings-runes-bytes';
import { numericTypes } from './lessons/numeric-types';
import { ifStatement } from './lessons/if-statement';
import { forLoop } from './lessons/for-loop';
import { loopVariableCapture } from './lessons/loop-variable-capture';
import { switchLesson } from './lessons/switch';
import { typeSwitchLesson } from './lessons/type-switch';
import { deferLesson } from './lessons/defer';
import { labelsGoto } from './lessons/labels-goto';

export const lessons: Lesson[] = [
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
  switchLesson,
  typeSwitchLesson,
  deferLesson,
  labelsGoto,
];

const slugIndex = new Map(lessons.map((l) => [l.slug, l] as const));

export function lessonBySlug(slug: string): Lesson | undefined {
  return slugIndex.get(slug);
}

export function lessonsBySection(sectionId: string): Lesson[] {
  return lessons.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);
}
