"""
Gleaner orchestrator.

Two execution paths, same output shape:
  * If ANTHROPIC_API_KEY is set  -> a real Claude tool-use loop drives the plan.
  * Otherwise                    -> a deterministic sequence runs the same tools,
                                     so the demo never depends on the network.

The tools do the arithmetic; the agent sequences, reasons, and narrates.
Every recommendation is scored in MEALS.
"""
from __future__ import annotations

import json
import os

import tools

MODEL = os.environ.get("BACKSTOP_MODEL", "claude-sonnet-5")

SYSTEM = """You are Gleaner, the disruption-to-dispatch orchestrator for a food bank.
A supply shock just occurred (a federal or donated inbound load was cut or short-shipped).
Your job: turn one shock into one coordinated recovery plan, and score every option in MEALS.

Rules:
- You do NOT execute anything. You PROPOSE a plan a human planner approves. Augment, don't replace.
- Use the tools for all numbers. Never invent figures.
- Work the loop in order: size_gap -> find_fill -> replan_routes -> summarize_impact.
- Protect the highest-priority (equity) agencies and perishable product first.
- End with a short, plain-language recommendation a warehouse lead can act on.
"""

TOOLS = [
    {
        "name": "size_gap",
        "description": "Quantify the category shortfall created by a cut/short inbound load, net of on-hand inventory and other inbound. Returns meals at risk and affected agencies.",
        "input_schema": {
            "type": "object",
            "properties": {"commitment_id": {"type": "string", "description": "ID of the cut load, e.g. TEFAP-1042"}},
            "required": ["commitment_id"],
        },
    },
    {
        "name": "find_fill",
        "description": "Select cheapest reliable vendors that can deliver in time to cover the shortfall; report premium avoided vs a panic dock buy.",
        "input_schema": {
            "type": "object",
            "properties": {
                "category": {"type": "string"},
                "shortfall_lbs": {"type": "number"},
                "days_until_need": {"type": "integer"},
            },
            "required": ["category", "shortfall_lbs"],
        },
    },
    {
        "name": "replan_routes",
        "description": "Re-optimize the delivery day on access windows, perishability and fuel cost vs a naive dispatch. Returns fuel saved and perishable lbs saved.",
        "input_schema": {
            "type": "object",
            "properties": {"category": {"type": "string"}},
            "required": ["category"],
        },
    },
    {
        "name": "summarize_impact",
        "description": "Roll gap, fill and routing into one meals-based impact summary.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
]


def _dispatch(name, args, state):
    """Execute a tool call and stash structured results in `state`."""
    if name == "size_gap":
        state["gap"] = tools.size_gap(args["commitment_id"])
        return state["gap"]
    if name == "find_fill":
        state["fill"] = tools.find_fill(
            args["category"], args["shortfall_lbs"], int(args.get("days_until_need", 2))
        )
        return state["fill"]
    if name == "replan_routes":
        state["routing"] = tools.replan_routes(args["category"])
        return state["routing"]
    if name == "summarize_impact":
        state["summary"] = tools.summarize(state["gap"], state["fill"], state["routing"])
        return state["summary"]
    raise ValueError(f"Unknown tool {name}")


# --- Deterministic path -------------------------------------------------------
def run_deterministic(commitment_id: str) -> dict:
    state, trace = {}, []

    trace.append({"step": "sense", "title": "Disruption detected",
                  "detail": f"Inbound load {commitment_id} was cut. Framing the shock."})

    gap = _dispatch("size_gap", {"commitment_id": commitment_id}, state)
    trace.append({"step": "gap", "title": "Gap analyst",
                  "detail": f"{gap['shortfall_lbs']:,} lbs short of {gap['category']} — "
                            f"{gap['meals_at_risk']:,} meals at risk across "
                            f"{len(gap['affected_agencies'])} agencies.",
                  "data": gap})

    fill = _dispatch("find_fill", {"category": gap["category"],
                                   "shortfall_lbs": gap["shortfall_lbs"]}, state)
    vendors = ", ".join(li["vendor"] for li in fill["line_items"]) or "no vendor"
    trace.append({"step": "fill", "title": "Procurement agent",
                  "detail": f"Cover {fill['filled_lbs']:,} lbs via {vendors}. "
                            f"${fill['premium_avoided']:,.0f} premium avoided vs a dock buy.",
                  "data": fill})

    routing = _dispatch("replan_routes", {"category": gap["category"]}, state)
    trace.append({"step": "route", "title": "Routing agent",
                  "detail": f"Re-sequenced on windows + fuel: "
                            f"{routing['baseline']['miles']}→{routing['optimized']['miles']} mi, "
                            f"${routing['fuel_saved']:,.0f} fuel saved, "
                            f"{routing['perishable_lbs_saved']:,} lbs spoilage avoided.",
                  "data": routing})

    summary = _dispatch("summarize_impact", {}, state)
    trace.append({"step": "human", "title": "Awaiting planner approval",
                  "detail": "Agent proposes; a human approves before anything executes."})

    rec = (f"Buy {fill['filled_lbs']:,} lbs {gap['category']} "
           f"(best: {fill['line_items'][0]['vendor'] if fill['line_items'] else 'n/a'}), "
           f"run the window-aware route, and protect "
           f"{', '.join(a['name'] for a in gap['affected_agencies'][:2])} first. "
           f"Net: {summary['total_meals']:,} meals protected.")

    return {"engine": "deterministic", "trace": trace, "gap": gap, "fill": fill,
            "routing": routing, "summary": summary, "recommendation": rec}


# --- Real Claude tool-use path ------------------------------------------------
def run_with_claude(commitment_id: str) -> dict:
    from anthropic import Anthropic

    client = Anthropic()
    state, trace = {}, []
    messages = [{
        "role": "user",
        "content": (f"Disruption: inbound load {commitment_id} was just cut/short-shipped. "
                    f"Build the recovery plan and score it in meals."),
    }]

    for _ in range(8):  # safety bound on the agent loop
        resp = client.messages.create(
            model=MODEL, max_tokens=1500, system=SYSTEM, tools=TOOLS, messages=messages,
        )
        messages.append({"role": "assistant", "content": resp.content})

        tool_uses = [b for b in resp.content if b.type == "tool_use"]
        for b in resp.content:
            if b.type == "text" and b.text.strip():
                trace.append({"step": "reason", "title": "Orchestrator", "detail": b.text.strip()})

        if not tool_uses:
            break

        results = []
        for tu in tool_uses:
            out = _dispatch(tu.name, tu.input, state)
            trace.append({"step": tu.name, "title": tu.name, "detail": None, "data": out})
            results.append({"type": "tool_result", "tool_use_id": tu.id,
                            "content": json.dumps(out, default=str)})
        messages.append({"role": "user", "content": results})

    if "summary" not in state and state.get("gap") and state.get("fill") and state.get("routing"):
        state["summary"] = tools.summarize(state["gap"], state["fill"], state["routing"])

    final_text = next((t["detail"] for t in reversed(trace) if t["step"] == "reason"), "")
    return {"engine": f"claude:{MODEL}", "trace": trace, "gap": state.get("gap"),
            "fill": state.get("fill"), "routing": state.get("routing"),
            "summary": state.get("summary"), "recommendation": final_text}


def run(commitment_id: str) -> dict:
    if os.environ.get("ANTHROPIC_API_KEY"):
        try:
            return run_with_claude(commitment_id)
        except Exception as e:  # never let the demo die on a network/API hiccup
            out = run_deterministic(commitment_id)
            out["engine"] += f" (fell back from Claude: {e})"
            return out
    return run_deterministic(commitment_id)
