# NIKONET Speedtest — GitHub Pages FIX

Versi ini menghindari error `unable to get turn server credentials` dari package `@cloudflare/speedtest` dengan **tidak menjalankan pengujian packet loss WebRTC/TURN**. Library resmi Cloudflare memang memakai TURN/WebRTC untuk packet-loss measurement, sehingga implementasi browser-only di GitHub Pages dapat membutuhkan kredensial TURN. citeturn548935search5turn548935search2

Versi ini mengukur:
- Ping / latency
- Download
- Upload
- IP / ISP / lokasi dari endpoint metadata Cloudflare
- Riwayat lokal

GitHub Pages tetap hanya membutuhkan file statis.

## Upload
Pastikan struktur repository:
```
index.html
style.css
app.js
README.md
.nojekyll
```

Kemudian GitHub:
`Settings → Pages → Deploy from a branch → main → / (root)`

URL:
`https://USERNAME.github.io/REPOSITORY/`

## Catatan
Speed test memakai endpoint Cloudflare Speed Test. Cloudflare menjelaskan bahwa layanan Speed Test menerima IP dan menggunakan data jaringan seperti lokasi perkiraan dan ASN untuk pengukuran. citeturn548935search0
