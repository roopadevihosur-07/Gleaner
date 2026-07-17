'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/platform/connect',  label: 'Connect',  step: '1', desc: 'Ingest live data' },
  { href: '/platform/risk',     label: 'Risk',     step: '2', desc: 'Configure thresholds' },
  { href: '/platform/simulate', label: 'Simulate', step: '3', desc: 'Trigger disruption' },
  { href: '/platform/solve',    label: 'Solve',    step: '4', desc: 'Choose & dispatch' },
  { href: '/platform/track',    label: 'Track',    step: '5', desc: 'Admin view' },
  { href: '/platform/memory',   label: 'Memory',   step: '6', desc: 'Past incidents' },
];

export default function PlatformNav() {
  const path = usePathname();
  const current = LINKS.findIndex(l => path?.startsWith(l.href));

  return (
    <nav style={{
      background: '#0e1012',
      borderBottom: '1px solid #1c1f24',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 32, borderRight: '1px solid #1c1f24', marginRight: 24, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#007afc', borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>G</div>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Gleaner</span>
        </Link>

        <div style={{ display: 'flex', flex: 1, overflowX: 'auto' }}>
          {LINKS.map((l, i) => {
            const active = path?.startsWith(l.href);
            const done = i < current;
            return (
              <Link key={l.href} href={l.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '16px 20px', textDecoration: 'none', whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid #007afc' : '2px solid transparent',
                transition: 'border-color .2s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: active ? '#007afc' : done ? '#228a56' : '#1c1f24',
                  color: '#fff',
                }}>
                  {done ? '✓' : l.step}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#a0aaba' }}>{l.label}</div>
                  <div style={{ fontSize: 10, color: '#566171' }}>{l.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <Link href="/platform/connect" style={{
          marginLeft: 16, padding: '8px 18px', background: '#007afc', color: '#fff',
          borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          Launch →
        </Link>
      </div>
    </nav>
  );
}
