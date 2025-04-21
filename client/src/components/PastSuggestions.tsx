import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

type Suggestion = {
  id: number;
  mood: string;
  energy: number;
  time: number;
  suggestions: string;
  created_at: string;
};

const PastSuggestions: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  const [data, setData] = useState<Suggestion[]>([]);
  const [mood, setMood] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const offset = (page - 1) * limit;

  const fetchSuggestions = async () => {
    if (!mood && !date) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get<{ results: Suggestion[] }>(
        "http://localhost:8000/suggestions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ...(mood && { mood }),
            ...(date && { date }),
            limit,
            offset,
          },
        }
      );

      setData(res.data.results || []);
      if (res.data.results?.length === 0) {
        toast.info("No suggestions found for the selected filters.");
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      toast.error("Something went wrong while fetching suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMood("");
    setDate("");
    setData([]);
    setPage(1);
  };

  useEffect(() => {
    if (mood || date) {
      fetchSuggestions();
    }
  }, [page]);

  const downloadCSV = () => {
    if (!data.length) {
      toast.info("No data to export.");
      return;
    }

    const header = ["Mood", "Energy", "Time", "Suggestions", "Created At"];
    const rows = data.map((item) => [
      item.mood,
      item.energy,
      item.time,
      `"${item.suggestions.replace(/"/g, '""')}"`,
      new Date(item.created_at).toLocaleString(),
    ]);
    const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "wellnest_suggestions.csv");
  };

  const cardStyle = {
    border: `1px solid ${theme === "dark" ? "#444" : "#ddd"}`,
    borderRadius: "10px",
    padding: "1rem",
    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fafafa",
    color: theme === "dark" ? "#f1f1f1" : "#111",
    boxShadow:
      theme === "dark"
        ? "0 1px 4px rgba(255,255,255,0.05)"
        : "0 1px 4px rgba(0,0,0,0.03)",
  };

  const inputStyle = {
    padding: "0.5rem",
    borderRadius: "8px",
    border: `1px solid ${theme === "dark" ? "#555" : "#ccc"}`,
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
    color: theme === "dark" ? "#f1f1f1" : "#111",
    flex: "1 1 150px",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: theme === "dark" ? "#444" : "#333",
    color: "#fff",
    cursor: "pointer",
  };

  return (
    <div
      className="fade-in"
      style={{
        marginTop: "3rem",
        padding: "1.5rem",
        backgroundColor: theme === "dark" ? "#1e1e1e" : "#fefeff",
        borderRadius: "12px",
        boxShadow:
          theme === "dark"
            ? "0 2px 8px rgba(255,255,255,0.03)"
            : "0 2px 8px rgba(0,0,0,0.05)",
        border: `1px solid ${theme === "dark" ? "#333" : "#eaeaea"}`,
        color: theme === "dark" ? "#f1f1f1" : "#111",
        maxWidth: "420px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>📂 Past Suggestions</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Filter by mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleClear}
          // style={buttonStyle}
          className="btn"
        >
          Clear
        </button>
        <button
          onClick={() => {
            setPage(1);
            fetchSuggestions();
          }}
          // style={buttonStyle}
          className="btn"
        >
          Search
        </button>
      </div>

      {loading && (
        <p
          style={{
            fontStyle: "italic",
            color: theme === "dark" ? "#ccc" : "#888",
          }}
        >
          Loading suggestions...
        </p>
      )}

      <div style={{ display: "grid", gap: "1rem" }}>
        {data.map((item) => (
          <div key={item.id} className="fade-in" style={cardStyle}>
            <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
              {item.mood} • Energy: {item.energy} • Time: {item.time} min
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: theme === "dark" ? "#bbb" : "#777",
                marginBottom: "0.5rem",
              }}
            >
              {new Date(item.created_at).toLocaleString()}
            </div>
            <div>{item.suggestions}</div>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="btn"
              disabled={page === 1}
              // style={{
              //   ...buttonStyle,
              //   opacity: page === 1 ? 0.5 : 1,
              //   cursor: page === 1 ? "not-allowed" : "pointer",
              // }}
            >
              ⬅️ Previous
            </button>

            <span
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              Page {page}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data.length < limit}
              className="btn"
              // style={{
              //   ...buttonStyle,
              //   opacity: data.length < limit ? 0.5 : 1,
              //   cursor: data.length < limit ? "not-allowed" : "pointer",
              // }}
            >
              Next ➡️
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button onClick={downloadCSV} className="btn">
              📥 Download CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PastSuggestions;
