import React, { useContext, useState } from "react";
import InputForm from "../components/InputForm";
import Suggestions from "../components/Suggestions";
import PastSuggestions from "../components/PastSuggestions";
import MoodBreakdownChart from "../components/MoodBreakdownChart";
import MoodDailyChart from "../components/MoodDailyChart";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { theme, toggleTheme } = useTheme();
  const [selectedView, setSelectedView] = useState("summary");
  const [selectedDate, setSelectedDate] = useState("");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [showChart, setShowChart] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => setShowConfirmLogout(true);
  const confirmLogout = () => {
    logout();
    navigate("/login");
  };
  const cancelLogout = () => setShowConfirmLogout(false);

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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
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

        {user && (
          <>
            <button
              onClick={() => setShowAccount(true)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#90caf9", // Softer red
                color: "#fff",
                cursor: "pointer",
              }}
            >
              👤 My Account
            </button>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmLogout && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              textAlign: "center",
              maxWidth: "320px",
            }}
          >
            <p>Are you sure you want to log out?</p>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={confirmLogout}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAccount && user && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              textAlign: "center",
              maxWidth: "360px",
            }}
          >
            <h3>👤 My Account</h3>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Created at:</strong>{" "}
              {user.created_at ? new Date(user.created_at).toDateString() : "N/A"}
            </p>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Logout
              </button>
              <button
                onClick={() => setShowAccount(false)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        WellNest - Self-Care Scheduler
      </h1>

      {user && (
        <p
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontStyle: "italic",
          }}
        >
          Hello, {user.username} 👋
        </p>
      )}

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
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          📊 Choose a Chart View
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
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
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
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
        <MoodBreakdownChart
          chartType={selectedView as "pie" | "bar"}
          date={selectedDate}
        />
      )}
    </div>
  );
};

export default Home;
