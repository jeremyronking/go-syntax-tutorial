import type { Checkpoint } from './types';
import { fundamentalsCheckpoint } from './checkpoints/fundamentals';
import { controlFlowCheckpoint } from './checkpoints/control-flow';
import { compositeTypesCheckpoint } from './checkpoints/composite-types';
import { functionsCheckpoint } from './checkpoints/functions';
import { interfacesCheckpoint } from './checkpoints/interfaces';
import { genericsCheckpoint } from './checkpoints/generics';
import { errorsCheckpoint } from './checkpoints/errors';
import { concurrencyCheckpoint } from './checkpoints/concurrency';

export const checkpoints: Checkpoint[] = [
  fundamentalsCheckpoint,
  controlFlowCheckpoint,
  compositeTypesCheckpoint,
  functionsCheckpoint,
  interfacesCheckpoint,
  genericsCheckpoint,
  errorsCheckpoint,
  concurrencyCheckpoint,
];

export function checkpointBySection(sectionId: string): Checkpoint | undefined {
  return checkpoints.find((c) => c.sectionId === sectionId);
}
