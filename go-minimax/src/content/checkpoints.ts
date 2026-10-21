import type { Checkpoint, SectionId } from './types';
import { fundamentalsCheckpoint } from './checkpoints/fundamentals';
import { controlFlowCheckpoint } from './checkpoints/control-flow';

/**
 * Checkpoints are authored per section. The registry maps a section id to its
 * checkpoint; sections without one simply have no entry.
 */
export const checkpoints: Checkpoint[] = [fundamentalsCheckpoint, controlFlowCheckpoint];

const bySection = new Map<SectionId, Checkpoint>(
  checkpoints.map((c) => [c.sectionId, c] as const)
);

export function checkpointBySection(sectionId: string): Checkpoint | undefined {
  return bySection.get(sectionId as SectionId);
}

export function checkpointById(id: string): Checkpoint | undefined {
  return checkpoints.find((c) => c.id === id);
}
