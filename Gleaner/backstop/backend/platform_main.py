"""Run the full Gleaner platform.

Reuses the existing demo app (main.py: /api/state, /api/disrupt, /api/live/*)
and adds the platform flow (connect, risk, simulate, solve, track, memory).

    uvicorn platform_main:app --port 8000 --reload
"""
from main import app          # existing endpoints + CORS + static
from api_v2 import router     # platform endpoints

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("platform_main:app", host="127.0.0.1", port=8000, reload=True)
