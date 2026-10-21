export type PlaygroundEvent = {
  Message: string;
  Kind: 'stdout' | 'stderr';
  /** Nanoseconds to wait before this event, relative to the previous one. */
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

export type CompileFailure = {
  kind: 'network';
  message: string;
};

/**
 * POST the snippet to the Go Playground through the local proxy. The
 * upstream speaks form encoding, not JSON.
 */
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

  let res: Response;
  try {
    res = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new Error(
      `Could not reach the compile proxy. Is it running?\n${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`compile: HTTP ${res.status}\n${text}`);
  }

  return (await res.json()) as PlaygroundResponse;
}
