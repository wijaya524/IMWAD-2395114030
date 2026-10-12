'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEACHER');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 8) {
      setErrorMsg('Kata sandi minimal harus 8 karakter');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.signup(name, email, password, role);
      if (res.status === 'SUCCESS') {
        setSuccessMsg('Registrasi akun guru berhasil! Mengarahkan ke halaman login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Gagal melakukan pendaftaran akun');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '3rem auto',
      padding: '0 1.5rem',
    }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px var(--primary-glow)',
          }}>
            👩‍🏫
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            Daftar Akun Guru
          </h2>
          <p style={{ fontSize: '0.875rem' }}>
            Portal pendamping dan monitoring evaluasi belajar siswa
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: '#fda4af',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: '#6ee7b7',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}>
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap Guru / Pendamping</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Ibu Siti Rahayu, S.Pd"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="nama@sekolah.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi (Minimal 8 Karakter)</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Peran Pengguna</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="TEACHER">Guru Pendamping (TEACHER)</option>
              <option value="ADMIN">Administrator Sistem (ADMIN)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.75rem' }}
          >
            {loading ? 'Mendaftarkan akun...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
        }}>
          Sudah memiliki akun terdaftar?{' '}
          <Link href="/auth/login" style={{ color: '#818cf8', fontWeight: 600 }}>
            Masuk ke Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
