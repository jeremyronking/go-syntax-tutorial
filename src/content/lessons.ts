import type { Lesson } from './types';
import {
  helloWorld, goRunVsBuild, variables, constantsIota, basicTypes,
  stringsRunesBytes, numericTypes,
} from './lessons/section-a';
import {
  ifStatement, forLoop, loopVariableCapture, switchStatement, typeSwitch,
  deferStatement, labelsGoto,
} from './lessons/section-b';
import {
  arrays, slices, maps, structs, pointers,
} from './lessons/section-c';
import {
  functionsLesson, variadic, closures, methods,
} from './lessons/section-d';
import {
  interfaces, typeAssertions, embedding, stdlibInterfaces,
} from './lessons/section-e';
import {
  typeParameters, constraints, whenNotGenerics,
} from './lessons/section-f';
import {
  errorInterface, errorWrapping, panicRecover,
} from './lessons/section-g';
import {
  goroutines, channels, closeRange, selectStatement, syncMutex, atomics, context,
} from './lessons/section-h';
import {
  packagesVisibility, initOrder, internalModules, embedFiles,
} from './lessons/section-i';
import {
  reflectBasics, unsafePointer, cgoLesson, buildTags,
} from './lessons/section-j';
import {
  toolchainBuild, toolchainInstall, toolchainModules, toolchainWorkspaces,
} from './lessons/section-k1';
import {
  toolchainTest, toolchainBenchFuzz, toolchainRaceCover, toolchainFmt,
  toolchainVet, toolchainDoc,
} from './lessons/section-k2';
import {
  toolchainGenerate, toolchainEnv, toolchainCrossCompile,
  toolchainLdflags, toolchainPprof,
} from './lessons/section-k3';

const lessons: Lesson[] = [
  helloWorld, goRunVsBuild, variables, constantsIota, basicTypes,
  stringsRunesBytes, numericTypes,
  ifStatement, forLoop, loopVariableCapture, switchStatement, typeSwitch,
  deferStatement, labelsGoto,
  arrays, slices, maps, structs, pointers,
  functionsLesson, variadic, closures, methods,
  interfaces, typeAssertions, embedding, stdlibInterfaces,
  typeParameters, constraints, whenNotGenerics,
  errorInterface, errorWrapping, panicRecover,
  goroutines, channels, closeRange, selectStatement, syncMutex, atomics, context,
  packagesVisibility, initOrder, internalModules, embedFiles,
  reflectBasics, unsafePointer, cgoLesson, buildTags,
  toolchainBuild, toolchainInstall, toolchainModules, toolchainWorkspaces,
  toolchainTest, toolchainBenchFuzz, toolchainRaceCover, toolchainFmt,
  toolchainVet, toolchainDoc,
  toolchainGenerate, toolchainEnv, toolchainCrossCompile,
  toolchainLdflags, toolchainPprof,
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
