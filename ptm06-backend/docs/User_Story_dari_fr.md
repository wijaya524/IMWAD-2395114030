# Draf User Stories: Game Edukasi *Daily Life* (PTM-02)


---

## 1. Tabel User Story

| ID Story | Narasi User Story | FR Asal | Prioritas MoSCoW | Kategori |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | Sebagai siswa tunagrahita, saya ingin melihat pembuka cerita dan sapaan dari maskot Tako, agar saya mengerti awal mula cerita game sebelum mulai bermain. | FR-01 | Must | Fitur Inti |
| **US-02A** | Sebagai siswa tunagrahita, saya ingin menyelesaikan modul aktivitas kebersihan diri (Bangun Tidur, Mandi, Menggosok Gigi), agar saya bisa belajar membersihkan diri di pagi hari secara runtut. | FR-02 | Must | Fitur Inti |
| **US-02B** | Sebagai siswa tunagrahita, saya ingin menyelesaikan modul persiapan fisik dan perlengkapan (Memakai Seragam dan Menyiapkan Buku), agar saya siap berangkat ke sekolah. | FR-02 | Must | Fitur Inti |
| **US-02C** | Sebagai siswa tunagrahita, saya ingin menyelesaikan modul akhir (Sarapan dan Pamitan), agar rangkaian kegiatan pagi saya selesai dengan sempurna. | FR-02, FR-06, FR-07 | Must | Fitur Inti |
| **US-03** | Sebagai siswa tunagrahita, saya ingin pilihan langkah kegiatan saya dievaluasi secara otomatis, agar saya tahu apakah tindakan saya sudah benar. | FR-03 | Must | Fitur Inti |
| **US-04** | Sebagai siswa tunagrahita, saya ingin langsung berpindah ke aktivitas berikutnya saat pilihan saya benar, agar permainan terus berjalan lancar. | FR-04 | Must | Fitur Inti |
| **US-05** | Sebagai siswa tunagrahita, saya ingin mendapat panduan dan teguran dari Tako saat pilihan saya salah, agar saya bisa mencoba memperbaikinya. | FR-05 | Must | Fitur Inti |
| **US-06A** | Aspek AI: Sebagai siswa tunagrahita, saya ingin sistem mencatat pola frekuensi kesalahan saya pada setiap modul, agar sistem mengenali bagian mana yang paling sulit bagi saya. | FR-05, R2, R4, R6, R8, R10, R13 | Should | Fitur AI ★ |
| **US-06B** | Aspek AI: Sebagai siswa tunagrahita, saya ingin karakter Tako mengubah tingkat kejelasan petunjuk verbal/visual menjadi lebih sederhana jika saya melakukan kesalahan berulang, agar saya lebih mudah mengerti. | FR-05, R2, R4, R6, R8, R10, R13 | Should | Fitur AI ★ |
| **US-07** | Sebagai siswa tunagrahita, saya ingin memilih menu makanan sarapan yang tepat, agar saya bisa lanjut ke tahap persiapan berangkat sekolah. | FR-06 | Must | Fitur Inti |
| **US-08** | Sebagai siswa tunagrahita, saya ingin melihat layar selesai setelah berhasil melakukan pamitan, agar saya tahu bahwa misi pagi hari saya sudah tuntas. | FR-07 | Must | Fitur Inti |

---

## 2. Evaluasi Prinsip INVEST

* **US-01 (Opening Story & Maskot Tako)**
  * *Independent & Negotiable:* Ya, bisa dikembangkan dan diuji secara terpisah dari modul game inti.
  * *Valuable:* Memberikan konteks awal yang ramah anak berkebutuhan khusus sebelum masuk ke materi inti.
  * *Estimable & Small:* Sangat kecil dan mudah diperkirakan waktunya.
  * *Testable:* Dapat diuji dengan memastikan teks pembuka dan karakter Tako muncul saat aplikasi pertama kali dijalankan.

* **US-02A, US-02B, & US-02C (Pecahan Modul Aktivitas Harian)**
  * *Independent:* Masing-masing modul dapat dikembangkan secara modular di Unity Engine.
  * *Valuable:* Menjadi fondasi runtut bina diri yang konsisten tanpa membuat anak kewalahan dengan beban kognitif berlebih sekaligus.
  * *Estimable & Small:* Ukurannya pas untuk diselesaikan dalam satu siklus pengerjaan sprint.
  * *Testable:* Dapat diuji dengan mengeklik dan memvalidasi perpindahan antar-scene pada kelompok modul terkait.

* **US-03 & US-04 (Evaluasi Rule-Based dan Transisi Otomatis)**
  * *Independent & Negotiable:* Bergantung pada struktur modul, tetapi fungsionalitas logikanya bisa diuji terpisah.
  * *Valuable:* Memastikan alur pembelajaran berjalan linier tanpa kebingungan bagi anak tunagrahita.
  * *Estimable & Small:* Ukurannya pas untuk dikerjakan dalam satu siklus pengkodean kondisi logika C#.
  * *Testable:* Dapat diuji menggunakan skenario hitam (*Black Box Testing* / TC-01 sampai TC-08) untuk memastikan respons benar/salah berfungsi tepat.

* **US-05 (Umpan Balik Kesalahan dari Tako)**
  * *Independent:* Berdiri sendiri sebagai sistem *feedback*.
  * *Valuable:* Membimbing pengguna belajar dari kesalahan tanpa memicu frustrasi.
  * *Estimable & Small:* Kecil dan spesifik pada penayangan dialog atau animasi teguran.
  * *Testable:* Dapat diuji dengan memberikan input salah dan melihat apakah Tako merespons dengan instruksi pengulangan.

* **US-06A & US-06B (Fitur AI Umpan Balik Adaptif - Dipecah dari Epic US-06)**
  * *Independent:* Dapat diintegrasikan secara bertahap di atas sistem *rule-based* yang sudah stabil.
  * *Valuable:* Memberikan pengalaman belajar yang dipersonalisasi sesuai kebutuhan kognitif anak tunagrahita yang unik.
  * *Estimable & Small:* Pemecahan ini membuat cakupan tugas pencatatan data kesalahan dan adaptasi teks Tako menjadi jauh lebih terukur dan kecil.
  * *Testable:* Dapat diuji dengan mensimulasikan pola kesalahan berulang dari pengguna dan memvalidasi apakah log data terekam serta respons Tako menyesuaikan tingkat kesulitannya.

* **US-07 & US-08 (Modul Sarapan dan Layar Selesai)**
  * *Independent & Negotiable:* Berdiri sendiri sebagai modul akhir permainan.
  * *Valuable:* Menutup rangkaian simulasi aktivitas pagi secara utuh dan memberikan rasa pencapaian bagi siswa.
  * *Estimable & Small:* Sangat kecil, spesifik, dan mudah diestimasi.
  * *Testable:* Dapat diuji dengan memilih menu sarapan yang sesuai lalu menuntaskan aksi pamitan hingga layar penutup muncul.

---

## 3. Catatan Pengembangan
- Seluruh *User Story* di atas disusun dengan mengacu pada persona siswa tunagrahita kelas 4-6 SDLB.
- Fitur AI (★) pada US-06A dan US-06B menggunakan pendekatan adaptif berbasis pola input kesalahan pengguna untuk membantu proses repetisi belajar.
