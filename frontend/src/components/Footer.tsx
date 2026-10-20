import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/85 backdrop-blur-xl border-t border-white/60 py-16 mt-20 text-[#6F6F6F] font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <span className="font-serif text-3xl tracking-tight text-black block mb-3">
            AgriVision
          </span>
          <p className="text-sm max-w-md leading-relaxed text-[#6F6F6F]">
            The physical-statistical digital twin platform for individual farmers. Connecting live soil sensors, high-cadence satellite reflectance, and predictive machine learning to forecast yield, preempt agro-climatic risks, and prescribe precision actions.
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-black">
            <span>Lat 41.5868° N</span>
            <span>•</span>
            <span>Lon 93.6250° W</span>
            <span>•</span>
            <span className="text-emerald-700">Maturity: Predictive</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-black font-semibold mb-4">Platform</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/twin" className="hover:text-black transition-colors">Digital Twin Viewer</Link></li>
            <li><Link to="/predictions" className="hover:text-black transition-colors">Yield Forecasting & XAI</Link></li>
            <li><Link to="/simulation" className="hover:text-black transition-colors">What-If Scenario Simulator</Link></li>
            <li><Link to="/crop-health" className="hover:text-black transition-colors">Satellite Biomass (NDVI/EVI)</Link></li>
            <li><Link to="/irrigation" className="hover:text-black transition-colors">Soil Moisture & Irrigation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-black font-semibold mb-4">Governance & Sources</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/data-quality" className="hover:text-black transition-colors">Data Quality & Freshness</Link></li>
            <li><Link to="/data-quality" className="hover:text-black transition-colors">Privacy & Farmer Ownership</Link></li>
            <li><span className="text-neutral-400">Copernicus Sentinel-2 MSI</span></li>
            <li><span className="text-neutral-400">NOAA HRRR Weather Grid</span></li>
            <li><span className="text-neutral-400">USDA Soil Survey Geographic (SSURGO)</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E9E9E]">
        <p>© 2026 AgriVision Systems Inc. Closed-loop farmer verification required before all physical implementations.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[11px]">MOTION SITES × DIGITAL TWIN × PRECISION AG</p>
      </div>
    </footer>
  );
};
