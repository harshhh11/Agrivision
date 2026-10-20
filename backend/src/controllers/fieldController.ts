import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, Field, FarmEvent } from "../models";
import { requestYieldPrediction } from "../services/mlService";

export async function getFieldsByFarm(req: AuthRequest, res: Response) {
  try {
    const { farmId } = req.params;
    let targetFarmId = farmId;
    if (!farmId || farmId === "default" || !farmId.match(/^[0-9a-fA-F]{24}$/)) {
      const farm = await Farm.findOne();
      if (farm) targetFarmId = farm._id.toString();
    }

    const fields = await Field.find({ farmId: targetFarmId });
    return res.json({ status: "success", count: fields.length, fields });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch sugarcane plots", error: err.message });
  }
}

export async function getFieldById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const field = await Field.findById(id);
    if (!field) {
      return res.status(404).json({ message: "Sugarcane plot not found" });
    }
    return res.json({ status: "success", field });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch plot details", error: err.message });
  }
}

export async function createField(req: AuthRequest, res: Response) {
  try {
    const {
      farmId, name, code, areaHa, areaAcres, cropVariety,
      cropDurationMonths, cropStage, soilType, nitrogen,
      phosphorus, potassium, irrigationFrequency, pestControl,
      rainfallMm, temperatureC, boundaryPolygon
    } = req.body;

    let targetFarm = null;
    if (farmId && farmId.match(/^[0-9a-fA-F]{24}$/)) {
      targetFarm = await Farm.findById(farmId);
    }
    if (!targetFarm) targetFarm = await Farm.findOne();

    const areaHectares = Number(areaHa || (areaAcres ? areaAcres * 0.404686 : 3.5));
    const areaAcreVal = Number(areaAcres || (areaHa ? areaHa * 2.47105 : 8.6));

    const mlRes = await requestYieldPrediction({
      seed_variety: cropVariety || "Co 86032",
      soil_type: soilType || "Black Soil",
      irrigation_frequency: irrigationFrequency || "2 times/week",
      pest_control: pestControl || "Integrated",
      nitrogen: Number(nitrogen || 220),
      phosphorus: Number(phosphorus || 75),
      potassium: Number(potassium || 140),
      rainfall: Number(rainfallMm || 1200),
      temperature: Number(temperatureC || 29.0),
      crop_duration: Number(cropDurationMonths || 12)
    });

    const predQ = mlRes?.prediction?.expected_yield_q_acre || 510.0;
    const predT = mlRes?.prediction?.expected_yield_tonnes_ha || (predQ * 0.247105);

    const newField = await Field.create({
      farmId: targetFarm?._id,
      name,
      code: code || `FLD-0${Math.floor(Math.random() * 90 + 10)}`,
      areaHa: areaHectares,
      areaAcres: areaAcreVal,
      currentCrop: "Sugarcane",
      cropVariety: cropVariety || "Co 86032",
      cropDurationMonths: Number(cropDurationMonths || 12),
      cropStage: cropStage || "Tillering",
      soilType: soilType || "Black Soil",
      nitrogen: Number(nitrogen || 220),
      phosphorus: Number(phosphorus || 75),
      potassium: Number(potassium || 140),
      irrigationFrequency: irrigationFrequency || "2 times/week",
      pestControl: pestControl || "Integrated",
      rainfallMm: Number(rainfallMm || 1200),
      temperatureC: Number(temperatureC || 29.0),
      predictedYieldQAcre: predQ,
      predictedYieldTonnesHa: predT,
      predictedYield: predT,
      riskLevel: "Low",
      boundaryPolygon: boundaryPolygon || [
        [16.717, 74.24],
        [16.721, 74.24],
        [16.721, 74.247],
        [16.717, 74.247]
      ]
    });

    return res.status(201).json({ status: "success", field: newField });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to create sugarcane field", error: err.message });
  }
}

export async function updateField(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const field = await Field.findById(id);
    if (!field) {
      return res.status(404).json({ message: "Sugarcane field not found" });
    }

    Object.assign(field, updates);
    field.lastUpdated = new Date();

    // Recalculate yield via ML service
    const mlRes = await requestYieldPrediction({
      seed_variety: field.cropVariety,
      soil_type: field.soilType,
      irrigation_frequency: field.irrigationFrequency,
      pest_control: field.pestControl,
      nitrogen: field.nitrogen,
      phosphorus: field.phosphorus,
      potassium: field.potassium,
      rainfall: field.rainfallMm,
      temperature: field.temperatureC,
      sunlight: field.dailySunlightHours,
      crop_duration: field.cropDurationMonths
    });

    if (mlRes && mlRes.prediction) {
      const predQ = mlRes.prediction.expected_yield_q_acre || 510.0;
      const predT = mlRes.prediction.expected_yield_tonnes_ha || (predQ * 0.247105);
      field.predictedYieldQAcre = predQ;
      field.predictedYieldTonnesHa = predT;
      field.predictedYield = predT;
    }

    await field.save();

    // Log update event for digital twin history
    await FarmEvent.create({
      farmId: field.farmId,
      fieldId: field._id,
      fieldName: field.name,
      eventType: "Management Action",
      title: "Sugarcane Plot Parameters Updated",
      description: `Updated parameters for ${field.name}. Digital Twin recalculated yield potential to ${field.predictedYieldTonnesHa || field.predictedYield} tonnes/ha.`,
      timestamp: new Date()
    });

    return res.json({ status: "success", field });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to update field", error: err.message });
  }
}
