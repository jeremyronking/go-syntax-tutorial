import { createServer } from 'node:http';

/**
 * Minimal stand-in for the Go Playground compile endpoint, used to verify
 * that PLAYGROUND_UPSTREAM is honoured by the proxy.
 */
const port = Number(process.env.MOCK_PORT ?? 9999);

createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += String(chunk);
  });
  req.on('end', () => {
    const form = new URLSearchParams(body);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        Errors: '',
        Events: [
          {
            Message: `mock upstream received ${form.get('body')?.length ?? 0} bytes of source\n`,
            Kind: 'stdout',
            Delay: 0,
          },
        ],
        Status: 0,
        IsTest: false,
        TestsFailed: 0,
        VetOK: true,
      })
    );
  });
}).listen(port, () => {
  console.log(`mock playground upstream on :${port}`);
});
