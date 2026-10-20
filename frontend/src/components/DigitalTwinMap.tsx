import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Tooltip, useMap } from "react-leaflet";
import { Field } from "../types";
import { useI18n } from "../i18n";
import { Layers, Sprout, Droplets, TrendingUp } from "lucide-react";

interface DigitalTwinMapProps {
  fields: Field[];
  selectedField?: Field | null;
  onSelectField?: (field: Field) => void;
  height?: string;
  showLayerSelector?: boolean;
}

type MapTheme = "boundary" | "ndvi" | "moisture" | "yield";

// Rural Maharashtra agricultural sugarcane plains (Shirol / Panchganga-Krishna basin)
const RURAL_MAHARASHTRA_CENTER: [number, number] = [16.7820, 74.5240];

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on mount and layout render to fix any grey tiles / sizing bugs
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.0 });
  }, [center, map]);

  return null;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  fields,
  selectedField,
  onSelectField,
  height = "100%",
  showLayerSelector = true
}) => {
  const [activeLayer, setActiveLayer] = useState<MapTheme>("boundary");
  const { t, formatYield, language } = useI18n();

  const centerCoord = selectedField?.boundaryPolygon?.[0] || RURAL_MAHARASHTRA_CENTER;

  // Status text helper in selected language
  const getFieldStatusText = (field: Field, index: number) => {
    if (field.riskLevel === "Moderate" || field.riskLevel === "High" || index === 3) {
      return t("fieldStatusAttention");
    }
    if (index === 2) {
      return t("fieldStatusGood");
    }
    return t("fieldStatusHealthy");
  };

  const getFieldColor = (field: Field, index: number) => {
    const isSelected = selectedField?._id === field._id;

    if (activeLayer === "ndvi") {
      if ((field.currentNDVI || 0.8) >= 0.82) return isSelected ? "#15803D" : "#22C55E";
      if ((field.currentNDVI || 0.8) >= 0.75) return isSelected ? "#4D7C0F" : "#84CC16";
      return isSelected ? "#B45309" : "#EAB308";
    }

    if (activeLayer === "moisture") {
      if ((field.currentSoilMoisture || 34) >= 33.0) return isSelected ? "#0369A1" : "#0EA5E9";
      if ((field.currentSoilMoisture || 34) >= 28.0) return isSelected ? "#0284C7" : "#38BDF8";
      return isSelected ? "#B91C1C" : "#EF4444";
    }

    if (activeLayer === "yield") {
      const yVal = field.predictedYieldTonnesHa || field.predictedYield || 135;
      if (yVal >= 135.0) return isSelected ? "#047857" : "#10B981";
      if (yVal >= 120.0) return isSelected ? "#059669" : "#34D399";
      return isSelected ? "#B45309" : "#F59E0B";
    }

    // Default Boundary Layer: subtle green for healthy/good, subtle amber for attention
    if (field.riskLevel === "Moderate" || field.riskLevel === "High" || index === 3) {
      return isSelected ? "#B45309" : "#D97706";
    }
    return isSelected ? "#15803D" : "#16A34A";
  };

  const getFieldBorderColor = (field: Field, index: number) => {
    const isSelected = selectedField?._id === field._id;
    if (isSelected) return "#000000";
    if (field.riskLevel === "Moderate" || field.riskLevel === "High" || index === 3) {
      return "#B45309";
    }
    return "#15803D";
  };

  return (
    <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-[#E5E5E5] bg-[#F4F4F4] shadow-xs flex flex-col">
      
      {/* ==================================================
          MAP LAYER SELECTOR (Z-400)
          ================================================== */}
      {showLayerSelector && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-[400] flex flex-wrap items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-black/10 shadow-sm text-xs">
          <div className="flex items-center gap-1.5 pr-2 mr-1 border-r border-black/10 text-[#6F6F6F]">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider">{t("mapLayersLabel")}</span>
          </div>

          <button
            onClick={() => setActiveLayer("boundary")}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeLayer === "boundary"
                ? "bg-black text-white shadow-xs"
                : "text-[#6F6F6F] hover:text-black hover:bg-neutral-100"
            }`}
          >
            {t("layerSugarcanePlots")}
          </button>

          <button
            onClick={() => setActiveLayer("ndvi")}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeLayer === "ndvi"
                ? "bg-black text-white shadow-xs"
                : "text-[#6F6F6F] hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Sprout className="w-3 h-3 text-emerald-500" />
            {t("layerGreenness")}
          </button>

          <button
            onClick={() => setActiveLayer("moisture")}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeLayer === "moisture"
                ? "bg-black text-white shadow-xs"
                : "text-[#6F6F6F] hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Droplets className="w-3 h-3 text-sky-500" />
            {t("layerRootMoisture")}
          </button>

          <button
            onClick={() => setActiveLayer("yield")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeLayer === "yield"
                ? "bg-black text-white shadow-xs"
                : "text-[#6F6F6F] hover:text-black hover:bg-neutral-100"
            }`}
          >
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            {t("layerExpectedYield")}
          </button>
        </div>
      )}

      {/* ==================================================
          LEAFLET SATELLITE MAP CONTAINER
          ================================================== */}
      <div className="flex-1 w-full min-h-[420px] relative">
        <MapContainer
          center={centerCoord}
          zoom={15}
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ height: "100%", width: "100%" }}
        >
          <MapController center={centerCoord} />

          {/* High-resolution satellite basemap with Esri Attribution */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> Satellite'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />

          {fields.map((field, idx) => {
            const isSelected = selectedField?._id === field._id;
            const fillColor = getFieldColor(field, idx);
            const borderColor = getFieldBorderColor(field, idx);
            const statusText = getFieldStatusText(field, idx);
            const yFormatted = formatYield(
              field.predictedYieldTonnesHa || field.predictedYield || 135,
              field.predictedYieldQAcre || 540
            );

            // Clean short name for map badge: "Field 1" / "खेत 1" / "शेत 1"
            const shortFieldLabel = `${t("fieldLabel")} ${idx + 1}`;

            return (
              <Polygon
                key={field._id || `field-${idx}`}
                positions={field.boundaryPolygon as any}
                pathOptions={{
                  color: borderColor,
                  weight: isSelected ? 3.0 : 1.8,
                  fillColor: fillColor,
                  fillOpacity: isSelected ? 0.32 : 0.20,
                  dashArray: idx === 3 ? "5, 5" : undefined
                }}
                eventHandlers={{
                  click: () => {
                    if (onSelectField) onSelectField(field);
                  }
                }}
              >
                {/* Clean, lightweight translucent map label that does not obscure farmland */}
                <Tooltip
                  direction="center"
                  permanent
                  className="font-sans text-xs bg-white/90 text-neutral-900 backdrop-blur-md border border-black/15 rounded-md px-2 py-0.5 shadow-sm font-medium"
                >
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        idx === 3 ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                    />
                    <span className="font-semibold text-[11px] text-black">
                      {shortFieldLabel}
                    </span>
                    <span className="text-[10px] text-neutral-600 border-l border-neutral-300 pl-1.5">
                      {statusText}
                    </span>
                  </div>
                </Tooltip>

                {/* Interactive Field Popup */}
                <Popup className="font-sans text-xs">
                  <div className="p-1 space-y-1.5 min-w-[180px]">
                    <div className="flex items-center justify-between pb-1 border-b border-[#EBEBEB]">
                      <h4 className="font-semibold text-sm text-black">{field.name}</h4>
                      <span className="text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded">
                        {statusText}
                      </span>
                    </div>
                    <p className="text-[#6F6F6F] text-xs leading-relaxed">
                      {t("sugarcaneCrop")}: <strong className="text-neutral-800">{field.cropVariety || "Co 86032"}</strong><br />
                      {t("hectares")}: <strong className="text-neutral-800">{field.areaHa} ha</strong> ({field.areaAcres || (field.areaHa * 2.47).toFixed(1)} ac)<br />
                      {t("cropStage")}: <strong className="text-neutral-800">{field.cropStage || "Grand Growth"}</strong>
                    </p>
                    <div className="pt-1.5 border-t border-[#EBEBEB] text-xs font-mono flex items-center justify-between">
                      <span className="text-[#6F6F6F]">{t("cardExpectedCrop")}:</span>
                      <span className="font-bold text-black">{yFormatted.primary}</span>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}
        </MapContainer>
      </div>

      {/* ==================================================
          BOTTOM DEMO DISCLAIMER & LEGEND (Z-400)
          ================================================== */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 shadow-sm flex flex-wrap items-center gap-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-neutral-700 font-medium">{t("standardPlotLegend")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-neutral-700 font-medium">{t("attentionPlotLegend")}</span>
        </div>
        <span className="text-[#888888] text-[10px] border-l border-neutral-200 pl-2">
          {t("demoFarmMaharashtra")} • {t("demoFieldBoundaries")}
        </span>
      </div>
    </div>
  );
};
