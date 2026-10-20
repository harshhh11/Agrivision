import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, Field, Recommendation, FarmEvent, IrrigationRecord } from "../models";

export async function getRecommendations(req: AuthRequest, res: Response) {
  try {
    const { farmId } = req.params;
    let targetFarmId = farmId;
    if (!farmId || farmId === "default" || !farmId.match(/^[0-9a-fA-F]{24}$/)) {
      const defaultFarm = await Farm.findOne();
      if (defaultFarm) targetFarmId = defaultFarm._id.toString();
    }

    const recommendations = await Recommendation.find({ farmId: targetFarmId }).sort({ createdAt: -1 });
    const pending = recommendations.filter(r => r.status === "pending");
    const completed = recommendations.filter(r => r.status === "done");
    const others = recommendations.filter(r => r.status === "snoozed" || r.status === "dismissed");

    return res.json({
      status: "success",
      farmId: targetFarmId,
      total: recommendations.length,
      pendingCount: pending.length,
      recommendations,
      pending,
      completed,
      others
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch recommendations", error: err.message });
  }
}

export async function updateRecommendationStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, actionNote } = req.body;

    if (!["pending", "done", "snoozed", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const recommendation = await Recommendation.findById(id);
    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    recommendation.status = status;
    recommendation.actedAt = new Date();
    if (actionNote) recommendation.actionNote = actionNote;
    await recommendation.save();

    // CLOSED CONTROL LOOP: Write to FarmEvent stream & update field parameters
    const actionVerb = status === "done" ? "Confirmed & Completed" : status === "snoozed" ? "Snoozed for 24 Hours" : "Dismissed by Farmer";
    
    await FarmEvent.create({
      farmId: recommendation.farmId,
      fieldId: recommendation.fieldId,
      fieldName: recommendation.fieldName,
      eventType: "Recommendation Acted",
      title: `${recommendation.action} — ${actionVerb}`,
      description: actionNote || `Farmer updated recommendation state to "${status}". Reason: ${recommendation.reason}`,
      metadata: {
        recommendationId: recommendation._id,
        category: recommendation.category,
        confidence: recommendation.confidencePct,
        status
      },
      timestamp: new Date()
    });

    // If marked done on an irrigation recommendation, record an IrrigationRecord and refresh field moisture
    if (status === "done" && recommendation.category === "irrigation") {
      await IrrigationRecord.create({
        fieldId: recommendation.fieldId,
        appliedDate: new Date(),
        volumeMm: 20,
        durationHours: 3.0,
        method: "Controlled Application",
        triggeredBy: "Farmer Action",
        notes: `Executed based on recommendation: ${recommendation.action}`
      });

      // Update Field moisture state
      const field = await Field.findById(recommendation.fieldId);
      if (field) {
        field.currentSoilMoisture = Math.min(36.0, Number((field.currentSoilMoisture + 4.5).toFixed(1)));
        field.riskLevel = "Low";
        field.lastUpdated = new Date();
        await field.save();
      }
    }

    return res.json({
      status: "success",
      message: `Recommendation marked as ${status}`,
      recommendation
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to update recommendation", error: err.message });
  }
}
