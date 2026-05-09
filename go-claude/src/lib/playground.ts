export type PlaygroundEvent = {
  Message: string;
  Kind: 'stdout' | 'stderr';
  /** Nanoseconds */
  Delay: number;
};

export type PlaygroundResponse = {
  Errors: string;
  Events: PlaygroundEvent[] | null;
  Status: number;
  IsTest?: boolean;
  TestsFailed?: number;
  VetErrors?: string;
  VetOK?: boolean;
};

export type CompileRequest = {
  body: string;
  withVet?: boolean;
  signal?: AbortSignal;
};

export async function compile({
  body,
  withVet = true,
  signal,
}: CompileRequest): Promise<PlaygroundResponse> {
  const params = new URLSearchParams({
    version: '2',
    body,
    withVet: String(withVet),
  });

  const res = await fetch('/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`compile: HTTP ${res.status}\n${text}`);
  }

  return (await res.json()) as PlaygroundResponse;
}
