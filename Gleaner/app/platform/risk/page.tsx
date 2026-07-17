'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, SectionHead, Btn, Alert, Stat, Loader } from '@/components/ui';

const CATEGORIES = ['protein', 'produce', 'dairy', 'shelf_stable'];
const OBJECTIVES = [
  { value: 'balanced',      label: '⚖️  Balanced',       desc: 'Optimise cost, speed and reliability together' },
  { value: 'cheapest',      label: '💰 Lowest cost',     desc: 'Minimise spend — good for low-severity gaps' },
  { value: 'fastest',       label: '⚡ Fastest',          desc: 'Shortest lead time — restore flow immediately' },
  { value: 'most_reliable', label: '🔒 Most reliable',   desc: 'Highest OTIF history — safe for critical items' },
];

export default function RiskPage() {
  const router = useRouter();
  const [cfg, setCfg] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => { api.getRisk().then(setCfg).catch(() => setMsg({ text: 'Cannot reach backend', type: 'error' })); }, []);

  function toggle(key: 'critical_categories' | 'priority_customers', val: string) {
    setCfg((c: any) => {
      const list: string[] = c[key] || [];
      return { ...c, [key]: list.includes(val) ? list.filter((x: string) => x !== val) : [...list, val] };
    });
  }

  async function save() {
    setSaving(true); setMsg(null);
    try {
      const r = await api.setRisk(cfg);
      setCfg(r);
      setMsg({ text: '✓ Risk configuration saved', type: 'success' });
    } catch { setMsg({ text: 'Save failed', type: 'error' }); }
    finally { setSaving(false); }
  }

  if (!cfg) return <div style={{ color: '#0e1012', minHeight: '100vh', background: '#0e1012' }}><Loader /></div>;

  return (
    <div>
      <SectionHead step="2" title="Risk management configuration" sub="Define how Gleaner scores, classifies, and responds to disruptions for your operation." />
      {msg && <Alert msg={msg.text} type={msg.type} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Company + thresholds */}
        <Card>
          <h3 style={{ color: '#fff', margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>🏢 Company profile</h3>
          <label style={{ fontSize: 12, color: '#8b96aa', display: 'block', marginBottom: 6 }}>Company name</label>
          <input value={cfg.company || ''} onChange={e => setCfg({ ...cfg, company: e.target.value })}
            style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 20, boxSizing: 'border-box' }} />

          <label style={{ fontSize: 12, color: '#8b96aa', display: 'block', marginBottom: 6 }}>
            Shortfall trigger (severity escalates above this % of total demand)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 6 }}>
            <input type="range" min={5} max={50} value={cfg.shortfall_trigger_pct || 15}
              onChange={e => setCfg({ ...cfg, shortfall_trigger_pct: +e.target.value })}
              style={{ flex: 1 }} />
            <div style={{ fontSize: 24, fontWeight: 700, color: '#007afc', minWidth: 48, textAlign: 'right' }}>{cfg.shortfall_trigger_pct}%</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {[['< trigger', 'low', '#12394e'], ['≥ trigger', 'medium', '#3a4e12'], ['≥ trigger + critical cat', 'high', '#7a4512'], ['≥ 1.5× trigger + critical', 'critical', '#7a1e1e']].map(([when, sev, color]) => (
              <div key={sev} style={{ background: color, borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: '#ffffff99' }}>{when}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>{sev}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Objective */}
        <Card>
          <h3 style={{ color: '#fff', margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>🎯 Recovery objective</h3>
          <p style={{ color: '#566171', fontSize: 13, margin: '0 0 16px' }}>Gleaner ranks candidate solutions using this objective when recommending a plan.</p>
          {OBJECTIVES.map(o => (
            <div key={o.value} onClick={() => setCfg({ ...cfg, objective: o.value })}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
                borderRadius: 10, border: `1px solid ${cfg.objective === o.value ? '#007afc' : '#1c1f24'}`,
                background: cfg.objective === o.value ? '#001e40' : 'transparent',
                marginBottom: 10, cursor: 'pointer', transition: 'all .2s',
              }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', border: `2px solid ${cfg.objective === o.value ? '#007afc' : '#566171'}`,
                background: cfg.objective === o.value ? '#007afc' : 'transparent', flexShrink: 0, marginTop: 2,
              }} />
              <div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{o.label}</div>
                <div style={{ color: '#566171', fontSize: 12 }}>{o.desc}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Critical categories */}
        <Card>
          <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>🚨 Critical categories</h3>
          <p style={{ color: '#566171', fontSize: 13, margin: '0 0 16px' }}>A shortfall in these categories escalates severity faster and is protected first in any recovery plan.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {CATEGORIES.map(cat => {
              const on = (cfg.critical_categories || []).includes(cat);
              return (
                <div key={cat} onClick={() => toggle('critical_categories', cat)}
                  style={{
                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                    border: `1px solid ${on ? '#c0392b' : '#1c1f24'}`,
                    background: on ? '#2d0a0a' : '#0e1012',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: on ? '#fff' : '#8b96aa', fontWeight: 600, textTransform: 'capitalize', fontSize: 14 }}>{cat}</span>
                    <span style={{ fontSize: 16 }}>{on ? '🔴' : '⚪'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Auto-approve + save */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>🤖 Automation</h3>
            <p style={{ color: '#566171', fontSize: 13, margin: '0 0 20px' }}>Gleaner always proposes; you decide if low-severity plans execute automatically.</p>
            <div onClick={() => setCfg({ ...cfg, auto_approve: !cfg.auto_approve })}
              style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', padding: '14px', background: '#0e1012', borderRadius: 10, border: '1px solid #1c1f24' }}>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: cfg.auto_approve ? '#007afc' : '#333943', transition: 'background .2s', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 3, left: cfg.auto_approve ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Auto-approve low severity</div>
                <div style={{ color: '#566171', fontSize: 12 }}>Critical / high always require human approval</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, borderTop: '1px solid #1c1f24', paddingTop: 20, display: 'flex', gap: 12 }}>
            <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save configuration'}</Btn>
            <Btn variant="secondary" onClick={() => router.push('/platform/simulate')}>Next: Simulate →</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
