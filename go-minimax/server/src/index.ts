import express from 'express';
import path from 'node:path';

const PORT = Number(process.env.PORT ?? 8787);
const PLAYGROUND_UPSTREAM =
  process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';
/** When set, the server also serves the built SPA (production container). */
const STATIC_DIR = process.env.STATIC_DIR;

const app = express();
app.set('trust proxy', true);

app.use(
  express.urlencoded({
    extended: false,
    limit: '256kb',
  })
);

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, upstream: PLAYGROUND_UPSTREAM });
});

/**
 * Thin pass-through to the Go Playground compile endpoint. The upstream
 * payload is forwarded byte-for-byte so compiler and vet diagnostics reach
 * the browser exactly as the Playground produced them.
 */
app.post('/api/compile', async (req, res) => {
  const form = new URLSearchParams();
  const incoming = req.body as Record<string, string | undefined>;

  form.set('version', incoming.version ?? '2');
  form.set('body', incoming.body ?? '');
  form.set('withVet', incoming.withVet ?? 'true');

  try {
    const upstream = await fetch(PLAYGROUND_UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: new URL(PLAYGROUND_UPSTREAM).origin,
      },
      body: form.toString(),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    res.send(text);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown upstream error';
    res.status(502).json({ Errors: `proxy: ${message}`, Events: [], Status: 1 });
  }
});

if (STATIC_DIR) {
  app.use(
    express.static(STATIC_DIR, {
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    })
  );
  // SPA fallback for client-side routing.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(
    `go-minimax proxy listening on :${PORT} -> ${PLAYGROUND_UPSTREAM}` +
      (STATIC_DIR ? ` | static: ${STATIC_DIR}` : '')
  );
});
