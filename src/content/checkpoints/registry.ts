import type { Checkpoint, SectionId } from '../types';
import { fundamentalsCheckpoint, controlFlowCheckpoint } from './phase-11';
import { compositeTypesCheckpoint, functionsCheckpoint } from './phase-12';
import {
  interfacesCheckpoint, genericsCheckpoint, errorsCheckpoint,
} from './phase-13';
import { concurrencyCheckpoint } from './phase-14';
import { packagesCheckpoint, lowLevelCheckpoint } from './phase-15';

export const CheckpointsBySection: Partial<Record<SectionId, Checkpoint[]>> = {
  A: [fundamentalsCheckpoint],
  B: [controlFlowCheckpoint],
  C: [compositeTypesCheckpoint],
  D: [functionsCheckpoint],
  E: [interfacesCheckpoint],
  F: [genericsCheckpoint],
  G: [errorsCheckpoint],
  H: [concurrencyCheckpoint],
  I: [packagesCheckpoint],
  J: [lowLevelCheckpoint],
  // K1 lands in phase 16 with no checkpoint; K checkpoint lives in phase 18.
};

const all: Checkpoint[] = [];
for (const list of Object.values(CheckpointsBySection) as Checkpoint[][]) {
  all.push(...list);
}

export default all;

const byId: Readonly<Record<string, Checkpoint>> = Object.freeze(
  Object.fromEntries(all.map((c) => [c.id, c])),
);

export function checkpointById(id: string): Checkpoint | undefined {
  return byId[id];
}

export function checkpointsForSection(section: SectionId): Checkpoint[] {
  return CheckpointsBySection[section] ?? [];
}
