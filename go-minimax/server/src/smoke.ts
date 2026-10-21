/**
 * Smoke test for the compile proxy.
 *
 *   pnpm --filter go-minimax-server smoke
 *
 * Hits a locally running proxy (default http://localhost:8787) and asserts
 * the Playground response shape. Point it at a mock upstream with
 * PLAYGROUND_UPSTREAM to verify the override path.
 */
const BASE_URL = process.env.PROXY_URL ?? 'http://localhost:8787';

type PlaygroundResponse = {
  Errors: string;
  Events: Array<{ Message: string; Kind: string; Delay: number }> | null;
  Status: number;
  IsTest?: boolean;
  VetErrors?: string;
  VetOK?: boolean;
};

const PROGRAM = `package main

import "fmt"

func main() {
	fmt.Println("hello from the smoke test")
}
`;

async function main(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ version: '2', body: PROGRAM, withVet: 'true' }).toString(),
  });

  const text = await res.text();
  let payload: PlaygroundResponse;
  try {
    payload = JSON.parse(text) as PlaygroundResponse;
  } catch {
    throw new Error(`proxy did not return JSON (HTTP ${res.status}): ${text.slice(0, 400)}`);
  }

  if (!('Errors' in payload) || !('Status' in payload) || !('Events' in payload)) {
    throw new Error(`unexpected payload shape: ${text.slice(0, 400)}`);
  }

  if (payload.Errors !== '') {
    throw new Error(`compile failed:\n${payload.Errors}`);
  }

  const stdout = (payload.Events ?? [])
    .filter((e) => e.Kind === 'stdout')
    .map((e) => e.Message)
    .join('');

  if (!stdout.includes('hello from the smoke test')) {
    throw new Error(`expected program output, got:\n${stdout}`);
  }

  console.log(`smoke ok: ${BASE_URL}/api/compile -> ${stdout.trim()}`);
}

main().catch((err: unknown) => {
  console.error(`smoke failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
