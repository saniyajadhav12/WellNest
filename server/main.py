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

@app.post("/suggest")
def suggest_activity(req: SuggestRequest):
    suggestions = get_suggestions(req.mood, req.energy, req.time)
    return {"suggestions": suggestions}
