"""Gleaner API + static frontend server."""
from __future__ import annotations

from pathlib import Path
import asyncio
import json
import time
from datetime import datetime
from typing import Set

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()  # read .env if present

import agent
import tools

app = FastAPI(title="Gleaner", version="0.1.0")
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

FRONTEND = Path(__file__).parent.parent / "frontend" / "index.html"
LANDING = Path(__file__).parent.parent / "frontend" / "landing.html"
ARCHITECTURE = Path(__file__).parent.parent / "frontend" / "architecture.html"

# Live issues management
live_issues = []
active_clients: Set[WebSocket] = set()
metrics = {
    "total_disruptions": 0,
    "total_meals_protected": 0,
    "total_cost_saved": 0,
    "active_issues": 0,
}


class DisruptRequest(BaseModel):
    commitment_id: str


class LiveIssue(BaseModel):
    id: str
    timestamp: str
    commitment_id: str
    source: str
    category: str
    shortfall_lbs: int
    severity: str
    status: str


async def broadcast_issue(issue: dict):
    """Broadcast issue to all connected clients."""
    for client in active_clients.copy():
        try:
            await client.send_json({
                "type": "new_issue",
                "issue": issue,
                "metrics": metrics
            })
        except:
            active_clients.discard(client)


@app.get("/")
def landing():
    return FileResponse(LANDING)


@app.get("/app")
def app_page():
    return FileResponse(FRONTEND)


@app.get("/architecture")
def architecture_page():
    return FileResponse(ARCHITECTURE)


@app.get("/api/health")
def health():
    import os
    return {"ok": True, "engine": "claude" if os.environ.get("ANTHROPIC_API_KEY") else "deterministic"}


@app.get("/api/state")
def state():
    d = tools.load_all()
    return {
        "depot": d["fleet"]["depot"],
        "commitments": d["commitments"],
        "agencies": d["agencies"],
        "inventory": d["inventory"],
        "trucks": d["fleet"]["trucks"],
    }


@app.post("/api/disrupt")
def disrupt(req: DisruptRequest):
    result = agent.run(req.commitment_id)
    # Update metrics
    metrics["total_disruptions"] += 1
    if "summary" in result:
        metrics["total_meals_protected"] += result["summary"].get("total_meals", 0)
        metrics["total_cost_saved"] += result["summary"].get("dollars_saved", 0)
    return result


@app.get("/api/live/issues")
def get_live_issues():
    return {"issues": live_issues, "metrics": metrics}


@app.post("/api/live/simulate-issue")
def simulate_issue():
    """Simulate a random supply chain disruption."""
    import random

    data = tools.load_all()
    commitments = data["commitments"]

    if not commitments:
        return {"error": "No commitments available"}

    random_commitment = random.choice(commitments)

    issue = {
        "id": f"issue-{int(time.time())}",
        "timestamp": datetime.now().isoformat(),
        "commitment_id": random_commitment["id"],
        "source": random_commitment["source"],
        "category": random_commitment["category"],
        "shortfall_lbs": random.randint(2000, 8000),
        "severity": random.choice(["high", "critical"]),
        "status": "detected",
        "message": f"{random_commitment['source']} load delayed — {random.randint(30, 70)}% short on {random_commitment['category']}"
    }

    live_issues.append(issue)
    metrics["active_issues"] = len([i for i in live_issues if i["status"] == "detected"])

    # Return issue for frontend
    return issue


@app.websocket("/ws/live-issues")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_clients.add(websocket)

    try:
        # Send current state
        await websocket.send_json({
            "type": "initial",
            "issues": live_issues,
            "metrics": metrics
        })

        # Keep connection alive
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_clients.discard(websocket)
    except Exception:
        active_clients.discard(websocket)


@app.post("/api/live/resolve-issue/{issue_id}")
def resolve_issue(issue_id: str):
    """Mark an issue as resolved."""
    for issue in live_issues:
        if issue["id"] == issue_id:
            issue["status"] = "resolved"
            metrics["active_issues"] = len([i for i in live_issues if i["status"] == "detected"])
            return {"success": True, "issue": issue}
    return {"error": "Issue not found"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
