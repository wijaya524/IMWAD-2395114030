import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daily Life Edu - Game Edukasi Bina Diri Tunagrahita & Telemetri AI',
  description: 'Frontend aplikasi edukasi rutinitas bina diri anak tunagrahita dengan sistem evaluasi keputusan (Decision Tree) dan bimbingan adaptif AI (PTM-07). Terhubung dengan API backend PTM-06.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <footer style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            background: 'rgba(11, 15, 25, 0.95)',
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <strong>Daily Life Education Platform (PTM-07)</strong> • Terintegrasi dengan Next.js Backend (PTM-06)
              </div>
              <div>
                Teknologi: Next.js App Router • RESTful OpenAPI • AI Adaptive Guidance System
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
