'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, handoff } from '@/lib/api';
import { Card, SectionHead, Btn, Alert, Loader, Stat, SeverityPill, GraphViz } from '@/components/ui';

const PRESETS = [
  { label: 'USDA TEFAP cut — protein', commitment_id: 'TEFAP-1042', type: 'supply_cut', emoji: '🇺🇸' },
  { label: 'Donor produce short-ship', commitment_id: 'DON-Safeway-88', type: 'supply_cut', emoji: '🥦' },
  { label: 'Sysco dairy delay', commitment_id: 'PO-Sysco-231', type: 'route_disruption', emoji: '🥛' },
  { label: 'Custom shortage…', commitment_id: null, type: 'supply_cut', emoji: '⚙️' },
];

export default function SimulatePage() {
  const router = useRouter();
  const [preset, setPreset] = useState<number | null>(null);
  const [custom, setCustom] = useState({ category: 'protein', lost_lbs: 10000, type: 'supply_cut' });
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [graphOnly, setGraphOnly] = useState<any>(null);

  useEffect(() => { api.graph().then(setGraphOnly).catch(() => {}); }, []);

  async function simulate() {
    setRunning(true); setMsg(null); setResult(null);
    const p = preset !== null ? PRESETS[preset] : null;
    try {
      const body = p?.commitment_id
        ? { commitment_id: p.commitment_id, type: p.type }
        : { category: custom.category, lost_lbs: custom.lost_lbs, type: custom.type };
      const r = await api.simulate(body);
      setResult(r);
    } catch (e: any) { setMsg('Simulate failed — is the backend running?'); }
    finally { setRunning(false); }
  }

  function proceed() {
    if (!result) return;
    const sol = result.solutions?.find((s: any) => s.recommended) || result.solutions?.[0];
    handoff.set('simulate_result', { issue: result.issue, solutions: result.solutions, graph: result.graph });
    router.push('/platform/solve');
  }

  const SEV_COLOR: Record<string, string> = { critical: '#c0392b', high: '#e67e22', medium: '#f1c40f', low: '#27ae60' };
  const CATS = ['protein', 'produce', 'dairy', 'shelf_stable'];
  const TYPES = ['supply_cut', 'route_disruption', 'vendor_failure', 'weather_delay'];

  return (
    <div>
      <SectionHead step="3" title="Simulate a disruption" sub="Trigger a real supply-chain shock and watch Gleaner detect, score, and map the failure through your network." />
      {msg && <Alert msg={msg} />}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Choose a disruption</h3>
            {PRESETS.map((p, i) => (
              <div key={i} onClick={() => setPreset(i)}
                style={{
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer', marginBottom: 8,
                  border: `1px solid ${preset === i ? '#007afc' : '#1c1f24'}`,
                  background: preset === i ? '#001e40' : '#0e1012',
                }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{p.emoji}</span>
                  <div>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                    <div style={{ color: '#566171', fontSize: 11 }}>{p.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {preset === PRESETS.length - 1 && (
            <Card>
              <h3 style={{ color: '#fff', margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>Custom disruption</h3>
              <label style={{ fontSize: 11, color: '#8b96aa', display: 'block', marginBottom: 4 }}>Category</label>
              <select value={custom.category} onChange={e => setCustom({ ...custom, category: e.target.value })}
                style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '8px 12px', color: '#fff', marginBottom: 12 }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label style={{ fontSize: 11, color: '#8b96aa', display: 'block', marginBottom: 4 }}>Lost lbs</label>
              <input type="number" value={custom.lost_lbs} onChange={e => setCustom({ ...custom, lost_lbs: +e.target.value })}
                style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '8px 12px', color: '#fff', marginBottom: 12, boxSizing: 'border-box' }} />
              <label style={{ fontSize: 11, color: '#8b96aa', display: 'block', marginBottom: 4 }}>Type</label>
              <select value={custom.type} onChange={e => setCustom({ ...custom, type: e.target.value })}
                style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '8px 12px', color: '#fff' }}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Card>
          )}

          <Btn onClick={simulate} disabled={preset === null || running}>
            {running ? '⏳ Analysing…' : '🔴 Trigger disruption'}
          </Btn>
        </div>

        {/* Graph + results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>
              Supply-chain graph {result ? '— failure mapped' : '— live state'}
            </h3>
            {running && <Loader msg="Sensing disruption…" />}
            {!running && <GraphViz data={result?.graph || graphOnly} />}
          </Card>

          {result && (
            <>
              {/* Issue summary */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                      <h3 style={{ color: '#fff', margin: 0, fontSize: 16, fontWeight: 700 }}>{result.issue.id}</h3>
                      <SeverityPill s={result.issue.severity} />
                    </div>
                    <div style={{ fontSize: 13, color: '#8b96aa' }}>
                      {result.issue.type} · {result.issue.category} · {result.issue.lost_lbs?.toLocaleString()} lbs lost
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <Stat label="Shortfall" value={`${result.issue.shortfall_lbs?.toLocaleString()} lbs`} accent="#c0392b" />
                  <Stat label="Meals at risk" value={result.issue.meals_at_risk?.toLocaleString()} accent="#e67e22" />
                  <Stat label="Shortfall %" value={`${result.issue.shortfall_pct}%`} accent={SEV_COLOR[result.issue.severity]} />
                </div>
                <div style={{ marginTop: 16, borderTop: '1px solid #1c1f24', paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: '#566171', marginBottom: 8 }}>Affected agencies (priority order)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.issue.affected?.map((a: any) => (
                      <span key={a.id} style={{ background: '#1c1f24', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: '#a0aaba' }}>
                        {a.name} <span style={{ color: '#007afc' }}>({a.priority})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Similar past incidents */}
              {result.similar_incidents?.length > 0 && (
                <Card>
                  <h3 style={{ color: '#fff', margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>🧠 Memory — similar past incidents</h3>
                  {result.similar_incidents.map((inc: any) => (
                    <div key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1c1f24', fontSize: 13 }}>
                      <div>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{inc.id}</span>
                        <span style={{ color: '#566171', marginLeft: 10 }}>{inc.category} · {inc.chosen_strategy}</span>
                      </div>
                      <div style={{ color: '#228a56' }}>{inc.meals_protected?.toLocaleString()} meals protected</div>
                    </div>
                  ))}
                </Card>
              )}

              <Btn onClick={proceed}>Choose a solution →</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
