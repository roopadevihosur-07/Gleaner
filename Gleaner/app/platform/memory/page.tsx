'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, SectionHead, Btn, Alert, Loader, SeverityPill } from '@/components/ui';

export default function MemoryPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [query, setQuery] = useState({ category: '', type: '' });
  const [similar, setSimilar] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => { api.incidents().then(setData).catch(() => {}); }, []);

  async function search() {
    if (!query.category) return;
    setSearching(true);
    try {
      const r = await fetch(`http://localhost:8000/api/memory/similar?category=${query.category}&type=${query.type || 'supply_cut'}`);
      const j = await r.json();
      setSimilar(j.similar);
    } catch { setSimilar([]); }
    finally { setSearching(false); }
  }

  const CATS = ['protein', 'produce', 'dairy', 'shelf_stable'];
  const TYPES = ['supply_cut', 'route_disruption', 'vendor_failure', 'weather_delay'];

  // derive category and strategy breakdown from incidents
  const incidents = data?.incidents || [];
  const catCounts: Record<string, number> = {};
  const stratCounts: Record<string, number> = {};
  let totalMeals = 0;
  for (const i of incidents) {
    catCounts[i.category] = (catCounts[i.category] || 0) + 1;
    if (i.chosen_strategy) stratCounts[i.chosen_strategy] = (stratCounts[i.chosen_strategy] || 0) + 1;
    totalMeals += i.meals_protected || 0;
  }
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
  const topStrat = Object.entries(stratCounts).sort((a, b) => b[1] - a[1])[0];

  const SEV_COLORS: Record<string, string> = { critical: '#7a1e1e', high: '#7a4512', medium: '#3a4e12', low: '#12394e' };

  return (
    <div>
      <SectionHead step="6" title="Incident memory" sub="Every disruption Gleaner handles is timestamped and stored. When a new shock matches a past pattern, memory surfaces the proven fix — making every response faster than the last." />

      {!data ? <Loader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Stats */}
          <Card style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              ['Total incidents', incidents.length, '#007afc'],
              ['Meals protected', totalMeals.toLocaleString(), '#228a56'],
              ['Most disrupted', topCat?.[0] || '—', '#e67e22'],
              ['Top strategy', topStrat?.[0] || '—', '#8b57de'],
            ].map(([label, val, color]) => (
              <div key={label as string} style={{ textAlign: 'center', padding: '20px 16px', borderRight: '1px solid #1c1f24' }}>
                <div style={{ fontSize: 10, color: '#566171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: color as string, lineHeight: 1 }}>{val}</div>
              </div>
            ))}
          </Card>

          {/* Recall search */}
          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 15, fontWeight: 700 }}>🧠 Recall similar incidents</h3>
            <p style={{ color: '#566171', fontSize: 13, margin: '0 0 16px' }}>Query memory before triggering a new simulation — see how Gleaner solved the same problem last time.</p>
            <label style={{ fontSize: 11, color: '#8b96aa', display: 'block', marginBottom: 4 }}>Category</label>
            <select value={query.category} onChange={e => setQuery({ ...query, category: e.target.value })}
              style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '8px 12px', color: '#fff', marginBottom: 12 }}>
              <option value="">— pick one —</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={{ fontSize: 11, color: '#8b96aa', display: 'block', marginBottom: 4 }}>Issue type</label>
            <select value={query.type} onChange={e => setQuery({ ...query, type: e.target.value })}
              style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '8px 12px', color: '#fff', marginBottom: 16 }}>
              {TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
            <Btn onClick={search} disabled={!query.category || searching}>{searching ? 'Searching…' : '🔍 Search memory'}</Btn>

            {similar !== null && (
              <div style={{ marginTop: 16, borderTop: '1px solid #1c1f24', paddingTop: 14 }}>
                {similar.length === 0
                  ? <div style={{ color: '#566171', fontSize: 13 }}>No similar incidents found yet — run more simulations.</div>
                  : similar.map((inc: any) => (
                    <div key={inc.id} style={{ padding: '10px 0', borderBottom: '1px solid #1c1f24' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{inc.id}</span>
                        <SeverityPill s={inc.severity || 'medium'} />
                      </div>
                      <div style={{ fontSize: 12, color: '#8b96aa' }}>
                        Strategy used: <span style={{ color: '#228a56', fontWeight: 600 }}>{inc.chosen_strategy}</span> ·
                        Vendors: {inc.chosen_vendors?.join(', ')} ·
                        Meals: <span style={{ color: '#228a56' }}>{inc.meals_protected?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </Card>

          {/* Timeline */}
          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>📅 Incident timeline</h3>
            {incidents.length === 0 && <div style={{ color: '#566171', fontSize: 13 }}>No incidents yet.</div>}
            <div style={{ position: 'relative' }}>
              {incidents.map((inc: any, i: number) => (
                <div key={inc.id} style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}>
                  {/* Vertical line */}
                  {i < incidents.length - 1 && (
                    <div style={{ position: 'absolute', left: 11, top: 22, width: 2, height: 'calc(100% - 6px)', background: '#1c1f24' }} />
                  )}
                  {/* Dot */}
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                    background: SEV_COLORS[inc.severity] || '#1c1f24',
                    border: inc.status === 'resolved' ? '2px solid #228a56' : '2px solid #333943',
                    display: 'grid', placeItems: 'center', fontSize: 9, color: '#fff', fontWeight: 700,
                  }}>{inc.severity?.[0]?.toUpperCase()}</div>
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{inc.id}</span>
                      <span style={{ fontSize: 10, color: '#566171' }}>{new Date(inc.created_at).toLocaleDateString()}</span>
                      {inc.status === 'resolved' && <span style={{ fontSize: 10, color: '#228a56', fontWeight: 700 }}>✓ RESOLVED</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#8b96aa' }}>
                      {inc.category} · {inc.type?.replace(/_/g, ' ')} · {inc.shortfall_lbs?.toLocaleString()} lbs short
                    </div>
                    <div style={{ fontSize: 12, color: '#566171', marginTop: 2 }}>
                      {inc.chosen_strategy} via {inc.chosen_vendors?.join(', ')} · {inc.meals_protected?.toLocaleString()} meals
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* What memory enables */}
          <Card style={{ gridColumn: '1 / -1', background: '#001228', border: '1px solid #1a3050' }}>
            <h3 style={{ color: '#007afc', margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>How Gleaner uses this memory</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                ['🎯 Pattern match', 'When a new disruption arrives, Gleaner finds past incidents with the same category and type — surfacing proven vendors and strategies immediately.'],
                ['⚡ Faster recovery', 'The more incidents in memory, the more confident the recommendation. A vendor that performed at 95% OTIF last time rises in the ranking.'],
                ['📊 Trend detection', 'Repeated shortfalls in the same category signal a structural problem — not a one-off. Memory makes this visible before it becomes a crisis.'],
              ].map(([title, body]) => (
                <div key={title as string}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{title}</div>
                  <div style={{ color: '#8b96aa', fontSize: 12, lineHeight: 1.6 }}>{body}</div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
            <Btn onClick={() => router.push('/platform/simulate')}>Run another simulation →</Btn>
            <Btn variant="secondary" onClick={() => router.push('/')}>Back to landing</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
