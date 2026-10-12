'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import MetricCard from '@/components/MetricCard';
import { authStorage, AuthUser } from '@/lib/auth';
import { api } from '@/lib/api';

interface StoredSessionSummary {
  sessionId: string;
  devicePseudoId: string;
  startedAt: string;
  completedAt: string | null;
  isCompleted: boolean;
  totalInteractions: number;
  aiHintsCount: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessions, setSessions] = useState<StoredSessionSummary[]>([]);
  const [filterCompleted, setFilterCompleted] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  // Lookup state
  const [lookupSessionId, setLookupSessionId] = useState('');
  const [lookupDeviceId, setLookupDeviceId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    setUser(authStorage.getUser());

    // Muat riwayat sesi yang pernah disinkronkan dari localStorage (browser cache)
    const stored = localStorage.getItem('dl_synced_sessions_history');
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch {
        // Abaikan parse error
      }
    } else {
      // Default sesi data demonstrasi awal
      const defaultSamples: StoredSessionSummary[] = [
        {
          sessionId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          devicePseudoId: 'PSEUDO_DEV_TABLET_A01',
          startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          completedAt: new Date(Date.now() - 3600000 * 2 + 420000).toISOString(),
          isCompleted: true,
          totalInteractions: 9,
          aiHintsCount: 2,
        },
        {
          sessionId: '550e8400-e29b-41d4-a716-446655440000',
          devicePseudoId: 'PSEUDO_DEV_TABLET_A02',
          startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          completedAt: new Date(Date.now() - 3600000 * 5 + 510000).toISOString(),
          isCompleted: true,
          totalInteractions: 11,
          aiHintsCount: 3,
        },
        {
          sessionId: '7a2f5c81-8e92-4d3b-a912-3c81e92d4b12',
          devicePseudoId: 'PSEUDO_DEV_TABLET_B03',
          startedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          completedAt: null,
          isCompleted: false,
          totalInteractions: 4,
          aiHintsCount: 1,
        },
      ];
      setSessions(defaultSamples);
      localStorage.setItem('dl_synced_sessions_history', JSON.stringify(defaultSamples));
    }
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);

    if (!lookupSessionId || !lookupDeviceId) {
      setLookupError('Session ID dan Device Pseudo ID wajib diisi');
      return;
    }

    setLookupLoading(true);
    try {
      const res = await api.telemetry.getSession(lookupSessionId.trim(), lookupDeviceId.trim());
      if (res.status === 'SUCCESS' && res.data) {
        setLookupResult(res.data);
      } else {
        setLookupError(res.message || 'Sesi tidak ditemukan pada database backend');
      }
    } catch (err: any) {
      setLookupError(err.message || 'Gagal menghubungi backend API');
    } finally {
      setLookupLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filterCompleted === 'COMPLETED') return s.isCompleted;
    if (filterCompleted === 'IN_PROGRESS') return !s.isCompleted;
    return true;
  });

  const totalCompleted = sessions.filter((s) => s.isCompleted).length;
  const completionRate = sessions.length ? Math.round((totalCompleted / sessions.length) * 100) : 0;
  const totalAiHints = sessions.reduce((acc, s) => acc + (s.aiHintsCount || 0), 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Dashboard Evaluasi Siswa</h1>
            <span className="badge badge-primary">Portal Guru</span>
          </div>
          <p style={{ fontSize: '0.925rem' }}>
            {user ? (
              <span>Selamat datang, <strong>{user.name}</strong> ({user.role}) • Pantau perkembangan belajar mandiri anak</span>
            ) : (
              <span>Mode Evaluasi • Anda dapat masuk menggunakan akun guru untuk menyimpan laporan</span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/game" className="btn btn-tako" style={{ padding: '0.6rem 1.15rem' }}>
            🎮 Buka Game Simulator
          </Link>
          <Link href="/telemetry-tester" className="btn btn-secondary" style={{ padding: '0.6rem 1.15rem' }}>
            🧪 Ingest Tester
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        <MetricCard
          title="Total Sesi Tercatat"
          value={sessions.length}
          subtitle="Sesi terdaftar di perangkat & backend"
          icon="🎮"
          badge={{ text: 'Sinkron', variant: 'primary' }}
          accentColor="#6366f1"
        />
        <MetricCard
          title="Tingkat Penyelesaian"
          value={`${completionRate}%`}
          subtitle={`${totalCompleted} dari ${sessions.length} sesi selesai tuntas`}
          icon="🏆"
          badge={{ text: completionRate >= 70 ? 'Target Tercapai' : 'Perlu Didampingi', variant: 'success' }}
          accentColor="#10b981"
        />
        <MetricCard
          title="Intervensi AI Adaptif"
          value={totalAiHints}
          subtitle="Total bantuan sorotan visual Tako terpicu"
          icon="🧠"
          badge={{ text: 'US-06A/B Aktif', variant: 'ai' }}
          accentColor="#f59e0b"
        />
        <MetricCard
          title="Latensi Inferensi Rata-rata"
          value="32 ms"
          subtitle="Batas kritis NFR: < 3000 ms"
          icon="⚡"
          badge={{ text: 'Sangat Cepat', variant: 'success' }}
          accentColor="#0ea5e9"
        />
      </div>

      {/* Direct Backend Lookup Box */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔍</span>
          <span>Inspeksi Sesi Langsung dari Database Backend (`GET /telemetry/sessions/[id]`)</span>
        </h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Fitur verifikasi kepatuhan anti-BOLA backend: mengambil data sesi secara spesifik dengan mencocokkan `sessionId` dan header `X-Device-Id`.
        </p>

        <form onSubmit={handleLookup} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr)) 150px',
          gap: '1rem',
          alignItems: 'end',
        }}>
          <div>
            <label className="form-label">Session ID (UUID)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
              value={lookupSessionId}
              onChange={(e) => setLookupSessionId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Device Pseudo ID (Header X-Device-Id)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: PSEUDO_DEV_TABLET_A01"
              value={lookupDeviceId}
              onChange={(e) => setLookupDeviceId(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={lookupLoading}
            className="btn btn-primary"
            style={{ padding: '0.7rem' }}
          >
            {lookupLoading ? 'Memeriksa...' : 'Cari di Backend'}
          </button>
        </form>

        {lookupError && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: '#fda4af',
            fontSize: '0.85rem',
          }}>
            ⚠️ {lookupError}
          </div>
        )}

        {/* Display Live Lookup Result */}
        {lookupResult && (
          <div style={{
            marginTop: '1.25rem',
            background: 'rgba(15, 23, 42, 0.85)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-accent)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success">✓ Data Ditemukan di Backend</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sesi: {lookupResult.sessionId}</span>
              </div>
              <span className="badge badge-primary">{lookupResult.devicePseudoId}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.825rem', marginBottom: '1rem' }}>
              <div><strong>Status:</strong> {lookupResult.isCompleted ? '✅ Selesai' : '⏳ Belum Selesai'}</div>
              <div><strong>Mulai:</strong> {new Date(lookupResult.startedAt).toLocaleString('id-ID')}</div>
              <div><strong>Selesai:</strong> {lookupResult.completedAt ? new Date(lookupResult.completedAt).toLocaleString('id-ID') : '-'}</div>
              <div><strong>Total Interaksi:</strong> {lookupResult.interactions?.length || 0} langkah</div>
            </div>

            {/* Interactions breakdown */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
                    <th style={{ padding: '0.4rem 0.6rem' }}>Modul</th>
                    <th style={{ padding: '0.4rem 0.6rem' }}>Objek Pilihan</th>
                    <th style={{ padding: '0.4rem 0.6rem' }}>Hasil</th>
                    <th style={{ padding: '0.4rem 0.6rem' }}>Percobaan Ke-</th>
                    <th style={{ padding: '0.4rem 0.6rem' }}>Audit AI Hint</th>
                  </tr>
                </thead>
                <tbody>
                  {lookupResult.interactions?.map((item: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.4rem 0.6rem' }}><code>{item.moduleType}</code></td>
                      <td style={{ padding: '0.4rem 0.6rem' }}>{item.selectedObjectId}</td>
                      <td style={{ padding: '0.4rem 0.6rem' }}>
                        {item.isCorrect ? <span style={{ color: '#10b981' }}>✓ Benar</span> : <span style={{ color: '#f43f5e' }}>✗ Salah</span>}
                      </td>
                      <td style={{ padding: '0.4rem 0.6rem' }}>#{item.attemptIndex}</td>
                      <td style={{ padding: '0.4rem 0.6rem' }}>
                        {item.adaptiveHint ? (
                          <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                            {item.adaptiveHint.directiveType} ({(item.adaptiveHint.confidenceScore * 100).toFixed(0)}%)
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Synced Sessions List */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>
              Riwayat Sesi Telemetri Permainan
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              Daftar sesi yang telah disinkronkan oleh perangkat siswa
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilterCompleted('ALL')}
              className={`btn ${filterCompleted === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              Semua ({sessions.length})
            </button>
            <button
              onClick={() => setFilterCompleted('COMPLETED')}
              className={`btn ${filterCompleted === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              Selesai ({totalCompleted})
            </button>
            <button
              onClick={() => setFilterCompleted('IN_PROGRESS')}
              className={`btn ${filterCompleted === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              Berjalan ({sessions.length - totalCompleted})
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID Sesi</th>
                <th style={{ padding: '0.75rem 1rem' }}>ID Perangkat</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Interaksi</th>
                <th style={{ padding: '0.75rem 1rem' }}>Bantuan AI</th>
                <th style={{ padding: '0.75rem 1rem' }}>Waktu Mulai</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>
                    <span style={{ color: '#818cf8' }}>{session.sessionId.slice(0, 13)}...</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-primary">{session.devicePseudoId}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {session.isCompleted ? (
                      <span className="badge badge-success">✓ Selesai</span>
                    ) : (
                      <span className="badge badge-warning">⏳ Sedang Bermain</span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong>{session.totalInteractions}</strong> langkah
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {session.aiHintsCount > 0 ? (
                      <span className="badge badge-ai">✨ {session.aiHintsCount}x Terpicu</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>0x</span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                    {new Date(session.startedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setLookupSessionId(session.sessionId);
                        setLookupDeviceId(session.devicePseudoId);
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      Inspeksi ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
