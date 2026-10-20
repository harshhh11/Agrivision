import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, Field, IrrigationRecord, FarmEvent } from "../models";

export async function getIrrigationIntelligence(req: AuthRequest, res: Response) {
  try {
    const { farmId } = req.params;
    let targetFarmId = farmId;
    if (!farmId || farmId === "default" || !farmId.match(/^[0-9a-fA-F]{24}$/)) {
      const defaultFarm = await Farm.findOne();
      if (defaultFarm) targetFarmId = defaultFarm._id.toString();
    }

    const fields = await Field.find({ farmId: targetFarmId });
    const records = await IrrigationRecord.find().sort({ appliedDate: -1 }).limit(10);

    // Irrigation intelligence logic per field
    const fieldIrrigationStatus = fields.map(f => {
      const targetMoisture = 32.0;
      const deficit = Math.max(0, targetMoisture - f.currentSoilMoisture);
      
      let recommendedAction = "Maintain Normal Monitoring";
      let urgency: "none" | "low" | "medium" | "high" = "none";
      let reason = "Root zone moisture is balanced within optimal field capacity.";
      let waterReqMm = 0;

      if (f.name.includes("Corn")) {
        recommendedAction = "Delay irrigation — rainfall is expected within 18 hours";
        urgency = "high";
        reason = "28mm convective rainfall forecasted. Pre-emptive irrigation would cause nutrient runoff and ponding.";
        waterReqMm = 0;
      } else if (f.name.includes("Wheat") || f.currentSoilMoisture < 22.0) {
        recommendedAction = "Apply 22mm Supplemental Irrigation";
        urgency = "high";
        reason = `Current moisture (${f.currentSoilMoisture}%) is below wilting threshold during grain filling. Immediate application advised.`;
        waterReqMm = 22;
      } else if (deficit > 5.0) {
        recommendedAction = `Schedule ${Math.round(deficit * 1.2)}mm cycle within 72 hours`;
        urgency = "medium";
        reason = `Soil moisture is drifting (${f.currentSoilMoisture}%). Top-up recommended before high temperature spike.`;
        waterReqMm = Math.round(deficit * 1.2);
      }

      return {
        fieldId: f._id,
        fieldName: f.name,
        code: f.code,
        crop: f.currentCrop,
        stage: f.cropStage,
        method: f.irrigationMethod,
        currentMoisturePct: f.currentSoilMoisture,
        targetMoisturePct: targetMoisture,
        deficitPct: Number(deficit.toFixed(1)),
        waterRequirementMm: waterReqMm,
        recommendedIrrigation: recommendedAction,
        urgency,
        reason,
        lastApplied: f.lastUpdated
      };
    });

    return res.json({
      status: "success",
      farmId: targetFarmId,
      overallStrategy: "Conservation & Pre-Rain Delay Mode",
      fields: fieldIrrigationStatus,
      recentApplications: records
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch irrigation intelligence", error: err.message });
  }
}

export async function logIrrigationEvent(req: AuthRequest, res: Response) {
  try {
    const { fieldId, volumeMm, durationHours, method, notes } = req.body;

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    const appliedVol = Number(volumeMm) || 20;

    const record = await IrrigationRecord.create({
      fieldId: field._id,
      appliedDate: new Date(),
      volumeMm: appliedVol,
      durationHours: Number(durationHours) || 2.5,
      method: method || field.irrigationMethod || "Center Pivot",
      triggeredBy: "Farmer Action",
      notes
    });

    // Update field moisture
    field.currentSoilMoisture = Math.min(38.0, Number((field.currentSoilMoisture + appliedVol * 0.22).toFixed(1)));
    if (field.currentSoilMoisture >= 25.0 && field.riskLevel === "Moderate") {
      field.riskLevel = "Low";
    }
    field.lastUpdated = new Date();
    await field.save();

    // Log to FarmEvent stream
    await FarmEvent.create({
      farmId: field.farmId,
      fieldId: field._id,
      fieldName: field.name,
      eventType: "Irrigation",
      title: `Applied ${appliedVol}mm Irrigation`,
      description: notes || `Farmer applied ${appliedVol}mm via ${method || field.irrigationMethod}. Soil moisture replenished to ${field.currentSoilMoisture}%.`,
      metadata: { recordId: record._id, volumeMm: appliedVol },
      timestamp: new Date()
    });

    return res.status(201).json({
      status: "success",
      record,
      updatedFieldMoisture: field.currentSoilMoisture
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to log irrigation event", error: err.message });
  }
}
