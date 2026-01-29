from pydantic import BaseModel
from typing import Dict, Any, Optional

class InputData(BaseModel):
    # ---------- Basic ----------
    name: Optional[str] = None
    age: float
    gender: str

    # ---------- Addictions ----------
    smoker: bool
    drinker: bool
    tobacco_user: bool

    # ---------- Lifestyle ----------
    exercise_level: str
    sleep_hours: float
    stress_level: str

    # ---------- Body Metrics ----------
    bmi: Optional[float] = None
    height: Optional[float] = 0
    weight: Optional[float] = 0

    # ---------- Optional Add-ons ----------
    addiction_years: Optional[float] = 0
    exercise_days: Optional[float] = 0

    disease: Optional[str] = "None"
    genetic_risk: Optional[str] = "low"


class PredictionResponse(BaseModel):
    Body_Damage_Percent: float
    Life_Expectancy: int
    meta: Optional[Dict[str, Any]] = None

    class Config:
        schema_extra = {
            "example": {
                "Body_Damage_Percent": 24.34,
                "Life_Expectancy": 65,
                "meta": {
                    "disease_risks": {
                        "heart": 12.3,
                        "diabetes": 8.1,
                        "cancer": 3.2
                    },
                    "obesity_level": "Normal",
                    "genetic_risk": "Medium"
                }
            }
        }
