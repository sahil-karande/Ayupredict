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

export default function SignupForm({ switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ " + error.message);
      return;
    }

    // Create profile entry after signup
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        name,
        email,
      },
    ]);

    alert("🎉 Account created! Please verify your email.");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={cardStyle}
    >
      <h2 style={{ color: "#1b6b3d", fontWeight: "700" }}>Create Account</h2>
      <p style={{ color: "#555" }}>Sign up to get started</p>

      <form onSubmit={handleSignup} style={{ marginTop: "1.5rem" }}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

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

        <button style={buttonStyle}>Sign Up</button>
      </form>

      <p style={{ marginTop: "1rem", color: "#555" }}>
        Already have an account?
        <span
          onClick={switchToLogin}
          style={{ color: "#2e7d32", cursor: "pointer", marginLeft: 6 }}
        >
          Login
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
