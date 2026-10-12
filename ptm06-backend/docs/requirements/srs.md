Berikut adalah draf dokumen *Software Requirements Specification* (SRS) yang disusun berdasarkan spesifikasi sistem pada makalah tersebut:

---

# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

### Game Edukasi *Daily Life* Berbasis Decision Tree & Rule-Based System untuk Anak Disabilitas Intelektual



---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen Software Requirements Specification (SRS) ini bertujuan untuk mendefinisikan kebutuhan fungsional, non-fungsional, serta batasan arsitektur sistem dari **Game Edukasi *Daily Life***. Dokumen ini menjadi acuan bagi pengembang perangkat lunak, penguji (*tester*), dan pendidik dalam proses implementasi dan validasi sistem.

### 1.2 Lingkup Produk

Game Edukasi *Daily Life* adalah aplikasi pembelajaran interaktif berbasis Android yang dirancang khusus untuk anak disabilitas intelektual (tunagrahita). Aplikasi ini mensimulasikan urutan aktivitas mandiri sehari-hari sebelum berangkat ke sekolah menggunakan pendekatan algoritma *Decision Tree* yang diimplementasikan ke dalam *Rule-Based System*.

### 1.3 Definisi, Akronim, dan Singkatan

* **SRS**: *Software Requirements Specification*
* **Decision Tree**: Algoritma pengambilan keputusan berbasis struktur pohon (*node* dan cabang).


* **Rule-Based System**: Sistem berbasis aturan logika (*IF-THEN*).


* **Black Box Testing**: Metode pengujian fungsionalitas perangkat lunak tanpa melihat struktur kode internal.


* **Tako**: Karakter pemandu/maskot dalam game yang memberikan dialog dan *feedback* kepada pengguna.



---

## 2. DESKRIPSI UMUM SISTEM

### 2.1 Perspektif Produk

Aplikasi *Daily Life* merupakan perangkat lunak *standalone* berbasis *mobile* (Android) yang dikembangkan menggunakan Unity Engine. Sistem memfasilitasi pengguna untuk berlatih bina diri secara berulang dan visual melalui skenario aktivitas pagi hari.

### 2.2 Karakteristik Pengguna

* **Target Pengguna Utama**: Siswa disabilitas intelektual (tingkat sekolah dasar kelas 4 sampai kelas 6) yang memerlukan media interaktif visual, repetitif, dan terstruktur.


* **Pengguna Pendamping**: Guru SLB atau orang tua yang mendampingi dan mengevaluasi ketercapaian proses belajar.



### 2.3 Lingkungan Operasi & Teknologi

* **Platform Target**: Android OS


* **Game Engine**: Unity Engine


* **Bahasa Pemrograman**: C# (*conditional logic*)



### 2.4 Batasan dan Asumsi

* Alur permainan bersifat linier-sekuensial berdasarkan pohon keputusan yang telah ditentukan.


* Pengguna tidak dapat melangkah ke aktivitas berikutnya sebelum menyelesaikan aktivitas saat ini dengan benar.


* Antarmuka didesain minimalis dengan interaksi tombol sederhana guna meminimalkan beban kognitif pengguna.



---

## 3. SPESIFIKASI KEBUTUHAN (REQUIREMENTS)

### 3.1 Kebutuhan Fungsional (Functional Requirements)

| Kode Kebutuhan | Deskripsi Fungsional |
| --- | --- |
| **FR-01** | Sistem harus menampilkan *Opening Story* dan dialog pengenalan dari karakter pemandu ("Tako").

 |
| **FR-02** | Sistem harus menyajikan 7 modul aktivitas utama secara berurutan: Bangun Tidur, Mandi, Menggosok Gigi, Memakai Seragam Sekolah, Menyiapkan Perlengkapan/Buku Sekolah, Sarapan, dan Pamitan.

 |
| **FR-03** | Sistem harus mengevaluasi input/pilihan pengguna pada setiap aktivitas menggunakan logika *Rule-Based System*.

 |
| **FR-04** | Sistem harus mengarahkan pengguna ke aktivitas berikutnya (*LoadNextActivity*) jika input dinyatakan valid/benar.

 |
| **FR-05** | Sistem harus menampilkan umpan balik kesalahan (*ShowFeedback*) melalui karakter Tako dan meminta pengguna mengulangi aksi jika input salah atau tidak sesuai.

 |
| **FR-06** | Sistem harus memvalidasi pemilihan menu makanan pada modul Sarapan dan mengarahkan ke modul Pamitan bila menu sesuai.

 |
| **FR-07** | Sistem harus mengakhiri siklus permainan (*State: Selesai*) setelah pengguna berhasil menyelesaikan tindakan pamitan dengan benar.

 |

### 3.2 Kebutuhan Aturan Logika (*Rule-Based System Requirements*)

Sistem wajib mengeksekusi aturan transisi berikut (berdasarkan model *Decision Tree*):

* **R1**: `IF Bangun Tidur = Benar` $\rightarrow$ `THEN Lanjut ke Aktivitas Mandi`

* **R2**: `IF Bangun Tidur = Salah` $\rightarrow$ `THEN Tampilkan Feedback Tako (Ulangi)`

* **R3**: `IF Mandi = Benar` $\rightarrow$ `THEN Lanjut ke Aktivitas Menggosok Gigi`

* **R4**: `IF Mandi = Salah` $\rightarrow$ `THEN Tampilkan Feedback Tako (Ulangi)`

* **R5**: `IF Menggosok Gigi = Benar` $\rightarrow$ `THEN Lanjut ke Aktivitas Memakai Seragam`

* **R6**: `IF Menggosok Gigi = Salah` $\rightarrow$ `THEN Tampilkan Feedback Tako (Ulangi)`

* **R7**: `IF Memakai Seragam = Benar` $\rightarrow$ `THEN Lanjut ke Aktivitas Menyiapkan Buku dan Alat Tulis`

* **R8**: `IF Memakai Seragam = Salah` $\rightarrow$ `THEN Tampilkan Feedback Tako (Ulangi)`

* **R9**: `IF Menyiapkan Buku dan Alat Tulis = Benar` $\rightarrow$ `THEN Lanjut ke Aktivitas Sarapan`

* **R10**: `IF Menyiapkan Buku dan Alat Tulis = Tidak Sesuai` $\rightarrow$ `THEN Tampilkan Feedback Tako (Ulangi)`

* **R11**: `IF Memilih Sarapan = Benar / Sesuai` $\rightarrow$ `THEN Lanjut ke Aktivitas Pamitan`

* **R12**: `IF Pamitan = Benar` $\rightarrow$ `THEN Status = Selesai`

* **R13**: `IF Pamitan = Tidak Dilakukan / Salah` $\rightarrow$ `THEN Tampilkan Feedback Tako (Ulangi)`


### 3.3 Kebutuhan Antarmuka (Interface Requirements)

* **Antarmuka Pengguna (UI)**:
* Desain berbasis *storyboard* dengan tata letak visual yang konsisten antar *scene*.


* Tata letak sederhana (*clean*), minim elemen distraksi, dan jumlah tombol interaksi minimal.


* Penggunaan aset visual (ikon, latar tempat tidur/kamar mandi/ruang makan, dan karakter ilustrasi) yang representatif terhadap benda nyata di kehidupan sehari-hari.


* Komponen dialog/teks balon berukuran proporsional agar mudah terbaca oleh anak berkebutuhan khusus.




* **Antarmuka Interaksi**:
* Input berbasis sentuhan (*single-tap* / seleksi objek).





### 3.4 Kebutuhan Non-Fungsional (Non-Functional Requirements)

* **Usability**: Tampilan dan kontrol interaksi harus dapat dipahami dan dioperasikan oleh anak disabilitas intelektual dengan bantuan verbal minimal dari pendamping.


* **Reliability**: Evaluasi kondisi logika input pada Unity C# harus 100% konsisten dalam menentukan percabangan (benar vs salah) tanpa memicu kebuntuan skenario (*softlock*).


* **Performance**: Transisi antar-*scene* atau saat pemanggilan fungsi *feedback* harus berjalan lancar pada perangkat Android target tanpa jeda yang membingungkan pengguna.



---

## 4. RENCANA VERIFIKASI & PENGUJIAN

### 4.1 Black Box Testing

Pengujian fungsionalitas kotak hitam dilakukan untuk memvalidasi setiap cabang keputusan:

| ID Kasus Uji | Skenario Pengujian | Input | Output Diharapkan |
| --- | --- | --- | --- |
| **TC-01** | Pemilihan objek bangun tidur

 | Objek benar

 | Berpindah ke *scene* Mandi

 |
| **TC-02** | Pemilihan objek bangun tidur

 | Objek salah

 | Muncul dialog feedback Tako, tetap di scene

 |
| **TC-03** | Pemilihan perlengkapan mandi

 | Perlengkapan benar

 | Berpindah ke *scene* Menggosok Gigi

 |
| **TC-04** | Pemilihan alat gosok gigi

 | Alat benar

 | Berpindah ke *scene* Memakai Seragam

 |
| **TC-05** | Pemilihan seragam sekolah

 | Pakaian benar

 | Berpindah ke *scene* Menyiapkan Buku

 |
| **TC-06** | Pemilihan perlengkapan sekolah

 | Buku & alat tulis sesuai

 | Berpindah ke *scene* Sarapan

 |
| **TC-07** | Pemilihan menu sarapan

 | Makanan sesuai

 | Berpindah ke *scene* Pamitan

 |
| **TC-08** | Pelaksanaan pamitan

 | Tindakan benar

 | Menampilkan layar Selesai / Tamat

 |

### 4.2 Evaluasi Kelayakan Ahli

Evaluasi non-teknis dilakukan bersama guru pendamping (SLB) untuk menilai kesesuaian alur materi, keterbacaan instruksi visual, dan efektivitas media terhadap proses belajar anak.
