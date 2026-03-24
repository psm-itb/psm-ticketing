# NUEVALA 2026 — Sistem Tiket Digital

Ini adalah sistem pengiriman dan validasi pemesanan tiket berbasis Google Forms, Google Spreadsheets, Google Apps Script, dan interface web sederhana. Ga perlu server eksternal atau langganan berbayar. Gratis tis tis dan made in-house.

---

## Daftar Isi

- [Gambaran Sistem](#gambaran-sistem)
- [Prasyarat](#prasyarat)
- [Struktur File](#struktur-file)
- [Cara Instalasi](#cara-instalasi)
- [Cara Penggunaan](#cara-penggunaan)
- [Format Data di Spreadsheet](#format-data-di-spreadsheet)
- [FAQ](#faq)
- [Kontak dan Kepemilikan](#kontak-dan-kepemilikan)

---

## Gambaran Sistem

Cara kerja sistem ini mirip mesen tiket pesawat atau tiket travel pulang ke Jakarta via Traveloka:

**Tahap 1 — Pemesanan Tiket**

1. Pembeli memesan tiket via Google Forms
2. Pembayaran tiket diverifikasi oleh bendahara via Google Spreadsheets (centang checkbox secara manual)
3. Panitia ticketing menjalankan script dari menu di Google Spreadsheets dengan klik **Pengiriman Email** > **Kirim Email Tiket**
4. Sistem akan secara otomatis mengirimkan email ke semua pembeli yang sudah terverifikasi. Isinya: tiket digital, QR code, dan kode alfanumerik 4 karakter

**Tahap 2 — Check-In**

1. Pada Hari-H, panitia membuka halaman web scanner di perangkat masing-masing (bisa via HP, tablet, laptop, terserah)
2. Check-In bisa dilakukan dengan dua cara: scan QR code pakai kamera atau input kode 4 karakter secara manual

---

## Prasyarat

Ga perlu instalasi software apa-apa kok, karena semua berjalan di browser. Sengaja dibuat spt ini biar ga ribet.

---

## Struktur File

```
nuevala-ticket-system/
│
├── README.md        — ini yang lagi kalian baca (prosedur)
├── Code.gs          — backend (pengiriman email, validasi tiket)
└── Index.html       — frontend (khusus check-in)
```

Dua file utama (`Code.gs` dan `Index.html`) dimasukkan ke dalam satu Google Apps Script project yang terhubung ke Google Spreadsheets.

---

## Cara Instalasi

### Langkah 1 — Siapkan Forms Pemesanan Tiket

1. Bikin formulir pemesanan tiket konser pakai Google Forms. Ini referensinya: https://docs.google.com/forms/d/e/1FAIpQLSe9gWUw4iqsCd4N5AL-GSKYpwua6EC5Yv1DJIXgwkVd4a6RFg/viewform
2. Atur Google Spreadsheetsnya dengan menambahkan beberapa kolom tambahan. Ini referensinya: https://docs.google.com/spreadsheets/d/127yCm616OPmflOkJKXFi2eSzG21IKrHOT0IRCE6n77I/edit?gid=1961351188#gid=1961351188
3. Pastikan pertanyaan-pertanyaannya persis sama. Urutan kolom tidak harus sama persis, tetapi nama kolomnya harus identik karakter per karakter
4. Kalau mau ubah pertanyaannya, jangan lupa ubah di kode program (lebih jelasnya liat video)

### Langkah 2 — Buka Apps Script

1. Di Google Spreadsheets, klik menu **Ekstensi**
2. Pilih **Apps Script**
3. Tab baru akan terbuka dengan editor script

### Langkah 3 — Masukkan Kode

1. Hapus semua isi file `Code.gs` yang ada di editor
2. Copy seluruh kode file `Code.gs` dari sini, lalu paste ke editor
3. Klik ikon **+** di sebelah tab file untuk membuat file baru
4. Beri nama file baru: `Index.html`
5. Hapus semua isi file, lalu copy seluruh isi file `Index.html` dari sini dan paste ke editor

### Langkah 4 — Save dan Izinkan Akses

1. Tekan `Ctrl+S` untuk save
2. Kembali ke tab Google Spreadsheets, lalu refresh
3. Setelah halaman direfresh, akan muncul menu baru di sebelah **Help** judulnya **Pengiriman Email**
4. Klik **Pengiriman Email**, pilih **Kirim Email Tiket**
5. Google akan minta izin akses. Klik **Lanjutkan**, pilih akun Google yang digunakan, klik **Izinkan**
6. Izin hanya akan diminta sekali
7. Sistem siap digunakan

---

## Cara Penggunaan

### Mengirim Email Tiket

1. Beberapa hal yang bisa dicuekin:
   - Tercentang atau tidaknya kolom `Validasi Bukti Pembayaran` itu terserah bendahara. Kalau memang belum dicentang, berarti pembayarannya belum diverifikasi oleh bendahara. Atau mungkin sudah diverifikasi bendahara, tapi suspicious. Ini ga perlu dikhawatirkan oleh panitia ticketing
   - Kalau memang tiketnya belum pernah dikirimkan, kolom `Status Pengiriman` pada baris tersebut akan kosong. Ini ga perlu dikhawatirkan panitia ticketing
2. Di Google Spreadsheets, klik **Pengiriman Email** > **Kirim Email Tiket**
3. Tunggu hingga muncul notifikasi yang menampilkan jumlah email terkirim dan gagal
4. Kolom `Status Pengiriman` akan terisi `Terkirim` secara otomatis untuk baris yang berhasil

Skrip hanya memproses baris yang memenuhi kedua syarat di atas — baris yang sudah `Terkirim` akan dilewati secara otomatis.

---

### Menggunakan Scanner di Hari-H

**Membuka halaman scanner:**

1. Buka Apps Script dari Google Spreadsheets (**Ekstensi** > **Apps Script**)
2. Klik **Terapkan** > **Kelola Penerapan**
3. Jika belum ada penerapan, klik **Penerapan Baru**
   - Pilih tipe: **Aplikasi Web**
   - Jalankan sebagai: akun Google Anda
   - Siapa yang dapat mengakses: **Siapa saja** agar panitia lain dapat membuka tanpa login
4. Salin URL yang diberikan. Simpen URL ini — URL inilah yang dibagikan ke panlap

**Memvalidasi tiket:**

1. Buka URL scanner di browser perangkat (HP, laptop, tab, bebas)
2. Isi kolom **Nama Penukar** dengan nama si penukar tiket (sometimes bukan penonton, tapi dia nitip temennya untuk nukerin)
3. Untuk scan QR code: klik **Mulai Scan**, arahkan kamera ke QR code pada email tiket pembeli
4. Untuk kode manual: ketik 4 karakter kode pada kolom yang tersedia, lalu klik **Verifikasi**

Hasil validasi akan tampil langsung di layar:
- Hijau: tiket valid dan berhasil divalidasi
- Kuning: tiket sudah pernah divalidasi sebelumnya (tidak boleh masuk lagi)
- Merah: data tidak ditemukan atau kode salah (tiati nih boongin panitia)

---

## Format Data di Spreadsheet

| Kolom | Diisi saat |
|---|---|
| `Kode Alfanumerik` | Pertama kali email dikirim |
| `Status Pengiriman` | Setelah email berhasil atau gagal dikirim |
| `Status Validasi` | Setelah tiket divalidasi di pintu masuk |
| `Waktu Validasi` | Bersamaan dengan status validasi |
| `Keterangan` | Berisi nama panitia yang memvalidasi |

---

## FAQ

**Email gagal terkirim. Gimana?**
Kolom `Status Pengiriman` pada baris tersebut akan terisi `Gagal`. Kosongin lagi nilai di kolom itu, lalu jalankan **Pengiriman Email** > **Kirim Email Tiket** lagi. Baris yang gagal akan diproses ulang.

**Berapa banyak email yang bisa dikirim dalam satu hari?**
Google membatasi pengiriman melalui Apps Script sebanyak 100 email per hari untuk akun Google biasa. Kalau pesanan lebih dari itu, cicil pengirimannya di hari berbeda.

**QR code tidak muncul di email yang diterima pembeli.**
QR code dibuat oleh layanan pihak ketiga saat email dikirim. Kalau layanan itu lagi down, QR code-nya ga kebuat tapi emailnya tetap terkirim. Tenang — kode alfanumerik 4 karakter di bagian bawah email tetap berfungsi penuh sebagai pengganti.

**Kamera tidak bisa dibuka saat scan.**
Halaman scanner akan menampilkan instruksi izin kamera sesuai perangkat yang digunakan. Kalau tetap ga bisa, pakai jalur kode manual saja — minta pembeli tunjukkan kode 4 karakter dari emailnya.

**Pembeli mengklaim belum masuk tapi status validasinya sudah `Valid`.**
Berarti tiketnya sudah discan sebelumnya. Kolom `Keterangan` di spreadsheet mencatat nama panitia yang melakukan validasi, dan kolom `Waktu Validasi` mencatat waktunya. Gunakan kedua informasi itu untuk menelusuri kejadian.

**Gimana cara ganti gambar banner tiket di email?**
Gambar banner disimpan di Google Drive. Unggah gambar baru, ubah aksesnya menjadi **Siapa saja yang memiliki link dapat melihat**, lalu salin ID file dari URL-nya (bagian setelah `/d/` dan sebelum `/view`). Buka `Code.gs`, cari fungsi `getTicketImageBlob`, dan ganti ID lama dengan ID baru sesuai tier tiketnya.

**Gimana cara ubah informasi acara (tanggal, tempat, kontak) di email?**
Buka `Code.gs` dan cari fungsi `buildEmailHtml`. Informasi tanggal, tempat, dan nomor kontak tertulis langsung di dalam fungsi tersebut. Ubah teksnya, lalu save.

**Gimana kalau nama kolom di spreadsheet perlu diubah?**
Perubahan yang sama harus dilakukan di `Code.gs`. Cari string nama kolom yang sesuai di dalam kode dan perbarui nilainya agar tetap cocok.

---

## Kontak dan Kepemilikan

Sistem ini dibuat untuk keperluan internal PSM-ITB sejak Nuevala 2024.

Untuk pertanyaan teknis terkait sistem, hubungi pengelola repositori:
[@sundaysiagian](https://www.instagram.com/sundaysiagian/) di Instagram, atau Line ID **8ukitduri**.

Untuk pertanyaan terkait tiket, hubungi **081263153382 (Indah)** via WhatsApp.

---

*Dokumentasi ini ditulis untuk memudahkan generasi panitia berikutnya, bukan hanya pengguna saat ini. Jaga agar tetap akurat jika ada perubahan sistem.*
