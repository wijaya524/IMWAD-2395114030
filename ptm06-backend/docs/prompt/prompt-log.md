# PROMPT LOG: PENGEMBANGAN GAME EDUKASI *DAILY LIFE*

Dokumen ini mencatat riwayat interaksi, instruksi peran, konteks masukan, evaluasi luaran, serta keterlacakan artefak perangkat lunak selama proses perancangan sistem berbasis AI untuk siswa disabilitas intelektual.

---

## 1. Metadata Sesi

* **Nama Proyek:** Game Edukasi *Daily Life* Berbasis Decision Tree & Adaptive Guidance
* **Target Platform:** Android OS (Unity Engine / C#)
* **Pengembang / Peneliti:** Aryansyah Yudha Wijaya
* **Fokus Fitur AI:** Evaluasi Pola Kesalahan Repetitif & Bimbingan Visual Adaptif Maskot Tako (US-06A & US-06B)
* **Tanggal Dokumentasi:** 20 September 2026

---

## 2. Riwayat Log Rekayasa Prompt

### Log 01: Perancangan High-Level Design (HLD)

* **Tanggal/Waktu:** 2026-09-20 / Sesi 1
* **Peran (Persona):** *Senior Software Architect* (Aplikasi Mobile/Web dengan Fitur AI)
* **Tujuan (Task):** Menyusun draf HLD modular yang mencakup diagram arsitektur, deskripsi komponen beserta tabel *trade-off*, aliran data *end-to-end* AI dengan titik *fallback*, kontrak antarkomponen tingkat tinggi, prinsip *security/privacy by design*, dan pembagian lingkungan *deployment*.
* **Konteks & Konstrain Masukan:**
  * PRD revisi: Game edukasi bina diri 7 aktivitas harian mandiri untuk anak tunagrahita[cite: 2].
  * SRS revisi: Kebutuhan fungsional FR-01 s.d. FR-07[cite: 1], matriks aturan $R_1$ s.d. $R_{13}$[cite: 1], NFR keandalan/performa latensi[cite: 1, 3].
  * User Stories / Acceptance Criteria: US-01 s.d. US-08, skenario BDD (Given-When-Then)[cite: 3], dan penanganan eksepsi AI UC-01[cite: 3].
  * Konstrain: Durasi pengerjaan 1 semester, satu fitur AI inti, biaya operasional minimal (Rp0 / *zero-cost*).
* **Ringkasan Output yang Dihasilkan:**
  * Diagram blok ASCII dan Mermaid dengan arsitektur *edge-first/on-device*[cite: 1, 2].
  * Analisis *trade-off* komputasi AI: Memilih *On-Device C# Engine* daripada *Cloud API* atau *Self-Hosted VM* untuk menjamin ketersediaan luring (*offline*)[cite: 2] dan respon instan $\le 3$ detik[cite: 3].
  * Alur data fitur adaptif dengan tiga titik mitigasi *fallback* (data korup, *timeout* 3 detik, dan *confidence* $< 75\%$)[cite: 3].
  * Kontrak internal *event-driven* berbasis JSON[cite: 1, 3].
  * Tata kelola privasi: Peniadaan data PII siswa dan enkripsi profil lokal.
* **Evaluasi & Refleksi Arsitektural:**
  * Desain berhasil menjawab konstrain tanpa menimbulkan ketergantungan biaya server bulanan.
  * Ketiadaan koneksi internet stabil di sekolah luar biasa (SLB) mitra tertangani secara tuntas dengan menolak model berbasis *cloud API*[cite: 2, 3].

---

### Log 02: Ekspor Format HLD ke Markdown (.md)

* **Tanggal/Waktu:** 2026-09-20 / Sesi 2
* **Tujuan (Task):** Mengonversi draf dokumen HLD ke dalam format berkas Markdown murni (`hld_game_edukasi_daily_life.md`) agar siap diintegrasikan ke repositori proyek.
* **Keluaran:** Berkas `hld_game_edukasi_daily_life.md` dengan penomoran bab yang terstruktur dan diagram sintaks Mermaid yang valid.

---

### Log 03: Perancangan Low-Level Design (LLD)

* **Tanggal/Waktu:** 2026-09-20 / Sesi 3
* **Peran (Persona):** *Senior Software Engineer* (Spesialis Unity C# & Mobile Architecture)
* **Tujuan (Task):** Menurunkan spesifikasi HLD menjadi rancangan detail teknis siap koding untuk fitur prioritas *Must* dan komponen AI terkait.
* **Konteks & Konstrain Masukan:**
  * Dokumen SRS, PRD, dan User Story terintegrasi[cite: 1, 2, 3].
  * Pola arsitektur: Clean Architecture / Model-View-Presenter (MVP) murni yang terpisah dari *lifecycle* MonoBehaviour Unity[cite: 1, 2].
  * Penyimpanan: SQLite lokal terenkripsi di perangkat Android[cite: 1, 2].
* **Ringkasan Output yang Dihasilkan:**
  * Desain kelas POCO: `RuleEvaluatorService`[cite: 1], `AdaptiveGuidanceEngine`[cite: 3], dan `GameplayFlowPresenter`[cite: 1, 3] lengkap dengan atribut dan metode inti.
  * Skema DDL SQLite lengkap dengan integritas referensial dan *constraint* (`game_sessions`, `interaction_logs`, `adaptive_hint_logs`).
  * Spesifikasi endpoint telemetri `POST /api/v1/telemetry/sessions/sync` beserta format JSON dan pemetaan kode galat HTTP.
  * Sequence diagram interaksi AI yang mencakup 4 jalur: *Happy Path* ($\ge 75\%$), *Timeout* ($> 3000\text{ ms}$), data korup, dan *Low Confidence* ($< 75\%$)[cite: 3].
  * Strategi *error handling* ramah anak tanpa hukuman poin serta matriks keterlacakan (*traceability matrix*) penuh ke FR dan NFR[cite: 1, 2, 3].
  * Penanda keputusan tim: Pemilihan pustaka Dependency Injection antara VContainer vs Extenject/Zenject.
* **Evaluasi & Refleksi Rekayasa:**
  * Batasan LLD terjaga ketat tanpa merusak kebutuhan SRS awal[cite: 1].
  * Pemisahan kelas logika murni mempermudah penulisan pengujian otomatis (*Unit Test*) tanpa memerlukan *playmode* Unity yang berat.

---

### Log 04: Ekspor Format LLD ke Markdown (.md)

* **Tanggal/Waktu:** 2026-09-20 / Sesi 4
* **Tujuan (Task):** Mengonversi seluruh draf teknis LLD ke dalam berkas Markdown mandiri (`lld_game_edukasi_daily_life.md`).
* **Keluaran:** Berkas `lld_game_edukasi_daily_life.md` yang memuat tabel DDL, blok kode skrip, dan diagram Mermaid sekuensial.

---

## 3. Matriks Status Artefak Rekayasa Perangkat Lunak

| Artefak Dokumen | Format Berkas | Status Validasi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Product Requirements Document (PRD)** | PRD Markdown[cite: 2] | Selesai / Basis Acuan[cite: 2] | Menetapkan ruang lingkup 7 modul dan maskot Tako[cite: 1, 2]. |
| **Software Requirements Specification (SRS)** | SRS Markdown[cite: 1] | Selesai / Basis Acuan[cite: 1] | Mendefinisikan aturan logika $R_1$–$R_{13}$ dan uji Black Box[cite: 1]. |
| **User Stories & Acceptance Criteria** | US/AC Markdown[cite: 3] | Selesai / Basis Acuan[cite: 3] | Kriteria pengujian BDD dan spesifikasi AI US-06A/B[cite: 3]. |
| **High-Level Design (HLD)** | `hld_game_edukasi_daily_life.md` | Lengkap & Tervalidasi | Arsitektur *on-device edge*, diagram blok, dan trade-off[cite: 1, 2, 3]. |
| **Low-Level Design (LLD)** | `lld_game_edukasi_daily_life.md` | Lengkap & Siap Koding | Struktur kelas POCO C#, skema DDL SQLite, sequence diagram AI[cite: 1, 3]. |
| **Prompt Engineering Log** | `prompt-log.md` | Aktif / Termutakhirkan | Catatan audit interaksi dan keputusan teknis antartahap. |
