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
        const localDate = new Date().toLocaleDateString("en-CA"); // e.g., 2025-04-20
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
    <div style={{ marginTop: "2rem" }}>
      <h2>🗂️ Past Suggestions</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Filter by Mood: </label>
        <input
          type="text"
          placeholder="e.g., tired"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <label style={{ marginLeft: "1rem" }}>Filter by Date: </label>
        <input
          type="date"
          value={date === "today" ? "" : date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button style={{ marginLeft: "1rem" }} onClick={() => setDate("today")}>
          Today
        </button>
        <button style={{ marginLeft: "0.5rem" }} onClick={() => { setMood(""); setDate(""); }}>
          Clear
        </button>
      </div>

      {data.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>
            {date === "today"
            ? "No suggestions found for today. Try adjusting the filters!"
            : "No suggestions found for the selected filters."}
        </p>
      
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
              <strong>{item.mood}</strong> • Energy: {item.energy} • Time: {item.time} min  
              <br />
              <em>{new Date(item.created_at).toLocaleString()}</em>
              <br />
              <span>{item.suggestions}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PastSuggestions;
