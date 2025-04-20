# server/models.py

from pydantic import BaseModel
from datetime import datetime

class SuggestionLog(BaseModel):
    id: int
    mood: str
    energy: int
    time: int
    suggestions: str
    created_at: datetime
