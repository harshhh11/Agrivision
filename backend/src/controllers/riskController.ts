import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, Field, RiskAlert } from "../models";

export async function getRiskAlerts(req: AuthRequest, res: Response) {
  try {
    const { farmId } = req.params;
    let targetFarmId = farmId;
    if (!farmId || farmId === "default" || !farmId.match(/^[0-9a-fA-F]{24}$/)) {
      const defaultFarm = await Farm.findOne();
      if (defaultFarm) targetFarmId = defaultFarm._id.toString();
    }

    const risks = await RiskAlert.find({ farmId: targetFarmId, status: { $ne: "mitigated" } }).sort({ severity: -1 });

    return res.json({
      status: "success",
      farmId: targetFarmId,
      totalRisks: risks.length,
      highSeverityCount: risks.filter(r => r.severity === "severe" || r.severity === "critical").length,
      risks
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch risks", error: err.message });
  }
}
