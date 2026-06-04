import express, { type Request, type Response } from 'express';

const PORT = Number(process.env.PORT ?? 8787);
const PLAYGROUND_UPSTREAM = process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';

const app = express();
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

app.listen(PORT, () => {
  console.warn(`[gotour] playground proxy listening on :${PORT} -> ${PLAYGROUND_UPSTREAM}`);
});
