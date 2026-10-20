import { Router, Request, Response } from "express";
import { register, login, getMe } from "../controllers/authController";
import { getProfile, updateProfile } from "../controllers/profileController";
import { getFarms, getFarmById, createFarm, updateFarm } from "../controllers/farmController";
import { getFieldsByFarm, getFieldById, createField, updateField } from "../controllers/fieldController";
import { getSoilData, getWeatherData, getSatelliteData, getCropHealth } from "../controllers/telemetryController";
import { createYieldPrediction, getPredictionsByFarm, getModelMetadata } from "../controllers/predictionController";
import { runFarmSimulation, getSimulationById } from "../controllers/simulationController";
import { getRecommendations, updateRecommendationStatus } from "../controllers/recommendationController";
import { getRiskAlerts } from "../controllers/riskController";
import { getIrrigationIntelligence, logIrrigationEvent } from "../controllers/irrigationController";
import { getFarmHistory } from "../controllers/historyController";
import { getDashboardSummary, getDataQualityAudit } from "../controllers/dashboardController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Auth Endpoints
router.post("/auth/register", register);
router.post("/auth/signup", register);
router.post("/auth/login", login);
router.post("/auth/logout", (_req: Request, res: Response) => {
  return res.json({ status: "success", message: "Logged out successfully" });
});
router.get("/auth/me", requireAuth, getMe);

// Farmer Profile Endpoints
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);

// Farm Endpoints
router.get("/farm", requireAuth, getFarms);
router.put("/farm", requireAuth, updateProfile);
router.get("/farms", requireAuth, getFarms);
router.post("/farms", requireAuth, createFarm);
router.get("/farms/:id", requireAuth, getFarmById);
router.put("/farms/:id", requireAuth, updateFarm);

// Field Endpoints
router.get("/fields/:farmId", requireAuth, getFieldsByFarm);
router.post("/fields", requireAuth, createField);
router.get("/fields/detail/:id", requireAuth, getFieldById);
router.put("/fields/:id", requireAuth, updateField);

// Telemetry & Soil / Weather / Satellite Demo Endpoints
router.get("/soil/:farmId", requireAuth, getSoilData);
router.get("/weather/:farmId", requireAuth, getWeatherData);
router.get("/satellite/:farmId", requireAuth, getSatelliteData);
router.get("/crop-health/:farmId", requireAuth, getCropHealth);

// Yield Prediction & Explainable AI
router.post("/predictions/yield", requireAuth, createYieldPrediction);
router.get("/predictions/:farmId", requireAuth, getPredictionsByFarm);
router.get("/model-info", requireAuth, getModelMetadata);

// What-If Farm Simulation
router.post("/simulation", requireAuth, runFarmSimulation);
router.get("/simulation/:id", requireAuth, getSimulationById);

// Recommendations
router.get("/recommendations/:farmId", requireAuth, getRecommendations);
router.put("/recommendations/:id", requireAuth, updateRecommendationStatus);

// Agro-Climatic Risks & Alerts
router.get("/risks/:farmId", requireAuth, getRiskAlerts);

// Irrigation
router.get("/irrigation/:farmId", requireAuth, getIrrigationIntelligence);
router.post("/irrigation", requireAuth, logIrrigationEvent);

// Chronological Farm History
router.get("/history/:farmId", requireAuth, getFarmHistory);

// Unified Dashboard Command Center & Data Quality
router.get("/dashboard/:farmId", requireAuth, getDashboardSummary);
router.get("/data-quality/:farmId", requireAuth, getDataQualityAudit);

export default router;
