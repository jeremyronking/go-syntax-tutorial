import express from "express";
import cors from "cors";
import path from "node:path";

const PORT = parseInt(process.env.PORT ?? "8787", 10);
const UPSTREAM =
  process.env.PLAYGROUND_UPSTREAM ?? "https://play.golang.org";
const STATIC_DIR = process.env.STATIC_DIR;

const app = express();
app.set("trust proxy", true); // behind Cloudflare tunnel / nginx
app.use(cors());
app.use(express.text({ type: "application/x-www-form-urlencoded" }));

app.post("/api/compile", async (req, res) => {
  try {
    const body = typeof req.body === "string" ? req.body : "";

    const upstream = await fetch(`${UPSTREAM}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await upstream.text();

    // Try to parse as JSON; if it fails, try splitting by newlines
    // (Playground sometimes returns newline-delimited JSON)
    let parsed: Record<string, unknown> | undefined;
    try {
      parsed = JSON.parse(data);
    } catch {
      // Multi-line JSON: each line is a separate JSON object
      const lines = data
        .split("\n")
        .filter((l: string) => l.trim())
        .map((l: string) => JSON.parse(l));
      parsed = lines[lines.length - 1];
    }

    res.json(parsed ?? { Errors: "No response from upstream", Events: [], Status: 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown proxy error";
    res.status(502).json({ Errors: message, Events: [], Status: 0 });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, upstream: UPSTREAM });
});

if (STATIC_DIR) {
  app.use(
    express.static(STATIC_DIR, {
      maxAge: "1y",
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );
  // SPA fallback (Express 4 wildcard).
  app.get("*", (_req, res) => {
    res.sendFile(path.join(STATIC_DIR, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`go-glm listening on :${PORT}`);
  console.log(`  Upstream: ${UPSTREAM}/compile`);
  if (STATIC_DIR) console.log(`  Static: ${STATIC_DIR}`);
});