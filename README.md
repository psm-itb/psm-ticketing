Ini adalah sistem pengiriman dan validasi pemesanan tiket berbasis Google Forms, Google Spreadsheets, Google Apps Script, dan interface web sederhana. Ga perlu server eksternal atau langganan berbayar. Gratis tis tis dan made in-house.

---

## Daftar Isi

- [Gambaran Sistem](#gambaran-sistem)
- [Prasyarat](#prasyarat)
- [Struktur File](#struktur-file)
- [Cara Penggunaan](#cara-penggunaan)
- [Format Data di Spreadsheet](#format-data-di-spreadsheet)
- [Alur Kerja Lengkap](#alur-kerja-lengkap)
- [Batasan yang Perlu Diketahui](#batasan-yang-perlu-diketahui)
- [Pemeliharaan](#pemeliharaan)
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

1. Pada Hari-H, panitia membuka halaman web scanner di perangkat masing-masing (bisa via HP)
2. Check-In bisa dilakukan dengan dua cara: scan QR code pakai kamera atau input kode 4 karakter secara manual

---

## Prasyarat/Prerequisite

Ga perlu instalasi software apa-apa kok. Semua berjalan di browser selama ada akun Google konsernya.

---

## Struktur File

```
nuevala-ticket-system/
│
├── README.md        — ini yang lagi kalian baca (prosedur)
├── Code.gs          — backend (pengirimann email, validasi tiket)
└── Index.html       — frontend (khusus check-in)
```

Dua file utama (`Code.gs` dan `Index.html`) dimasukkan ke dalam satu Google Apps Script project yang terhubung ke Google Spreadsheets.

---

## Cara Instalasi

### Langkah 1 — Siapkan Forms Pemesanan Tiket

1. Bikin formulir pemesanan tiket konser pakai Google Forms.
2. Atur Google Spreadsheetsnya dengan menambahkan beberapa kolom tambahan. Ini referensinya: https://docs.google.com/spreadsheets/d/127yCm616OPmflOkJKXFi2eSzG21IKrHOT0IRCE6n77I/edit?gid=1961351188#gid=1961351188
3. Pastikan pertanyaan-pertanyaannya persis sama. Urutan kolom tidak harus sama persis, tetapi nama kolomnya harus identik karakter per karakter. 
4. Kalau mau ubah pertanyaannya, jangan lupa ubah di kode program (lebih jelasnya liat video)

### Langkah 2 — Buka Apps Script

1. Di Google Spreadsheets, klik menu **Ekstensi** (Extensions)
2. Pilih **Apps Script**
3. Tab baru akan terbuka dengan editor script

### Langkah 3 — Masukkan Kode

1. Hapus semua isi file `Code.gs` yang ada di editor 
2. Copy seluruh kode file `Code.gs` dari sini, dan paste ke editor
3. Klik ikon **+** di sebelah tab file untuk membuat file baru
4. Beri nama file baru: `Index.html`
5. Hapus isi default, lalu copy seluruh isi file `Index.html` dari sini dan paste ke sana

### Langkah 4 — Save dan Izinkan Akses

1. Tekan `Ctrl+S` utk save 
2. Kembali ke tab Google Spreadsheets, lalu refresh
3. Setelah halaman direfresh, akan muncul menu baru di sebelah **"Help"** judulnya **"Pengiriman Email"** 
4. Klik menu tersebut, pilih **"Kirim Email Tiket"**
5. Google akan minta izin akses. Klik **Lanjutkan**, pilih akun Google yang digunakan, klik **Izinkan**
6. Izin hanya akan diminta sekali.
7. Sistem siap digunakan

## Cara Penggunaan

### Mengirim Email Tiket

1. Beberapa hal yang bisa dicuekin:
- Tercentang atau tidaknya kolom `Validasi Bukti Pembayaran` itu terserah bendahara. Kalau memang belum dicentang, berarti pembayarannya belum diverifikasi oleh bendahara. Atau mungkin sudah diverifikasi bendahara, tapi suspicious. Ini ga perlu dikhawatirkan oleh panitia ticketing
- Kalau memang tiketnya belum pernah dikirimkan, kolom `Status Pengiriman` pada baris tersebut akan **kosong**. Ini ga perlu dikhawatirkan panitia ticketing.
  
2. Di Google Spreadsheets, klik menu **Pengiriman Email** > **Kirim Email Tiket**
3. Tunggu hingga muncul notifikasi yang menampilkan jumlah email terkirim dan gagal
4. Kolom `Status Pengiriman` akan terisi `Terkirim` secara otomatis untuk baris yang berhasil

Skrip hanya memproses baris yang memenuhi kedua syarat di atas — baris yang sudah `Terkirim` akan dilewati secara otomatis.

---

### Menggunakan Scanner di Hari-H

**Membuka halaman scanner:**

1. Buka Apps Script dari Google Spreadsheets (mirip tadi, Ekstensi > Apps Script)
2. Klik menu **Terapkan** (Deploy) > **Kelola Penerapan** (Manage Deployments)
3. Jika belum ada penerapan, klik **Penerapan Baru** (New Deployment)
   - Pilih tipe: **Aplikasi Web** (Web App)
   - Jalankan sebagai: akun Google Anda
   - Siapa yang dapat mengakses: **Siapa saja** (Anyone) agar panitia lain dapat membuka tanpa login
4. Salin URL yang diberikan. Simpen URL ini, URL inilah yang dibagikan ke panlap

**Memvalidasi tiket:**

1. Buka URL scanner di browser perangkat (HP, laptop, tab, bebas)
2. Isi kolom **Nama Penukar** dengan nama si penukar tiket (sometimes bukan penonton, tapi dia nitip temennya utk nukerin)
3. Untuk scan QR code: klik **Mulai Scan**, arahkan kamera ke QR code pada email tiket pembeli
4. Untuk kode manual: ketik 4 karakter kode pada kolom yang tersedia, lalu klik **Verifikasi**

Hasil validasi akan tampil langsung di layar:
- Hijau: tiket valid dan berhasil divalidasi
- Kuning: tiket sudah pernah divalidasi sebelumnya (tidak boleh masuk lagi)
- Merah: data tidak ditemukan atau kode salah (tiati nih boongin panitia)

---

## Format Data di Spreadsheet

### Kolom yang diisi otomatis oleh sistem

| Kolom | Diisi saat |
|---|---|
| `Kode Alfanumerik` | Pertama kali email dikirim |
| `Status Pengiriman` | Setelah email berhasil atau gagal dikirim |
| `Status Validasi` | Setelah tiket divalidasi di pintu masuk |
| `Waktu Validasi` | Bersamaan dengan status validasi |
| `Keterangan` | Berisi nama panitia yang memvalidasi |

### Nilai yang dikenali sistem

**Kolom `Jenis Tiket`** — menentukan tampilan kartu tiket pada email:

| Nilai | Tampilan |
|---|---|
| `GOLD` | Latar gelap, aksen emas |
| `SILVER` | Latar abu, aksen biru-hijau |
| `BRONZE` | Latar coklat, aksen oranye |

Nilai tidak peka huruf besar/kecil (`gold`, `Gold`, `GOLD` semua diterima).

**Kolom `Validasi Bukti Pembayaran`** — harus berisi `TRUE` (boolean, bukan teks) agar email dikirim.

---

## Alur Kerja Lengkap

```
Pembeli mengisi form pemesanan
        |
        v
Panitia memverifikasi bukti pembayaran
— centang kolom "Validasi Bukti Pembayaran" menjadi TRUE
        |
        v
Panitia menjalankan "Kirim Email Tiket"
— sistem men-generate kode 4 karakter
— sistem men-generate QR code
— sistem mengirim email ke pembeli
— status berubah menjadi "Terkirim"
        |
        v
Hari-H: Pembeli menunjukkan email tiket
        |
        v
Panitia membuka URL scanner
— scan QR code, atau ketik kode manual
— status berubah menjadi "Valid"
— baris di spreadsheet berubah warna hijau
```

---

## Batasan yang Perlu Diketahui

**Kuota email Google**
Google membatasi pengiriman email melalui Apps Script sebanyak 100 email per hari untuk akun biasa. Jadi, jangan sampai perlu ngirim email >100 di hari yang sama. Baiknya dicicil oleh panitia ticketing.

**QR code bergantung pada layanan eksternal**
QR code dibuat oleh layanan third-party (`api.qrserver.com`). Jika layanan tersebut tidak dapat diakses saat pengiriman, ga perlu panik, QR code tidak akan terbuat dan email tetap terkirim tanpa QR code di dalamnya. Tetep ada kode alfanumerik 4 karakter tetap sebagai alternatif.

**Validasi membutuhkan koneksi internet**
Scanner tidak bekerja secara offline. Gadgetnya panlap masuk harus terhubung ke internet kalau mau Check-In.

**Tidak ada autentikasi untuk URL scanner**
Siapapun yang memiliki URL scanner dapat mengakses website check-in. Jangan bagikan URL tersebut ke sembarang orang. Kirimkan hanya ke panlap atau panitia yang dirasa perlu punya itu.

**Tenang, kode 4 karakter tidak mengandung huruf O, I dan angka 0, 1**
Ini disengaja untuk menghindari kebingungan saat membaca kode secara manual.

---

## Pemeliharaan dan Penggantian Aset

### Mengganti gambar banner tiket

Gambar banner pada email tiket disimpan di Google Drive. Untuk menggantinya:

1. Unggah gambar baru ke Google Drive
2. Klik kanan file > **Bagikan** > ubah akses menjadi **Siapa saja yang memiliki link dapat melihat**
3. Salin ID file dari URL (bagian setelah `/d/` dan sebelum `/view`)
4. Buka `Code.gs`, cari fungsi `getTicketImageBlob`, dan ganti ID yang lama dengan yang baru

### Mengubah informasi acara pada email

Informasi tanggal, tempat, dan kontak panitia tertera di dalam fungsi `buildEmailHtml` pada `Code.gs`. Cari teks yang ingin diubah secara langsung di bagian HTML pada fungsi tersebut.

### Mengubah nama kolom spreadsheet

Jika nama kolom di spreadsheet perlu diubah, pastikan perubahan yang sama juga dilakukan di dalam `Code.gs` — cari string nama kolom yang sesuai dan perbarui nilainya.

---

## Kontak dan Kepemilikan

Sistem ini dibuat untuk keperluan internal PSM-ITB sejak Nuevala 2024.

Untuk pertanyaan teknis terkait sistem, hubungi pengelola repositori ini: @sundaysiagian (Instagram)

---

*Dokumentasi ini ditulis untuk memudahkan generasi panitia berikutnya, bukan hanya pengguna saat ini. Jaga agar tetap akurat jika ada perubahan sistem.*
