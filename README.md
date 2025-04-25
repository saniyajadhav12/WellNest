# 🌿 WellNest – Personalized Self-Care Assistant

WellNest is a full-stack self-care assistant that suggests personalized wellness activities based on your current **mood**, **energy level**, and **available time**.

- A pastel-themed React frontend
- A FastAPI backend
- PostgreSQL for activity logging
- Text-based logging simulating cloud stream (like AWS Kinesis)

## 🧩 Tech Stack

- **Frontend:** React + Vite + TypeScript + CSS
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL 15 (via Postgres.app)
- **ORM:** None (direct SQL via `psycopg2`)
- **Testing:** Pytest

## 💡 Features

- Input form for mood, energy, and time
- Real-time suggestions shown in the UI
- Suggestions logged in `activity_log.txt`
- All logs stored in PostgreSQL (`suggestion_logs` table)
- Unit and API testing with Pytest

## 🛠️ Setup Instructions

### 🔹 1. Backend (FastAPI + PostgreSQL)

#### 📍 Go to backend folder:

```terminal
cd WellNest/wellnest_env_test

#### 🔒 Create a virtual environment:

python3 -m venv venv
source venv/bin/activate

#### 📦 Install dependencies
pip install 'fastapi[all]' psycopg2-binary pytest

#### 🐘 Ensure PostgreSQL is running (via Postgres.app), and create DB:
createdb saniyajadhav

#### 🧱 Create table inside psql:
psql saniyajadhav

#### Then inside the psql prompt:

CREATE TABLE suggestion_logs (
    id SERIAL PRIMARY KEY,
    mood TEXT NOT NULL,
    energy INTEGER NOT NULL,
    time INTEGER NOT NULL,
    suggestions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#### Exit with:
\q

#### 🚀 Run the FastAPI backend:
source venv/bin/activate
python -m uvicorn main:app --reload

🔹 Frontend (React + Vite):
cd WellNest/client
npm install
npm run dev

🧪 Run Tests:
cd WellNest/wellnest_env_test/
PYTHONPATH=. pytest tests/

🗂️ Database Logging Output:
psql saniyajadhav
SELECT * FROM suggestion_logs;
