import React from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import {
  Calendar, Clock, CheckCircle2, Droplets,
  TrendingUp, HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export const HistoryPage: React.FC = () => {
  const { farm, fields } = useFarm();
  const { t, formatYield } = useI18n();

  const records = [
    {
      date: "22 Sep",
      title: "Crop Estimate Updated",
      expectedCropQ: 560.5,
      expectedCropT: 138.5,
      note: "Sugarcane is growing well with adequate water and sunlight."
    },
    {
      date: "18 Sep",
      title: "Watering Recorded",
      expectedCropQ: 555.0,
      expectedCropT: 137.1,
      note: "Plot 1 and Plot 3 watered via drip irrigation."
    },
    {
      date: "10 Sep",
      title: "Soil Nutrients Checked",
      expectedCropQ: 548.0,
      expectedCropT: 135.4,
      note: "Nitrogen top-dressing applied to support stalk growth."
    },
    {
      date: "01 Sep",
      title: "Season Baseline Estimate",
      expectedCropQ: 535.0,
      expectedCropT: 132.2,
      note: "Initial crop estimate at start of month."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{t("demoRecordsNotice")}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            {t("pastRecordsTitle")}
          </h1>
          <p className="text-base text-[#6F6F6F] mt-2">
            {t("pastRecordsSubtitle")}
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

      {/* Simple Timeline Cards */}
      <div className="space-y-4 mb-10">
        {records.map((rec, idx) => {
          const yFmt = formatYield(rec.expectedCropT, rec.expectedCropQ);
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-neutral-100 text-black text-xs font-bold font-mono text-center shrink-0 w-16">
                  {rec.date}
                </div>
                <div>
                  <h3 className="text-base font-bold text-black mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-[#6F6F6F]">
                    {rec.note}
                  </p>
                </div>
              </div>

              <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#F2F2F2]">
                <span className="text-[10px] text-[#6F6F6F] uppercase block">{t("cardExpectedCrop")}</span>
                <span className="text-xl font-bold text-black">{yFmt.primary}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
