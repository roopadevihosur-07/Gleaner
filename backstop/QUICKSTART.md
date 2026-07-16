# Gleaner - Quick Start Guide

Get the live demo running in under 2 minutes.

## Prerequisites
- Python 3.9+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Google Maps)

## Step 1: Install & Start (1 minute)

```bash
cd backstop
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
```

**Done!** Server is running at `http://127.0.0.1:8000`

## Step 2: Open in Browser

### First Time? Start Here:
**`http://127.0.0.1:8000`** ← Landing page (explains problem + solution + how it works)

### Ready to Demo? Go to:
**`http://127.0.0.1:8000/app`** ← Live app (metrics + map + agent orchestration)

## Step 3: Trigger a Demo

1. **Look at the left sidebar** — "Live Issues Feed" with metrics
2. **Click "Simulate Issue"** button (bottom of sidebar)
3. **Watch the magic happen**:
   - New issue appears in the feed
   - Agent trace animates on the right
   - Impact card updates with meals protected
   - Google Map shows the optimized route

## Step 4: Interact

- **Toggle Map View**: Click "🗺️ Google Maps" or "📍 SVG View"
- **Compare Routes**: Use route toggle buttons to see naive vs. optimized
- **Approve Plans**: Click "Approve plan" to show human-in-the-loop
- **Simulate More**: Keep clicking "Simulate Issue" to trigger multiple disruptions

---

## What You're Seeing

### Sidebar (Left)
- **Live Indicator** (pulsing dot) = system is active
- **Metrics Dashboard** = real-time stats (active issues, meals protected, cost saved)
- **Issues Feed** = incoming disruptions (click to trigger planning)
- **Simulate Button** = generate test scenario

### Map (Center)
- **Blue dots** = depot (warehouse)
- **Green numbered dots** = partner agencies
- **Blue route** = Gleaner's optimized plan
- **Gray route** = comparison baseline
- **Toggle** between Google Maps and SVG view

### Agent Activity (Right)
- **Trace** = step-by-step reasoning as AI works
- **Impact Card** = meals protected breakdown
- **Recommendation** = plain-language plan
- **Approve Button** = human decision gate

---

## Enable Claude AI (Optional)

By default, Gleaner runs with a **deterministic engine** (same output every time, no API calls).

To use the **real Claude AI agent**:

1. Create `.env` file in `backstop/` directory:
   ```
   ANTHROPIC_API_KEY=sk-your-key-here
   ```

2. Restart the server (it auto-reloads)

3. Reload the browser — notice header now shows `engine: claude-sonnet-5`

The agent will now use real Claude reasoning for orchestration (while still calling deterministic tools for math).

---

## Enable Google Maps (Recommended for Demo)

By default, the map uses a simple SVG fallback. For the full demo experience:

1. Get a Google Maps API key: https://console.cloud.google.com/
   - Create a project → Enable "Maps JavaScript API"
   - Create API key in Credentials

2. Edit `frontend/index.html`:
   - Find: `key=AIzaSyDemoKey123`
   - Replace with your actual API key

3. Restart the server and reload the browser

See `GOOGLE_MAPS_SETUP.md` for detailed instructions.

---

## Common Issues

| Problem | Solution |
|---------|----------|
| "Connection refused" | Is server running? Check terminal for errors. Restart with `uvicorn main:app --reload` |
| Map is blank/gray | Google Maps API key issue. Check console (F12) for errors. SVG view still works. |
| No issues appear in sidebar | Click "Simulate Issue" button to generate test disruption |
| Agent trace doesn't show | Refresh browser (Ctrl+R). Check DevTools console for JS errors. |
| Metrics not updating | If using Claude, check `.env` for valid API key. Deterministic mode should always work. |

---

## File Structure

```
backstop/
├── frontend/
│   ├── landing.html      ← Introduction page
│   └── index.html        ← Live app
├── backend/
│   ├── main.py           ← FastAPI server
│   ├── agent.py          ← Claude orchestration loop
│   └── tools.py          ← Deterministic tool implementations
├── data/                 ← Realistic Bay Area food bank data
│   ├── agencies.json     ← Partner agencies (lat/lng, access windows)
│   ├── vendors.json      ← Suppliers (prices, lead times, reliability)
│   ├── inventory.json    ← On-hand stock
│   ├── commitments.json  ← Incoming loads (TEFAP, donors, POs)
│   └── fleet.json        ← Delivery vehicles (capacity, fuel cost)
├── DEMO_GUIDE.md         ← Full demo script & talking points
├── QUICKSTART.md         ← This file
├── GOOGLE_MAPS_SETUP.md  ← How to add your API key
└── requirements.txt      ← Python dependencies
```

---

## Next Steps After Demo

### Customize for Your Food Bank
Edit `data/` JSON files with real:
- Agency locations and access windows
- Vendor catalogs and reliability
- Vehicle fleet specs
- Inventory structure

### Extend Functionality
- Add real GPS tracking from delivery vehicles
- Integrate with existing procurement systems
- Add voice interface for hands-free operation
- Stream live Google Maps satellite view

### Deploy to Production
- Host on AWS/GCP/Azure
- Connect to real supply chain databases
- Set up notifications for disruption alerts
- Scale to multiple food banks

---

## Need Help?

### During Demo
- **Something breaks?** → Restart server, refresh browser
- **Map doesn't show?** → Click "📍 SVG View" to use fallback
- **Not enough demo time?** → Skip details, focus on "Simulate Issue" → "Watch Agent Plan" → "Approve"

### Technical Questions
- Check `DEMO_GUIDE.md` for comprehensive Q&A
- See `GOOGLE_MAPS_SETUP.md` for map integration
- Read `backend/agent.py` to understand the orchestration loop

### Want the Real Claude?
- Get API key at https://console.anthropic.com
- Add to `.env` in backstop folder
- Restart server — agent will use real Claude reasoning

---

## Demo Talking Points (TL;DR)

**The Problem:**
"Supply shocks hit food banks daily. They scramble across two teams, two tools, takes hours while food spoils."

**The Solution:**
"Gleaner orchestrates one plan in 30 seconds. Procurement + distribution. Human approves. Scored in meals."

**The Proof:**
[Click Simulate] → [Watch agent work] → [Show map route] → [Point to metrics] → [Approve plan]

**The Impact:**
"11,000 meals protected. $9,900 saved. 116 → 79 miles. One metric everyone understands: meals."

---

**Now open your browser and show the world how fast AI can solve real supply chain crises.** 🌾

Go to **http://127.0.0.1:8000** and start your demo!
