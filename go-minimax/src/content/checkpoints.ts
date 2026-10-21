import type { Checkpoint, SectionId } from './types';
import { fundamentalsCheckpoint } from './checkpoints/fundamentals';
import { controlFlowCheckpoint } from './checkpoints/control-flow';
import { compositeTypesCheckpoint } from './checkpoints/composite-types';
import { functionsCheckpoint } from './checkpoints/functions';
import { interfacesCheckpoint } from './checkpoints/interfaces';
import { genericsCheckpoint } from './checkpoints/generics';
import { errorsCheckpoint } from './checkpoints/errors';
import { concurrencyCheckpoint } from './checkpoints/concurrency';
import { packagesCheckpoint } from './checkpoints/packages';
import { lowLevelCheckpoint } from './checkpoints/low-level';

/**
 * Checkpoints are authored per section. The registry maps a section id to its
 * checkpoint; sections without one simply have no entry.
 */
export const checkpoints: Checkpoint[] = [
  fundamentalsCheckpoint,
  controlFlowCheckpoint,
  compositeTypesCheckpoint,
  functionsCheckpoint,
  interfacesCheckpoint,
  genericsCheckpoint,
  errorsCheckpoint,
  concurrencyCheckpoint,
  packagesCheckpoint,
  lowLevelCheckpoint,
];

const bySection = new Map<SectionId, Checkpoint>(
  checkpoints.map((c) => [c.sectionId, c] as const)
);

export function checkpointBySection(sectionId: string): Checkpoint | undefined {
  return bySection.get(sectionId as SectionId);
}

export function checkpointById(id: string): Checkpoint | undefined {
  return checkpoints.find((c) => c.id === id);
}
