# 🌿 AyuPredict

**AyuPredict** is an AI-powered health risk prediction web application that estimates **life expectancy impact** and **body damage risk** based on harmful lifestyle habits such as **smoking, alcohol consumption, tobacco use, and other addictions**.

The project is designed to create awareness by presenting health insights in a **simple, interactive, and visually engaging way**.

---

## 📌 Project Overview

AyuPredict helps users understand how certain addictions and unhealthy habits may affect their long-term health.  
The application takes lifestyle-related inputs from the user and predicts:

- **Estimated life expectancy impact**
- **Body damage percentage**
- **Confidence score**
- **Personalized health suggestions**

The goal of this project is not to replace medical advice, but to provide an **educational health-awareness tool** using **AI/ML and modern web technologies**.

---

## 🚀 Features

### 🎯 Health Risk Prediction
Predicts health damage based on user habits

### 📉 Life Expectancy Estimation
Gives an approximate effect of addictions on lifespan

### 📊 Confidence Meter
Displays model confidence for the prediction

### 🟢 Animated Progress Rings
Visual representation of body damage and health score

### 💡 Dynamic Health Tips
Personalized suggestions based on the result

### ✨ Modern UI/UX
Smooth transitions, intro screen, and professional healthcare-inspired design

### ⚡ Fast API Integration
Frontend connected to a backend prediction API

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Framer Motion
- Axios
- CSS / Custom Styling

### Backend
- FastAPI
- Python
- Machine Learning Model

---

## 🧠 How It Works

1. The user opens the AyuPredict application.
2. An animated intro screen introduces the platform.
3. The user fills out a health/addiction prediction form.
4. The frontend sends the data to the FastAPI backend via the `/predict` API.
5. The machine learning model processes the input and returns:
   - Damage percentage
   - Life expectancy estimation
   - Confidence score
   - Health recommendations
6. The results are displayed with animations, progress rings, and tips.

---

## 📂 Project Structure

```bash
AyuPredict/
│
├── backend/
│   ├── main.py
│   ├── model/
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│
└── README.md

