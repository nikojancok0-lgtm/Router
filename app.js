import SpeedTest from "https://cdn.jsdelivr.net/npm/@cloudflare/speedtest@1.12.1/dist/speedtest.js";

const $ = (id) => document.getElementById(id);

function mbps(bps) {
  return Number(bps || 0) / 1_000_000;
}
function f(n) {
  return Number(n || 0).toFixed(2);
}
function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function saveResult(r) {
  const data = JSON.parse(localStorage.getItem("nikonet-history") || "[]");
  data.unshift({ date: new Date().toLocaleString("id-ID"), ...r });
  localStorage.setItem("nikonet-history", JSON.stringify(data.slice(0,10)));
  renderHistory();
}

function renderHistory() {
  const data = JSON.parse(localStorage.getItem("nikonet-history") || "[]");
  $("historyList").innerHTML = data.length ? data.map(x => `
    <div class="result">
      <span>${escapeHtml(x.date)}</span>
      <b>↓ ${f(x.download)} Mbps</b>
      <b>↑ ${f(x.upload)} Mbps</b>
      <b>Ping ${Math.round(x.ping)} ms</b>
    </div>
  `).join("") : '<p class="muted">Belum ada hasil test.</p>';
}

async function loadMeta() {
  try {
    const r = await fetch("https://speed.cloudflare.com/meta", {cache:"no-store"});
    const d = await r.json();
    $("ip").textContent = d.clientIp || "-";
    $("isp").textContent = d.asOrganization ? `${d.asOrganization} (AS${d.asn || "-"})` : "-";
    $("location").textContent = [d.city, d.country].filter(Boolean).join(", ") || "-";
  } catch {
    $("ip").textContent = "Tidak tersedia";
    $("isp").textContent = "Tidak tersedia";
    $("location").textContent = "Tidak tersedia";
  }
  $("time").textContent = new Date().toLocaleString("id-ID");
  $("browser").textContent = navigator.userAgent.includes("Android") ? "Android / Chrome" : navigator.userAgent.split(" ").slice(-1)[0] || "Browser";
}

let engine = null;
function createEngine() {
  engine = new SpeedTest({ autoStart: false });
  engine.onRunningChange = (running) => {
    $("start").disabled = running;
    $("phase").textContent = running ? "TESTING" : "READY";
    if (!running) $("gauge").style.filter = "none";
  };
  engine.onResultsChange = ({type}) => {
    const s = engine.results.getSummary();
    if (type === "latency") {
      $("phase").textContent = "PING";
      $("ping").textContent = Math.round(s.latency || 0);
    } else if (type === "download") {
      $("phase").textContent = "DOWNLOAD";
      $("speed").textContent = f(mbps(s.download));
      $("download").textContent = f(mbps(s.download));
    } else if (type === "upload") {
      $("phase").textContent = "UPLOAD";
      $("speed").textContent = f(mbps(s.upload));
      $("upload").textContent = f(mbps(s.upload));
    }
  };
  engine.onFinish = (results) => {
    const s = results.getSummary();
    $("phase").textContent = "DONE";
    $("speed").textContent = f(mbps(s.download));
    $("download").textContent = f(mbps(s.download));
    $("upload").textContent = f(mbps(s.upload));
    $("ping").textContent = Math.round(s.latency || 0);
    saveResult({
      download: mbps(s.download),
      upload: mbps(s.upload),
      ping: s.latency || 0
    });
  };
  engine.onError = (err) => {
    $("phase").textContent = "ERROR";
    $("start").disabled = false;
    alert("Speedtest gagal: " + (err?.message || err || "Error"));
  };
}

$("start").addEventListener("click", () => {
  if (!engine) createEngine();
  engine.restart();
});
$("clearHistory").addEventListener("click", () => {
  localStorage.removeItem("nikonet-history");
  renderHistory();
});
$("year").textContent = new Date().getFullYear();
renderHistory();
loadMeta();
createEngine();
