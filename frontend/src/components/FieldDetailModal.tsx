import React, { useState, useEffect } from "react";
import { Field } from "../types";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import { api } from "../services/api";
import { X, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

interface FieldDetailModalProps {
  field: Field | null;
  onClose: () => void;
}

export const FieldDetailModal: React.FC<FieldDetailModalProps> = ({ field, onClose }) => {
  const { updateField } = useFarm();
  const { t, formatYield } = useI18n();

  const [variety, setVariety] = useState<string>("Co 86032");
  const [soilType, setSoilType] = useState<string>("Black Soil");
  const [duration, setDuration] = useState<number>(14);
  const [irrigation, setIrrigation] = useState<string>("2 times/week");
  const [pestControl, setPestControl] = useState<string>("Integrated");
  const [rainfall, setRainfall] = useState<number>(1280);
  const [temperature, setTemperature] = useState<number>(29.5);
  const [sunlight, setSunlight] = useState<number>(8.4);
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(80);
  const [potassium, setPotassium] = useState<number>(160);

  const [saving, setSaving] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  useEffect(() => {
    if (field) {
      setVariety(field.cropVariety || "Co 86032");
      setSoilType(field.soilType || "Black Soil");
      setDuration(field.cropDurationMonths || 14);
      setIrrigation(field.irrigationFrequency || "2 times/week");
      setPestControl(field.pestControl || "Integrated");
      setRainfall(field.rainfallMm || 1280);
      setTemperature(field.temperatureC || 29.5);
      setSunlight(field.dailySunlightHours || 8.4);
      setNitrogen(field.nitrogen || 240);
      setPhosphorus(field.phosphorus || 80);
      setPotassium(field.potassium || 160);
      setPredictionResult(null);
    }
  }, [field]);

  if (!field) return null;

  const handleRecalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = {
        cropVariety: variety,
        soilType,
        cropDurationMonths: duration,
        irrigationFrequency: irrigation,
        pestControl,
        rainfallMm: rainfall,
        temperatureC: temperature,
        dailySunlightHours: sunlight,
        nitrogen,
        phosphorus,
        potassium
      };

      const res = await api.put(`/fields/${field._id}`, updates);
      if (res.data?.field) {
        updateField(field._id, res.data.field);
        setPredictionResult(res.data.prediction);
      }
    } catch (err) {
      console.error("Failed to update field:", err);
      // Optimistic local update
      const updatedField = {
        ...field,
        cropVariety: variety,
        soilType,
        cropDurationMonths: duration,
        irrigationFrequency: irrigation,
        pestControl,
        rainfallMm: rainfall,
        temperatureC: temperature,
        dailySunlightHours: sunlight,
        nitrogen,
        phosphorus,
        potassium,
        predictedYieldQAcre: Number((560 + (nitrogen > 220 ? 15 : 0) + (irrigation === "3 times/week" ? 20 : 0)).toFixed(1)),
        predictedYieldTonnesHa: Number(((560 + (nitrogen > 220 ? 15 : 0) + (irrigation === "3 times/week" ? 20 : 0)) * 0.247105).toFixed(1))
      };
      updateField(field._id, updatedField);
      setPredictionResult({
        predictedYieldQAcre: updatedField.predictedYieldQAcre,
        predictedYieldTonnesHa: updatedField.predictedYieldTonnesHa
      });
    } finally {
      setSaving(false);
    }
  };

  const currentYield = predictionResult?.predictedYieldTonnesHa || field.predictedYieldTonnesHa || field.predictedYield || 138.5;
  const currentQAcre = predictionResult?.predictedYieldQAcre || field.predictedYieldQAcre || (currentYield / 0.247105);
  const yFmt = formatYield(currentYield, currentQAcre);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#EBEBEB] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6F6F6F]">
              {t("navMyFarm")} • {t("plot")} {t("btnChange")}
            </span>
            <h3 className="text-xl font-bold text-black mt-0.5">{field.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6F6F6F] hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRecalculate} className="p-6 space-y-6 flex-1">
          
          {/* Expected Crop Card */}
          <div className="p-5 rounded-3xl bg-neutral-900 text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-neutral-400 block mb-1">
                {t("cardExpectedCrop")}
              </span>
              <div className="text-3xl font-extrabold text-white">
                {yFmt.primary}
              </div>
              <span className="text-xs text-neutral-400">{yFmt.secondary}</span>
            </div>
            <div className="text-right">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                {t("valGood")}
              </span>
            </div>
          </div>

          {/* Section 1: Sugarcane Variety & Duration */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-black block uppercase tracking-wider">
              1. {t("factorVariety")} & {t("optDuration")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[#6F6F6F] block mb-1">{t("factorVariety")}</span>
                <select
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EBEBEB] bg-neutral-50 text-black font-medium focus:outline-none focus:border-black"
                >
                  <option value="Co 86032">Co 86032 (Nayana)</option>
                  <option value="Co 0238">Co 0238 (Karan 4)</option>
                  <option value="CoM 0265">CoM 0265 (Phule 265)</option>
                  <option value="Co 8014">Co 8014 (Mahalaxmi)</option>
                  <option value="Co 92005">Co 92005</option>
                  <option value="VSI 434">VSI 434</option>
                </select>
              </div>

              <div>
                <span className="text-xs text-[#6F6F6F] block mb-1">{t("optDuration")}</span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EBEBEB] bg-neutral-50 text-black font-medium focus:outline-none focus:border-black"
                >
                  <option value={10}>10 {t("caneDurationMonths")}</option>
                  <option value={11}>11 {t("caneDurationMonths")} ({t("ratoonCrop")})</option>
                  <option value={12}>12 {t("caneDurationMonths")} ({t("suruCrop")})</option>
                  <option value={14}>14 {t("caneDurationMonths")} ({t("preSeasonalCrop")})</option>
                  <option value={16}>16 {t("caneDurationMonths")} ({t("adsaliCrop")})</option>
                  <option value={18}>18 {t("caneDurationMonths")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Soil & Nutrients (NPK) */}
          <div className="space-y-3 pt-4 border-t border-[#EBEBEB]">
            <label className="text-xs font-bold text-black block uppercase tracking-wider">
              2. {t("cardSoilStatus")} (N-P-K)
            </label>
            <div>
              <span className="text-xs text-[#6F6F6F] block mb-1">{t("labelSoilType")}</span>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EBEBEB] bg-neutral-50 text-black font-medium focus:outline-none focus:border-black"
              >
                <option value="Black Soil">{t("soilBlack")}</option>
                <option value="Clay Loam">{t("soilClayLoam")}</option>
                <option value="Alluvial">{t("soilAlluvial")}</option>
                <option value="Red Soil">{t("soilRedLoam")}</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                <div className="flex justify-between text-xs text-[#6F6F6F] mb-1">
                  <span>{t("soilNitrogen")}</span>
                  <span className="font-bold text-black">{nitrogen}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={350}
                  step={5}
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                <div className="flex justify-between text-xs text-[#6F6F6F] mb-1">
                  <span>{t("soilPhosphorus")}</span>
                  <span className="font-bold text-black">{phosphorus}</span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={120}
                  step={5}
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                <div className="flex justify-between text-xs text-[#6F6F6F] mb-1">
                  <span>{t("soilPotassium")}</span>
                  <span className="font-bold text-black">{potassium}</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={220}
                  step={5}
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Irrigation & Pest Practices */}
          <div className="space-y-3 pt-4 border-t border-[#EBEBEB]">
            <label className="text-xs font-bold text-black block uppercase tracking-wider">
              3. {t("cardWaterStatus")} & {t("factorPest")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[#6F6F6F] block mb-1">{t("factorWater")}</span>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EBEBEB] bg-neutral-50 text-black font-medium focus:outline-none focus:border-black"
                >
                  <option value="Daily Drip">{t("waterDailyDrip")}</option>
                  <option value="3 times/week">{t("waterTimes3")}</option>
                  <option value="2 times/week">{t("waterTimes2")}</option>
                  <option value="1 time/week">{t("waterTimes1")}</option>
                </select>
              </div>

              <div>
                <span className="text-xs text-[#6F6F6F] block mb-1">{t("factorPest")}</span>
                <select
                  value={pestControl}
                  onChange={(e) => setPestControl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EBEBEB] bg-neutral-50 text-black font-medium focus:outline-none focus:border-black"
                >
                  <option value="Integrated">{t("pestIntegrated")}</option>
                  <option value="Biological">{t("pestBiological")}</option>
                  <option value="Chemical">{t("pestChemical")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Seasonal Weather Parameters */}
          <div className="space-y-3 pt-4 border-t border-[#EBEBEB]">
            <label className="text-xs font-bold text-black block uppercase tracking-wider">
              4. {t("sunlightWeather")}
            </label>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                <div className="flex justify-between text-[#6F6F6F] mb-1">
                  <span>{t("factorRain")}</span>
                  <span className="font-bold text-black">{rainfall} mm</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={1900}
                  step={20}
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                  <div className="flex justify-between text-[#6F6F6F] mb-1">
                    <span>{t("factorTemp")}</span>
                    <span className="font-bold text-black">{temperature}°C</span>
                  </div>
                  <input
                    type="range"
                    min={21}
                    max={38}
                    step={0.5}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                  <div className="flex justify-between text-[#6F6F6F] mb-1">
                    <span>{t("optSunlight")}</span>
                    <span className="font-bold text-black">{sunlight} hrs</span>
                  </div>
                  <input
                    type="range"
                    min={5.5}
                    max={10.5}
                    step={0.2}
                    value={sunlight}
                    onChange={(e) => setSunlight(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 sticky bottom-0 bg-white pb-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-black text-white text-xs py-3.5 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {saving ? "..." : `${t("btnSave")} & ${t("btnRecalculate")}`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
