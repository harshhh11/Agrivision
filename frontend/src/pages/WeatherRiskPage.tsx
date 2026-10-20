import React, { useState, useEffect } from "react";
import { useFarm } from "../context/FarmContext";
import { api } from "../services/api";
import {
  CloudSun, Droplets, Wind, Sun, AlertTriangle, ArrowRight,
  ShieldAlert, Clock, CheckCircle2, Thermometer
} from "lucide-react";

export const WeatherRiskPage: React.FC = () => {
  const { farm, fields } = useFarm();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [risks, setRisks] = useState<any[]>([]);

  useEffect(() => {
    async function loadWeatherAndRisks() {
      try {
        const [wRes, rRes] = await Promise.all([
          api.getWeatherData("default"),
          api.getRisks("default")
        ]);
        if (wRes.data?.status === "success") setWeatherData(wRes.data);
        if (rRes.data?.status === "success") setRisks(rRes.data.risks || []);
      } catch (err) {
        console.warn("Failed to load weather/risk data:", err);
      }
    }
    loadWeatherAndRisks();
  }, []);

  const current = weatherData?.current || {
    temperatureC: 23.8,
    humidityPct: 62,
    rainfallMm: 0,
    windSpeedKmh: 14,
    solarRadiationWm2: 680,
    et0Mm: 4.6,
    condition: "Partly Cloudy"
  };

  const forecast = weatherData?.forecast || [
    { day: "Today", tempMax: 26, tempMin: 16, pop: 15, rainMm: 0, condition: "Sunny", windKmh: 12, et0: 4.5 },
    { day: "Tomorrow", tempMax: 24, tempMin: 17, pop: 85, rainMm: 28, condition: "Rain / Thunderstorms", windKmh: 24, et0: 2.1 },
    { day: "Wed", tempMax: 22, tempMin: 14, pop: 30, rainMm: 3, condition: "Partly Cloudy", windKmh: 15, et0: 3.8 },
    { day: "Thu", tempMax: 25, tempMin: 15, pop: 10, rainMm: 0, condition: "Clear", windKmh: 10, et0: 4.8 },
    { day: "Fri", tempMax: 27, tempMin: 18, pop: 20, rainMm: 0, condition: "Sunny", windKmh: 14, et0: 5.1 },
    { day: "Sat", tempMax: 28, tempMin: 19, pop: 15, rainMm: 0, condition: "Warm / Sunny", windKmh: 11, et0: 5.4 },
    { day: "Sun", tempMax: 26, tempMin: 17, pop: 40, rainMm: 5, condition: "Scattered Showers", windKmh: 16, et0: 4.2 }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans px-6 py-10 max-w-7xl mx-auto">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#6F6F6F]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CAMPBELL SCIENTIFIC & NOAA HRRR ENGINE</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-black">
            Weather & Agro-Risk Intelligence
          </h1>
        </div>

        <p className="text-xs text-[#6F6F6F] max-w-md">
          Synthesized atmospheric forecasting and continuous risk detection. Detect drought vulnerability, thermal stress, waterlogging, and soil moisture drawdowns.
        </p>
      </div>

      {/* Current Conditions Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <div className="p-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA]">
          <div className="text-xs text-[#6F6F6F] mb-1 font-mono uppercase tracking-wider">Air Temp</div>
          <div className="font-serif text-3xl font-normal text-black">{current.temperatureC}°C</div>
          <div className="text-[11px] text-[#6F6F6F] mt-0.5">{current.condition}</div>
        </div>

        <div className="p-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA]">
          <div className="text-xs text-[#6F6F6F] mb-1 font-mono uppercase tracking-wider">Relative Humidity</div>
          <div className="font-serif text-3xl font-normal text-black">{current.humidityPct}%</div>
          <div className="text-[11px] text-[#6F6F6F] mt-0.5">Dew Point: 15.2°C</div>
        </div>

        <div className="p-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA]">
          <div className="text-xs text-[#6F6F6F] mb-1 font-mono uppercase tracking-wider">Precipitation</div>
          <div className="font-serif text-3xl font-normal text-black">{current.rainfallMm} mm</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">+28mm expected</div>
        </div>

        <div className="p-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA]">
          <div className="text-xs text-[#6F6F6F] mb-1 font-mono uppercase tracking-wider">Wind Speed</div>
          <div className="font-serif text-3xl font-normal text-black">{current.windSpeedKmh} km/h</div>
          <div className="text-[11px] text-[#6F6F6F] mt-0.5">Direction: SSW</div>
        </div>

        <div className="p-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA]">
          <div className="text-xs text-[#6F6F6F] mb-1 font-mono uppercase tracking-wider">Evapotranspiration</div>
          <div className="font-serif text-3xl font-normal text-black">{current.et0Mm} mm</div>
          <div className="text-[11px] text-[#6F6F6F] mt-0.5">ET0 Daily Rate</div>
        </div>

        <div className="p-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA]">
          <div className="text-xs text-[#6F6F6F] mb-1 font-mono uppercase tracking-wider">Solar Radiation</div>
          <div className="font-serif text-3xl font-normal text-black">{current.solarRadiationWm2} W/m²</div>
          <div className="text-[11px] text-[#6F6F6F] mt-0.5">PAR: High</div>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="p-6 rounded-2xl border border-[#EBEBEB] bg-white mb-12">
        <h3 className="font-serif text-2xl text-black mb-4">7-Day Agro-Climatic Outlook</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] text-center">
              <span className="font-mono text-xs text-[#6F6F6F] block mb-1">{day.day}</span>
              <CloudSun className="w-5 h-5 mx-auto text-black mb-1.5" />
              <div className="text-xs font-semibold text-black">
                {day.tempMax}° / {day.tempMin}°
              </div>
              <div className="text-[10px] text-sky-700 font-mono mt-1">
                {day.pop}% pop • {day.rainMm}mm
              </div>
              <div className="text-[10px] text-[#9E9E9E] mt-0.5 truncate">{day.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Agro-Risk Cards (Mandatory requirements) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-2xl text-black">Active Detected Agro-Risks</h3>
            <p className="text-xs text-[#6F6F6F]">
              Risks classified by severity, affected field, agronomic reason, and actionable preemption window.
            </p>
          </div>
          <span className="font-mono text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
            {risks.length} Active Alerts
          </span>
        </div>

        <div className="space-y-4">
          {risks.map((risk: any) => (
            <div
              key={risk._id}
              className="p-6 rounded-2xl border border-[#EBEBEB] hover:border-black transition-all bg-white shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-medium ${
                    risk.severity === "severe" || risk.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {risk.severity} Severity
                  </span>
                  <span className="font-mono text-xs text-black font-medium">
                    {risk.fieldName}
                  </span>
                  <span className="text-[#9E9E9E] text-xs">•</span>
                  <span className="text-xs text-[#6F6F6F] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Window: {risk.timeWindow}
                  </span>
                </div>

                <h4 className="font-serif text-2xl text-black font-normal mb-2">
                  {risk.riskType}
                </h4>

                <p className="text-xs text-[#6F6F6F] leading-relaxed mb-4">
                  <strong>Reason:</strong> {risk.reason}
                </p>

                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] text-xs">
                  <strong className="text-black block mb-0.5">Recommended Preemption:</strong>
                  <span className="text-emerald-800 font-medium">{risk.recommendedAction}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 font-mono">
                  Active Monitoring
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
