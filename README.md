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
- Data tersimpan aman di perangkat masing-masing (localStorage browser) — tidak dikirim ke server
- Cadangan & pulihkan data lewat tombol "Salin cadangan" / "Pulihkan data"
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
- Tombol "Tarik dari Sheet" hanya berfungsi bila halaman dibuka lewat claude.ai dengan konektor Google Drive aktif; di hosting GitHub, gunakan tombol "Buka Sheet" untuk melihat rekap di Google Sheet.
