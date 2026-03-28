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

  ## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/AyuPredict.git
cd AyuPredict
🔧 Backend Setup (FastAPI)
Navigate to backend folder
cd backend
Create virtual environment
python -m venv venv
Activate virtual environment
Windows
venv\Scripts\activate
Mac/Linux
source venv/bin/activate
Install dependencies
pip install -r requirements.txt
Run FastAPI server
uvicorn main:app --reload

Backend will run on:

http://127.0.0.1:8000
💻 Frontend Setup (React + Vite)
Open a new terminal and go to frontend folder
cd frontend
Install dependencies
npm install
Start frontend
npm run dev

Frontend will run on:

http://localhost:5173
🔌 API Endpoint
POST /predict

This endpoint receives user health/addiction data and returns prediction results.

Example Input
{
  "smoking": 1,
  "alcohol": 1,
  "tobacco": 0,
  "exercise": 0,
  "age": 24
}
Example Output
{
  "body_damage": 62,
  "life_expectancy_impact": 14,
  "confidence": 91,
  "tips": [
    "Reduce smoking gradually",
    "Avoid alcohol intake",
    "Start light daily exercise"
  ]
}
🎨 UI Design Theme

AyuPredict follows a calming healthcare-inspired theme with:

Soft green-beige palette
Smooth page transitions
Animated result cards
Professional and clean layout
User-friendly health dashboard style
📸 Screens Included in the Project
Intro / Landing Screen
User Prediction Form
Result Dashboard
Progress Rings & Confidence Meter
Health Tips Section
🎯 Use Case

This project can be useful for:

Health awareness campaigns
AI/ML academic projects
Portfolio projects
Hackathons
Healthcare tech demonstrations
⚠️ Disclaimer

AyuPredict is an educational and awareness-based project only.
It does not provide real medical diagnosis, treatment, or professional healthcare advice.
Users should consult certified medical professionals for actual health concerns.

📈 Future Improvements
User authentication system
Prediction history tracking
Doctor consultation suggestions
More advanced health parameters
Better ML model accuracy
Mobile app version
Data visualization dashboard
👨‍💻 Author

Sahil Karande
AI Engineering Student | Developer | ML & Web Enthusiast

⭐ Support

If you like this project, feel free to:

⭐ Star the repository
🍴 Fork the project
🛠️ Contribute improvements
