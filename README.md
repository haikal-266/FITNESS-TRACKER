# 🥗 NutriFit.AI — Calorie Tracker & Workout Schedule Generator

Aplikasi web pelacak kalori harian, generator jadwal latihan mingguan, dan rekomendasi menu diet sehat berbasis **Next.js (App Router)**, **React**, **Tailwind CSS**, dan **SQLite (Prisma ORM)**.

> 💡 **Catatan untuk Rekan Kelompok / Pemula:**  
> Proyek ini menggunakan **SQLite**, artinya **kamu TIDAK PERLU install XAMPP, MySQL, atau Docker sama sekali**. Databasenya langsung berbentuk satu file lokal bernama `dev.db` yang otomatis aktif di laptop masing-masing!

---

## 📋 1. Persiapan Awal (Prasyarat)

Sebelum menjalankan aplikasi, pastikan di komputermu sudah terpasang:

1. **Node.js** (Sangat disarankan versi **v18.x** atau **v20.x ke atas**)
   - Unduh resmi di: [https://nodejs.org/](https://nodejs.org/) (pilih versi **LTS**).
   - Cara cek apakah sudah terpasang: buka Terminal / Command Prompt (CMD), lalu ketik:
     ```bash
     node -v
     npm -v
     ```
     *(Jika muncul angka versi seperti `v20.x.x`, berarti sudah siap).*
2. **Visual Studio Code (VS Code)** atau editor kode pilihanmu.
3. **Git** (opsional, untuk clone repository).

---

## 🚀 2. Panduan Setup & Menjalankan Project (Langkah Demi Langkah)

Ikuti 5 langkah mudah berikut secara berurutan:

### Langkah 1: Buka Terminal di Folder Project
Buka VS Code, pilih menu **File > Open Folder...**, lalu pilih folder project `CALORIE TRACKER`.  
Buka terminal baru di VS Code melalui menu bar: **Terminal > New Terminal** (atau tekan `Ctrl + ~`).

---

### Langkah 2: Install Seluruh Library (Dependencies)
Ketik perintah berikut di terminal lalu tekan **Enter**:
```bash
npm install
```
> ⏳ *Tunggu sekitar 30 detik sampai 1 menit sampai proses download selesai. Pastikan laptop terhubung ke internet.*

---

### Langkah 3: Siapkan File Konfigurasi Environment (`.env`)
Pastikan ada file bernama `.env` di dalam folder paling luar project.

Jika file `.env` belum ada, kamu bisa menduplikat file `.env.example` atau buat file baru bernama `.env`, lalu isi teks berikut:
```env
DATABASE_URL="file:./dev.db"
```

---

### Langkah 4: Siapkan & Isi Database SQLite (Hanya Sekali di Awal)
Jalankan 2 perintah berikut di terminal:

1. **Membuat tabel database:**
   ```bash
   npx prisma db push
   ```
   *(Perintah ini akan membuat file database `dev.db` otomatis).*

2. **Mengisi data awal makanan, resep, dan jadwal latihan:**
   ```bash
   npm run db:seed
   ```
   *(Akan muncul pesan sukses: "Seeded 20 food items, 6 recipes, Seeding selesai!").*

---

### Langkah 5: Jalankan Aplikasi Web!
Ketik perintah untuk menyalakan server lokal:
```bash
npm run dev
```

Jika sudah muncul tulisan:
```text
✓ Ready in 1000ms
- Local: http://localhost:3000
```
Buka browser favoritmu (Chrome / Edge / Firefox) dan buka tautan:
👉 **[http://localhost:3000](http://localhost:3000)**

🎉 **Aplikasi NutriFit sudah siap digunakan!**

---

## 🛑 Cara Mematikan Server
Jika sudah selesai menggunakan atau ingin menutup terminal:
- Klik di dalam jendela terminal.
- Tekan tombol **`Ctrl + C`** di keyboard.
- Jika ada konfirmasi `Terminate batch job (Y/N)?`, ketik **`Y`** lalu tekan **Enter**.

---

## 📱 Fitur Utama Aplikasi

1. **Dashboard Overview (`/`)**:
   - Ringkasan kalori masuk hari ini, kalori terbakar dari olahraga, dan sisa alokasi kalori.
   - Kartu preview latihan fisik hari ini dan menu diet sehat rekomendasi harian.
   
2. **Tracker Kalori & Nutrisi (`/calories`)**:
   - *Circular Progress Ring* visual dengan status defisit/surplus.
   - Grafik batang makronutrisi harian (Protein, Karbohidrat, Lemak).
   - Pencatatan makanan per kategori (Sarapan, Makan Siang, Makan Malam, Snack).
   - Tersedia pencarian cepat 20 makanan khas Indonesia atau input manual.

3. **Workout Schedule & Generator (`/workout`)**:
   - Jadwal mingguan interaktif 7 hari (Senin - Minggu) lengkap dengan status Rest Day.
   - Generator latihan cerdas berdasarkan target (*Fat Loss*, *Muscle Gain*, *Endurance*) dan level kebugaran (Pemula, Menengah, Lanjutan).
   - Tombol **"Selesai Latihan"** yang langsung menghitung kalori terbakar dan estimasi gram lemak tubuh secara otomatis.

4. **Katalog Resep & Menu Diet (`/recipes`)**:
   - Resep sehat rendah kalori dilengkapi waktu memasak, porsi, bahan-bahan, dan langkah memasak.
   - Rotasi menu harian yang berputar otomatis sesuai tanggal kalender dengan tombol 1-klik catat ke tracker kalori.

5. **Profil & Kalkulator BMR / TDEE (`/profile`)**:
   - Perhitungan ilmiah menggunakan formula **Mifflin-St Jeor**.
   - Menghitung BMR (*Basal Metabolic Rate*) dan TDEE (*Total Daily Energy Expenditure*) berdasarkan berat, tinggi, usia, gender, dan tingkat aktivitas.

---

## 🛠️ Alat Tambahan: Melihat Isi Database Secara Visual (Prisma Studio)

Jika dosen atau rekan tim ingin melihat tabel database dan isi datanya secara visual tanpa membuka file mentah:

1. Buka terminal baru di VS Code.
2. Jalankan perintah:
   ```bash
   npx prisma studio
   ```
3. Browser akan otomatis membuka **[http://localhost:5555](http://localhost:5555)** yang menampilkan semua tabel database (UserProfile, FoodLog, Recipe, Workout, dll) layaknya Spreadsheet / phpMyAdmin.

---

## ❓ Solusi Masalah Umum (Troubleshooting / FAQ)

| Masalah | Penyebab | Solusi |
| :--- | :--- | :--- |
| **`'node' is not recognized` / `'npm' is not recognized`** | Node.js belum terinstall atau belum masuk System PATH. | Download dan install Node.js versi LTS dari [nodejs.org](https://nodejs.org/), lalu **restart VS Code**. |
| **`Port 3000 is in use`** | Ada terminal lain yang sedang menjalankan Next.js. | Tutup terminal sebelumnya atau buka `http://localhost:3001` sesuai arahan di terminal. |
| **Database error / data tidak muncul** | File database belum dibuat atau belum di-seed. | Jalankan: `npx prisma db push` lalu `npm run db:seed`. |
| **Tampilan CSS berantakan / tidak ada warna** | Cache browser atau proses compile pertama. | Tekan `Ctrl + F5` (Hard Refresh) di browser. |
| **Error `Cannot find module '@prisma/client'`** | Prisma Client belum ter-generate. | Jalankan perintah: `npx prisma generate`. |

---

## 📂 Struktur Direktori Proyek (Modular Architecture)

```text
CALORIE TRACKER/
├── prisma/                         # Skema database SQLite & file seed
│   ├── dev.db                      # File SQLite lokal
│   ├── schema.prisma               # Tabel UserProfile, FoodLog, Recipe, dll
│   └── seed.js                     # Script isi data awal
│
├── src/
│   ├── app/                        # Routing Halaman (Pages) & API Backend
│   │   ├── page.js                 # Halaman Dashboard (/)
│   │   ├── calories/page.js        # Halaman Tracker Kalori (/calories)
│   │   ├── workout/page.js         # Halaman Jadwal Latihan (/workout)
│   │   ├── recipes/page.js         # Halaman Resep Diet (/recipes)
│   │   ├── profile/page.js         # Halaman Profil & TDEE (/profile)
│   │   └── api/                    # Endpoint REST API Next.js
│   │
│   ├── features/                   # Logika Inti Modular (Self-Contained Modules)
│   │   ├── calorie-tracker/        # Modul pelacak kalori & makro
│   │   ├── workout-generator/      # Modul jadwal & generator workout
│   │   ├── recipes/                # Modul katalog resep & rekomendasi menu
│   │   ├── dashboard/              # Modul tampilan overview
│   │   └── profile/                # Modul pengaturan profil pengguna
│   │
│   ├── components/                 # Komponen UI Bersama (Button, Card, Modal, Navbar)
│   └── lib/                        # Koneksi database prisma & helper utilities
│
├── .env                            # Konfigurasi file database
├── package.json                    # Daftar script dan library
└── README.md                       # Buku panduan proyek ini
```

---

*Selamat mengerjakan tugas kuliah dan semoga presentasinya sukses! 🚀*
