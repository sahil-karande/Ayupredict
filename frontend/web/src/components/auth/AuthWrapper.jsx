import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthWrapper({ children }) {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Load initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 🔹 Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ⏳ LOADING SCREEN
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to bottom right, #eaf8f1, #f4faf6)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem 3rem",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#2e7d32", fontWeight: 600, fontSize: "1.2rem" }}>
            Loading AyuPredict...
          </p>
        </div>
      </div>
    );
  }

  // 🔒 NOT LOGGED IN → Show LOGIN / SIGNUP UI
  if (!session) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to bottom right, #eaf8f1, #f4faf6)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {authMode === "login" ? (
          <LoginForm switchToSignup={() => setAuthMode("signup")} />
        ) : (
          <SignupForm switchToLogin={() => setAuthMode("login")} />
        )}
      </div>
    );
  }

  // 🔓 LOGGED IN → Show full AyuPredict App
  return children;
}
