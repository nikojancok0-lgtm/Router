const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/ping", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true, time: Date.now() });
});

// Stream bytes without allocating a huge buffer.
// The browser measures the actual transfer time.
app.get("/api/download", (req, res) => {
  const requested = Number(req.query.bytes || 10 * 1024 * 1024);
  const total = Math.min(Math.max(requested, 256 * 1024), 100 * 1024 * 1024);

  res.status(200);
  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Length": String(total),
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Speedtest": "Nikonet"
  });

  const chunk = crypto.randomBytes(256 * 1024);
  let sent = 0;

  function write() {
    while (sent < total) {
      const remaining = total - sent;
      const data = remaining >= chunk.length ? chunk : chunk.subarray(0, remaining);
      sent += data.length;
      if (!res.write(data)) {
        res.once("drain", write);
        return;
      }
    }
    res.end();
  }

  write();
});

app.post("/api/upload", express.raw({
  type: "*/*",
  limit: "100mb"
}), (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true, bytes: req.body?.length || 0, time: Date.now() });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Nikonet Speedtest running at http://localhost:${PORT}`);
});
