"""
AgriTwin Sugarcane Agronomic ML Service
FastAPI REST API providing real-time Sugarcane Yield Prediction, Explainable AI (SHAP attributions), and What-If Simulations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import uvicorn
from model import sugarcane_model
from explainer import generate_farmer_narrative
from simulator import run_simulation

app = FastAPI(
    title="AgriTwin Sugarcane ML Microservice",
    version="1.4.0",
    description="Dedicated machine learning service for Indian Sugarcane farms powered by the Kaggle Sugarcane Dataset."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SugarcanePredictionRequest(BaseModel):
    crop: Optional[str] = "sugarcane"
    rainfall: Optional[float] = 1200.0
    temperature: Optional[float] = 28.5
    sunlight: Optional[float] = 8.0
    nitrogen: Optional[float] = 220.0
    phosphorus: Optional[float] = 75.0
    potassium: Optional[float] = 140.0
    soil_type: Optional[str] = "Black Soil"
    crop_duration: Optional[int] = 12
    irrigation_frequency: Optional[str] = "2 times/week"
    pest_control: Optional[str] = "Integrated"
    seed_variety: Optional[str] = "Co 86032"
    farm_id: Optional[str] = None
    field_id: Optional[str] = None

class SimulationRequest(BaseModel):
    baseline_state: Dict[str, Any]
    scenario_params: Dict[str, Any]

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AgriTwin Sugarcane ML Service",
        "model": sugarcane_model.metadata.get("model_name", "XGBoost Regressor"),
        "is_model_trained": sugarcane_model.is_trained,
        "dataset": "Kaggle Sugarcane Dataset",
        "target_unit": "quintals/acre (converted to tonnes/ha)"
    }

@app.get("/model-info")
def get_model_info():
    if not sugarcane_model.is_trained:
        sugarcane_model._load_model()
    return {
        "status": "success",
        "metadata": sugarcane_model.metadata
    }

@app.post("/predict/yield")
def predict_sugarcane_yield(req: SugarcanePredictionRequest):
    try:
        features = req.model_dump()
        prediction = sugarcane_model.predict(features)
        explanations = sugarcane_model.explain(features)
        narrative = generate_farmer_narrative(
            features=features,
            explanations=explanations,
            expected_yield_tonnes=prediction["expected_yield_tonnes_ha"],
            expected_yield_quintals=prediction["expected_yield_q_acre"]
        )
        
        return {
            "status": "success",
            "prediction": prediction,
            "feature_importance": explanations,
            "explainable_narrative": narrative,
            "input_echo": features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/explain")
def explain_features(req: SugarcanePredictionRequest):
    try:
        features = req.model_dump()
        explanations = sugarcane_model.explain(features)
        return {
            "status": "success",
            "factors": explanations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation error: {str(e)}")

@app.post("/simulate")
def simulate_scenario(req: SimulationRequest):
    try:
        results = run_simulation(req.baseline_state, req.scenario_params)
        return {
            "status": "success",
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
