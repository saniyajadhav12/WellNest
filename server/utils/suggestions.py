# server/utils/suggestions.py

def get_suggestions(mood: str, energy: int, time: int) -> list[str]:
    base = [
        f"Take a {time}-minute mindful walk.",
        f"Do a short {min(time, 10)}-min breathing session to feel more {mood.lower()}.",
        f"Your energy is at {energy}/10 — maybe some light stretching or journaling?",
    ]
    if mood.lower() == "tired":
        base.append("Take a power nap or do a low-effort activity like coloring.")
    if mood.lower() == "anxious":
        base.append("Try a grounding exercise like the 5-4-3-2-1 technique.")
    return base
