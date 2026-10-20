import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, Field, Simulation, FarmEvent } from "../models";
import { requestSimulation } from "../services/mlService";

export async function runFarmSimulation(req: AuthRequest, res: Response) {
  try {
    const { farmId, baseline_state, scenario_params } = req.body;

    let targetFarm = null;
    if (farmId && farmId.match(/^[0-9a-fA-F]{24}$/)) {
      targetFarm = await Farm.findById(farmId);
    }
    if (!targetFarm) targetFarm = await Farm.findOne();

    const baseline = baseline_state || {
      rainfall: 1240,
      temperature: 29.2,
      sunlight: 8.2,
      nitrogen: 240,
      phosphorus: 80,
      potassium: 160,
      soil_type: "Black Soil",
      crop_duration: 12,
      irrigation_frequency: "2 times/week",
      pest_control: "Integrated",
      seed_variety: "Co 86032"
    };

    const scenario = scenario_params || {
      irrigation_frequency: "3 times/week",
      nitrogen: 260
    };

    const simResults = await requestSimulation(baseline, scenario);

    const simulationDoc = await Simulation.create({
      farmId: targetFarm ? targetFarm._id : undefined,
      title: `What-If Sugarcane Simulation (${Object.keys(scenario).join(", ")})`,
      baselineState: baseline,
      scenarioInputs: scenario,
      results: simResults
    });

    return res.status(200).json({
      status: "success",
      simulationId: simulationDoc._id,
      results: simResults
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to execute farm simulation", error: err.message });
  }
}

export async function getSimulationById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const sim = await Simulation.findById(id);
    if (!sim) {
      return res.status(404).json({ message: "Simulation not found" });
    }
    return res.json({ status: "success", simulation: sim });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch simulation", error: err.message });
  }
}
