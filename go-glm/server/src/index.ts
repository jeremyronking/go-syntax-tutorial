import express from "express";
import cors from "cors";

const PORT = parseInt(process.env.PORT ?? "8787", 10);
const UPSTREAM =
  process.env.PLAYGROUND_UPSTREAM ?? "https://play.golang.org";

const app = express();
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

app.listen(PORT, () => {
  console.log(`GoTour proxy listening on :${PORT}`);
  console.log(`  Upstream: ${UPSTREAM}/compile`);
});