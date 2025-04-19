# tests/test_suggestions.py

from fastapi.testclient import TestClient
from main import app
from utils.suggestions import get_suggestions

client = TestClient(app)

def test_get_suggestions_logic():
    mood = "anxious"
    energy = 3
    time = 20
    result = get_suggestions(mood, energy, time)
    
    assert isinstance(result, list)
    assert any("anxious" in s.lower() for s in result), "Should mention 'anxious' coping"

def test_suggest_endpoint():
    response = client.post("/suggest", json={
        "mood": "tired",
        "energy": 5,
        "time": 30
    })
    
    assert response.status_code == 200
    data = response.json()
    
    assert "suggestions" in data
    assert isinstance(data["suggestions"], list)
    assert len(data["suggestions"]) > 0
