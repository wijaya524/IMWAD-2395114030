# Draf User Flow dengan Status AI: Game Edukasi *Daily Life*

Dokumen ini merancang alur interaksi pengguna (*User Flow*) untuk dua skenario utama:
1. **Fitur AI ★**: Bimbingan Adaptif Evaluasi Kesalahan Belajar Siswa Tunagrahita.
2. **Fitur Utama**: Pemilihan dan Penyelesaian Aktivitas Harian (*Rule-Based Core Loop*).

---

## 1. Langkah Alur Pengguna Terstruktur

### Alur Fitur AI ★: Bimbingan Adaptif Evaluasi Kesalahan (UC-01)
1. **Titik Masuk (*Entry Point*)**: Siswa berada pada layar salah satu modul (misal: Menyiapkan Buku Sekolah).
2. **Interaksi Input**: Siswa mengetuk objek di layar secara keliru berulang kali (frekuensi kesalahan $\ge 2$ kali).
3. **Pengecekan di Perangkat (*Local Validation*)**: Game mendeteksi adanya masukan sentuhan yang valid (bukan *accidental tap* di luar area layar) dan memverifikasi log interaksi lokal.
4. **Pemrosesan Inferensi**: Sistem memicu modul AI untuk menganalisis riwayat kesalahan guna memilih tingkat bimbingan visual/audio Tako yang sesuai.
5. **Penyajian Respons**:
   - Jika *confidence* tinggi: Tako memunculkan animasi petunjuk langsung yang eksplisit (misal: memberikan sorotan berkedip (*glow*) pada buku yang benar).
   - Jika *confidence* rendah: Tako menanyakan bantuan konfirmasi verbal/visual sederhana kepada siswa atau pendamping.
   - Jika *timeout/gagal*: Sistem langsung menjalankan *fallback* logika statis *rule-based*.
6. **Titik Selesai (*Exit Point*)**: Siswa memahami arahan baru, menekan tombol/objek yang tepat, dan berhasil melanjutkan permainan.

### Alur Fitur Utama: Penyelesaian Siklus Aktivitas Harian
1. **Titik Masuk**: Siswa membuka modul baru setelah menyelesaikan aktivitas sebelumnya.
2. **Interaksi Input**: Siswa memilih benda/tindakan yang sesuai dengan rutinitas pagi (misal: sabun untuk mandi).
3. **Evaluasi Aturan (*Rule Evaluation*)**: Unity Engine memvalidasi masukan menggunakan *Decision Tree* statis.
4. **Umpan Balik Instan**: Sistem memutar efek suara positif dan memicu transisi *scene* berikutnya (*LoadNextActivity*).
5. **Titik Selesai**: Permainan berpindah ke modul berikutnya secara mulus.

---

## 2. Penggambaran 4 Status Sistem

| Status Sistem | Fitur AI ★ (Bimbingan Adaptif Tako) | Fitur Utama (Siklus Mandiri Harian) |
| :--- | :--- | :--- |
| **1. Validasi Awal di Perangkat** | Memastikan input sentuhan tepat sasaran pada objek interaktif di kanvas Unity dan memeriksa integritas log kesalahan lokal sebelum dikirim ke modul analitik. | Memvalidasi bahwa objek yang disentuh merupakan bagian dari aset interaktif modul terkait (bukan *background* kosong). |
| **2. Indikator Proses** | Animasi karakter Tako berpikir (*thinking animation* berupa gelembung interaktif halus tanpa teks rumit) agar siswa tunagrahita tidak merasa aplikasi macet (*freeze*). | Transisi visual mikro (efek sorot saat tombol ditekan) sebelum evaluasi aturan selesai dieksekusi. |
| **3. Penanganan Hasil** | • **Yakin (*High Confidence* $\ge 75\%$):** Tako menampilkan petunjuk visual konkret (animasi tangan menunjuk objek yang benar).<br>• **Ragu (*Low Confidence* $< 75\%$):** Tako memberikan petunjuk visual dasar yang paling umum dan meminta pendamping/siswa mengulang sekali lagi. | Pilihan diverifikasi benar/salah secara deterministik: benar langsung lanjut ke *scene* berikutnya, salah memicu dialog standar Tako. |
| **4. Jalur Cadangan (*Fallback*)** | Jika inferensi memakan waktu $> 3$ detik atau modul analitik *timeout*, sistem secara otomatis memutus antrean AI dan menampilkan dialog panduan statis *Rule-Based* bawaan aplikasi. | Jika aset transisi gagal termuat, sistem memuat ulang (*reload*) *scene* aktif tanpa menghilangkan status progres permainan. |

---

## 3. Diagram Alur (Mermaid Flowchart)

### A. Diagram Alur Fitur AI ★: Evaluasi Adaptif Bimbingan Kesalahan

```mermaid
flowchart TD
    A([Mulai: Siswa Salah Input Berulang]) --> B[Tangkap Data Interaksi & Log Riwayat]
    B --> C{Data Masukan Valid?}
    C -- Tidak / Korup --> D[Gunakan Log Standar & Reset State]
    D --> B
    C -- Ya --> E[Tampilkan Animasi Tako Berpikir: Memproses...]
    E --> F{Respon Selesai <= 3 Detik?}
    F -- Timeout / Gagal Koneksi --> G[Jalur Cadangan: Gunakan Petunjuk Statis Rule-Based]
    G --> H[Tampilkan Dialog Bantuan Tako]
    F -- Sukses --> I{Confidence Score >= 75%?}
    I -- Rendah / Ragu --> J[Tampilkan Petunjuk Visual Paling Umum]
    I -- Tinggi / Yakin --> K[Tampilkan Panduan Visual Adaptif Khusus]
    J --> H
    K --> H
    H --> L([Siswa Memilih Ulang & Melanjutkan])

'
