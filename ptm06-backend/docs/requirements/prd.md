

# PRODUCT REQUIREMENTS DOCUMENT (PRD)

| **Informasi Dokumen** | **Detail** |
| --- | --- |
| **Nama Produk** | Game Edukasi *Daily Life*<br> |
| **Tipe Produk** | Mobile Game Edukasi Interaktif (Android)

 |
| **Target Rilis** | Prototype Tahap 1 / Evaluasi Mitra Sekolah

 |
| **Target Pengguna** | Siswa Disabilitas Intelektual (Kelas 4–6 SD / SDLB)

 |
| **Pendamping Pengguna** | Guru Pendamping / Orang Tua Siswa

 |

---

## 1. Latar Belakang & Pernyataan Masalah (*Problem Statement*)

* **Latar Belakang**: Penguasaan aktivitas bina diri (*daily life activities*) sebelum berangkat sekolah sangat krusial bagi kemandirian anak dengan disabilitas intelektual. Pembelajaran konvensional memerlukan metode visual yang interaktif, terstruktur, serta mendukung latihan berulang kali (*repetitive learning*) agar materi mudah diserap.


* **Masalah**:
1. Keterbatasan media edukasi digital yang secara sistematis memandu runtutan bina diri pagi hari secara sekuensial bagi anak tunagrahita.


2. Kebanyakan game edukasi yang ada hanya fokus pada transfer materi visual pasif tanpa mesin logika keputusan (*decision mechanism*) yang mampu mengevaluasi kesalahan secara terarah dan ramah.




* **Solusi yang Diajukan**: Mengembangkan game edukasi *Daily Life* berbasis Android yang mengadopsi algoritma *Decision Tree* melalui *Rule-Based System* untuk mengatur alur aktivitas bertahap dari bangun tidur hingga berangkat sekolah.



---

## 2. Tujuan Produk & Indikator Keberhasilan (*Goals & Metrics*)

### 2.1 Tujuan Produk (*Product Goals*)

* Menyediakan media simulasi bina diri interaktif yang menyajikan urutan rutinitas pagi secara terstruktur.


* Membantu anak mengenali keputusan/tindakan yang benar dan salah melalui sistem respon umpan balik instan dari maskot pemandu.



### 2.2 Metrik Keberhasilan (*Key Success Metrics*)

* **Akurasi Alur Sistem**: 100% transisi skenario berhasil dieksekusi sesuai tabel aturan keputusan (*Rule-Based System*) tanpa kegagalan logika pada pengujian *Black Box*.


* **Tingkat Penyelesaian (*Task Completion Rate*)**: Siswa mampu menuntaskan seluruh 7 siklus aktivitas hingga tahap pamitan dengan pendampingan minimal.


* **Kelayakan Guru (*Expert Usability Feedback*)**: Skor evaluasi positif dari guru pendamping di sekolah mitra terkait keterbacaan antarmuka dan relevansi urutan materi.



---

## 3. Profil Pengguna (*User Persona*)

* **Pengguna Utama (Anak)**:
* **Profil**: Siswa disabilitas intelektual tingkat sekolah dasar (kelas 4 sampai kelas 6).


* **Karakteristik**: Memerlukan antarmuka yang ramah anak, instruksi visual yang jelas, pilihan tombol minimal untuk menghindari distraksi kognitif, dan umpan balik yang tidak menghakimi/menakutkan.




* **Pengguna Sekunder (Guru Pendamping / Orang Tua)**:
* **Karakteristik**: Berperan mengawasi interaksi anak dengan aplikasi, memberikan stimulus awal, serta mengevaluasi pemahaman anak terhadap runtutan aktivitas bina diri.





---

## 4. Alur Pengguna (*User Journey / Flow*)

```
[Mulai / Splash] 
      │
      ▼
[Opening Story & Pengenalan Maskot "Tako"] 
      │
      ▼
[Loop Aktivitas 1 s.d. 7]
      │
      ├───> Pengguna Memilih Aksi / Objek
      │         │
      │         ├── [Jika Input Salah] ──> Tampilkan Dialog Feedback Tako ──> Kembali ke Aktivitas Sama
      │         │
      │         └── [Jika Input Benar] ──> Animasi / Pindah ke Aktivitas Berikutnya
      │
      ▼
[Aktivitas Pamitan Berhasil] 
      │
      ▼
[Tamat / State Selesai]

```

*(Urutan aktivitas: 1. Bangun Tidur $\rightarrow$ 2. Mandi $\rightarrow$ 3. Menggosok Gigi $\rightarrow$ 4. Memakai Seragam $\rightarrow$ 5. Menyiapkan Perlengkapan $\rightarrow$ 6. Sarapan $\rightarrow$ 7. Pamitan)*

---

## 5. Cakupan Fitur (*Feature Scope & Functional Requirements*)

### 5.1 Fitur Fase Rilis (*In-Scope*)

| Fitur | Deskripsi | Prioritas |
| --- | --- | --- |
| **Karakter Pemandu ("Tako")** | Menampilkan karakter visual (maskot kucing berkacamata) yang memandu alur narasi, menyapa pemain di awal (*Opening Story*), dan memberikan umpan balik dialog ketika pemain membuat pilihan.

 | P0 (Must Have) |
| **Modul Alur 7 Aktivitas Pagi** | 1. Bangun Tidur<br>

<br>2. Mandi<br>

<br>3. Menggosok Gigi<br>

<br>4. Memakai Seragam Sekolah<br>

<br>5. Menyiapkan Buku & Alat Tulis<br>

<br>6. Sarapan<br>

<br>7. Pamitan Berangkat Sekolah

 | P0 (Must Have) |
| **Mesin Evaluasi *Rule-Based*** | Sistem logika yang mengevaluasi pilihan pemain berbasis kondisi `IF-THEN` sesuai matriks *Decision Tree*. Keputusan benar memicu `LoadNextActivity()`, keputusan salah memicu `ShowFeedback()`.

 | P0 (Must Have) |
| **Sistem Pengulangan (*Retry on Error*)** | Pemain tidak kalah atau keluar saat salah, melainkan diarahkan kembali oleh Tako untuk mengulang pemilihan pada aktivitas yang sedang aktif.

 | P0 (Must Have) |
| **Desain UI Ramah Aksesibilitas** | Tampilan berbasis *storyboard* konsisten, tata letak sederhana, tombol interaksi minimal, ilustrasi objek representatif, serta balon dialog teks yang mudah dibaca.

 | P0 (Must Have) |

### 5.2 Fitur Masa Depan (*Out of Scope / Future Roadmap*)

* Penambahan variasi aktivitas bina diri baru (misal: merapikan tempat tidur secara spesifik, aktivitas pulang sekolah).


* Pencatatan riwayat skor (*analytics/logging*) untuk guru melihat riwayat frekuensi salah input anak.
* *Voice over* / narasi suara otomatis untuk anak yang belum lancar membaca teks dialog.

---

## 6. Persyaratan Desain Antarmuka (*UX & UI Requirements*)

* **Konsistensi Visual**: Tiap *scene* menggunakan struktur tata letak yang identik, hanya berbeda pada latar ruangan (*background*), properti objek interaktif, dan teks dialog Tako.


* **Minim Distraksi**: Hindari menu navigasi bertingkat, pop-up promosi, atau tombol dekoratif yang tidak memiliki fungsi langsung pada aktivitas.


* **Kejelasan Objek Interaksi**: Objek pilihan (pakaian, makanan, sikat gigi, buku) harus memiliki ilustrasi yang jelas dan kontras dengan latar belakang.



---

## 7. Batasan Teknis & Ketergantungan (*Technical Constraints & Dependencies*)

* **Arsitektur**: Aplikasi *standalone* (luring / *offline*) tanpa keharusan koneksi internet kontinu.
* **Engine & Kode**: Unity Engine dengan skrip pemrograman C# (*conditional branching logic*).


* **Distribusi**: Target perangkat bersistem operasi Android (tablet / smartphone).


* **Performa**: Waktu transisi antar-*scene* instan agar tidak memecah fokus konsentrasi anak.



---

## 8. Rencana Pengujian & Penerimaan (*Testing & Acceptance Criteria*)

1. **Verifikasi Teknis (*QA / Black Box Testing*)**:
* Seluruh 13–14 aturan keputusan pada *Rule-Based System* teruji valid secara logika.


* Pemilihan input benar selalu membuka tahapan berikutnya.


* Pemilihan input keliru selalu memunculkan dialog Tako dan mempertahankan pengguna pada level tersebut tanpa *crash* atau *freezing*.




2. **Uji Validasi Pengguna & Pakar (*Stakeholder Acceptance*)**:
* Evaluasi lapangan bersama guru pendamping di sekolah mitra (YBPK Semampir Kediri) guna memvalidasi bahwa visualisasi dan alur cerita sesuai dengan kurikulum bina diri siswa berkebutuhan khusus.
