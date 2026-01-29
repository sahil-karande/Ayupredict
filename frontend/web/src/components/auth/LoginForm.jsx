import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "framer-motion";

const cardStyle = {
  width: "380px",
  padding: "2rem",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  textAlign: "center",
};

export default function LoginForm({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert("❌ " + error.message);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={cardStyle}
    >
      <h2 style={{ color: "#1b6b3d", fontWeight: "700" }}>Welcome Back</h2>
      <p style={{ color: "#555" }}>Log in to continue</p>

      <form onSubmit={handleLogin} style={{ marginTop: "1.5rem" }}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button style={buttonStyle}>Login</button>
      </form>

      <p style={{ marginTop: "1rem", color: "#555" }}>
        Don’t have an account?
        <span
          onClick={switchToSignup}
          style={{ color: "#2e7d32", cursor: "pointer", marginLeft: 6 }}
        >
          Sign up
        </span>
      </p>
    </motion.div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginBottom: "1rem",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  background: "linear-gradient(90deg,#4caf50,#2e7d32)",
  color: "white",
  border: "none",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
};
