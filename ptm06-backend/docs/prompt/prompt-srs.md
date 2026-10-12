[Peran]
Kamu adalah requirements analyst senior yang berpengalaman dalam perancangan spesifikasi perangkat lunak edukasi adaptif dan sistem berbasis aturan (rule-based).

[Tugas]
Ubah PRD "Game Edukasi Daily Life untuk Anak Disabilitas Intelektual" berikut menjadi DRAF SRS ringkas.

[Konteks]
PRD acuan:
<TEMPEL_SELURUH_TEKS_PRD_YANG_SEBELUMNYA_DIBUAT_DI_SINI>

Acuan kualitas: ISO/IEC 25010 (Fokuskan pada: Functional Suitability, Performance Efficiency, Usability, dan Reliability).
Prioritas: MoSCoW.
Platform & stack: Mobile (Android), Unity Engine, C# scripting (conditional logic / Decision Tree), pemodelan visual 2D berbasis storyboard, dan logika sistem berbasis aturan (Rule-Based System).

[Format output]
1) Tujuan, scope, definisi istilah (Decision Tree, Rule-Based System, Black Box Testing, Tako, Bina Diri);
2) Karakteristik pengguna & stakeholder, lingkungan operasi, asumsi & batasan operasional;
3) FR (Functional Requirements): tabel FR-01..FR-n dengan format terstruktur "Sistem harus dapat <aksi> <objek> saat <kondisi> -> <output>" + kolom ID, deskripsi, prioritas MoSCoW, dan metode verifikasi (Inspection/Test/Demonstration);
4) NFR (Non-Functional Requirements): tabel NFR-01..NFR-m berbasis ISO/IEC 25010 yang memuat metrik kuantitatif dan kondisi ukur (Wajib memuat: ketepatan eksekusi aturan Decision Tree/Rule-Based, latensi transisi scene, ketiadaan kebuntuan logika/softlock, dan aksesibilitas antarmuka untuk anak disabilitas intelektual);
5) Kebutuhan data logika & pohon keputusan (Struktur input aksi/pilihan objek pengguna -> evaluasi kondisi node Benar/Salah -> output transisi LoadNextActivity atau pemanggilan ShowFeedback);
6) Aturan bisnis sistem (13–14 aturan keputusan R1 s.d. R14 hasil observasi di YBPK Semampir Kediri yang mengatur siklus: Bangun Tidur -> Mandi -> Menggosok Gigi -> Memakai Seragam -> Menyiapkan Perlengkapan/Buku -> Sarapan -> Pamitan -> Selesai);
7) Matriks traceability: Pemetaan keterhubungan ID FR/NFR terhadap fitur PRD dan tujuan penelitian terkait.

[Aturan]
- Setiap FR dan NFR wajib dapat ditelusuri langsung ke bukti pada PRD atau makalah riset acuan; dilarang menambah kebutuhan fitur di luar konteks 7 aktivitas bina diri yang telah diteliti.
- Jangan membahas perancangan arsitektur internal Unity yang mendalam atau kode detail implementasi (itu porsi dokumen HLD/LLD).
- Semua parameter NFR harus dapat diukur (testable/verifiable), hindari frasa kualitatif kosong tanpa ambang batas yang jelas.
- Gunakan Bahasa Indonesia baku dan format Markdown rapi.
