import React from "react";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import {
  Droplets, Sprout, Bug, TrendingUp, CheckCircle2,
  ArrowRight, HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export const RecommendationsPage: React.FC = () => {
  const { fields, selectedField } = useFarm();
  const { t, formatYield } = useI18n();

  const activePlot = selectedField || fields[0] || null;
  const currentYield = activePlot?.predictedYieldTonnesHa || activePlot?.predictedYield || 138.5;
  const yFmt = formatYield(currentYield);

  const actions = [
    {
      id: "water",
      icon: Droplets,
      iconColor: "text-blue-600 bg-blue-50",
      category: t("cardWaterStatus"),
      title: t("actionWaterTitle"),
      why: t("actionWaterWhy"),
      whatToCheck: t("actionWaterCheck"),
      link: "/water",
      linkText: "Water status"
    },
    {
      id: "soil",
      icon: Sprout,
      iconColor: "text-emerald-600 bg-emerald-50",
      category: t("cardSoilStatus"),
      title: t("actionSoilTitle"),
      why: t("actionSoilWhy"),
      whatToCheck: t("actionSoilCheck"),
      link: "/soil",
      linkText: "Soil details"
    },
    {
      id: "pest",
      icon: Bug,
      iconColor: "text-amber-600 bg-amber-50",
      category: t("factorPest"),
      title: t("actionPestTitle"),
      why: t("actionPestWhy"),
      whatToCheck: t("actionPestCheck"),
      link: "/crop-health",
      linkText: "Crop condition"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t("demoBadge")} • {activePlot?.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            {t("whatShouldIDoTitle")}
          </h1>
          <p className="text-base text-[#6F6F6F] mt-2">
            {t("whatShouldIDoSubtitle")}
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

      {/* Action Cards List */}
      <div className="space-y-4 mb-10">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBEBEB] shadow-sm hover:border-black transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${act.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6F6F]">
                    {act.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
              </div>

              <h2 className="text-xl font-bold text-black mb-4">
                {act.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#F2F2F2]">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
                  <span className="text-[11px] font-bold text-neutral-900 block mb-1">
                    ❓ {t("actionWhyLabel")}
                  </span>
                  <p className="text-xs text-[#6F6F6F] leading-relaxed">
                    {act.why}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-[#EBEBEB]">
                  <span className="text-[11px] font-bold text-neutral-900 block mb-1">
                    🔍 {t("actionCheckLabel")}
                  </span>
                  <p className="text-xs text-[#6F6F6F] leading-relaxed">
                    {act.whatToCheck}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-end">
                <Link
                  to={act.link}
                  className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
                >
                  {t("btnCheck")} {act.linkText} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
