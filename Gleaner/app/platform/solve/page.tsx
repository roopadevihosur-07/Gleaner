'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, handoff } from '@/lib/api';
import { Card, SectionHead, Btn, Alert, Loader, Stat, SeverityPill, GraphViz } from '@/components/ui';

export default function SolvePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [dispatching, setDispatching] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [step, setStep] = useState<'choose' | 'dispatched'>('choose');

  useEffect(() => {
    const d = handoff.get('simulate_result');
    if (d) { setData(d); setChosen(d.solutions?.find((s: any) => s.recommended)?.id || null); }
    else router.replace('/platform/simulate');
  }, []);

  async function dispatch() {
    if (!data || !chosen) return;
    const sol = data.solutions.find((s: any) => s.id === chosen);
    if (!sol) return;
    setDispatching(true);
    try {
      const r = await api.solve(data.issue, sol);
      setResult(r);
      handoff.set('solve_result', r);
      setStep('dispatched');
    } catch { setMsg('Dispatch failed — is the backend running?'); }
    finally { setDispatching(false); }
  }

  if (!data) return <Loader msg="Loading simulation result…" />;

  const { issue, solutions, graph } = data;
  const chosenSol = solutions?.find((s: any) => s.id === chosen);

  const STRATEGY_ICONS: Record<string, string> = { 'Lowest cost': '💰', 'Fastest': '⚡', 'Most reliable': '🔒' };

  return (
    <div>
      <SectionHead step="4" title="Choose & dispatch a solution" sub="Review the three recovery strategies, select the best for your operation, and send dispatch instructions to workers." />
      {msg && <Alert msg={msg} />}

      {step === 'choose' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Issue recap */}
          <Card style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <SeverityPill s={issue.severity} />
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{issue.id}</div>
              <div style={{ color: '#8b96aa', fontSize: 14 }}>{issue.category} · {issue.shortfall_lbs?.toLocaleString()} lbs short · {issue.meals_at_risk?.toLocaleString()} meals at risk</div>
            </div>
            <Btn variant="secondary" onClick={() => router.push('/platform/simulate')}>← Re-simulate</Btn>
          </Card>

          {/* Solution cards */}
          {solutions?.map((sol: any) => (
            <div key={sol.id} onClick={() => setChosen(sol.id)}
              style={{
                background: '#15171b', border: `2px solid ${chosen === sol.id ? '#007afc' : sol.recommended ? '#228a56' : '#1c1f24'}`,
                borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'border-color .2s', position: 'relative',
              }}>
              {sol.recommended && (
                <div style={{ position: 'absolute', top: -10, left: 20, background: '#228a56', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase' }}>
                  ★ Recommended
                </div>
              )}
              {chosen === sol.id && (
                <div style={{ position: 'absolute', top: 16, right: 16, width: 20, height: 20, borderRadius: '50%', background: '#007afc', display: 'grid', placeItems: 'center', fontSize: 12 }}>✓</div>
              )}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{STRATEGY_ICONS[sol.strategy] || '📦'}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{sol.strategy}</div>
                  <div style={{ color: '#566171', fontSize: 12 }}>{sol.why}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                <Stat label="Cost" value={`$${sol.cost?.toLocaleString()}`} />
                <Stat label="Lead" value={`${sol.max_lead_days}d`} />
                <Stat label="Reliability" value={`${Math.round((sol.avg_reliability || 0) * 100)}%`} accent="#228a56" />
              </div>
              <div style={{ fontSize: 12, color: '#8b96aa', marginBottom: 8 }}>
                Meals protected: <span style={{ color: '#228a56', fontWeight: 700 }}>{sol.meals_covered?.toLocaleString()}</span>
              </div>
              {sol.vendors?.map((v: any) => (
                <div key={v.vendor} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid #1c1f24' }}>
                  <span style={{ color: '#a0aaba' }}>{v.vendor}</span>
                  <span style={{ color: '#566171' }}>{v.lbs?.toLocaleString()} lbs · ${v.price_per_lb}/lb · {v.lead_time_days}d</span>
                </div>
              ))}
            </div>
          ))}

          {/* Graph + dispatch button */}
          <Card style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ color: '#fff', margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>Network with alternate path highlighted</h3>
            <GraphViz data={{
              ...graph,
              edges: graph?.edges?.map((e: any) => ({
                ...e, status: chosenSol?.path?.includes(e.from) && chosenSol?.path?.includes(e.to) ? 'alternate' : e.status,
              })),
            }} />
          </Card>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
            <Btn onClick={dispatch} disabled={!chosen || dispatching}>
              {dispatching ? '⏳ Dispatching to workers…' : '📡 Dispatch to workers →'}
            </Btn>
            <Btn variant="secondary" onClick={() => router.push('/platform/track')}>Skip to track</Btn>
          </div>
        </div>
      )}

      {step === 'dispatched' && result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Card style={{ gridColumn: '1 / -1', background: '#0a1f12', border: '1px solid #228a56' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 36 }}>✅</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Dispatched — {result.incident?.id}</div>
                <div style={{ color: '#8b96aa', fontSize: 14 }}>Workers notified · Admin tracking active</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Stat label="Meals protected" value={result.summary?.meals_protected?.toLocaleString()} accent="#228a56" />
              <Stat label="Dollars saved" value={`$${result.summary?.dollars_saved?.toLocaleString()}`} accent="#007afc" />
            </div>
          </Card>

          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>📋 Worker dispatch instructions</h3>
            {result.dispatch?.worker_instructions?.map((ins: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #1c1f24' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#007afc', color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ color: '#a0aaba', fontSize: 13 }}>{ins}</div>
              </div>
            ))}
          </Card>

          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>🗺️ Route optimisation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#1c1f24', borderRadius: 10, padding: '12px' }}>
                <div style={{ fontSize: 11, color: '#566171' }}>NAIVE DISPATCH</div>
                <div style={{ color: '#c0392b', fontWeight: 700, fontSize: 18 }}>{result.dispatch?.route?.baseline?.miles} mi</div>
                <div style={{ fontSize: 12, color: '#566171' }}>{result.dispatch?.route?.baseline?.spoiled_lbs?.toLocaleString()} lbs spoiled</div>
              </div>
              <div style={{ background: '#0a1f12', borderRadius: 10, padding: '12px', border: '1px solid #228a56' }}>
                <div style={{ fontSize: 11, color: '#228a56' }}>GLEANER PLAN</div>
                <div style={{ color: '#228a56', fontWeight: 700, fontSize: 18 }}>{result.dispatch?.route?.optimized?.miles} mi</div>
                <div style={{ fontSize: 12, color: '#566171' }}>0 lbs spoiled</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#8b96aa' }}>
              Fuel saved: <span style={{ color: '#007afc', fontWeight: 700 }}>${result.dispatch?.route?.fuel_saved?.toFixed(2)}</span> ·
              Spoilage avoided: <span style={{ color: '#228a56', fontWeight: 700 }}>{result.dispatch?.route?.perishable_lbs_saved?.toLocaleString()} lbs</span>
            </div>
          </Card>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
            <Btn onClick={() => router.push('/platform/track')}>Track this incident →</Btn>
            <Btn variant="secondary" onClick={() => router.push('/platform/memory')}>View memory →</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
