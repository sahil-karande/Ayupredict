# backend/train/train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from joblib import dump

# Define paths
BASE = Path(__file__).resolve().parents[1]
DATA_PATH = BASE / "data" / "health_prediction_dataset.csv"   # ✅ CSV file
MODEL_PATH = BASE / "models" / "model.joblib"

def train_model():
    # Load dataset
    df = pd.read_csv(DATA_PATH).dropna()   # ✅ read_csv, not read_excel
    print("✅ Data loaded successfully!")

    X = df[["Age","Gender","Smoker","Drinker","Tobacco","Addiction_Years","BMI","Exercise_Days_per_Week","Sleep_Hours"]]
    y = df[["Body_Damage_%","Life_Expectancy"]]

    preprocessor = ColumnTransformer(
        [("cat", OneHotEncoder(handle_unknown="ignore"), ["Gender"])],
        remainder="passthrough"
    )

    pipeline = Pipeline([
        ("pre", preprocessor),
        ("reg", MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42)))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipeline.fit(X_train, y_train)

    print("Train R²:", pipeline.score(X_train, y_train))
    print("Test R²: ", pipeline.score(X_test, y_test))

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
