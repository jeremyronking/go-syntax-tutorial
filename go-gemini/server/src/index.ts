import express from 'express';
import path from 'node:path';

const app = express();
app.set('trust proxy', true); // behind Cloudflare tunnel / nginx
const port = process.env.PORT || 8787;
const upstream = process.env.PLAYGROUND_UPSTREAM || 'https://play.golang.org/compile';
const STATIC_DIR = process.env.STATIC_DIR;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.post('/api/compile', async (req, res) => {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const body = Buffer.concat(chunks).toString('utf-8');

    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ Errors: 'Failed to reach upstream playground', Events: null, Status: 500 });
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
  // SPA fallback (Express 4 wildcard).
  app.get('*', (_req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(
    `go-gemini listening on :${port} → ${upstream}` +
      (STATIC_DIR ? ` · static: ${STATIC_DIR}` : '')
  );
});
