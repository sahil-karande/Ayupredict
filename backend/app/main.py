from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import InputData, PredictionResponse
from app.model_utils import load_model, predict
from dotenv import load_dotenv
import os

load_dotenv()  # 👈 loads .env file into environment
print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))


app = FastAPI(title="AyuPredict API", version="1.0")

# 🔐 CORS (add your Vercel domain here)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://ayupredict.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

@app.on_event("startup")
def startup_event():
    global model
    model = load_model()
    print("✅ AyuPredict model loaded successfully!")

@app.get("/")
def root():
    return {"status": "AyuPredict backend running"}

@app.post("/predict", response_model=PredictionResponse)
def predict_endpoint(data: InputData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    body_damage, life_expectancy, meta = predict(model, data.dict())

    return {
        "Body_Damage_Percent": round(body_damage, 2),
        "Life_Expectancy": int(life_expectancy),
        "meta": meta
    }
