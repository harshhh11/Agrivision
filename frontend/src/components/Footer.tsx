import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-white/85 backdrop-blur-xl border-t border-white/60 py-16 mt-20 text-[#6F6F6F] font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <span className="font-serif text-3xl tracking-tight text-black block mb-3">
            AgriVision
          </span>
          <p className="text-sm max-w-md leading-relaxed text-[#6F6F6F]">
            {t("footerDesc")}
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-black">
            <span>Lat 16.7820° N</span>
            <span>•</span>
            <span>Lon 74.5240° E</span>
            <span>•</span>
            <span className="text-emerald-700">{t("demoBadge")}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-black font-semibold mb-4">{t("footerPlatform")}</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/twin" className="hover:text-black transition-colors">{t("navMyFarm")}</Link></li>
            <li><Link to="/recommendations" className="hover:text-black transition-colors">{t("navWhatShouldIDo")}</Link></li>
            <li><Link to="/simulation" className="hover:text-black transition-colors">{t("navWhatIf")}</Link></li>
            <li><Link to="/crop-health" className="hover:text-black transition-colors">{t("footerSatelliteBiomass")}</Link></li>
            <li><Link to="/history" className="hover:text-black transition-colors">{t("navPastRecords")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-black font-semibold mb-4">{t("footerGovernance")}</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/data-quality" className="hover:text-black transition-colors">{t("footerDataQuality")}</Link></li>
            <li><Link to="/data-quality" className="hover:text-black transition-colors">{t("footerFarmerOwnership")}</Link></li>
            <li><span className="text-neutral-400">Copernicus Sentinel-2 MSI</span></li>
            <li><span className="text-neutral-400">IMD & Agro-Climatic Grid</span></li>
            <li><span className="text-neutral-400">ICAR / VSI Soil Survey</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E9E9E]">
        <p>{t("footerCopyright")}</p>
        <p className="mt-2 sm:mt-0 font-mono text-[11px]">AGRIVISION × SMART FARMING × PRECISION AG</p>
      </div>
    </footer>
  );
};
