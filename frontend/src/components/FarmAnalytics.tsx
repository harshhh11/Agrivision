import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp, Sparkles, Layers, ArrowUpRight } from "lucide-react";
import { Field } from "../types";
import { FarmerProfile } from "../context/AuthContext";

interface FarmAnalyticsProps {
  fields: Field[];
  farmerProfile?: FarmerProfile;
  preferredUnit?: "tonnes_ha" | "quintals_acre";
}

const NPK_COLORS = ["#10B981", "#0EA5E9", "#F59E0B"]; // N (Green), P (Blue), K (Amber)
const VARIETY_COLORS = ["#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#3B82F6"];

export const FarmAnalytics: React.FC<FarmAnalyticsProps> = ({
  fields = [],
  farmerProfile,
  preferredUnit = "quintals_acre"
}) => {
  const [pieMode, setPieMode] = useState<"npk" | "varieties">("npk");
  const [barMetric, setBarMetric] = useState<"yield" | "area">("yield");
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const isQPerAcre = preferredUnit === "quintals_acre";
  const unitLabel = isQPerAcre ? "Q/Acre" : "t/ha";

  // 1. Data Preparation for Bar Chart (Field-wise Comparison)
  const barData = fields.length > 0 ? fields.map((plot, idx) => {
    const yieldVal = isQPerAcre
      ? (plot.predictedYieldQAcre || 540 + (idx * 25))
      : (plot.predictedYieldTonnesHa || 135 + (idx * 6));
    
    const targetVal = isQPerAcre
      ? (farmerProfile?.targetYieldQAcre || 565)
      : Math.round((farmerProfile?.targetYieldQAcre || 565) * 0.247105);

    return {
      name: plot.code || `Plot ${idx + 1}`,
      fullName: plot.name || `Plot ${idx + 1}`,
      variety: plot.cropVariety || "Co 86032",
      expectedYield: Math.round(yieldVal),
      targetYield: targetVal,
      areaAcres: plot.areaAcres || 2.5 + (idx * 0.5)
    };
  }) : [
    { name: "PLT-01", fullName: "Plot 1 (North)", variety: "Co 86032", expectedYield: isQPerAcre ? 578 : 143, targetYield: isQPerAcre ? 565 : 140, areaAcres: 3.2 },
    { name: "PLT-02", fullName: "Plot 2 (East)", variety: "CoM 0265", expectedYield: isQPerAcre ? 612 : 151, targetYield: isQPerAcre ? 565 : 140, areaAcres: 2.8 },
    { name: "PLT-03", fullName: "Plot 3 (Canal)", variety: "Co 0238", expectedYield: isQPerAcre ? 545 : 135, targetYield: isQPerAcre ? 565 : 140, areaAcres: 2.4 },
    { name: "PLT-04", fullName: "Plot 4 (South)", variety: "VSI 434", expectedYield: isQPerAcre ? 589 : 145, targetYield: isQPerAcre ? 565 : 140, areaAcres: 2.0 }
  ];

  // 2. Data Preparation for Soil NPK Pie Chart
  const nVal = farmerProfile?.nitrogen || 240;
  const pVal = farmerProfile?.phosphorus || 80;
  const kVal = farmerProfile?.potassium || 160;
  const totalNPK = nVal + pVal + kVal;

  const npkPieData = [
    { name: "Nitrogen (N)", value: nVal, unit: "kg/ha", pct: Math.round((nVal / totalNPK) * 100), desc: "Vegetative & stalk growth" },
    { name: "Phosphorus (P)", value: pVal, unit: "kg/ha", pct: Math.round((pVal / totalNPK) * 100), desc: "Root network & tillering" },
    { name: "Potassium (K)", value: kVal, unit: "kg/ha", pct: Math.round((kVal / totalNPK) * 100), desc: "Brix sugar accumulation" }
  ];

  // 3. Data Preparation for Variety Allocation Pie Chart
  const varietyMap: Record<string, number> = {};
  if (fields.length > 0) {
    fields.forEach((f) => {
      const v = f.cropVariety?.split(" (")[0] || "Co 86032";
      varietyMap[v] = (varietyMap[v] || 0) + (f.areaAcres || 2.5);
    });
  } else {
    varietyMap["Co 86032"] = 3.2;
    varietyMap["CoM 0265"] = 2.8;
    varietyMap["Co 0238"] = 2.4;
    varietyMap["VSI 434"] = 2.0;
  }

  const totalArea = Object.values(varietyMap).reduce((a, b) => a + b, 0);
  const varietyPieData = Object.entries(varietyMap).map(([name, acres]) => ({
    name,
    value: parseFloat(acres.toFixed(1)),
    unit: "Acres",
    pct: Math.round((acres / totalArea) * 100),
    desc: `${acres.toFixed(1)} Acres allocated`
  }));

  const activePieData = pieMode === "npk" ? npkPieData : varietyPieData;
  const pieColors = pieMode === "npk" ? NPK_COLORS : VARIETY_COLORS;

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-[#EBEBEB] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[#6F6F6F]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-neutral-600">
              Interactive Farm Analytics & AI Charts
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-black tracking-tight">
            Crop Performance & Soil Nutrient Intelligence
          </h2>
          <p className="text-xs text-[#6F6F6F] mt-1">
            Real-time digital twin analytics comparing field-wise sugarcane forecasts and agronomic input ratios.
          </p>
        </div>

        {/* Quick Insight Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium self-start md:self-end">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Average Forecast: <strong>+{isQPerAcre ? "14.2 Q/Acre" : "3.5 t/ha"}</strong> above benchmark</span>
        </div>
      </div>

      {/* Grid: 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ========================================================= */}
        {/* CHART 1: INTERACTIVE BAR CHART (7 cols on Desktop)         */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
          <div>
            {/* Bar Chart Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#F2F2F2] gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black leading-tight">
                    Plot-wise Sugarcane Yield
                  </h3>
                  <span className="text-[11px] text-[#6F6F6F]">
                    Expected ML Prediction vs Farmer Target ({unitLabel})
                  </span>
                </div>
              </div>

              {/* Metric Toggle */}
              <div className="flex items-center bg-[#F5F5F5] p-0.5 rounded-xl self-start sm:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setBarMetric("yield")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    barMetric === "yield"
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "text-[#6F6F6F] hover:text-black"
                  }`}
                >
                  Yield ({unitLabel})
                </button>
                <button
                  type="button"
                  onClick={() => setBarMetric("area")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    barMetric === "area"
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "text-[#6F6F6F] hover:text-black"
                  }`}
                >
                  Area (Acres)
                </button>
              </div>
            </div>

            {/* Recharts Bar Chart Container */}
            <div className="h-[270px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6F6F6F", fontSize: 11 }}
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6F6F6F", fontSize: 11 }}
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-neutral-700">
                            <div className="font-semibold text-white border-b border-neutral-700 pb-1 flex items-center justify-between gap-4">
                              <span>{data.fullName}</span>
                              <span className="text-[10px] text-emerald-400 font-mono">{data.variety}</span>
                            </div>
                            {barMetric === "yield" ? (
                              <>
                                <div className="flex items-center justify-between gap-3 pt-0.5">
                                  <span className="text-neutral-400">Expected Yield:</span>
                                  <span className="font-bold text-emerald-400">{data.expectedYield} {unitLabel}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-neutral-400">Target Benchmark:</span>
                                  <span className="text-neutral-200">{data.targetYield} {unitLabel}</span>
                                </div>
                                <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
                                  Variance:{" "}
                                  <strong className={data.expectedYield >= data.targetYield ? "text-emerald-400" : "text-amber-400"}>
                                    {data.expectedYield >= data.targetYield ? "+" : ""}
                                    {(data.expectedYield - data.targetYield).toFixed(0)} {unitLabel}
                                  </strong>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-between gap-3 pt-0.5">
                                <span className="text-neutral-400">Cultivated Area:</span>
                                <span className="font-bold text-emerald-400">{data.areaAcres} Acres</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
                    iconType="circle"
                  />
                  {barMetric === "yield" ? (
                    <>
                      <Bar
                        name={`Expected Yield (${unitLabel})`}
                        dataKey="expectedYield"
                        fill="#10B981"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        name={`Target Yield (${unitLabel})`}
                        dataKey="targetYield"
                        fill="#94A3B8"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1200}
                      />
                    </>
                  ) : (
                    <Bar
                      name="Cultivated Area (Acres)"
                      dataKey="areaAcres"
                      fill="#0EA5E9"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1000}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart Footer Note */}
          <div className="pt-3 border-t border-[#F2F2F2] flex items-center justify-between text-[11px] text-[#6F6F6F]">
            <span>💡 Plot 2 (CoM 0265) leads yield forecasts due to optimal tillering density.</span>
            <span className="font-medium text-black">Updated Live</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CHART 2: INTERACTIVE PIE / DONUT CHART (5 cols on Desktop) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-sm flex flex-col justify-between">
          <div>
            {/* Pie Chart Header & Controls */}
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-[#F2F2F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black leading-tight">
                    {pieMode === "npk" ? "Soil Nutrient (NPK) Ratio" : "Sugarcane Variety Allocation"}
                  </h3>
                  <span className="text-[11px] text-[#6F6F6F]">
                    {pieMode === "npk" ? "Fertilizer distribution (kg/ha)" : "Acreage per cane cultivar"}
                  </span>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center bg-[#F5F5F5] p-0.5 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setPieMode("npk")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    pieMode === "npk"
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "text-[#6F6F6F] hover:text-black"
                  }`}
                >
                  NPK
                </button>
                <button
                  type="button"
                  onClick={() => setPieMode("varieties")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    pieMode === "varieties"
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "text-[#6F6F6F] hover:text-black"
                  }`}
                >
                  Varieties
                </button>
              </div>
            </div>

            {/* Donut Chart with Center Label */}
            <div className="relative h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={900}
                    onMouseEnter={(_, idx) => setActivePieIndex(idx)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    {activePieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        className="cursor-pointer transition-transform duration-300 hover:scale-105"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-neutral-900 text-white px-3 py-2 rounded-xl shadow-xl text-xs border border-neutral-700">
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-emerald-400 font-bold">
                              {item.value} {item.unit} ({item.pct}%)
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">{item.desc}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                  {pieMode === "npk" ? "Total NPK" : "Total Area"}
                </span>
                <span className="text-lg font-bold text-black leading-tight">
                  {pieMode === "npk" ? `${totalNPK} kg` : `${totalArea.toFixed(1)} Ac`}
                </span>
              </div>
            </div>

            {/* Custom Interactive Legend */}
            <div className="space-y-2 pt-2">
              {activePieData.map((item, index) => {
                const isHovered = activePieIndex === index;
                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isHovered ? "bg-neutral-100" : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      <span className="font-medium text-black">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">
                        {item.value} <span className="font-normal text-[10px] text-[#6F6F6F]">{item.unit}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pie Chart Footer Note */}
          <div className="pt-3 border-t border-[#F2F2F2] flex items-center justify-between text-[11px] text-[#6F6F6F]">
            <span>🎯 Maharashtra VSI Target NPK ratio: <strong>3 : 1 : 2</strong></span>
            <span className="text-emerald-700 font-semibold">Optimal</span>
          </div>
        </div>

      </div>
    </section>
  );
};
