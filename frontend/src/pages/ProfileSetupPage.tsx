import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, FarmerProfile } from "../context/AuthContext";
import { useFarm } from "../context/FarmContext";
import { useI18n } from "../i18n";
import {
  User, MapPin, Sprout, Layers, Droplets, ShieldCheck,
  CheckCircle2, ArrowRight, ArrowLeft, Sun, CloudRain
} from "lucide-react";

export const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { farmerProfile, updateFarmerProfile } = useAuth();
  const { setFarm, setSelectedField, selectedField } = useFarm();
  const { t } = useI18n();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);

  // Step 1: About You
  const [fullName, setFullName] = useState(farmerProfile?.name || farmerProfile?.fullName || "Ramesh Patil");
  const [mobileNumber, setMobileNumber] = useState(farmerProfile?.phone || farmerProfile?.mobileNumber || "+91 98220 12345");
  const [village, setVillage] = useState(farmerProfile?.village || "Kasba Bawada");
  const [district, setDistrict] = useState(farmerProfile?.district || "Kolhapur");
  const [taluka, setTaluka] = useState(farmerProfile?.taluka || "Karveer");
  const [state, setState] = useState(farmerProfile?.state || "Maharashtra");

  // Step 2: Your Farm
  const [farmName, setFarmName] = useState(farmerProfile?.farmName || "Patil Sugarcane Estate");
  const [farmArea, setFarmArea] = useState<number>(farmerProfile?.totalAreaAcres || 10.4);
  const [areaUnit, setAreaUnit] = useState<"Acre" | "Hectare">("Acre");
  const [farmLocation, setFarmLocation] = useState(farmerProfile?.location || "Kasba Bawada, Kolhapur, Maharashtra");
  const [numberOfFields, setNumberOfFields] = useState<number>(farmerProfile?.numberOfFields || 4);

  // Step 3: Your Sugarcane
  const [sugarcaneVariety, setSugarcaneVariety] = useState(farmerProfile?.sugarcaneVariety || "Co 86032");
  const [cropStage, setCropStage] = useState(farmerProfile?.cropStage || "Grand Growth");
  const [plantingDate, setPlantingDate] = useState(farmerProfile?.plantingDate || "2025-07-15");
  const [cropDuration, setCropDuration] = useState<number>(farmerProfile?.cropDurationMonths || 16);
  const [irrigationMethod, setIrrigationMethod] = useState(farmerProfile?.irrigationMethod || "Drip");
  const [irrigationFrequency, setIrrigationFrequency] = useState(farmerProfile?.irrigationFrequency || "3 times/week");

  // Step 4: Your Soil
  const [soilType, setSoilType] = useState(farmerProfile?.soilType || "Black Soil (Vertisol)");
  const [nitrogen, setNitrogen] = useState<number>(farmerProfile?.nitrogen || 240);
  const [phosphorus, setPhosphorus] = useState<number>(farmerProfile?.phosphorus || 80);
  const [potassium, setPotassium] = useState<number>(farmerProfile?.potassium || 160);
  const [soilMoisture, setSoilMoisture] = useState<number>(farmerProfile?.soilMoisture || 34.2);

  // Step 5: Farm Practices
  const [pestControl, setPestControl] = useState(farmerProfile?.pestControl || "Integrated");
  const [sunlight, setSunlight] = useState<number>(farmerProfile?.sunlight || 8.2);
  const [rainfall, setRainfall] = useState<number>(farmerProfile?.rainfall || 1240);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep((prev) => (prev + 1) as any);
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const totalAcres = areaUnit === "Acre" ? Number(farmArea) : Number((farmArea * 2.47105).toFixed(1));
    const totalHa = areaUnit === "Hectare" ? Number(farmArea) : Number((farmArea * 0.404686).toFixed(2));

    const updatedProfile: Partial<FarmerProfile> = {
      name: fullName,
      fullName,
      phone: mobileNumber,
      mobileNumber,
      village,
      district,
      taluka,
      state,
      farmName,
      totalAreaAcres: totalAcres,
      totalAreaHa: totalHa,
      areaUnit,
      location: farmLocation || `${village}, ${district}, ${state}`,
      numberOfFields: Number(numberOfFields),
      sugarcaneVariety,
      cropStage,
      plantingDate,
      cropDurationMonths: Number(cropDuration),
      irrigationMethod,
      irrigationFrequency,
      soilType,
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      soilMoisture: Number(soilMoisture),
      pestControl,
      sunlight: Number(sunlight),
      rainfall: Number(rainfall),
      isProfileComplete: true
    };

    await updateFarmerProfile(updatedProfile);

    // Synchronize Farm Context state
    if (setFarm) {
      setFarm(prev => ({
        ...prev,
        _id: prev?._id || "farm-user",
        name: farmName,
        location: `${village}, ${district}, ${state}`,
        state,
        district,
        taluka,
        village,
        totalAreaHa: totalHa,
        totalAreaAcres: totalAcres,
        latitude: 16.7820,
        longitude: 74.5240,
        coordinates: [16.7820, 74.5240],
        digitalTwinMaturity: "Predictive",
        twinHealthStatus: "Optimal",
        primaryCrop: "Sugarcane"
      }));
    }

    if (selectedField && setSelectedField) {
      setSelectedField({
        ...selectedField,
        cropVariety: sugarcaneVariety,
        cropStage: cropStage as any,
        plantingDate,
        cropDurationMonths: Number(cropDuration),
        soilType,
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        irrigationFrequency,
        pestControl,
        areaAcres: totalAcres,
        areaHa: totalHa
      });
    }

    setLoading(false);
    navigate("/farm");
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#EBEBEB] p-8 sm:p-10 shadow-xl">
        
        {/* Step Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-[#6F6F6F] mb-3">
            <span className="font-semibold text-black">STEP {step} OF 5</span>
            <span className="uppercase tracking-wider">
              {step === 1 && "Step 1 — About You"}
              {step === 2 && "Step 2 — Your Farm"}
              {step === 3 && "Step 3 — Your Sugarcane"}
              {step === 4 && "Step 4 — Your Soil"}
              {step === 5 && "Step 5 — Farm Practices"}
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* ==================================================
            STEP 1: About You
            ================================================== */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4 animate-fade-in">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-black">
                About You
              </h2>
              <p className="text-xs text-[#6F6F6F] mt-1">
                Tell us your name and village location in Maharashtra.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Village</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Taluka</label>
                <input
                  type="text"
                  required
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="bg-black text-white text-xs px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ==================================================
            STEP 2: Your Farm
            ================================================== */}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4 animate-fade-in">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-black">
                Your Farm
              </h2>
              <p className="text-xs text-[#6F6F6F] mt-1">
                Enter your total landholding and plot counts.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Farm Name
              </label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Farm Area
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    required
                    value={farmArea}
                    onChange={(e) => setFarmArea(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                  />
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-3 text-xs text-black focus:outline-none"
                  >
                    <option value="Acre">Acre</option>
                    <option value="Hectare">Hectare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Number of Fields / Plots
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={numberOfFields}
                  onChange={(e) => setNumberOfFields(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Farm Location Address
              </label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
              />
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full border border-[#E5E5E5] text-xs font-medium text-black hover:bg-neutral-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="bg-black text-white text-xs px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ==================================================
            STEP 3: Your Sugarcane
            ================================================== */}
        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-4 animate-fade-in">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-black">
                Your Sugarcane
              </h2>
              <p className="text-xs text-[#6F6F6F] mt-1">
                Select your cane variety, current crop stage, and irrigation method.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Sugarcane Variety
                </label>
                <select
                  value={sugarcaneVariety}
                  onChange={(e) => setSugarcaneVariety(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                >
                  <option value="Co 86032">Co 86032 (Nayana)</option>
                  <option value="Co 0265">Co 0265 (Phule 0265)</option>
                  <option value="CoM 0265">CoM 0265</option>
                  <option value="Co 8005">Co 8005</option>
                  <option value="CoVSI 03102">CoVSI 03102</option>
                  <option value="MS 10001">MS 10001</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Current Crop Stage
                </label>
                <select
                  value={cropStage}
                  onChange={(e) => setCropStage(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                >
                  <option value="Germination">Germination (0 - 45 days)</option>
                  <option value="Tillering">Tillering (45 - 120 days)</option>
                  <option value="Grand Growth">Grand Growth (120 - 270 days)</option>
                  <option value="Ripening/Maturity">Ripening / Sugar Maturity (270 - 360+ days)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Planting Date
                </label>
                <input
                  type="date"
                  required
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Crop Duration (Months)
                </label>
                <input
                  type="number"
                  min="10"
                  max="20"
                  required
                  value={cropDuration}
                  onChange={(e) => setCropDuration(parseInt(e.target.value) || 16)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Irrigation Method
                </label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                >
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Furrow">Furrow Irrigation</option>
                  <option value="Flood">Flood Irrigation</option>
                  <option value="Sprinkler">Sprinkler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Irrigation Frequency
                </label>
                <select
                  value={irrigationFrequency}
                  onChange={(e) => setIrrigationFrequency(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                >
                  <option value="2 times/week">2 times per week</option>
                  <option value="3 times/week">3 times per week</option>
                  <option value="4 times/week">4 times per week</option>
                  <option value="Every 10 days">Every 10 days</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full border border-[#E5E5E5] text-xs font-medium text-black hover:bg-neutral-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="bg-black text-white text-xs px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ==================================================
            STEP 4: Your Soil
            ================================================== */}
        {step === 4 && (
          <form onSubmit={handleNext} className="space-y-4 animate-fade-in">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-black">
                Your Soil
              </h2>
              <p className="text-xs text-[#6F6F6F] mt-1">
                Enter your soil classification and nutrient test records (N-P-K in kg/ha).
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
              >
                <option value="Black Soil (Vertisol)">Deep Black Soil (Vertisol / Regur)</option>
                <option value="Medium Black Soil">Medium Black Soil</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Red Loam">Red Sandy Loam</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  required
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">kg/ha</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Phosphorus (P)
                </label>
                <input
                  type="number"
                  required
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">kg/ha</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Potassium (K)
                </label>
                <input
                  type="number"
                  required
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">kg/ha</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Estimated Soil Moisture (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
              />
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-full border border-[#E5E5E5] text-xs font-medium text-black hover:bg-neutral-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="bg-black text-white text-xs px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ==================================================
            STEP 5: Farm Practices
            ================================================== */}
        {step === 5 && (
          <form onSubmit={handleFinish} className="space-y-4 animate-fade-in">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-black">
                Farm Practices
              </h2>
              <p className="text-xs text-[#6F6F6F] mt-1">
                Final calibration settings for pest management, sunlight, and rainfall.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Pest Control Strategy
              </label>
              <select
                value={pestControl}
                onChange={(e) => setPestControl(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
              >
                <option value="Integrated">Integrated Pest Management (IPM)</option>
                <option value="Organic">Organic / Bio-control</option>
                <option value="Chemical">Scheduled Chemical Spraying</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Average Daily Sunlight (Hours)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={sunlight}
                  onChange={(e) => setSunlight(Number(e.target.value))}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Typical Annual Rainfall (mm)
                </label>
                <input
                  type="number"
                  required
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-xs flex items-center gap-3 mt-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Your physical farm parameters are ready to calibrate your personal AgriVision dashboard!
              </span>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-full border border-[#E5E5E5] text-xs font-medium text-black hover:bg-neutral-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white text-xs px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center gap-2 shadow-sm active:scale-98"
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>{loading ? "Calibrating..." : "Finish Setup & Launch Farm"}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
