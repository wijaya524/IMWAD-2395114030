# PTM-07 Frontend - Daily Life Education Game & Telemetry Dashboard

Aplikasi frontend interaktif berbasis **Next.js (App Router)** yang terhubung langsung dengan RESTful API backend di folder `ptm06-backend`.

Dikembangkan untuk mendukung pembelajaran bina diri 7 aktivitas pagi bagi siswa berkebutuhan khusus (tunagrahita) dilengkapi maskot panduan **Tako**, evaluasi aturan *Decision Tree*, dan sistem bimbingan adaptif AI (*Adaptive Guidance* US-06A & US-06B).

---

## 🚀 Fitur Utama

1. **Simulasi Game Interaktif (`/game`)**:
   - Menjalankan 7 modul bina diri runtut:
     1. Bangun Tidur (`WAKE_UP`)
     2. Mandi Pagi (`BATHING`)
     3. Menggosok Gigi (`BRUSHING_TEETH`)
     4. Memakai Seragam Sekolah (`WEARING_UNIFORM`)
     5. Menyiapkan Buku & Perlengkapan (`PREPARING_BOOKS`)
     6. Sarapan Sehat (`BREAKFAST`)
     7. Pamitan Berangkat Sekolah (`FAREWELL`)
   - Didampingi maskot interaktif **Tako** (kucing berkacamata ramah).
   - Logika bimbingan adaptif: Jika siswa salah $\ge 2\times$, Tako memberikan petunjuk khusus dengan efek sorotan visual (*Visual Glow Cue*).
   - Mengirim otomatis hasil log permainan ke backend via `POST /api/v1/telemetry/sessions` dengan tanda tangan HMAC-SHA256 yang valid.

2. **Dashboard Pemantauan & Analitik Guru (`/dashboard`)**:
   - Kartu metrik: Total Sesi, Tingkat Penyelesaian, Frekuensi Intervensi AI, dan Rata-rata Latensi Inferensi.
   - Tabel riwayat sesi permainan siswa.
   - Fitur pencarian dan inspeksi sesi langsung dari backend (`GET /api/v1/telemetry/sessions/[id]`) dengan header `X-Device-Id`.

3. **Portal Autentikasi Guru (`/auth/login` & `/auth/register`)**:
   - Registrasi dan login akun guru/admin.
   - Manajemen token JWT (`accessToken` dan `refreshToken`) dengan auto-refresh.

4. **Telemetry API Playground (`/telemetry-tester`)**:
   - Menguji langsung sinkronisasi payload telemetri ke backend.
   - Menyediakan preset pengujian: Sesi Sukses, Sesi AI Hint, Skenario Integritas Waktu Rusak (Uji HTTP 422), dan Uji Signature Rusak (Uji HTTP 401).

---

## 🛠️ Cara Menjalankan (Development)

Pastikan backend `ptm06-backend` dan frontend `ptm07-frontend` berjalan berdampingan di terminal terpisah:

### 1. Jalankan Backend (`ptm06-backend`) - Port 3000
Buka terminal di folder backend:
```bash
cd ptm06-backend
npm run dev
```
*(Backend akan aktif di `http://localhost:3000`)*

### 2. Jalankan Frontend (`ptm07-frontend`) - Port 3001
Buka terminal baru di folder frontend:
```bash
cd ptm07-frontend
npm run dev -- -p 3001
```
*(Frontend akan aktif di `http://localhost:3001`)*

Buka browser di [http://localhost:3001](http://localhost:3001).

---

## ⚙️ Konfigurasi Environment (`.env.local`)

```env
# Alamat URL backend ptm06-backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
BACKEND_INTERNAL_URL=http://localhost:3000

# Secret key untuk HMAC-SHA256 signature telemetri
NEXT_PUBLIC_DEVICE_SECRET=telemetry_device_secret_salt_key

# Versi aplikasi
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 📡 Integrasi API ke `ptm06-backend`

Frontend menggunakan Next.js Proxy Rewrites (`/api/proxy/*` $\rightarrow$ `http://localhost:3000/api/v1/*`) sehingga tidak memicu kendala CORS pada browser:
- `POST /api/v1/auth/signup` $\rightarrow$ Pendaftaran guru
- `POST /api/v1/auth/login` $\rightarrow$ Login & perolehan JWT
- `GET /api/v1/auth/me` $\rightarrow$ Profil pengguna (Bearer Token)
- `POST /api/v1/auth/refresh` $\rightarrow$ Refresh token
- `POST /api/v1/telemetry/sessions` $\rightarrow$ Ingest sesi permainan & audit AI adaptif
- `GET /api/v1/telemetry/sessions/[id]` $\rightarrow$ Detail sesi dengan header `X-Device-Id`
