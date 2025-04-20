# server/schemas.py

from pydantic import BaseModel

class SuggestRequest(BaseModel):
    mood: str
    energy: int
    time: int
