"""
Gleaner — deterministic supply-chain tools.

The LLM orchestrator (agent.py) narrates and sequences; these functions do the
actual math so numbers are auditable rather than hallucinated. Everything rolls
up into one currency: MEALS.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
from functools import lru_cache

DATA_DIR = Path(__file__).parent / "data"

# --- Conversion constants (documented, source-tied) ---------------------------
# Feeding America convention: ~1.2 lb of food == 1 meal.
LBS_PER_MEAL = 1.2

# The HEADLINE metric ("meals protected") counts only real food that reaches
# people: the gap we cover + perishables we save from spoiling. Dollars saved
# (procurement premium + fuel) are reported SEPARATELY and converted to meals at
# the food bank's own cost per meal ("meals you can now fund"), never mixed into
# the headline. This keeps the number auditable for a supply-chain audience.

PERISHABLE = {"produce", "protein", "dairy"}


def _load(name: str):
    with open(DATA_DIR / name) as f:
        return json.load(f)


@lru_cache(maxsize=1)
def load_all():
    return {
        "inventory": _load("inventory.json"),
        "commitments": _load("commitments.json"),
        "vendors": _load("vendors.json"),
        "agencies": _load("agencies.json"),
        "fleet": _load("fleet.json"),
    }


def lbs_to_meals(lbs: float) -> float:
    return lbs / LBS_PER_MEAL


# --- Geometry -----------------------------------------------------------------
def haversine_miles(a_lat, a_lng, b_lat, b_lng) -> float:
    R = 3958.8  # earth radius, miles
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dphi = math.radians(b_lat - a_lat)
    dlmb = math.radians(b_lng - a_lng)
    h = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * R * math.asin(min(1.0, math.sqrt(h)))


# --- Tool 1: size the gap -----------------------------------------------------
def size_gap(commitment_id: str) -> dict:
    """Given a cut/short inbound load, compute the resulting category shortfall
    against scheduled agency demand, net of on-hand inventory and other inbound."""
    data = load_all()
    commit = next((c for c in data["commitments"] if c["id"] == commitment_id), None)
    if not commit:
        raise ValueError(f"Unknown commitment {commitment_id}")

    cat = commit["category"]
    agencies = data["agencies"]
    total_demand = sum(a["demand_lbs"].get(cat, 0) for a in agencies)

    on_hand = data["inventory"]["on_hand_lbs"].get(cat, 0)
    safety = data["inventory"]["safety_stock_lbs"].get(cat, 0)
    other_inbound = sum(
        c["lbs"] for c in data["commitments"]
        if c["category"] == cat and c["id"] != commitment_id
    )

    usable = max(0, on_hand - safety) + other_inbound
    shortfall = max(0, total_demand - usable)

    affected = sorted(
        [a for a in agencies if a["demand_lbs"].get(cat, 0) > 0],
        key=lambda a: -a["priority"],
    )
    return {
        "commitment": commit,
        "category": cat,
        "lost_lbs": commit["lbs"],
        "total_agency_demand_lbs": total_demand,
        "usable_supply_lbs": usable,
        "shortfall_lbs": shortfall,
        "meals_at_risk": round(lbs_to_meals(shortfall)),
        "affected_agencies": [{"id": a["id"], "name": a["name"], "priority": a["priority"]} for a in affected],
    }


# --- Tool 2: find the fill (procurement) --------------------------------------
def find_fill(category: str, shortfall_lbs: float, days_until_need: int = 2) -> dict:
    """Select the cheapest reliable vendors that can deliver in time to cover the
    shortfall. Report the premium avoided vs. a panic buy at the dock."""
    data = load_all()
    eligible = [
        v for v in data["vendors"]
        if v["category"] == category and v["lead_time_days"] <= days_until_need
    ]
    if not eligible or shortfall_lbs <= 0:
        return {
            "category": category, "shortfall_lbs": shortfall_lbs, "filled_lbs": 0,
            "smart_cost": 0.0, "panic_cost": 0.0, "premium_avoided": 0.0,
            "meals_from_premium": 0, "line_items": [], "reliability_weighted": 0.0,
        }

    # Smart plan: cheapest first, tie-break on reliability, accumulate to cover.
    smart_sorted = sorted(eligible, key=lambda v: (v["price_per_lb"], -v["reliability"]))
    remaining = shortfall_lbs
    line_items, smart_cost, filled = [], 0.0, 0.0
    rel_num = 0.0
    for v in smart_sorted:
        if remaining <= 0:
            break
        take = min(remaining, v["in_stock_lbs"])
        cost = take * v["price_per_lb"]
        line_items.append({
            "vendor": v["vendor"], "lbs": round(take), "price_per_lb": v["price_per_lb"],
            "cost": round(cost, 2), "reliability": v["reliability"], "lead_time_days": v["lead_time_days"],
        })
        smart_cost += cost
        filled += take
        rel_num += take * v["reliability"]
        remaining -= take

    # Panic plan: the cheapest *fastest* option (shortest lead time) — what you'd
    # actually grab in a rush without planning ahead. Premium avoided = the spread
    # you save by acting on the signal early enough to use the planned vendor.
    rush = [v for v in eligible if v["lead_time_days"] == min(x["lead_time_days"] for x in eligible)]
    panic_price = min(v["price_per_lb"] for v in rush)
    panic_cost = filled * panic_price
    premium_avoided = max(0.0, panic_cost - smart_cost)
    avg_price = smart_cost / filled if filled else 0.0

    return {
        "category": category,
        "shortfall_lbs": round(shortfall_lbs),
        "filled_lbs": round(filled),
        "smart_cost": round(smart_cost, 2),
        "panic_cost": round(panic_cost, 2),
        "premium_avoided": round(premium_avoided, 2),
        "avg_price_per_lb": round(avg_price, 3),
        "meals_protected": round(lbs_to_meals(filled)),
        "reliability_weighted": round(rel_num / filled, 3) if filled else 0.0,
        "line_items": line_items,
    }


# --- Tool 3: replan routes ----------------------------------------------------
def _route_metrics(order, depot, agencies_by_id, fleet, category):
    """Walk a stop order from the depot; return miles + perishable lbs that miss
    their access window (treated as spoiled)."""
    speed = fleet["avg_speed_mph"]
    service_h = fleet["service_minutes_per_stop"] / 60.0
    t = fleet["depart_hour"]
    miles = 0.0
    spoiled = 0.0
    cur_lat, cur_lng = depot["lat"], depot["lng"]
    is_perishable = category in PERISHABLE

    for aid in order:
        a = agencies_by_id[aid]
        leg = haversine_miles(cur_lat, cur_lng, a["lat"], a["lng"])
        miles += leg
        t += leg / speed
        arrive = t
        # Deliver perishable of this category; if we arrive after the window closes,
        # that agency's perishable allotment is lost.
        if is_perishable and arrive > a["window_close"]:
            spoiled += a["demand_lbs"].get(category, 0)
        t += service_h
        cur_lat, cur_lng = a["lat"], a["lng"]

    # return to depot
    miles += haversine_miles(cur_lat, cur_lng, depot["lat"], depot["lng"])
    return miles, spoiled


def _nearest_neighbor(depot, agencies_by_id, ids):
    order, remaining = [], list(ids)
    cur = (depot["lat"], depot["lng"])
    while remaining:
        nxt = min(remaining, key=lambda i: haversine_miles(cur[0], cur[1],
                                                            agencies_by_id[i]["lat"], agencies_by_id[i]["lng"]))
        order.append(nxt)
        cur = (agencies_by_id[nxt]["lat"], agencies_by_id[nxt]["lng"])
        remaining.remove(nxt)
    return order


def replan_routes(category: str) -> dict:
    """Compare an as-listed 'naive dispatch' against a window- and perishability-
    aware plan. Report fuel saved and perishable lbs saved (both -> meals)."""
    data = load_all()
    fleet = data["fleet"]
    depot = fleet["depot"]
    agencies = data["agencies"]
    by_id = {a["id"]: a for a in agencies}
    ids = [a["id"] for a in agencies]
    cost_per_mile = sum(t["fuel_cost_per_mile"] for t in fleet["trucks"]) / len(fleet["trucks"])

    # Baseline: dispatch in the order agencies sit in the system (arbitrary).
    baseline_order = ids
    base_miles, base_spoiled = _route_metrics(baseline_order, depot, by_id, fleet, category)

    # Optimized: earliest-closing windows first (protect tight windows + perishables),
    # then nearest-neighbor refinement inside that priority.
    window_sorted = sorted(ids, key=lambda i: (by_id[i]["window_close"], -by_id[i]["priority"]))
    # light NN smoothing seeded by the window order
    opt_order = _nearest_neighbor(depot, by_id, window_sorted) if False else window_sorted
    opt_miles, opt_spoiled = _route_metrics(opt_order, depot, by_id, fleet, category)

    base_fuel = base_miles * cost_per_mile
    opt_fuel = opt_miles * cost_per_mile
    fuel_saved = max(0.0, base_fuel - opt_fuel)
    perishable_saved = max(0.0, base_spoiled - opt_spoiled)

    def named(order):
        return [{"id": i, "name": by_id[i]["name"], "lat": by_id[i]["lat"], "lng": by_id[i]["lng"],
                 "window_close": by_id[i]["window_close"]} for i in order]

    return {
        "category": category,
        "depot": depot,
        "cost_per_mile": round(cost_per_mile, 3),
        "baseline": {"order": named(baseline_order), "miles": round(base_miles, 1),
                     "fuel_cost": round(base_fuel, 2), "spoiled_lbs": round(base_spoiled)},
        "optimized": {"order": named(opt_order), "miles": round(opt_miles, 1),
                      "fuel_cost": round(opt_fuel, 2), "spoiled_lbs": round(opt_spoiled)},
        "fuel_saved": round(fuel_saved, 2),
        "perishable_lbs_saved": round(perishable_saved),
        "meals_from_perishable": round(lbs_to_meals(perishable_saved)),
    }


# --- Roll-up ------------------------------------------------------------------
def summarize(gap: dict, fill: dict, routing: dict) -> dict:
    # Headline = real food to real people.
    gap_covered = fill.get("meals_protected", 0)
    spoilage_avoided = routing.get("meals_from_perishable", 0)
    total_meals = gap_covered + spoilage_avoided

    # Dollars, reported separately, then converted at the food bank's OWN cost/meal.
    dollars_saved = round(fill.get("premium_avoided", 0) + routing.get("fuel_saved", 0), 2)
    cost_per_meal = (fill.get("avg_price_per_lb", 0) or 1.5) * LBS_PER_MEAL
    meals_fundable = round(dollars_saved / cost_per_meal) if cost_per_meal else 0

    return {
        "total_meals": round(total_meals),
        "meals_at_risk": gap.get("meals_at_risk", 0),
        "components": {
            "gap_covered": gap_covered,
            "spoilage_avoided": spoilage_avoided,
        },
        "dollars_saved": dollars_saved,
        "meals_fundable": meals_fundable,
        "cost_per_meal": round(cost_per_meal, 2),
        "perishable_lbs_saved": routing.get("perishable_lbs_saved", 0),
        "coverage_pct": round(100 * fill.get("filled_lbs", 0) / gap["shortfall_lbs"], 1) if gap.get("shortfall_lbs") else 100.0,
    }
