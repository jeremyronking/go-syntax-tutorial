export interface PlaygroundEvent {
  Message: string;
  Kind: 'stdout' | 'stderr';
  Delay: number; // nanoseconds
}

export interface PlaygroundResponse {
  Errors: string;
  Events: PlaygroundEvent[];
  Status: number;
  IsTest: boolean;
  TestsFailed: number;
  VetErrors?: string;
  VetOK?: boolean;
}

export interface PlaygroundError extends Error {
  status?: number;
}

export async function compileOnPlayground(
  source: string,
  signal?: AbortSignal,
): Promise<PlaygroundResponse> {
  const body = new URLSearchParams({
    version: '2',
    body: source,
    withVet: 'true',
  });
  const res = await fetch('/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal,
  });
  if (!res.ok) {
    const err: PlaygroundError = new Error(
      `Playground proxy responded ${res.status} ${res.statusText}`,
    );
    err.status = res.status;
    throw err;
  }
  return (await res.json()) as PlaygroundResponse;
}

export function nanoToMs(nanos: number): number {
  if (!Number.isFinite(nanos) || nanos <= 0) return 0;
  return Math.min(2000, Math.max(0, Math.round(nanos / 1_000_000)));
}
