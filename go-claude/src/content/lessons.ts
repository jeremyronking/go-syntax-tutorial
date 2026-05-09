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
import { arrays } from './lessons/arrays';
import { slices } from './lessons/slices';
import { maps } from './lessons/maps';
import { structs } from './lessons/structs';
import { pointers } from './lessons/pointers';
import { functions } from './lessons/functions';
import { variadic } from './lessons/variadic';
import { closures } from './lessons/closures';
import { methods } from './lessons/methods';
import { interfacesLesson } from './lessons/interfaces';
import { typeAssertions } from './lessons/type-assertions';
import { embedding } from './lessons/embedding';
import { stdlibInterfaces } from './lessons/stdlib-interfaces';
import { typeParameters } from './lessons/type-parameters';
import { constraints } from './lessons/constraints';
import { whenNotGenerics } from './lessons/when-not-generics';
import { errorInterface } from './lessons/error-interface';
import { errorWrapping } from './lessons/error-wrapping';
import { panicRecover } from './lessons/panic-recover';
import { goroutines } from './lessons/goroutines';
import { channels } from './lessons/channels';
import { closeRange } from './lessons/close-range';
import { selectLesson } from './lessons/select';
import { syncMutex } from './lessons/sync-mutex';
import { atomics } from './lessons/atomics';
import { contextLesson } from './lessons/context';
import { packagesVisibility } from './lessons/packages-visibility';
import { initOrder } from './lessons/init-order';
import { internalModules } from './lessons/internal-modules';
import { embedFiles } from './lessons/embed-files';
import { reflectBasics } from './lessons/reflect-basics';
import { unsafePointer } from './lessons/unsafe-pointer';
import { cgoLesson } from './lessons/cgo';
import { buildTags } from './lessons/build-tags';
import { toolchainBuild } from './lessons/toolchain-build';
import { toolchainInstall } from './lessons/toolchain-install';
import { toolchainModules } from './lessons/toolchain-modules';
import { toolchainWorkspaces } from './lessons/toolchain-workspaces';
import { toolchainTest } from './lessons/toolchain-test';
import { toolchainBenchFuzz } from './lessons/toolchain-bench-fuzz';
import { toolchainRaceCover } from './lessons/toolchain-race-cover';
import { toolchainFmt } from './lessons/toolchain-fmt';
import { toolchainVet } from './lessons/toolchain-vet';
import { toolchainDoc } from './lessons/toolchain-doc';
import { toolchainGenerate } from './lessons/toolchain-generate';
import { toolchainEnv } from './lessons/toolchain-env';
import { toolchainCrossCompile } from './lessons/toolchain-cross-compile';
import { toolchainLdflags } from './lessons/toolchain-ldflags';
import { toolchainPprof } from './lessons/toolchain-pprof';

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
  arrays,
  slices,
  maps,
  structs,
  pointers,
  functions,
  variadic,
  closures,
  methods,
  interfacesLesson,
  typeAssertions,
  embedding,
  stdlibInterfaces,
  typeParameters,
  constraints,
  whenNotGenerics,
  errorInterface,
  errorWrapping,
  panicRecover,
  goroutines,
  channels,
  closeRange,
  selectLesson,
  syncMutex,
  atomics,
  contextLesson,
  packagesVisibility,
  initOrder,
  internalModules,
  embedFiles,
  reflectBasics,
  unsafePointer,
  cgoLesson,
  buildTags,
  toolchainBuild,
  toolchainInstall,
  toolchainModules,
  toolchainWorkspaces,
  toolchainTest,
  toolchainBenchFuzz,
  toolchainRaceCover,
  toolchainFmt,
  toolchainVet,
  toolchainDoc,
  toolchainGenerate,
  toolchainEnv,
  toolchainCrossCompile,
  toolchainLdflags,
  toolchainPprof,
];

const slugIndex = new Map(lessons.map((l) => [l.slug, l] as const));

export function lessonBySlug(slug: string): Lesson | undefined {
  return slugIndex.get(slug);
}

export function lessonsBySection(sectionId: string): Lesson[] {
  return lessons.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);
}
