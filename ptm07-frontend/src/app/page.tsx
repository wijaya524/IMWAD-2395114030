'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkBackendHealth } from '@/lib/api';

export default function HomePage() {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 1.5rem 4rem',
        position: 'relative',
      }}>
        {/* Decorative Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#a5b4fc',
        }}>
          <span>✨ Integrasi Frontend (PTM-07) & Backend (PTM-06)</span>
        </div>

        <h1 style={{
          fontSize: '3.25rem',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          maxWidth: '900px',
          margin: '0 auto 1.25rem',
        }}>
          Simulasi Bina Diri Siswa & Dasbor Pemantauan Telemetri AI
        </h1>

        <p style={{
          fontSize: '1.15rem',
          maxWidth: '720px',
          margin: '0 auto 2.5rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          Platform edukasi rutinitas pagi untuk anak berkebutuhan khusus (tunagrahita) berbasis 
          Decision Tree Rule-Based dan Adaptive Guidance System. Dilengkapi dasbor telemetri 
          dan audit kecerdasan buatan untuk guru pendamping.
        </p>

        {/* Call to action buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem',
        }}>
          <Link href="/game" className="btn btn-tako" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <span>🎮</span>
            <span>Mulai Mainkan Game</span>
          </Link>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <span>📊</span>
            <span>Buka Dashboard Guru</span>
          </Link>
          <Link href="/telemetry-tester" className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '1.05rem' }}>
            <span>🧪</span>
            <span>Uji Sinkronisasi API</span>
          </Link>
        </div>

        {/* Backend Connectivity Status Alert Banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.65rem 1.25rem',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: backendOnline ? '#10b981' : '#f43f5e',
            boxShadow: backendOnline ? '0 0 10px #10b981' : '0 0 10px #f43f5e',
          }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            Status API Backend (`ptm06-backend`):{' '}
            <strong style={{ color: backendOnline ? '#6ee7b7' : '#fda4af' }}>
              {backendOnline === null ? 'Memeriksa status...' : backendOnline ? 'Online (Terhubung)' : 'Belum aktif / Offline'}
            </strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>Port: 3000 /api/v1</span>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '4rem',
      }}>
        {/* Card 1 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            marginBottom: '1.25rem',
          }}>
            🐱
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Maskot Tako & 7 Modul Pagi</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.925rem' }}>
            Simulasi bertahap dari Bangun Tidur, Mandi, Menggosok Gigi, Memakai Seragam, Menyiapkan Buku, Sarapan, hingga Pamitan dengan panduan hangat karakter Tako.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span className="badge badge-warning">Ramah Anak</span>
            <span className="badge badge-primary">Tanpa Hukuman</span>
            <span className="badge badge-success">Interaktif</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            marginBottom: '1.25rem',
          }}>
            🧠
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>AI Adaptive Guidance</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.925rem' }}>
            Menganalisis frekuensi kesalahan berulang (&ge; 2x) dan menghasilkan rekomendasi bantuan visual terarah (efek glow) dengan latensi inferensi di bawah 3 detik.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span className="badge badge-ai">US-06A & US-06B</span>
            <span className="badge badge-primary">Latensi &lt; 3s</span>
            <span className="badge badge-warning">Fallback Aman</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            marginBottom: '1.25rem',
          }}>
            📊
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Sinkronisasi Telemetri & Auth</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.925rem' }}>
            Merekam sesi permainan ke database backend secara aman menggunakan tanda tangan HMAC-SHA256, autentikasi guru via JWT, serta proteksi privasi tanpa PII siswa.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span className="badge badge-success">HMAC SHA-256</span>
            <span className="badge badge-primary">JWT Bearer</span>
            <span className="badge badge-primary">Zero PII</span>
          </div>
        </div>
      </section>

      {/* Quick Flow Visual */}
      <section className="glass-panel-elevated" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.75rem' }}>Alur Arsitektur Solusi Lengkap</h2>
        <p style={{ maxWidth: '650px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          Bagaimana komponen frontend `ptm07-frontend` berkomunikasi dengan layanan backend `ptm06-backend`.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          textAlign: 'left',
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1️⃣ Web Game Play</div>
            <p style={{ fontSize: '0.85rem' }}>Siswa memilih benda pada 7 tahapan modul. Evaluasi benar/salah dieksekusi instan.</p>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2️⃣ AI Adaptive Cue</div>
            <p style={{ fontSize: '0.85rem' }}>Jika terjadi kesalahan berturut-turut, mesin adaptif memunculkan sorotan visual.</p>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3️⃣ HMAC Telemetry Sync</div>
            <p style={{ fontSize: '0.85rem' }}>Payload dienkripsi dengan signature HMAC-SHA256 ke endpoint backend `POST /telemetry/sessions`.</p>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4️⃣ Teacher Evaluation</div>
            <p style={{ fontSize: '0.85rem' }}>Guru login dan memeriksa laporan hasil belajar anak pada dasbor evaluasi.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
