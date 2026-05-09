/**
 * Smoke test: posts a Hello-World Go program directly to the upstream
 * Playground and verifies the response shape. Run via `pnpm test:smoke`.
 */
const upstream = process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';

const program = `package main

import "fmt"

func main() {
	fmt.Println("hello, world")
}
`;

const body = new URLSearchParams({
  version: '2',
  body: program,
  withVet: 'true',
});

const r = await fetch(upstream, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Origin: new URL(upstream).origin,
  },
  body: body.toString(),
});

if (!r.ok) {
  console.error(`smoke FAIL: HTTP ${r.status}`);
  console.error(await r.text());
  process.exit(1);
}

const json = (await r.json()) as {
  Errors: string;
  Events?: Array<{ Message: string; Kind: string; Delay: number }>;
};

if (json.Errors) {
  console.error('smoke FAIL: Errors=', json.Errors);
  process.exit(1);
}

const events = json.Events ?? [];
const stdoutMessages = events
  .filter((e) => e.Kind === 'stdout')
  .map((e) => e.Message)
  .join('');

if (!stdoutMessages.includes('hello, world')) {
  console.error('smoke FAIL: expected "hello, world" in stdout, got:', stdoutMessages);
  process.exit(1);
}

console.log('smoke OK: hello-world round-trip succeeded');
