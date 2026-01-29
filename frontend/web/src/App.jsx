import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import PredictionForm from "./components/PredictionForm";
import AuthWrapper from "./components/auth/AuthWrapper";

// Supabase
import { supabase } from "./lib/supabase";

// Logos
const ayulogo = new URL("./assets/ayulogo.png", import.meta.url).href;
const bgrayulogo = new URL("./assets/bgrayulogo.png", import.meta.url).href;

// Profile icon
const profileIcon = new URL("./assets/profilenew.png", import.meta.url).href;

/* ============================================================
   MAIN APP (wrapped inside AuthWrapper)
============================================================ */
export default function App() {
  return (
    <AuthWrapper>
      <MainApp />
    </AuthWrapper>
  );
}

/* ============================================================
   MAIN APP SCREEN (shown only after login)
============================================================ */
function MainApp() {
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // ✅ Mobile Detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const menuRef = React.useRef(null);
  const avatarRef = React.useRef(null);

  useEffect(() => {
    fetchUserName();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuOpen &&
        menuRef.current &&
        avatarRef.current &&
        !menuRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function fetchUserName() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUserEmail(user.email || "");

    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (data?.full_name) setUserName(data.full_name);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #eaf8f1, #f4faf6, #f9fffb)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        color: "#234f35",
        padding: isMobile ? "0.5rem" : undefined,
      }}
    >
      {/* ================= TOP-RIGHT PROFILE ================= */}
      <div
        style={{
          position: "fixed",
          top: isMobile ? "10px" : "20px",
          right: isMobile ? "10px" : "20px",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "8px" : "12px",
          zIndex: 1000,
        }}
      >
        {!isMobile && userName && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: "white",
              padding: "6px 12px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              fontWeight: "600",
              color: "#234f35",
              fontSize: "0.9rem",
            }}
          >
            {userName}
          </motion.div>
        )}

        <motion.div
          ref={avatarRef}
          onClick={() => setMenuOpen((s) => !s)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: isMobile ? "40px" : "48px",
            height: isMobile ? "40px" : "48px",
            borderRadius: "50%",
            background: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          <img
            src={profileIcon}
            alt="Profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </motion.div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: "60px",
                right: "0",
                background: "rgba(255, 255, 255, 0.98)",
                borderRadius: "14px",
                boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                overflow: "hidden",
                width: "220px",
                border: "1px solid #dce7df",
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #edf2ef",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#f8fff9",
                }}
              >
                <img
                  src={profileIcon}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#234f35",
                      fontSize: "0.9rem",
                    }}
                  >
                    {userName || "User"}
                  </div>
                  {userEmail && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {userEmail}
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ backgroundColor: "#e7f4ec" }}
                style={menuButtonStyle}
                onClick={() => {
                  setMenuOpen(false);
                  window.location.href = "/history";
                }}
              >
                🧾 History
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "#f3e7e7" }}
                style={{ ...menuButtonStyle, borderTop: "1px solid #eee" }}
                onClick={() => {
                  setMenuOpen(false);
                  supabase.auth.signOut();
                }}
              >
                ⏻ Logout
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: isMobile ? "1rem" : "2rem",
        }}
      >
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="intro"
              style={{
                textAlign: "center",
                padding: isMobile ? "1.5rem" : "3rem",
                background: "rgba(215, 228, 214, 0.9)",
                borderRadius: "20px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                maxWidth: isMobile ? "100%" : "600px",
                width: "100%",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <motion.div
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4caf50, #2e7d32)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 1rem auto",
                  }}
                >
                  <img
                    src={ayulogo}
                    alt="AyuPredict Logo"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                    }}
                  />
                </motion.div>

                <motion.h1
                  style={{
                    fontSize: isMobile ? "2rem" : "3rem",
                    color: "#1b6b3d",
                    fontWeight: "700",
                    marginBottom: "1rem",
                  }}
                >
                  AyuPredict
                </motion.h1>
              </motion.div>

              <motion.p
                style={{
                  color: "#4a4a4a",
                  fontSize: isMobile ? "0.95rem" : "1.1rem",
                  lineHeight: "1.7",
                  marginBottom: "2rem",
                }}
              >
                Your <strong>AI-powered health companion</strong>.
                <br />
                Analyze your lifestyle & get a personalized{" "}
                <b>health prediction</b>.
              </motion.p>

              <motion.button
                onClick={() => setStarted(true)}
                style={{
                  width: isMobile ? "100%" : "auto",
                  background: "linear-gradient(90deg, #4caf50, #2e7d32)",
                  border: "none",
                  color: "white",
                  padding: "0.9rem 2rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.05 }}
              >
                Begin Your Health Check
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              style={{
                width: "100%",
                maxWidth: "700px",
                background: "rgba(255,255,255,0.95)",
                padding: isMobile ? "1.2rem" : "2rem",
                borderRadius: "20px",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <img
                  src={bgrayulogo}
                  alt="AyuPredict Logo"
                  style={{
                    width: isMobile ? "140px" : "200px",
                    height: "auto",
                  }}
                />
              </div>

              <p
                style={{
                  textAlign: "center",
                  color: "#555",
                  fontSize: isMobile ? "0.95rem" : "1.1rem",
                  marginBottom: "1.5rem",
                }}
              >
                Let's predict your <b>health</b> and <b>life expectancy</b>.
              </p>

              <PredictionForm />

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <motion.button
                  onClick={() => setStarted(false)}
                  style={{
                    width: isMobile ? "100%" : "auto",
                    background: "transparent",
                    color: "#2e7d32",
                    border: "1px solid #9ccc65",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "10px",
                  }}
                >
                  ← Back to Start
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          width: "100%",
          textAlign: "center",
          padding: isMobile ? "0.6rem 0" : "0.3rem 0",
          background: "linear-gradient(90deg, #4caf50, #2e7d32)",
          color: "white",
          fontSize: isMobile ? "0.75rem" : "0.9rem",
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} <b>AyuPredict</b>. All rights reserved.
        </p>
        <p style={{ opacity: 0.9 }}>
          Designed & Developed by <b>Sahil Karande</b>
        </p>
      </footer>
    </div>
  );
}

/* ============================
   MENU BUTTON STYLE
============================ */
const menuButtonStyle = {
  width: "100%",
  background: "transparent",
  border: "none",
  padding: "12px",
  textAlign: "left",
  fontSize: "0.95rem",
  cursor: "pointer",
  color: "#234f35",
  fontWeight: "500",
  transition: "0.3s",
};
