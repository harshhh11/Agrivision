import React, { useState, useEffect } from "react";
import { useFarm } from "../context/FarmContext";
import { api } from "../services/api";
import {
  Droplets, Calendar, Clock, CheckCircle2, AlertCircle,
  Plus, Check, ArrowRight
} from "lucide-react";

export const IrrigationPage: React.FC = () => {
  const { farm, fields, refreshFarmData } = useFarm();
  const [irrigationData, setIrrigationData] = useState<any>(null);

  // Form for logging irrigation
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?._id || "");
  const [volumeMm, setVolumeMm] = useState(20);
  const [method, setMethod] = useState("Center Pivot");
  const [notes, setNotes] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  useEffect(() => {
    async function loadIrrigation() {
      try {
        const res = await api.getIrrigation("default");
        if (res.data?.status === "success") {
          setIrrigationData(res.data);
        }
      } catch (err) {
        console.warn("Failed to load irrigation data:", err);
      }
    }
    loadIrrigation();
  }, []);

  const handleLogIrrigation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    try {
      await api.logIrrigation({
        fieldId: selectedFieldId,
        volumeMm: Number(volumeMm),
        durationHours: 2.5,
        method,
        notes
      });
      setLogSuccess(true);
      await refreshFarmData();
      const refreshed = await api.getIrrigation("default");
      if (refreshed.data?.status === "success") setIrrigationData(refreshed.data);
      setTimeout(() => setLogSuccess(false), 3000);
      setNotes("");
    } catch (err) {
      console.error("Failed to log irrigation:", err);
    } finally {
      setIsLogging(false);
    }
  };

  const fieldsIrrigation = irrigationData?.fields || [];
  const recentApplications = irrigationData?.recentApplications || [];

  return (
    <div className="min-h-screen bg-white text-black font-sans px-6 py-10 max-w-7xl mx-auto">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#6F6F6F]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SOIL MOISTURE TENSION & PRECIPITATION INTEGRATION</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-black">
            Irrigation Intelligence
          </h1>
        </div>

        <p className="text-xs text-[#6F6F6F] max-w-md">
          Coupling in-situ Decagon 5TM dielectric permittivity probes with high-resolution radar precipitation models to preserve aquifers and optimize kernel fill.
        </p>
      </div>

      {/* Prominent High-Value Prescription Highlight Banner */}
      <div className="p-6 rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6F6F6F] block mb-1">
            Primary Prescriptive Advisory
          </span>
          <h2 className="font-serif text-3xl font-normal text-black mb-2">
            “Delay irrigation — rainfall is expected within 18 hours.”
          </h2>
          <p className="text-xs text-[#6F6F6F] max-w-2xl leading-relaxed">
            Atmospheric radar forecasts show 28mm of convective precipitation arriving Tuesday. Pausing scheduled center-pivot runs on North Terrace prevents root anoxia and conserves approximately 1.3 million liters of pumped water.
          </p>
        </div>
        <div className="shrink-0 bg-white px-4 py-3 rounded-xl border border-[#EBEBEB] text-center">
          <div className="text-[10px] font-mono text-[#6F6F6F]">Water Saved</div>
          <div className="font-serif text-2xl font-medium text-emerald-700">~28 mm</div>
          <div className="text-[10px] text-[#9E9E9E]">Zero Pumping Cost</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left 2 Cols: Field-by-Field Irrigation Status */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-serif text-2xl text-black">Field Soil Moisture & Requirements</h3>
          
          <div className="space-y-4">
            {fieldsIrrigation.map((f: any) => (
              <div
                key={f.fieldId}
                className="p-6 rounded-2xl border border-[#EBEBEB] hover:border-black transition-all bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#EBEBEB]">
                  <div>
                    <span className="font-mono text-xs text-[#6F6F6F] bg-neutral-100 px-2 py-0.5 rounded mr-2">
                      {f.code}
                    </span>
                    <span className="font-serif text-xl font-normal text-black">{f.fieldName}</span>
                    <span className="text-xs text-[#6F6F6F] ml-2">({f.crop} • {f.stage})</span>
                  </div>

                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                    f.urgency === "high" ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-800"
                  }`}>
                    {f.urgency.toUpperCase()} URGENCY
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#EBEBEB]">
                    <div className="text-[10px] font-mono text-[#6F6F6F]">Current Moisture</div>
                    <div className="font-serif text-2xl font-normal text-sky-800">{f.currentMoisturePct}%</div>
                  </div>

                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#EBEBEB]">
                    <div className="text-[10px] font-mono text-[#6F6F6F]">Target Moisture</div>
                    <div className="font-serif text-2xl font-normal text-black">{f.targetMoisturePct}%</div>
                  </div>

                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#EBEBEB]">
                    <div className="text-[10px] font-mono text-[#6F6F6F]">Water Deficit</div>
                    <div className="font-serif text-2xl font-normal text-black">{f.deficitPct}%</div>
                  </div>

                  <div className="bg-[#FAFAFA] p-3 rounded-xl border border-[#EBEBEB]">
                    <div className="text-[10px] font-mono text-[#6F6F6F]">Requirement</div>
                    <div className="font-serif text-2xl font-normal text-black">{f.waterRequirementMm} mm</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 text-xs">
                  <strong className="text-black block mb-0.5">Recommendation:</strong>
                  <div className="font-medium text-black mb-1">{f.recommendedIrrigation}</div>
                  <p className="text-[#6F6F6F]">{f.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Log Applied Irrigation Form (Closed Loop Action) */}
        <div>
          <div className="p-6 rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] sticky top-24">
            <h3 className="font-serif text-2xl text-black mb-1">Log Irrigation Event</h3>
            <p className="text-xs text-[#6F6F6F] mb-4">
              Recording an execution directly recalculates root zone soil moisture for your field.
            </p>

            {logSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Irrigation recorded! Farm state updated.</span>
              </div>
            )}

            <form onSubmit={handleLogIrrigation} className="space-y-4">
              <div>
                <label className="block text-xs text-[#6F6F6F] mb-1">Target Field</label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  className="w-full bg-white border border-[#EBEBEB] rounded-lg px-3 py-2 text-xs text-black"
                >
                  {fields.map(f => (
                    <option key={f._id} value={f._id}>{f.name} ({f.currentCrop})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#6F6F6F] mb-1">Applied Volume (mm)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  step="1"
                  value={volumeMm}
                  onChange={(e) => setVolumeMm(Number(e.target.value))}
                  className="w-full bg-white border border-[#EBEBEB] rounded-lg px-3 py-2 text-xs text-black"
                />
              </div>

              <div>
                <label className="block text-xs text-[#6F6F6F] mb-1">Application Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-white border border-[#EBEBEB] rounded-lg px-3 py-2 text-xs text-black"
                >
                  <option value="Center Pivot">Center Pivot (Low Pressure)</option>
                  <option value="Drip Line">Drip Line / Sub-surface</option>
                  <option value="Overhead Sprinkler">Overhead Sprinkler</option>
                  <option value="Furrow">Furrow Application</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#6F6F6F] mb-1">Field Notes / Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Applied 18mm to address dry ridge slope"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#EBEBEB] rounded-lg px-3 py-2 text-xs text-black"
                />
              </div>

              <button
                type="submit"
                disabled={isLogging}
                className="w-full bg-black text-white text-xs py-3 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                {isLogging ? "Recording Event..." : "Confirm & Save Irrigation Log"}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
