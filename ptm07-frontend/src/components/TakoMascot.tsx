'use client';

import React from 'react';

export type TakoMood = 'NORMAL' | 'THINKING' | 'HAPPY' | 'ENCOURAGING' | 'EXCITED' | 'ADAPTIVE';

interface TakoMascotProps {
  dialog: string;
  mood?: TakoMood;
  isAiActive?: boolean;
}

export default function TakoMascot({
  dialog,
  mood = 'NORMAL',
  isAiActive = false,
}: TakoMascotProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.25rem',
      padding: '1.25rem',
      background: 'rgba(23, 28, 45, 0.7)',
      backdropFilter: 'blur(16px)',
      border: isAiActive ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: isAiActive ? '0 0 24px rgba(245, 158, 11, 0.25)' : 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background glow if AI active */}
      {isAiActive && (
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Mascot Avatar Figure */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div
          className={mood === 'THINKING' ? 'animate-pulse-glow' : 'animate-tako-bounce'}
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* SVG Cat Character with Glasses */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ears */}
            <path d="M14 22L20 8L28 18" fill="#d97706" />
            <path d="M16 20L21 11L26 17" fill="#fef3c7" />
            <path d="M50 22L44 8L36 18" fill="#d97706" />
            <path d="M48 20L43 11L38 17" fill="#fef3c7" />
            
            {/* Head */}
            <ellipse cx="32" cy="34" rx="22" ry="18" fill="#fef08a" />
            
            {/* Glasses */}
            <rect x="18" y="27" width="12" height="10" rx="3" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
            <rect x="34" y="27" width="12" height="10" rx="3" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
            <line x1="30" y1="32" x2="34" y2="32" stroke="#312e81" strokeWidth="2" />
            
            {/* Eyes inside glasses */}
            {mood === 'HAPPY' || mood === 'EXCITED' ? (
              <>
                <path d="M21 33C21 31 27 31 27 33" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M37 33C37 31 43 31 43 33" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : mood === 'THINKING' ? (
              <>
                <circle cx="24" cy="31" r="2.5" fill="#f59e0b" />
                <circle cx="40" cy="31" r="2.5" fill="#f59e0b" />
              </>
            ) : (
              <>
                <circle cx="24" cy="32" r="2" fill="#38bdf8" />
                <circle cx="40" cy="32" r="2" fill="#38bdf8" />
              </>
            )}

            {/* Nose & Mouth */}
            <polygon points="32,39 30,37 34,37" fill="#f43f5e" />
            <path d="M30 40Q32 43 34 40" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            
            {/* Cheeks */}
            <circle cx="16" cy="37" r="3" fill="#fda4af" opacity="0.6" />
            <circle cx="48" cy="37" r="3" fill="#fda4af" opacity="0.6" />
          </svg>

          {/* AI Sparkle badge */}
          {isAiActive && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#8b5cf6',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              boxShadow: '0 0 10px #8b5cf6',
            }}>
              ✨
            </span>
          )}
        </div>

        <span style={{
          marginTop: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#fbbf24',
          letterSpacing: '0.04em',
        }}>
          TAKO 🐾
        </span>
      </div>

      {/* Speech Bubble */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.4rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Pemandu Tako
            </span>
            {isAiActive ? (
              <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
                💡 Bimbingan Adaptif Aktif
              </span>
            ) : mood === 'HAPPY' ? (
              <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                🎉 Jawaban Tepat!
              </span>
            ) : mood === 'THINKING' ? (
              <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                🤔 Mengingat Pola Belajar...
              </span>
            ) : (
              <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                Pemandu Ramah
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Suara Panduan • Auto
          </span>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          position: 'relative',
        }}>
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.55,
            color: isAiActive ? '#fef3c7' : '#f8fafc',
            fontWeight: 500,
          }}>
            {dialog}
          </p>
        </div>
      </div>
    </div>
  );
}
