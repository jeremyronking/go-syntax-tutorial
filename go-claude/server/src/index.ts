import express from 'express';
import path from 'node:path';

const PORT = Number(process.env.PORT ?? 8787);
const PLAYGROUND_UPSTREAM =
  process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';
const STATIC_DIR = process.env.STATIC_DIR; // unset in dev (Vite serves), set in prod container

const app = express();
app.set('trust proxy', true); // behind Cloudflare tunnel / nginx

app.use(
  express.urlencoded({
    extended: false,
    limit: '256kb',
  })
);

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, upstream: PLAYGROUND_UPSTREAM });
});

app.post('/api/compile', async (req, res) => {
  const body = new URLSearchParams();
  const { version, body: source, withVet } = req.body as Record<string, string | undefined>;

  body.set('version', version ?? '2');
  body.set('body', source ?? '');
  body.set('withVet', withVet ?? 'true');

  try {
    const upstream = await fetch(PLAYGROUND_UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: new URL(PLAYGROUND_UPSTREAM).origin,
      },
      body: body.toString(),
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
  // SPA fallback for client-side routing — Express 4 wildcard.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `go-claude listening on :${PORT} → ${PLAYGROUND_UPSTREAM}` +
      (STATIC_DIR ? ` · static: ${STATIC_DIR}` : '')
  );
});
