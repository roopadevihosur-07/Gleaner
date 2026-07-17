"""Tiny JSON-file persistence for the Gleaner platform.

Holds three things that must survive a restart:
  - the company's ingested live data (from Excel/CSV/MCP)
  - the company's risk-management config
  - the incident memory (every disruption + how it was solved), timestamped
"""
from __future__ import annotations

import json
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock

STORE_DIR = Path(__file__).parent / "store"
STORE_DIR.mkdir(exist_ok=True)

_LOCK = Lock()

RISK_FILE = STORE_DIR / "risk_config.json"
INGEST_FILE = STORE_DIR / "ingested.json"
INCIDENTS_FILE = STORE_DIR / "incidents.json"

DEFAULT_RISK = {
    "company": "Demo Foods Co.",
    "shortfall_trigger_pct": 15,      # a gap above this % of demand raises severity
    "critical_categories": ["protein", "dairy"],
    "auto_approve": False,            # human-in-the-loop by default
    "priority_customers": [],         # ids that must be protected first
    "objective": "balanced",          # cheapest | fastest | most_reliable | balanced
}


def _read(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text())
    except Exception:
        return default


def _write(path: Path, data):
    with _LOCK:
        path.write_text(json.dumps(data, indent=2, default=str))


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


# --- risk config --------------------------------------------------------------
def get_risk() -> dict:
    return _read(RISK_FILE, DEFAULT_RISK)


def save_risk(cfg: dict) -> dict:
    merged = {**DEFAULT_RISK, **get_risk(), **cfg}
    _write(RISK_FILE, merged)
    return merged


# --- ingested data ------------------------------------------------------------
def get_ingested() -> dict:
    return _read(INGEST_FILE, {"connected": False, "source": None, "records": 0,
                               "columns": [], "preview": [], "updated_at": None})


def save_ingested(meta: dict) -> dict:
    meta = {**meta, "updated_at": now_iso()}
    _write(INGEST_FILE, meta)
    return meta


# --- incident memory ----------------------------------------------------------
def list_incidents() -> list:
    return _read(INCIDENTS_FILE, [])


def add_incident(rec: dict) -> dict:
    rec = {
        "id": rec.get("id") or ("INC-" + uuid.uuid4().hex[:6].upper()),
        "created_at": now_iso(),
        "status": rec.get("status", "dispatched"),
        **rec,
    }
    items = list_incidents()
    items.insert(0, rec)
    _write(INCIDENTS_FILE, items)
    return rec


def update_incident(inc_id: str, patch: dict) -> dict | None:
    items = list_incidents()
    for it in items:
        if it["id"] == inc_id:
            it.update(patch)
            if patch.get("status") == "resolved" and "resolved_at" not in patch:
                it["resolved_at"] = now_iso()
            _write(INCIDENTS_FILE, items)
            return it
    return None


def find_similar(category: str, issue_type: str, limit: int = 3) -> list:
    """Past incidents that match this category/type — the memory that makes the
    next response faster."""
    scored = []
    for it in list_incidents():
        score = 0
        if it.get("category") == category:
            score += 2
        if it.get("type") == issue_type:
            score += 1
        if score:
            scored.append((score, it))
    scored.sort(key=lambda x: (-x[0], x[1].get("created_at", "")), reverse=False)
    return [it for _, it in scored][:limit]
