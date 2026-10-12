'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authStorage, AuthUser } from '@/lib/auth';
import { checkBackendHealth } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    const online = await checkBackendHealth();
    setBackendOnline(online);
    setChecking(false);
  };

  useEffect(() => {
    setUser(authStorage.getUser());

    const handleAuthChange = () => {
      setUser(authStorage.getUser());
    };

    window.addEventListener('auth_state_change', handleAuthChange);
    checkStatus();

    const interval = setInterval(checkStatus, 15000);
    return () => {
      window.removeEventListener('auth_state_change', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    authStorage.clear();
    router.push('/auth/login');
  };

  const navLinks = [
    { href: '/', label: 'Beranda', icon: '🏠' },
    { href: '/game', label: 'Main Game', icon: '🎮' },
    { href: '/dashboard', label: 'Dashboard Guru', icon: '📊' },
    { href: '/telemetry-tester', label: 'API Tester', icon: '🧪' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
          }}>
            🐱
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                Daily Life Edu
              </span>
              <span className="badge badge-ai" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                AI Adaptive
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Game Bina Diri Tunagrahita • PTM-07
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-glass-hover)' : 'transparent',
                  border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Backend Status & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Backend Status Badge */}
          <button
            onClick={checkStatus}
            title="Klik untuk cek ulang koneksi backend ptm06-backend (port 3000)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: backendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              color: backendOnline ? '#6ee7b7' : '#fda4af',
              border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendOnline ? '#10b981' : '#f43f5e',
              boxShadow: backendOnline ? '0 0 8px #10b981' : '0 0 8px #f43f5e',
              animation: checking ? 'pulseGlow 1s infinite' : 'none',
            }} />
            <span>
              {backendOnline === null ? 'Cek API...' : backendOnline ? 'Backend Aktif' : 'Backend Offline'}
            </span>
          </button>

          {/* User Auth Info */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                lineHeight: 1.2,
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                title="Keluar akun"
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href="/auth/login" className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}>
                Masuk
              </Link>
              <Link href="/auth/register" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}>
                Daftar Guru
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
