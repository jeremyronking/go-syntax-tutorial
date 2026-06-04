import type { Checkpoint, SectionId } from '../types';

export const CheckpointsBySection: Partial<Record<SectionId, Checkpoint[]>> = {};

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
