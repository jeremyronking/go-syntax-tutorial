import type { Checkpoint, SectionId } from './types';

/**
 * Checkpoints are authored per section. The registry maps a section id to its
 * checkpoint; sections without one simply have no entry.
 *
 * Only the *existence* of a checkpoint is needed to draw the chrome — the
 * sidebar's "checkpoint" link and the lesson footer. The questions
 * themselves are needed on exactly one route, so they are loaded there.
 */

/** The sections that have a checkpoint. Kept eager so the chrome can render. */
export const SECTIONS_WITH_CHECKPOINT: readonly SectionId[] = [
  'fundamentals',
  'control-flow',
  'composite-types',
  'functions',
  'interfaces',
  'generics',
  'errors',
  'concurrency',
  'packages',
  'low-level',
  'toolchain',
];

interface CheckpointChunk {
  /** The name of the exported checkpoint inside the chunk module. */
  exportName: string;
  load: () => Promise<Record<string, unknown>>;
}

const checkpointChunks: Partial<Record<SectionId, CheckpointChunk>> = {
  fundamentals: {
    exportName: 'fundamentalsCheckpoint',
    load: () => import('./checkpoints/fundamentals'),
  },
  'control-flow': {
    exportName: 'controlFlowCheckpoint',
    load: () => import('./checkpoints/control-flow'),
  },
  'composite-types': {
    exportName: 'compositeTypesCheckpoint',
    load: () => import('./checkpoints/composite-types'),
  },
  functions: {
    exportName: 'functionsCheckpoint',
    load: () => import('./checkpoints/functions'),
  },
  interfaces: {
    exportName: 'interfacesCheckpoint',
    load: () => import('./checkpoints/interfaces'),
  },
  generics: {
    exportName: 'genericsCheckpoint',
    load: () => import('./checkpoints/generics'),
  },
  errors: {
    exportName: 'errorsCheckpoint',
    load: () => import('./checkpoints/errors'),
  },
  concurrency: {
    exportName: 'concurrencyCheckpoint',
    load: () => import('./checkpoints/concurrency'),
  },
  packages: {
    exportName: 'packagesCheckpoint',
    load: () => import('./checkpoints/packages'),
  },
  'low-level': {
    exportName: 'lowLevelCheckpoint',
    load: () => import('./checkpoints/low-level'),
  },
  toolchain: {
    exportName: 'toolchainCheckpoint',
    load: () => import('./checkpoints/toolchain'),
  },
};

const cache = new Map<SectionId, Checkpoint>();

/** Does this section have a checkpoint? Synchronous, cheap, eager. */
export function hasCheckpoint(sectionId: string): boolean {
  return SECTIONS_WITH_CHECKPOINT.includes(sectionId as SectionId);
}

/** Load a section's checkpoint. Returns undefined when there is none. */
export async function loadCheckpoint(sectionId: string): Promise<Checkpoint | undefined> {
  const key = sectionId as SectionId;
  const cached = cache.get(key);
  if (cached) return cached;

  const chunk = checkpointChunks[key];
  if (!chunk) return undefined;

  const mod = await chunk.load();
  const value = mod[chunk.exportName];
  if (!value) return undefined;

  const checkpoint = value as Checkpoint;
  cache.set(key, checkpoint);
  return checkpoint;
}
