import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, Field, Prediction, FarmEvent } from "../models";
import { requestYieldPrediction, requestModelInfo } from "../services/mlService";

export async function createYieldPrediction(req: AuthRequest, res: Response) {
  try {
    const {
      farmId, fieldId, rainfall, temperature, sunlight,
      nitrogen, phosphorus, potassium, soil_type,
      crop_duration, irrigation_frequency, pest_control, seed_variety
    } = req.body;

    let targetFarm = null;
    if (farmId && farmId.match(/^[0-9a-fA-F]{24}$/)) {
      targetFarm = await Farm.findById(farmId);
    }
    if (!targetFarm) targetFarm = await Farm.findOne();

    let targetField = null;
    if (fieldId && fieldId.match(/^[0-9a-fA-F]{24}$/)) {
      targetField = await Field.findById(fieldId);
    } else {
      targetField = await Field.findOne({ farmId: targetFarm?._id });
    }

    const featureInputs = {
      rainfall: rainfall !== undefined ? Number(rainfall) : (targetField?.rainfallMm || 1240.0),
      temperature: temperature !== undefined ? Number(temperature) : (targetField?.temperatureC || 29.2),
      sunlight: sunlight !== undefined ? Number(sunlight) : (targetField?.dailySunlightHours || 8.2),
      nitrogen: nitrogen !== undefined ? Number(nitrogen) : (targetField?.nitrogen || 240.0),
      phosphorus: phosphorus !== undefined ? Number(phosphorus) : (targetField?.phosphorus || 80.0),
      potassium: potassium !== undefined ? Number(potassium) : (targetField?.potassium || 160.0),
      soil_type: soil_type || targetField?.soilType || "Black Soil",
      crop_duration: crop_duration !== undefined ? Number(crop_duration) : (targetField?.cropDurationMonths || 12),
      irrigation_frequency: irrigation_frequency || targetField?.irrigationFrequency || "2 times/week",
      pest_control: pest_control || targetField?.pestControl || "Integrated",
      seed_variety: seed_variety || targetField?.cropVariety || "Co 86032",
      farm_id: targetFarm?._id?.toString(),
      field_id: targetField?._id?.toString()
    };

    const mlResponse = await requestYieldPrediction(featureInputs);
    const predData = mlResponse.prediction;

    const yieldQAcre = predData.expected_yield_q_acre || 540.0;
    const yieldTonnesHa = predData.expected_yield_tonnes_ha || (yieldQAcre * 0.247105);

    // Save Prediction record in MongoDB
    const predictionDoc = await Prediction.create({
      farmId: targetFarm?._id,
      fieldId: targetField ? targetField._id : targetFarm?._id,
      crop: "Sugarcane",
      seedVariety: featureInputs.seed_variety,
      predictedYieldQAcre: yieldQAcre,
      predictedYieldTonnesHa: yieldTonnesHa,
      predictedYield: yieldTonnesHa,
      confidencePct: predData.confidence_percent || 94.5,
      modelVersion: predData.model_info?.name || "XGBoost-Sugarcane-v1.4",
      inputFeatures: featureInputs,
      featureImportance: mlResponse.feature_importance || [],
      narrativeWhy: mlResponse.explainable_narrative ? [mlResponse.explainable_narrative] : []
    });

    // Update field if present
    if (targetField) {
      targetField.predictedYieldQAcre = yieldQAcre;
      targetField.predictedYieldTonnesHa = yieldTonnesHa;
      targetField.predictedYield = yieldTonnesHa;
      targetField.cropVariety = featureInputs.seed_variety;
      targetField.soilType = featureInputs.soil_type;
      targetField.irrigationFrequency = featureInputs.irrigation_frequency;
      targetField.pestControl = featureInputs.pest_control;
      targetField.nitrogen = featureInputs.nitrogen;
      targetField.phosphorus = featureInputs.phosphorus;
      targetField.potassium = featureInputs.potassium;
      targetField.rainfallMm = featureInputs.rainfall;
      targetField.temperatureC = featureInputs.temperature;
      targetField.dailySunlightHours = featureInputs.sunlight;
      await targetField.save();
    }

    // Record Farm Event
    await FarmEvent.create({
      farmId: targetFarm?._id,
      fieldId: targetField?._id,
      fieldName: targetField?.name || "Sugarcane Plots",
      eventType: "Yield Prediction",
      title: "Sugarcane Yield Recalculated",
      description: `Model forecasted ${yieldTonnesHa.toFixed(1)} tonnes/ha (${yieldQAcre.toFixed(1)} Q/acre) for variety ${featureInputs.seed_variety}.`,
      timestamp: new Date()
    });

    return res.status(201).json({
      status: "success",
      prediction: predictionDoc,
      predData: predData,
      feature_importance: mlResponse.feature_importance,
      narrative_why: mlResponse.explainable_narrative
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to generate sugarcane yield prediction", error: err.message });
  }
}

export async function getPredictionsByFarm(req: AuthRequest, res: Response) {
  try {
    const { farmId } = req.params;
    let targetFarmId = farmId;
    if (!farmId || farmId === "default" || !farmId.match(/^[0-9a-fA-F]{24}$/)) {
      const farm = await Farm.findOne();
      if (farm) targetFarmId = farm._id.toString();
    }

    const latestPrediction = await Prediction.findOne({ farmId: targetFarmId }).sort({ createdAt: -1 });
    const historicalPredictions = await Prediction.find({ farmId: targetFarmId }).sort({ createdAt: -1 }).limit(10);
    const fields = await Field.find({ farmId: targetFarmId });
    const modelInfo = await requestModelInfo();

    return res.json({
      latest: latestPrediction,
      history: historicalPredictions,
      fields: fields,
      model_info: modelInfo.metadata || modelInfo
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch predictions", error: err.message });
  }
}

export async function getModelMetadata(req: AuthRequest, res: Response) {
  try {
    const info = await requestModelInfo();
    return res.json(info);
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch model metadata", error: err.message });
  }
}
