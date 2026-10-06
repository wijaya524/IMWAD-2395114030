[Peran]
Kamu adalah product manager senior untuk produk Mobile berfitur AI dan Game Edukasi Inklusif.

[Tugas]
Susun DRAF PRD ringkas untuk "Game Edukasi Daily Life bagi Anak Disabilitas Intelektual" berdasarkan kasus berikut.

[Konteks]
Problem statement: 
Pengambilan keputusan merupakan komponen penting dalam sistem pembelajaran interaktif, khususnya media game edukasi agar proses belajar berlangsung terstruktur. Penguasaan aktivitas kehidupan sehari-hari (daily life activities / bina diri) sebelum berangkat ke sekolah sangat krusial bagi kemandirian anak disabilitas intelektual, namun media pembelajaran interaktif yang secara sistematis menerapkan algoritma untuk mengatur alur aktivitas pengguna masih relatif terbatas. Sebagian besar game edukasi yang ada hanya menekankan penyampaian materi pasif tanpa mekanisme pengambilan keputusan yang terarah dalam memandu alur tindakan dan umpan balik saat anak melakukan kesalahan.

Target user: 
Siswa disabilitas intelektual (tunagrahita) tingkat sekolah dasar kelas 4 sampai kelas 6.

Stakeholder lain: 
Guru pendamping di sekolah luar biasa (SLB) dan orang tua/wali siswa [ASUMSI-01].

Persona ringkas: 
Doni, 11 tahun, siswa disabilitas intelektual kelas 5 SDLB yang sedang belajar merutinkan bina diri pagi hari (seperti mandi, gosok gigi, dan menyiapkan tas), namun mudah terdistraksi dan membutuhkan instruksi visual sederhana berulang kali tanpa intimidasi saat membuat pilihan yang keliru [ASUMSI-02].

Bukti riset:
1. Observasi langsung dilakukan di YBPK Semampir Kediri pada 28 Oktober 2025 dengan subjek siswa disabilitas intelektual kelas 4–6, menghasilkan pemetaan 7 aktivitas utama pra-sekolah: bangun tidur, mandi, menggosok gigi, memakai seragam sekolah, menyiapkan perlengkapan/buku sekolah, sarapan, dan pamitan.
2. Media pembelajaran interaktif berbasis visual terbukti membantu anak disabilitas intelektual memahami materi bina diri karena memberikan percontohan secara konkret dan repetitif.
3. Struktur Decision Tree yang diterjemahkan ke dalam 13–14 aturan logika (Rule-Based System) terbukti efektif mengatur transisi sekuensial aktivitas pengguna dan memberikan umpan balik adaptif saat terjadi kesalahan pilihan tanpa menyebabkan kegagalan sistem.

Platform & stack: 
Mobile (Android), Unity Engine, skrip logika C# (conditional logic/Decision Tree), aset visual 2D berbasis storyboard, dan karakter pendamping bernama "Tako".

Fitur AI/Logika inti: 
Decision Tree berbasis Rule-Based System (13-14 rules logika IF-THEN) yang mengatur alur percabangan aktivitas secara sistematis: memeriksa ketepatan pilihan objek/tindakan pengguna (kondisi Benar/Salah), mengarahkan ke aktivitas sekuensial berikutnya (LoadNextActivity), serta memicu intervensi umpan balik korektif (ShowFeedback) melalui karakter Tako.

Konstrain: 
Pengembangan prototipe bertahap (metode Prototype) dengan interaksi tombol minimal/beban kognitif rendah; evaluasi terbatas pada pengujian fungsionalitas Black Box dan validasi ahli oleh guru pendamping sekolah mitra.

[Format output]
1. Ringkasan eksekutif;
2. Problem statement & bukti (pisahkan fakta vs asumsi);
3. Target user & stakeholder (tabel peran-kebutuhan-pengaruh);
4. Value proposition: pain yang dikurangi, gain yang diciptakan, mengapa fitur Decision Tree/Rule-Based bukan gimmick;
5. Tujuan produk & KPI terukur (+ cara mengukurnya);
6. Scope fitur rilis: tabel MoSCoW (fitur logika AI/Decision Tree bertanda 🤖);
7. Non-goals eksplisit; 
8. Asumsi & risiko utama + mitigasi.

[Aturan]
Hanya gunakan data pada [Konteks]; bila informasi kurang, beri kode [ASUMSI-XX] lalu lanjutkan. Jangan menulis solusi teknis/arsitektur koding mendalam (fokus pada sudut pandang produk). Gunakan Bahasa Indonesia baku dan format Markdown rapi.
