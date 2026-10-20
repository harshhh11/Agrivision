export interface Farm {
  _id: string;
  id?: string;
  farmerId?: string;
  name: string;
  locationName?: string;
  location?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  latitude: number;
  longitude: number;
  coordinates?: [number, number];
  totalAreaHa: number;
  totalAreaAcres?: number;
  elevationM?: number;
  soilSummary?: string;
  climateZone?: string;
  primaryCrop?: string;
  isDemoFarm?: boolean;
  digitalTwinMaturity?: "Monitoring" | "Predictive" | "Prescriptive";
  twinHealthStatus?: "Optimal" | "Action Required" | "Sync Delay";
  lastSyncAt?: string;
  lastSync?: string;
  boundaryGeoJSON?: any;
}

export interface Field {
  _id: string;
  id?: string;
  farmId: string;
  name: string;
  code: string;
  areaHa: number;
  areaAcres?: number;
  currentCrop: string;
  cropVariety?: string;
  cropDurationMonths?: number;
  cropStage: string;
  plantingDate?: string;
  soilType: string;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  irrigationMethod?: string;
  irrigationFrequency?: string;
  pestControl?: string;
  rainfallMm?: number;
  temperatureC?: number;
  dailySunlightHours?: number;
  boundaryPolygon: [number, number][];
  currentNDVI?: number;
  currentNDWI?: number;
  currentEVI?: number;
  currentSoilMoisture?: number;
  currentTempC?: number;
  predictedYield?: number;
  predictedYieldQAcre?: number;
  predictedYieldTonnesHa?: number;
  riskLevel: "Low" | "Moderate" | "High";
  lastUpdated: string;
}

export interface Prediction {
  _id: string;
  farmId: string;
  fieldId?: string;
  crop: string;
  seedVariety?: string;
  predictedYield: number;
  predictedYieldQAcre?: number;
  predictedYieldTonnesHa?: number;
  rangeMin?: number;
  rangeMax?: number;
  confidencePct: number;
  expectedHarvestDate?: string;
  modelVersion: string;
  inputFeatures?: any;
  featureImportance?: Array<any>;
  narrativeWhy?: Array<any>;
  createdAt: string;
}

export interface Recommendation {
  _id: string;
  farmId: string;
  fieldId?: string;
  fieldName: string;
  action: string;
  reason: string;
  whatToCheck?: string;
  modelImpact?: string;
  urgency: "low" | "medium" | "high" | "critical";
  category: "water" | "soil" | "pest" | "yield" | "general" | "irrigation" | "nutrient" | "harvest";
  confidencePct?: number;
  status: "pending" | "done" | "snoozed" | "dismissed";
  actedAt?: string;
  actionNote?: string;
  createdAt: string;
}

export interface RiskAlert {
  _id: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  riskType: string;
  severity: "low" | "moderate" | "severe" | "critical";
  reason: string;
  timeWindow: string;
  recommendedAction: string;
  status: "active" | "mitigated" | "monitoring";
  createdAt: string;
}

export interface WeatherData {
  _id?: string;
  farmId: string;
  temperatureC: number;
  humidityPct?: number;
  rainfallMm: number;
  dailySunlightHours?: number;
  windSpeedKmh?: number;
  condition: string;
  source?: string;
}

export interface SoilData {
  _id?: string;
  fieldId: string;
  soilType?: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicMatterPct?: number;
  moisturePercent: number;
  source?: string;
}
