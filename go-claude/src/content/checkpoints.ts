import type { Checkpoint } from './types';
import { fundamentalsCheckpoint } from './checkpoints/fundamentals';
import { controlFlowCheckpoint } from './checkpoints/control-flow';

export const checkpoints: Checkpoint[] = [fundamentalsCheckpoint, controlFlowCheckpoint];

export function checkpointBySection(sectionId: string): Checkpoint | undefined {
  return checkpoints.find((c) => c.sectionId === sectionId);
}
