/**
 * Section K — the toolchain — is authored in three files, one per
 * workflow group, so each stays readable on its own:
 *
 * - `section-k1.ts` — build, run, modules
 * - `section-k2.ts` — test, format, vet, doc
 * - `section-k3.ts` — the advanced toolchain
 *
 * This barrel is what the lazy loader imports, so the whole section
 * arrives in one chunk.
 */
import type { Lesson } from '../types';

export { buildAndRun, goInstall, moduleManagement, goWork } from './section-k1';

export {
  goTestBasics,
  goTestFailures,
  benchmarksAndFuzzing,
  raceAndCoverage,
  formatting,
  vetAndDoc,
} from './section-k2';

export { goGenerate, goEnv, crossCompilation, ldflagsAndTrimpath, profiling } from './section-k3';

import { lessons as k1 } from './section-k1';
import { lessons as k2 } from './section-k2';
import { lessons as k3 } from './section-k3';

/** Every lesson of the toolchain section, keyed by slug. */
export const lessons: Record<string, Lesson> = { ...k1, ...k2, ...k3 };
