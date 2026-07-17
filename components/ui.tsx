'use client';
import React from 'react';

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#15171b', border: '1px solid #1c1f24', borderRadius: 16,
      padding: '24px', ...style,
    }}>
      {children}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
export function SectionHead({ step, title, sub }: { step: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#007afc', marginBottom: 6 }}>
        Step {step}
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{title}</h1>
      <p style={{ fontSize: 15, color: '#8b96aa', margin: 0 }}>{sub}</p>
    </div>
  );
}

// ── Pill / badge ──────────────────────────────────────────────────────────────
const SEVERITY_COLOR: Record<string, string> = {
  critical: '#7a1e1e', high: '#7a4512', medium: '#3a4e12', low: '#12394e', ok: '#12394e',
};
const STATUS_COLOR: Record<string, string> = {
  ok: '#12394e', failed: '#7a1e1e', alternate: '#1a4e2e', standby: '#2d3040',
};
export function Pill({ label, color }: { label: string; color?: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 100, fontSize: 11,
      fontWeight: 700, background: color || '#1c1f24', color: '#fff', textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>{label}</span>
  );
}
export function SeverityPill({ s }: { s: string }) {
  return <Pill label={s} color={SEVERITY_COLOR[s] || '#1c1f24'} />;
}
export function StatusPill({ s }: { s: string }) {
  return <Pill label={s} color={STATUS_COLOR[s] || '#1c1f24'} />;
}

// ── Stat box ──────────────────────────────────────────────────────────────────
export function Stat({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 16px' }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#566171', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: accent || '#007afc', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#566171', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, disabled, variant = 'primary', style }:
  { children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' | 'danger'; style?: React.CSSProperties }) {
  const bg = variant === 'primary' ? '#007afc' : variant === 'danger' ? '#c0392b' : 'transparent';
  const border = variant === 'secondary' ? '1px solid #566171' : 'none';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? '#1c1f24' : bg, color: disabled ? '#566171' : '#fff',
      border, borderRadius: 100, padding: '10px 22px', fontWeight: 700, fontSize: 14,
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity .2s', ...style,
    }}>
      {children}
    </button>
  );
}

// ── Alert banner ──────────────────────────────────────────────────────────────
export function Alert({ msg, type = 'error' }: { msg: string; type?: 'error' | 'info' | 'success' }) {
  const bg = type === 'error' ? '#7a1e1e' : type === 'success' ? '#1a4e2e' : '#1a3050';
  return (
    <div style={{ background: bg, border: '1px solid', borderColor: type === 'error' ? '#c0392b' : type === 'success' ? '#27ae60' : '#2980b9', borderRadius: 10, padding: '12px 18px', fontSize: 13, color: '#fff', marginBottom: 20 }}>
      {msg}
    </div>
  );
}

// ── SVG supply-chain graph ────────────────────────────────────────────────────
export function GraphViz({ data }: { data: any }) {
  if (!data?.nodes?.length) return <div style={{ color: '#566171', textAlign: 'center', padding: 40 }}>No graph data</div>;

  const W = 760, H = 400;
  const NODE_COLORS: Record<string, string> = {
    supplier: '#0062ca', vendor: '#23262d', depot: '#007afc', customer: '#228a56',
  };
  const EDGE_COLORS: Record<string, string> = {
    ok: '#333943', failed: '#c0392b', alternate: '#228a56', standby: '#23262d',
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {/* edges first */}
      {data.edges.map((e: any, i: number) => {
        const from = data.nodes.find((n: any) => n.id === e.from);
        const to = data.nodes.find((n: any) => n.id === e.to);
        if (!from || !to) return null;
        const fx = from.x * W, fy = from.y * H, tx = to.x * W, ty = to.y * H;
        const stroke = EDGE_COLORS[e.status] || '#333943';
        const dash = e.status === 'standby' ? '6 4' : e.status === 'failed' ? '4 4' : '';
        return (
          <g key={i}>
            <line x1={fx} y1={fy} x2={tx} y2={ty}
              stroke={stroke} strokeWidth={e.status === 'alternate' ? 2.5 : e.status === 'failed' ? 2 : 1.5}
              strokeDasharray={dash} opacity={e.status === 'standby' ? 0.35 : 0.85} />
            {e.status === 'alternate' && (
              <polygon points={`${tx - 5},${ty - 4} ${tx + 4},${ty} ${tx - 5},${ty + 4}`}
                fill="#228a56" transform={`rotate(${Math.atan2(ty - fy, tx - fx) * 180 / Math.PI}, ${tx}, ${ty})`} />
            )}
          </g>
        );
      })}
      {/* nodes */}
      {data.nodes.map((n: any) => {
        const x = n.x * W, y = n.y * H;
        const r = n.kind === 'depot' ? 14 : 10;
        return (
          <g key={n.id}>
            <circle cx={x} cy={y} r={r} fill={NODE_COLORS[n.kind] || '#333'} />
            {n.kind === 'depot' && <circle cx={x} cy={y} r={r + 4} fill="none" stroke="#007afc" strokeWidth={1.5} opacity={0.4} />}
            <text x={x + r + 4} y={y + 4} fontSize={9} fill="#a0aaba"
              style={{ dominantBaseline: 'middle', textAnchor: 'start' }}>
              {(n.label || n.id).slice(0, 22)}
            </text>
          </g>
        );
      })}
      {/* legend */}
      {[['ok', 'Active'], ['failed', 'Failed'], ['alternate', 'Alternate'], ['standby', 'Standby']].map(([k, l], i) => (
        <g key={k} transform={`translate(${12 + i * 95}, ${H - 16})`}>
          <line x1={0} y1={0} x2={20} y2={0} stroke={EDGE_COLORS[k]} strokeWidth={2} strokeDasharray={k === 'standby' ? '5 3' : ''} />
          <text x={24} y={4} fontSize={9} fill="#566171">{l}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Loader spinner ────────────────────────────────────────────────────────────
export function Loader({ msg = 'Loading…' }: { msg?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: 60, color: '#566171' }}>
      <div style={{
        width: 36, height: 36, border: '3px solid #1c1f24', borderTopColor: '#007afc',
        borderRadius: '50%', margin: '0 auto 16px',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      <div>{msg}</div>
    </div>
  );
}
