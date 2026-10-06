# Draf Acceptance Criteria (Given–When–Then): Game Edukasi *Daily Life*

Dokumen ini mendefinisikan *Acceptance Criteria* (AC) menggunakan format BDD (*Behavior-Driven Development*) dengan pola Given–When–Then untuk menguji kelayakan setiap User Story prioritas. Kriteria pengujian berpatokan pada batas waktu respon sistem ($\le 3$ detik), ketepatan evaluasi aturan logika, dan keandalan mitigasi fitur berbasis AI ★.

---

## 1. Acceptance Criteria: Fitur Inti (Core Features)

### US-01: Pembuka Cerita dan Dialog Karakter Tako
* **Metode Uji**: *User Interface Test* / *Functional Black Box Testing*

#### Scenario 1: Menampilkan pembuka cerita saat game pertama kali dijalankan (Happy Path)
* **Given** aplikasi telah terpasang dan dibuka untuk pertama kali pada perangkat Android
* **When** proses pemuatan awal (*loading splash screen*) selesai dalam waktu $\le 2$ detik
* **Then** sistem menampilkan karakter pemandu Tako beserta balon dialog perkenalan di layar tanpa *glitch* visual.

---

### US-02A: Penyelesaian Modul Aktivitas Kebersihan Diri
* **Metode Uji**: *Integration Test*

#### Scenario 1: Transisi runtut dari modul Bangun Tidur ke Mandi
* **Given** pengguna berada pada modul Bangun Tidur dan telah memilih tindakan yang benar
* **When** sistem memvalidasi logika `R1` bernilai benar
* **Then** sistem memuat *scene* Mandi dalam waktu $\le 1,5$ detik tanpa terjadinya *softlock*.

#### Scenario 2: Pengulangan modul jika pengguna salah memilih perlengkapan mandi
* **Given** pengguna berada pada modul Mandi
* **When** pengguna memilih objek yang salah (misal: memilih buku alih-alih sabun)
* **Then** sistem menjalankan aturan `R4`, karakter Tako muncul memberikan teguran, dan status pengguna tetap berada di *scene* Mandi.

---

### US-02B: Penyelesaian Modul Persiapan Seragam dan Buku
* **Metode Uji**: *Functional Black Box Testing*

#### Scenario 1: Memasukkan buku dan alat tulis ke dalam tas sekolah dengan benar
* **Given** pengguna berada pada modul Menyiapkan Buku
* **When** pengguna memilih semua perlengkapan alat tulis yang sesuai jadwal sekolah
* **Then** sistem mengeksekusi aturan `R9` dan langsung mengarahkan pengguna ke *scene* Sarapan dalam durasi $\le 2$ detik.

---

### US-02C & US-07: Pemilihan Menu Sarapan dan Transisi ke Pamitan
* **Metode Uji**: *Functional Black Box Testing*

#### Scenario 1: Memilih menu sarapan yang sehat dan sesuai
* **Given** pengguna berada pada modul Sarapan
* **When** pengguna memilih makanan yang valid (sarapan pagi)
* **Then** sistem mengeksekusi aturan `R11` dan membuka modul Pamitan.

#### Scenario 2: Memilih makanan atau benda yang tidak sesuai pada saat sarapan
* **Given** pengguna berada pada modul Sarapan
* **When** pengguna memilih objek bukan makanan sarapan
* **Then** sistem menampilkan dialog koreksi Tako dan meminta pengguna memilih ulang tanpa mengurangi poin permainan.

---

### US-08: Siklus Permainan Berakhir pada Modul Pamitan
* **Metode Uji**: *End-to-End (E2E) User Acceptance Test*

#### Scenario 1: Pengguna menyelesaikan aksi pamitan kepada orang tua
* **Given** pengguna telah menyelesaikan seluruh modul 1 hingga 6 secara runtut
* **When** pengguna memilih opsi pamitan dengan benar pada modul ke-7
* **Then** sistem mengeksekusi aturan `R12`, mengubah *state* permainan menjadi `Selesai`, dan menampilkan layar penutup/selamat dalam waktu $\le 1$ detik.

---

## 2. Acceptance Criteria: Fitur AI Bimbingan Adaptif (Fitur AI ★)

### US-06A & US-06B: Analisis Pola Kesalahan dan Adaptasi Umpan Balik Tako
* **Metode Uji**: *Integration Test* & *Simulated Fault Injection Testing*

#### Scenario 1: Bimbingan adaptif aktif saat kesalahan berulang dengan keyakinan tinggi (Happy Path)
* **Given** pengguna melakukan kesalahan input $\ge 2$ kali berturut-turut pada modul yang sama
* **When** modul AI memproses log kesalahan dan menghasilkan skor keyakinan (*confidence score*) $\ge 75\%$ dalam durasi $\le 3$ detik
* **Then** karakter Tako menampilkan dialog petunjuk visual spesifik yang lebih sederhana (sorotan/animasi penunjuk objek yang benar) pada layar.

#### Scenario 2: Data interaksi layar tidak lengkap atau korup (Edge Case)
* **Given** perangkat pengguna mengalami gangguan memori lokal sehingga data riwayat sentuhan rusak (*corrupted input*)
* **When** sistem memvalidasi kelayakan data masukan sebelum diproses oleh modul analitik AI
* **Then** sistem mengabaikan data yang rusak tersebut, mencatat *error log* tanpa menutup aplikasi (*crash*), dan menampilkan pesan bimbingan statis *Rule-Based* standar dari Tako.

#### Scenario 3: Pemrosesan AI mengalami latensi tinggi atau kegagalan koneksi (Failure Path / Timeout)
* **Given** modul inferensi analitik AI belum memberikan hasil setelah waktu pemrosesan berjalan $> 3$ detik
* **When** batas waktu toleransi latensi (*timeout*) tercapai
* **Then** sistem otomatis menghentikan proses antrean AI, beralih ke jalur cadangan (*fallback* logika *Rule-Based* lokal), dan memunculkan petunjuk default Tako agar permainan tidak macet (*freeze*).

#### Scenario 4: Skor keyakinan modul AI berada di bawah ambang batas (Low Confidence)
* **Given** pengguna melakukan kesalahan dengan pola acak sehingga modul AI menghasilkan *confidence score* $< 75\%$
* **When** modul AI mengembalikan status hasil analitik meragukan
* **Then** sistem mengeksekusi penanganan mitigasi aman dengan menyajikan petunjuk umum dasar secara repetitif dan meminta konfirmasi tindakan ulang kepada pengguna.

---

## 3. Matriks Kesiapan Pengujian (Test Readiness Matrix)

| ID User Story | ID Skenario | Jenis Skenario | Metode Pengujian | Target Metrik / Batas Toleransi |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | SC-01.1 | Normal (Happy Path) | UI & Functional Test | Pemuatan awal $\le 2$ detik |
| **US-02A** | SC-02A.1 | Normal (Happy Path) | Integration Test | Waktu transisi $\le 1,5$ detik |
| **US-02A** | SC-02A.2 | Alur Negatif | Functional Test | Dialog muncul instan, *zero freeze* |
| **US-02B** | SC-02B.1 | Normal (Happy Path) | Functional Test | Transisi *scene* $\le 2$ detik |
| **US-02C** | SC-07.1 | Normal (Happy Path) | Functional Test | Respon evaluasi $\le 1$ detik |
| **US-08** | SC-08.1 | Normal (End State) | E2E Acceptance Test | Tampil layar tamat $\le 1$ detik |
| **US-06A/B** | SC-06.1 | Normal (Happy Path AI) | Integration Test | *Latency* $\le 3$ detik, *Confidence* $\ge 75\%$ |
| **US-06A/B** | SC-06.2 | Data Masukan Batas (*Edge*) | Unit / Integrity Test | Validasi data gagal $\rightarrow$ fallback senyap |
| **US-06A/B** | SC-06.3 | Kegagalan Respon (*Timeout*) | Fault Injection Test | Batas waktu cut-off tepat 3 detik $\rightarrow$ fallback lokal |
| **US-06A/B** | SC-06.4 | *Low Confidence* | Logic & Scenario Test | *Confidence* $< 75\%$ $\rightarrow$ petunjuk aman umum |
