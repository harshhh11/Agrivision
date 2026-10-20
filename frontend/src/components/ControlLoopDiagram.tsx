import React from "react";
import { ArrowRight, Cpu, Radio, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export const ControlLoopDiagram: React.FC = () => {
  const steps = [
    { number: "01", name: "Physical Farm", desc: "Soil, micro-climate, crops, and sensors" },
    { number: "02", name: "Telemetry Ingestion", desc: "IoT probes, weather station, Sentinel-2" },
    { number: "03", name: "Digital Twin", desc: "Living spatial-temporal farm replica" },
    { number: "04", name: "ML Yield Prediction", desc: "Gradient boosting & climate attributions" },
    { number: "05", name: "Prescriptive Advice", desc: "Explainable agronomic recommendations" },
    { number: "06", name: "Farmer Confirmation", desc: "Action execution, irrigation, or snooze" },
    { number: "07", name: "Updated Twin State", desc: "Continuous closed-loop calibration" },
  ];

  return (
    <section className="py-20 bg-white/85 backdrop-blur-xl border-y border-white/60 text-black my-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#6F6F6F] block mb-2">
            Architectural Paradigm
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-black">
            The Closed Digital Twin Loop
          </h2>
          <p className="text-sm text-[#6F6F6F] mt-3 leading-relaxed">
            AgriVision pairs real-time physical observations with predictive models. Every farmer decision updates the twin, creating an ever-calibrating cycle of continuous learning.
          </p>
        </div>

        {/* The 7 Steps Horizontal Timeline / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-12">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative p-4 rounded-xl bg-white border border-[#EBEBEB] hover:border-black transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <span className="font-mono text-[10px] text-[#6F6F6F] block mb-1">
                  {step.number}
                </span>
                <h3 className="font-serif text-lg font-medium text-black leading-snug mb-1 group-hover:text-emerald-800 transition-colors">
                  {step.name}
                </h3>
                <p className="text-[11px] text-[#6F6F6F] leading-normal">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 border border-[#EBEBEB] text-[#9E9E9E]">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Twin Maturity Levels & Human in the loop confirmation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#EBEBEB]">
          <div className="p-5 rounded-xl bg-white border border-[#EBEBEB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-mono text-[#6F6F6F]">Stage 1</span>
              <Radio className="w-4 h-4 text-neutral-500" />
            </div>
            <h4 className="font-serif text-xl text-black mb-1">Monitoring Twin</h4>
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              Continuous live telemetry of soil moisture, surface temperature, humidity, and 10m Sentinel-2 biomass indices.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#EBEBEB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-mono text-emerald-700">Stage 2 (Active)</span>
              <Cpu className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="font-serif text-xl text-black mb-1">Predictive Twin</h4>
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              Ensemble machine learning models forecast seasonal yield, harvest timing, water stress windows, and climate risks.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#EBEBEB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-mono text-black">Stage 3</span>
              <Shield className="w-4 h-4 text-black" />
            </div>
            <h4 className="font-serif text-xl text-black mb-1">Prescriptive Twin</h4>
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              Explainable AI formulates variable-rate irrigation, nutrient top-dressing, and harvest scheduling with farmer sign-off.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EBEBEB] text-xs text-[#6F6F6F]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farmer sovereign confirmation required. AgriVision never executes autonomous physical actions without verification.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
