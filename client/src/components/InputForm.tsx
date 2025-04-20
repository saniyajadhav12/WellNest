import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onSuggestionsReceived: (suggestions: string[]) => void;
  theme: "light" | "dark";
}

const InputForm: React.FC<Props> = ({ onSuggestionsReceived, theme }) => {
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);
  const [time, setTime] = useState(30);
  const [journal, setJournal] = useState('');
  const [loading, setLoading] = useState(false);

  type SuggestionResponse = {
    suggestions: string[];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<SuggestionResponse>('http://localhost:8000/suggest', {
        mood,
        energy,
        time,
        journal,
      });
      onSuggestionsReceived(res.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: theme === "dark" ? "#1e1e1e" : "#f9f9f9",
    color: theme === "dark" ? "#f1f1f1" : "#111",
    border: `1px solid ${theme === "dark" ? "#333" : "#ddd"}`,
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: theme === "dark" ? "0 2px 8px rgba(255,255,255,0.05)" : "0 2px 8px rgba(0,0,0,0.05)",
    maxWidth: "500px",
    margin: "0 auto",
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
    color: theme === "dark" ? "#f1f1f1" : "#111",
    border: `1px solid ${theme === "dark" ? "#444" : "#ccc"}`,
    padding: "0.5rem",
    borderRadius: "8px",
    width: "100%",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.3rem",
  };

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={labelStyle}>
          Mood:
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select mood</option>
            <option value="happy">Happy</option>
            <option value="tired">Tired</option>
            <option value="anxious">Anxious</option>
            <option value="sad">Sad</option>
          </select>
        </label>

        <label style={labelStyle}>
          Energy Level: {energy}
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            style={{ 
              width: "100%", 
              boxSizing: "border-box", 
              marginTop: "0.3rem",
              paddingRight: "0px",
            }}
          />
        </label>

        <label style={labelStyle}>
          Available Time (minutes):
          <input
            type="number"
            min={5}
            max={120}
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Journal Entry (optional):
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            rows={4}
            placeholder="How are you feeling today?"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          // style={{
          //   padding: "0.75rem",
          //   borderRadius: "8px",
          //   border: "none",
          //   backgroundColor: theme === "dark" ? "#444" : "#333",
          //   color: "#fff",
          //   fontWeight: "bold",
          //   cursor: "pointer",
          //   transition: "background 0.3s ease",
          // }}
        >
          {loading ? "Generating..." : "Get Suggestions"}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
