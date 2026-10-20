import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFarm } from "../context/FarmContext";
import { useAuth } from "../context/AuthContext";
import { useI18n, languageList } from "../i18n";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { ArrowRight, Globe, ChevronDown, User } from "lucide-react";

export const LandingPage: React.FC = () => {
  const { fields, selectedField } = useFarm();
  const { farmerProfile } = useAuth();
  const { formatYield, language, setLanguage, unit, setUnit, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const activeField = selectedField || fields[0];
  const formattedYield = activeField
    ? formatYield(activeField.predictedYieldTonnesHa || 139.6, activeField.predictedYieldQAcre || 565)
    : { primary: "139.6 tonnes/ha", secondary: "(565 quintals/acre)" };

  // 5 Clean Core Links matching MotionSites/Aethera specification
  const navLinks = [
    { name: "Overview", path: "/", isActive: true },
    { name: "Insights", path: "/crop-health", isActive: false },
    { name: "Predictions", path: "/predictions", isActive: false },
    { name: "Simulation", path: "/simulation", isActive: false },
    { name: "History", path: "/history", isActive: false },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FFFFFF] text-black font-sans selection:bg-black selection:text-white flex flex-col justify-between">
      
      {/* ==================================================
          CINEMATIC SEAMLESS BACKGROUND VIDEO (Z-0)
          Zero harsh lines: Positioned smoothly below navbar (top: 80px)
          fading upwards into the white space
          ================================================== */}
      <div 
        className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none z-0"
        style={{ top: "80px" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-bottom"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        />
        {/* Seamless multi-stop gradient mask blending the white top into the cinematic visual */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/30 via-20% to-[#FFFFFF]/15 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#FFFFFF] to-transparent pointer-events-none" />
      </div>


      {/* ==================================================
          SEAMLESS FLOATING NAVBAR (Z-20) - NO HARSH BORDER LINE
          ================================================== */}
      <header className="relative z-20 w-full bg-transparent text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between gap-6">
          
          {/* Logo: AgriVision (Instrument Serif, text-3xl, tracking-tight, #000000) */}
          <Link to="/" className="group flex items-center shrink-0">
            <span className="font-serif text-3xl sm:text-[32px] font-normal tracking-tight text-[#000000] leading-none">
              AgriVision
            </span>
          </Link>

          {/* Center Navigation Links (Small, spacious, gray inactive links) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors duration-150 ${
                  item.isActive
                    ? "text-[#000000] font-medium"
                    : "text-[#6F6F6F] hover:text-[#000000]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Controls: Unit Toggle + Language + Black Pill CTA */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Unit Toggle */}
            <div className="hidden sm:flex items-center bg-white/85 backdrop-blur-md rounded-full p-0.5 border border-black/10 text-[11px] font-medium shadow-xs">
              <button
                onClick={() => setUnit("tonnes_ha")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  unit === "tonnes_ha" ? "bg-black text-white shadow-xs font-semibold" : "text-[#6F6F6F]"
                }`}
              >
                t/ha
              </button>
              <button
                onClick={() => setUnit("quintals_acre")}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  unit === "quintals_acre" ? "bg-black text-white shadow-xs font-semibold" : "text-[#6F6F6F]"
                }`}
              >
                Q/acre
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="h-9 px-3 rounded-full bg-white/85 backdrop-blur-md border border-black/10 text-[12px] text-[#6F6F6F] hover:text-[#111111] flex items-center gap-1.5 shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#888888]" />
                <span className="font-medium uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-[#888888]" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 max-h-72 overflow-y-auto bg-white rounded-2xl shadow-xl border border-black/10 py-1.5 z-50 animate-fade-in text-xs divide-y divide-neutral-100">
                  {languageList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center justify-between ${
                        language === lang.code ? "font-bold text-black bg-neutral-50" : "text-neutral-600"
                      }`}
                    >
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login / Profile Dropdown */}
            <ProfileDropdown />

            {/* Primary CTA: Explore Demo Farm / Open Farm */}
            <Link
              to="/farm"
              className="rounded-full px-5 py-2 text-xs sm:text-sm font-medium bg-[#000000] text-[#FFFFFF] transition-transform duration-200 hover:scale-[1.03] active:scale-95 shadow-sm whitespace-nowrap"
            >
              {farmerProfile?.isProfileComplete ? "My Farm" : t("exploreDemoFarm")}
            </Link>
          </div>

        </div>
      </header>


      {/* ==================================================
          EDITORIAL HERO SECTION (Z-10)
          ================================================== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-between text-center px-6 pt-6 sm:pt-10 pb-8 max-w-7xl mx-auto w-full">
        
        {/* Main Headline & Supporting Paragraph */}
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
          
          {/* Headline: Instrument Serif, text-7xl/md:text-8xl, tight line-height, -2.46px tracking */}
          <h1 
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-normal text-[#000000] animate-fade-rise select-none"
            style={{ 
              lineHeight: 0.95, 
              letterSpacing: "-2.46px" 
            }}
          >
            See your <span className="font-serif italic text-[#6F6F6F]">farm,</span>
            <br />
            before the future <span className="font-serif italic text-[#6F6F6F]">arrives.</span>
          </h1>

          {/* Supporting Text: Inter font, text-base sm:text-lg, max-w-2xl, leading-relaxed */}
          <p className="text-base sm:text-lg max-w-2xl mt-7 leading-relaxed text-[#6F6F6F] font-sans font-normal animate-fade-rise-delay">
            AgriVision transforms your real farm with precision agricultural intelligence — combining soil, weather, satellite and field data to predict yield, identify risks, simulate decisions and recommend what to do next.
          </p>

          {/* Hero CTA Button: "Explore Your Farm" */}
          <div className="mt-9 animate-fade-rise-delay-2 flex items-center justify-center gap-3">
            <Link
              to="/farm"
              className="inline-flex items-center justify-center rounded-full px-12 py-4 sm:px-14 sm:py-4.5 text-base font-sans font-medium bg-[#000000] text-[#FFFFFF] transition-transform duration-200 hover:scale-[1.03] active:scale-95 shadow-lg"
            >
              Explore Your Farm
            </Link>
          </div>
        </div>


        {/* ==================================================
            BOTTOM 4 TELEMETRY GLASSMORPHIC CARDS (Z-10)
            Living Farm data overlays on the landscape
            ================================================== */}
        <div className="w-full pt-16 sm:pt-20">
          
          {/* Top HUD Badges over landscape */}
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-wide text-[11px]">FIELD OVERLAY: ACTIVE FARM</span>
            </div>

            <div className="bg-black/60 backdrop-blur-md text-white/90 px-3.5 py-1.5 rounded-full border border-white/20 shadow-md text-[11px] hidden sm:flex items-center gap-1.5">
              <span>16.7820° N, 74.5240° E • ELV 550m</span>
            </div>
          </div>

          {/* 4 Bottom Glassmorphic Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
            
            {/* Card 1: Soil Moisture */}
            <Link
              to="/soil"
              className="bg-black/75 hover:bg-black/85 transition-all backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 text-white shadow-2xl group block"
            >
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                SOIL MOISTURE
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                32.4%
              </div>
              <span className="text-xs text-emerald-400 font-medium mt-1 block">
                Optimal Field Cap.
              </span>
            </Link>

            {/* Card 2: Sentinel NDVI */}
            <Link
              to="/crop-health"
              className="bg-black/75 hover:bg-black/85 transition-all backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 text-white shadow-2xl group block"
            >
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                SENTINEL NDVI
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                0.84
              </div>
              <span className="text-xs text-emerald-400 font-medium mt-1 block">
                High Biomass
              </span>
            </Link>

            {/* Card 3: Forecasted Yield */}
            <Link
              to="/predictions"
              className="bg-black/75 hover:bg-black/85 transition-all backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 text-white shadow-2xl group block"
            >
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                FORECASTED YIELD
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white truncate">
                {formattedYield.primary}
              </div>
              <span className="text-xs text-neutral-300 font-mono mt-1 block">
                ±0.4 t/ha (95% Conf.)
              </span>
            </Link>

            {/* Card 4: Agro-Risk Level */}
            <Link
              to="/water"
              className="bg-black/75 hover:bg-black/85 transition-all backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 text-white shadow-2xl group block"
            >
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                AGRO-RISK LEVEL
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-emerald-400">
                Low
              </div>
              <span className="text-xs text-neutral-300 mt-1 block">
                Rain in 18 Hours
              </span>
            </Link>

          </div>
        </div>

      </main>

    </div>
  );
};
