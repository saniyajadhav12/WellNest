import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (!mood && !date) return;
  
    setLoading(true); // show loading text or spinner
  
    try {
      const params: any = {};
      if (mood) params.mood = mood;
      if (date) params.date = date;
  
      const res = await axios.get<{ results: Suggestion[] }>(
        "http://localhost:8000/suggestions",
        { params }
      );
  
      setData(res.data.results || []);
  
      if (res.data.results?.length > 0) {
        toast.success("Suggestions loaded!");
      } else {
        toast.info("No suggestions found for the selected filters.");
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      toast.error("Something went wrong while fetching suggestions.");
    } finally {
      setLoading(false); // hide loading text or spinner
    }
  };
  

  const handleClear = () => {
    setMood("");
    setDate("");
    setData([]);
  };

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
      <h2 style={{ marginBottom: "1rem", color: "#444" }}>
        🗂️ Past Suggestions
      </h2>

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
        <button onClick={handleClear}>Clear</button>
        <button onClick={fetchSuggestions}>Search</button>
      </div>

      {loading && (
        <p style={{ fontStyle: "italic", color: "#888", marginBottom: "1rem" }}>
          Loading suggestions...
        </p>
      )}

      {/* Fallback Messages */}
      {/* {!mood && !date && data.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>
          Use the filters above to view past suggestions.
        </p>
      ) : !data.length ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>
          No suggestions found for the selected filters.
        </p>
      ) : ( */}
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
                style={{
                  fontWeight: "bold",
                  marginBottom: "0.25rem",
                  color: "#333",
                }}
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
      {/* )} */}
    </div>
  );
};

export default PastSuggestions;
