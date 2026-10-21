const NS = 'gotour:v1';

export type ProgressStatus = 'unstarted' | 'in-progress' | 'complete';

export type CheckpointScore = { correct: number; total: number; lastAttempt: string };

export type PersistedState = {
  progress: Record<string, ProgressStatus>;
  editorDrafts: Record<string, string>;
  checkpointScores: Record<string, CheckpointScore>;
};

const empty: PersistedState = { progress: {}, editorDrafts: {}, checkpointScores: {} };

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(NS);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      progress: parsed.progress ?? {},
      editorDrafts: parsed.editorDrafts ?? {},
      checkpointScores: parsed.checkpointScores ?? {},
    };
  } catch {
    return { ...empty };
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(NS, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(NS);
  localStorage.removeItem('gotour:v1:theme');
  localStorage.removeItem('gotour:v1:sidebar');
}
