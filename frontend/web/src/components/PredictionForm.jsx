import React, { useState, useEffect } from "react";
import axios from "axios";
import ResultDisplay from "./ResultDisplay";
import { supabase } from "../lib/supabase";

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",

    smoker: false,
    drinker: false,
    tobacco_user: false,

    exercise_level: "medium",

    height: "",
    weight: "",
    bmi: "",

    sleep_hours: "",
    stress_level: "medium",

    addiction_years: "",
    exercise_days: "",
    disease: "None",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultReady, setResultReady] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // ✅ MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ⭐ AUTO-BMI
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    const h = Number(height) / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "height" || name === "weight") {
      updated.bmi = calculateBMI(
        name === "height" ? value : updated.height,
        name === "weight" ? value : updated.weight
      );
    }

    setFormData(updated);
  };

  async function saveNameToProfile(name) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) return;

    await supabase.from("profiles").update({ full_name: name }).eq("id", userId);
  }

  async function savePredictionToDB(inputData, resultData) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;

    if (!userId) {
      console.warn("⚠ No user logged in → skipping DB save");
      return;
    }

    const { error } = await supabase.from("predictions").insert([
      {
        user_id: userId,
        age: inputData.age,
        gender: inputData.gender,
        bmi: inputData.bmi,
        smoker: inputData.smoker,
        drinker: inputData.drinker,
        tobacco_user: inputData.tobacco_user,
        sleep_hours: inputData.sleep_hours,
        stress_level: inputData.stress_level,
        exercise_level: inputData.exercise_level,
        addiction_years: inputData.addiction_years,
        exercise_days: inputData.exercise_days,
        disease: inputData.disease,
        body_damage: resultData.Body_Damage_Percent,
        life_expectancy: resultData.Life_Expectancy,
        meta: resultData.meta,
      },
    ]);

    if (error) console.error("❌ Supabase Insert Error:", error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResult(false);
    setResultReady(false);

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        bmi: Number(formData.bmi),
        height: Number(formData.height),
        weight: Number(formData.weight),
        sleep_hours: Number(formData.sleep_hours),
        addiction_years: Number(formData.addiction_years),
        exercise_days: Number(formData.exercise_days),
      };

      const res = await axios.post("http://127.0.0.1:8000/predict", payload);

      const resultData = {
        Body_Damage_Percent: res.data.Body_Damage_Percent,
        Life_Expectancy: res.data.Life_Expectancy,
        meta: res.data.meta,
      };

      if (formData.name.trim() !== "") {
        await saveNameToProfile(formData.name);
      }

      await savePredictionToDB(payload, resultData);

      setResult({
        ...resultData,
        name: formData.name || "User",
        userInput: formData,
      });

      setResultReady(true);
    } catch (err) {
      console.error(err);
      alert("⚠ Backend not connected.");
    } finally {
      setLoading(false);
    }
  };

  // 🌿 UI STARTS HERE
  return (
    <>
      {!showResult && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "1.2rem" : "2.5rem 4rem",
            width: "100%",
          }}
        >
          {[
            ["Name", "name", "text"],
            ["Age", "age", "number"],
            ["Gender", "gender", "select"],
            ["Height (cm)", "height", "number"],
            ["Weight (kg)", "weight", "number"],
            ["BMI (auto)", "bmi", "number", true],
            ["Sleep (hrs)", "sleep_hours", "number"],
            ["Stress Level", "stress_level", "select"],
            ["Exercise Level", "exercise_level", "select"],
            ["Addiction Years", "addiction_years", "number"],
            ["Exercise Days/week", "exercise_days", "number"],
          ].map(([label, name, type, readOnly], idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 500 }}>{label}</label>
              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  {name === "gender" && (
                    <>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </>
                  )}
                  {name === "stress_level" && (
                    <>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </>
                  )}
                  {name === "exercise_level" && (
                    <>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  readOnly={readOnly}
                  style={
                    readOnly
                      ? { ...inputStyle, background: "#eee" }
                      : inputStyle
                  }
                />
              )}
            </div>
          ))}

          {/* Disease */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: 500 }}>Existing Disease</label>
            <select
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="None">None</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Heart">Heart</option>
              <option value="Asthma">Asthma</option>
              <option value="Cancer">Cancer</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div
            style={{
              gridColumn: isMobile ? "1" : "1 / span 2",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "0.6rem",
              marginTop: 6,
            }}
          >
            <label>
              <input
                type="checkbox"
                name="smoker"
                checked={formData.smoker}
                onChange={handleChange}
              />{" "}
              Smoker
            </label>
            <label>
              <input
                type="checkbox"
                name="drinker"
                checked={formData.drinker}
                onChange={handleChange}
              />{" "}
              Drinker
            </label>
            <label>
              <input
                type="checkbox"
                name="tobacco_user"
                checked={formData.tobacco_user}
                onChange={handleChange}
              />{" "}
              Tobacco User
            </label>
          </div>

          {/* Submit */}
          <div
            style={{
              gridColumn: isMobile ? "1" : "1 / span 2",
              textAlign: "center",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg,#43a047,#2e7d32)",
                color: "white",
                padding: "12px 18px",
                borderRadius: 10,
                border: "none",
                width: "100%",
                fontWeight: 600,
                fontSize: isMobile ? "1rem" : "0.95rem",
              }}
            >
              {loading ? "Predicting..." : "Predict My Health"}
            </button>
          </div>
        </form>
      )}

      {resultReady && !showResult && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => setShowResult(true)}
            style={{
              background: "linear-gradient(90deg,#4caf50,#2e7d32)",
              padding: "12px 25px",
              borderRadius: "12px",
              color: "white",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
            }}
          >
            Show My Result
          </button>
        </div>
      )}

      {showResult && result && (
        <div style={{ marginTop: "2rem" }}>
          <ResultDisplay result={result} />
        </div>
      )}
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  outline: "none",
  marginTop: 6,
  fontSize: 16,
};
