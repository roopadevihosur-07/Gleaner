import PlatformNav from '@/components/PlatformNav';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0e1012', minHeight: '100vh', color: '#a0aaba' }}>
      <PlatformNav />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {children}
      </main>
    </div>
  );
}
