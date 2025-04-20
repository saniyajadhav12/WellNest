# database.py

import psycopg2
from psycopg2 import sql
from typing import List
import os

# You can hardcode for local dev or use environment variables
DB_CONFIG = {
    "dbname": "saniyajadhav",
    "user": "saniyajadhav",
    "host": "localhost",
    "port": "5432",
}

def insert_log_to_db(mood: str, energy: int, time: int, suggestions: List[str], journal: str = ""):
    print("📦 Attempting to insert into PostgreSQL...")  # DEBUG LINE
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        query = sql.SQL("""
            INSERT INTO suggestion_logs (mood, energy, time, suggestions)
            VALUES (%s, %s, %s, %s);
        """)

        cur.execute(query, (mood, energy, time, ", ".join(suggestions), journal))
        conn.commit()

        cur.close()
        conn.close()
        print("✅ Inserted into PostgreSQL!")
    except Exception as e:
        print("❌ Error inserting into DB:", e)

