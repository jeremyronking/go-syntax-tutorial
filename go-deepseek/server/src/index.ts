import express from 'express';
import { pathToFileURL } from 'node:url';

const PLAYGROUND_UPSTREAM = 'https://play.golang.org/compile';

export function createApp(upstream = process.env.PLAYGROUND_UPSTREAM ?? PLAYGROUND_UPSTREAM) {
  const app = express();
  app.set('trust proxy', true);

  app.use(express.urlencoded({ extended: false, limit: '1mb' }));

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true, upstream });
  });

  app.post('/api/compile', async (req, res) => {
    const { version, body: source, withVet } = req.body as Record<string, string | undefined>;

    const payload = new URLSearchParams();
    payload.set('version', version ?? '2');
    payload.set('body', source ?? '');
    payload.set('withVet', withVet ?? 'true');

    try {
      const response = await fetch(upstream, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: new URL(upstream).origin,
        },
        body: payload.toString(),
      });

      const text = await response.text();
      res.status(response.status);
      const contentType = response.headers.get('content-type');
      if (contentType) res.setHeader('Content-Type', contentType);
      res.send(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown upstream error';
      // Upstream failures are surfaced as Playground-shaped JSON so the client renders them.
      res.status(502).json({ Errors: `proxy: ${message}`, Events: [], Status: 1 });
    }
  });

  return app;
}

const PORT = Number(process.env.PORT ?? 8787);

const isEntrypoint =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  createApp().listen(PORT, () => {
    console.log(`go-deepseek proxy listening on :${PORT}`);
  });
}
