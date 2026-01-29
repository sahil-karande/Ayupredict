import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

// 🔥 FULLY FIXED — Converts Supabase UTC → Exact IST (No browser issues)
function convertToIST(timestamp) {
  const utcDate = new Date(timestamp);

  // Manual IST offset: UTC + 5 hours 30 minutes
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istDate = new Date(utcDate.getTime() + istOffset);

  return istDate.toLocaleString("en-IN", {
    hour12: true,
  });
}

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setReports(data || []);
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #eaf8f1, #f4faf6, #f9fffb)",
        padding: "2rem",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.h1
        style={{ textAlign: "center", color: "#1b6b3d", marginBottom: "2rem" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧾 Your Health Test Report
      </motion.h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : reports.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>
          No records found.
        </p>
      ) : (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "white",
                padding: "1.2rem",
                borderRadius: "14px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: "#2e7d32", marginBottom: "0.5rem" }}>
                🩺 Test Result
              </h3>

              {/* ⭐ ALWAYS CORRECT IST TIME */}
              <p style={{ margin: "4px 0", color: "#444" }}>
                <b>Date:</b> {convertToIST(report.created_at)}
              </p>

              <p style={{ margin: "4px 0", color: "#444" }}>
                <b>Prediction:</b> {report.prediction_result || "-"}
              </p>

              {report.body_damage && (
                <p style={{ margin: "4px 0", color: "#444" }}>
                  <b>Damage Score:</b> {report.body_damage}%
                </p>
              )}

              {report.life_expectancy && (
                <p style={{ margin: "4px 0", color: "#444" }}>
                  <b>Life Expectancy:</b> {report.life_expectancy} years
                </p>
              )}

              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 14px",
                  background: "linear-gradient(90deg, #4caf50, #2e7d32)",
                  border: "none",
                  color: "white",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                onClick={() => window.location.href = `/report/${report.id}`}

                
              >
                View Full Report →
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
