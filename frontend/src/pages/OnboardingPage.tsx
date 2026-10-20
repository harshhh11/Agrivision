import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFarm } from "../context/FarmContext";
import { api } from "../services/api";
import {
  Sprout, MapPin, Layers, Droplets, ShieldCheck,
  CheckCircle2, ArrowRight, ArrowLeft, User
} from "lucide-react";

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setFarm } = useFarm();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Step 1: Farmer & Location
  const [farmerName, setFarmerName] = useState<string>("Ramesh Patil");
  const [mobileNumber, setMobileNumber] = useState<string>("+91 98220 12345");
  const [state, setState] = useState<string>("Maharashtra");
  const [district, setDistrict] = useState<string>("Kolhapur");
  const [taluka, setTaluka] = useState<string>("Karveer");
  const [village, setVillage] = useState<string>("Kasba Bawada");

  // Step 2: Farm
  const [farmName, setFarmName] = useState<string>("Patil Sugarcane Farm");
  const [farmArea, setFarmArea] = useState<number>(12.5);
  const [areaUnit, setAreaUnit] = useState<"Hectare" | "Acre">("Hectare");

  // Step 3: Sugarcane Crop
  const [seedVariety, setSeedVariety] = useState<string>("Co 86032");
  const [cropStartDate, setCropStartDate] = useState<string>("2025-07-15");
  const [cropDuration, setCropDuration] = useState<number>(14);

  // Step 4: Soil
  const [soilType, setSoilType] = useState<string>("Black Soil");
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(80);
  const [potassium, setPotassium] = useState<number>(160);

  // Step 5: Irrigation
  const [irrigationFrequency, setIrrigationFrequency] = useState<string>("2 times/week");

  // Step 6: Farm Practices
  const [pestControl, setPestControl] = useState<string>("Integrated");

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const areaHa = areaUnit === "Hectare" ? Number(farmArea) : Number(farmArea) * 0.404686;
      const areaAcres = areaUnit === "Acre" ? Number(farmArea) : Number(farmArea) * 2.47105;

      const farmPayload = {
        name: farmName,
        locationName: `${village}, ${taluka}, ${district}, ${state}`,
        state,
        district,
        taluka,
        village,
        totalAreaHa: areaHa,
        totalAreaAcres: areaAcres,
        latitude: 16.7150,
        longitude: 74.2480,
        soilSummary: `${soilType} (Regur / Vertisol)`,
        primaryCrop: "Sugarcane"
      };

      const res = await api.post("/farms", farmPayload);
      if (res.data?.farm) {
        setFarm(res.data.farm);
      }
      navigate("/farm");
    } catch (err) {
      console.error("Failed to create farm:", err);
      navigate("/farm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-sans px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#EBEBEB] p-8 sm:p-10 shadow-xl">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-[#6F6F6F] mb-2">
            <span>STEP {step} OF 6</span>
            <span className="uppercase tracking-wider">
              {step === 1 && "Your Farmer Details"}
              {step === 2 && "Your Farm"}
              {step === 3 && "Sugarcane Crop"}
              {step === 4 && "Soil Nutrients"}
              {step === 5 && "Irrigation"}
              {step === 6 && "Farm Practices"}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Farmer & Location */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Step 1 — Your Farm Location</h2>
              <p className="text-xs text-[#6F6F6F] mt-1">Tell us about yourself and where your farm is located.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-black block mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black block mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black block mb-1">Taluka</label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black block mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Farm */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Step 2 — Farm Details</h2>
              <p className="text-xs text-[#6F6F6F] mt-1">Specify your sugarcane holding size.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-black block mb-1">Farm Name</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-black block mb-1">Farm Area</label>
                  <input
                    type="number"
                    step="0.1"
                    value={farmArea}
                    onChange={(e) => setFarmArea(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-black block mb-1">Unit</label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  >
                    <option value="Hectare">Hectare (ha)</option>
                    <option value="Acre">Acre</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Sugarcane Crop */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Step 3 — Sugarcane Variety</h2>
              <p className="text-xs text-[#6F6F6F] mt-1">Choose your planted variety and duration.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-black block mb-1">Sugarcane Seed Variety</label>
                <select
                  value={seedVariety}
                  onChange={(e) => setSeedVariety(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                >
                  <option value="Co 86032">Co 86032 (Nayana) — High Sugar Standard</option>
                  <option value="Co 0238">Co 0238 (Karan 4) — High Biomass</option>
                  <option value="CoM 0265">CoM 0265 (Phule 265) — Heavy Tillering</option>
                  <option value="Co 8014">Co 8014 (Mahalaxmi)</option>
                  <option value="Co 92005">Co 92005</option>
                  <option value="VSI 434">VSI 434</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-black block mb-1">Planting Date</label>
                  <input
                    type="date"
                    value={cropStartDate}
                    onChange={(e) => setCropStartDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-black block mb-1">Crop Duration</label>
                  <select
                    value={cropDuration}
                    onChange={(e) => setCropDuration(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                  >
                    <option value={10}>10 Months (Eksali)</option>
                    <option value={11}>11 Months (Ratoon)</option>
                    <option value={12}>12 Months (Suru Standard)</option>
                    <option value={14}>14 Months (Pre-seasonal)</option>
                    <option value={16}>16 Months (Adsali)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Soil */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Step 4 — Soil Nutrients</h2>
              <p className="text-xs text-[#6F6F6F] mt-1">Enter your soil type and NPK levels from your Soil Health Card.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-black block mb-1">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50"
                >
                  <option value="Black Soil">Black Soil (Vertisol / Regur)</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Alluvial">Alluvial</option>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#6F6F6F] block mb-1">Nitrogen (N)</label>
                  <input
                    type="number"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6F6F6F] block mb-1">Phosphorus (P)</label>
                  <input
                    type="number"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6F6F6F] block mb-1">Potassium (K)</label>
                  <input
                    type="number"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-[#EBEBEB] bg-neutral-50 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Irrigation */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Step 5 — Irrigation Frequency</h2>
              <p className="text-xs text-[#6F6F6F] mt-1">How frequently is your sugarcane irrigated?</p>
            </div>

            <div className="space-y-3">
              {["Daily Drip", "3 times/week", "2 times/week", "1 time/week", "Bi-weekly"].map((opt) => (
                <div
                  key={opt}
                  onClick={() => setIrrigationFrequency(opt)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    irrigationFrequency === opt
                      ? "border-black bg-neutral-50 shadow-xs"
                      : "border-[#EBEBEB] hover:border-black"
                  }`}
                >
                  <span className="text-sm font-medium text-black">{opt}</span>
                  {irrigationFrequency === opt && <CheckCircle2 className="w-4 h-4 text-black" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Farm Practices */}
        {step === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-black">Step 6 — Farm Practices</h2>
              <p className="text-xs text-[#6F6F6F] mt-1">Select your pest control and protection method.</p>
            </div>

            <div className="space-y-3">
              {[
                { name: "Integrated", desc: "Integrated Pest Management (Pheromone traps & biocontrol)" },
                { name: "Chemical", desc: "Chemical insecticidal applications" },
                { name: "Biological", desc: "Biological predators and organic botanicals" },
                { name: "None", desc: "No active protection" }
              ].map((opt) => (
                <div
                  key={opt.name}
                  onClick={() => setPestControl(opt.name)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    pestControl === opt.name
                      ? "border-black bg-neutral-50 shadow-xs"
                      : "border-[#EBEBEB] hover:border-black"
                  }`}
                >
                  <div>
                    <span className="text-sm font-semibold text-black block">{opt.name}</span>
                    <span className="text-xs text-[#6F6F6F]">{opt.desc}</span>
                  </div>
                  {pestControl === opt.name && <CheckCircle2 className="w-4 h-4 text-black" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#EBEBEB] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 text-xs text-[#6F6F6F] hover:text-black font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 bg-black text-white text-xs px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-black text-white text-xs px-8 py-3.5 rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Generating Farm Model..." : "Initialize Farm"}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
