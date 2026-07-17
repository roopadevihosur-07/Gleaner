# Gleaner — Disruption-to-Dispatch Agent for Food Banks

AI-powered supply chain orchestration that turns supply shocks into coordinated recovery plans in seconds.

**Problem:** Food bank disruptions (cuts, delays) ripple across 10+ agencies in minutes. Recovery takes hours or days across two teams, two tools—while food spoils.

**Solution:** Gleaner detects disruptions in real-time, orchestrates optimal procurement and distribution plans, and scores everything in the one metric everyone understands: **meals protected**.

---

## 📁 Project Structure

```
Gleaner/
├── app/                          # Next.js app directory (routes & pages)
│   ├── page.tsx                  # Landing page with all sections
│   ├── app/page.tsx              # Live demo app route
│   ├── layout.tsx                # Root layout with fonts
│   └── globals.css               # Global styles + animations
├── components/                   # React components
│   ├── Header.tsx                # Navigation + logo
│   ├── HeroSection.tsx           # Hero with flow diagram
│   ├── ProblemSection.tsx        # Problem cards (3-column)
│   ├── SolutionSection.tsx       # Solution flow (6 steps)
│   ├── FeaturesSection.tsx       # Key capabilities grid
│   ├── CTASection.tsx            # Call-to-action
│   ├── Footer.tsx                # Footer
│   ├── FlowDiagram.tsx           # Animated SVG flow (6-step)
│   └── AnimatedBackground.tsx    # Canvas-based supply chain viz
├── public/                       # Static assets
│   └── demo.html                 # Live demo (embedded in /app)
├── backstop/                     # Backend services
│   ├── backend/                  # FastAPI server (Python)
│   │   ├── main.py               # API endpoints + WebSocket
│   │   ├── agent.py              # Claude AI orchestration
│   │   └── tools.py              # Deterministic supply chain tools
│   ├── frontend/                 # Original HTML frontend
│   └── QUICKSTART.md             # Backend setup guide
├── DESIGN-2.md                   # Mapbox design system
├── tailwind.config.ts            # Tailwind CSS config + tokens
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🚀 Quick Start

### Frontend (Next.js)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

The landing page features:
- **Hero Section** - Animated flow diagram (6-step process)
- **Problem Statement** - Why food banks struggle
- **Solution Overview** - How Gleaner works
- **Key Capabilities** - 6 differentiators + 4 impact metrics
- **Live Demo** - Click "Launch Gleaner →" button
- **Animated Background** - Supply chain network visualization

### Backend (FastAPI)

From the `backstop/` directory:

```bash
# Create Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Start API server
uvicorn main:app --reload --port 8000

# Visit http://localhost:8000/docs for API explorer
```

**API Endpoints:**
- `GET /api/state` - Current supply chain state
- `GET /api/disruption` - Simulated disruption events
- `GET /api/live/simulate-issue` - Trigger demo disruption
- `WebSocket /ws/live-issues` - Real-time issue stream

---

## 🎨 Design System

**Mapbox-inspired dark theme:**

| Token | Color | Usage |
|-------|-------|-------|
| Void Black | #0e1012 | Background |
| Deep Charcoal | #15171b | Cards |
| Signal Blue | #007afc | Primary action, data flow |
| Map Green | #228a56 | Success, delivery states |
| Fog | #a0aaba | Body text |
| Slate | #566171 | Secondary text |

**Typography:**
- **Font:** Cera Pro (400/500/700 weights)
- **H1/H2:** 68px / 44px, weight 700, letter-spacing -0.88px
- **Body:** 16px, weight 400, line-height 1.6

**Components:**
- Buttons: 100px border-radius (pill), hover opacity 0.9
- Cards: 24px border-radius, 1px border #1c1f24
- Badges: 4px border-radius, uppercase 12px

---

## ✨ Key Features

### 1. **Genuine Agentic Planning**
Claude AI orchestrates decisions; deterministic tools do arithmetic. No hallucinations.

### 2. **Animated Flow Diagram**
6-step supply chain process with pulsing nodes, glowing connections, and smooth animations.

### 3. **Real-Time Issue Detection**
Live WebSocket feed pulls disruptions from maps and tracking systems.

### 4. **Unified Procurement + Distribution**
Closes the loop between two halves of the same shock—no hand-off delays.

### 5. **Interactive Background**
Canvas-based supply chain visualization with animated trucks, pulsing nodes, and gradient connections.

### 6. **Everything Scored in Meals**
Not dollars, not logistics. Meals protected, meals at risk, meals saved. Everyone speaks the same language.

---

## 🔧 Technology Stack

**Frontend:**
- Next.js 14+ (React, SSR, file-based routing)
- TypeScript (type safety)
- Tailwind CSS v4 (utility-first styling)
- SVG animations (flow diagram, background)
- Cera Pro typography (Google Fonts)

**Backend:**
- FastAPI (Python async API framework)
- Claude AI (Anthropic SDK for orchestration)
- WebSocket (real-time issue streaming)
- Google Maps API (route visualization)
- Deterministic tools (gap analysis, vendor search, route planning)

---

## 📊 Live Demo Flow

1. **Click "Launch Gleaner →"** on the landing page
2. **See live demo app** with:
   - Live metrics dashboard (disruptions, meals protected, cost savings)
   - Interactive Google Maps (agencies, vendors, optimized routes)
   - Agent trace (Claude's step-by-step reasoning)
   - Plain-language recovery plan
3. **Click "Simulate Issue"** to trigger a realistic disruption
4. **Watch in real-time** as Gleaner:
   - Detects the supply gap
   - Calculates impact (meals at risk)
   - Finds optimal vendor
   - Plans optimized routes
   - Scores impact in meals
   - Waits for human approval

---

## 🌾 Running Both Frontend & Backend

**Terminal 1 - Backend:**
```bash
cd backstop/backend
source ../.venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then visit:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/docs

---

## 📖 Documentation

- **Backend Setup:** `backstop/QUICKSTART.md`
- **Live Demo Guide:** `backstop/DEMO_GUIDE.md`
- **Google Maps Setup:** `backstop/GOOGLE_MAPS_SETUP.md`
- **Next.js Migration:** `backstop/NEXTJS_SETUP.md`
- **Design System:** `DESIGN-2.md`

---

## 🚀 Deployment

### Vercel (Next.js Frontend)
```bash
npm install -g vercel
vercel
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Docker (Backend)
```bash
cd backstop/backend
docker build -t gleaner-backend .
docker run -p 8000:8000 gleaner-backend
```

---

## 📝 Key Concepts

**The Gleaner Workflow:**
1. **Signal** - Supply disruption detected
2. **Disruption** - Gap analysis (lbs short, agencies affected, meals at risk)
3. **Gleaner** - AI orchestrates procurement + distribution (30 seconds)
4. **Delivery** - Routes optimized, perishables preserved
5. **Impact** - Meals protected, cost saved, routes dispatched
6. **Approved** - Human operator signs off (always human-in-the-loop)

**Why It Matters:**
- **Current workflow:** 2-3 days, two scrambles, handoffs, waste
- **Gleaner workflow:** 30 seconds, one coordinated plan, zero waste

---

## 🤝 Contributing

Built with Claude AI, Google Maps, and FastAPI.  
Data-driven. Auditable. Human-approved.

For questions or feedback, open an issue or contact the team.

---

## 📄 License

MIT License - See LICENSE file for details

---

**Made for food banks. Built with ❤️ and Claude AI.**
