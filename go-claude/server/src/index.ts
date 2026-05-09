import express from 'express';

const PORT = Number(process.env.PORT ?? 8787);
const PLAYGROUND_UPSTREAM =
  process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';

const app = express();

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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`go-claude proxy listening on :${PORT} → ${PLAYGROUND_UPSTREAM}`);
});
