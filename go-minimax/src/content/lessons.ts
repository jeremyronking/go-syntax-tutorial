import type { Lesson } from './types';
import { helloWorld } from './lessons/hello-world';
import { goRunVsBuild } from './lessons/go-run-vs-build';
import { channels } from './lessons/channels';
import {
  variables,
  constantsIota,
  basicTypes,
  stringsRunesBytes,
  numericTypes,
} from './lessons/section-a';
import {
  ifStatements,
  forLoops,
  loopVariableCapture,
  switchStatement,
  typeSwitch,
  deferStatement,
  gotoAndLabels,
} from './lessons/section-b';
import { arrays, slices, maps, structs, pointers } from './lessons/section-c';
import {
  functions,
  variadicFunctions,
  closures,
  methods,
} from './lessons/section-d';

export const lessons: Lesson[] = [
  helloWorld,
  goRunVsBuild,
  variables,
  constantsIota,
  basicTypes,
  stringsRunesBytes,
  numericTypes,
  ifStatements,
  forLoops,
  loopVariableCapture,
  switchStatement,
  typeSwitch,
  deferStatement,
  gotoAndLabels,
  arrays,
  slices,
  maps,
  structs,
  pointers,
  functions,
  variadicFunctions,
  closures,
  methods,
  channels,
];

const slugIndex = new Map(lessons.map((l) => [l.slug, l] as const));

export function lessonBySlug(slug: string): Lesson | undefined {
  return slugIndex.get(slug);
}

export function lessonsBySection(sectionId: string): Lesson[] {
  return lessons.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);
}
