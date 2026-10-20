import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { User, Farmer, Farm, Field } from "../models";

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    let farmer = await Farmer.findOne({ userId: user._id });
    let farm = await Farm.findOne({ farmerId: user._id });
    let fields = farm ? await Field.find({ farmId: farm._id }) : [];
    const primaryField = fields.length > 0 ? fields[0] : null;

    return res.json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || (farmer ? farmer.mobileNumber : ""),
        role: user.role
      },
      profile: {
        userId: user._id,
        fullName: user.name,
        mobileNumber: user.phone || (farmer ? farmer.mobileNumber : ""),
        email: user.email,
        village: farmer?.village || farm?.village || "Kasba Bawada",
        district: farmer?.district || farm?.district || "Kolhapur",
        taluka: farmer?.taluka || farm?.taluka || "Karveer",
        state: farmer?.state || farm?.state || "Maharashtra",
        farmName: farm?.name || "Patil Sugarcane Estate",
        farmArea: farm?.totalAreaAcres || 10.4,
        farmAreaHa: farm?.totalAreaHa || 4.2,
        areaUnit: "Acre",
        location: farm?.locationName || `${farm?.village || "Kasba Bawada"}, ${farm?.district || "Kolhapur"}, ${farm?.state || "Maharashtra"}`,
        numberOfFields: fields.length || 1,
        sugarcaneVariety: primaryField?.cropVariety || "Co 86032",
        cropStage: primaryField?.cropStage || "Grand Growth",
        plantingDate: primaryField?.plantingDate || new Date("2025-07-15"),
        cropDuration: primaryField?.cropDurationMonths || 16,
        irrigationMethod: primaryField?.irrigationMethod || "Drip",
        irrigationFrequency: primaryField?.irrigationFrequency || "3 times/week",
        soilType: primaryField?.soilType || "Black Soil (Vertisol)",
        nitrogen: primaryField?.nitrogen || 240,
        phosphorus: primaryField?.phosphorus || 80,
        potassium: primaryField?.potassium || 160,
        soilMoisture: primaryField?.currentSoilMoisture || 34.2,
        pestControl: primaryField?.pestControl || "Integrated",
        sunlight: primaryField?.dailySunlightHours || 8.2,
        rainfall: primaryField?.rainfallMm || 1240
      }
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const {
      fullName, name, mobileNumber, phone, village, district, taluka, state,
      farmName, farmArea, areaUnit, location,
      sugarcaneVariety, cropStage, plantingDate, cropDuration,
      irrigationMethod, irrigationFrequency,
      soilType, nitrogen, phosphorus, potassium, soilMoisture,
      pestControl, sunlight, rainfall
    } = req.body;

    const updatedName = fullName || name || user.name;
    const updatedPhone = mobileNumber || phone || user.phone;

    // 1. Update User
    await User.findByIdAndUpdate(user._id, {
      name: updatedName,
      phone: updatedPhone
    });

    // 2. Update or create Farmer record
    let farmer = await Farmer.findOne({ userId: user._id });
    if (!farmer) {
      farmer = await Farmer.create({
        userId: user._id,
        fullName: updatedName,
        mobileNumber: updatedPhone,
        state: state || "Maharashtra",
        district: district || "Kolhapur",
        taluka: taluka || "Karveer",
        village: village || "Kasba Bawada",
      });
    } else {
      farmer.fullName = updatedName;
      farmer.mobileNumber = updatedPhone;
      if (state) farmer.state = state;
      if (district) farmer.district = district;
      if (taluka) farmer.taluka = taluka;
      if (village) farmer.village = village;
      await farmer.save();
    }

    // 3. Update or create Farm record
    let farm = await Farm.findOne({ farmerId: user._id });
    const areaAcres = Number(farmArea) || (farm ? farm.totalAreaAcres : 10.4);
    const areaHa = areaUnit === "Hectare" ? areaAcres : parseFloat((areaAcres * 0.404686).toFixed(2));

    if (!farm) {
      farm = await Farm.create({
        farmerId: user._id,
        name: farmName || "My Farm",
        locationName: location || `${village || "Kasba Bawada"}, ${district || "Kolhapur"}, ${state || "Maharashtra"}`,
        state: state || "Maharashtra",
        district: district || "Kolhapur",
        taluka: taluka || "Karveer",
        village: village || "Kasba Bawada",
        latitude: 16.7820,
        longitude: 74.5240,
        totalAreaHa: areaHa,
        totalAreaAcres: areaAcres,
        soilSummary: `${soilType || "Black Soil"} (Vertisol)`,
        primaryCrop: "Sugarcane",
        isDemoFarm: false,
        digitalTwinMaturity: "Predictive",
        twinHealthStatus: "Optimal"
      });
    } else {
      if (farmName) farm.name = farmName;
      if (location) farm.locationName = location;
      if (state) farm.state = state;
      if (district) farm.district = district;
      if (taluka) farm.taluka = taluka;
      if (village) farm.village = village;
      farm.totalAreaAcres = areaAcres;
      farm.totalAreaHa = areaHa;
      if (soilType) farm.soilSummary = `${soilType} (Vertisol)`;
      await farm.save();
    }

    // 4. Update Field parameters
    let fields = await Field.find({ farmId: farm._id });
    if (fields.length > 0) {
      const field = fields[0];
      if (sugarcaneVariety) field.cropVariety = sugarcaneVariety;
      if (cropStage) field.cropStage = cropStage as any;
      if (plantingDate) field.plantingDate = new Date(plantingDate);
      if (cropDuration) field.cropDurationMonths = Number(cropDuration);
      if (irrigationMethod) field.irrigationMethod = irrigationMethod;
      if (irrigationFrequency) field.irrigationFrequency = irrigationFrequency;
      if (soilType) field.soilType = soilType;
      if (nitrogen !== undefined) field.nitrogen = Number(nitrogen);
      if (phosphorus !== undefined) field.phosphorus = Number(phosphorus);
      if (potassium !== undefined) field.potassium = Number(potassium);
      if (pestControl) field.pestControl = pestControl;
      if (rainfall !== undefined) field.rainfallMm = Number(rainfall);
      if (sunlight !== undefined) field.dailySunlightHours = Number(sunlight);
      field.areaAcres = areaAcres;
      field.areaHa = areaHa;
      await field.save();
    } else {
      await Field.create({
        farmId: farm._id,
        name: "Plot 1 — Main Sugarcane Field",
        code: "FLD-01",
        areaHa,
        areaAcres,
        currentCrop: "Sugarcane",
        cropVariety: sugarcaneVariety || "Co 86032",
        cropDurationMonths: Number(cropDuration) || 16,
        cropStage: cropStage || "Grand Growth",
        plantingDate: plantingDate ? new Date(plantingDate) : new Date("2025-07-15"),
        soilType: soilType || "Black Soil",
        nitrogen: Number(nitrogen) || 240,
        phosphorus: Number(phosphorus) || 80,
        potassium: Number(potassium) || 160,
        irrigationMethod: irrigationMethod || "Drip",
        irrigationFrequency: irrigationFrequency || "3 times/week",
        pestControl: pestControl || "Integrated",
        rainfallMm: Number(rainfall) || 1240,
        dailySunlightHours: Number(sunlight) || 8.2,
        boundaryPolygon: [
          [16.7842, 74.5202],
          [16.7882, 74.5218],
          [16.7868, 74.5270],
          [16.7828, 74.5254]
        ]
      });
    }

    return res.json({
      status: "success",
      message: "Farmer profile and digital twin parameters updated successfully",
      profile: {
        userId: user._id,
        fullName: updatedName,
        mobileNumber: updatedPhone,
        village: farm.village,
        district: farm.district,
        state: farm.state,
        farmName: farm.name,
        farmArea: farm.totalAreaAcres,
        sugarcaneVariety: sugarcaneVariety || "Co 86032",
        cropStage: cropStage || "Grand Growth",
        soilType: soilType || "Black Soil"
      }
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
}
