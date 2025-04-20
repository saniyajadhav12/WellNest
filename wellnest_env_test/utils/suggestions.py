import random

def get_suggestions(mood: str, energy: int, time: int) -> list[str]:
    mood = mood.lower()
    suggestions = [
        f"Take a {time}-minute mindful walk.",
        f"Do a {min(time, 10)}-minute breathing exercise to stay grounded.",
        f"Your energy is at {energy}/10 — consider journaling or stretching."
    ]

    mood_specific = {
        "happy": [
            "Celebrate with music or a quick dance!",
            "Spread the positivity — message a friend or write a compliment.",
            "Capture your good mood with a short gratitude note."
        ],
        "sad": [
            "Watch a comforting video or listen to soothing music.",
            "Try a mood-lifting activity like sketching or painting.",
            "Wrap yourself in a cozy blanket and enjoy a warm drink."
        ],
        "anxious": [
            "Try a grounding exercise like the 5-4-3-2-1 technique.",
            "Light a scented candle or use calming essential oils.",
            "Declutter a small space — it helps clear the mind too."
        ],
        "tired": [
            "Take a power nap if possible.",
            "Do a low-effort activity like coloring or watching nature videos.",
            "Drink water and do gentle neck rolls or stretching."
        ]
    }

    # Add 2 random mood-specific suggestions if available
    if mood in mood_specific:
        suggestions += random.sample(mood_specific[mood], k=2)

    return suggestions

def get_suggestions_from_journal(journal: str, mood: str, energy: int, time: int) -> list[str]:
    journal_lower = journal.lower()
    suggestions = []

    if "tired" in journal_lower or "exhausted" in journal_lower:
        suggestions.append("You seem tired — try a 10-minute nap or calming music.")
    if "anxious" in journal_lower or "stress" in journal_lower:
        suggestions.append("Feeling anxious? A 5-minute breathing exercise can help.")
    if "sad" in journal_lower or "down" in journal_lower:
        suggestions.append("Consider journaling your thoughts or watching something light-hearted.")
    if "happy" in journal_lower or "excited" in journal_lower:
        suggestions.append("Channel that joy! Dance, walk, or share it with someone.")

    # fallback
    if not suggestions:
        suggestions = get_suggestions(mood, energy, time)

    suggestions.append(f"Use {time} minutes to reflect and recharge.")
    suggestions.append(f"Your energy level is {energy}/10 — listen to your body.")

    return suggestions

