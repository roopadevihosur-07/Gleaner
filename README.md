# Backstop — Disruption-to-Dispatch Agent for Food Banks

When a federal or donated inbound load is **cut or short-shipped**, Backstop turns
one supply shock into one coordinated recovery plan — and scores every option in a
single currency everyone understands: **meals**.

It closes the loop that today spans two teams on two tools on two different days:
a procurement scramble to *fill the gap*, and a distribution scramble to *deliver it*
before perishables spoil.

```
Supply shock ─▶ Sense ─▶ Orchestrator agent ─▶ [Gap · Procurement · Routing] ─▶ Human approves ─▶ Act
                                    └────────────── everything scored in MEALS ──────────────┘
```

---

## Quickstart (2 minutes)

```bash
cd backstop
python3 -m venv .venv && source .venv/bin/activate      # optional but recommended
pip install -r requirements.txt

# Optional — turns on the REAL Claude tool-use agent. Without it, a deterministic
# engine runs the same tools so the demo always works offline.
cp .env.example .env        # then paste your ANTHROPIC_API_KEY into .env

cd backend
uvicorn main:app --reload
```

Open **http://127.0.0.1:8000** and click **“Cut load”** on the TEFAP protein truck.

> No API key? It still runs — the header shows `engine: deterministic`. Add a key and
> it flips to `engine: claude:…` and Claude drives the tool-use loop itself.

---

## What happens when you cut the TEFAP load (the demo)

1. **Sense** — Backstop detects the cut inbound load.
2. **Gap analyst** — 11,300 lbs of protein short → **9,417 meals at risk** across 7 agencies.
3. **Procurement agent** — covers it via the cheapest reliable vendor in time,
   avoiding a **~$9,800 rush premium** vs a same-day dock buy.
4. **Routing agent** — re-sequences the day on access windows + perishability + fuel:
   **116 → 79 miles**, and **1,900 lbs of protein saved from spoiling** (delivered
   inside each agency’s window instead of after it closes).
5. **Human approves** — the agent *proposes*; a planner clicks **Approve**. Nothing
   auto-executes. Augment, don’t replace.
6. **Impact** — headline **~11,000 meals protected**, plus **~$9,900 saved** shown
   separately as ~5,500 more meals the food bank can now fund.

Toggle **Naive ↔ Backstop** on the map to show the before/after route live.

---

## Architecture

| Layer | File | What it does |
|---|---|---|
| API + static host | `backend/main.py` | FastAPI; `/api/state`, `/api/disrupt`, serves the UI |
| Orchestrator | `backend/agent.py` | Real Claude tool-use loop **and** a deterministic fallback (same output shape) |
| Deterministic tools | `backend/tools.py` | `size_gap`, `find_fill` (procurement), `replan_routes` (routing), meals roll-up |
| Data | `backend/data/*.json` | East Bay / ACCFB-flavored inventory, commitments, vendors, agencies, fleet |
| UI | `frontend/index.html` | One file: SVG map, animated agent trace, meals impact card |

**Design choice that matters to judges:** the LLM *orchestrates and narrates*; the
**tools do the arithmetic**, so every number is auditable rather than hallucinated.
This is the pattern the agent-in-SCM judges will want to see.

### The meals model (defensible on purpose)
- **Headline “meals protected” = real food to real people only:** gap covered in
  meals (`lbs ÷ 1.2`) + perishables saved from spoiling.
- **Dollars saved** (procurement premium + fuel) are reported **separately** and
  converted at the food bank’s **own cost per meal** (“meals you can now fund”) —
  never inflated into the headline. Don’t let anyone accuse you of double-counting.

---

## Swap in a real food bank

Everything is data-driven. To tailor to the food bank you interviewed, edit
`backend/data/`:
- `agencies.json` — real partner sites, lat/lng, access windows, equity priority
- `vendors.json` — their actual purchasable catalog + lead times + reliability
- `commitments.json` — their real inbound schedule (TEFAP, donors, POs)
- `fleet.json` — trucks, refrigeration, fuel cost/mile, depot

One real number from their team on a slide beats any assumption.

---

## Extending it (if you have time tonight)

- **Stream the trace** with Server-Sent Events for a more “live agent” feel.
- **Add the EV-charging specialist** (Theme 4): schedule overnight charging against
  tomorrow’s routes under a power cap.
- **Vendor reliability learning:** persist outcomes and update `reliability` per cycle.
- **Voice/plain-language ask** (Theme 6): a `/api/ask` endpoint that lets a driver
  ask a question and routes it to the orchestrator.

---

## Talking points for the pitch

- The industry’s #1 stated 2026 need is **disruption response speed** — cutting the
  time from “a signal lands” to “a plan exists” from days to seconds. Food banks are
  the sharpest edge of it: ~$1B in federal cuts into a 25–40% demand surge.
- Backstop is **genuinely agentic** (orchestrator → specialist tools → human gate),
  not a dashboard with “AI” bolted on.
- It **unifies procurement + distribution** — the two halves of the same shock.
- It honors the ACCFB brief: *tools that make people better at their jobs, not tools
  that do their jobs.* The human always approves.
- One number the whole room gets: **meals**.

*Frame the agents as reacting faster once a signal lands — never as predicting policy
or tariffs. This panel knows the difference.*
