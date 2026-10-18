import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DistrictData, StateOverviewData, SupplyStatus } from '../types';
import indiaGeoData from '../data/india_states_geo.json';
import {
  Layers,
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Info,
  Building2,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface IndiaChoroplethMapProps {
  states: StateOverviewData[];
  selectedState: StateOverviewData;
  selectedDistrict: DistrictData;
  onSelectState: (stateName: string) => void;
  onSelectDistrict: (districtId: string) => void;
}

// Known coordinates for Indian districts across mockData
const DISTRICT_COORDINATES: Record<
  string,
  { lat: number; lng: number; state: string; name: string }
> = {
  pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra', name: 'Pune' },
  'mumbai-suburban': { lat: 19.076, lng: 72.8777, state: 'Maharashtra', name: 'Mumbai Suburban' },
  nagpur: { lat: 21.1458, lng: 79.0882, state: 'Maharashtra', name: 'Nagpur' },
  nashik: { lat: 19.9975, lng: 73.7898, state: 'Maharashtra', name: 'Nashik' },
  'bengaluru-urban': { lat: 12.9716, lng: 77.5946, state: 'Karnataka', name: 'Bengaluru Urban' },
  mysuru: { lat: 12.2958, lng: 76.6394, state: 'Karnataka', name: 'Mysuru' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, state: 'Gujarat', name: 'Ahmedabad' },
  surat: { lat: 21.1702, lng: 72.8311, state: 'Gujarat', name: 'Surat' },
  chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', name: 'Chennai' },
  coimbatore: { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu', name: 'Coimbatore' },
  'gautam-buddha-nagar': { lat: 28.5355, lng: 77.391, state: 'Uttar Pradesh', name: 'Gautam Buddha Nagar (Noida)' },
  lucknow: { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', name: 'Lucknow' },
  jaipur: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan', name: 'Jaipur' },
};

// State-level macro metrics & supply classification
const STATE_STATUS_LOOKUP: Record<
  string,
  { status: SupplyStatus; demand: string; trained: string; gap: string }
> = {
  Maharashtra: { status: 'Undersupply', demand: '3.2 Lakh', trained: '2.6 Lakh', gap: '+60,000' },
  Karnataka: { status: 'Undersupply', demand: '2.4 Lakh', trained: '1.95 Lakh', gap: '+45,000' },
  Gujarat: { status: 'Moderate', demand: '2.1 Lakh', trained: '1.78 Lakh', gap: '+32,000' },
  'Tamil Nadu': { status: 'Balanced', demand: '2.3 Lakh', trained: '2.15 Lakh', gap: '+15,000' },
  'Uttar Pradesh': { status: 'Undersupply', demand: '2.9 Lakh', trained: '2.42 Lakh', gap: '+48,000' },
  Rajasthan: { status: 'Moderate', demand: '1.75 Lakh', trained: '1.48 Lakh', gap: '+27,000' },
  Telangana: { status: 'Undersupply', demand: '1.8 Lakh', trained: '1.35 Lakh', gap: '+45,000' },
  Kerala: { status: 'Balanced', demand: '1.2 Lakh', trained: '1.18 Lakh', gap: '+2,000' },
  'West Bengal': { status: 'Moderate', demand: '1.6 Lakh', trained: '1.38 Lakh', gap: '+22,000' },
  'Madhya Pradesh': { status: 'Undersupply', demand: '1.9 Lakh', trained: '1.55 Lakh', gap: '+35,000' },
  Bihar: { status: 'Oversupply', demand: '1.4 Lakh', trained: '1.58 Lakh', gap: '-18,000' },
  Odisha: { status: 'Balanced', demand: '1.1 Lakh', trained: '1.05 Lakh', gap: '+5,000' },
  Punjab: { status: 'Moderate', demand: '1.3 Lakh', trained: '1.12 Lakh', gap: '+18,000' },
  Haryana: { status: 'Undersupply', demand: '1.7 Lakh', trained: '1.32 Lakh', gap: '+38,000' },
  Assam: { status: 'Moderate', demand: '0.85 Lakh', trained: '0.72 Lakh', gap: '+13,000' },
  Jharkhand: { status: 'Balanced', demand: '0.95 Lakh', trained: '0.92 Lakh', gap: '+3,000' },
  Chhattisgarh: { status: 'Balanced', demand: '0.9 Lakh', trained: '0.88 Lakh', gap: '+2,000' },
  'Andhra Pradesh': { status: 'Moderate', demand: '1.65 Lakh', trained: '1.42 Lakh', gap: '+23,000' },
  Uttarakhand: { status: 'Balanced', demand: '0.6 Lakh', trained: '0.58 Lakh', gap: '+2,000' },
  'Himachal Pradesh': { status: 'Balanced', demand: '0.45 Lakh', trained: '0.44 Lakh', gap: '+1,000' },
  'Jammu & Kashmir': { status: 'Moderate', demand: '0.55 Lakh', trained: '0.46 Lakh', gap: '+9,000' },
  Ladakh: { status: 'Balanced', demand: '0.12 Lakh', trained: '0.11 Lakh', gap: '+1,000' },
  'NCT of Delhi': { status: 'Undersupply', demand: '1.5 Lakh', trained: '1.1 Lakh', gap: '+40,000' },
  Goa: { status: 'Balanced', demand: '0.25 Lakh', trained: '0.24 Lakh', gap: '+1,000' },
};

const getStatusColor = (status: SupplyStatus): string => {
  switch (status) {
    case 'Undersupply':
      return '#E0634E'; // Terracotta coral
    case 'Moderate':
      return '#F2B968'; // Warm saffron
    case 'Balanced':
      return '#88B984'; // Sage green
    case 'Oversupply':
      return '#2B7A66'; // Forest teal
    default:
      return '#D8C3A5';
  }
};

/**
 * Mercator projection function to render GeoJSON features into crisp SVG paths
 */
function geoJsonToSvgPath(
  geometry: any,
  width = 500,
  height = 540,
  padX = 18,
  padY = 16
): string {
  // Official India Bounding Box Coordinates
  const minLon = 68.1;
  const maxLon = 97.4;
  const minLat = 6.6;
  const maxLat = 37.3;

  const scaleX = (width - 2 * padX) / (maxLon - minLon);
  const scaleY = (height - 2 * padY) / (maxLat - minLat);

  const project = (lon: number, lat: number) => {
    const x = padX + (lon - minLon) * scaleX;
    const y = padY + (maxLat - lat) * scaleY;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const ringToD = (ring: number[][]) => {
    if (!ring || ring.length < 3) return '';
    const points = ring.map(([lon, lat]) => project(lon, lat));
    return `M${points[0]} L${points.slice(1).join(' ')} Z`;
  };

  if (!geometry) return '';
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(ringToD).join(' ');
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.flatMap((poly: number[][][]) => poly.map(ringToD)).join(' ');
  }
  return '';
}

export const IndiaChoroplethMap: React.FC<IndiaChoroplethMapProps> = ({
  states,
  selectedState,
  selectedDistrict,
  onSelectState,
  onSelectDistrict,
}) => {
  const [mapMode, setMapMode] = useState<'gis' | 'vector'>('gis');
  const [tileLayerType, setTileLayerType] = useState<'esri' | 'osm'>('esri');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [vectorZoom, setVectorZoom] = useState<number>(1);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Flatten all available districts from states data
  const allDistricts = useMemo(() => {
    return states.flatMap((s) => s.districts);
  }, [states]);

  // Generate SVG path representations for the Vector Choropleth View
  const vectorPaths = useMemo(() => {
    const features = (indiaGeoData as any)?.features || [];
    return features.map((feature: any, idx: number) => {
      const stateName = feature.properties?.ST_NM || `State-${idx}`;
      const pathD = geoJsonToSvgPath(feature.geometry, 500, 540);
      const lookup = STATE_STATUS_LOOKUP[stateName] || { status: 'Balanced' as SupplyStatus };
      return {
        id: `feat-${idx}`,
        stateName,
        pathD,
        status: lookup.status,
      };
    });
  }, []);

  // Initialize and manage the Leaflet GIS Map
  useEffect(() => {
    if (mapMode !== 'gis' || !mapContainerRef.current) return;

    // Destroy any existing Leaflet map instance before creating a new one
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [22.8, 80.5],
      zoom: 4.6,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
    });
    leafletMapRef.current = map;

    // Add standard zoom control at top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Tile Layer: Clean Canvas (Esri World Light Gray) or OpenStreetMap (No API key needed)
    const tileUrl =
      tileLayerType === 'esri'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution:
        tileLayerType === 'esri'
          ? 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    tileLayer.addTo(map);

    // Real India State GeoJSON Overlay Layer
    const geoLayer = L.geoJSON(indiaGeoData as any, {
      style: (feature) => {
        const stateName = feature?.properties?.ST_NM;
        const isSelected = stateName === selectedState.state;
        const lookup = STATE_STATUS_LOOKUP[stateName] || { status: 'Balanced' as SupplyStatus };
        const fillColor = getStatusColor(lookup.status);

        return {
          fillColor,
          weight: isSelected ? 2.5 : 1.2,
          opacity: 1,
          color: isSelected ? '#173F35' : '#FFFFFF',
          dashArray: isSelected ? '' : '2',
          fillOpacity: isSelected ? 0.65 : 0.42,
        };
      },
      onEachFeature: (feature, layer) => {
        const stateName = feature?.properties?.ST_NM;
        const lookup = STATE_STATUS_LOOKUP[stateName];

        if (lookup) {
          layer.bindTooltip(
            `<div class="p-1 font-sans text-xs">
              <div class="font-bold text-[#173F35]">${stateName}</div>
              <div class="text-[11px] text-[#64716D]">Status: <span class="font-semibold">${lookup.status}</span></div>
              <div class="text-[11px] text-[#17604D]">Demand: ${lookup.demand}</div>
            </div>`,
            { sticky: true, opacity: 0.95 }
          );
        }

        layer.on({
          click: () => {
            if (stateName) onSelectState(stateName);
          },
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ fillOpacity: 0.8, weight: 2.2 });
          },
          mouseout: (e) => {
            geoLayer.resetStyle(e.target);
          },
        });
      },
    });

    geoLayer.addTo(map);
    geoJsonLayerRef.current = geoLayer;

    // Markers Layer for Key District Hotspots
    const markersGroup = L.layerGroup();

    if (showHotspots) {
      allDistricts.forEach((dist) => {
        const coords = DISTRICT_COORDINATES[dist.id];
        if (!coords) return;

        const isCurrent = dist.id === selectedDistrict.id;
        const color = getStatusColor(dist.status);

        // Custom High-Res Pulse Icon
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${
              isCurrent
                ? `<span class="animate-ping absolute inline-flex h-7 w-7 rounded-full opacity-60" style="background-color: ${color}"></span>`
                : ''
            }
            <div class="relative w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold text-white transition-transform duration-150 hover:scale-125" style="background-color: ${color}">
              ${isCurrent ? '★' : ''}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-district-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: customIcon });

        marker.bindPopup(
          `<div class="p-1 font-sans min-w-[170px]">
            <div class="text-xs font-bold text-[#173F35] pb-1 border-b border-[#E9E0D3]">
              ${dist.name}, ${coords.state}
            </div>
            <div class="mt-1.5 space-y-1 text-[11px]">
              <div class="flex justify-between text-[#64716D]">
                <span>Job Demand:</span> <span class="font-bold text-[#173F35]">${dist.demand.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-[#64716D]">
                <span>Trained:</span> <span class="font-bold text-[#173F35]">${dist.trained.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-[#64716D]">
                <span>Net Gap:</span> <span class="font-bold text-[#D94E34]">${dist.gap > 0 ? `+${dist.gap.toLocaleString('en-IN')}` : dist.gap.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-[#64716D]">
                <span>Utilization:</span> <span class="font-bold text-[#17604D]">${dist.seatUtilization}%</span>
              </div>
            </div>
          </div>`
        );

        marker.on('click', () => {
          onSelectState(coords.state);
          onSelectDistrict(dist.id);
        });

        markersGroup.addLayer(marker);
      });
    }

    markersGroup.addTo(map);
    markersLayerRef.current = markersGroup;

    // Pan map to selected district if available
    const activeCoords = DISTRICT_COORDINATES[selectedDistrict.id];
    if (activeCoords) {
      map.panTo([activeCoords.lat, activeCoords.lng], { animate: true });
    }

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [mapMode, tileLayerType, showHotspots, selectedState.state, selectedDistrict.id, allDistricts]);

  // Recenter Leaflet Map to All-India View
  const handleRecenterGis = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([22.8, 80.5], 4.6, { animate: true });
    }
  };

  const gapFormatted =
    selectedDistrict.gap >= 0
      ? `+${selectedDistrict.gap.toLocaleString('en-IN')}`
      : selectedDistrict.gap.toLocaleString('en-IN');

  return (
    <div className="relative w-full flex flex-col justify-between select-none">
      {/* Top Map Control Bar */}
      <div className="p-3 pb-2.5 bg-[#FFFEFB] border-b border-[#E9E0D3] flex flex-wrap items-center justify-between gap-2 z-20">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-[#FAF5EB] border border-[#EADBCA]">
          <button
            type="button"
            onClick={() => setMapMode('gis')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'gis'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Live GIS Map</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('vector')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'vector'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Survey of India Vector</span>
          </button>
        </div>

        {/* Right: GIS Contextual Controls */}
        <div className="flex items-center gap-2">
          {mapMode === 'gis' && (
            <>
              {/* Tile Style Picker */}
              <button
                type="button"
                onClick={() => setTileLayerType(tileLayerType === 'esri' ? 'osm' : 'esri')}
                className="px-2.5 py-1 rounded-md bg-[#FFFEFB] border border-[#E9E0D3] hover:bg-[#F5F0E7] text-[11px] font-medium text-[#173F35] transition-colors cursor-pointer flex items-center gap-1"
                title="Toggle between clean canvas and OpenStreetMap"
              >
                <Layers className="w-3 h-3 text-[#17604D]" />
                <span>{tileLayerType === 'esri' ? 'Clean Canvas' : 'Detailed OSM'}</span>
              </button>

              {/* District Hotspot Pins Toggle */}
              <button
                type="button"
                onClick={() => setShowHotspots(!showHotspots)}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  showHotspots
                    ? 'bg-[#EAF3EE] border-[#BBF7D0] text-[#166534]'
                    : 'bg-[#FFFEFB] border-[#E9E0D3] text-[#64716D]'
                }`}
                title="Toggle District ITI Pins"
              >
                <MapPin className="w-3 h-3" />
                <span>{showHotspots ? 'Pins On' : 'Pins Off'}</span>
              </button>

              {/* Reset to All India Center */}
              <button
                type="button"
                onClick={handleRecenterGis}
                className="p-1.5 rounded-md bg-[#FFFEFB] border border-[#E9E0D3] hover:bg-[#F5F0E7] text-[#173F35] cursor-pointer"
                title="Reset to All-India View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {mapMode === 'vector' && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVectorZoom((z) => Math.min(z + 0.2, 1.8))}
                className="p-1 rounded-md bg-[#FFFEFB] border border-[#E9E0D3] hover:bg-[#F5F0E7] text-[#173F35] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setVectorZoom((z) => Math.max(z - 0.2, 0.8))}
                className="p-1 rounded-md bg-[#FFFEFB] border border-[#E9E0D3] hover:bg-[#F5F0E7] text-[#173F35] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setVectorZoom(1)}
                className="p-1 rounded-md bg-[#FFFEFB] border border-[#E9E0D3] hover:bg-[#F5F0E7] text-[#173F35] cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[470px] bg-[#FAF8F3] overflow-hidden">
        {/* MODE 1: Interactive Leaflet GIS Map */}
        {mapMode === 'gis' && (
          <div
            ref={mapContainerRef}
            className="w-full h-full z-0"
            style={{ minHeight: '470px' }}
          />
        )}

        {/* MODE 2: Real Survey of India Vector Choropleth SVG */}
        {mapMode === 'vector' && (
          <div className="w-full h-full flex items-center justify-center overflow-hidden p-2">
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${vectorZoom})` }}
            >
              <svg
                viewBox="0 0 500 540"
                className="w-full h-full max-h-[460px] drop-shadow-sm"
                aria-label="Survey of India Vector Choropleth Map"
              >
                <g>
                  {vectorPaths.map((item) => {
                    const isSelected = item.stateName === selectedState.state;
                    const isHovered = item.stateName === hoveredState;
                    const color = getStatusColor(item.status);

                    return (
                      <path
                        key={item.id}
                        d={item.pathD}
                        fill={color}
                        fillOpacity={isSelected ? 0.95 : isHovered ? 0.82 : 0.65}
                        stroke={isSelected ? '#173F35' : '#FFFFFF'}
                        strokeWidth={isSelected ? 2.4 : 0.85}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredState(item.stateName)}
                        onMouseLeave={() => setHoveredState(null)}
                        onClick={() => onSelectState(item.stateName)}
                      >
                        <title>{`${item.stateName} · ${item.status}`}</title>
                      </path>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* Floating District Summary Card */}
        <div className="absolute right-3.5 bottom-3.5 bg-[#FFFEFB]/95 backdrop-blur-xs border border-[#E9E0D3] rounded-xl p-3.5 shadow-lg w-[218px] z-10 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#E9E0D3]">
            <div className="text-xs font-bold text-[#173F35] truncate">
              {selectedDistrict.name}
            </div>
            <span className="text-[10px] text-[#64716D] font-medium">{selectedState.state}</span>
          </div>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#64716D]">Job Demand</span>
              <span className="font-bold text-[#173F35] tabular-nums">
                {selectedDistrict.demand.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64716D]">Trained Candidates</span>
              <span className="font-bold text-[#173F35] tabular-nums">
                {selectedDistrict.trained.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64716D]">Net Skill Gap</span>
              <span
                className={`font-bold tabular-nums ${
                  selectedDistrict.gap > 0 ? 'text-[#D94E34]' : 'text-[#166534]'
                }`}
              >
                {gapFormatted}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE1]">
              <span className="text-[#64716D]">Supply Status</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: getStatusColor(selectedDistrict.status) }}
              >
                {selectedDistrict.status}
              </span>
            </div>
          </div>
        </div>

        {/* Information badge indicating live map status */}
        <div className="absolute top-3 left-3 z-10 bg-[#FFFEFB]/90 backdrop-blur-xs border border-[#E9E0D3] rounded-md px-2.5 py-1 text-[11px] text-[#173F35] font-medium shadow-2xs pointer-events-none flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#17604D] animate-pulse" />
          <span>
            {mapMode === 'gis'
              ? 'Real GIS Coordinates · Click states or district markers to filter'
              : 'Survey of India Boundaries · Click state polygons to filter'}
          </span>
        </div>
      </div>

      {/* Semantic Legend Bar */}
      <div className="px-4 py-2 bg-[#FFFEFB] border-t border-[#E9E0D3] flex flex-wrap items-center justify-between text-xs text-[#64716D]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E0634E' }} />
            <span>High Undersupply</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#F2B968' }} />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#88B984' }} />
            <span>Balanced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#2B7A66' }} />
            <span>High Oversupply</span>
          </div>
        </div>

        <div className="text-[11px] text-[#8E9B97]">
          Showing 36 States &amp; UTs · MSDE Labour Intelligence
        </div>
      </div>
    </div>
  );
};
