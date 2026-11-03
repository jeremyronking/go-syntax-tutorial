import { createApp } from './index';

const SOURCE = `package main

import "fmt"

func main() {
\tfmt.Println("proxy ok")
}
`;

const app = createApp();
const server = app.listen(0, async () => {
  const address = server.address();
  if (address === null || typeof address === 'string') {
    throw new Error('could not determine smoke-test port');
  }
  const url = `http://127.0.0.1:${address.port}/api/compile`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ version: '2', body: SOURCE, withVet: 'true' }).toString(),
  });
  const json = (await response.json()) as {
    Errors?: string;
    Events?: Array<{ Message: string; Kind: string }>;
    Status?: number;
  };
  server.close();

  const stdout = (json.Events ?? [])
    .filter((event) => event.Kind === 'stdout')
    .map((event) => event.Message)
    .join('');

  if (response.status !== 200 || json.Errors || !stdout.includes('proxy ok')) {
    console.error('smoke failed', response.status, json);
    process.exit(1);
  }
  console.log('smoke ok:', stdout.trim());
});
