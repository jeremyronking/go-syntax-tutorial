export type PlaygroundEvent = {
  Message: string;
  Kind: 'stdout' | 'stderr';
  Delay: number;
};

export type PlaygroundResponse = {
  Errors: string;
  Events: PlaygroundEvent[];
  Status: number;
  IsTest: boolean;
  TestsFailed: number;
  VetErrors?: string;
  VetOK?: boolean;
};

function isResponse(value: unknown): value is PlaygroundResponse {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.Errors === 'string' &&
    Array.isArray(candidate.Events) &&
    typeof candidate.Status === 'number'
  );
}

export async function runProgram(source: string): Promise<PlaygroundResponse> {
  const response = await fetch('/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ version: '2', body: source, withVet: 'true' }).toString(),
  });

  const payload: unknown = await response.json();
  if (!isResponse(payload)) {
    throw new Error(`Playground returned an unexpected response (HTTP ${response.status})`);
  }
  return payload;
}

/** Playground event delays are nanoseconds. */
export const delayToMs = (nanoseconds: number): number => nanoseconds / 1_000_000;
