# Keputusan Desain Kontrak API & Skema Data

### 1. Penyelarasan Naming Convention RESTful
Pada dokumen LLD awal, endpoint sinkronisasi didefinisikan sebagai `/api/v1/telemetry/sessions/sync`. Mengikuti standar RESTful murni, kata kerja `sync` dihilangkan dan digantikan dengan penggunaan HTTP Method `POST` pada resource noun jamak `/telemetry/sessions` (`[ASUMSI-01]`).

### 2. Penyesuaian Tipe Data SQLite ke PostgreSQL
* **Identitas Sesi (UUID)**: Pada database lokal SQLite, `session_id` disimpan sebagai `TEXT`. Pada PostgreSQL, tipe data ditingkatkan menjadi native `UUID` (`[ASUMSI-02]`) untuk efisiensi penyimpanan biner 16-byte dan pengindeksan yang lebih cepat.
* **Representasi Boolean**: SQLite tidak mendukung boolean native sehingga menggunakan `INTEGER` bernilai 0 atau 1[cite: 1]. Pada PostgreSQL dan Prisma, kolom `is_completed`, `is_correct`, dan `is_fallback` didefinisikan sebagai `Boolean` (`[ASUMSI-03]`)[cite: 1].
* **Primary Key Inkremental**: Menggunakan `BigInt` (`bigserial`) pada `interaction_logs` dan `adaptive_hint_logs` untuk mencegah risiko *integer overflow* akibat volume telemetri interaksi yang tinggi[cite: 1].

### 3. Penegakan Batasan Bisnis & NFR Fitur AI
* **Integritas Waktu**: Validasi runtime Zod memastikan bahwa `completed_at` tidak boleh lebih lampau dibanding `started_at`[cite: 1]. Jika dilanggar, API mengembalikan respon `422 Unprocessable Entity`[cite: 1].
* **Batas Toleransi Latensi Inferensi**: Nilai `execution_time_ms` pada audit inferensi AI dibatasi maksimal 3000 ms (`[ASUMSI-04]`), selaras dengan batas toleransi pembatalan `CancellationTokenSource(3000)` di modul Unity[cite: 1].
* **Privasi Tanpa PII**: Identifikasi perangkat menggunakan `device_pseudo_id` tanpa menyimpan informasi identitas pribadi (PII) siswa disabilitas[cite: 1].