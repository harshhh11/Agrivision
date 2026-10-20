import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { Farm, Field } from "../types";

interface FarmContextType {
  farm: Farm | null;
  setFarm: React.Dispatch<React.SetStateAction<Farm | null>>;
  fields: Field[];
  selectedField: Field | null;
  setSelectedField: (field: Field | null) => void;
  dashboardData: any | null;
  isLoading: boolean;
  refreshFarmData: () => Promise<void>;
  updateField: (id: string, updatedField: Field) => void;
  updateFieldParams: (id: string, updates: Partial<Field>) => Promise<boolean>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFarmData = useCallback(async () => {
    try {
      const res = await api.getDashboard("default");
      if (res.data?.status === "success") {
        setDashboardData(res.data);
        setFarm(res.data.farm);
        setFields(res.data.fields || []);
        
        if (selectedField) {
          const updated = (res.data.fields || []).find((f: Field) => f._id === selectedField._id);
          if (updated) setSelectedField(updated);
        } else if (res.data.fields?.length) {
          setSelectedField(res.data.fields[0]);
        }
      }
    } catch (err) {
      console.warn("[AgriTwin] Failed to fetch live dashboard summary, loading Maharashtra sugarcane fallback state:", err);
      // Maharashtra Sugarcane Fallback State
      setFarm({
        _id: "default-farm",
        name: "Demo Farm — Maharashtra",
        location: "Shirol, Kolhapur District, Maharashtra",
        state: "Maharashtra",
        district: "Kolhapur",
        taluka: "Shirol",
        village: "Shirol",
        totalAreaHa: 12.5,
        totalAreaAcres: 30.8,
        latitude: 16.7820,
        longitude: 74.5240,
        coordinates: [16.7820, 74.5240],
        digitalTwinMaturity: "Predictive",
        twinHealthStatus: "Optimal",
        primaryCrop: "Sugarcane"
      });
      const demoFields: Field[] = [
        {
          _id: "field-1",
          farmId: "default-farm",
          name: "Plot 1 — Adsali Sugarcane (Co 86032)",
          code: "FLD-01",
          areaHa: 4.2,
          areaAcres: 10.4,
          currentCrop: "Sugarcane",
          cropVariety: "Co 86032 (Nayana)",
          cropDurationMonths: 16,
          cropStage: "Grand Growth",
          plantingDate: "2025-07-15",
          soilType: "Black Soil",
          nitrogen: 240,
          phosphorus: 80,
          potassium: 160,
          irrigationFrequency: "3 times/week",
          pestControl: "Integrated",
          rainfallMm: 1280,
          temperatureC: 29.5,
          dailySunlightHours: 8.4,
          currentNDVI: 0.84,
          currentNDWI: 0.54,
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
          ],
          lastUpdated: new Date().toISOString()
        },
        {
          _id: "field-2",
          farmId: "default-farm",
          name: "Plot 2 — Suru Sugarcane (CoM 0265)",
          code: "FLD-02",
          areaHa: 3.5,
          areaAcres: 8.6,
          currentCrop: "Sugarcane",
          cropVariety: "CoM 0265 (Phule 265)",
          cropDurationMonths: 12,
          cropStage: "Tillering",
          plantingDate: "2026-01-20",
          soilType: "Clay Loam",
          nitrogen: 220,
          phosphorus: 75,
          potassium: 140,
          irrigationFrequency: "2 times/week",
          pestControl: "Biological",
          rainfallMm: 1220,
          temperatureC: 29.0,
          dailySunlightHours: 8.1,
          currentNDVI: 0.79,
          currentNDWI: 0.49,
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
          ],
          lastUpdated: new Date().toISOString()
        },
        {
          _id: "field-3",
          farmId: "default-farm",
          name: "Plot 3 — Pre-seasonal Sugarcane (Co 0238)",
          code: "FLD-03",
          areaHa: 2.8,
          areaAcres: 6.9,
          currentCrop: "Sugarcane",
          cropVariety: "Co 0238 (Karan 4)",
          cropDurationMonths: 14,
          cropStage: "Grand Growth",
          plantingDate: "2025-10-10",
          soilType: "Black Soil",
          nitrogen: 250,
          phosphorus: 85,
          potassium: 170,
          irrigationFrequency: "Daily Drip",
          pestControl: "Integrated",
          rainfallMm: 1310,
          temperatureC: 29.8,
          dailySunlightHours: 8.5,
          currentNDVI: 0.86,
          currentNDWI: 0.56,
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
          ],
          lastUpdated: new Date().toISOString()
        },
        {
          _id: "field-4",
          farmId: "default-farm",
          name: "Plot 4 — Ratoon Sugarcane (VSI 434)",
          code: "FLD-04",
          areaHa: 2.0,
          areaAcres: 4.9,
          currentCrop: "Sugarcane",
          cropVariety: "VSI 434",
          cropDurationMonths: 11,
          cropStage: "Ripening/Maturity",
          plantingDate: "2025-11-05",
          soilType: "Black Soil",
          nitrogen: 190,
          phosphorus: 65,
          potassium: 120,
          irrigationFrequency: "1 time/week",
          pestControl: "Chemical",
          rainfallMm: 1150,
          temperatureC: 30.5,
          dailySunlightHours: 7.8,
          currentNDVI: 0.72,
          currentNDWI: 0.44,
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
          ],
          lastUpdated: new Date().toISOString()
        }
      ];
      setFields(demoFields);
      setSelectedField(demoFields[0]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedField]);

  useEffect(() => {
    refreshFarmData();
  }, []);

  const updateFieldInState = (id: string, updatedField: Field) => {
    setFields(prev => prev.map(f => f._id === id ? updatedField : f));
    if (selectedField?._id === id) {
      setSelectedField(updatedField);
    }
  };

  const updateFieldParams = async (id: string, updates: Partial<Field>): Promise<boolean> => {
    try {
      const res = await api.updateField(id, updates);
      if (res.data?.status === "success" && res.data.field) {
        updateFieldInState(id, res.data.field);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update field params:", err);
      // Apply optimistic update
      setFields(prev => prev.map(f => {
        if (f._id === id) {
          const merged = { ...f, ...updates, lastUpdated: new Date().toISOString() };
          if (selectedField?._id === id) setSelectedField(merged);
          return merged;
        }
        return f;
      }));
      return true;
    }
  };

  return (
    <FarmContext.Provider
      value={{
        farm,
        setFarm,
        fields,
        selectedField,
        setSelectedField,
        dashboardData,
        isLoading,
        refreshFarmData,
        updateField: updateFieldInState,
        updateFieldParams
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarm must be used within a FarmProvider");
  }
  return context;
};
