import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({ displayName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [usernameFocused, setUsernameFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.displayName || !form.email || !form.password) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/register", {
        username: form.displayName, // still sent as "username" in payload
        email: form.email,
        password: form.password,
      });

      toast.success("Registration successful!");
      console.log(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed");
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
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#5e4b8b",
          }}
        >
          Register
        </h2>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            backgroundColor: theme === "dark" ? "#222" : "#fff",
            color: theme === "dark" ? "#f1f1f1" : "#111",
            alignItems: "center",
          }}
        >

          {/* Double hidden dummy fields to mislead autofill */}
          <input type="text" name="fakeuser" autoComplete="username" style={{ display: "none" }} />
          <input type="password" name="fakepass" autoComplete="new-password" style={{ display: "none" }} />

          <input
            type="text"
            name="display_name"
            inputMode="text"
            placeholder="Username"
            value={form.displayName}
            onChange={handleChange}
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
            autoFocus
            autoComplete="new-username"
            autoCorrect="off"
            spellCheck={false}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          {usernameFocused && (<p style={{
            fontSize: "0.8rem",
            color: theme === "dark" ? "#aaa" : "#666",
            marginTop: "-0.5rem",
            marginBottom: "0.5rem"
          }}>
            Your username will be used to personalize your experience and shown in your account.
          </p>)}

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
            // className="btn"
            disabled={loading}
            style={{
              backgroundColor: "#b494e3",
              color: "#fff",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              opacity: loading ? 0.6 : 1,
              // height: "40px"
              width: "200px",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p
            style={{
              fontSize: "0.9rem",
              marginTop: "1rem",
              color: theme === "dark" ? "#aaa" : "#555",
            }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#b494e3",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
