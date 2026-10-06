# Matriks Keterlacakan (Traceability Matrix): Game Edukasi *Daily Life*

Dokumen ini memetakan keterhubungan (*end-to-end traceability*) mulai dari kebutuhan fungsional (FR) pada dokumen SRS hingga skenario pengujian, guna memastikan setiap baris kode, logika *Rule-Based*, dan modul AI dapat dipertanggungjawabkan serta terverifikasi secara terstruktur.

---

## Tabel Matriks Keterlacakan Sistem

| ID Kebutuhan (SRS) | ID User Story | ID Use Case | ID Acceptance Criteria | Komponen Teknis & Model AI | Rencana Uji (Metode Pengujian) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-01** | US-01 | UC-Opening | SC-01.1 | Canvas UI Unity, Audio Manager, Dialog Box Controller | UI Testing & Manual Black Box |
| **FR-02** | US-02A | UC-CoreRoutine | SC-02A.1, SC-02A.2 | Scene Management Unity, Rule-Based Engine (C# `R1`–`R4`) | Integration Testing |
| **FR-02** | US-02B | UC-CoreRoutine | SC-02B.1 | Inventory/Selection Manager, Rule-Based Engine (C# `R5`–`R10`) | Functional Black Box Testing |
| **FR-02, FR-06** | US-02C, US-07 | UC-CoreRoutine | SC-07.1, SC-07.2 | Condition Checker Unity, Rule-Based Engine (C# `R11`) | Functional Black Box Testing |
| **FR-03, FR-04** | US-03, US-04 | UC-CoreRoutine | SC-02A.1, SC-02B.1, SC-07.1 | C# Decision Tree Script, State Transition Handler | Unit Testing & Logic Verification |
| **FR-05** | US-05 | UC-Feedback | SC-02A.2 | Tako Animation Controller, Static Dialog Fallback | Functional Black Box Testing |
| **FR-05, R2, R4, R6, R8, R10, R13** | US-06A, US-06B | UC-01 | SC-06.1, SC-06.2, SC-06.3, SC-06.4 | Local DB Logger, Adaptive AI Logic Engine (Tako Helper Module) ★ | Integration Testing, Fault Injection, & Boundary Testing |
| **FR-07** | US-08 | UC-GameCompletion | SC-08.1 | End-Game Trigger Handler, PlayerPrefs / Save State System | End-to-End (E2E) User Acceptance Test |

---

## Ringkasan Verifikasi Komponen

1. **Komponen Inti (*Rule-Based Core*)**:
   - Menghubungkan kebutuhan dasar **FR-01** hingga **FR-04** dan **FR-07** dengan script transisi sekuensial Unity C#.
   - Diverifikasi melalui pengujian fungsional kotak hitam (*Black Box*) dan pengujian integrasi transisi antar-*scene*.

2. **Komponen Bimbingan Adaptif (*Fitur AI ★*)**:
   - Menghubungkan penanganan kesalahan **FR-05** dan aturan transisi eksepsi (**R2**, **R4**, **R6**, **R8**, **R10**, **R13**) dengan modul analitik interaksi siswa.
   - Diverifikasi menggunakan injeksi kegagalan (*fault injection*) untuk memastikan penanganan batas waktu (*timeout* $\le 3$ detik), data masukan korup, dan nilai keyakinan rendah (*low confidence* $< 75\%$) berjalan tanpa membuat aplikasi *freeze*.
