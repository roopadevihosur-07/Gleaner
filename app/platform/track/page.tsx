'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, SectionHead, Btn, Alert, Loader, Stat, SeverityPill } from '@/components/ui';

const STATUS_NEXT: Record<string, string> = {
  dispatched: 'in_progress', in_progress: 'resolved',
};
const STATUS_LABEL: Record<string, string> = {
  dispatched: '📡 Mark in progress', in_progress: '✅ Mark resolved',
};
const STATUS_COLOR: Record<string, string> = {
  dispatched: '#1a3050', in_progress: '#3a4e12', resolved: '#1a4e2e',
};

export default function TrackPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const load = useCallback(async () => {
    try { setData(await api.incidents()); }
    catch { setMsg({ text: 'Backend unreachable', type: 'error' }); }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, [load]);

  async function advance(id: string, current: string) {
    const next = STATUS_NEXT[current];
    if (!next) return;
    setUpdating(id);
    try {
      await api.setStatus(id, next);
      setMsg({ text: `✓ ${id} → ${next}`, type: 'success' });
      await load();
    } catch { setMsg({ text: 'Update failed', type: 'error' }); }
    finally { setUpdating(null); }
  }

  if (!data) return <Loader msg="Loading incident tracker…" />;

  const { incidents, metrics } = data;
  const shown = incidents.filter((i: any) =>
    filter === 'all' ? true : filter === 'open' ? i.status !== 'resolved' : i.status === 'resolved'
  );

  return (
    <div>
      <SectionHead step="5" title="Admin — incident tracker" sub="Monitor live disruptions, advance status, and verify every recovery is working. Auto-refreshes every 8 s." />
      {msg && <Alert msg={msg.text} type={msg.type} />}

      {/* KPI bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total incidents', value: metrics.total, accent: '#007afc' },
          { label: 'Open', value: metrics.open, accent: '#e67e22' },
          { label: 'Resolved', value: metrics.resolved, accent: '#228a56' },
          { label: 'Meals protected', value: metrics.meals_protected_total?.toLocaleString(), accent: '#228a56' },
        ].map(s => (
          <Card key={s.label} style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#566171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.accent }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'open', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: filter === f ? '#007afc' : '#1c1f24', color: '#fff', border: 'none',
          }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
        <button onClick={load} style={{ marginLeft: 'auto', padding: '7px 16px', borderRadius: 100, fontSize: 13, background: '#1c1f24', color: '#a0aaba', border: 'none', cursor: 'pointer' }}>↻ Refresh</button>
      </div>

      {/* Incident table */}
      {shown.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 48, color: '#566171' }}>
          No incidents yet. <button onClick={() => router.push('/platform/simulate')} style={{ color: '#007afc', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Simulate one →</button>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map((inc: any) => (
          <Card key={inc.id} style={{ background: STATUS_COLOR[inc.status] || '#15171b' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{inc.id}</span>
                  <SeverityPill s={inc.severity || 'medium'} />
                  <span style={{ background: '#1c1f24', borderRadius: 100, padding: '2px 10px', fontSize: 11, color: '#a0aaba', textTransform: 'uppercase', fontWeight: 700 }}>{inc.status}</span>
                  <span style={{ color: '#566171', fontSize: 12 }}>{new Date(inc.created_at).toLocaleString()}</span>
                </div>
                {/* Details */}
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 12 }}>
                  {[
                    ['Category', inc.category],
                    ['Type', inc.type?.replace(/_/g, ' ')],
                    ['Shortfall', `${inc.shortfall_lbs?.toLocaleString()} lbs`],
                    ['Strategy', inc.chosen_strategy],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: '#566171', textTransform: 'uppercase' }}>{k}</div>
                      <div style={{ color: '#a0aaba', fontSize: 13, fontWeight: 600 }}>{v || '—'}</div>
                    </div>
                  ))}
                </div>
                {/* Worker instructions preview */}
                {inc.worker_instructions?.length > 0 && (
                  <div style={{ fontSize: 12, color: '#566171', borderTop: '1px solid #ffffff14', paddingTop: 10 }}>
                    <span style={{ color: '#8b96aa', fontWeight: 600 }}>Instructions: </span>
                    {inc.worker_instructions[0]}
                    {inc.worker_instructions.length > 1 && <span> (+{inc.worker_instructions.length - 1} more)</span>}
                  </div>
                )}
              </div>

              {/* Action column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#566171' }}>Meals protected</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#228a56' }}>{inc.meals_protected?.toLocaleString()}</div>
                </div>
                {inc.status !== 'resolved' && (
                  <Btn onClick={() => advance(inc.id, inc.status)} disabled={updating === inc.id} variant={inc.status === 'in_progress' ? 'primary' : 'secondary'} style={{ fontSize: 12, padding: '8px 14px' }}>
                    {updating === inc.id ? 'Updating…' : STATUS_LABEL[inc.status]}
                  </Btn>
                )}
                {inc.resolved_at && (
                  <div style={{ fontSize: 11, color: '#566171' }}>Resolved: {new Date(inc.resolved_at).toLocaleString()}</div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Btn variant="secondary" onClick={() => router.push('/platform/memory')}>View full memory →</Btn>
      </div>
    </div>
  );
}
