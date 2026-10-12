# Log Interaksi Rekayasa Kebutuhan Berbasis AI (Prompt Log)

* **Proyek**: Game Edukasi *Daily Life* (Anak Disabilitas Intelektual)
* **Modul**: Praktikum P3 — PRD → SRS → User Story / Use Case / User Flow / Acceptance Criteria
* **Penyusun**: Tim Pengembang Game Edukasi *Daily Life*

---

## Log Tahap 1: Pembentukan User Story & Evaluasi INVEST

### 1. Prompt yang Dikirim
```text
[Peran] Kamu adalah agile product owner dan business analyst.
[Tugas] Ubah daftar Functional Requirements (FR) pada SRS terlampir menjadi DRAF User Stories untuk fitur prioritas Must dan Should (termasuk fitur AI ★).
[Konteks]
SRS PTM-02 : FR-01 sampai FR-07 beserta aturan logika Rule-Based R1–R13.
Persona Pengguna : Siswa tunagrahita tingkat dasar (kelas 4–6 SDLB) yang membutuhkan media visual repetitif.
Fitur AI Utama ★ : Evaluasi kesalahan interaksi adaptif oleh karakter Tako.
Platform : Mobile (Android / Unity).
```

## Log Tahap 2: Perancangan Use Case & Skenario Eksepsi AI

### 1. Prompt yang Dikirim
```text
[Peran] Kamu adalah system analyst aplikasi cerdas.
[Tugas] Buat DRAFT Use Case formal untuk User Story prioritas, fokuskan pada fitur berbasis AI ★ dan alur penanganan kegagalannya.
[Konteks]
User Story Tahap 1 : US-06A dan US-06B.
Rincian Layanan AI : Modul analitik adaptif pola kesalahan interaksi siswa.
Batas Waktu Respon : NFR latensi <= 3 detik, confidence score minimum 75%.
```

## Log Tahap 3: User Flow dengan Penanganan Status AI

### 1. Prompt yang Dikirim
```text
[Peran] Kamu adalah UX designer dan interaction analyst produk cerdas.
[Tugas] Susun DRAFT User Flow terstruktur untuk fitur AI ★ dan 1 fitur utama lainnya.
[Konteks]
Persona & Skenario : Siswa tunagrahita yang berlatih rutinitas pagi mandiri dan melakukan kesalahan berulang.
Use Case Tahap 2 : UC-01 dan alur eksepsinya.
NFR Respon Waktu : Batas toleransi <= 3 detik.
```

## Log Tahap 4: Penyusunan Acceptance Criteria (BDD Given–When–Then)

### 1. Prompt yang Dikirim
```text
[Peran] Kamu adalah QA engineer dan test analyst.
[Tugas] Tulis DRAFT Acceptance Criteria berpola Given-When-Then untuk setiap User Story.
[Konteks]
Daftar User Story : US-01 sampai US-08.
Use Case & Eksepsi : UC-01 beserta alur eksepsi AI.
NFR Ukuran Metrik : Latensi respon <= 3 detik, ambang batas keyakinan model 75%.
```

## Log Tahap 5: Matriks Keterlacakan (Traceability Matrix)

### 1. Prompt yang Dikirim
```text
[Peran] Kamu adalah system analyst.
[Tugas] Susun Matriks Keterlacakan (Traceability Matrix) yang menghubungkan Kebutuhan SRS, User Story, Use Case, Acceptance Criteria, Komponen Teknis, dan Rencana Uji.
```
