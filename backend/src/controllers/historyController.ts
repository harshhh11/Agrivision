import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, FarmEvent, YieldRecord } from "../models";

export async function getFarmHistory(req: AuthRequest, res: Response) {
  try {
    const { farmId } = req.params;
    let targetFarmId = farmId;
    if (!farmId || farmId === "default" || !farmId.match(/^[0-9a-fA-F]{24}$/)) {
      const defaultFarm = await Farm.findOne();
      if (defaultFarm) targetFarmId = defaultFarm._id.toString();
    }

    const events = await FarmEvent.find({ farmId: targetFarmId }).sort({ timestamp: -1 });
    const yieldRecords = await YieldRecord.find().sort({ seasonYear: -1 });

    // Multi-season historical comparison
    const seasonComparison = [
      {
        season: "2023",
        crop: "Corn & Soy",
        avgYield: 9.8,
        totalRainfallMm: 490,
        irrigationCycles: 6,
        healthIndex: 88,
        status: "Normal Season"
      },
      {
        season: "2024",
        crop: "Corn, Soy & Wheat",
        avgYield: 10.3,
        totalRainfallMm: 535,
        irrigationCycles: 4,
        healthIndex: 94,
        status: "High Productivity"
      },
      {
        season: "2025",
        crop: "Corn, Soy & Wheat",
        avgYield: 10.9,
        totalRainfallMm: 560,
        irrigationCycles: 5,
        healthIndex: 96,
        status: "Record Harvest"
      },
      {
        season: "2026 (Active Twin)",
        crop: "Precision Rotation (4 Fields)",
        avgYield: 11.2,
        totalRainfallMm: 520,
        irrigationCycles: 3,
        healthIndex: 95,
        status: "In Progress / Predictive"
      }
    ];

    return res.json({
      status: "success",
      farmId: targetFarmId,
      totalEvents: events.length,
      events,
      yieldRecords,
      seasonComparison
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch farm history", error: err.message });
  }
}
