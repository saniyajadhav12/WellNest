from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from utils.suggestions import get_suggestions

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

import datetime

def log_request(mood: str, energy: int, time: int, suggestions: list[str]):
    print("📍 Logging to activity_log.txt...")  # debug print

    log_path = os.path.join(os.path.dirname(__file__), "activity_log.txt")
    with open(log_path, "a") as log:
        log.write(f"\n[{datetime.datetime.now()}] Mood: {mood}, Energy: {energy}, Time: {time} mins\n")
        for s in suggestions:
            log.write(f"→ {s}\n")


@app.post("/suggest")
def suggest_activity(req: SuggestRequest):
    suggestions = get_suggestions(req.mood, req.energy, req.time)
    log_request(req.mood, req.energy, req.time, suggestions)
    return {"suggestions": suggestions}

