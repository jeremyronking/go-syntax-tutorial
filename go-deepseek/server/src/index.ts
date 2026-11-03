import express from 'express';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PLAYGROUND_UPSTREAM = 'https://play.golang.org/compile';
const STATIC_DIR = process.env.STATIC_DIR;
const STATIC_ROOT = STATIC_DIR ? path.resolve(STATIC_DIR) : undefined;

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

  if (STATIC_ROOT) {
    app.use(
      express.static(STATIC_ROOT, {
        // Hashed asset filenames are immutable; index.html must revalidate.
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
        },
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.join(STATIC_ROOT, 'index.html'));
    });
  }

  return app;
}

const PORT = Number(process.env.PORT ?? 8787);

const isEntrypoint =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  createApp().listen(PORT, () => {
    console.log(
      `go-deepseek proxy listening on :${PORT}` + (STATIC_DIR ? ` · static: ${STATIC_DIR}` : '')
    );
  });
}
