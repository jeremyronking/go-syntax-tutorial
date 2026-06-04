import express, { type Request, type Response } from 'express';
import path from 'node:path';

const PORT = Number(process.env.PORT ?? 8787);
const PLAYGROUND_UPSTREAM = process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';
const STATIC_DIR = process.env.STATIC_DIR;

const app = express();
app.set('trust proxy', true); // behind Cloudflare tunnel / nginx
app.use(express.urlencoded({ extended: false, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, upstream: PLAYGROUND_UPSTREAM });
});

app.post('/api/compile', async (req: Request, res: Response) => {
  const body: string = (() => {
    if (typeof req.body === 'string') return req.body;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(req.body ?? {})) {
      if (Array.isArray(v)) params.set(k, v.join(','));
      else if (v !== undefined && v !== null) params.set(k, String(v));
    }
    return params.toString();
  })();

  try {
    const upstream = await fetch(PLAYGROUND_UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json');
    res.send(text);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown proxy error';
    res.status(502).json({ Errors: message, Events: [], Status: 0, IsTest: false, TestsFailed: 0 });
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
    }),
  );
  // SPA fallback for client-side routing (react-router).
  app.get('*', (_req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.warn(`[gotour] playground proxy listening on :${PORT} -> ${PLAYGROUND_UPSTREAM}`);
  if (STATIC_DIR) console.warn(`[gotour] serving static frontend from ${STATIC_DIR}`);
});
