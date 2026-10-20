import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  User, Farmer, Farm, Field, SoilData, WeatherData,
  IrrigationRecord, Prediction, Recommendation,
  FarmEvent, ModelVersion
} from "../models";
import { connectDB } from "../config/db";

export async function seedDatabase(forceClean: boolean = false) {
  await connectDB();

  const existingFarm = await Farm.findOne({ name: "Demo Farm — Maharashtra" });
  if (existingFarm && !forceClean) {
    console.log("[AgriTwin Seed] Database already contains Maharashtra sugarcane farm data. Skipping seed.");
    return existingFarm;
  }

  // If old non-sugarcane data exists, clean it
  console.log("[AgriTwin Seed] Seeding Maharashtra Sugarcane Digital Twin data...");
  await Promise.all([
    User.deleteMany({}), Farmer.deleteMany({}), Farm.deleteMany({}),
    Field.deleteMany({}), SoilData.deleteMany({}), WeatherData.deleteMany({}),
    IrrigationRecord.deleteMany({}), Prediction.deleteMany({}),
    Recommendation.deleteMany({}), FarmEvent.deleteMany({}),
    ModelVersion.deleteMany({})
  ]);

  console.log("[AgriTwin Seed] Creating Indian demo sugarcane farmer user...");
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("AgriTwin2026!", salt);

  const demoUser = await User.create({
    name: "Ramesh Patil",
    email: "farmer@agritwin.com",
    passwordHash,
    role: "farmer",
    phone: "+91 98220 12345",
    preferredLanguage: "en",
    preferredUnit: "tonnes_ha"
  });

  console.log("[AgriTwin Seed] Creating Farm: Demo Farm — Maharashtra (Kolhapur Sugar Belt)...");
  // Kolhapur coordinates (Panchganga river basin, Maharashtra)
  const farm = await Farm.create({
    farmerId: demoUser._id,
    name: "Demo Farm — Maharashtra",
    locationName: "Shirol, Kolhapur District, Maharashtra",
    state: "Maharashtra",
    district: "Kolhapur",
    taluka: "Shirol",
    village: "Shirol",
    latitude: 16.7820,
    longitude: 74.5240,
    totalAreaHa: 12.5,
    totalAreaAcres: 30.8,
    elevationM: 550.0,
    soilSummary: "Deep Black Cotton Soil (Regur / Vertisol, High Clay & Organic Mineral)",
    climateZone: "Tropical Wet & Dry (Maharashtra Agro-Climatic Zone VII)",
    primaryCrop: "Sugarcane",
    isDemoFarm: true,
    digitalTwinMaturity: "Predictive",
    twinHealthStatus: "Optimal",
    lastSyncAt: new Date(),
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [[
        [74.5180, 16.7740],
        [74.5380, 16.7750],
        [74.5360, 16.7900],
        [74.5160, 16.7890],
        [74.5180, 16.7740]
      ]]
    }
  });

  await Farmer.create({
    userId: demoUser._id,
    fullName: "Ramesh Patil",
    mobileNumber: "+91 98220 12345",
    state: "Maharashtra",
    district: "Kolhapur",
    taluka: "Shirol",
    village: "Shirol",
    experienceYears: 18,
    primaryFarmId: farm._id
  });

  console.log("[AgriTwin Seed] Creating 4 Maharashtra Sugarcane Field Plots...");
  const fieldsData = [
    {
      name: "Plot 1 — Adsali Sugarcane (Co 86032)",
      code: "FLD-01",
      areaHa: 4.2,
      areaAcres: 10.4,
      currentCrop: "Sugarcane",
      cropVariety: "Co 86032 (Nayana)",
      cropDurationMonths: 16,
      cropStage: "Grand Growth",
      plantingDate: new Date("2025-07-15"),
      soilType: "Black Soil",
      nitrogen: 240,
      phosphorus: 80,
      potassium: 160,
      irrigationMethod: "Drip",
      irrigationFrequency: "3 times/week",
      pestControl: "Integrated",
      rainfallMm: 1280,
      temperatureC: 29.5,
      dailySunlightHours: 8.4,
      currentNDVI: 0.84,
      currentNDWI: 0.54,
      currentEVI: 0.68,
      currentSoilMoisture: 35.2,
      currentTempC: 28.2,
      predictedYieldQAcre: 565.0,
      predictedYieldTonnesHa: 139.6,
      predictedYield: 139.6,
      riskLevel: "Low",
      boundaryPolygon: [
        [16.7842, 74.5202],
        [16.7882, 74.5218],
        [16.7868, 74.5270],
        [16.7828, 74.5254]
      ]
    },
    {
      name: "Plot 2 — Suru Sugarcane (CoM 0265)",
      code: "FLD-02",
      areaHa: 3.5,
      areaAcres: 8.6,
      currentCrop: "Sugarcane",
      cropVariety: "CoM 0265 (Phule 265)",
      cropDurationMonths: 12,
      cropStage: "Tillering",
      plantingDate: new Date("2026-01-20"),
      soilType: "Clay Loam",
      nitrogen: 220,
      phosphorus: 75,
      potassium: 140,
      irrigationMethod: "Furrow",
      irrigationFrequency: "2 times/week",
      pestControl: "Biological",
      rainfallMm: 1220,
      temperatureC: 29.0,
      dailySunlightHours: 8.1,
      currentNDVI: 0.79,
      currentNDWI: 0.49,
      currentEVI: 0.62,
      currentSoilMoisture: 31.8,
      currentTempC: 29.1,
      predictedYieldQAcre: 510.0,
      predictedYieldTonnesHa: 126.0,
      predictedYield: 126.0,
      riskLevel: "Low",
      boundaryPolygon: [
        [16.7846, 74.5280],
        [16.7886, 74.5296],
        [16.7872, 74.5348],
        [16.7832, 74.5332]
      ]
    },
    {
      name: "Plot 3 — Pre-seasonal Sugarcane (Co 0238)",
      code: "FLD-03",
      areaHa: 2.8,
      areaAcres: 6.9,
      currentCrop: "Sugarcane",
      cropVariety: "Co 0238 (Karan 4)",
      cropDurationMonths: 14,
      cropStage: "Grand Growth",
      plantingDate: new Date("2025-10-10"),
      soilType: "Black Soil",
      nitrogen: 250,
      phosphorus: 85,
      potassium: 170,
      irrigationMethod: "Daily Drip",
      irrigationFrequency: "Daily Drip",
      pestControl: "Integrated",
      rainfallMm: 1310,
      temperatureC: 29.8,
      dailySunlightHours: 8.5,
      currentNDVI: 0.86,
      currentNDWI: 0.56,
      currentEVI: 0.71,
      currentSoilMoisture: 36.0,
      currentTempC: 27.9,
      predictedYieldQAcre: 590.0,
      predictedYieldTonnesHa: 145.8,
      predictedYield: 145.8,
      riskLevel: "Low",
      boundaryPolygon: [
        [16.7772, 74.5206],
        [16.7814, 74.5222],
        [16.7800, 74.5274],
        [16.7758, 74.5258]
      ]
    },
    {
      name: "Plot 4 — Ratoon Sugarcane (VSI 434)",
      code: "FLD-04",
      areaHa: 2.0,
      areaAcres: 4.9,
      currentCrop: "Sugarcane",
      cropVariety: "VSI 434",
      cropDurationMonths: 11,
      cropStage: "Ripening/Maturity",
      plantingDate: new Date("2025-11-05"),
      soilType: "Black Soil",
      nitrogen: 190,
      phosphorus: 65,
      potassium: 120,
      irrigationMethod: "Furrow",
      irrigationFrequency: "1 time/week",
      pestControl: "Chemical",
      rainfallMm: 1150,
      temperatureC: 30.5,
      dailySunlightHours: 7.8,
      currentNDVI: 0.72,
      currentNDWI: 0.44,
      currentEVI: 0.58,
      currentSoilMoisture: 27.4,
      currentTempC: 30.2,
      predictedYieldQAcre: 440.0,
      predictedYieldTonnesHa: 108.7,
      predictedYield: 108.7,
      riskLevel: "Moderate",
      boundaryPolygon: [
        [16.7776, 74.5284],
        [16.7818, 74.5300],
        [16.7804, 74.5350],
        [16.7762, 74.5334]
      ]
    }
  ];

  const createdFields = [];
  for (const f of fieldsData) {
    const fieldDoc = await Field.create({
      farmId: farm._id,
      ...f
    });
    createdFields.push(fieldDoc);

    // Soil Data record
    await SoilData.create({
      fieldId: fieldDoc._id,
      soilType: f.soilType,
      nitrogen: f.nitrogen,
      phosphorus: f.phosphorus,
      potassium: f.potassium,
      ph: 7.2,
      organicMatterPct: 1.3,
      moisturePercent: f.currentSoilMoisture,
      source: "Soil Health Card (Maharashtra Agri Dept)"
    });

    // Irrigation record
    await IrrigationRecord.create({
      fieldId: fieldDoc._id,
      appliedDate: new Date(),
      volumeMm: 35,
      durationHours: 2.5,
      frequency: f.irrigationFrequency,
      method: f.irrigationMethod,
      status: f.riskLevel === "Moderate" ? "Review Needed" : "Adequate",
      notes: "Regular scheduled irrigation cycle"
    });

    // Yield Prediction record
    await Prediction.create({
      farmId: farm._id,
      fieldId: fieldDoc._id,
      crop: "Sugarcane",
      seedVariety: f.cropVariety,
      predictedYieldQAcre: f.predictedYieldQAcre,
      predictedYieldTonnesHa: f.predictedYieldTonnesHa,
      predictedYield: f.predictedYieldTonnesHa,
      confidencePct: 94.5,
      modelVersion: "XGBoost-Sugarcane-v1.4",
      featureImportance: [
        { factor: "Irrigation Schedule", impact: "positive", value: f.irrigationFrequency },
        { factor: "Sugarcane Variety", impact: "positive", value: f.cropVariety },
        { factor: "Soil Nutrients (NPK)", impact: "positive", value: `N:${f.nitrogen} P:${f.phosphorus} K:${f.potassium}` },
        { factor: "Rainfall", impact: "positive", value: `${f.rainfallMm} mm` }
      ]
    });
  }

  // Weather record
  await WeatherData.create({
    farmId: farm._id,
    temperatureC: 29.5,
    rainfallMm: 1240,
    dailySunlightHours: 8.2,
    humidityPct: 68,
    windSpeedKmh: 12,
    condition: "Sunny, optimal cane elongation climate",
    source: "Demo Weather Data (Maharashtra Agro-Climatic Zone)"
  });

  // Actionable Farmer Recommendations
  await Recommendation.create({
    farmId: farm._id,
    fieldId: createdFields[3]._id,
    fieldName: "Plot 4 — Ratoon Sugarcane (VSI 434)",
    category: "water",
    action: "Review irrigation schedule for Plot 4.",
    reason: "1 time/week irrigation is lowering the estimated yield for this plot.",
    whatToCheck: "Check soil root-zone moisture and consider switching to 2 times/week.",
    modelImpact: "Increasing frequency may improve yield estimate by ~8-12 tonnes/ha.",
    urgency: "high"
  });

  await Recommendation.create({
    farmId: farm._id,
    fieldId: createdFields[1]._id,
    fieldName: "Plot 2 — Suru Sugarcane (CoM 0265)",
    category: "soil",
    action: "Apply recommended Nitrogen top-dressing at tillering stage.",
    reason: "CoM 0265 responds with heavy tillering when nitrogen is supplied at 60-90 days.",
    whatToCheck: "Inspect tiller counts per clump and soil nitrogen level (currently 220 kg/ha).",
    modelImpact: "Supports optimal shoot density and stalk girth.",
    urgency: "medium"
  });

  await Recommendation.create({
    farmId: farm._id,
    fieldId: createdFields[0]._id,
    fieldName: "Plot 1 — Adsali Sugarcane (Co 86032)",
    category: "yield",
    action: "Maintain current drip schedule and earthing-up.",
    reason: "Plot 1 is performing at peak potential with expected yield of 139.6 tonnes/ha (565 Q/acre).",
    whatToCheck: "Verify drip emitters for uniform pressure across rows.",
    modelImpact: "Protects estimated 139.6 tonnes/ha harvest yield.",
    urgency: "low"
  });

  // Farm Events History
  await FarmEvent.create({
    farmId: farm._id,
    eventType: "Prediction",
    title: "Sugarcane Yield Recalculated",
    description: "Digital Twin updated yield forecast to 139.6 tonnes/ha for Plot 1 based on recent field inputs.",
    timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000)
  });

  await FarmEvent.create({
    farmId: farm._id,
    eventType: "Irrigation",
    title: "Drip Irrigation Applied",
    description: "Applied 35mm drip irrigation to Plot 1 and Plot 3.",
    timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000)
  });

  await FarmEvent.create({
    farmId: farm._id,
    eventType: "Pest Management",
    title: "Trichogramma Biocontrol Released",
    description: "Installed pheromone traps and egg parasitoids against early shoot borer in Plot 1 & Plot 3.",
    timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000)
  });

  // Model Version
  await ModelVersion.create({
    modelName: "XGBoost Sugarcane Regressor",
    algorithm: "XGBoost / Gradient Boosted Trees",
    accuracyR2: 0.9402,
    maeMetric: 21.22,
    rmseMetric: 26.79,
    dataset: "Kaggle Sugarcane Dataset (Maharashtra Benchmark)",
    trainedAt: new Date(),
    status: "active"
  });

  console.log("[AgriTwin Seed] Maharashtra Sugarcane Digital Twin Seed completed successfully!");
  return farm;
}
