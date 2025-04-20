import React, { useState } from "react";
import InputForm from "../components/InputForm";
import Suggestions from "../components/Suggestions";
import PastSuggestions from "../components/PastSuggestions";
import MoodBreakdownChart from "../components/MoodBreakdownChart";
import MoodDailyChart from "../components/MoodDailyChart";
import { useTheme } from "../context/ThemeContext";

const Home: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#111" : "#fff",
        color: theme === "dark" ? "#f1f1f1" : "#111",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Dark Mode Toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: theme === "dark" ? "#222" : "#f5f5f5",
            color: theme === "dark" ? "#f1f1f1" : "#333",
            cursor: "pointer",
          }}
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        WellNest - Self-Care Scheduler
      </h1>

      <InputForm onSuggestionsReceived={setSuggestions} theme={theme} />
      <Suggestions suggestions={suggestions} theme={theme} />
      <PastSuggestions theme={theme} />

      {/* Chart Area */}
      <MoodBreakdownChart />
      <MoodDailyChart />
    </div>
  );
};

export default Home;
