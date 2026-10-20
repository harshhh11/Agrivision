import React, { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import { DigitalTwinMap } from "../components/DigitalTwinMap";
import { FieldDetailModal } from "../components/FieldDetailModal";
import { Field } from "../types";
import { HelpCircle, Edit3, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const DigitalTwinPage: React.FC = () => {
  const { farm, fields, selectedField, setSelectedField } = useFarm();
  const { t, formatYield, formatArea } = useI18n();
  const [activeInspectorField, setActiveInspectorField] = useState<Field | null>(null);

  const activeField = selectedField || fields[0] || null;
  const yieldFormatted = activeField
    ? formatYield(
        activeField.predictedYieldTonnesHa || activeField.predictedYield || 139.6,
        activeField.predictedYieldQAcre || 565.0
      )
    : { primary: "139.6 tonnes/ha", secondary: "(565 quintals/acre)", unitLabel: "tonnes/ha" };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F8F9FA] text-black font-sans px-4 sm:px-6 lg:px-8 py-5 flex flex-col">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6F6F6F] mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-neutral-700">{t("demoBadge")}</span>
            <span>•</span>
            <span>{farm?.totalAreaHa || 12.5} {t("hectares")} ({farm?.village || "Shirol, Kolhapur"})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
            {t("navMyFarm")}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/simulation"
            className="inline-flex items-center gap-1.5 bg-white border border-[#E5E5E5] text-neutral-800 text-xs px-4 py-2 rounded-full font-medium hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
            <span>{t("navWhatIf")}</span>
          </Link>

          <Link
            to="/recommendations"
            className="inline-flex items-center gap-1.5 bg-black text-white text-xs px-4 py-2 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>{t("navWhatShouldIDo")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main 2-Column Application Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-5 items-start">
        
        {/* ==================================================
            LEFT COLUMN: Agricultural Satellite Map
            ================================================== */}
        <div className="w-full h-[460px] sm:h-[520px] lg:h-[calc(100vh-160px)] min-h-[460px] lg:min-h-[580px]">
          <DigitalTwinMap
            fields={fields}
            selectedField={selectedField}
            onSelectField={(f) => {
              setSelectedField(f);
            }}
            showLayerSelector={true}
          />
        </div>

        {/* ==================================================
            RIGHT COLUMN: Farm & Field Details Panel
            ================================================== */}
        <div className="w-full lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto bg-white border border-[#E5E5E5] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6F6F6F] block">
                  {t("demoBadge")}
                </span>
                <h2 className="text-base font-bold text-neutral-950">
                  {activeField ? activeField.name : t("navMyFarm")}
                </h2>
              </div>
              <span className="text-xs font-mono bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full font-semibold">
                {activeField?.code || "FLD-01"}
              </span>
            </div>

            {activeField ? (
              <>
                {/* Field Overview Specs */}
                <div className="flex items-center justify-between text-xs text-[#555555] bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200/70">
                  <div>
                    <span className="text-[10px] text-[#888888] uppercase block">{t("sugarcaneCrop")}</span>
                    <span className="font-semibold text-neutral-900">{activeField.cropVariety || "Co 86032"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#888888] uppercase block">{t("hectares")}</span>
                    <span className="font-semibold text-neutral-900">{formatArea(activeField.areaHa, activeField.areaAcres)}</span>
                  </div>
                </div>

                {/* Expected Crop Card (Yield Result with Unit Toggle Support) */}
                <div className="p-4 rounded-2xl bg-neutral-900 text-white shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-mono font-medium tracking-wider text-neutral-400 uppercase block mb-1">
                      {t("cardExpectedCrop")}
                    </span>
                    <div className="text-3xl font-extrabold text-white tracking-tight">
                      {yieldFormatted.primary}
                    </div>
                    <span className="text-xs text-neutral-400 mt-1 block">
                      {yieldFormatted.secondary}
                    </span>
                  </div>
                </div>

                {/* Detailed Status Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {/* Crop Growth */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                    <span className="text-[10px] font-medium text-[#777777] uppercase block">{t("cropGrowth")}</span>
                    <span className="font-semibold text-neutral-900 mt-0.5 block truncate">
                      {activeField.cropStage || "Grand Growth"}
                    </span>
                  </div>

                  {/* Water Condition */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                    <span className="text-[10px] font-medium text-[#777777] uppercase block">{t("cardWaterStatus")}</span>
                    <span className="font-semibold text-neutral-900 mt-0.5 block truncate">
                      {activeField.irrigationFrequency || "3 times/week"}
                    </span>
                  </div>

                  {/* Soil Type */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                    <span className="text-[10px] font-medium text-[#777777] uppercase block">{t("cardSoilStatus")}</span>
                    <span className="font-semibold text-neutral-900 mt-0.5 block truncate">
                      {activeField.soilType || "Black Soil"}
                    </span>
                  </div>

                  {/* Risk / Health Condition */}
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#EBEBEB]">
                    <span className="text-[10px] font-medium text-[#777777] uppercase block">{t("cardThingsToCheck")}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {activeField.riskLevel === "Moderate" || activeField.riskLevel === "High" ? (
                        <>
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="font-semibold text-amber-700 truncate">{t("valNeedsAttention")}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-700 truncate">{t("valGood")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Environmental Microclimate (Telemetry) */}
                <div className="p-3 rounded-xl bg-neutral-50/80 border border-[#EBEBEB] text-xs">
                  <span className="text-[10px] font-mono text-[#888888] uppercase block mb-1">
                    {t("sunlightWeather")}
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-neutral-200/60">
                    <div>
                      <span className="text-[10px] text-[#666666] block">Rain</span>
                      <span className="font-mono font-semibold text-neutral-900">{activeField.rainfallMm || 1280} mm</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666666] block">Temp</span>
                      <span className="font-mono font-semibold text-neutral-900">{activeField.temperatureC || 29.5}°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666666] block">Sun</span>
                      <span className="font-mono font-semibold text-neutral-900">{activeField.dailySunlightHours || 8.4}h</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-xs text-[#6F6F6F]">
                Click any sugarcane plot on the map to inspect details.
              </div>
            )}
          </div>

          {/* Action Button: Change Farm Information */}
          {activeField && (
            <div className="pt-3 border-t border-[#EBEBEB]">
              <button
                onClick={() => setActiveInspectorField(activeField)}
                className="w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-semibold py-3 px-4 rounded-full hover:bg-neutral-800 transition-colors shadow-sm active:scale-[0.99]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t("changeFarmInfoBtn")}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Modal for Changing Farm Information & Recalculating */}
      {activeInspectorField && (
        <FieldDetailModal
          field={activeInspectorField}
          onClose={() => setActiveInspectorField(null)}
        />
      )}

    </div>
  );
};
