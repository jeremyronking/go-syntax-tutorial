import type { Checkpoint } from './types';
import { fundamentalsCheckpoint } from './checkpoints/fundamentals';
import { controlFlowCheckpoint } from './checkpoints/control-flow';
import { compositeTypesCheckpoint } from './checkpoints/composite-types';
import { functionsCheckpoint } from './checkpoints/functions';

export const checkpoints: Checkpoint[] = [
  fundamentalsCheckpoint,
  controlFlowCheckpoint,
  compositeTypesCheckpoint,
  functionsCheckpoint,
];

export function checkpointBySection(sectionId: string): Checkpoint | undefined {
  return checkpoints.find((c) => c.sectionId === sectionId);
}
