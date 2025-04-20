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

# For user registration input
class UserCreate(BaseModel):
    username: str
    password: str

# For login request
class UserLogin(BaseModel):
    username: str
    password: str

# For storing users in DB (internal use)
class UserInDB(BaseModel):
    username: str
    hashed_password: str

