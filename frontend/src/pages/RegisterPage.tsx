import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, FarmerProfile } from "../context/AuthContext";
import { useFarm } from "../context/FarmContext";
import {
  ArrowRight, ArrowLeft, Lock, Mail, User, Phone, MapPin,
  Sprout, Droplets, Layers, CheckCircle2, Sliders, ShieldCheck
} from "lucide-react";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setSelectedField, setFarm } = useFarm();

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Personal & Account
  const [name, setName] = useState("Ramesh Patil");
  const [phone, setPhone] = useState("+91 98220 12345");
  const [email, setEmail] = useState("ramesh.patil@agrivision.in");
  const [password, setPassword] = useState("AgriVision2026!");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Kolhapur");
  const [taluka, setTaluka] = useState("Karveer");
  const [village, setVillage] = useState("Kasba Bawada");

  // Step 2: Farm & Agronomic Parameters
  const [farmName, setFarmName] = useState("Patil Sugarcane Estate");
  const [totalAreaAcres, setTotalAreaAcres] = useState<number>(10.4);
  const [sugarcaneVariety, setSugarcaneVariety] = useState("Co 86032 (Nayana)");
  const [plantingDate, setPlantingDate] = useState("2025-07-15");
  const [cropStage, setCropStage] = useState("Grand Growth");
  const [soilType, setSoilType] = useState("Black Soil (Vertisol)");
  const [irrigationMethod, setIrrigationMethod] = useState("Drip Irrigation");
  const [irrigationFrequency, setIrrigationFrequency] = useState("3 times/week");
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(80);
  const [potassium, setPotassium] = useState<number>(160);
  const [targetYieldQAcre, setTargetYieldQAcre] = useState<number>(565.0);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const profileData: Partial<FarmerProfile> = {
      name,
      email,
      phone,
      state,
      district,
      taluka,
      village,
      farmName,
      totalAreaAcres: Number(totalAreaAcres),
      totalAreaHa: parseFloat((Number(totalAreaAcres) * 0.404686).toFixed(2)),
      primaryCrop: "Sugarcane",
      sugarcaneVariety,
      plantingDate,
      cropStage,
      cropDurationMonths: 16,
      soilType,
      irrigationMethod,
      irrigationFrequency,
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      targetYieldQAcre: Number(targetYieldQAcre)
    };

    const success = await register(name, email, password, phone, profileData);
    setIsLoading(false);

    if (success) {
      // Sync farm context
      if (setFarm) {
        setFarm({
          _id: `farm-${Date.now()}`,
          name: farmName,
          location: `${village}, ${district}, ${state}`,
          state,
          district,
          taluka,
          village,
          totalAreaHa: parseFloat((Number(totalAreaAcres) * 0.404686).toFixed(2)),
          totalAreaAcres: Number(totalAreaAcres),
          latitude: 16.7820,
          longitude: 74.5240,
          coordinates: [16.7820, 74.5240],
          digitalTwinMaturity: "Predictive",
          twinHealthStatus: "Optimal",
          primaryCrop: "Sugarcane"
        });
      }

      navigate("/farm");
    } else {
      setError("Registration failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#EBEBEB] p-8 sm:p-10 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-4xl text-black inline-block mb-2 hover:opacity-85 transition-opacity">
            AgriVision
          </Link>
          <h2 className="text-sm text-[#6F6F6F]">
            Create your farmer account and manage your sugarcane fields
          </h2>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === 1 ? "bg-black text-white" : "bg-neutral-100 text-neutral-500"
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] flex items-center justify-center">1</span>
              <span>Farmer Details</span>
            </div>
            <div className="w-6 h-px bg-neutral-200" />
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === 2 ? "bg-black text-white" : "bg-neutral-100 text-neutral-500"
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] flex items-center justify-center">2</span>
              <span>Farm & Soil Parameters</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: Farmer & Location */
          <form onSubmit={handleNext} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98220 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="farmer@agrivision.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="pt-2 border-t border-neutral-100">
              <label className="block text-xs font-medium text-neutral-700 mb-2">Farm Location</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">State</span>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">District</span>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Taluka</span>
                  <input
                    type="text"
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Village</span>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-black text-white text-xs py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <span>Next: Set Farm & Agronomic Parameters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* STEP 2: Farm & Soil Parameters */
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Farm / Estate Name</label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Total Land Size (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  required
                  value={totalAreaAcres}
                  onChange={(e) => setTotalAreaAcres(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2.5 text-xs text-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Sugarcane Variety</label>
                <select
                  value={sugarcaneVariety}
                  onChange={(e) => setSugarcaneVariety(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Co 86032 (Nayana)">Co 86032 (Nayana) — High Sucrose</option>
                  <option value="Co 0265 (Phule 0265)">Co 0265 (Phule 0265) — Heavy Tonnage</option>
                  <option value="CoM 0265">CoM 0265 — Drought Resilient</option>
                  <option value="Co 8005">Co 8005</option>
                  <option value="CoVSI 03102">CoVSI 03102</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Black Soil (Vertisol)">Deep Black Soil (Vertisol)</option>
                  <option value="Medium Black Soil">Medium Black Soil</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Red Loam">Red Sandy Loam</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Irrigation Method</label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Furrow Irrigation">Furrow Irrigation</option>
                  <option value="Flood Irrigation">Flood Irrigation</option>
                  <option value="Sprinkler">Sprinkler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Irrigation Frequency</label>
                <select
                  value={irrigationFrequency}
                  onChange={(e) => setIrrigationFrequency(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="2 times/week">2 times per week</option>
                  <option value="3 times/week">3 times per week</option>
                  <option value="4 times/week">4 times per week</option>
                  <option value="Every 10 days">Every 10 days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Planting Date</label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Target Yield (Q/Acre)</label>
                <input
                  type="number"
                  value={targetYieldQAcre}
                  onChange={(e) => setTargetYieldQAcre(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-black text-white text-xs py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>{isLoading ? "Creating Profile..." : "Create Profile & Open Farm"}</span>
              </button>
            </div>

          </form>
        )}

        <div className="text-center mt-6 text-xs text-[#6F6F6F]">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Sign In to Existing Farm
          </Link>
        </div>

      </div>
    </div>
  );
};
