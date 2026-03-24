Ini adalah sistem pengiriman dan validasi tiket berbasis Google Forms, Google Spreadsheets, dan Google Apps Script. 
Ga perlu server eksternal atau langganan berbayar, gratis-tis-tis oleh dan untuk PSM-ITB.
Kiranya Tuhan berkenan dengan website baru kita ada sistem ticketing yang lebih robust.
Untuk sementara dan untuk musim kemarau, pake ini dulu ya.

---

## Daftar Isi

- [Gambaran Sistem](#gambaran-sistem)
- [Struktur File](#struktur-file)
- [Cara Instalasi](#cara-instalasi)
- [Cara Penggunaan](#cara-penggunaan)
- [Format Data di Spreadsheet](#format-data-di-spreadsheet)
- [FAQ](#faq)
- [Kontak](#kontak)

---

## Gambaran Sistem

**Tahap 1 — Pemesanan Tiket**

1. Pembeli memesan tiket via Google Forms
2. Bendahara memverifikasi pembayaran via Google Spreadsheets (centang checkbox secara manual)
3. Panitia ticketing menjalankan **Pengiriman Email** > **Kirim Email Tiket** dari menu di Spreadsheets
4. Sistem otomatis mengirim email ke semua pembeli yang terverifikasi — berisi tiket digital, QR code, dan kode alfanumerik 4 karakter

**Tahap 2 — Check-In**

1. Panitia membuka halaman web scanner di perangkat masing-masing (HP, tablet, laptop — bebas)
2. Check-in bisa dilakukan dengan **scan QR code** atau **input kode 4 karakter** secara manual

---

## Struktur File

```
nuevala-ticket-system/
│
├── README.md        — dokumentasi (ini)
├── Code.gs          — backend: pengiriman email & validasi tiket
└── Index.html       — frontend: halaman check-in hari-H
```

Kedua file utama (`Code.gs` dan `Index.html`) dimasukkan ke satu Google Apps Script project yang terhubung ke Google Spreadsheets.

---

## Cara Instalasi

### Langkah 1 — Siapkan Google Forms & Spreadsheets

1. Buat formulir pemesanan tiket di Google Forms — [lihat contoh formulir →](https://docs.google.com/forms/d/e/1FAIpQLSe9gWUw4iqsCd4N5AL-GSKYpwua6EC5Yv1DJIXgwkVd4a6RFg/viewform)
2. Tambahkan kolom-kolom tambahan di Google Spreadsheets — [lihat contoh spreadsheet →](https://docs.google.com/spreadsheets/d/127yCm616OPmflOkJKXFi2eSzG21IKrHOT0IRCE6n77I/edit?gid=1961351188#gid=1961351188)
3. Pastikan nama pertanyaan persis sama karakter per karakter (urutan kolom boleh berbeda)
4. Jika ada perubahan pertanyaan, sesuaikan juga di `Code.gs`

### Langkah 2 — Buka Apps Script

1. Di Google Spreadsheets, klik **Ekstensi** > **Apps Script**
2. Tab baru akan terbuka dengan editor script

### Langkah 3 — Masukkan Kode

1. Hapus isi `Code.gs` yang ada, lalu paste seluruh isi file `Code.gs` dari repo ini
2. Klik ikon **+** untuk membuat file baru, beri nama `Index.html`
3. Hapus isinya, lalu paste seluruh isi file `Index.html` dari repo ini

### Langkah 4 — Simpan & Izinkan Akses

1. Tekan `Ctrl+S` untuk menyimpan, lalu refresh tab Spreadsheets
2. Menu baru **Pengiriman Email** akan muncul di sebelah **Help**
3. Klik **Pengiriman Email** > **Kirim Email Tiket**
4. Ikuti prompt izin akses Google — klik **Lanjutkan**, pilih akun, klik **Izinkan**
5. Izin hanya diminta sekali. Sistem siap digunakan.

---

## Cara Penggunaan

### Mengirim Email Tiket

1. Klik **Pengiriman Email** > **Kirim Email Tiket** di Google Spreadsheets
2. Tunggu notifikasi jumlah email terkirim dan gagal
3. Kolom `Status Pengiriman` akan otomatis terisi `Terkirim` untuk baris yang berhasil

> Baris yang belum punya `Validasi Bukti Pembayaran` atau sudah berstatus `Terkirim` akan dilewati otomatis.

---

### Scanner Hari-H

**Membuka halaman scanner:**

1. Buka Apps Script (**Ekstensi** > **Apps Script**)
2. Klik **Terapkan** > **Kelola Penerapan**
3. Jika belum ada, klik **Penerapan Baru**:
   - Tipe: **Aplikasi Web**
   - Jalankan sebagai: akun Google Anda
   - Akses: **Siapa saja**
4. Salin URL yang diberikan — ini yang dibagikan ke seluruh panitia lapangan

**Memvalidasi tiket:**

1. Buka URL scanner di browser perangkat
2. Isi kolom **Nama Penukar**
3. Scan QR code via kamera, atau ketik kode 4 karakter lalu klik **Verifikasi**

| Warna | Arti |
|-------|------|
| 🟢 Hijau | Tiket valid, berhasil divalidasi |
| 🟡 Kuning | Tiket sudah pernah divalidasi sebelumnya |
| 🔴 Merah | Data tidak ditemukan atau kode salah |

---

## Format Data di Spreadsheet

| Kolom | Diisi saat |
|-------|------------|
| `Kode Alfanumerik` | Pertama kali email dikirim |
| `Status Pengiriman` | Setelah email berhasil atau gagal dikirim |
| `Status Validasi` | Setelah tiket divalidasi di pintu masuk |
| `Waktu Validasi` | Bersamaan dengan status validasi |
| `Keterangan` | Nama panitia yang memvalidasi |

---

## FAQ

**Q: Email gagal terkirim. Gimana?**
A: Kolom `Status Pengiriman` akan terisi `Gagal`. Kosongin nilai di kolom tersebut, lalu jalankan ulang **Pengiriman Email** > **Kirim Email Tiket**. Baris yang gagal akan diproses kembali.

---

**Q: Berapa banyak email yang bisa dikirim dalam satu hari?**
A: Google membatasi 100 email per hari untuk akun biasa. Jika pesanan lebih dari itu, cicil pengiriman di hari berbeda.

---

**Q: QR code tidak muncul di email pembeli.**
A: QR code dibuat oleh layanan pihak ketiga saat pengiriman. Jika layanan sedang down, QR code tidak terbuat — tapi email tetap terkirim. Kode alfanumerik 4 karakter tetap berfungsi penuh sebagai pengganti.

---

**Q: Kamera tidak bisa dibuka saat scan.**
A: Halaman scanner menampilkan instruksi izin kamera sesuai perangkat. Jika tetap tidak bisa:
1. Cek izin kamera di pengaturan browser
2. Jika masih gagal, gunakan jalur kode manual — minta pembeli tunjukkan kode 4 karakter dari emailnya

---

**Q: Pembeli mengklaim belum masuk tapi status validasinya sudah `Valid`.**
A: Tiketnya sudah discan sebelumnya. Untuk penelusuran:
1. Cek kolom `Keterangan` — berisi nama panitia yang memvalidasi
2. Cek kolom `Waktu Validasi` — berisi waktu kejadian

---

**Q: Gimana cara ganti gambar banner tiket di email?**
A:
1. Unggah gambar baru ke Google Drive
2. Ubah aksesnya menjadi **Siapa saja yang memiliki link dapat melihat**
3. Salin ID file dari URL (bagian setelah `/d/` dan sebelum `/view`)
4. Buka `Code.gs`, cari fungsi `getTicketImageBlob`
5. Ganti ID lama dengan ID baru sesuai tier tiket

---

**Q: Gimana cara ubah informasi acara (tanggal, tempat, kontak) di email?**
A: Buka `Code.gs`, cari fungsi `buildEmailHtml`. Informasi acara ditulis langsung di dalam fungsi tersebut — ubah teksnya lalu simpan.

---

**Q: Nama kolom di spreadsheet perlu diubah. Gimana?**
A: Perubahan yang sama harus dilakukan di `Code.gs`. Cari string nama kolom yang sesuai di dalam kode dan perbarui nilainya.

---

## Kontak

Untuk pertanyaan teknis terkait sistem, hubungi pengelola repositori:

[![Instagram](https://img.shields.io/badge/@sundaysiagian-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/sundaysiagian/)
[![Line](https://img.shields.io/badge/8ukitduri-00C300?style=flat-square&logo=line&logoColor=white)](https://line.me/ti/p/8ukitduri)
