import React, { useEffect, useState } from "react";
import axios from "axios";

type Suggestion = {
  id: number;
  mood: string;
  energy: number;
  time: number;
  suggestions: string;
  created_at: string;
};

const PastSuggestions: React.FC = () => {
  const [data, setData] = useState<Suggestion[]>([]);
  const [mood, setMood] = useState("");
  const [date, setDate] = useState("");

  const fetchSuggestions = async () => {
    try {
      const params: any = {};
      if (mood) params.mood = mood;
      if (date === "today") {
        const localDate = new Date().toLocaleDateString("en-CA");
        params.date = localDate;
      } else if (date) {
        params.date = date;
      }

      const res = await axios.get<{ results: Suggestion[] }>(
        "http://localhost:8000/suggestions",
        { params }
      );
      setData(res.data.results || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [mood, date]);

  return (
    <div
      style={{
        marginTop: "3rem",
        padding: "1.5rem",
        backgroundColor: "#fefeff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #eaeaea",
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#444" }}>🗂️ Past Suggestions</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Filter by mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            flex: "1 1 150px",
          }}
        />

        <input
          type="date"
          value={date === "today" ? "" : date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            flex: "1 1 150px",
          }}
        />

        <button onClick={() => setDate("today")}>Today</button>
        <button onClick={() => { setMood(""); setDate(""); }}>Clear</button>
      </div>

      {date && !data.length ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>
          {date === "today"
            ? "No suggestions found for today. Try adjusting the filters!"
            : `No suggestions found for ${date}.`}
        </p>
      ) : !data.length ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>
          No suggestions found for the selected filters.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {data.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                backgroundColor: "#fafafa",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{ fontWeight: "bold", marginBottom: "0.25rem", color: "#333" }}
              >
                {item.mood} • Energy: {item.energy} • Time: {item.time} min
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#777",
                  marginBottom: "0.5rem",
                }}
              >
                {new Date(item.created_at).toLocaleString()}
              </div>
              <div>{item.suggestions}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastSuggestions;
