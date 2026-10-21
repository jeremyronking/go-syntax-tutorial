import type { Lesson } from './types';
import { helloWorld } from './lessons/hello-world';
import { goRunVsBuild } from './lessons/go-run-vs-build';
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
import {
  interfaces,
  typeAssertions,
  embedding,
  stdlibInterfaces,
  generics,
  constraints,
  whenNotGenerics,
  errorInterface,
  errorWrapping,
  panicRecover,
} from './lessons/section-efg';
import {
  goroutines,
  channelBasics,
  channelClose,
  selectStatement,
  syncPrimitives,
  atomicsAndMemoryModel,
  contextPackage,
} from './lessons/section-h';
import {
  packages,
  initOrder,
  internalAndModule,
  goEmbed,
} from './lessons/section-i';
import {
  reflection,
  unsafePackage,
  cgo,
  buildTags,
} from './lessons/section-j';
import {
  buildAndRun,
  goInstall,
  moduleManagement,
  goWork,
} from './lessons/section-k1';
import {
  goTestBasics,
  goTestFailures,
  benchmarksAndFuzzing,
  raceAndCoverage,
  formatting,
  vetAndDoc,
} from './lessons/section-k2';

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
  interfaces,
  typeAssertions,
  embedding,
  stdlibInterfaces,
  generics,
  constraints,
  whenNotGenerics,
  errorInterface,
  errorWrapping,
  panicRecover,
  goroutines,
  channelBasics,
  channelClose,
  selectStatement,
  syncPrimitives,
  atomicsAndMemoryModel,
  contextPackage,
  packages,
  initOrder,
  internalAndModule,
  goEmbed,
  reflection,
  unsafePackage,
  cgo,
  buildTags,
  buildAndRun,
  goInstall,
  moduleManagement,
  goWork,
  goTestBasics,
  goTestFailures,
  benchmarksAndFuzzing,
  raceAndCoverage,
  formatting,
  vetAndDoc,
];

const slugIndex = new Map(lessons.map((l) => [l.slug, l] as const));

export function lessonBySlug(slug: string): Lesson | undefined {
  return slugIndex.get(slug);
}

export function lessonsBySection(sectionId: string): Lesson[] {
  return lessons.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);
}
