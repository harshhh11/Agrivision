import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n";
import { User, Layers, Settings, LogOut, ChevronDown, MapPin } from "lucide-react";

export const ProfileDropdown: React.FC = () => {
  const { user, farmerProfile, isAuthenticated, isDemoMode, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="text-sm font-medium text-black hover:text-neutral-600 transition-colors px-2 py-1"
      >
        {t("authLogin")}
      </Link>
    );
  }

  const farmerName = farmerProfile?.name || user?.name || "Ramesh Patil";
  const initials = farmerName
    ? farmerName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FP";

  const locationText = farmerProfile?.village && farmerProfile?.state
    ? `${farmerProfile.village}, ${farmerProfile.state}`
    : "Kasba Bawada, Maharashtra";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-2.5 sm:px-3 rounded-full bg-white/90 backdrop-blur-md border border-black/10 hover:border-black/25 text-xs text-black flex items-center gap-2 transition-all shadow-xs"
        aria-expanded={isOpen}
      >
        <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-serif flex items-center justify-center font-bold">
          {initials}
        </div>
        <span className="hidden sm:inline font-medium text-[12px] max-w-[90px] truncate">
          {farmerName.split(" ")[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-[#6F6F6F]" />
      </button>

      {/* Minimal Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/10 py-2 z-[1100] animate-fade-in text-xs font-sans">
          
          {/* Farmer Header */}
          <div className="px-4 py-2.5 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-1.5 font-semibold text-black text-sm">
              <span className="truncate">{farmerName}</span>
              {isDemoMode && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  DEMO
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#6F6F6F] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
              <span>{locationText}</span>
            </div>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-[#333333] hover:bg-neutral-50 hover:text-black transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#6F6F6F]" />
              <span>{t("myProfile")}</span>
            </Link>

            <Link
              to="/farm"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-[#333333] hover:bg-neutral-50 hover:text-black transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#6F6F6F]" />
              <span>{t("myFarm")}</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-[#333333] hover:bg-neutral-50 hover:text-black transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#6F6F6F]" />
              <span>{t("farmSettings")}</span>
            </Link>
          </div>

          {/* Log Out */}
          <div className="pt-1 border-t border-[#F0F0F0]">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>{t("logOut")}</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
