import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  Farm, Field, WeatherData, Recommendation,
  Prediction, Farmer
} from "../models";

export async function getDashboardSummary(req: AuthRequest, res: Response) {
  try {
    const { farmId } = req.params;
    let farm = null;
    if (farmId && farmId !== "default" && farmId.match(/^[0-9a-fA-F]{24}$/)) {
      farm = await Farm.findById(farmId);
    }
    if (!farm) {
      farm = await Farm.findOne();
    }
    if (!farm) {
      return res.status(404).json({ message: "No farm found in Digital Twin system" });
    }

    const farmer = await Farmer.findOne({ userId: farm.farmerId }) || {
      fullName: "Ramesh Patil",
      village: "Kasba Bawada",
      taluka: "Karveer",
      district: "Kolhapur",
      state: "Maharashtra"
    };

    const fields = await Field.find({ farmId: farm._id });
    const weather = await WeatherData.findOne({ farmId: farm._id }).sort({ timestamp: -1 });
    const latestPrediction = await Prediction.findOne({ farmId: farm._id }).sort({ createdAt: -1 });
    const priorityRecommendations = await Recommendation.find({
      farmId: farm._id,
      status: "pending"
    }).sort({ urgency: -1 }).limit(4);

    // Compute key telemetry aggregates
    const avgYieldTonnes = fields.length > 0
      ? Number((fields.reduce((acc, f) => acc + (f.predictedYieldTonnesHa || f.predictedYield || 135), 0) / fields.length).toFixed(1))
      : 138.5;

    const avgYieldQAcre = Number((avgYieldTonnes / 0.247105).toFixed(1));

    const avgMoisture = fields.length > 0
      ? Number((fields.reduce((acc, f) => acc + (f.currentSoilMoisture || 34.0), 0) / fields.length).toFixed(1))
      : 34.2;

    const avgNdvi = fields.length > 0
      ? Number((fields.reduce((acc, f) => acc + (f.currentNDVI || 0.82), 0) / fields.length).toFixed(2))
      : 0.82;

    return res.json({
      status: "success",
      farmer: {
        name: farmer.fullName,
        state: farmer.state,
        district: farmer.district,
        taluka: farmer.taluka,
        village: farmer.village
      },
      farm: {
        id: farm._id,
        name: farm.name,
        location: farm.locationName,
        state: farm.state,
        district: farm.district,
        taluka: farm.taluka,
        village: farm.village,
        totalAreaHa: farm.totalAreaHa,
        totalAreaAcres: farm.totalAreaAcres,
        coordinates: [farm.latitude, farm.longitude],
        maturity: farm.digitalTwinMaturity,
        twinHealth: farm.twinHealthStatus,
        lastSync: farm.lastSyncAt,
        boundaryGeoJSON: farm.boundaryGeoJSON
      },
      farmerDashboardCards: {
        cropHealth: {
          status: "Healthy",
          rating: "Healthy vegetative vigor",
          subtitle: "Sugarcane is growing well across all plots."
        },
        expectedYield: {
          tonnesHa: avgYieldTonnes,
          quintalsAcre: avgYieldQAcre,
          sourceUnit: "quintals/acre",
          displayUnit: "tonnes/ha",
          confidence: latestPrediction ? latestPrediction.confidencePct : 94.5
        },
        water: {
          status: avgMoisture >= 30 ? "Adequate" : "Needs Review",
          soilMoisturePct: avgMoisture,
          irrigationSchedule: "2-3 times/week Drip/Furrow"
        },
        cropStage: {
          current: "Grand Growth",
          durationMonths: 14,
          description: "Stalk elongation and cane formation phase"
        },
        risk: {
          level: "Low",
          attentionItemsCount: priorityRecommendations.length
        }
      },
      whatNeedsAttention: priorityRecommendations.map(r => ({
        id: r._id,
        category: r.category,
        action: r.action,
        reason: r.reason,
        whatToCheck: r.whatToCheck,
        modelImpact: r.modelImpact,
        urgency: r.urgency,
        fieldName: r.fieldName
      })),
      fields,
      weatherCurrent: weather || {
        temperatureC: 29.5,
        rainfallMm: 1240,
        dailySunlightHours: 8.2,
        condition: "Optimal Cane Weather",
        source: "Demo Weather Data (Maharashtra Agro-Climatic Zone)"
      }
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch dashboard summary", error: err.message });
  }
}

export async function getDataQualityAudit(req: AuthRequest, res: Response) {
  try {
    return res.json({
      status: "success",
      datasetTransparency: {
        trainingDataset: "Kaggle Sugarcane Dataset (12 parameters, 3500 observations)",
        features: ["Rainfall", "Average Temperature", "Daily Sunlight", "Nitrogen", "Phosphorus", "Potassium", "Soil Type", "Crop Duration", "Irrigation Frequency", "Pest Control", "Sugarcane Seed Variety", "Final Sugarcane Yield"],
        sourceUnit: "quintals/acre",
        displayUnit: "tonnes/ha (1 quintal/acre = 0.247105 t/ha)",
        demoLabel: "Demo Farm — Maharashtra (Kolhapur Sugarcane Belt)",
        satelliteStatus: "Demo Preview / Future Integration"
      }
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch data quality audit", error: err.message });
  }
}

