import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import { api } from "../services/api";
import { FarmerProfileModal } from "../components/FarmerProfileModal";
import {
  Sprout, TrendingUp, Droplets, AlertTriangle, ShieldCheck,
  ArrowRight, Sliders, CheckCircle2, ChevronRight, Layers,
  Calendar, Sun, Info, HelpCircle, User, Settings
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user, farmerProfile } = useAuth();
  const { farm, fields, selectedField, setSelectedField } = useFarm();
  const { t, formatYield, formatArea } = useI18n();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/default");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const farmerName = farmerProfile?.name || dashboardData?.farmer?.name || user?.name || "Ramesh Patil";
  const farmerInitials = farmerName
    ? farmerName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "FP";

  const locationLabel = farmerProfile?.village
    ? `${farmerProfile.village}, ${farmerProfile.district}, ${farmerProfile.state}`
    : dashboardData?.farmer?.village
    ? `${dashboardData.farmer.village}, ${dashboardData.farmer.taluka}, ${dashboardData.farmer.district}, ${dashboardData.farmer.state}`
    : t("farmerLocation");

  const cards = dashboardData?.farmerDashboardCards;
  const yieldFormatted = formatYield(cards?.expectedYield?.tonnesHa || 138.5, cards?.expectedYield?.quintalsAcre || 560.5);

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-7xl mx-auto">
      
      {/* Profile Modal */}
      <FarmerProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* Incomplete Profile Banner */}
      {farmerProfile && !farmerProfile.isProfileComplete && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 font-medium animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>Complete your farm profile to personalize sugar yield models and field parameters.</span>
          </div>
          <Link
            to="/profile/setup"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shrink-0 shadow-xs"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Editorial Farmer Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">{t("demoBadge")} • {locationLabel}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            {t("greetingMorning")}, {farmerName}
          </h1>
          <p className="text-base text-[#6F6F6F] mt-2">
            {t("howIsCropToday")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile Trigger Button */}
          <button
            onClick={() => setProfileOpen(true)}
            className="group flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white hover:bg-neutral-50 border border-[#E8E8E8] shadow-xs transition-all text-left"
            title="View & Edit Farmer Profile"
          >
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-serif text-sm font-bold shrink-0 group-hover:scale-105 transition-transform">
              {farmerInitials}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-black leading-tight flex items-center gap-1.5">
                <span>{farmerName.split(" ")[0]}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[10px] text-[#6F6F6F] leading-tight font-sans">
                {farmerProfile?.totalAreaAcres || 10.4} Ac • {farmerProfile?.sugarcaneVariety?.split(" ")[0] || "Co 86032"}
              </div>
            </div>
          </button>

          <Link
            to="/simulation"
            className="inline-flex items-center gap-2 bg-white border border-[#E8E8E8] text-black text-xs px-4.5 py-2.5 rounded-full font-medium hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#6F6F6F]" />
            <span className="hidden sm:inline">{t("navWhatIf")}</span>
          </Link>
          <Link
            to="/twin"
            className="inline-flex items-center gap-1.5 bg-black text-white text-xs px-5 py-2.5 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            {t("navOpenMyFarm")}
          </Link>
        </div>
      </div>

      {/* 5 Primary Simple Farmer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        
        {/* Card 1: How is My Crop? */}
        <Link to="/crop-health" className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm hover:border-black transition-all group">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-3">
            <span className="font-medium">{t("cardCropStatus")}</span>
            <Sprout className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-semibold text-black">
            {t("valGood")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-1.5 line-clamp-2">
            {t("stageGrandGrowth")}
          </p>
        </Link>

        {/* Card 2: Expected Crop */}
        <Link to="/predictions" className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm hover:border-black transition-all group">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-3">
            <span className="font-medium">{t("cardExpectedCrop")}</span>
            <TrendingUp className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-semibold text-black">
            {yieldFormatted.primary.split(" ")[0]} <span className="text-xs font-normal text-[#6F6F6F]">{yieldFormatted.unitLabel}</span>
          </div>
          <p className="text-xs text-[#6F6F6F] mt-1.5">
            {t("basedOnFarmInfo")}
          </p>
        </Link>

        {/* Card 3: Water */}
        <Link to="/water" className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm hover:border-black transition-all group">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-3">
            <span className="font-medium">{t("cardWaterStatus")}</span>
            <Droplets className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-semibold text-black">
            {t("valAdequate")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-1.5">
            32.6% • {t("waterTimes2")}
          </p>
        </Link>

        {/* Card 4: My Soil */}
        <Link to="/soil" className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm hover:border-black transition-all group">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-3">
            <span className="font-medium">{t("cardSoilStatus")}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          </div>
          <div className="text-2xl font-semibold text-black">
            {t("valGood")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-1.5">
            N: 225 • P: 76 • K: 148
          </p>
        </Link>

        {/* Card 5: Things to Check */}
        <Link to="/recommendations" className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm hover:border-black transition-all group">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-3">
            <span className="font-medium">{t("cardThingsToCheck")}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-semibold text-emerald-700">
            {t("valLowRisk")}
          </div>
          <p className="text-xs text-[#6F6F6F] mt-1.5">
            2 {t("cardThingsToCheck")}
          </p>
        </Link>

      </div>

      {/* ==================================================
          SECTION: WHAT SHOULD I DO? (Practical Farmer Checklist)
          ================================================== */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-black">
              {t("sectionWhatShouldIDo")}
            </h2>
            <p className="text-xs text-[#6F6F6F] mt-0.5">
              {t("whatShouldIDoSubtitle")}
            </p>
          </div>
          <Link to="/recommendations" className="text-xs font-medium text-black hover:underline flex items-center gap-1">
            {t("btnSeeMore")} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Action 1: Water */}
          <div className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-blue-700 mb-2">
                <Droplets className="w-4 h-4" />
                <span>{t("cardWaterStatus")}</span>
              </div>
              <h3 className="text-base font-semibold text-black mb-2">
                1. {t("actionWaterTitle")}
              </h3>
              <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
                <span className="font-semibold text-neutral-800">{t("actionWhyLabel")}</span> {t("actionWaterWhy")}
              </p>
            </div>
            <div className="pt-3 border-t border-[#F2F2F2] flex items-center justify-between text-xs">
              <span className="text-neutral-700 font-medium">👉 {t("actionWaterCheck")}</span>
              <Link to="/water" className="text-black font-semibold hover:underline shrink-0 ml-2">
                {t("btnCheck")} →
              </Link>
            </div>
          </div>

          {/* Action 2: Pests */}
          <div className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-700 mb-2">
                <span className="text-sm">🐛</span>
                <span>{t("factorPest")}</span>
              </div>
              <h3 className="text-base font-semibold text-black mb-2">
                2. {t("actionPestTitle")}
              </h3>
              <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
                <span className="font-semibold text-neutral-800">{t("actionWhyLabel")}</span> {t("actionPestWhy")}
              </p>
            </div>
            <div className="pt-3 border-t border-[#F2F2F2] flex items-center justify-between text-xs">
              <span className="text-neutral-700 font-medium">👉 {t("actionPestCheck")}</span>
              <Link to="/crop-health" className="text-black font-semibold hover:underline shrink-0 ml-2">
                {t("btnCheck")} →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION: YOUR SUGARCANE PLOTS
          ================================================== */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-black">
              {t("sectionFarmDetails")}
            </h2>
            <p className="text-xs text-[#6F6F6F] mt-0.5">
              Kasba Bawada, Kolhapur Sugar Belt (4 {t("plot")})
            </p>
          </div>
          <Link to="/twin" className="text-xs font-medium text-black hover:underline flex items-center gap-1">
            {t("navOpenMyFarm")} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(fields || []).map((plot) => {
            const plotYield = formatYield(plot.predictedYieldTonnesHa, plot.predictedYieldQAcre);
            const plotArea = formatArea(plot.areaHa, plot.areaAcres);

            return (
              <div key={plot._id} className="p-5 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm hover:border-black transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium text-neutral-500">{plot.code}</span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {plot.soilType}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-black line-clamp-1 mb-1">
                  {plot.name}
                </h3>
                <p className="text-xs text-[#6F6F6F] mb-4">
                  {plot.cropVariety} • {plotArea}
                </p>

                <div className="pt-3 border-t border-[#F2F2F2] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-[#6F6F6F] uppercase block">{t("cardExpectedCrop")}</span>
                    <span className="text-base font-semibold text-black">{plotYield.primary}</span>
                  </div>
                  <Link
                    to="/twin"
                    onClick={() => setSelectedField(plot)}
                    className="text-xs text-black font-medium hover:underline"
                  >
                    {t("btnCheck")} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
