# Gleaner — Platform Setup

## Backend (run first)
```bash
cd backstop/backend
pip install -r ../requirements.txt
uvicorn platform_main:app --port 8000 --reload
```

## Frontend
```bash
# root of the repo
npm install
npm run dev
# open http://localhost:3000
```

## The six-page flow
| Step | URL | What happens |
|---|---|---|
| 1 Connect | /platform/connect | Upload CSV/Excel or register MCP endpoint |
| 2 Risk | /platform/risk | Set thresholds, critical categories, objective |
| 3 Simulate | /platform/simulate | Trigger a disruption, view graph + severity |
| 4 Solve | /platform/solve | Pick a strategy, dispatch to workers |
| 5 Track | /platform/track | Admin view, advance status, auto-refresh |
| 6 Memory | /platform/memory | Timeline + recall similar past incidents |

## Environment (optional)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
ANTHROPIC_API_KEY=sk-...   # enables real Claude agent; works without it
```
