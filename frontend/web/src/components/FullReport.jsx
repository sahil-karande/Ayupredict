import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Convert UTC → IST
function convertToIST(ts) {
  const date = new Date(ts);
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + offset).toLocaleString("en-IN", {
    hour12: true,
  });
}

export default function FullReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    fetchReport();
    fetchUserName();
  }, []);

  // Fetch prediction report
  async function fetchReport() {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setReport(data);
  }

  // Fetch user's full name from profiles
  async function fetchUserName() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (!error && data?.full_name) {
      setFullName(data.full_name);
    }
  }

  // ---------------- PDF DOWNLOAD ----------------
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("AyuPredict - Health Report", 14, 18);

    doc.setFontSize(12);
    doc.text(`Name: ${fullName || "User"}`, 14, 28);
    doc.text(`Report ID: ${id}`, 14, 36);
    doc.text(`Date: ${convertToIST(report.created_at)}`, 14, 44);

    autoTable(doc, {
      startY: 55,
      head: [["Field", "Value"]],
      body: [
        ["Age", report.age],
        ["Gender", report.gender],
        ["BMI", report.bmi],
        ["Smoker", report.smoker ? "Yes" : "No"],
        ["Drinker", report.drinker ? "Yes" : "No"],
        ["Tobacco User", report.tobacco_user ? "Yes" : "No"],
        ["Sleep Hours", report.sleep_hours],
        ["Stress Level", report.stress_level],
        ["Exercise Level", report.exercise_level],
        ["Exercise Days", report.exercise_days],
        ["Addiction Years", report.addiction_years],
        ["Existing Disease", report.disease],
        ["Body Damage %", report.body_damage],
        ["Life Expectancy", report.life_expectancy],
      ],
    });

    const meta = report.meta || {};
    const risk = meta.disease_risks || {};

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Disease Risk", "Value"]],
      body: [
        ["Heart", risk.heart],
        ["Diabetes", risk.diabetes],
        ["Cancer", risk.cancer],
        ["Obesity Level", meta.obesity_level],
        ["Genetic Risk", meta.genetic_risk],
      ],
    });

    doc.save("AyuPredict_Report.pdf");
  };

  if (!report) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const meta = report.meta || {};
  const risk = meta.disease_risks || {};

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1 style={{ color: "#1b6b3d", textAlign: "center" }}>
        📝 Full Health Report
      </h1>

      {/* SHOW FULL NAME */}
      <p style={{ textAlign: "center", color: "#444" }}>
        <b>Name:</b> {fullName || "User"}
      </p>

      <p style={{ textAlign: "center", color: "#444" }}>
        <b>Report Date:</b> {convertToIST(report.created_at)}
      </p>

      {/* MAIN CARD */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "14px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          marginTop: "1rem",
        }}
      >
        <h3 style={{ color: "#2e7d32" }}>User Inputs</h3>

        <table style={{ width: "100%", marginTop: "10px" }}>
          <tbody>
            <tr><td>Age</td><td>{report.age}</td></tr>
            <tr><td>Gender</td><td>{report.gender}</td></tr>
            <tr><td>BMI</td><td>{report.bmi}</td></tr>
            <tr><td>Smoker</td><td>{report.smoker ? "Yes" : "No"}</td></tr>
            <tr><td>Drinker</td><td>{report.drinker ? "Yes" : "No"}</td></tr>
            <tr><td>Tobacco User</td><td>{report.tobacco_user ? "Yes" : "No"}</td></tr>
            <tr><td>Sleep Hours</td><td>{report.sleep_hours}</td></tr>
            <tr><td>Stress Level</td><td>{report.stress_level}</td></tr>
            <tr><td>Exercise Level</td><td>{report.exercise_level}</td></tr>
            <tr><td>Exercise Days</td><td>{report.exercise_days}</td></tr>
            <tr><td>Addiction Years</td><td>{report.addiction_years}</td></tr>
            <tr><td>Disease</td><td>{report.disease}</td></tr>
          </tbody>
        </table>

        <h3 style={{ color: "#2e7d32", marginTop: "1.5rem" }}>
          Prediction Results
        </h3>

        <p><b>Body Damage:</b> {report.body_damage}%</p>
        <p><b>Life Expectancy:</b> {report.life_expectancy} years</p>

        <h4>Disease Risk:</h4>
        <ul>
          <li>Heart: {risk.heart}%</li>
          <li>Diabetes: {risk.diabetes}%</li>
          <li>Cancer: {risk.cancer}%</li>
        </ul>

        <h4>Other Findings:</h4>
        <ul>
          <li>Obesity Level: {meta.obesity_level}</li>
          <li>Genetic Risk: {meta.genetic_risk}</li>
        </ul>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={downloadPDF}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            padding: "12px",
            background: "linear-gradient(90deg,#4caf50,#2e7d32)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          📥 Download PDF Report
        </button>
      </div>
    </div>
  );
}
