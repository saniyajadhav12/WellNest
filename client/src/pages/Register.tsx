import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/register", form);
      toast.success("Registration successful!");
      console.log(res.data); // optional
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
        minHeight: "80vh",
        backgroundColor: "#f9f9ff",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#5e4b8b" }}>
          Register
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            autoFocus
            style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            className="btn"
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
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
