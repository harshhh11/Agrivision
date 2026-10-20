import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n, Language } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { ProfileDropdown } from "./ProfileDropdown";
import { Globe, ChevronDown, Menu, X, User } from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, unit, setUnit, t } = useI18n();
  const { farmerProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  // Clean, farmer-first navigation links
  const navLinks = [
    {
      name: t("navMyFarm"),
      path: "/farm",
      isActive: location.pathname === "/dashboard" || location.pathname === "/farm" || location.pathname === "/twin"
    },
    {
      name: t("navMyCrop"),
      path: "/crop-health",
      isActive: location.pathname === "/crop-health" || location.pathname === "/water" || location.pathname === "/soil" || location.pathname === "/insights"
    },
    {
      name: t("navWhatShouldIDo"),
      path: "/recommendations",
      isActive: location.pathname === "/recommendations"
    },
    {
      name: t("navPastRecords"),
      path: "/history",
      isActive: location.pathname === "/history"
    }
  ];

  const languageLabels: Record<Language, string> = {
    en: "English",
    hi: "हिंदी",
    mr: "मराठी"
  };

  return (
    <header className="sticky top-0 z-[1000] w-full bg-white/95 backdrop-blur-md border-b border-black/[0.06] transition-all">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-8">
        
        {/* ==================================================
            LEFT: AgriVision Logo (Editorial Serif)
            ================================================== */}
        <Link 
          to="/" 
          className="group flex items-center shrink-0 transition-opacity hover:opacity-85"
        >
          <span className="font-serif text-[28px] sm:text-[30px] font-normal tracking-[-0.03em] text-[#111111] leading-none">
            AgriVision
          </span>
        </Link>

        {/* ==================================================
            CENTER: Farmer-First Navigation (Inter / Devanagari)
            ================================================== */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-[14px] xl:text-[15px] py-1 transition-colors duration-200 whitespace-nowrap ${
                item.isActive
                  ? "text-[#111111] font-medium"
                  : "text-[#6F6F6F] font-normal hover:text-[#111111]"
              }`}
            >
              {item.name}
              {item.isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#111111] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* ==================================================
            RIGHT: Language Selector + Open My Farm CTA
            ================================================== */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          
          {/* Unit Toggle (Compact) */}
          <div className="flex items-center bg-[#F2F2F2] rounded-full p-0.5 border border-[#E5E5E5] text-[11px] font-medium">
            <button
              onClick={() => setUnit("quintals_acre")}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                unit === "quintals_acre"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-[#6F6F6F] hover:text-black"
              }`}
              title="Quintals/acre"
            >
              Q/acre
            </button>
            <button
              onClick={() => setUnit("tonnes_ha")}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                unit === "tonnes_ha"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-[#6F6F6F] hover:text-black"
              }`}
              title="Tonnes/ha"
            >
              t/ha
            </button>
          </div>

          {/* Minimal Language Selector Pill */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="h-10 px-3.5 rounded-full bg-white border border-[#E8E8E8] hover:border-[#D1D1D1] text-[13px] text-[#6F6F6F] hover:text-[#111111] flex items-center gap-1.5 transition-all shadow-xs"
              aria-expanded={langDropdownOpen}
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#888888]" strokeWidth={1.5} />
              <span className="font-medium tracking-tight">
                {languageLabels[language]}
              </span>
              <ChevronDown className="w-3 h-3 text-[#9E9E9E]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-[#E8E8E8] py-1.5 z-50 animate-fade-in">
                <button
                  onClick={() => { setLanguage("en"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[13px] transition-colors hover:bg-neutral-50 flex items-center justify-between ${
                    language === "en" ? "font-medium text-[#111111]" : "text-[#6F6F6F]"
                  }`}
                >
                  <span>English</span>
                  {language === "en" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </button>
                <button
                  onClick={() => { setLanguage("hi"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[13px] transition-colors hover:bg-neutral-50 flex items-center justify-between ${
                    language === "hi" ? "font-medium text-[#111111]" : "text-[#6F6F6F]"
                  }`}
                >
                  <span>हिंदी</span>
                  {language === "hi" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </button>
                <button
                  onClick={() => { setLanguage("mr"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[13px] transition-colors hover:bg-neutral-50 flex items-center justify-between ${
                    language === "mr" ? "font-medium text-[#111111]" : "text-[#6F6F6F]"
                  }`}
                >
                  <span>मराठी</span>
                  {language === "mr" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </button>
              </div>
            )}
          </div>

          {/* Profile Dropdown / Login */}
          <ProfileDropdown />

          {/* Primary CTA: Open My Farm */}
          <Link
            to="/twin"
            className="h-10 px-5 rounded-full bg-[#000000] text-white text-[14px] font-medium flex items-center justify-center transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-xs"
          >
            {t("navOpenMyFarm")}
          </Link>
        </div>

        {/* ==================================================
            MOBILE MENU TOGGLE
            ================================================== */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            to="/twin"
            className="h-8.5 px-3 rounded-full bg-[#000000] text-white text-[12px] font-medium flex items-center justify-center sm:hidden"
          >
            {t("navOpenMyFarm")}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-full border border-[#E8E8E8] flex items-center justify-center text-[#111111] hover:bg-neutral-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* ==================================================
          MOBILE DROPDOWN DRAWER
          ================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-black/[0.06] px-6 py-5 space-y-4 animate-fade-in shadow-xl max-h-[80vh] overflow-y-auto">
          
          {/* Mobile Profile Card */}
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 flex items-center justify-between text-left transition-colors block"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black text-white font-serif text-sm font-bold flex items-center justify-center">
                {farmerProfile?.name ? farmerProfile.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : "FP"}
              </div>
              <div>
                <span className="text-xs font-semibold text-black block">{farmerProfile?.name || "Farmer Profile"}</span>
                <span className="text-[10px] text-neutral-500">{farmerProfile?.totalAreaAcres || 10.4} Acres • {farmerProfile?.district || "Maharashtra"}</span>
              </div>
            </div>
            <span className="text-xs text-neutral-500 font-medium">{t("myProfile")} →</span>
          </Link>

          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm py-2 px-3 rounded-xl transition-colors ${
                  item.isActive
                    ? "bg-neutral-900 text-white font-medium"
                    : "text-[#4A4A4A] bg-neutral-50 hover:bg-neutral-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#EBEBEB]">
            {/* Language Selection */}
            <div className="flex items-center justify-between sm:justify-start gap-2 text-xs">
              <span className="text-[#6F6F6F]">Language:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-full text-xs ${language === "en" ? "bg-black text-white font-medium" : "text-[#6F6F6F] bg-neutral-100"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-1 rounded-full text-xs ${language === "hi" ? "bg-black text-white font-medium" : "text-[#6F6F6F] bg-neutral-100"}`}
                >
                  HI
                </button>
                <button
                  onClick={() => setLanguage("mr")}
                  className={`px-2.5 py-1 rounded-full text-xs ${language === "mr" ? "bg-black text-white font-medium" : "text-[#6F6F6F] bg-neutral-100"}`}
                >
                  MR
                </button>
              </div>
            </div>

            {/* Unit Selection */}
            <div className="flex items-center justify-between sm:justify-start gap-2 text-xs">
              <span className="text-[#6F6F6F]">Unit:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setUnit("quintals_acre")}
                  className={`px-2.5 py-1 rounded-full text-xs ${unit === "quintals_acre" ? "bg-black text-white font-medium" : "text-[#6F6F6F] bg-neutral-100"}`}
                >
                  Q/acre
                </button>
                <button
                  onClick={() => setUnit("tonnes_ha")}
                  className={`px-2.5 py-1 rounded-full text-xs ${unit === "tonnes_ha" ? "bg-black text-white font-medium" : "text-[#6F6F6F] bg-neutral-100"}`}
                >
                  t/ha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
