# server/schemas.py

from pydantic import BaseModel

class SuggestRequest(BaseModel):
    mood: str
    energy: int
    time: int
    journal: str

# server/schemas.py

from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserInDB(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

class UserLogin(BaseModel):
    email: str
    password: str

