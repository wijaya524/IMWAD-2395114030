'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'primary' | 'ai';
  };
  accentColor?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  accentColor = '#6366f1',
}: MetricCardProps) {
  const getBadgeClass = (variant: string) => {
    switch (variant) {
      case 'success': return 'badge-success';
      case 'warning': return 'badge-warning';
      case 'danger': return 'badge-danger';
      case 'ai': return 'badge-ai';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: accentColor,
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: `rgba(${accentColor === '#6366f1' ? '99, 102, 241' : accentColor === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.35rem',
          border: '1px solid var(--border-subtle)',
        }}>
          {icon}
        </div>
        {badge && (
          <span className={`badge ${getBadgeClass(badge.variant)}`}>
            {badge.text}
          </span>
        )}
      </div>

      <div style={{
        fontSize: '0.825rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.25rem',
      }}>
        {title}
      </div>

      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.85rem',
        fontWeight: 800,
        color: 'var(--text-primary)',
        lineHeight: 1.15,
        marginBottom: subtitle ? '0.35rem' : 0,
      }}>
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
