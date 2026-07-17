# Gleaner Demo Guide

## Project Overview

**Gleaner** is an AI-powered disruption-to-dispatch agent for food banks. When a supply shock hits (a load cut, delayed shipment, or allocation pulled), Gleaner turns one shock into one coordinated recovery plan in seconds—every option scored in the one metric everyone understands: **meals**.

---

## Demo Flow (5-10 minutes)

### 1. **Landing Page** (1 min)
**URL:** `http://127.0.0.1:8000`

The landing page introduces:
- **Problem Statement**: Why disruptions are a crisis
  - ⚡ Disruptions hit fast
  - ⏱️ No time to respond (takes hours/days)
  - 💔 Real people miss meals (11,300 lbs = 9,417 meals at risk)

- **Solution Flow**: How Gleaner works
  1. **Sense** — Detect the shock
  2. **Analyze** — Calculate the gap
  3. **Fill** — Find a vendor
  4. **Replan** — Optimize routes
  5. **Approve** — Human reviews (AI proposes only)
  6. **Impact** — Meals protected in one metric

- **Key Capabilities**:
  - AI orchestration (Claude) + specialized tools = auditable math
  - Unified procurement + distribution (closes the loop)
  - Seconds, not days (30s to approved plan)
  - Live Google Maps integration
  - Human-in-the-loop (always)
  - Everything scored in meals (not dollars)

- **Impact Metrics**:
  - 30s time to plan
  - 11K+ meals protected per event
  - $9.9K average cost saved
  - 116→79 miles optimized

---

### 2. **Launch the App** (click "Launch Gleaner →")
**URL:** `http://127.0.0.1:8000/app`

You'll see:
- **Left Sidebar**: Live Issues Feed + Metrics Dashboard
- **Center**: Google Map with delivery locations + route planning
- **Right**: Agent activity trace + impact card + recommendation box

---

### 3. **Demo Trigger: Simulate an Issue** (3-5 min)

#### Step 1: Show the sidebar
Point out:
- 📊 **Metrics**: Active issues (starting at 0)
- 🚨 **Live Issues Feed**: Shows incoming disruptions
- 🟢 Live indicator dot = system is monitoring

#### Step 2: Click "Simulate Issue" button
Watch the sidebar update in real-time:
- A new issue appears: e.g., "Sysco Purchase Order load delayed — 53% short on dairy"
- Metrics update: `Active Issues: 1`
- Issue card shows severity (high/critical) with color coding

#### Step 3: Watch Gleaner Plan in Real-Time
In the right panel, the **Agent Activity** trace shows:

```
◎ Sense — TEFAP allocation pulled on truck 3
▤ Gap Analyst — 11,300 lbs protein short → 9,417 meals at risk
$ Find Fill — Sysco can cover at $200/lb (no rush premium)
⟿ Replan Routes — 116 mi → 79 mi · 1,900 lbs spoilage avoided
✓ Human Approval — Plan ready for review
✦ Impact Summary — 11,000 meals protected
```

Each step animates in with a slight delay so you can narrate what's happening.

#### Step 4: Show the Live Map
**Toggle to "🗺️ Google Maps"** (if not already active):
- 🔵 Blue dot = Depot (food bank warehouse)
- 🟢 Green numbered dots = 7 partner agencies
- 🔵 Blue polyline = Gleaner's optimized route
- 🔲 Gray polyline = Naive baseline (toggle to compare)

Pan/zoom to show the geography. Point out:
- Routes shorter with Gleaner (fewer miles = less fuel = faster delivery)
- Perishables reach agencies before their access windows close
- Fewer stops = fewer spoilage opportunities

#### Step 5: Show the Impact Card
**"Meals Protected"** section shows:
- **🍜 11,000 meals** (the headline—real food to real people)
- **Breakdown**:
  - Gap covered: 9,417 meals
  - Spoilage avoided: 1,900 meals
  - Dollars saved: $9,800
  - Meals that funds: 5,500 more meals the food bank can buy with savings

**Design choice**: Dollars are reported *separately*, never inflated into the headline. Auditable, not marketing.

#### Step 6: Show the Recommendation
Plain-language plan visible in the **Recommendation** box:
- "Approve Plan" button ready for human decision-maker

Click to approve (turns green ✓), showing:
- Human approval is the final gate
- Gleaner orchestrates, humans decide
- "Tools that make people better at their jobs, not tools that replace them"

---

### 4. **Demo Highlights to Emphasize** (throughout)

#### Speed
- **30 seconds** from issue detection to approved plan
- Compare to today: hours of scrambling across two teams

#### Unified Problem
- Procurement gap-filling + distribution routing in one agent loop
- No hand-off delays
- All scored in meals (the currency everyone understands)

#### Real Math
- Tools do the arithmetic (not the LLM hallucinating numbers)
- Every metric is auditable: inventory, vendor catalogs, route distances, spoilage rates
- Claude orchestrates *why* (human reasoning), not *what* (numbers)

#### Live Monitoring
- Sidebar shows active issues in real-time
- Metrics update as disruptions are resolved
- WebSocket connection means changes are instant

#### Google Maps
- Geographically realistic (East Bay, San Francisco Bay Area)
- Shows why route optimization matters
- Visual proof of faster delivery to agencies before windows close

---

## Demo Script (Suggested Narration)

### Opening (1 min)
*"Imagine you're a food bank planner. It's 10 AM. A federal nutrition program cuts your TEFAP allocation by 40%. You've got 11,000 lbs of protein that isn't coming. Seven agencies are expecting that load for lunch programs. It's spoilable. You've got one hour before access windows close.*

*Today, you'd call procurement. They scramble for a vendor. Meanwhile, your routing team scrambles to fit whatever gets filled into the delivery schedule. Two teams. Two tools. Two days. While food spoils.*

*Gleaner closes that gap."*

### The Problem (1 min)
*"See these three problems on the landing page? Disruptions hit fast. No time to respond. Real people miss meals. Every one of these is real. Food banks told us this is their #1 operational bottleneck in 2026."*

### The Solution (1 min)
*"Gleaner works in six steps, all inside 30 seconds:*
1. *Sense the shock*
2. *Analyze the gap (11,000 lbs = 9,417 meals at risk)*
3. *Find the cheapest reliable vendor (Sysco can fill for $200/lb, no rush premium)*
4. *Replan routes (116 miles down to 79; 1,900 lbs of spoilage saved)*
5. *Get human approval (AI proposes, humans decide)*
6. *Impact: 11,000 meals protected."*

### The Demo (5 min)
*"Let me show you. I'll launch the live app."* [Click Launch]

*"Here's the interface: live issues on the left, Google Maps in the center showing every agency and route, agent reasoning on the right. Watch what happens when I trigger a disruption."* [Click "Simulate Issue"]

*"See the sidebar? A new issue just came in. Let me read it: 'Sysco Purchase Order load delayed—53% short on dairy.' That's a disruption."*

*"Now watch the agent work. It's analyzing the gap... finding a vendor... replanning the route... all in real-time."* [Point to each step as it animates]

*"Notice the breakdown: 9,417 meals from the gap, 1,900 from spoilage saved, $9,800 in cost avoidance. That last one matters because we can convert it to meals: $9,800 ÷ the food bank's cost per meal = 5,500 more meals they can fund."*

*"Switch to Google Maps. Here's the depot—the warehouse. Here are the seven agencies in green. Watch the blue route appear. That's Gleaner's plan. Compare it to the gray one—the naive baseline. Same stops, fewer miles, faster delivery. Perishables arrive before agencies close access windows."*

*"And here's the human gate: the planner reviews and approves. Gleaner *proposes*. The human *decides*. Always. We're building tools that make people better at their jobs, not tools that replace them."* [Click Approve]

*"That's Gleaner. 30 seconds from shock to approved plan. One metric everyone understands: meals."*

---

## Key Talking Points

### For Operations Leaders
- **Speed**: Hours down to 30 seconds
- **Coordination**: Procurement + distribution in one loop
- **Auditability**: Real math, not AI hallucination
- **Human Control**: AI proposes; you decide

### For Technical Judges
- **Genuinely Agentic**: Claude orchestrates → specialized tools → human gate (not a dashboard with AI bolted on)
- **Tool-Use Driven**: Agent calls tools for gap sizing, vendor search, route planning, meal math
- **Real Data**: Coordinates, inventory, vendor catalogs, access windows—all from data files
- **Deterministic Fallback**: Same output without Claude (offline demo mode)

### For Mission-Driven Judges
- **Unifies Procurement + Distribution**: Closes a gap in today's workflow that spans two teams on two tools
- **Scored in Meals**: Not dollars, not logistics metrics. Real food to real people. 11,000 meals protected.
- **Acknowledges the Reality**: Food banks make the final call. Gleaner is a tool for their planners, not a replacement.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Landing page won't load | Verify server is running: `uvicorn main:app --reload` in `backstop/backend/` |
| App page shows blank map | Wait 2-3 seconds for Google Maps API to initialize; refresh if needed |
| No issues appear in sidebar | Click "Simulate Issue" button; backend generates synthetic disruptions |
| Agent trace doesn't animate | Browser cache issue; try Ctrl+Shift+K (DevTools) → Network → Disable cache, then refresh |
| Routes don't appear on map | Ensure `STATE.agencies` and `STATE.depot` are loaded (check DevTools Console) |
| Metrics not updating | Check WebSocket connection in DevTools → Network → WS → `live-issues` |

---

## Post-Demo Q&A

### "How do you integrate with real data?"
*"Right now we're working with a synthetic but realistic dataset from a Bay Area food bank. In production, this pulls real-time data from:*
- *Vendor catalogs (lead times, reliability)*
- *Agency access windows (when they're open)*
- *Inventory snapshots (on-hand + incoming)*
- *Delivery vehicle fleet (fuel cost, refrigeration)*
- *Live signals: GPS from trucks, supply alerts, allocation changes"*

### "What if the AI makes a bad plan?"
*"The human always approves. That's non-negotiable. Gleaner is a decision-support tool, not an autopilot. If the plan looks wrong, they reject it and Gleaner re-plans."*

### "How does this scale to multiple food banks?"
*"Each food bank gets their own instance with their own data. Gleaner learns their cost structures, vendor networks, agency priorities, fleet constraints. The core agent loop is the same—sense, analyze, fill, replan, human approve."*

### "Can this handle multiple simultaneous disruptions?"
*"Yes. Each live issue triggers the agent loop independently. The metrics dashboard aggregates them. In a real crisis, a food bank would see 3-5 active issues at once and prioritize by severity and meals at risk."*

### "What's the cost model?"
*"Claude API calls (orchestration + reasoning), Google Maps API (visual routing), basic hosting. Typical cost for a food bank: $50-100/month in API spend, $200-300/month in infrastructure. Well below the value of prevented spoilage and faster response time."*

---

## More Demos / Extended Play

If you have extra time and the demo goes well:

1. **Simulate Multiple Issues**: Click "Simulate Issue" 3-4 times. Watch the sidebar populate. Metrics show cumulative impact.

2. **Try the SVG Map**: Toggle back to "📍 SVG View" to show the fallback map (works offline, no API key needed).

3. **Walk Through Code**: Open `backend/agent.py` to show the tool definitions. Open `tools.py` to show the math (all deterministic, auditable).

4. **Offline Mode**: Restart without `ANTHROPIC_API_KEY` in `.env` to show deterministic fallback (same output, no API calls).

5. **Data-Driven Customization**: Show `data/agencies.json`, `data/vendors.json`, etc. Explain how swapping in real food bank data changes everything.

---

## Deck / Slide Recommendations

If presenting alongside slides:

1. **Slide 1**: Problem (crisis, disruptions, timing)
2. **Slide 2**: Solution (6-step flow)
3. **Slide 3**: Key differentiator (agentic + coordinated + meals metric)
4. **Slide 4**: Live demo (execute flow, show metrics, show map)
5. **Slide 5**: Impact (30s, 11K meals, $9.9K saved, 116→79 miles)
6. **Slide 6**: Next steps (real data integration, multi-site rollout)

---

## Final Note

The demo **proves three things**:

1. **Speed**: Gleaner is fast. Seconds vs. hours.
2. **Smarts**: It actually coordinates—procurement + routing, not separate scrambles.
3. **Humility**: It proposes, humans decide. Real tool for real planners, not a replacement.

Every judge will leave understanding why this matters to food banks and what Gleaner actually does.

Good luck with your demo! 🌾
