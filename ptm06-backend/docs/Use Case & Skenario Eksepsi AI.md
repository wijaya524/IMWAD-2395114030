# Draf Use Case & Skenario Eksepsi AI: Game Edukasi *Daily Life*

Dokumen ini berisi draf *Use Case* formal untuk User Story prioritas yang berfokus pada fitur berbasis AI ★ dan alur penanganan kegagalannya (*exception flow*), disesuaikan dengan kebutuhan sistem pada SRS PTM-02.

---

## 1. Use Case 01: Analisis Pola Kesalahan dan Penyesuaian Umpan Balik Adaptif (Fitur AI ★)

* **ID dan Nama Use Case**: UC-01: Menganalisis Pola Kesalahan Belajar dan Menyesuaikan Umpan Balik Adaptif
* **Aktor Utama**: Siswa Tunagrahita
* **Aktor Pendukung**: Sistem *Rule-Based/Decision Tree*, Modul Logika AI Adaptif, Database Lokal/Server
* **Precondition**: 
  * Pengguna sedang berada di dalam salah satu modul aktivitas permainan (*Daily Life*).
  * Pengguna melakukan kesalahan input berulang kali pada modul tersebut.
* **Postcondition**: 
  * Sistem berhasil merekam pola kesalahan pengguna.
  * Karakter Tako menampilkan bentuk petunjuk atau umpan balik (*feedback*) yang lebih sederhana dan mudah dipahami sesuai tingkat kesulitan pengguna.

### Alur Utama (*Main Flow*):
1. Pengguna memilih objek atau tindakan yang salah pada modul aktivitas yang sedang berjalan.
2. Sistem mendeteksi adanya input yang tidak sesuai dengan kondisi logika yang benar pada modul tersebut.
3. Modul Logika AI Adaptif mencatat frekuensi dan jenis kesalahan yang dilakukan oleh pengguna ke dalam database lokal.
4. Sistem menghitung tingkat kesulitan berdasarkan akumulasi kesalahan berulang.
5. Sistem memicu modul AI untuk merumuskan bentuk petunjuk verbal/visual pengganti yang lebih sederhana.
6. Karakter Tako muncul dan menyampaikan umpan balik adaptif yang disederhanakan kepada pengguna.
7. Pengguna menerima petunjuk baru dan mencoba kembali melakukan tindakan yang benar.

### Alur Alternatif (*Alternative Flow*):
* **3a**. Jika pengguna langsung menjawab benar pada percobaan pertama atau kedua:
  * 1. Sistem mencatat bahwa pengguna memahami materi dengan baik tanpa perlu penyesuaian tingkat kesulitan.
  * 2. Sistem mempertahankan standar petunjuk normal dan melanjutkan permainan ke aktivitas berikutnya (*LoadNextActivity*).

### Alur Eksepsi Khusus AI (*AI Exception Flow*):
* **Kualitas masukan data rendah atau buram sebelum dikirim**:
  * *Skenario*: Data riwayat input atau interaksi layar pengguna mengalami korupsi data (*corrupted state*) sehingga log kesalahan gagal dibaca oleh modul AI.
  * *Penanganan*: Sistem otomatis mengabaikan data korup tersebut, mencatat log error secara senyap, dan menggunakan *fallback rule* standar untuk menampilkan petunjuk dasar Tako tanpa menghentikan permainan (*softlock*).
* **Permintaan ke server AI mengalami timeout atau gagal koneksi**:
  * *Skenario*: Proses pengiriman data analitik kesalahan mengalami kendala jaringan atau melebihi batas waktu latensi yang diizinkan (misalnya $>3$ detik).
  * *Penanganan*: Sistem membatalkan proses inferensi eksternal, beralih secara instan ke sistem *Rule-Based* statis lokal (*offline fallback*), dan menampilkan pesan bimbingan standar dari Tako agar alur belajar tetap berjalan lancar.
* **Skor keyakinan model berada di bawah ambang batas (*low confidence*)**:
  * *Skenario*: Model AI tidak dapat memastikan tingkat kesulitan atau pola kebingungan pengguna secara akurat (skor keyakinan $< 75\%$).
  * *Penanganan*: Sistem secara otomatis memilih opsi mitigasi teraman dengan memberikan petunjuk visual yang paling eksplisit dan repetitif melalui karakter Tako untuk membantu pengguna melewati hambatan.

### Kaitan ke ID User Story dan FR Asal:
* **User Story**: US-06A dan US-06B
* **Functional Requirements**: FR-05, R2, R4, R6, R8, R10, R13
