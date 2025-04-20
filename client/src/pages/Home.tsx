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
  const [selectedView, setSelectedView] = useState("summary");
  const [selectedDate, setSelectedDate] = useState("");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [showChart, setShowChart] = useState(false);

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

      {/* Chart Settings */}
      <div
        style={{
          marginTop: "3rem",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#fefeff",
          padding: "1.5rem",
          borderRadius: "12px",
          maxWidth: "600px",
          marginInline: "auto",
          border: `1px solid ${theme === "dark" ? "#333" : "#ddd"}`,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📊 Choose a Chart View</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <label>
            <input
              type="radio"
              value="summary"
              checked={selectedView === "summary"}
              onChange={() => setSelectedView("summary")}
            />
            &nbsp;Summary
          </label>

          <label>
            <input
              type="radio"
              value="pie"
              checked={selectedView === "pie"}
              onChange={() => setSelectedView("pie")}
            />
            &nbsp;Pie Chart
          </label>

          <label>
            <input
              type="radio"
              value="bar"
              checked={selectedView === "bar"}
              onChange={() => setSelectedView("bar")}
            />
            &nbsp;Bar Chart
          </label>
        </div>

        {selectedView !== "summary" && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <div style={{ marginTop: "1rem" }}>
              <button className="btn" onClick={() => setShowChart(true)}>
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chart Display */}
      {selectedView === "summary" && <MoodDailyChart />}
      {selectedView !== "summary" && showChart && (
        <MoodBreakdownChart chartType={selectedView as "pie" | "bar"} date={selectedDate} />
      )}
    </div>
  );
};

export default Home;
