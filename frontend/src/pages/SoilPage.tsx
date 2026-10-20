import React from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import { Sprout, HelpCircle, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export const SoilPage: React.FC = () => {
  const { fields, selectedField } = useFarm();
  const { t } = useI18n();
  const activePlot = selectedField || fields[0] || null;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{t("demoBadge")} • {activePlot?.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            {t("mySoilTitle")}
          </h1>
          <p className="text-base text-[#6F6F6F] mt-2">
            {t("mySoilSubtitle")}
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

      {/* 4 Core Soil Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        
        {/* Soil Type */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("cardSoilStatus")}</span>
          <div className="text-2xl font-bold text-black">
            {activePlot?.soilType || "Black Soil"}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2">
            Rich black soil with high water and nutrient holding capacity.
          </p>
        </div>

        {/* Nitrogen */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("soilNitrogen")}</span>
          <div className="text-3xl font-bold text-emerald-700">
            {activePlot?.nitrogen || 240} <span className="text-xs font-normal text-[#6F6F6F]">kg/ha</span>
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2">
            {t("soilNitrogenDesc")}
          </p>
        </div>

        {/* Phosphorus */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("soilPhosphorus")}</span>
          <div className="text-3xl font-bold text-black">
            {activePlot?.phosphorus || 80} <span className="text-xs font-normal text-[#6F6F6F]">kg/ha</span>
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2">
            {t("soilPhosphorusDesc")}
          </p>
        </div>

        {/* Potassium */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("soilPotassium")}</span>
          <div className="text-3xl font-bold text-black">
            {activePlot?.potassium || 160} <span className="text-xs font-normal text-[#6F6F6F]">kg/ha</span>
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2">
            {t("soilPotassiumDesc")}
          </p>
        </div>

      </div>

      {/* Practical Advice */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-3">
          💡 {t("actionSoilTitle")}
        </h2>
        <p className="text-xs text-[#6F6F6F] leading-relaxed mb-4">
          {t("actionSoilWhy")}
        </p>
        <div className="pt-4 border-t border-[#F2F2F2] flex items-center justify-between">
          <span className="text-xs text-[#6F6F6F]">
            Want to see how changing soil nutrients changes your expected crop?
          </span>
          <Link to="/simulation" className="text-xs font-semibold text-black hover:underline">
            {t("navWhatIf")} →
          </Link>
        </div>
      </div>

    </div>
  );
};
