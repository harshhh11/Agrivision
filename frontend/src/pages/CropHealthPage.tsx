import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import {
  Sprout, Droplets, Sun, Info, CheckCircle2,
  Calendar, Layers, Clock, TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid
} from "recharts";

const healthTrendData = [
  { date: "01 Sep", value: 72, label: "Good" },
  { date: "05 Sep", value: 75, label: "Good" },
  { date: "10 Sep", value: 78, label: "Good" },
  { date: "15 Sep", value: 81, label: "Healthy" },
  { date: "18 Sep", value: 83, label: "Healthy" },
  { date: "22 Sep", value: 84, label: "Healthy" },
];

export const CropHealthPage: React.FC = () => {
  const { fields, selectedField, setSelectedField } = useFarm();
  const { t, formatArea, translateFrequency } = useI18n();
  const activePlot = selectedField || fields[0] || null;

  const stages = [
    { name: t("stageGermination"), active: false, done: true },
    { name: t("stageTillering"), active: false, done: true },
    { name: t("stageGrandGrowth"), active: true, done: false },
    { name: t("stageRipening"), active: false, done: false },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-7xl mx-auto">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{t("demoBadge")} • {activePlot?.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            {t("myCropTitle")}
          </h1>
          <p className="text-base text-[#6F6F6F] mt-2">
            {t("myCropSubtitle")}
          </p>
        </div>

        {/* Plot Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {(fields || []).map((plot) => (
            <button
              key={plot._id}
              onClick={() => setSelectedField(plot)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activePlot?._id === plot._id
                  ? "bg-black text-white shadow-xs"
                  : "bg-white text-[#6F6F6F] border border-[#EBEBEB] hover:border-black"
              }`}
            >
              {plot.code}: {plot.cropVariety.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Farmer Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        
        {/* Card 1: Crop Greenness */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("cropGreenness")}</span>
          <div className="text-3xl font-bold text-emerald-700">
            {t("valGood")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2 leading-relaxed">
            {t("cropGreennessDesc")}
          </p>
          <span className="text-[11px] text-neutral-400 font-mono mt-3 block">
            NDVI: 0.84 • {t("demoBadge")}
          </span>
        </div>

        {/* Card 2: Crop Growth Stage */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("cropGrowth")}</span>
          <div className="text-2xl font-bold text-black">
            {t("stageGrandGrowth").split("(")[0]}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2 leading-relaxed">
            {activePlot?.cropDurationMonths || 14} {t("optDuration")} ({activePlot?.cropVariety})
          </p>
          <span className="text-[11px] text-neutral-400 mt-3 block">
            {t("stageGrowthDesc")}
          </span>
        </div>

        {/* Card 3: Water Condition */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("waterCondition")}</span>
          <div className="text-3xl font-bold text-blue-700">
            {t("valAdequate")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2 leading-relaxed">
            35.2% {t("rootZoneMoisture")} ({translateFrequency(activePlot?.irrigationFrequency || "2 times/week")})
          </p>
          <span className="text-[11px] text-neutral-400 mt-3 block">
            {t("rootMoistureSufficient")}
          </span>
        </div>

        {/* Card 4: Weather & Sunlight */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("sunlightWeather")}</span>
          <div className="text-2xl font-bold text-black">
            29.5°C • 8.4 hrs
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2 leading-relaxed">
            {t("optimalSunshine")}
          </p>
          <span className="text-[11px] text-neutral-400 mt-3 block">
            {t("agroClimaticZone")}
          </span>
        </div>

      </div>

      {/* ==================================================
          CROP GROWTH STAGE TIMELINE
          ================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-black mb-1">
          {t("cropStage")}
        </h2>
        <p className="text-xs text-[#6F6F6F] mb-6">
          {t("caneActiveStalkStage")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {stages.map((st, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                st.active
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : st.done
                  ? "bg-neutral-50 border-[#EBEBEB] text-[#6F6F6F]"
                  : "bg-white border-[#EBEBEB] text-[#9E9E9E]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">{idx + 1}</span>
                {st.done && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {st.active && <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />}
              </div>
              <div className="text-sm font-semibold">{st.name}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
