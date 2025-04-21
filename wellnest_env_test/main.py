from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from utils.suggestions import get_suggestions, get_suggestions_from_journal
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
    journal: str = ""

import os
print("📂 Current working directory:", os.getcwd())

def log_request(mood: str, energy: int, time: int, suggestions: list[str], journal: str = ""):
    print("📍 Logging to activity_log.txt...")  # debug print

    log_path = os.path.join(os.path.dirname(__file__), "activity_log.txt")
    with open(log_path, "a") as log:
        log.write(f"\n[{datetime.now()}] Mood: {mood}, Energy: {energy}, Time: {time} mins\n")
        if journal.strip():
            log.write(f"📝 Journal: {journal.strip()}\n")
        for s in suggestions:
            log.write(f"→ {s}\n")


# @app.post("/suggest")
# def suggest_activity(req: SuggestRequest):
#     if req.journal.strip():
#         suggestions = get_suggestions_from_journal(req.journal, req.mood, req.energy, req.time)
#     else:
#         suggestions = get_suggestions(req.mood, req.energy, req.time)

#     log_request(req.mood, req.energy, req.time, suggestions, req.journal)
#     insert_log_to_db(req.mood, req.energy, req.time, suggestions, req.journal)
#     return {"suggestions": suggestions}

from utils.suggestions import get_suggestions, get_suggestions_from_journal

@app.post("/suggest")
def suggest_activity(req: SuggestRequest):
    if req.journal.strip():
        suggestions = get_suggestions_from_journal(req.journal, req.mood, req.energy, req.time)
    else:
        suggestions = get_suggestions(req.mood, req.energy, req.time)

    log_request(req.mood, req.energy, req.time, suggestions, req.journal)
    insert_log_to_db(req.mood, req.energy, req.time, suggestions, req.journal)
    return {"suggestions": suggestions}


from fastapi import Query
from fastapi.responses import JSONResponse
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from fastapi import Depends
from auth import get_current_user

@app.get("/suggestions")
def get_suggestions_from_db(
    mood: str = Query(None),
    date: str = Query(None),
    limit: int = Query(5),     # default 5 suggestions per page
    offset: int = Query(0),     # skip how many records
    current_user: dict = Depends(get_current_user)  # 🛡️ Token required
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


from collections import Counter
from fastapi.responses import JSONResponse

@app.get("/mood-summary")
def get_mood_summary(mood: str = None, date: str = None, current_user: dict = Depends(get_current_user)):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        query = "SELECT mood FROM suggestion_logs"
        filters = []
        params = []

        if mood:
            filters.append("mood = %s")
            params.append(mood)
        if date:
            filters.append("DATE(created_at) = %s")
            params.append(date)

        if filters:
            query += " WHERE " + " AND ".join(filters)

        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        mood_counts = Counter([r[0] for r in rows])
        results = [{"mood": m, "count": c} for m, c in mood_counts.items()]
        return JSONResponse(content={"results": results})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

from fastapi.responses import JSONResponse

@app.get("/mood-daily-summary")
def get_mood_daily_summary(current_user: dict = Depends(get_current_user)):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        query = """
            SELECT DATE(created_at) as date, mood, COUNT(*) as count
            FROM suggestion_logs
            WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
            GROUP BY DATE(created_at), mood
            ORDER BY DATE(created_at)
        """
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        result = []
        for row in rows:
            result.append({
                "date": row[0].isoformat(),
                "mood": row[1],
                "count": row[2]
            })

        return JSONResponse(content={"results": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
from schemas import UserCreate
from auth import hash_password
import psycopg2
from fastapi import HTTPException

@app.post("/register")
def register_user(user: UserCreate):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        # Check if user already exists
        cur.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="User already exists")

        # Hash password
        hashed_pwd = hash_password(user.password)

        # Insert new user
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, email, created_at",
            (user.username, user.email, hashed_pwd)
        )

        new_user = cur.fetchone()

        conn.commit()
        cur.close()
        conn.close()

        return {
            "id": new_user[0],
            "username": new_user[1],
            "email": new_user[2],
            "created_at": new_user[3].isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from auth import verify_password, create_access_token
from schemas import UserLogin

@app.post("/login")
def login(user: UserLogin):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        cur.execute("SELECT id, username, password_hash, created_at FROM users WHERE email = %s", (user.email,))
        db_user = cur.fetchone()
        cur.close()
        conn.close()

        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user_id, username, password_hash, created_at = db_user

        if not verify_password(user.password, password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"sub": str(user_id)})

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "username": username,
                "email": user.email,
                "created_at": created_at.isoformat() if created_at else None
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
