import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import { api } from "../services/api";
import {
  HelpCircle, ArrowRight, RotateCcw, Check, Sparkles,
  Droplets, CloudRain, Sprout, Bug, Sun, Thermometer, Clock
} from "lucide-react";

export const SimulationPage: React.FC = () => {
  const { fields, selectedField } = useFarm();
  const { t, formatYield, unit } = useI18n();
  const activePlot = selectedField || fields[0] || null;

  // Active parameter category
  const [activeCategory, setActiveCategory] = useState<"water" | "soil" | "duration" | "pest" | "rain" | "temp" | "sun">("water");

  // Baseline values
  const baselineState = {
    rainfall: activePlot?.rainfallMm || 1240,
    temperature: activePlot?.temperatureC || 29.2,
    sunlight: activePlot?.dailySunlightHours || 8.2,
    nitrogen: activePlot?.nitrogen || 240,
    phosphorus: activePlot?.phosphorus || 80,
    potassium: activePlot?.potassium || 160,
    soil_type: activePlot?.soilType || "Black Soil",
    crop_duration: activePlot?.cropDurationMonths || 14,
    irrigation_frequency: activePlot?.irrigationFrequency || "2 times/week",
    pest_control: activePlot?.pestControl || "Integrated",
    seed_variety: activePlot?.cropVariety || "Co 86032"
  };

  // What-If State
  const [irrigation, setIrrigation] = useState<string>("3 times/week");
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(80);
  const [potassium, setPotassium] = useState<number>(160);
  const [duration, setDuration] = useState<number>(14);
  const [pestControl, setPestControl] = useState<string>("Integrated");
  const [rainfall, setRainfall] = useState<number>(1280);
  const [temperature, setTemperature] = useState<number>(29.5);
  const [sunlight, setSunlight] = useState<number>(8.4);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const scenarioParams = {
        rainfall,
        temperature,
        sunlight,
        nitrogen,
        phosphorus,
        potassium,
        soil_type: baselineState.soil_type,
        crop_duration: duration,
        irrigation_frequency: irrigation,
        pest_control: pestControl,
        seed_variety: baselineState.seed_variety
      };

      const res = await api.post("/simulation", {
        baseline_state: baselineState,
        scenario_params: scenarioParams
      });

      if (res.data?.results) {
        setResult(res.data.results);
      }
    } catch (err) {
      console.error("Simulation error:", err);
      // Client fallback simulation
      const baseQ = activePlot?.predictedYieldQAcre || 560.5;
      let diffQ = 0;
      if (irrigation === "Daily Drip" || irrigation === "3 times/week") diffQ += 22.5;
      if (irrigation === "1 time/week") diffQ -= 35.0;
      if (nitrogen > 220) diffQ += 15.0;
      if (pestControl === "Integrated") diffQ += 12.0;

      const simQ = Math.max(300, baseQ + diffQ);
      setResult({
        baseline: { yield_q_acre: baseQ, yield_tonnes_ha: Number((baseQ * 0.247105).toFixed(1)) },
        simulated: { yield_q_acre: simQ, yield_tonnes_ha: Number((simQ * 0.247105).toFixed(1)) },
        delta: { q_acre: simQ - baseQ, tonnes_ha: Number(((simQ - baseQ) * 0.247105).toFixed(1)) }
      });
    } finally {
      setLoading(false);
    }
  };

  const baseYieldQ = result?.baseline?.yield_q_acre || activePlot?.predictedYieldQAcre || 560.5;
  const simYieldQ = result?.simulated?.yield_q_acre || 583.0;
  const deltaQ = simYieldQ - baseYieldQ;

  const baseFmt = formatYield(Number((baseYieldQ * 0.247105).toFixed(1)), baseYieldQ);
  const simFmt = formatYield(Number((simYieldQ * 0.247105).toFixed(1)), simYieldQ);
  const deltaFmt = formatYield(Number((Math.abs(deltaQ) * 0.247105).toFixed(1)), Math.abs(deltaQ));

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-5xl mx-auto">
      
      {/* Editorial Farmer Header */}
      <div className="mb-8 pb-6 border-b border-[#EBEBEB]">
        <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{t("demoBadge")} • {activePlot?.name || "Plot 1 (Co 86032)"}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
          {t("whatIfTitle")}
        </h1>
        <p className="text-base text-[#6F6F6F] mt-2">
          {t("whatIfSubtitle")}
        </p>
      </div>

      {/* ==================================================
          QUESTION: WHAT DO YOU WANT TO CHANGE?
          ================================================== */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6F6F6F] mb-3 font-mono">
          {t("whatToChange")}
        </h2>

        {/* Category Big Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <button
            onClick={() => setActiveCategory("water")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeCategory === "water"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-black border-[#EBEBEB] hover:border-black"
            }`}
          >
            <Droplets className="w-5 h-5 mb-2 text-blue-500" />
            <span className="text-xs font-semibold block">{t("optWater")}</span>
          </button>

          <button
            onClick={() => setActiveCategory("soil")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeCategory === "soil"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-black border-[#EBEBEB] hover:border-black"
            }`}
          >
            <Sprout className="w-5 h-5 mb-2 text-emerald-500" />
            <span className="text-xs font-semibold block">{t("optSoil")}</span>
          </button>

          <button
            onClick={() => setActiveCategory("duration")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeCategory === "duration"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-black border-[#EBEBEB] hover:border-black"
            }`}
          >
            <Clock className="w-5 h-5 mb-2 text-amber-500" />
            <span className="text-xs font-semibold block">{t("optDuration")}</span>
          </button>

          <button
            onClick={() => setActiveCategory("pest")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeCategory === "pest"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-black border-[#EBEBEB] hover:border-black"
            }`}
          >
            <Bug className="w-5 h-5 mb-2 text-red-500" />
            <span className="text-xs font-semibold block">{t("optPest")}</span>
          </button>

          <button
            onClick={() => setActiveCategory("rain")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeCategory === "rain"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-black border-[#EBEBEB] hover:border-black"
            }`}
          >
            <CloudRain className="w-5 h-5 mb-2 text-cyan-500" />
            <span className="text-xs font-semibold block">{t("optRain")}</span>
          </button>

          <button
            onClick={() => setActiveCategory("temp")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeCategory === "temp"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-black border-[#EBEBEB] hover:border-black"
            }`}
          >
            <Thermometer className="w-5 h-5 mb-2 text-orange-500" />
            <span className="text-xs font-semibold block">{t("optTemp")}</span>
          </button>

          <button
            onClick={() => setActiveCategory("sun")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeCategory === "sun"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-black border-[#EBEBEB] hover:border-black"
            }`}
          >
            <Sun className="w-5 h-5 mb-2 text-yellow-500" />
            <span className="text-xs font-semibold block">{t("optSunlight")}</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          INTERACTIVE ADJUSTMENT CARD
          ================================================== */}
      <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 sm:p-8 shadow-sm mb-8">
        
        {/* WATER OPTION */}
        {activeCategory === "water" && (
          <div>
            <h3 className="text-lg font-semibold text-black mb-1">
              {t("waterScheduleChange")}
            </h3>
            <p className="text-xs text-[#6F6F6F] mb-6">
              {t("currentWatering")}: <strong className="text-black">{activePlot?.irrigationFrequency || "2 times/week"}</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: t("waterTimes1"), val: "1 time/week" },
                { label: t("waterTimes2"), val: "2 times/week" },
                { label: t("waterTimes3"), val: "3 times/week" },
                { label: t("waterDailyDrip"), val: "Daily Drip" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setIrrigation(opt.val)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    irrigation === opt.val
                      ? "border-black bg-neutral-900 text-white font-medium shadow-sm"
                      : "border-[#EBEBEB] bg-neutral-50 text-neutral-800 hover:border-black"
                  }`}
                >
                  <span className="text-sm block">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SOIL OPTION */}
        {activeCategory === "soil" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-1">
                {t("cardSoilStatus")}
              </h3>
              <p className="text-xs text-[#6F6F6F]">
                {t("soilNitrogenDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Nitrogen */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-black">{t("soilNitrogen")}</span>
                  <span className="text-sm font-bold text-black">{nitrogen} kg/ha</span>
                </div>
                <p className="text-[11px] text-[#6F6F6F] mb-3">{t("soilNitrogenDesc")}</p>
                <input
                  type="range"
                  min="140"
                  max="320"
                  step="10"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Phosphorus */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-black">{t("soilPhosphorus")}</span>
                  <span className="text-sm font-bold text-black">{phosphorus} kg/ha</span>
                </div>
                <p className="text-[11px] text-[#6F6F6F] mb-3">{t("soilPhosphorusDesc")}</p>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Potassium */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-black">{t("soilPotassium")}</span>
                  <span className="text-sm font-bold text-black">{potassium} kg/ha</span>
                </div>
                <p className="text-[11px] text-[#6F6F6F] mb-3">{t("soilPotassiumDesc")}</p>
                <input
                  type="range"
                  min="80"
                  max="240"
                  step="10"
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* CROP DURATION OPTION */}
        {activeCategory === "duration" && (
          <div>
            <h3 className="text-lg font-semibold text-black mb-1">
              {t("optDuration")}
            </h3>
            <p className="text-xs text-[#6F6F6F] mb-6">
              Sugarcane duration: <strong className="text-black">{duration} Months</strong> (Suru / Adsali)
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[10, 12, 14, 16].map((m) => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    duration === m
                      ? "border-black bg-neutral-900 text-white font-medium"
                      : "border-[#EBEBEB] bg-neutral-50 text-neutral-800 hover:border-black"
                  }`}
                >
                  <span className="text-base font-bold block">{m}</span>
                  <span className="text-xs text-[#888888]">{m === 16 ? "Adsali" : m === 12 ? "Suru" : "Pre-seasonal"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PEST CONTROL OPTION */}
        {activeCategory === "pest" && (
          <div>
            <h3 className="text-lg font-semibold text-black mb-1">
              {t("optPest")}
            </h3>
            <p className="text-xs text-[#6F6F6F] mb-6">
              Current practice: <strong className="text-black">{pestControl}</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { val: "Integrated", label: "Integrated (IPM)", desc: "Biological + Targeted minimal chemical" },
                { val: "Biological", label: "Biological Only", desc: "Trichogramma wasps + bio-agents" },
                { val: "Chemical", label: "Standard Chemical", desc: "Conventional spray schedule" },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setPestControl(p.val)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    pestControl === p.val
                      ? "border-black bg-neutral-900 text-white font-medium"
                      : "border-[#EBEBEB] bg-neutral-50 text-neutral-800 hover:border-black"
                  }`}
                >
                  <span className="text-sm font-semibold block mb-1">{p.label}</span>
                  <span className={`text-[11px] block ${pestControl === p.val ? "text-neutral-300" : "text-[#6F6F6F]"}`}>{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WEATHER OPTIONS */}
        {(activeCategory === "rain" || activeCategory === "temp" || activeCategory === "sun") && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-black">{t("optRain")}</span>
                <span className="text-sm font-bold text-black">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="700"
                max="1800"
                step="50"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-black cursor-pointer mt-3"
              />
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-black">{t("optTemp")}</span>
                <span className="text-sm font-bold text-black">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="20"
                max="40"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-black cursor-pointer mt-3"
              />
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-black">{t("optSunlight")}</span>
                <span className="text-sm font-bold text-black">{sunlight} hrs</span>
              </div>
              <input
                type="range"
                min="5"
                max="11"
                step="0.2"
                value={sunlight}
                onChange={(e) => setSunlight(Number(e.target.value))}
                className="w-full accent-black cursor-pointer mt-3"
              />
            </div>
          </div>
        )}

        {/* Run Action Button */}
        <div className="mt-8 flex items-center justify-end">
          <button
            onClick={runSimulation}
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? "..." : t("seeResult")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ==================================================
          WHAT-IF RESULT COMPARISON SCREEN
          ================================================== */}
      <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6F6F6F] mb-6">
          {t("whatIfTitle")} — {t("cardExpectedCrop")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          
          {/* Current Estimate */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
            <span className="text-[11px] font-semibold text-[#6F6F6F] uppercase block mb-1 font-mono">
              {t("currentEstimate")}
            </span>
            <div className="text-3xl font-bold text-black">
              {baseFmt.primary}
            </div>
            <span className="text-xs text-[#6F6F6F] mt-1 block">
              {baseFmt.secondary}
            </span>
          </div>

          {/* New Estimate */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block mb-1 font-mono">
              {t("newEstimate")}
            </span>
            <div className="text-3xl font-bold text-emerald-900">
              {simFmt.primary}
            </div>
            <span className="text-xs text-emerald-700 mt-1 block">
              {simFmt.secondary}
            </span>
          </div>

          {/* Change */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
            <span className="text-[11px] font-semibold text-[#6F6F6F] uppercase block mb-1 font-mono">
              {t("changeLabel")}
            </span>
            <div className={`text-3xl font-bold ${deltaQ >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
              {deltaQ >= 0 ? "+" : ""}{deltaFmt.primary}
            </div>
            <span className="text-xs text-neutral-600 mt-1 block font-medium">
              {deltaQ >= 0 ? t("higher") : t("lower")}
            </span>
          </div>

        </div>

        {/* Simple Explanation Note */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB] text-xs text-[#6F6F6F] leading-relaxed">
          <p className="font-medium text-black mb-1">
            📢 {t("modelEstimateNote")}
          </p>
          <p>
            {t("notAGuarantee")}
          </p>
        </div>

      </div>

    </div>
  );
};
