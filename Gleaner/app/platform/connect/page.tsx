'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, SectionHead, Btn, Alert, Loader, Stat } from '@/components/ui';

type Status = { connected: boolean; source?: string; channel?: string; records?: number; columns?: string[]; preview?: any[]; updated_at?: string };

export default function ConnectPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mcp, setMcp] = useState('');
  const [mcpLabel, setMcpLabel] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'error' | 'info' | 'success' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    try { setStatus(await api.connectStatus()); }
    catch { setMsg({ text: 'Backend unreachable — start: cd backstop/backend && uvicorn platform_main:app --port 8000', type: 'error' }); }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setMsg(null);
    try {
      const r = await api.upload(file);
      if (r.ok) { setMsg({ text: `✓ Ingested ${r.records} rows from "${file.name}"`, type: 'success' }); await refresh(); }
      else setMsg({ text: r.error || 'Upload failed', type: 'error' });
    } catch { setMsg({ text: 'Upload error', type: 'error' }); }
    finally { setUploading(false); }
  }

  async function handleMCP() {
    if (!mcp.trim()) return;
    setMsg(null);
    try {
      const r = await api.connectMCP(mcp.trim(), mcpLabel || undefined);
      if (r.ok) { setMsg({ text: `✓ MCP channel registered: ${mcp}`, type: 'success' }); await refresh(); }
    } catch { setMsg({ text: 'MCP registration failed', type: 'error' }); }
  }

  const SAMPLES = [
    ['TEFAP Allocation (protein, 12 000 lbs, in_transit)', 'sku,category,qty_lbs,status\nTEFAP-Q3,protein,12000,in_transit\n'],
    ['Mixed inbound (3 loads)', 'sku,category,qty_lbs,status,eta\nD-01,dairy,3000,delayed,2026-07-17\nP-02,produce,7500,in_transit,2026-07-17\nSS-03,shelf_stable,11000,scheduled,2026-07-18\n'],
  ];

  async function loadSample(csv: string) {
    const file = new File([csv], 'sample.csv', { type: 'text/csv' });
    setUploading(true); setMsg(null);
    try {
      const r = await api.upload(file);
      if (r.ok) { setMsg({ text: `✓ Sample loaded — ${r.records} records`, type: 'success' }); await refresh(); }
    } catch { setMsg({ text: 'Error', type: 'error' }); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <SectionHead step="1" title="Connect your supply chain data" sub="Upload your monitoring export (Excel or CSV) or register your MCP endpoint to pull live operations data into Gleaner." />

      {msg && <Alert msg={msg.text} type={msg.type} />}
      {loading ? <Loader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Upload */}
          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>📁 Upload file</h3>
            <p style={{ color: '#566171', fontSize: 13, margin: '0 0 20px' }}>Excel (.xlsx) or CSV from your WMS, TMS, or monitoring export.</p>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #333943', borderRadius: 12, padding: '32px 20px',
                textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s',
                marginBottom: 16,
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = '#007afc')}
              onMouseOut={e => (e.currentTarget.style.borderColor = '#333943')}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
              <div style={{ color: '#a0aaba', fontSize: 14 }}>{uploading ? 'Uploading…' : 'Click to choose file or drop here'}</div>
              <div style={{ color: '#566171', fontSize: 12, marginTop: 4 }}>.xlsx · .xlsm · .csv</div>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xlsm" style={{ display: 'none' }} onChange={handleFile} />

            <div style={{ borderTop: '1px solid #1c1f24', paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: '#566171', marginBottom: 10 }}>Or load a quick sample:</div>
              {SAMPLES.map(([label, csv]) => (
                <button key={label} onClick={() => loadSample(csv)} style={{
                  display: 'block', width: '100%', textAlign: 'left', background: '#1c1f24',
                  border: '1px solid #333943', borderRadius: 8, padding: '8px 12px',
                  color: '#a0aaba', fontSize: 12, cursor: 'pointer', marginBottom: 8,
                }}>↗ {label}</button>
              ))}
            </div>
          </Card>

          {/* MCP */}
          <Card>
            <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>🔌 Connect via MCP</h3>
            <p style={{ color: '#566171', fontSize: 13, margin: '0 0 20px' }}>Register any MCP-compatible supply chain server to stream live events directly into Gleaner.</p>
            <label style={{ display: 'block', fontSize: 12, color: '#8b96aa', marginBottom: 6 }}>MCP endpoint URL</label>
            <input value={mcp} onChange={e => setMcp(e.target.value)} placeholder="https://your-scm.company.com/mcp"
              style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' }} />
            <label style={{ display: 'block', fontSize: 12, color: '#8b96aa', marginBottom: 6 }}>Label (optional)</label>
            <input value={mcpLabel} onChange={e => setMcpLabel(e.target.value)} placeholder="My WMS"
              style={{ width: '100%', background: '#0e1012', border: '1px solid #333943', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }} />
            <Btn onClick={handleMCP}>Register MCP channel</Btn>
            <div style={{ marginTop: 20, padding: '12px 14px', background: '#0e1012', borderRadius: 10, fontSize: 12, color: '#566171' }}>
              Gleaner supports any MCP-compatible server. Ingest channels: WMS, TMS, ERP, custom monitoring webhooks. The demo uses Google Drive + Gmail MCP if connected.
            </div>
          </Card>

          {/* Current status */}
          {status?.connected && (
            <Card style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ color: '#fff', margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>✓ Live data connected</h3>
                  <div style={{ fontSize: 12, color: '#566171' }}>Source: {status.source} · Channel: {status.channel} · Updated: {status.updated_at}</div>
                </div>
                <Btn onClick={() => router.push('/platform/risk')}>Configure risk →</Btn>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, borderTop: '1px solid #1c1f24', paddingTop: 16 }}>
                <Stat label="Records" value={status.records || 0} />
                <Stat label="Columns" value={status.columns?.length || 0} />
                <Stat label="Channel" value={status.channel?.toUpperCase() || '—'} accent="#228a56" />
              </div>
              {status.preview?.length ? (
                <div style={{ marginTop: 16, overflowX: 'auto' }}>
                  <div style={{ fontSize: 12, color: '#566171', marginBottom: 8 }}>Preview (first 5 rows)</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>{status.columns?.map(c => <th key={c} style={{ padding: '6px 10px', textAlign: 'left', background: '#1c1f24', color: '#8b96aa', borderRadius: 4 }}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {status.preview.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #1c1f24' }}>
                          {status.columns?.map(c => <td key={c} style={{ padding: '6px 10px', color: '#a0aaba' }}>{String(row[c] ?? '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
