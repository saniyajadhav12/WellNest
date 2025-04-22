import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
};

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<LoginResponse>(
        "http://localhost:8000/login",
        form
      );

    //   localStorage.setItem("token", res.data.access_token);
    //   localStorage.setItem("username", res.data.user.username); // or decode from token
      
      
      login(res.data.user, res.data.access_token);
      toast.success("Login successful!");
      navigate("/");

      console.log("User info:", res.data.user);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#111" : "#f9f9ff",
        color: theme === "dark" ? "#f1f1f1" : "#111",
        transition: "background 0.3s ease",
      }}
    >
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
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
      <div
        style={{
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
          color: theme === "dark" ? "#f1f1f1" : "#111",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow:
            theme === "dark"
              ? "0 0 10px rgba(255, 255, 255, 0.05)"
              : "0 0 10px rgba(0, 0, 0, 0.05)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem",backgroundColor: theme === "dark" ? "#222" : "#fff", color: theme === "dark" ? "#f1f1f1" : "#111", alignItems: "center"}}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button 
            type="submit" 
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#c4a6f5", // 💜 lavender
              color: "#fff",
              fontWeight: "bold",
              // fontSize: "1rem",
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
              // transition: "background 0.3s ease",
              width: "200px",
              // height: "40px"
            }} 
            disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
