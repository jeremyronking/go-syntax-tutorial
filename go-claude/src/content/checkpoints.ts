import type { Checkpoint } from './types';

export const checkpoints: Checkpoint[] = [];

export function checkpointBySection(sectionId: string): Checkpoint | undefined {
  return checkpoints.find((c) => c.sectionId === sectionId);
}
