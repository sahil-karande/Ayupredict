from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import InputData, PredictionResponse  # see schema note below
from app.model_utils import load_model, predict

app = FastAPI(title="AyuPredict API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173","http://localhost:3000"],
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
    return {"message": "Welcome to AyuPredict API"}

@app.post("/predict", response_model=PredictionResponse)
def predict_endpoint(data: InputData):
    try:
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        print("📥 Received data:", data.dict())
        body_damage, life_expectancy, meta = predict(model, data.dict())
        print("📊 Prediction results:", body_damage, life_expectancy, meta)
        # return standard fields plus meta (Pydantic schema needs to allow extras)
        response = {
            "Body_Damage_Percent": round(body_damage, 2),
            "Life_Expectancy": int(life_expectancy),
            # include meta dictionary with disease_risks etc:
            "meta": meta
        }
        return response
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    from fastapi import FastAPI

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later restrict to Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "AyuPredict backend running"}
