import mongoose, { Schema, Document } from "mongoose";
import { isDbConnected } from "../config/db";

// ==========================================
// 1. Mongoose Schema Declarations
// ==========================================

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["farmer", "agronomist", "admin"], default: "farmer" },
  phone: { type: String },
  preferredLanguage: { type: String, enum: ["en", "hi", "mr"], default: "en" },
  preferredUnit: { type: String, enum: ["tonnes_ha", "quintals_acre"], default: "tonnes_ha" }
}, { timestamps: true });

const FarmerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  state: { type: String, default: "Maharashtra" },
  district: { type: String, default: "Kolhapur" },
  taluka: { type: String, default: "Karveer" },
  village: { type: String, default: "Kasba Bawada" },
  experienceYears: { type: Number, default: 12 },
  primaryFarmId: { type: Schema.Types.ObjectId, ref: "Farm" },
}, { timestamps: true });

const FarmSchema = new Schema({
  farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  locationName: { type: String, required: true },
  state: { type: String, default: "Maharashtra" },
  district: { type: String, default: "Kolhapur" },
  taluka: { type: String, default: "Karveer" },
  village: { type: String, default: "Kasba Bawada" },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  totalAreaHa: { type: Number, required: true },
  totalAreaAcres: { type: Number, required: true },
  elevationM: { type: Number, default: 560 },
  soilSummary: { type: String, default: "Deep Black Cotton Soil (Vertisol)" },
  climateZone: { type: String, default: "Tropical Wet and Dry (Aw)" },
  primaryCrop: { type: String, default: "Sugarcane" },
  isDemoFarm: { type: Boolean, default: true },
  digitalTwinMaturity: { type: String, enum: ["Monitoring", "Predictive", "Prescriptive"], default: "Predictive" },
  twinHealthStatus: { type: String, enum: ["Optimal", "Action Required", "Sync Delay"], default: "Optimal" },
  lastSyncAt: { type: Date, default: Date.now },
  boundaryGeoJSON: { type: Schema.Types.Mixed },
}, { timestamps: true });

const FieldSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  areaHa: { type: Number, required: true },
  areaAcres: { type: Number, required: true },
  currentCrop: { type: String, default: "Sugarcane" },
  cropVariety: { type: String, default: "Co 86032" },
  cropDurationMonths: { type: Number, default: 12 },
  cropStage: { type: String, enum: ["Germination", "Tillering", "Grand Growth", "Ripening/Maturity", "Harvested"], default: "Grand Growth" },
  plantingDate: { type: Date, default: () => new Date(Date.now() - 120 * 24 * 3600 * 1000) },
  soilType: { type: String, default: "Black Soil" },
  nitrogen: { type: Number, default: 240 },
  phosphorus: { type: Number, default: 80 },
  potassium: { type: Number, default: 160 },
  irrigationMethod: { type: String, default: "Drip" },
  irrigationFrequency: { type: String, default: "2 times/week" },
  pestControl: { type: String, default: "Integrated" },
  rainfallMm: { type: Number, default: 1240 },
  temperatureC: { type: Number, default: 29.2 },
  dailySunlightHours: { type: Number, default: 8.2 },
  boundaryPolygon: { type: [[Number]], required: true },
  // Satellite Demo metrics (honest disclaimer)
  currentNDVI: { type: Number, default: 0.82 },
  currentNDWI: { type: Number, default: 0.52 },
  currentEVI: { type: Number, default: 0.65 },
  currentSoilMoisture: { type: Number, default: 34.2 },
  currentTempC: { type: Number, default: 28.6 },
  predictedYieldQAcre: { type: Number, default: 560.5 },
  predictedYieldTonnesHa: { type: Number, default: 138.5 },
  predictedYield: { type: Number, default: 138.5 }, // backward compatibility
  riskLevel: { type: String, enum: ["Low", "Moderate", "High"], default: "Low" },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const SoilDataSchema = new Schema({
  fieldId: { type: Schema.Types.ObjectId, ref: "Field", required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  soilType: { type: String, default: "Black Soil" },
  nitrogen: { type: Number, default: 240 },
  phosphorus: { type: Number, default: 80 },
  potassium: { type: Number, default: 160 },
  ph: { type: Number, default: 7.2 },
  organicMatterPct: { type: Number, default: 1.2 },
  moisturePercent: { type: Number, default: 34.2 },
  source: { type: String, default: "Soil Health Card / Demo Test" },
  confidence: { type: Number, default: 95 },
}, { timestamps: true });

const WeatherDataSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  temperatureC: { type: Number, required: true },
  rainfallMm: { type: Number, default: 0 },
  dailySunlightHours: { type: Number, default: 8.2 },
  humidityPct: { type: Number, default: 68 },
  windSpeedKmh: { type: Number, default: 11 },
  condition: { type: String, default: "Sunny with light breeze" },
  source: { type: String, default: "Demo Weather Data (Maharashtra Agro-Climatic Zone)" },
}, { timestamps: true });

const IrrigationRecordSchema = new Schema({
  fieldId: { type: Schema.Types.ObjectId, ref: "Field", required: true, index: true },
  appliedDate: { type: Date, default: Date.now },
  volumeMm: { type: Number, default: 35 },
  durationHours: { type: Number, default: 2.5 },
  frequency: { type: String, default: "2 times/week" },
  method: { type: String, default: "Drip Irrigation" },
  status: { type: String, default: "Adequate" },
  notes: { type: String },
}, { timestamps: true });

const PredictionSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  fieldId: { type: Schema.Types.ObjectId, ref: "Field", required: true, index: true },
  crop: { type: String, default: "Sugarcane" },
  seedVariety: { type: String, default: "Co 86032" },
  predictedYieldQAcre: { type: Number, required: true },
  predictedYieldTonnesHa: { type: Number, required: true },
  predictedYield: { type: Number, required: true }, // backward compatibility
  confidencePct: { type: Number, default: 94.5 },
  modelVersion: { type: String, default: "XGBoost-Sugarcane-v1.4" },
  inputFeatures: { type: Schema.Types.Mixed },
  featureImportance: [{ type: Schema.Types.Mixed }],
  narrativeWhy: [{ type: Schema.Types.Mixed }],
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const RecommendationSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  fieldId: { type: Schema.Types.ObjectId, ref: "Field" },
  fieldName: { type: String, default: "Plot 1 — Adsali Sugarcane" },
  category: { type: String, enum: ["water", "soil", "pest", "yield", "general"], default: "water" },
  action: { type: String, required: true },
  reason: { type: String, required: true },
  whatToCheck: { type: String, default: "Inspect field conditions" },
  modelImpact: { type: String, default: "Supports optimal sugarcane growth" },
  urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["pending", "completed", "dismissed"], default: "pending" },
}, { timestamps: true });

const SimulationSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  title: { type: String, default: "What-If Sugarcane Simulation" },
  baselineState: { type: Schema.Types.Mixed },
  scenarioInputs: { type: Schema.Types.Mixed },
  results: { type: Schema.Types.Mixed },
}, { timestamps: true });

const FarmEventSchema = new Schema({
  farmId: { type: Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  fieldId: { type: Schema.Types.ObjectId, ref: "Field" },
  fieldName: { type: String },
  eventType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const ModelVersionSchema = new Schema({
  modelName: { type: String, required: true },
  algorithm: { type: String, required: true },
  accuracyR2: { type: Number, default: 0.94 },
  maeMetric: { type: Number, default: 21.2 },
  rmseMetric: { type: Number, default: 26.8 },
  trainedAt: { type: Date, default: Date.now },
  dataset: { type: String, default: "Kaggle Sugarcane Dataset" },
  status: { type: String, default: "active" },
}, { timestamps: true });

// Native Mongoose Models
const NativeUser = mongoose.model("User", UserSchema);
const NativeFarmer = mongoose.model("Farmer", FarmerSchema);
const NativeFarm = mongoose.model("Farm", FarmSchema);
const NativeField = mongoose.model("Field", FieldSchema);
const NativeSoilData = mongoose.model("SoilData", SoilDataSchema);
const NativeWeatherData = mongoose.model("WeatherData", WeatherDataSchema);
const NativeIrrigationRecord = mongoose.model("IrrigationRecord", IrrigationRecordSchema);
const NativePrediction = mongoose.model("Prediction", PredictionSchema);
const NativeRecommendation = mongoose.model("Recommendation", RecommendationSchema);
const NativeSimulation = mongoose.model("Simulation", SimulationSchema);
const NativeFarmEvent = mongoose.model("FarmEvent", FarmEventSchema);
const NativeModelVersion = mongoose.model("ModelVersion", ModelVersionSchema);

// ==========================================
// 2. High-Performance In-Memory Document Store Fallback
// ==========================================

let idCounter = 1;
function generateHexId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const counter = (idCounter++).toString(16).padStart(6, '0');
  return `${timestamp}a1b2c3d4${counter}`.slice(0, 24);
}

class InMemoryCollection {
  private docs: any[] = [];

  constructor(public name: string) {}

  private matchFilter(doc: any, filter?: any): boolean {
    if (!filter || Object.keys(filter).length === 0) return true;

    if ("$or" in filter && Array.isArray(filter.$or)) {
      const orMatched = filter.$or.some((subFilter: any) => this.matchFilter(doc, subFilter));
      if (!orMatched) return false;
    }

    for (const key of Object.keys(filter)) {
      if (key === "$or") continue;
      const val = filter[key];

      if (key === "_id") {
        if (doc._id?.toString() !== val?.toString()) return false;
        continue;
      }

      if (val && typeof val === "object") {
        if ("$ne" in val) {
          if (doc[key] === val.$ne) return false;
        } else if ("$in" in val && Array.isArray(val.$in)) {
          const strList = val.$in.map((x: any) => x?.toString());
          if (!strList.includes(doc[key]?.toString())) return false;
        }
      } else {
        if (doc[key]?.toString() !== val?.toString()) return false;
      }
    }
    return true;
  }

  private wrapDoc(raw: any) {
    if (!raw) return null;
    const doc = { ...raw };
    doc._id = doc._id || generateHexId();
    doc.save = async function() {
      return doc;
    };
    return doc;
  }

  find(filter?: any) {
    const matched = this.docs.filter(d => this.matchFilter(d, filter)).map(d => this.wrapDoc(d));

    const query = {
      _data: matched,
      sort(sortCriteria: any) {
        const [field, dir] = Object.entries(sortCriteria)[0] || [];
        if (field) {
          query._data.sort((a: any, b: any) => {
            const va = a[field];
            const vb = b[field];
            if (va < vb) return dir === -1 ? 1 : -1;
            if (va > vb) return dir === -1 ? -1 : 1;
            return 0;
          });
        }
        return query;
      },
      limit(n: number) {
        query._data = query._data.slice(0, n);
        return query;
      },
      populate() {
        return query;
      },
      exec() {
        return Promise.resolve(query._data);
      },
      then(resolve: any, reject: any) {
        return Promise.resolve(query._data).then(resolve, reject);
      }
    };
    return query;
  }

  findOne(filter?: any) {
    const query = {
      _filter: filter,
      _sortCriteria: null as any,
      _parent: this,
      sort(sortCriteria: any) {
        this._sortCriteria = sortCriteria;
        return this;
      },
      select() { return this; },
      lean() { return this; },
      populate() { return this; },
      _getDoc() {
        let matched = this._parent.docs.filter(d => this._parent.matchFilter(d, this._filter)).map(d => this._parent.wrapDoc(d));
        if (this._sortCriteria) {
          const [field, dir] = Object.entries(this._sortCriteria)[0] || [];
          if (field) {
            matched.sort((a: any, b: any) => {
              const va = a[field];
              const vb = b[field];
              if (va < vb) return dir === -1 ? 1 : -1;
              if (va > vb) return dir === -1 ? -1 : 1;
              return 0;
            });
          }
        }
        return matched[0] || null;
      },
      exec() {
        return Promise.resolve(this._getDoc());
      },
      then(resolve: any, reject: any) {
        return Promise.resolve(this._getDoc()).then(resolve, reject);
      }
    };
    return query;
  }

  findById(id: any) {
    return this.findOne({ _id: id });
  }

  async findByIdAndUpdate(id: any, update: any, options?: any) {
    const idx = this.docs.findIndex(d => d._id?.toString() === id?.toString());
    if (idx === -1) return null;
    const current = this.docs[idx];
    const updated = { ...current, ...update, updatedAt: new Date() };
    this.docs[idx] = updated;
    return this.wrapDoc(updated);
  }

  async findOneAndUpdate(filter: any, update: any, options?: any) {
    const idx = this.docs.findIndex(d => this.matchFilter(d, filter));
    if (idx === -1) return null;
    const current = this.docs[idx];
    const updated = { ...current, ...update, updatedAt: new Date() };
    this.docs[idx] = updated;
    return this.wrapDoc(updated);
  }

  async create(data: any) {
    const doc = {
      _id: generateHexId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.docs.push(doc);
    return this.wrapDoc(doc);
  }

  async insertMany(items: any[]) {
    const created = items.map(item => ({
      _id: generateHexId(),
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    this.docs.push(...created);
    return created.map(d => this.wrapDoc(d));
  }

  async deleteMany(filter?: any) {
    if (!filter || Object.keys(filter).length === 0) {
      const count = this.docs.length;
      this.docs = [];
      return { deletedCount: count };
    }
    const before = this.docs.length;
    this.docs = this.docs.filter(d => !this.matchFilter(d, filter));
    return { deletedCount: before - this.docs.length };
  }

  async countDocuments(filter?: any) {
    return this.docs.filter(d => this.matchFilter(d, filter)).length;
  }
}

const inMemoryStores: { [key: string]: InMemoryCollection } = {
  User: new InMemoryCollection("User"),
  Farmer: new InMemoryCollection("Farmer"),
  Farm: new InMemoryCollection("Farm"),
  Field: new InMemoryCollection("Field"),
  SoilData: new InMemoryCollection("SoilData"),
  WeatherData: new InMemoryCollection("WeatherData"),
  IrrigationRecord: new InMemoryCollection("IrrigationRecord"),
  Prediction: new InMemoryCollection("Prediction"),
  Recommendation: new InMemoryCollection("Recommendation"),
  Simulation: new InMemoryCollection("Simulation"),
  FarmEvent: new InMemoryCollection("FarmEvent"),
  ModelVersion: new InMemoryCollection("ModelVersion"),
};

function getModelProxy<T>(name: string, nativeModel: any): any {
  return new Proxy(nativeModel, {
    get(target, prop) {
      if (isDbConnected()) {
        return target[prop];
      }
      const mem = inMemoryStores[name];
      if (mem && prop in mem) {
        const val = (mem as any)[prop];
        return typeof val === "function" ? val.bind(mem) : val;
      }
      return target[prop];
    }
  });
}

export const User = getModelProxy("User", NativeUser);
export const Farmer = getModelProxy("Farmer", NativeFarmer);
export const Farm = getModelProxy("Farm", NativeFarm);
export const Field = getModelProxy("Field", NativeField);
export const SoilData = getModelProxy("SoilData", NativeSoilData);
export const WeatherData = getModelProxy("WeatherData", NativeWeatherData);
export const IrrigationRecord = getModelProxy("IrrigationRecord", NativeIrrigationRecord);
export const Prediction = getModelProxy("Prediction", NativePrediction);
export const Recommendation = getModelProxy("Recommendation", NativeRecommendation);
export const Simulation = getModelProxy("Simulation", NativeSimulation);
export const FarmEvent = getModelProxy("FarmEvent", NativeFarmEvent);
export const ModelVersion = getModelProxy("ModelVersion", NativeModelVersion);

// Backward compatibility aliases if needed
export const Crop = Field;
export const SatelliteData = Field;
export const SensorData = Field;
export const YieldRecord = Prediction;
export const RiskAlert = Recommendation;
