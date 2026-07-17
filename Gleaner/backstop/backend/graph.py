"""Supply-chain as a graph.

Nodes: suppliers (left) -> warehouse/depot (center) -> customers/agencies (right).
Edges: supply lanes (supplier->depot) and delivery lanes (depot->customer).

When a lane fails, we search the graph for alternate supply paths that restore
flow, and rank candidate solutions by cost / speed / reliability. The result is
both a set of ranked solutions AND a positioned graph the UI can draw.
"""
from __future__ import annotations

import networkx as nx

import tools

DEPOT = "DEPOT"


def build_graph():
    data = tools.load_all()
    g = nx.DiGraph()

    depot = data["fleet"]["depot"]
    g.add_node(DEPOT, kind="depot", label=depot["name"], lat=depot["lat"], lng=depot["lng"])

    # Suppliers = committed inbound sources + purchasable vendors.
    for c in data["commitments"]:
        g.add_node(c["id"], kind="supplier", label=c["source"], category=c["category"])
        g.add_edge(c["id"], DEPOT, kind="supply", category=c["category"], lbs=c["lbs"],
                   lead_time_days=0, reliability=0.95, cost_per_lb=0.0, status="ok",
                   committed=True)
    for v in data["vendors"]:
        vid = "V:" + v["vendor"]
        g.add_node(vid, kind="vendor", label=v["vendor"], category=v["category"])
        g.add_edge(vid, DEPOT, kind="supply", category=v["category"], lbs=v["in_stock_lbs"],
                   lead_time_days=v["lead_time_days"], reliability=v["reliability"],
                   cost_per_lb=v["price_per_lb"], status="standby", committed=False)

    # Customers = agencies.
    for a in data["agencies"]:
        g.add_node(a["id"], kind="customer", label=a["name"], lat=a["lat"], lng=a["lng"],
                   priority=a["priority"], window_close=a["window_close"])
        total = sum(a["demand_lbs"].values())
        g.add_edge(DEPOT, a["id"], kind="delivery", miles=None, lbs=total,
                   window_close=a["window_close"], status="ok")
    return g


def positioned(g, failed_edge=None, chosen_path=None):
    """Return nodes with x/y for the UI, plus edges with a display status."""
    kinds = {"supplier": [], "vendor": [], "depot": [], "customer": []}
    for n, d in g.nodes(data=True):
        kinds[d["kind"]].append(n)

    cols = {"supplier": 0.10, "vendor": 0.10, "depot": 0.5, "customer": 0.9}
    nodes = []
    left = kinds["supplier"] + kinds["vendor"]
    for i, n in enumerate(left):
        d = g.nodes[n]
        nodes.append({"id": n, "label": d["label"], "kind": d["kind"],
                      "category": d.get("category"),
                      "x": 0.10, "y": (i + 1) / (len(left) + 1)})
    nodes.append({"id": DEPOT, "label": g.nodes[DEPOT]["label"], "kind": "depot",
                  "x": 0.5, "y": 0.5})
    cust = kinds["customer"]
    for i, n in enumerate(cust):
        d = g.nodes[n]
        nodes.append({"id": n, "label": d["label"], "kind": "customer",
                      "priority": d.get("priority"),
                      "x": 0.9, "y": (i + 1) / (len(cust) + 1)})

    chosen_set = set()
    if chosen_path:
        chosen_set = {(chosen_path[i], chosen_path[i + 1]) for i in range(len(chosen_path) - 1)}

    edges = []
    for u, v, d in g.edges(data=True):
        status = d.get("status", "ok")
        if failed_edge and (u, v) == tuple(failed_edge):
            status = "failed"
        elif (u, v) in chosen_set:
            status = "alternate"
        edges.append({"from": u, "to": v, "kind": d["kind"], "status": status,
                      "category": d.get("category")})
    return {"nodes": nodes, "edges": edges}


def solutions_for(category: str, shortfall_lbs: float, risk: dict) -> list:
    """Three distinct strategies over the alternate supply edges, each a real
    path Supplier -> Depot -> (protected customers)."""
    data = tools.load_all()
    vendors = [v for v in data["vendors"] if v["category"] == category]
    if not vendors or shortfall_lbs <= 0:
        return []

    objective = risk.get("objective", "balanced")

    def pick(sort_key, name, why):
        chosen, remaining, cost, rel_num, lead = [], shortfall_lbs, 0.0, 0.0, 0
        for v in sorted(vendors, key=sort_key):
            if remaining <= 0:
                break
            take = min(remaining, v["in_stock_lbs"])
            chosen.append({"vendor": v["vendor"], "lbs": round(take),
                           "price_per_lb": v["price_per_lb"], "lead_time_days": v["lead_time_days"],
                           "reliability": v["reliability"]})
            cost += take * v["price_per_lb"]
            rel_num += take * v["reliability"]
            lead = max(lead, v["lead_time_days"])
            remaining -= take
        filled = shortfall_lbs - max(0, remaining)
        return {
            "strategy": name, "why": why,
            "vendors": chosen,
            "filled_lbs": round(filled),
            "cost": round(cost, 2),
            "avg_reliability": round(rel_num / filled, 3) if filled else 0,
            "max_lead_days": lead,
            "meals_covered": round(tools.lbs_to_meals(filled)),
            "path": [("V:" + chosen[0]["vendor"]) if chosen else None, DEPOT],
        }

    sols = [
        pick(lambda v: (v["price_per_lb"], -v["reliability"]), "Lowest cost",
             "Cheapest reliable vendors that can deliver in the window."),
        pick(lambda v: (v["lead_time_days"], v["price_per_lb"]), "Fastest",
             "Shortest lead time — restores flow soonest, costs a little more."),
        pick(lambda v: (-v["reliability"], v["price_per_lb"]), "Most reliable",
             "Highest on-time-in-full history — safest for critical categories."),
    ]

    # Rank per the company's stated objective; mark the recommended one.
    rank_key = {
        "cheapest": lambda s: s["cost"],
        "fastest": lambda s: s["max_lead_days"],
        "most_reliable": lambda s: -s["avg_reliability"],
        "balanced": lambda s: s["cost"] / max(s["avg_reliability"], 0.01) + s["max_lead_days"] * 500,
    }.get(objective, lambda s: s["cost"])
    best = min(sols, key=rank_key)
    for i, s in enumerate(sols):
        s["id"] = f"SOL-{i+1}"
        s["recommended"] = (s is best)
    return sols
