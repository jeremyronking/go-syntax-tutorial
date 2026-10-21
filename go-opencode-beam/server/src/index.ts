import express from 'express';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
const UPSTREAM = process.env.PLAYGROUND_UPSTREAM ?? 'https://play.golang.org/compile';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/api/compile', async (req, res) => {
  try {
    const params = new URLSearchParams();
    if (req.body && typeof req.body === 'object') {
      for (const [k, v] of Object.entries(req.body)) params.set(k, String(v));
    } else if (typeof req.body === 'string') {
      // pass through
    }
    const upstreamRes = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const text = await upstreamRes.text();
    res.status(upstreamRes.status).type('application/json').send(text);
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`proxy listening on ${PORT}, upstream ${UPSTREAM}`);
});
