import React, { useState } from "react";
import { motion } from "framer-motion";


// 🧠 Smart Tip Generator
const generateHealthTips = (data) => {
  const tips = [];
  const {
    Body_Damage_Percent: damage,
    Life_Expectancy: life,
    meta,
    userInput
  } = data;

  const { disease_risks, obesity_level } = meta;
  const {
    sleep_hours,
    stress_level,
    smoker,
    drinker,
    tobacco_user,
    exercise_days,
    exercise_level,
    bmi,
    age,
    disease
  } = userInput;


  // ---- BODY DAMAGE ----
  if (damage > 70) tips.push("Your body damage is very high — start reducing addictions immediately.");
  if (damage > 50 && exercise_days < 3) tips.push("Increasing daily walking or gym activity will greatly help.");

  // ---- AGE ----
  if (age > 55 && life < age + 10)
    tips.push("Focus on heart-healthy diet, regular walking and low-stress routines.");

  // ---- BMI / OBESITY ----
  if (obesity_level === "Obese")
    tips.push("Your BMI is high — try calorie deficit and regular cardio to reduce weight.");
  if (obesity_level === "Underweight")
    tips.push("Increase your calorie intake with nutritious, high-protein foods.");

  // ---- SLEEP ----
  if (sleep_hours < 6) tips.push("Try to get at least 6–8 hours of sleep. Poor sleep raises stress.");
  if (sleep_hours > 9) tips.push("Oversleeping can reduce energy levels — aim for 7–8 hours.");

  // ---- STRESS ----
  if (stress_level === "high")
    tips.push("Your stress is high — try meditation, deep breathing or short breaks.");

  // ---- ADDICTIONS ----
  if (smoker) tips.push("Smoking increases cancer & lung disease risk. Consider quitting.");
  if (drinker) tips.push("Limit alcohol for better liver and heart health.");
  if (tobacco_user)
    tips.push("Tobacco usage increases cancer risk — reducing it will significantly improve health.");

  // ---- EXERCISE ----
  if (exercise_days < 2) tips.push("Aim for at least 3–4 days of exercise weekly.");
  if (exercise_level === "low") tips.push("Try gradually increasing your workout intensity.");

  // ---- DISEASE ----
  if (disease === "Diabetes") tips.push("Reduce sugar and carbs. Monitor glucose regularly.");
  if (disease === "Heart") tips.push("Avoid oily foods. Add 20–30 min walking daily.");
  if (disease === "Asthma") tips.push("Avoid dust & smoking areas. Practice breathing exercises.");
  if (disease === "Cancer") tips.push("Eat immunity-boosting foods and follow doctor's guidance.");

  // ---- DISEASE RISKS (MODEL OUTPUT) ----
  if (disease_risks.diabetes > 25)
    tips.push("Your diabetes risk is high — avoid sweetened foods and start light exercise.");

  if (disease_risks.heart > 25)
    tips.push("Heart disease risk is high — reduce stress and maintain a low-fat diet.");

  if (disease_risks.cancer > 20)
    tips.push("Cancer risk is elevated — avoid tobacco, alcohol and processed foods.");

  if (tips.length === 0) tips.push("Your health looks stable — maintain balanced food and regular activity.");

  return tips;
};


const ResultDisplay = ({ result }) => {
  if (!result) return null;

  const [showResult, setShowResult] = useState(false);

  const { Body_Damage_Percent, Life_Expectancy, meta, name, userInput } = result;

  const disease_risks = meta?.disease_risks || {};
  const obesity_level = meta?.obesity_level || "Unknown";
  const genetic_risk = meta?.genetic_risk || "Low";

  const getColor = (damage) => {
    if (damage < 25) return "#16a34a";
    if (damage < 50) return "#f59e0b";
    if (damage < 75) return "#f97316";
    return "#ef4444";
  };


  // ▶ STEP 1 — Show button
  if (!showResult) {
    return (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          onClick={() => setShowResult(true)}
          style={{
            background: "linear-gradient(90deg,#43a047,#2e7d32)",
            padding: "12px 26px",
            borderRadius: 10,
            color: "white",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          }}
        >
          Show My Results
        </button>
      </div>
    );
  }


  // ▶ STEP 2 — Show full report
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "white",
        padding: 20,
        borderRadius: 14,
        boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
        maxWidth: 750,
      }}
    >
      {/* GREETING */}
      <h2
        style={{
          color: "#14532d",
          marginBottom: 16,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        👋 Hey <span style={{ color: "#1b6b3d" }}>{name}</span>,  
        here is your health report:
      </h2>


      {/* MAIN BLOCK */}
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>

        {/* CIRCLE */}
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <svg viewBox="0 0 120 120" width="140" height="140">
            <circle cx="60" cy="60" r="54" stroke="#eee" strokeWidth="10" fill="none" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              stroke={getColor(Body_Damage_Percent)}
              strokeWidth="10"
              fill="none"
              strokeDasharray="339.292"
              strokeDashoffset={339.292 - (339.292 * Body_Damage_Percent) / 100}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 339.292 }}
              animate={{ strokeDashoffset: 339.292 - (339.292 * Body_Damage_Percent) / 100 }}
              transition={{ duration: 1.2 }}
            />
          </svg>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                color: getColor(Body_Damage_Percent),
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              {Body_Damage_Percent}%
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>Body Damage</div>
          </div>
        </div>


        {/* LIFE EXPECTANCY */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, color: "#166534" }}>Estimated Life Expectancy</h3>
          <p
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: "6px 0",
              color: "#166534",
            }}
          >
            {Life_Expectancy} years
          </p>

          {/* Confidence Bar */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>
              Health Confidence
            </div>
            <div style={{ height: 12, background: "#eee", borderRadius: 999 }}>
              <div
                style={{
                  width: `${Body_Damage_Percent}%`,
                  height: 12,
                  borderRadius: 999,
                  background: getColor(Body_Damage_Percent),
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 13, color: "#444" }}>
            <div><strong>Obesity:</strong> {obesity_level}</div>
            <div><strong>Genetic Risk:</strong> {genetic_risk}</div>
          </div>
        </div>
      </div>



      {/* DISEASE RISK */}
      <div style={{ marginTop: 20 }}>
        <h4 style={{ margin: 0, color: "#0f5132" }}>Disease Risk Estimates</h4>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {["heart", "diabetes", "cancer"].map((k) => (
            <div
              key={k}
              style={{
                flex: 1,
                background: "#fafafa",
                padding: 12,
                borderRadius: 8,
                textAlign: "center",
                border: "1px solid #eee",
              }}
            >
              <div style={{ fontSize: 14, color: "#333", fontWeight: 600 }}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  marginTop: 6,
                  color: "#b91c1c",
                }}
              >
                {disease_risks[k] ?? "-"}%
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* DYNAMIC TIPS */}
      <div style={{ marginTop: 18 }}>
        <h4 style={{ margin: 0, color: "#0f5132" }}>Helpful Tips</h4>
        <ul style={{ marginTop: 8 }}>
          {generateHealthTips({
            Body_Damage_Percent,
            Life_Expectancy,
            meta,
            userInput
          }).map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

    </motion.div>
  );
};

export default ResultDisplay;
