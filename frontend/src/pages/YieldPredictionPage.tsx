import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import {
  TrendingUp, CheckCircle2, AlertCircle, Info,
  HelpCircle, ArrowRight, Sprout, Droplets, Sun, Bug
} from "lucide-react";
import { Link } from "react-router-dom";

export const YieldPredictionPage: React.FC = () => {
  const { fields, selectedField, setSelectedField } = useFarm();
  const { t, formatYield } = useI18n();

  const activePlot = selectedField || fields[0] || null;

  const yieldTonnes = activePlot?.predictedYieldTonnesHa || activePlot?.predictedYield || 138.5;
  const yieldQAcre = activePlot?.predictedYieldQAcre || Number((yieldTonnes / 0.247105).toFixed(1));
  const yFmt = formatYield(yieldTonnes, yieldQAcre);

  const factorItems = [
    { name: t("factorRain"), value: `${activePlot?.rainfallMm || 1280} mm`, status: t("valGood"), isGood: true, note: "Rain is suitable for sugarcane growth." },
    { name: t("factorWater"), value: activePlot?.irrigationFrequency || "2 times/week", status: t("valGood"), isGood: true, note: "Regular watering keeps roots active." },
    { name: t("factorSoil"), value: `${activePlot?.soilType || "Black Soil"} (N: ${activePlot?.nitrogen || 240})`, status: t("valGood"), isGood: true, note: "Good soil nutrients for stem formation." },
    { name: t("factorTemp"), value: `${activePlot?.temperatureC || 29.5}°C`, status: t("valGood"), isGood: true, note: "Warm weather supports fast elongation." },
    { name: t("factorPest"), value: activePlot?.pestControl || "Integrated", status: t("valCheck"), isGood: false, note: "Inspect lower stalks for borer activity." },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{t("demoBadge")} • {activePlot?.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            {t("expectedCropTitle")}
          </h1>
          <p className="text-base text-[#6F6F6F] mt-2">
            {t("expectedCropSubtitle")}
          </p>
        </div>

        <Link
          to="/simulation"
          className="inline-flex items-center gap-2 bg-black text-white text-xs px-5 py-2.5 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-sm shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {t("navWhatIf")}
        </Link>
      </div>

      {/* Primary Expected Crop Card */}
      <div className="bg-white p-8 rounded-3xl border border-[#EBEBEB] shadow-sm mb-10">
        <span className="text-xs font-semibold text-[#6F6F6F] uppercase block mb-1">
          {activePlot ? activePlot.name : "Plot 1"}
        </span>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 my-4">
          <div className="text-5xl sm:text-6xl font-extrabold text-black">
            {yFmt.primary.split(" ")[0]}
          </div>
          <div className="text-xl font-medium text-[#6F6F6F]">
            {yFmt.unitLabel}
          </div>
          <div className="text-sm text-[#888888] sm:ml-4">
            {yFmt.secondary}
          </div>
        </div>

        <p className="text-sm text-[#6F6F6F] mt-2">
          🌾 {t("basedOnFarmInfo")} ({activePlot?.cropVariety || "Co 86032"})
        </p>

        <div className="mt-6 pt-4 border-t border-[#F2F2F2] text-xs text-[#6F6F6F]">
          <p className="font-medium text-neutral-800">
            ⚠️ {t("notAGuarantee")}
          </p>
        </div>
      </div>

      {/* ==================================================
          WHY IS THIS ESTIMATE CHANGING? (Simple Factors)
          ================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm mb-10">
        <h2 className="text-xl font-semibold text-black mb-1">
          {t("whyEstimateChanging")}
        </h2>
        <p className="text-xs text-[#6F6F6F] mb-6">
          Here is what is helping your crop grow or what needs checking:
        </p>

        <div className="space-y-3">
          {factorItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-black">{item.name}</span>
                  <span className="text-xs text-[#6F6F6F] font-mono">({item.value})</span>
                </div>
                <p className="text-xs text-[#6F6F6F]">{item.note}</p>
              </div>

              <div className="shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.isGood ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to What-If */}
        <div className="mt-6 pt-4 border-t border-[#F2F2F2] flex items-center justify-between">
          <span className="text-xs text-[#6F6F6F]">
            Want to see how changing these values changes your crop?
          </span>
          <Link
            to="/simulation"
            className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
          >
            {t("navWhatIf")} →
          </Link>
        </div>
      </div>

    </div>
  );
};
