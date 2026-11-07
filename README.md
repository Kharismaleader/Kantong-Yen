# Kantong Yen 💴

Web app sederhana untuk mencatat **pemasukan & pengeluaran harian dalam Yen (¥)** — dibuat untuk penggunaan sehari-hari di Jepang.

**Buka aplikasinya:** https://kharismaleader.github.io/Kantong-Yen/

## Fitur

- Catat pemasukan & pengeluaran per hari, lengkap dengan kategori:
  - Pengeluaran: Makan 🍙, Belanja 🛒, Transport 🚃, Tagihan 💡, Sewa 🏠, Hiburan 🎮, Kesehatan 💊, Lainnya 📦
  - Pemasukan: Gaji 💴, Bonus 🎁, Sampingan 🧧, Lainnya 📥
- Ringkasan bulan berjalan: sisa uang, total masuk, total keluar
- Grafik perbandingan pemasukan vs pengeluaran 6 bulan terakhir
- Rincian "Ke mana uangnya pergi" per kategori
- Navigasi antar bulan, edit & hapus catatan
- **Sinkronisasi dua perangkat**: data tersimpan di Google Sheet yang sama (tab Transaksi) lewat Apps Script Web App (`Code.gs`), jadi HP suami & HP istri selalu melihat data yang sama. Setiap perangkat memasukkan **kode sinkron keluarga** satu kali (tombol "Kode sinkron"); kode disimpan hanya di perangkat, bukan di kode sumber.
- Cadangan lokal tetap tersedia di perangkat (localStorage) untuk mode offline; perubahan terkirim otomatis saat aplikasi dibuka / tombol "Sinkronkan" diketuk.
- Cadangan & pulihkan data lewat tombol "Salin cadangan" / "Pulihkan data"
- Unduh CSV catatan baru untuk di-append manual ke Sheet bila diperlukan
- Terhubung ke Google Sheet **"Kantong Yen - Data Keuangan"** untuk rekap & grafik:
  https://docs.google.com/spreadsheets/d/1TrhJybFjeljbyvRp-ak4ivnFhgbHBZHeAfZB2oAcsNI/edit

## Cara pakai

1. Buka link aplikasi di atas di HP.
2. Ketuk tombol **+** untuk mencatat transaksi baru.
3. Pilih Pengeluaran/Pemasukan, isi jumlah, kategori, catatan, dan tanggal, lalu **Simpan**.
4. Ketuk transaksi yang sudah ada untuk mengubah atau menghapusnya.
5. Bisa ditambahkan ke layar utama HP (Add to Home Screen) supaya terasa seperti aplikasi.

## Catatan teknis

- Satu file `index.html` mandiri (HTML + CSS + JavaScript), tanpa build step.
- Hosting: GitHub Pages dari branch `main`, folder root.
- Database bersama: Google Apps Script (`Code.gs` di repo ini) yang terikat ke Sheet di atas, di-deploy sebagai Web App. Script memeriksa kode sinkron (`SYNC_KEY` di Script Properties) untuk setiap permintaan baca/tulis. Tanggal ditulis sebagai nilai tanggal asli agar rumus SUMIFS di tab Ringkasan tetap bekerja; kolom F (ID) & G (Diubah) dipakai script untuk sinkronisasi.
- Menyiapkan ulang database: ikuti komentar di bagian atas `Code.gs`, lalu pasang URL Web App (`.../exec`) ke variabel `SYNC_URL` di `index.html`.
