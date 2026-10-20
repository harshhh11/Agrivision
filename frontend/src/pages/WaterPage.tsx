import React from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import { Droplets, Calendar, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const WaterPage: React.FC = () => {
  const { fields, selectedField, setSelectedField } = useFarm();
  const { t } = useI18n();
  const activePlot = selectedField || fields[0] || null;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>{t("demoBadge")} • {activePlot?.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            {t("cardWaterStatus")}
          </h1>
          <p className="text-base text-[#6F6F6F] mt-2">
            {t("waterSubtitle") || "Check your watering rounds and soil moisture."}
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

      {/* 3 Core Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("waterCondition")}</span>
          <div className="text-3xl font-bold text-blue-700">
            {t("valAdequate")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2">
            Average root-zone moisture: <strong className="text-black">35.2%</strong>
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("factorWater")}</span>
          <div className="text-3xl font-bold text-black">
            {t("waterTimes2")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2">
            Drip / Furrow irrigation
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm">
          <span className="text-xs font-semibold text-[#6F6F6F] block mb-2">{t("factorRain")}</span>
          <div className="text-3xl font-bold text-black">
            {activePlot?.rainfallMm || 1280} mm
          </div>
          <p className="text-xs text-[#6F6F6F] mt-2">
            Seasonal monsoon rainfall
          </p>
        </div>

      </div>

      {/* Practical Water Advice Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBEBEB] shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-3">
          💡 {t("actionWaterTitle")}
        </h2>
        <p className="text-xs text-[#6F6F6F] leading-relaxed mb-4">
          Sugarcane is in the active stalk elongation stage and requires steady water. Watering 2 to 3 times a week via drip or furrow ensures deep root penetration without waterlogging.
        </p>
        <div className="pt-4 border-t border-[#F2F2F2] flex items-center justify-between">
          <span className="text-xs text-[#6F6F6F]">
            Try changing your water frequency in What-If:
          </span>
          <Link to="/simulation" className="text-xs font-semibold text-black hover:underline">
            {t("navWhatIf")} →
          </Link>
        </div>
      </div>

    </div>
  );
};
