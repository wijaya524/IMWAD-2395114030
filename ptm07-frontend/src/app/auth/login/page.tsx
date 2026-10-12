'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      if (res.status === 'SUCCESS' && res.data) {
        authStorage.setAuth(res.data.tokens, res.data.user);
        router.push('/dashboard');
      } else {
        setErrorMsg(res.message || 'Email atau kata sandi tidak sesuai');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('guru@sekolah.sch.id');
    setPassword('Password123#');
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '3.5rem auto',
      padding: '0 1.5rem',
    }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px var(--primary-glow)',
          }}>
            🔐
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            Portal Masuk Guru
          </h2>
          <p style={{ fontSize: '0.875rem' }}>
            Masuk untuk memantau data sesi dan hasil belajar siswa
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Alamat Email Guru</label>
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
            <label className="form-label">Kata Sandi</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Memvalidasi kredensial...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        {/* Demo button helper */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.55rem', fontSize: '0.8rem' }}
          >
            💡 Isi Contoh Akun Cepat
          </button>
        </div>

        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
        }}>
          Belum memiliki akun guru?{' '}
          <Link href="/auth/register" style={{ color: '#818cf8', fontWeight: 600 }}>
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
