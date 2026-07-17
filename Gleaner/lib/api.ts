// Central API client. Backend runs on :8000 (override with NEXT_PUBLIC_API_URL).
export const API =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000";

async function j(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

export const api = {
  // connect
  connectStatus: () => j("/api/connect/status"),
  connectMCP: (endpoint: string, label?: string) =>
    j("/api/connect/mcp", { method: "POST", body: JSON.stringify({ endpoint, label }) }),
  upload: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/api/connect/upload`, { method: "POST", body: fd });
    return res.json();
  },
  // risk
  getRisk: () => j("/api/risk/config"),
  setRisk: (cfg: any) => j("/api/risk/config", { method: "POST", body: JSON.stringify(cfg) }),
  // state / graph / simulate / solve
  state: () => j("/api/state"),
  graph: () => j("/api/graph"),
  simulate: (body: any) => j("/api/simulate", { method: "POST", body: JSON.stringify(body) }),
  solve: (issue: any, solution: any) =>
    j("/api/solve", { method: "POST", body: JSON.stringify({ issue, solution }) }),
  // admin / memory
  incidents: () => j("/api/incidents"),
  setStatus: (id: string, status: string) =>
    j(`/api/incidents/${id}/status`, { method: "POST", body: JSON.stringify({ status }) }),
};

// tiny cross-page handoff (simulate -> solve)
export const handoff = {
  set: (k: string, v: any) => {
    if (typeof window !== "undefined") sessionStorage.setItem(k, JSON.stringify(v));
  },
  get: (k: string) => {
    if (typeof window === "undefined") return null;
    const v = sessionStorage.getItem(k);
    return v ? JSON.parse(v) : null;
  },
};
