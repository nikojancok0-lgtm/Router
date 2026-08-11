# Nikonet Speedtest

Website speedtest dengan branding **Nikonet** untuk mengukur:

- Ping
- Download Mbps
- Upload Mbps
- IP address
- ISP
- Lokasi
- Riwayat hasil test di browser

## Cara menjalankan

Persyaratan:
- Node.js 18+

Install:

```bash
npm install
```

Jalankan:

```bash
npm start
```

Buka:

```text
http://localhost:3000
```

## Cara upload ke GitHub

```bash
git init
git add .
git commit -m "Initial Nikonet Speedtest"
git branch -M main
git remote add origin https://github.com/USERNAME/nikonet-speedtest.git
git push -u origin main
```

## Hosting

Project ini membutuhkan server Node.js karena endpoint download/upload berada di backend.

Cocok untuk hosting yang mendukung Node.js seperti VPS atau platform Node.js.

**GitHub Pages saja tidak cukup untuk menjalankan backend speedtest ini.**

## Catatan akurasi

Hasil speedtest adalah perkiraan performa koneksi antara browser dan server tempat aplikasi ini dijalankan. Jika server jauh dari pengguna, hasil bisa lebih rendah. Untuk hasil terbaik, deploy beberapa server pengujian di lokasi berbeda dan pilih server terdekat.

Informasi IP/ISP/lokasi menggunakan layanan `ipapi.co` dari browser dan dapat gagal jika diblokir oleh jaringan/adblocker.

## Keamanan

- Jangan menyimpan password atau secret di frontend.
- Batasi ukuran request upload seperti pada `server.js`.
- Untuk deployment publik, tambahkan rate limiting dan HTTPS.
- Gunakan server yang memang Anda miliki atau kelola.
