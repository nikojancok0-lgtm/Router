# NIKONET Speedtest — GitHub Pages Edition

Versi ini dibuat khusus untuk **GitHub Pages**.

## Kenapa versi sebelumnya rusak?

GitHub Pages untuk repository project menggunakan URL seperti:

`https://USERNAME.github.io/NAMA-REPOSITORY/`

Asset dengan path `/style.css` dicari dari domain root, bukan dari folder repository. Selain itu, GitHub Pages hanya menyediakan hosting statis (HTML/CSS/JavaScript), sehingga backend Express `/api/download` dan `/api/upload` tidak bisa dijalankan di sana.

Versi ini:
- menaruh `index.html`, `style.css`, dan `app.js` di root repository;
- memakai path `./style.css` dan `./app.js`;
- memakai `@cloudflare/speedtest` di browser untuk pengukuran download/upload/latency.

Cloudflare mendokumentasikan package tersebut sebagai engine speedtest yang melakukan pengukuran ke edge network mereka. Hasil mencakup download, upload, latency, jitter, dan packet loss. Data pengukuran dapat diproses oleh Cloudflare sesuai kebijakan mereka.

## Upload

Di repository GitHub Anda, upload **isi folder ini** sehingga `index.html` berada langsung di root.

Kemudian:
`Settings → Pages → Deploy from a branch → main → / (root) → Save`

Tunggu deployment selesai.

URL:
`https://USERNAME.github.io/NAMA-REPOSITORY/`

## Catatan

Karena GitHub Pages hanya statis, server speedtest-nya bukan server Nikonet sendiri. Pengukuran memakai Cloudflare Speedtest engine.

Untuk speedtest dengan **server Nikonet sendiri**, gunakan versi Node.js yang ada di project `nikonet-speedtest-online` dan deploy ke VPS/Render/hosting Node.js.
