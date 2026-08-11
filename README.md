# Tenda N301 Control

Web dashboard lokal untuk mengontrol router Tenda N301.

## Status project

Project ini adalah **starter yang aman dan siap dikembangkan**, bukan implementasi palsu yang mengklaim kompatibel dengan semua firmware N301.

Firmware Tenda N301 berbeda-beda dan endpoint administrasinya tidak universal. Karena itu source code ini tidak menebak endpoint login, status, Wi-Fi, client, atau reboot.

## Menjalankan

Persyaratan:
- Node.js 18 atau lebih baru
- HP/laptop berada di jaringan yang sama dengan router

```bash
npm install
npm start
```

Buka:

```text
http://localhost:3000
```

Jika IP router bukan `192.168.0.1`, jalankan:

```bash
ROUTER_IP=192.168.1.1 npm start
```

Windows PowerShell:

```powershell
$env:ROUTER_IP="192.168.1.1"
npm start
```

## Integrasi Tenda

1. Sambungkan perangkat ke router.
2. Buka halaman admin Tenda.
3. Cari informasi firmware/version.
4. Gunakan browser DevTools > Network untuk melihat request ketika membuka Status, Wireless, Client, atau Reboot.
5. Implementasikan endpoint spesifik firmware di `server.js`.
6. Jangan membuat proxy URL bebas dari input pengguna.
7. Jangan commit password router, cookie sesi, token, atau credential ke GitHub.

## Struktur

```text
public/
  index.html
  style.css
  app.js
server.js
package.json
.gitignore
README.md
```

## GitHub

Setelah mengekstrak ZIP:

```bash
git init
git add .
git commit -m "Initial Tenda N301 control dashboard"
git branch -M main
git remote add origin https://github.com/USERNAME/tenda-n301-control.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.

## Catatan keamanan

Dashboard ini sebaiknya hanya dijalankan di jaringan lokal. Jangan mengekspos port dashboard ke internet tanpa autentikasi, HTTPS, dan desain keamanan yang benar.
