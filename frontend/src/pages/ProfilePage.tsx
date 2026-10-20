import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, FarmerProfile } from "../context/AuthContext";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import {
  User, MapPin, Phone, Mail, Sprout, Layers, Droplets,
  Calendar, CheckCircle2, Sliders, ShieldCheck,
  Edit2, Save, X, ArrowLeft
} from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { farmerProfile, updateFarmerProfile } = useAuth();
  const { selectedField, setSelectedField, farm, setFarm } = useFarm();
  const { t } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FarmerProfile>(farmerProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const initials = formData.name
    ? formData.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FP";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFarmerProfile(formData);

    // Sync active plot in FarmContext
    if (selectedField && setSelectedField) {
      setSelectedField({
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
      });
    }

    if (farm && setFarm) {
      setFarm(prev => prev ? ({
        ...prev,
        totalAreaAcres: Number(formData.totalAreaAcres) || prev.totalAreaAcres,
        totalAreaHa: Number(formData.totalAreaHa) || prev.totalAreaHa,
        district: formData.district || prev.district,
        village: formData.village || prev.village,
        name: formData.farmName || prev.name,
      }) : null);
    }

    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-10 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#6F6F6F]">
            <Link to="/farm" className="hover:text-black transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("navMyFarm")}</span>
            </Link>
            <span>/</span>
            <span className="font-medium text-black">{t("myProfile")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">
            {t("myProfile")}
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-1 font-normal">
            Manage your personal farmer identity and active sugarcane farm parameters.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 bg-black text-white text-xs px-6 py-2.5 rounded-full font-medium hover:bg-neutral-800 transition-all shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t("edit")}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData(farmerProfile);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-black text-white text-xs px-6 py-2.5 rounded-full font-medium hover:bg-neutral-800 transition-all shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t("saveChanges")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-semibold block">{t("saveChanges")}!</span>
            <span>Your farm parameters have been successfully updated.</span>
          </div>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Farmer Identity Card */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBEBEB] shadow-xs">
            <div className="w-20 h-20 rounded-2xl bg-black text-white font-serif text-3xl font-bold flex items-center justify-center mb-5 shadow-md">
              {initials}
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono font-medium border border-emerald-200 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              VERIFIED FARM GROWER
            </span>

            <h2 className="text-2xl font-semibold text-black">{formData.name}</h2>
            <p className="text-xs text-[#6F6F6F] mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formData.village}, {formData.district}, {formData.state}</span>
            </p>

            <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#6F6F6F]">
                <span>Registered Farm</span>
                <span className="font-medium text-black">{formData.farmName}</span>
              </div>
              <div className="flex items-center justify-between text-[#6F6F6F]">
                <span>Total Cultivation</span>
                <span className="font-medium text-black">{formData.totalAreaAcres} Acres</span>
              </div>
              <div className="flex items-center justify-between text-[#6F6F6F]">
                <span>Sugarcane Variety</span>
                <span className="font-medium text-black">{formData.sugarcaneVariety}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The 4 Profile Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: My Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBEBEB] shadow-xs">
            <h3 className="font-serif text-xl text-black mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#6F6F6F]" />
              <span>My Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-transparent">
                    {formData.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Mobile Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-transparent font-mono">
                    {formData.phone || "+91 98220 12345"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-transparent">
                    {formData.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Village</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-transparent">
                    {formData.village}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">District</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-transparent">
                    {formData.district}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl border border-transparent">
                    {formData.state}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: My Farm */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBEBEB] shadow-xs">
            <h3 className="font-serif text-xl text-black mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6F6F6F]" />
              <span>My Farm</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Farm Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl">
                    {formData.farmName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Total Cultivated Area (Acres)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={formData.totalAreaAcres}
                    onChange={(e) => {
                      const acres = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        totalAreaAcres: acres,
                        totalAreaHa: parseFloat((acres * 0.404686).toFixed(2))
                      });
                    }}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black font-mono"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl font-mono">
                    {formData.totalAreaAcres} Acres ({formData.totalAreaHa || (formData.totalAreaAcres * 0.404686).toFixed(1)} ha)
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Location Summary</label>
                <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl">
                  {formData.village}, {formData.district}, {formData.state}
                </div>
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Number of Fields / Plots</label>
                <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl font-mono">
                  {formData.numberOfFields || 4} Plots
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: My Sugarcane */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBEBEB] shadow-xs">
            <h3 className="font-serif text-xl text-black mb-4 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>My Sugarcane</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Sugarcane Variety</label>
                {isEditing ? (
                  <select
                    value={formData.sugarcaneVariety}
                    onChange={(e) => setFormData({ ...formData, sugarcaneVariety: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  >
                    <option value="Co 86032">Co 86032 (Nayana)</option>
                    <option value="Co 0265">Co 0265 (Phule 0265)</option>
                    <option value="CoM 0265">CoM 0265</option>
                    <option value="Co 8005">Co 8005</option>
                    <option value="CoVSI 03102">CoVSI 03102</option>
                  </select>
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl">
                    {formData.sugarcaneVariety}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Crop Stage</label>
                {isEditing ? (
                  <select
                    value={formData.cropStage}
                    onChange={(e) => setFormData({ ...formData, cropStage: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Tillering">Tillering</option>
                    <option value="Grand Growth">Grand Growth</option>
                    <option value="Ripening/Maturity">Ripening/Maturity</option>
                  </select>
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl text-emerald-800 font-semibold">
                    {formData.cropStage}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Planting Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl font-mono">
                    {formData.plantingDate}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Irrigation Method & Frequency</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.irrigationMethod}
                      onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                      className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-2 py-2 text-xs text-black"
                    >
                      <option value="Drip">Drip</option>
                      <option value="Furrow">Furrow</option>
                      <option value="Flood">Flood</option>
                      <option value="Sprinkler">Sprinkler</option>
                    </select>
                    <select
                      value={formData.irrigationFrequency}
                      onChange={(e) => setFormData({ ...formData, irrigationFrequency: e.target.value })}
                      className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-2 py-2 text-xs text-black"
                    >
                      <option value="2 times/week">2x/week</option>
                      <option value="3 times/week">3x/week</option>
                      <option value="4 times/week">4x/week</option>
                      <option value="Every 10 days">Every 10 days</option>
                    </select>
                  </div>
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl">
                    {formData.irrigationMethod} ({formData.irrigationFrequency})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: My Soil */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBEBEB] shadow-xs">
            <h3 className="font-serif text-xl text-black mb-4 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>My Soil</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Soil Type</label>
                {isEditing ? (
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black"
                  >
                    <option value="Black Soil (Vertisol)">Black Soil (Vertisol)</option>
                    <option value="Medium Black Soil">Medium Black Soil</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Red Loam">Red Sandy Loam</option>
                  </select>
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl">
                    {formData.soilType}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Nitrogen (N)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({ ...formData, nitrogen: Number(e.target.value) })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black font-mono"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl font-mono">
                    {formData.nitrogen} kg/ha
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Phosphorus (P)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({ ...formData, phosphorus: Number(e.target.value) })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black font-mono"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl font-mono">
                    {formData.phosphorus} kg/ha
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#6F6F6F] mb-1 font-medium">Potassium (K)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.potassium}
                    onChange={(e) => setFormData({ ...formData, potassium: Number(e.target.value) })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-black font-mono"
                  />
                ) : (
                  <div className="font-medium text-black bg-[#FAFAFA] px-3.5 py-2.5 rounded-xl font-mono">
                    {formData.potassium} kg/ha
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
