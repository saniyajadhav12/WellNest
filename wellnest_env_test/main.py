from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from utils.suggestions import get_suggestions
from database import insert_log_to_db, DB_CONFIG

app = FastAPI()

# CORS setup so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SuggestRequest(BaseModel):
    mood: str
    energy: int
    time: int


import os
print("📂 Current working directory:", os.getcwd())

def log_request(mood: str, energy: int, time: int, suggestions: list[str]):
    print("📍 Logging to activity_log.txt...")  # debug print

    log_path = os.path.join(os.path.dirname(__file__), "activity_log.txt")
    with open(log_path, "a") as log:
        log.write(f"\n[{datetime.now()}] Mood: {mood}, Energy: {energy}, Time: {time} mins\n")
        for s in suggestions:
            log.write(f"→ {s}\n")


@app.post("/suggest")
def suggest_activity(req: SuggestRequest):
    suggestions = get_suggestions(req.mood, req.energy, req.time)
    log_request(req.mood, req.energy, req.time, suggestions)
    insert_log_to_db(req.mood, req.energy, req.time, suggestions)
    return {"suggestions": suggestions}

from fastapi import Query
from fastapi.responses import JSONResponse
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

@app.get("/suggestions")
def get_suggestions_from_db(
    mood: str = Query(None),
    date: str = Query(None),
    limit: int = Query(5),     # default 5 suggestions per page
    offset: int = Query(0)     # skip how many records
):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        base_query = "SELECT * FROM suggestion_logs"
        conditions = []
        params = []

        if mood:
            conditions.append("mood = %s")
            params.append(mood)
        if date:
            conditions.append("DATE(created_at) = %s")
            params.append(date)

        if conditions:
            base_query += " WHERE " + " AND ".join(conditions)

        base_query += " ORDER BY created_at DESC"
        base_query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        # if limit:
        #     base_query += f" LIMIT {limit}"

        cur.execute(base_query, params)
        results = cur.fetchall()
        cur.close()
        conn.close()

        # ✅ Convert datetime to string
        for row in results:
            if isinstance(row["created_at"], datetime):
                row["created_at"] = row["created_at"].isoformat()

        return JSONResponse(content={"results": results})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
