# Log Prompt Praktikum PTM-05

## Sesi 1: Perancangan Spesifikasi OpenAPI 3.0
- **Prompt:**
  > "Kamu adalah backend architect senior, ahli REST API dan OpenAPI 3.0. Buat DRAF spesifikasi OpenAPI 3.0 (YAML) untuk semua endpoint berdasarkan LLD dan user stories..."
- **Hasil:**
  Spesifikasi OpenAPI 3.0 (`openapi.yaml`) berhasil dirumuskan dengan menyelaraskan endpoint telemetri, model objek respon error (400, 401, 413, 422, 500, 503), penandaan tag AI, dan pencatatan asumsi gap arsitektur `[ASUMSI-01]`.
- **Evaluasi & Refinement:**
  Perlu memastikan format field UUID, skema datetime ISO 8601, serta relasi audit bimbingan adaptif `ai_hint` dapat ditransformasikan ke skema basis data relasional.

## Sesi 2: Perancangan Skema Data (ERD, Prisma, dan Validasi Zod)
- **Prompt:**
  > "Kamu adalah database architect dan backend engineer senior. Buat ERD (Mermaid) dan skema Prisma+Zod (TypeScript) sesuai stack Next.js + PostgreSQL dari OpenAPI + LLD yang direvisi..."
- **Hasil:**
  Terbentuk diagram ERD Mermaid, skema `schema.prisma`, dan skema validasi runtime `zod`. Kolom SQLite lokal berhasil disesuaikan dengan tipe native PostgreSQL (UUID, Timestamptz, Boolean, BigInt) beserta penandaan `[ASUMSI-02]`, `[ASUMSI-03]`, dan `[ASUMSI-04]`.
- **Evaluasi & Refinement:**
  Relasi `interaction_logs` ke `adaptive_hint_logs` dipastikan bersifat $1:1$ dengan constraint `UNIQUE` pada foreign key `log_id` agar sesuai dengan alur audit evaluasi adaptif.