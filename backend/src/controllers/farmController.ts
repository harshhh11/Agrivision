import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Farm, Field, FarmEvent } from "../models";

export async function getFarms(req: AuthRequest, res: Response) {
  try {
    const userId = req.user ? req.user._id : null;
    let farms = [];
    if (userId) {
      farms = await Farm.find({ farmerId: userId });
    }
    if (farms.length === 0) {
      // Fallback to any seeded farm
      farms = await Farm.find().limit(5);
    }
    return res.json({ status: "success", count: farms.length, farms });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch farms", error: err.message });
  }
}

export async function getFarmById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    let farm = null;
    if (id && id !== "primary" && id.match(/^[0-9a-fA-F]{24}$/)) {
      farm = await Farm.findById(id);
    }
    if (!farm) {
      farm = await Farm.findOne();
    }
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    const fields = await Field.find({ farmId: farm._id });
    return res.json({ status: "success", farm, fields });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch farm details", error: err.message });
  }
}

export async function createFarm(req: AuthRequest, res: Response) {
  try {
    const userId = req.user._id;
    const {
      name, locationName, latitude, longitude, totalAreaHa,
      soilSummary, climateZone, primaryCrop, irrigationMethod,
      cropVariety, plantingDate
    } = req.body;

    const lat = Number(latitude) || 41.5868;
    const lng = Number(longitude) || -93.6250;
    const area = Number(totalAreaHa) || 120.0;

    const farm = await Farm.create({
      farmerId: userId,
      name: name || "My New Digital Twin Farm",
      locationName: locationName || "Cedar River Basin",
      latitude: lat,
      longitude: lng,
      totalAreaHa: area,
      elevationM: 250,
      soilSummary: soilSummary || "Silt Loam",
      climateZone: climateZone || "Zone 5b",
      digitalTwinMaturity: "Predictive",
      twinHealthStatus: "Optimal",
      lastSyncAt: new Date(),
      boundaryGeoJSON: {
        type: "Polygon",
        coordinates: [[
          [lng - 0.015, lat - 0.010],
          [lng + 0.015, lat - 0.010],
          [lng + 0.015, lat + 0.010],
          [lng - 0.015, lat + 0.010],
          [lng - 0.015, lat - 0.010]
        ]]
      }
    });

    // Automatically initialize first field from onboarding data
    const initialField = await Field.create({
      farmId: farm._id,
      name: `${primaryCrop || "Corn"} Main Parcel`,
      code: "FLD-A1",
      areaHa: area,
      currentCrop: primaryCrop || "Corn",
      cropVariety: cropVariety || "Standard Select",
      cropStage: "Vegetative",
      plantingDate: plantingDate ? new Date(plantingDate) : new Date(),
      soilType: soilSummary || "Silt Loam",
      irrigationMethod: irrigationMethod || "Center Pivot",
      currentNDVI: 0.78,
      currentSoilMoisture: 30.0,
      currentTempC: 23.0,
      predictedYield: 9.8,
      riskLevel: "Low",
      boundaryPolygon: [
        [lat - 0.008, lng - 0.012],
        [lat + 0.008, lng - 0.012],
        [lat + 0.008, lng + 0.012],
        [lat - 0.008, lng + 0.012]
      ],
      lastUpdated: new Date()
    });

    // Record Onboarding FarmEvent
    await FarmEvent.create({
      farmId: farm._id,
      fieldId: initialField._id,
      fieldName: initialField.name,
      eventType: "Management Action",
      title: "Digital Twin Initialized",
      description: `Farm profile created with ${area} hectares, registered primary crop ${primaryCrop || "Corn"}.`,
      timestamp: new Date()
    });

    return res.status(201).json({ status: "success", farm, field: initialField });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to create farm profile", error: err.message });
  }
}

export async function updateFarm(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const farm = await Farm.findByIdAndUpdate(id, {
      ...req.body,
      lastSyncAt: new Date()
    }, { new: true });

    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    return res.json({ status: "success", farm });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to update farm", error: err.message });
  }
}
