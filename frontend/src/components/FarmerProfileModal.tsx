import React, { useState, useEffect } from "react";
import { useAuth, FarmerProfile } from "../context/AuthContext";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import {
  X, User, MapPin, Phone, Mail, Sprout, Layers, Droplets,
  Calendar, Award, CheckCircle2, Sliders, ShieldCheck,
  LogOut, Save, RefreshCw, AlertCircle
} from "lucide-react";

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({ isOpen, onClose }) => {
  const { farmerProfile, updateFarmerProfile, logout } = useAuth();
  const { selectedField, setSelectedField, farm, setFarm } = useFarm();
  const { t, formatYield, formatArea, translateCropStage, translateSoilType, translateIrrigation, translateFrequency, translateLocation, translateFarmName } = useI18n();

  const [activeTab, setActiveTab] = useState<"summary" | "edit">("summary");
  const [formData, setFormData] = useState<FarmerProfile>(farmerProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(farmerProfile);
  }, [farmerProfile, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = formData.name
    ? formData.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FP";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmerProfile(formData);

    // Sync active plot in FarmContext
    if (selectedField) {
      const updatedField = {
        ...selectedField,
        cropVariety: formData.sugarcaneVariety,
        areaAcres: Number(formData.totalAreaAcres) || selectedField.areaAcres,
        areaHa: Number(formData.totalAreaHa) || selectedField.areaHa,
        soilType: formData.soilType,
        irrigationFrequency: formData.irrigationFrequency,
        plantingDate: formData.plantingDate,
        nitrogen: Number(formData.nitrogen) || selectedField.nitrogen,
        phosphorus: Number(formData.phosphorus) || selectedField.phosphorus,
        potassium: Number(formData.potassium) || selectedField.potassium,
      };
      setSelectedField(updatedField);
    }

    if (farm) {
      setFarm(prev => prev ? {
        ...prev,
        totalAreaAcres: Number(formData.totalAreaAcres) || prev.totalAreaAcres,
        totalAreaHa: Number(formData.totalAreaHa) || prev.totalAreaHa,
        district: formData.district || prev.district,
        village: formData.village || prev.village,
        name: formData.farmName || prev.name,
      } : null);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab("summary");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden my-8">
        
        {/* Modal Top Banner */}
        <div className="relative bg-black text-white px-6 sm:px-8 pt-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Farmer Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white text-black font-serif text-2xl font-bold flex items-center justify-center shadow-lg shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-medium border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t("verifiedTwinFarmer")}
                </span>
              </div>
              <h2 className="text-2xl font-serif font-normal text-white truncate">
                {formData.name}
              </h2>
              <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>
                  {translateLocation(`${formData.village}, ${formData.district}, ${formData.state}`)}
                </span>
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/15">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "summary"
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-neutral-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {t("farmTwinOverview")}
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "edit"
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-neutral-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sliders className="w-3 h-3" />
              {t("editParameters")}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[68vh] overflow-y-auto">
          
          {saveSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold block">{t("saveSuccessTitle")}</span>
                <span>{t("saveSuccessDesc")}</span>
              </div>
            </div>
          )}

          {activeTab === "summary" ? (
            <div className="space-y-6">
              
              {/* 4 Telemetry Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    {t("totalLand")}
                  </span>
                  <div className="text-xl font-serif font-bold text-black mt-1">
                    {formData.totalAreaAcres} <span className="text-xs font-sans font-normal text-neutral-600">{t("acres")}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    ({formData.totalAreaHa || (formData.totalAreaAcres * 0.404686).toFixed(1)} {t("hectares")})
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    {t("cropVariety")}
                  </span>
                  <div className="text-xl font-serif font-bold text-black mt-1 truncate" title={formData.sugarcaneVariety}>
                    {formData.sugarcaneVariety.split(" ")[0]} {formData.sugarcaneVariety.split(" ")[1] || ""}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                    {translateCropStage(formData.cropStage)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    {t("soilType")}
                  </span>
                  <div className="text-xl font-serif font-bold text-black mt-1 truncate" title={formData.soilType}>
                    {translateSoilType(formData.soilType.split(" ")[0])}
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {t("highWaterRetention")}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    {t("irrigation")}
                  </span>
                  <div className="text-xl font-serif font-bold text-black mt-1 truncate" title={formData.irrigationMethod}>
                    {translateIrrigation(formData.irrigationMethod.split(" ")[0])}
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {translateFrequency(formData.irrigationFrequency)}
                  </span>
                </div>
              </div>

              {/* Detailed Parameter Ledger */}
              <div className="rounded-2xl border border-neutral-200 overflow-hidden text-xs">
                <div className="bg-neutral-100 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-neutral-700 font-semibold border-b border-neutral-200">
                  {t("registeredFarmParameters")}
                </div>
                <div className="divide-y divide-neutral-100 bg-white">
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">{t("farmEstateName")}</span>
                    <span className="font-medium text-black">{translateFarmName(formData.farmName)}</span>
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">{t("farmerContactMobile")}</span>
                    <span className="font-mono text-black">{formData.phone || "+91 98220 12345"}</span>
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">{t("farmerAccountEmail")}</span>
                    <span className="font-mono text-black">{formData.email}</span>
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">{t("plantingDate")}</span>
                    <span className="font-mono text-black">{formData.plantingDate}</span>
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">{t("nutrientBaseline")}</span>
                    <span className="font-mono text-black">{formData.nitrogen}N - {formData.phosphorus}P - {formData.potassium}K kg/ha</span>
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">{t("calibratedYieldTarget")}</span>
                    <span className="font-semibold text-emerald-700">{formData.targetYieldQAcre} {t("quintalsPerAcre")} (~{(formData.targetYieldQAcre * 0.2471).toFixed(1)} {t("tonnesPerHa")})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {t("editAgronomicParams")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t("signOutSwitchFarm")}
                </button>
              </div>

            </div>
          ) : (
            /* Parameter Edit Form */
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-4">
                <h4 className="text-xs font-semibold text-black mb-1">
                  {t("tuneDigitalTwin")}
                </h4>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  {t("tuneDigitalTwinDesc")}
                </p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("farmerName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("contactPhone")}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("state")}
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("district")}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("village")}
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Farm & Sugarcane Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("totalFarmLand")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="500"
                    value={formData.totalAreaAcres}
                    onChange={(e) => {
                      const acres = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        totalAreaAcres: acres,
                        totalAreaHa: parseFloat((acres * 0.404686).toFixed(2))
                      });
                    }}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("sugarcaneVariety")}
                  </label>
                  <select
                    value={formData.sugarcaneVariety}
                    onChange={(e) => setFormData({ ...formData, sugarcaneVariety: e.target.value })}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Co 86032 (Nayana)">Co 86032 (Nayana)</option>
                    <option value="Co 0265 (Phule 0265)">Co 0265 (Phule 0265)</option>
                    <option value="CoM 0265">CoM 0265</option>
                    <option value="Co 8005">Co 8005</option>
                    <option value="CoVSI 03102">CoVSI 03102</option>
                    <option value="MS 10001">MS 10001</option>
                  </select>
                </div>
              </div>

              {/* Soil & Irrigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("soilClassification")}
                  </label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Black Soil (Vertisol)">{t("soilBlack")}</option>
                    <option value="Medium Black Soil">{t("soilMediumBlack")}</option>
                    <option value="Clay Loam">{t("soilClayLoam")}</option>
                    <option value="Red Loam">{t("soilRedLoam")}</option>
                    <option value="Alluvial Soil">{t("soilAlluvial")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {t("irrigationMethodFreq")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.irrigationMethod}
                      onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                      className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-2.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="Drip Irrigation">{t("irrDrip")}</option>
                      <option value="Furrow Irrigation">{t("irrFurrow")}</option>
                      <option value="Flood Irrigation">{t("irrFlood")}</option>
                      <option value="Sprinkler">{t("irrSprinkler")}</option>
                    </select>

                    <select
                      value={formData.irrigationFrequency}
                      onChange={(e) => setFormData({ ...formData, irrigationFrequency: e.target.value })}
                      className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-2.5 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="2 times/week">{t("waterTimes2")}</option>
                      <option value="3 times/week">{t("waterTimes3")}</option>
                      <option value="4 times/week">4 {t("timesPerWeek")}</option>
                      <option value="Every 10 days">{t("every10Days")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* N-P-K Nutrients */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  {t("soilNutrientsNPK")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block mb-1">{t("soilNitrogen")} (N)</span>
                    <input
                      type="number"
                      value={formData.nitrogen}
                      onChange={(e) => setFormData({ ...formData, nitrogen: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3 py-2 text-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block mb-1">{t("soilPhosphorus")} (P)</span>
                    <input
                      type="number"
                      value={formData.phosphorus}
                      onChange={(e) => setFormData({ ...formData, phosphorus: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3 py-2 text-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block mb-1">{t("soilPotassium")} (K)</span>
                    <input
                      type="number"
                      value={formData.potassium}
                      onChange={(e) => setFormData({ ...formData, potassium: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-neutral-300 rounded-xl px-3 py-2 text-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className="px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-medium transition-all"
                >
                  {t("btnCancel")}
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  {t("saveAndCalibrate")}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
