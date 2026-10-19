import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  HeartPulse,
  Sprout,
  Monitor,
  HardHat,
  Cog,
  ShoppingBag,
  Utensils,
  Download,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
  ArrowUp,
  FileText,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  Cpu,
  Globe,
  CloudCog,
  Landmark,
  Lock,
  Leaf,
  Truck,
  Car,
  Shirt,
} from 'lucide-react';
import {
  HeaderIllustration,
  MiniIllustration,
  MandalaPattern,
} from './Assets';
import {
  SurfaceCard,
  PrimaryButton,
  SecondaryButton,
  SelectControl,
  FilterTabButton,
  DetailModal,
} from './DesignSystemUI';
import { IndiaChoroplethMap } from './IndiaChoroplethMap';
import {
  YEARLY_DEMAND_SUPPLY,
  QUICK_INSIGHTS,
  SECTOR_METRICS,
  TOP_TRADES_GROWTH,
  SOFTWARE_DEVELOPER_FORECAST,
  STATES_DATA,
  ALERTS_DATA,
  RECOMMENDATIONS_DATA,
} from '../data/mockData';
import {
  COMPREHENSIVE_DEMAND_SUPPLY_RECORDS,
  ALL_SECTORS_LIST,
} from '../data/demandSupplyData';
import { AlertItem, NavRouteId, RecommendationItem, TradeGrowthItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UserSession } from './AuthModal';
import { getUserRoleType, getRoleConfig, isRouteAllowedForSession } from '../utils/rbac';
import { getDashboardDataset, getHorizonConfig } from '../data/dashboardMetrics';
import { ApiService } from '../services/apiService';

/**
 * ============================================================================
 * PAGE 1: 01 — Dashboard Overview ("India's Skill Landscape at a Glance")
 * ============================================================================
 */
export const DashboardOverviewPage: React.FC<{
  onNavigate: (route: NavRouteId) => void;
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ onNavigate, userSession, dateRange = 'Last 1 Year', searchQuery = '' }) => {
  const { t } = useLanguage();
  const roleType = getUserRoleType(userSession);
  const roleConfig = getRoleConfig(userSession);
  const dataset = getDashboardDataset(roleType, dateRange);

  const [chartPeriod, setChartPeriod] = useState<'Yearly' | 'Quarterly'>('Yearly');
  const barsData = dataset.chart.bars[chartPeriod] || dataset.chart.bars.Yearly;

  const circumference = 276.46;
  const balancedOffset = 0;
  const undersupplyOffset = -((dataset.donut.balancedPct / 100) * circumference);
  const oversupplyOffset = -(
    ((dataset.donut.balancedPct + dataset.donut.undersupplyPct) / 100) *
    circumference
  );

  const filteredQuickInsights = searchQuery.trim()
    ? dataset.quickInsights.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dataset.quickInsights;

  return (
    <div key={`${roleType}-${dateRange}`} className="space-y-4 relative">
      {/* Top Heading Banner with Header Illustration on the Right */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1 pb-1 overflow-hidden">
        <div className="z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                roleType === 'DSO'
                  ? 'bg-[#EBF3FB] text-[#1E40AF] border border-[#BFDBFE]'
                  : roleType === 'NCVET'
                  ? 'bg-[#F3EFFB] text-[#5B21B6] border border-[#DDD6FE]'
                  : 'bg-[#EAF3EE] text-[#166534] border border-[#BBF7D0]'
              }`}
            >
              {roleConfig.badgeLabel}
            </span>
            <span className="text-[11px] text-[#64716D] font-medium">
              {roleConfig.jurisdiction}
            </span>
            <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 transition-all shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
              <span>{dateRange}</span>
              <span className="text-[#A57849]">·</span>
              <span className="font-normal text-[#6C5840]">{dataset.periodBadge}</span>
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-[26px] font-bold text-[#173F35] tracking-tight">
            {roleType === 'DSO'
              ? t("Pune District Skill Landscape (DSC Command)", "पुणे जिला कौशल परिदृश्य (डीएससी कमान)")
              : roleType === 'NCVET'
              ? t("National Qualifications & Standards Overview", "राष्ट्रीय योग्यता एवं मानक अवलोकन")
              : t("India's Skill Landscape at a Glance", "भारत का कौशल परिदृश्य एक नज़र में")}
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64716D] mt-1">
            {roleType === 'DSO'
              ? t("Local ITI seat capacity utilization, district deficit signals, and DSC target fulfillment", "स्थानीय आईटीआई क्षमता उपयोग एवं जिला घाटा संकेत")
              : roleType === 'NCVET'
              ? t("Curriculum obsolescence signals, NSQF credit distribution, and industry competency alignment", "पाठ्यक्रम अप्रचलन संकेत एवं एनएसक्यूएफ संरेखण")
              : t(
                  "Real-time insights to align training capacity with industry demand",
                  "उद्योग की मांग के साथ प्रशिक्षण क्षमता को संरेखित करने के लिए वास्तविक समय अंतर्दृष्टि"
                )}
          </p>
        </div>
        <div className="w-full lg:w-[54%] xl:w-[56%] shrink-0 -my-2">
          <HeaderIllustration className="w-full h-[88px] sm:h-[98px]" />
        </div>
      </div>

      {/* KPI Row — 4 Equal-Width Cards matching Reference Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Card 1 — Total Job Demand */}
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-1 flex items-start gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] text-[#3B66B8] flex items-center justify-center shrink-0 mt-0.5 kpi-icon-badge">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#64716D]">
              {t("Total Job Demand", "कुल रोजगार मांग")}
            </div>
            <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-0.5">
              {dataset.kpis.demand.value}
            </div>
            <div className="flex items-center gap-1 text-[11px] mt-1">
              <span className="font-semibold text-[#17604D] inline-flex items-center">
                {dataset.kpis.demand.trend}
              </span>
              <span className="text-[#64716D]">{dataset.kpis.demand.trendLabel}</span>
            </div>
          </div>
        </SurfaceCard>

        {/* Card 2 — Trained Candidates */}
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-2 flex items-start gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#E5F2E6] text-[#287D4E] flex items-center justify-center shrink-0 mt-0.5 kpi-icon-badge">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#64716D]">
              {t("Trained Candidates", "प्रशिक्षित उम्मीदवार")}
            </div>
            <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-0.5">
              {dataset.kpis.trained.value}
            </div>
            <div className="flex items-center gap-1 text-[11px] mt-1">
              <span className="font-semibold text-[#17604D] inline-flex items-center">
                {dataset.kpis.trained.trend}
              </span>
              <span className="text-[#64716D]">{dataset.kpis.trained.trendLabel}</span>
            </div>
          </div>
        </SurfaceCard>

        {/* Card 3 — Demand-Supply Gap */}
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-3 flex items-start gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#FBEAE4] text-[#D96843] flex items-center justify-center shrink-0 mt-0.5 kpi-icon-badge">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#64716D]">
              {t("Demand-Supply Gap", "मांग-आपूर्ति अंतर")}
            </div>
            <div className="text-2xl font-bold text-[#D94E34] tabular-nums mt-0.5">
              {dataset.kpis.gap.value}
            </div>
            <div className="text-[11px] text-[#64716D] mt-1">{dataset.kpis.gap.status}</div>
          </div>
        </SurfaceCard>

        {/* Card 4 — High-Growth Trades */}
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-4 flex items-start gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#F0EBF8] text-[#7A52B8] flex items-center justify-center shrink-0 mt-0.5 kpi-icon-badge">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#64716D]">
              {t("High-Growth Trades", "उच्च वृद्धि वाले व्यवसाय")}
            </div>
            <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-0.5">
              {dataset.kpis.highGrowth.value}
            </div>
            <div className="text-[11px] text-[#64716D] mt-1">{dataset.kpis.highGrowth.note}</div>
          </div>
        </SurfaceCard>
      </div>

      {/* Main Chart Row: Left Grouped Bar Chart (7 cols) + Right Doughnut Chart (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left Panel: Job Demand vs Trained Candidates */}
        <SurfaceCard className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-[#173F35]">
              {t("Job Demand vs Trained Candidates", "रोजगार मांग बनाम प्रशिक्षित उम्मीदवार")}
            </h2>
            <SelectControl
              compact
              value={chartPeriod}
              onChange={(val) => setChartPeriod(val as 'Yearly' | 'Quarterly')}
              options={[
                { label: 'Yearly', value: 'Yearly' },
                { label: 'Quarterly', value: 'Quarterly' },
              ]}
              className="w-28"
            />
          </div>

          {/* Compact Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#64716D] mb-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6E7FA3]" />
              {t('Job Demand')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#E28A86]" />
              {t('Trained Candidates')}
            </span>
          </div>

          {/* SVG Grouped Bar Chart with Pale Beige Grid Lines */}
          <div className="w-full pt-1">
            <svg viewBox="0 0 520 185" className="w-full h-[185px] overflow-visible">
              <defs>
                <linearGradient id="barDemandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8796BD" />
                  <stop offset="100%" stopColor="#647399" />
                </linearGradient>
                <linearGradient id="barTrainedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EB9A95" />
                  <stop offset="100%" stopColor="#D57A75" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {dataset.chart.gridLabels.map((grid) => (
                <g key={grid.label}>
                  <text
                    x="32"
                    y={grid.y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-[#64716D] tabular-nums"
                  >
                    {grid.label}
                  </text>
                  <line
                    x1="44"
                    y1={grid.y}
                    x2="505"
                    y2={grid.y}
                    stroke="#ECE4D7"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Grouped Bars */}
              {barsData.map((item, idx) => {
                const groupX = 76 + idx * 88;
                const demandHeight = Math.max(4, (item.demand / dataset.chart.yMax) * 135);
                const trainedHeight = Math.max(4, (item.trained / dataset.chart.yMax) * 135);
                return (
                  <g key={`${chartPeriod}-${item.year}`} className="group">
                    {/* Demand bar */}
                    <rect
                      x={groupX}
                      y={155 - demandHeight}
                      width="22"
                      height={demandHeight}
                      rx="3"
                      fill="url(#barDemandGrad)"
                      className="chart-bar-anim"
                      style={{ animationDelay: `${idx * 90}ms` }}
                    >
                      <title>{`${item.year} Job Demand: ${item.demandLabel}`}</title>
                    </rect>
                    {/* Trained bar */}
                    <rect
                      x={groupX + 25}
                      y={155 - trainedHeight}
                      width="22"
                      height={trainedHeight}
                      rx="3"
                      fill="url(#barTrainedGrad)"
                      className="chart-bar-anim"
                      style={{ animationDelay: `${idx * 90 + 50}ms` }}
                    >
                      <title>{`${item.year} Trained Candidates: ${item.trainedLabel}`}</title>
                    </rect>
                    {/* Year label */}
                    <text
                      x={groupX + 23.5}
                      y="174"
                      textAnchor="middle"
                      className="text-[11px] fill-[#64716D] font-medium tabular-nums"
                    >
                      {item.year}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </SurfaceCard>

        {/* Right Panel: Demand-Supply Status (All Trades) Doughnut Chart */}
        <SurfaceCard className="lg:col-span-5 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-[#173F35] mb-2">
            {t("Demand-Supply Status (All Trades)", "मांग-आपूर्ति स्थिति (सभी व्यवसाय)")}
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-auto py-2">
            {/* SVG Doughnut Chart */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {/* Background ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#F5F0E7"
                  strokeWidth="16"
                />
                {/* Balanced slice */}
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#5B9E68"
                  strokeWidth="16"
                  strokeDasharray={`${(dataset.donut.balancedPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={balancedOffset}
                  className="doughnut-animated doughnut-slice"
                >
                  <title>{`Balanced: ${dataset.donut.balancedPct}% of trades`}</title>
                </circle>
                {/* Undersupply slice */}
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#E56B55"
                  strokeWidth="16"
                  strokeDasharray={`${(dataset.donut.undersupplyPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={undersupplyOffset}
                  className="doughnut-animated doughnut-slice"
                >
                  <title>{`Undersupply: ${dataset.donut.undersupplyPct}% of trades`}</title>
                </circle>
                {/* Oversupply slice */}
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#F2B968"
                  strokeWidth="16"
                  strokeDasharray={`${(dataset.donut.oversupplyPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={oversupplyOffset}
                  className="doughnut-animated doughnut-slice"
                >
                  <title>{`Oversupply: ${dataset.donut.oversupplyPct}% of trades`}</title>
                </circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105 pointer-events-none">
                <span className="text-2xl font-bold text-[#173F35] tabular-nums leading-none">
                  {dataset.donut.totalTrades}
                </span>
                <span className="text-[11px] text-[#64716D] mt-1">{t('Total Trades')}</span>
              </div>
            </div>

            {/* Doughnut Legend */}
            <div className="space-y-3 w-full max-w-[180px]">
              <div className="flex items-center justify-between text-xs hover:translate-x-1 transition-transform cursor-default">
                <span className="inline-flex items-center gap-2 text-[#64716D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E56B55]" />
                  {t('Undersupply')}
                </span>
                <span className="font-bold text-[#173F35] tabular-nums">
                  {dataset.donut.undersupplyPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs hover:translate-x-1 transition-transform cursor-default">
                <span className="inline-flex items-center gap-2 text-[#64716D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5B9E68]" />
                  {t('Balanced')}
                </span>
                <span className="font-bold text-[#173F35] tabular-nums">
                  {dataset.donut.balancedPct}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs hover:translate-x-1 transition-transform cursor-default">
                <span className="inline-flex items-center gap-2 text-[#64716D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2B968]" />
                  {t('Oversupply')}
                </span>
                <span className="font-bold text-[#173F35] tabular-nums">
                  {dataset.donut.oversupplyPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#64716D] border-t border-[#F2ECE1] pt-2 flex items-center justify-between">
            <span>{t('Reference NSQF & NCO-2015 trade mapping')}</span>
            <button
              type="button"
              onClick={() => onNavigate('sectors')}
              className="text-[#17604D] font-semibold hover:underline cursor-pointer"
            >
              {t('Explore trades →')}
            </button>
          </div>
        </SurfaceCard>
      </div>

      {/* Quick Insights Row */}
      <SurfaceCard className="p-3.5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="text-xs font-bold text-[#173F35]">
            {t("Quick Insights", "त्वरित अंतर्दृष्टि")}
          </div>
          <div className="text-[11px] text-[#64716D]">
            Horizon: <span className="font-semibold text-[#173F35]">{dateRange}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {filteredQuickInsights.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.route)}
              className={`interactive-card group flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#EFE7DA] text-left cursor-pointer animate-card-slide-up anim-delay-${idx + 1}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    item.tone === 'coral'
                      ? 'bg-[#FBE5DE] text-[#D95338]'
                      : item.tone === 'sage'
                      ? 'bg-[#E2F0E3] text-[#287D4E]'
                      : item.tone === 'blue'
                      ? 'bg-[#E8EFFB] text-[#3563B8]'
                      : 'bg-[#FBF0D9] text-[#D97925]'
                  }`}
                >
                  {item.icon === 'heart' && <HeartPulse className="w-4 h-4" />}
                  {item.icon === 'leaf' && <Sprout className="w-4 h-4" />}
                  {item.icon === 'monitor' && <Monitor className="w-4 h-4" />}
                  {item.icon === 'crane' && <HardHat className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#173F35] truncate">{item.title}</div>
                  <div className="text-[11px] text-[#64716D] truncate mt-0.5">
                    {item.highlight && (
                      <span className="font-bold text-[#17604D] mr-1">{item.highlight}</span>
                    )}
                    {item.subtitle}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#17604D] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
};

/**
 * ============================================================================
 * PAGE 2: 02 — Geographic Intelligence ("India – District Level Labour Demand–Supply")
 * ============================================================================
 */
export const GeographicViewPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery = '' }) => {
  const { t } = useLanguage();
  const roleType = getUserRoleType(userSession);
  const isDsoLocked = roleType === 'DSO';
  const horizon = getHorizonConfig(dateRange);

  const [selectedStateName, setSelectedStateName] = useState<string>('Maharashtra');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('pune');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [viewMode, setViewMode] = useState<'Map' | 'Table'>('Map');
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  const effectiveStateName = isDsoLocked ? 'Maharashtra' : selectedStateName;
  const effectiveDistrictId = isDsoLocked ? 'pune' : selectedDistrictId;

  const currentState =
    STATES_DATA.find((s) => s.state === effectiveStateName) || STATES_DATA[0];
  const currentDistrict =
    currentState.districts.find((d) => d.id === effectiveDistrictId) ||
    currentState.districts[0];

  // Dynamic Horizon Scaled Metrics for Current State
  const scaledDemandNum = Math.round(currentState.demandNum * horizon.demandMultiplier);
  const scaledTrainedNum = Math.round(currentState.trainedNum * horizon.supplyMultiplier);
  const scaledGapNum = scaledDemandNum - scaledTrainedNum;

  const formatLakhOrCr = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    return `${(num / 100000).toFixed(1)} Lakh`;
  };

  const totalDemandLabel = formatLakhOrCr(scaledDemandNum);
  const totalTrainedLabel = formatLakhOrCr(scaledTrainedNum);
  const gapLabel = scaledGapNum >= 0 ? `+${scaledGapNum.toLocaleString('en-IN')}` : scaledGapNum.toLocaleString('en-IN');

  const handleStateChange = (stateName: string) => {
    if (isDsoLocked) return;
    const nextState = STATES_DATA.find(
      (s) =>
        s.state === stateName ||
        s.state.toLowerCase() === stateName.toLowerCase() ||
        (stateName.includes('Delhi') && s.state.includes('Delhi')) ||
        (stateName.includes('Andaman') && s.state.includes('Andaman')) ||
        (stateName.includes('Dadra') && s.state.includes('Dadra'))
    );
    if (nextState) {
      setSelectedStateName(nextState.state);
      if (nextState.districts.length > 0) {
        setSelectedDistrictId(nextState.districts[0].id);
      }
    } else {
      setSelectedStateName(stateName);
    }
  };

  const districtCatalogTrades = COMPREHENSIVE_DEMAND_SUPPLY_RECORDS
    .filter(
      (r) =>
        r.state.toLowerCase() === currentState.state.toLowerCase() &&
        (r.district.toLowerCase() === currentDistrict.name.toLowerCase() ||
         r.district.toLowerCase().includes(currentDistrict.name.toLowerCase()) ||
         currentDistrict.name.toLowerCase().includes(r.district.toLowerCase()))
    )
    .map((r) => ({
      name: r.tradeName,
      ncoCode: r.ncoCode,
      demand: Math.round(r.annualDemand * horizon.demandMultiplier),
      sector: r.sector,
    }));

  const combinedTrades =
    districtCatalogTrades.length > 0 ? districtCatalogTrades : currentDistrict.topTrades;

  const filteredTopTrades =
    selectedSector === 'All Sectors'
      ? combinedTrades
      : combinedTrades.filter((t) => t.sector === selectedSector);

  const displayedTrades =
    filteredTopTrades.length > 0
      ? filteredTopTrades
      : COMPREHENSIVE_DEMAND_SUPPLY_RECORDS
          .filter(
            (r) =>
              r.state.toLowerCase() === currentState.state.toLowerCase() &&
              (selectedSector === 'All Sectors' || r.sector === selectedSector)
          )
          .slice(0, 5)
          .map((r) => ({
            name: r.tradeName,
            ncoCode: r.ncoCode,
            demand: Math.round(r.annualDemand * horizon.demandMultiplier),
            sector: r.sector,
          }));

  return (
    <div className="space-y-4 relative pb-4">
      {/* Heading with Dynamic Horizon Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {isDsoLocked
              ? t("Pune District – Local Labour Demand–Supply Radar", "पुणे जिला – स्थानीय श्रम मांग–आपूर्ति रडार")
              : t("India – District Level Labour Demand–Supply", "भारत – जिला स्तरीय श्रम मांग–आपूर्ति")}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {isDsoLocked
              ? t("Hyper-local ITI absorption, DSC target tracking, and local employer cluster gap analysis", "हाइपर-लोकल आईटीआई अवशोषण एवं स्थानीय क्लस्टर विश्लेषण")
              : t(
                  "Explore demand, supply and gaps across States and Districts",
                  "राज्यों और जिलों में मांग, आपूर्ति और अंतर का अन्वेषण करें"
                )}
          </p>
        </div>
        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
          <span>{dateRange}</span>
          <span className="text-[#A57849]">·</span>
          <span className="font-normal text-[#6C5840]">{horizon.label}</span>
        </span>
      </div>

      {/* Filter Row */}
      <SurfaceCard className="p-3.5">
        {isDsoLocked && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-[#FBE5DE]/80 border border-[#F5D7CC] flex items-center justify-between text-xs text-[#C8432B]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>District Officer Jurisdiction Lock:</strong> You are authorized exclusively for <strong>Pune District (MH-492)</strong> under the District Skill Committee. State-wide cross-district alterations require State SSDM Director clearance.
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-[#F5D7CC] shrink-0">
              RBAC LEVEL 2
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-3">
            <SelectControl
              label="State"
              value={effectiveStateName}
              onChange={handleStateChange}
              disabled={isDsoLocked}
              options={
                isDsoLocked
                  ? [{ label: 'Maharashtra (Assigned Jurisdiction)', value: 'Maharashtra' }]
                  : STATES_DATA.map((s) => ({ label: s.state, value: s.state }))
              }
            />
          </div>
          <div className="lg:col-span-3">
            <SelectControl
              label="District"
              value={effectiveDistrictId}
              onChange={setSelectedDistrictId}
              disabled={isDsoLocked}
              options={
                isDsoLocked
                  ? [{ label: 'Pune (Assigned District MH-492)', value: 'pune' }]
                  : currentState.districts.map((d) => ({ label: d.name, value: d.id }))
              }
            />
          </div>
          <div className="lg:col-span-3">
            <SelectControl
              label="Sector"
              value={selectedSector}
              onChange={setSelectedSector}
              options={[
                { label: 'All Sectors', value: 'All Sectors' },
                ...ALL_SECTORS_LIST.map((sec) => ({ label: sec, value: sec })),
              ]}
            />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-1">
            <span className="text-[11px] font-medium text-[#64716D]">View</span>
            <div className="grid grid-cols-2 bg-[#F5F0E7] p-0.5 rounded-lg border border-[#E9E0D3]">
              <button
                type="button"
                onClick={() => setViewMode('Map')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'Map'
                    ? 'bg-[#1B2B44] text-white'
                    : 'text-[#64716D] hover:text-[#173F35]'
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setViewMode('Table')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'Table'
                    ? 'bg-[#1B2B44] text-white'
                    : 'text-[#64716D] hover:text-[#173F35]'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </SurfaceCard>

      {/* Main Content: 60% Choropleth Map / Table + 40% Right Overview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left 7 Cols: Choropleth Map or District Table */}
        <SurfaceCard className="lg:col-span-7 relative overflow-hidden flex flex-col justify-between">
          {viewMode === 'Map' ? (
            <IndiaChoroplethMap
              states={STATES_DATA}
              selectedState={currentState}
              selectedDistrict={currentDistrict}
              onSelectState={handleStateChange}
              onSelectDistrict={setSelectedDistrictId}
            />
          ) : (
            <div className="overflow-x-auto">
              <div className="text-xs font-bold text-[#173F35] mb-3 flex items-center justify-between">
                <span>District-Level Breakdown across Selected States</span>
                <span className="text-[11px] text-[#8C4E13] font-semibold bg-[#FAF0E1] px-2 py-0.5 rounded">
                  Horizon: {dateRange}
                </span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E9E0D3] text-[#64716D]">
                    <th className="py-2 px-2 font-semibold">District</th>
                    <th className="py-2 px-2 font-semibold">State</th>
                    <th className="py-2 px-2 font-semibold text-right">Demand</th>
                    <th className="py-2 px-2 font-semibold text-right">Trained</th>
                    <th className="py-2 px-2 font-semibold text-right">Gap</th>
                    <th className="py-2 px-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {STATES_DATA.flatMap((s) => s.districts)
                    .filter((dist) => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return dist.name.toLowerCase().includes(q) || dist.state.toLowerCase().includes(q);
                    })
                    .map((dist) => {
                      const distDemand = Math.round(dist.demand * horizon.demandMultiplier);
                      const distTrained = Math.round(dist.trained * horizon.supplyMultiplier);
                      const distGap = distDemand - distTrained;
                      return (
                        <tr
                          key={dist.id}
                          onClick={() => {
                            setSelectedStateName(dist.state);
                            setSelectedDistrictId(dist.id);
                          }}
                          className={`hover:bg-[#F5F0E7]/60 cursor-pointer ${
                            dist.id === currentDistrict.id ? 'bg-[#F5F0E7]' : ''
                          }`}
                        >
                          <td className="py-2.5 px-2 font-semibold text-[#173F35]">{dist.name}</td>
                          <td className="py-2.5 px-2 text-[#64716D]">{dist.state}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums">
                            {distDemand.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums">
                            {distTrained.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-2 text-right font-semibold text-[#D94E34] tabular-nums">
                            {distGap >= 0 ? `+${distGap.toLocaleString('en-IN')}` : distGap.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-2 text-right font-medium text-[#173F35]">
                            {dist.status}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* Subtle bottom-left heritage illustration accent */}
          <div className="pointer-events-none opacity-45 mt-1 -mx-4 -mb-4">
            <MiniIllustration className="w-56 h-14" />
          </div>
        </SurfaceCard>

        {/* Right 5 Cols: State Overview Card + Top High-Demand Trades Card */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* Card 1: State Overview */}
          <SurfaceCard className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#173F35]">
                  {currentState.state}{' '}
                  <span className="font-normal text-xs text-[#64716D]">({dateRange} Outlook)</span>
                </h2>
              </div>
              {/* Mini state map shape in warm saffron */}
              <svg viewBox="0 0 60 45" className="w-12 h-9 shrink-0">
                <path
                  d="M8,12 L34,8 L52,18 L46,36 L22,40 L10,28 Z"
                  fill="#F5D598"
                  stroke="#E2AF58"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#F2ECE1]">
              <div>
                <div className="text-[11px] text-[#64716D]">Total Job Demand</div>
                <div className="text-lg font-bold text-[#173F35] tabular-nums mt-0.5">
                  {totalDemandLabel}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#64716D]">Trained Candidates</div>
                <div className="text-lg font-bold text-[#173F35] tabular-nums mt-0.5">
                  {totalTrainedLabel}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#64716D]">Gap</div>
                <div className="text-lg font-bold text-[#D94E34] tabular-nums mt-0.5">
                  {gapLabel}
                </div>
              </div>
            </div>
          </SurfaceCard>

          {/* Card 2: Top High-Demand Trades in Selected District */}
          <SurfaceCard className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#173F35]">
                  Top High-Demand Trades ({currentDistrict.name})
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E9E0D3] text-[#17604D]">
                  LGD: {currentDistrict.id === 'pune' ? '492' : currentDistrict.id === 'kanpur' ? '158' : currentDistrict.id === 'bhubaneswar' ? '365' : '485'}
                </span>
              </div>
              <div className="divide-y divide-[#F2ECE1]">
                {displayedTrades.map((trade, index) => {
                  const scaledTradeDemand = Math.round(trade.demand * horizon.demandMultiplier);
                  return (
                    <div
                      key={trade.name}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-[#173F35]">
                        <span className="text-[#64716D] w-4 tabular-nums">{index + 1}.</span>
                        <div>
                          <span className="font-medium">{trade.name}</span>
                          <span className="ml-1.5 text-[10px] font-mono text-[#64716D] bg-[#F5F0E7] px-1.5 py-0.5 rounded">
                            NCO {trade.ncoCode}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-[#173F35] tabular-nums">
                        {scaledTradeDemand.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-2">
              <SecondaryButton
                tone="warm"
                onClick={() => setReportModalOpen(true)}
                className="w-full py-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Detailed District Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </SecondaryButton>
            </div>
          </SurfaceCard>
        </div>
      </div>

      {/* Detailed District Report Modal */}
      <DetailModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title={`${currentDistrict.name} District Skill Intelligence Dossier (${dateRange})`}
        subtitle={`${currentState.state} · Accredited Training Centres: ${currentDistrict.centresCount} · Seat Utilization: ${currentDistrict.seatUtilization}%`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3 bg-[#F8F5EF] p-3 rounded-lg border border-[#E9E0D3]">
            <div>
              <div className="text-[#64716D]">Projected Demand ({dateRange})</div>
              <div className="text-base font-bold text-[#173F35] tabular-nums mt-0.5">
                {Math.round(currentDistrict.demand * horizon.demandMultiplier).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-[#64716D]">Trained Output</div>
              <div className="text-base font-bold text-[#173F35] tabular-nums mt-0.5">
                {Math.round(currentDistrict.trained * horizon.supplyMultiplier).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-[#64716D]">Net Shortage Gap</div>
              <div className="text-base font-bold text-[#D94E34] tabular-nums mt-0.5">
                +{(Math.round(currentDistrict.demand * horizon.demandMultiplier) - Math.round(currentDistrict.trained * horizon.supplyMultiplier)).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-[#173F35] mb-2">
              Priority NCO-2015 Occupations Requiring Seat Expansion ({dateRange})
            </div>
            <div className="border border-[#E9E0D3] rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F0E7] text-[#64716D] border-b border-[#E9E0D3]">
                    <th className="py-2 px-3">Trade Name</th>
                    <th className="py-2 px-3">NCO Code</th>
                    <th className="py-2 px-3">Sector</th>
                    <th className="py-2 px-3 text-right">Demand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {currentDistrict.topTrades.map((t) => (
                    <tr key={t.name}>
                      <td className="py-2 px-3 font-medium text-[#173F35]">{t.name}</td>
                      <td className="py-2 px-3 font-mono text-[#64716D]">{t.ncoCode}</td>
                      <td className="py-2 px-3 text-[#64716D]">{t.sector}</td>
                      <td className="py-2 px-3 text-right font-semibold tabular-nums">
                        {Math.round(t.demand * horizon.demandMultiplier).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <SecondaryButton tone="outline" onClick={() => setReportModalOpen(false)}>
              Close
            </SecondaryButton>
          </div>
        </div>
      </DetailModal>
    </div>
  );
};

/**
 * ============================================================================
 * PAGE 3: 03 — Sector and Trade Analysis ("Sector-wise Analysis")
 * ============================================================================
 */
export const SectorsAndTradesPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery = '' }) => {
  const { t } = useLanguage();
  const roleType = getUserRoleType(userSession);
  const isNcvet = roleType === 'NCVET';
  const horizon = getHorizonConfig(dateRange);

  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('All Sectors');
  const [exportNotice, setExportNotice] = useState<boolean>(false);
  const [syllabusNotice, setSyllabusNotice] = useState<string>('');

  const filteredSectors =
    selectedSectorFilter === 'All Sectors'
      ? SECTOR_METRICS
      : SECTOR_METRICS.filter((s) => s.name === selectedSectorFilter);

  const filteredTrades = TOP_TRADES_GROWTH.filter((t) => {
    const matchesSector =
      selectedSectorFilter === 'All Sectors' || t.sector === selectedSectorFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ncoCode.includes(searchQuery) ||
      t.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const displayedTrades = filteredTrades.length > 0 ? filteredTrades : TOP_TRADES_GROWTH;

  const renderSectorIcon = (key: string) => {
    switch (key) {
      case 'monitor':
        return <Monitor className="w-4 h-4 text-[#3B66B8]" />;
      case 'stethoscope':
        return <HeartPulse className="w-4 h-4 text-[#D95338]" />;
      case 'hardhat':
        return <HardHat className="w-4 h-4 text-[#D97925]" />;
      case 'cog':
        return <Cog className="w-4 h-4 text-[#4B5E78]" />;
      case 'bag':
        return <ShoppingBag className="w-4 h-4 text-[#C84B59]" />;
      case 'sprout':
        return <Sprout className="w-4 h-4 text-[#287D4E]" />;
      case 'leaf':
        return <Leaf className="w-4 h-4 text-[#16A34A]" />;
      case 'truck':
        return <Truck className="w-4 h-4 text-[#D97925]" />;
      case 'car':
        return <Car className="w-4 h-4 text-[#EA580C]" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 text-[#9333EA]" />;
      case 'shirt':
        return <Shirt className="w-4 h-4 text-[#C05621]" />;
      default:
        return <Utensils className="w-4 h-4 text-[#B5721E]" />;
    }
  };

  const formatDemandK = (k: number) => {
    if (k >= 1000) return `${(k / 1000).toFixed(2)} Cr`;
    if (k >= 100) return `${(k / 100).toFixed(1)} Lakh`;
    return `${k}K`;
  };

  const maxScaleK = Math.round(300 * horizon.demandMultiplier);

  return (
    <div className="space-y-4 relative">
      {/* Mandala subtle corner watermark */}
      <MandalaPattern className="w-36 h-36 absolute bottom-0 left-0 pointer-events-none opacity-40" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {isNcvet ? t('National Sectors & Qualifications Standards') : t('Sector-wise Analysis')}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {isNcvet
              ? t('Monitor National Occupational Standards (NOS), curriculum obsolescence, and NSQF credit distribution')
              : t('Compare demand, supply, growth and skill gaps across sectors')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
            <span>{dateRange}</span>
            <span className="text-[#A57849]">·</span>
            <span className="font-normal text-[#6C5840]">{horizon.label}</span>
          </span>
          <SelectControl
            value={selectedSectorFilter}
            onChange={setSelectedSectorFilter}
            options={[
              { label: t('All Sectors'), value: 'All Sectors' },
              ...SECTOR_METRICS.map((s) => ({ label: t(s.name), value: s.name })),
            ]}
            className="w-40"
          />
          <PrimaryButton
            onClick={() => {
              setExportNotice(true);
              setTimeout(() => setExportNotice(false), 3000);
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exportNotice ? 'Exported CSV' : 'Export Report'}</span>
          </PrimaryButton>
        </div>
      </div>

      {/* NCVET Specialized Regulatory Action Banner */}
      {isNcvet && (
        <div className="p-3.5 rounded-xl bg-[#F5F0FB] border border-[#DDD6FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDE4FC] text-[#7C3AED] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-[#4C1D95]">
                NCVET Regulatory Standards &amp; Curriculum Governance
              </div>
              <div className="text-[11px] text-[#6B21A8] mt-0.5">
                Trades flagged with &gt;3.0x Oversupply or declining industry demand qualify for immediate Qualification Pack (QP) overhaul.
              </div>
            </div>
          </div>
          {syllabusNotice ? (
            <div className="px-3 py-1.5 rounded-lg bg-[#E2F0E3] text-[#17604D] font-semibold text-xs flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>{syllabusNotice}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSyllabusNotice('Expedited Syllabus Revision Dispatched to Sector Skill Councils');
                setTimeout(() => setSyllabusNotice(''), 4500);
              }}
              className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Mandate Syllabus Overhaul
            </button>
          )}
        </div>
      )}

      {/* 12 Compact Sector Cards: Exactly 6 per row on desktop (no right-side gap) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {SECTOR_METRICS.map((sec, idx) => {
          const isSelected = selectedSectorFilter === sec.name;
          const scaledDemandK = Math.round(sec.demandK * horizon.demandMultiplier);
          const secDemandLabel = formatDemandK(scaledDemandK);
          return (
            <SurfaceCard
              key={sec.id}
              onClick={() =>
                setSelectedSectorFilter(isSelected ? 'All Sectors' : sec.name)
              }
              className={`p-3 flex flex-col items-center text-center interactive-card group animate-card-slide-up anim-delay-${(idx % 6) + 1} cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-[#17604D] bg-[#F5F0E7] shadow-sm' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#F5F0E7] flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6">
                {renderSectorIcon(sec.iconKey)}
              </div>
              <div className="text-xs font-semibold text-[#173F35] whitespace-nowrap">
                {sec.name}
              </div>
              <div className="text-base font-bold text-[#173F35] tabular-nums mt-0.5">
                {secDemandLabel}
              </div>
              <div className="text-[11px] font-semibold text-[#17604D] tabular-nums mt-0.5">
                ↗ {sec.growth}
              </div>
            </SurfaceCard>
          );
        })}
      </div>

      {/* Two-Column Layout Below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Panel (5 cols): Sector-wise Demand-Supply Gap Horizontal Paired Bars */}
        <SurfaceCard className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#173F35]">
                Sector-wise Demand–Supply Gap
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF0E1] text-[#8C4E13]">
                {dateRange}
              </span>
            </div>
            <div className="flex items-center justify-center gap-5 text-[11px] text-[#64716D] my-2.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#6E7FA3]" />
                Job Demand
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#E28A86]" />
                Trained Candidates
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {filteredSectors.map((sec) => {
                const scaledDemandK = Math.round(sec.demandK * horizon.demandMultiplier);
                const scaledTrainedK = Math.round(sec.trainedK * horizon.supplyMultiplier);
                const demandPct = Math.min(100, (scaledDemandK / maxScaleK) * 100);
                const trainedPct = Math.min(100, (scaledTrainedK / maxScaleK) * 100);
                return (
                  <div key={sec.id} className="grid grid-cols-12 items-center gap-2 text-xs">
                    <div className="col-span-4 text-right text-[#64716D] font-medium pr-1 truncate">
                      {sec.name}
                    </div>
                    <div className="col-span-8 space-y-1">
                      <div className="w-full bg-[#F5F0E7] h-2.5 rounded-r-sm overflow-hidden">
                        <div
                          className="bg-[#6E7FA3] h-full rounded-r-sm progress-bar-anim transition-all duration-700 ease-out"
                          style={{ width: `${demandPct}%` }}
                          title={`Job Demand: ${formatDemandK(scaledDemandK)}`}
                        />
                      </div>
                      <div className="w-full bg-[#F5F0E7] h-2.5 rounded-r-sm overflow-hidden">
                        <div
                          className="bg-[#E28A86] h-full rounded-r-sm progress-bar-anim transition-all duration-700 ease-out"
                          style={{ width: `${trainedPct}%` }}
                          title={`Trained: ${formatDemandK(scaledTrainedK)}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis scale */}
          <div className="grid grid-cols-12 pt-3 mt-3 border-t border-[#F2ECE1] text-[10px] text-[#64716D] tabular-nums">
            <div className="col-span-4" />
            <div className="col-span-8 flex justify-between">
              <span>0</span>
              <span>{formatDemandK(Math.round(maxScaleK * 0.17))}</span>
              <span>{formatDemandK(Math.round(maxScaleK * 0.33))}</span>
              <span>{formatDemandK(Math.round(maxScaleK * 0.5))}</span>
              <span>{formatDemandK(Math.round(maxScaleK * 0.67))}</span>
              <span>{formatDemandK(Math.round(maxScaleK * 0.83))}</span>
              <span>{formatDemandK(maxScaleK)}</span>
            </div>
          </div>
        </SurfaceCard>

        {/* Right Panel (7 cols): Top 10 Trades by Projected Growth */}
        <SurfaceCard className="lg:col-span-7 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#173F35]">
              Top 10 Trades by Projected Growth ({dateRange})
            </h2>
            <span className="text-[10px] text-[#64716D]">
              NCO-2015 Harmonized
            </span>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E9E0D3] text-[#64716D] bg-[#FAF7F2]">
                <th className="py-2 px-2.5 font-semibold w-8">#</th>
                <th className="py-2 px-2.5 font-semibold">Trade (NCO Code)</th>
                <th className="py-2 px-2.5 font-semibold">Sector</th>
                <th className="py-2 px-2.5 font-semibold text-right">Projected Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {displayedTrades.map((trade) => (
                <tr key={trade.rank} className="hover:bg-[#F8F5EF] transition-colors">
                  <td className="py-2 px-2.5 text-[#64716D] tabular-nums">{trade.rank}</td>
                  <td className="py-2 px-2.5 font-medium text-[#173F35]">
                    {trade.name}{' '}
                    <span className="text-[#64716D] font-normal">({trade.ncoCode})</span>
                  </td>
                  <td className="py-2 px-2.5 text-[#64716D]">{trade.sector}</td>
                  <td className="py-2 px-2.5 text-right font-bold text-[#17604D] tabular-nums">
                    {trade.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SurfaceCard>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * PAGE 4: 04 — Skill Demand Forecasting ("Skill Demand Forecasting")
 * ============================================================================
 */
export const SkillForecastingPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery = '' }) => {
  const { t } = useLanguage();
  const horizonConfig = getHorizonConfig(dateRange);
  const initialHorizon = dateRange === 'Next 3 Years' ? '3 Years' : '1 Year';

  const [selectedSector, setSelectedSector] = useState<string>('IT/ITeS');
  const [selectedTradeKey, setSelectedTradeKey] = useState<string>('Software Developer');
  const [horizon, setHorizon] = useState<string>(initialHorizon);

  const allForecastTrades: TradeGrowthItem[] = [
    SOFTWARE_DEVELOPER_FORECAST,
    ...TOP_TRADES_GROWTH,
  ].filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.ncoCode.includes(q) || t.sector.toLowerCase().includes(q);
  });

  const activeTrade =
    allForecastTrades.find((t) => t.name === selectedTradeKey && t.sector === selectedSector) ||
    allForecastTrades.find((t) => t.sector === selectedSector) ||
    allForecastTrades.find((t) => t.name === selectedTradeKey) ||
    allForecastTrades[0] ||
    SOFTWARE_DEVELOPER_FORECAST;

  const horizonMultiplier =
    (horizon === '5 Years' ? 1.55 : horizon === '3 Years' ? 1.25 : 0.85) *
    (dateRange === 'Next 3 Years' ? 2.1 : dateRange === 'FY 2026–27' ? 1.18 : 1.0);

  const currentDemandVal = Math.round(
    activeTrade.currentDemand * (dateRange === 'Next 3 Years' ? 2.4 : dateRange === 'FY 2026–27' ? 1.15 : 1.0)
  );
  const projectedDemandVal = Math.round(activeTrade.projectedDemand * horizonMultiplier);
  const recommendedSeatsVal = Math.round(activeTrade.recommendedSeats * horizonMultiplier * 0.91);
  const expectedGapVal = projectedDemandVal - recommendedSeatsVal;

  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {t('Skill Demand Forecasting')}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {t('AI-powered forecasts to plan training capacity and resources')}
          </p>
        </div>
        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
          <span>{dateRange}</span>
          <span className="text-[#A57849]">·</span>
          <span className="font-normal text-[#6C5840]">{horizonConfig.label}</span>
        </span>
      </div>

      {/* Filter Row */}
      <SurfaceCard className="p-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-3">
            <SelectControl
              label="Sector"
              value={selectedSector}
              onChange={(sec) => {
                setSelectedSector(sec);
                const match = allForecastTrades.find((t) => t.sector === sec);
                if (match) setSelectedTradeKey(match.name);
              }}
              options={[
                ...ALL_SECTORS_LIST.map((sec) => ({ label: sec, value: sec })),
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <SelectControl
              label="Trade"
              value={activeTrade.name}
              onChange={setSelectedTradeKey}
              options={(allForecastTrades.some((t) => t.sector === selectedSector)
                ? allForecastTrades.filter((t) => t.sector === selectedSector)
                : allForecastTrades
              ).map((t) => ({
                label: `${t.name} (${t.ncoCode})`,
                value: t.name,
              }))}
            />
          </div>
          <div className="lg:col-span-3">
            <SelectControl
              label="Forecast Horizon"
              value={horizon}
              onChange={setHorizon}
              options={[
                { label: '1 Year', value: '1 Year' },
                { label: '3 Years', value: '3 Years' },
                { label: '5 Years', value: '5 Years' },
              ]}
            />
          </div>
          <div className="lg:col-span-2">
            <PrimaryButton className="w-full py-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Generate Forecast</span>
            </PrimaryButton>
          </div>
        </div>
      </SurfaceCard>

      {/* Main Content Row: Left Projected Job Demand Line Chart (7 cols) + Right Forecast Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Panel: Projected Job Demand */}
        <SurfaceCard className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-bold text-[#173F35]">Projected Job Demand</h2>
            <div className="flex items-center gap-4 text-xs text-[#64716D]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#17604D] relative">
                  <span className="w-2 h-2 rounded-full bg-[#17604D] absolute -top-[3px] left-1" />
                </span>
                Historical
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-[#D96843]" />
                Forecast
              </span>
            </div>
          </div>

          {/* Line Chart SVG */}
          <div className="relative w-full pt-2">
            <svg viewBox="0 0 520 190" className="w-full h-[190px] overflow-visible">
              <defs>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D96843" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#D96843" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Y-axis grid lines */}
              {[
                { y: 20, label: '200K' },
                { y: 54, label: '150K' },
                { y: 88, label: '100K' },
                { y: 122, label: '50K' },
                { y: 156, label: '0' },
              ].map((g) => (
                <g key={g.label}>
                  <text
                    x="36"
                    y={g.y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-[#64716D] tabular-nums"
                  >
                    {g.label}
                  </text>
                  <line x1="48" y1={g.y} x2="490" y2={g.y} stroke="#ECE4D7" strokeWidth="1" />
                </g>
              ))}

              {/* Shaded forecast region from 2025 (x=210) to 2027 (x=450) */}
              <polygon
                points="210,93 330,70 450,48 450,156 210,156"
                fill="url(#forecastFill)"
              />

              {/* Historical solid line (2024 -> 2025) */}
              <line
                x1="90"
                y1="116"
                x2="210"
                y2="93"
                stroke="#17604D"
                strokeWidth="2.5"
                className="chart-line-anim"
              />
              <circle cx="90" cy="116" r="4" fill="#17604D" />
              <circle cx="210" cy="93" r="4" fill="#17604D" />

              {/* Forecast dashed line (2025 -> 2026 -> 2027) */}
              <polyline
                points="210,93 330,70 450,48"
                fill="none"
                stroke="#D96843"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="chart-line-anim"
              />
              <circle cx="330" cy="70" r="4" fill="#D96843" />
              <circle cx="450" cy="48" r="9" fill="none" stroke="#D96843" strokeWidth="1.2" opacity="0.6" className="chart-pulse-point" />
              <circle cx="450" cy="48" r="5" fill="#D96843" stroke="#FFFEFB" strokeWidth="1.5" />

              {/* Floating Callout Box on 2027 Point */}
              <g transform="translate(362, 58)" className="transition-transform duration-300 hover:scale-105">
                <rect
                  x="0"
                  y="0"
                  width="96"
                  height="46"
                  rx="6"
                  fill="#FFFEFB"
                  stroke="#E9E0D3"
                  strokeWidth="1.2"
                />
                <text x="10" y="18" className="text-[10px] fill-[#64716D] font-medium">
                  {dateRange} ➔
                </text>
                <text x="10" y="36" className="text-sm fill-[#173F35] font-bold tabular-nums">
                  {projectedDemandVal.toLocaleString('en-IN')}
                </text>
              </g>

              {/* X-axis year labels */}
              {[
                { x: 90, label: '2024' },
                { x: 210, label: '2025' },
                { x: 330, label: '2026' },
                { x: 450, label: dateRange === 'Next 3 Years' ? '2029 (F)' : '2027 (F)' },
              ].map((yr) => (
                <text
                  key={yr.label}
                  x={yr.x}
                  y="176"
                  textAnchor="middle"
                  className="text-[11px] fill-[#64716D] font-medium tabular-nums"
                >
                  {yr.label}
                </text>
              ))}
            </svg>
          </div>
        </SurfaceCard>

        {/* Right Panel: Forecast Summary */}
        <SurfaceCard className="lg:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#173F35]">Forecast Summary</h2>
            <span className="text-[11px] text-[#64716D] font-medium">
              Target: <strong className="text-[#173F35]">{dateRange}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-auto py-3">
            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[11px] text-[#64716D]">Current Demand</div>
              <div className="text-xl font-bold text-[#173F35] tabular-nums mt-1">
                {currentDemandVal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[11px] text-[#64716D]">Projected Demand ({dateRange})</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-[#173F35] tabular-nums">
                  {projectedDemandVal.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold text-[#17604D] tabular-nums">
                  +{activeTrade.growth}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[11px] text-[#64716D]">Recommended Training Seats</div>
              <div className="text-xl font-bold text-[#173F35] tabular-nums mt-1">
                {recommendedSeatsVal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[11px] text-[#64716D]">Expected Gap ({dateRange})</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-[#D94E34] tabular-nums">
                  +{expectedGapVal.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-semibold text-[#C8432B]">
                  {activeTrade.status}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#64716D] border-t border-[#F2ECE1] pt-2">
            Trade NCO-2015 Code: <span className="font-mono text-[#173F35]">{activeTrade.ncoCode}</span> · Sector: {activeTrade.sector}
          </div>
        </SurfaceCard>
      </div>

      {/* Bottom Row: Key Factors Influencing Demand (7 cols) + Forecast Confidence (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <SurfaceCard className="lg:col-span-7">
          <h2 className="text-sm font-bold text-[#173F35] mb-3">
            Key Factors Influencing Demand
          </h2>
          <div className="space-y-2.5">
            {activeTrade.factors.map((factor, idx) => {
              const icons = [
                <Cpu key="0" className="w-3.5 h-3.5 text-[#7A52B8]" />,
                <Globe key="1" className="w-3.5 h-3.5 text-[#3B66B8]" />,
                <CloudCog key="2" className="w-3.5 h-3.5 text-[#287D4E]" />,
                <Landmark key="3" className="w-3.5 h-3.5 text-[#D97925]" />,
              ];
              return (
                <div key={factor} className="flex items-center gap-2.5 text-xs text-[#173F35]">
                  <div className="w-6 h-6 rounded-md bg-[#F5F0E7] flex items-center justify-center shrink-0">
                    {icons[idx % icons.length]}
                  </div>
                  <span>{factor}</span>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-5 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-[#173F35]">Forecast Confidence</h2>
          <div className="flex items-center gap-5 my-auto py-2">
            {/* Circular Confidence Indicator */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#E5ECE8"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#2B7A66"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(activeTrade.confidence / 100) * 238.76} 238.76`}
                  className="doughnut-animated"
                />
              </svg>
              <span className="absolute text-lg font-bold text-[#173F35] tabular-nums">
                {activeTrade.confidence}%
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-[#17604D]">High Confidence</div>
              <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
                Based on 5 data sources and historical trends (illustrative reference indicator).
              </p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * PAGE 5: 05 — Alerts and Insights ("Alerts & Insights")
 * ============================================================================
 */
export const AlertsAndInsightsPage: React.FC<{
  onNavigate: (route: NavRouteId) => void;
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ onNavigate, userSession, dateRange = 'Last 1 Year', searchQuery = '' }) => {
  const { t } = useLanguage();
  const canViewRecommendations = isRouteAllowedForSession(userSession ?? null, 'recommendations');
  const horizon = getHorizonConfig(dateRange);

  const [activeFilter, setActiveFilter] = useState<
    'All' | 'Undersupply' | 'Oversupply' | 'High Growth'
  >('All');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const filteredAlerts = (
    activeFilter === 'All'
      ? ALERTS_DATA
      : ALERTS_DATA.filter((a) => a.category === activeFilter)
  ).filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.tradeName.toLowerCase().includes(q) ||
      a.ncoCode.includes(q) ||
      a.sector.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  });

  const totalCount = dateRange === 'Next 3 Years' ? 38 : dateRange === 'FY 2026–27' ? 29 : 24;
  const underCount = dateRange === 'Next 3 Years' ? 18 : dateRange === 'FY 2026–27' ? 13 : 10;
  const overCount = dateRange === 'Next 3 Years' ? 11 : dateRange === 'FY 2026–27' ? 9 : 8;
  const growthCount = dateRange === 'Next 3 Years' ? 9 : dateRange === 'FY 2026–27' ? 7 : 6;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {t('Alerts & Insights')}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {t('Early warnings for emerging shortages and saturation risks')}
          </p>
        </div>
        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
          <span>{dateRange}</span>
          <span className="text-[#A57849]">·</span>
          <span className="font-normal text-[#6C5840]">{horizon.label}</span>
        </span>
      </div>

      {/* Filter Chips Row matching Reference Image 1 */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterTabButton
          active={activeFilter === 'All'}
          label={`${t('All')} (${totalCount})`}
          onClick={() => setActiveFilter('All')}
        />
        <FilterTabButton
          active={activeFilter === 'Undersupply'}
          label={`${t('Undersupply')} (${underCount})`}
          onClick={() => setActiveFilter('Undersupply')}
        />
        <FilterTabButton
          active={activeFilter === 'Oversupply'}
          label={`${t('Oversupply')} (${overCount})`}
          onClick={() => setActiveFilter('Oversupply')}
        />
        <FilterTabButton
          active={activeFilter === 'High Growth'}
          label={`${t('High Growth')} (${growthCount})`}
          onClick={() => setActiveFilter('High Growth')}
        />
      </div>

      {/* Two-Column Layout: Alert Cards List (8 cols) + Insight Summary Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8 space-y-3">
          {filteredAlerts.map((alert) => {
            const isShortage = alert.category === 'Undersupply';
            const isOversupply = alert.category === 'Oversupply';
            return (
              <SurfaceCard
                key={alert.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  {/* Severity Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isShortage
                        ? 'bg-[#FBE5DE] text-[#D94E34]'
                        : isOversupply
                        ? 'bg-[#FBF0D9] text-[#D97925]'
                        : 'bg-[#E2F0E3] text-[#17604D]'
                    }`}
                  >
                    {isShortage && <AlertTriangle className="w-5 h-5" />}
                    {isOversupply && <AlertTriangle className="w-5 h-5" />}
                    {!isShortage && !isOversupply && <ShieldCheck className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#173F35]">
                      {isShortage && (
                        <span className="text-[#C8432B]">Acute Shortage – </span>
                      )}
                      {isOversupply && (
                        <span className="text-[#C86A1E]">Approaching Saturation – </span>
                      )}
                      {!isShortage && !isOversupply && (
                        <span className="text-[#17604D]">High Growth Opportunity – </span>
                      )}
                      {alert.tradeName} ({alert.ncoCode})
                    </h3>
                    <p className="text-xs text-[#64716D] mt-0.5">{alert.description}</p>

                    {/* Clean metadata row */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64716D] mt-2">
                      <span className="font-medium text-[#173F35]">{alert.sector}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          isShortage
                            ? 'text-[#C8432B] font-medium'
                            : isOversupply
                            ? 'text-[#B5721E] font-medium'
                            : 'text-[#17604D] font-medium'
                        }
                      >
                        {alert.districtsCount} districts
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                <SecondaryButton
                  tone="warm"
                  onClick={() => setSelectedAlert(alert)}
                  className="self-start sm:self-center"
                >
                  View Details
                </SecondaryButton>
              </SurfaceCard>
            );
          })}
        </div>

        {/* Right Column: Insight Summary Card with Bottom Heritage Illustration */}
        <div className="lg:col-span-4">
          <div className="bg-[#FFFEFB] border border-[#E9E0D3] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-5 pb-0">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#FBF0D9] text-[#D97925] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#173F35]">Insight Summary</h2>
              </div>
              <p className="text-xs text-[#64716D] leading-relaxed">
                Healthcare and Green Jobs show strong demand across 70% of districts, while
                data entry and basic IT support roles are approaching saturation in urban
                areas.
              </p>
              {canViewRecommendations && (
                <button
                  type="button"
                  onClick={() => onNavigate('recommendations')}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#FAF0E1] hover:bg-[#F5E6D0] border border-[#ECDCC7] text-[#173F35] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Full Report</span>
                  <span className="text-xs text-[#D97925] leading-none" aria-hidden="true">→</span>
                </button>
              )}
            </div>

            {/* Heritage Illustration integrated inside the card, flush at the bottom */}
            <div className="w-full mt-5">
              <MiniIllustration className="w-full h-auto block" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Details Modal */}
      <DetailModal
        open={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert ? `${selectedAlert.tradeName} (${selectedAlert.ncoCode})` : ''}
        subtitle={selectedAlert ? `${selectedAlert.category} Alert · ${selectedAlert.sector}` : ''}
      >
        {selectedAlert && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-[#F8F5EF] border border-[#E9E0D3] flex items-center justify-between">
              <span className="text-[#64716D]">Projected 2026 Imbalance</span>
              <span className="font-bold text-sm text-[#D94E34] tabular-nums">
                {selectedAlert.projectedGap}
              </span>
            </div>
            <div>
              <div className="font-semibold text-[#173F35] mb-1">Affected Districts</div>
              <p className="text-[#64716D]">
                {selectedAlert.affectedDistricts.join(' · ')}
              </p>
            </div>
            <div>
              <div className="font-semibold text-[#173F35] mb-1">
                Model-Suggested Action for State Planners
              </div>
              <p className="text-[#173F35] bg-[#E5F2E6]/60 p-3 rounded-lg border border-[#DCE9D9]">
                {selectedAlert.recommendedAction}
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <SecondaryButton tone="outline" onClick={() => setSelectedAlert(null)}>
                Close
              </SecondaryButton>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
};

/**
 * ============================================================================
 * PAGE 6: 06 — Planning Recommendations ("Planning Recommendations")
 * ============================================================================
 */
export const PlanningRecommendationsPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery = '' }) => {
  const { t } = useLanguage();
  const roleType = getUserRoleType(userSession);
  const horizon = getHorizonConfig(dateRange);
  const [selectedRec, setSelectedRec] = useState<RecommendationItem | null>(null);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<string>('');

  const filteredRecommendations = RECOMMENDATIONS_DATA.filter((rec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.title.toLowerCase().includes(q) ||
      rec.summary.toLowerCase().includes(q) ||
      rec.priority.toLowerCase().includes(q)
    );
  });

  const additionalTrained =
    dateRange === 'Next 3 Years' ? '+8.5 Lakh' : dateRange === 'FY 2026–27' ? '+2.8 Lakh' : '+1.2 Lakh';
  const gapReduction =
    dateRange === 'Next 3 Years' ? '-68%' : dateRange === 'FY 2026–27' ? '-52%' : '-40%';
  const employmentPotential =
    dateRange === 'Next 3 Years' ? '+46%' : dateRange === 'FY 2026–27' ? '+34%' : '+28%';
  const newCentres =
    dateRange === 'Next 3 Years' ? '74' : dateRange === 'FY 2026–27' ? '32' : '18';

  return (
    <div className="space-y-4">
      {/* Header Row with Download Report Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {roleType === 'DSO'
              ? t("Pune District Planning & DSDP Targets", "पुणे जिला योजना एवं डीएसडीपी लक्ष्य")
              : roleType === 'NCVET'
              ? t("National Curriculum & Standards Mandates", "राष्ट्रीय पाठ्यक्रम एवं मानक अधिदेश")
              : t("Planning Recommendations", "योजना सिफारिशें")}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {roleType === 'DSO'
              ? t("District Skill Development Plan (DSDP) allocations, local seat expansion & cluster proposals", "जिला कौशल विकास योजना आवंटन एवं स्थानीय विस्तार")
              : roleType === 'NCVET'
              ? t("Standards revision roadmaps, obsolescence phase-outs, and emerging skill integrations", "मानक संशोधन रोडमैप एवं अप्रचलन चरणबद्ध समाप्ति")
              : t(
                  "Actionable insights for training targets, curriculum and infrastructure",
                  "प्रशिक्षण लक्ष्यों, पाठ्यक्रम और बुनियादी ढांचे के लिए कार्रवाई योग्य अंतर्दृष्टि"
                )}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
            <span>{dateRange}</span>
            <span className="text-[#A57849]">·</span>
            <span className="font-normal text-[#6C5840]">{horizon.label}</span>
          </span>
          <PrimaryButton
            onClick={() => {
              setDownloaded(true);
              ApiService.triggerDsdpDownload(492);
              setTimeout(() => setDownloaded(false), 3000);
            }}
            title={
              roleType === 'DSO'
                ? "Download Pune District DSDP Allocation CSV"
                : "Download Official MSDE DSDP Annual Target Allocation CSV"
            }
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {downloaded
                ? t("Report Downloaded (CSV)", "रिपोर्ट डाउनलोड हो गई (CSV)")
                : roleType === 'DSO'
                ? t("Download Pune DSDP (CSV)", "पुणे डीएसडीपी डाउनलोड करें (CSV)")
                : t("Download DSDP Plan (CSV)", "डीएसडीपी योजना डाउनलोड करें (CSV)")}
            </span>
          </PrimaryButton>
        </div>
      </div>

      {/* Model vs Policy Distinction Banner */}
      <div className="bg-[#F5F0E7] border border-[#E9E0D3] rounded-lg px-3.5 py-2 flex items-center justify-between text-[11px] text-[#64716D]">
        <span>
          <strong className="text-[#173F35]">Decision Support Advisory:</strong> Recommendations below are generated by the KaushalDrishti Demand-Supply Model and require State Skill Development Mission (SSDM) / NCVET ratification before policy execution.
        </span>
      </div>

      {/* Three Primary Recommendation Cards matching Reference Image 1 Page 6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {filteredRecommendations.map((rec) => (
          <SurfaceCard key={rec.id} className="flex flex-col justify-between p-4">
            <div className="flex items-start gap-3.5">
              {/* Circular Tinted Icon */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  rec.iconType === 'capacity'
                    ? 'bg-[#E2F0E3] text-[#17604D]'
                    : rec.iconType === 'curriculum'
                    ? 'bg-[#F0EBF8] text-[#7A52B8]'
                    : 'bg-[#FBE5DE] text-[#D94E34]'
                }`}
              >
                {rec.iconType === 'capacity' && <ArrowUp className="w-5 h-5" />}
                {rec.iconType === 'curriculum' && <FileText className="w-5 h-5" />}
                {rec.iconType === 'centres' && <MapPin className="w-5 h-5" />}
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#173F35]">{rec.title}</h2>
                <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
                  {rec.summary}
                </p>
                <div className="mt-2.5 text-[11px] text-[#64716D] flex items-center gap-1.5">
                  <span>Priority</span>
                  <span
                    className={`font-semibold ${
                      rec.priority === 'High' ? 'text-[#C8432B]' : 'text-[#C86A1E]'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex justify-center">
              <SecondaryButton
                tone="warm"
                onClick={() => setSelectedRec(rec)}
                className="w-full py-2"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </SecondaryButton>
            </div>
          </SurfaceCard>
        ))}
      </div>

      {/* Expected Impact Section */}
      <SurfaceCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#173F35]">
            Expected Impact ({dateRange})
          </h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF0E1] text-[#8C4E13]">
            {horizon.label}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
            <div className="w-9 h-9 rounded-lg bg-[#E2F0E3] text-[#17604D] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-[#17604D] tabular-nums">{additionalTrained}</div>
              <div className="text-[11px] text-[#64716D]">Additional trained candidates</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
            <div className="w-9 h-9 rounded-lg bg-[#E2F0E3] text-[#17604D] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-[#173F35] tabular-nums">{gapReduction}</div>
              <div className="text-[11px] text-[#64716D]">Reduction in demand-supply gap</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
            <div className="w-9 h-9 rounded-lg bg-[#E2F0E3] text-[#17604D] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-[#17604D] tabular-nums">{employmentPotential}</div>
              <div className="text-[11px] text-[#64716D]">Employment potential</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
            <div className="w-9 h-9 rounded-lg bg-[#FBF0D9] text-[#D97925] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-[#173F35] tabular-nums">{newCentres}</div>
              <div className="text-[11px] text-[#64716D]">New centres recommended</div>
            </div>
          </div>
        </div>
      </SurfaceCard>

      {/* Recommendation Detail Modal */}
      <DetailModal
        open={Boolean(selectedRec)}
        onClose={() => setSelectedRec(null)}
        title={selectedRec?.title || ''}
        subtitle={selectedRec?.summary}
      >
        {selectedRec && (
          <div className="space-y-3.5 text-xs">
            <p className="text-[#173F35] leading-relaxed">
              {selectedRec.details.rationale}
            </p>
            <div className="grid grid-cols-2 gap-3 bg-[#F8F5EF] p-3 rounded-lg border border-[#E9E0D3]">
              <div>
                <div className="text-[#64716D]">Indicative Outlay</div>
                <div className="font-bold text-[#173F35] mt-0.5">
                  {selectedRec.details.estimatedBudget}
                </div>
              </div>
              <div>
                <div className="text-[#64716D]">Implementation Horizon</div>
                <div className="font-bold text-[#173F35] mt-0.5">
                  {selectedRec.details.timeline}
                </div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-[#173F35] mb-1">Target NSQF Trades</div>
              <ul className="list-disc list-inside text-[#64716D] space-y-0.5">
                {selectedRec.details.targetTrades.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#173F35] mb-1">Priority Districts</div>
              <p className="text-[#64716D]">
                {selectedRec.details.targetDistricts.join(' · ')}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F5F0E7] text-[11px] text-[#64716D]">
              {selectedRec.details.policyNote}
            </div>

            {/* Official RBAC Action Controls */}
            <div className="pt-3.5 border-t border-[#E9E0D3] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-[#64716D]">
                {roleType === 'ADMIN' && (
                  <span className="text-[#17604D] font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Apex Clearance: Direct Seat Sanction Authority
                  </span>
                )}
                {roleType === 'DSO' && (
                  <span className="text-[#2463EB] font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> District Endorsement Clearance: Pune DSC Lead
                  </span>
                )}
                {roleType === 'NCVET' && (
                  <span className="text-[#7C3AED] font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Regulatory Clearance: Mandate NOS Syllabus Revision
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <SecondaryButton
                  tone="outline"
                  onClick={() => {
                    setSelectedRec(null);
                    setActionStatus('');
                  }}
                >
                  Close
                </SecondaryButton>

                {actionStatus ? (
                  <div className="px-3 py-1.5 rounded-lg bg-[#E2F0E3] text-[#17604D] font-semibold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionStatus}</span>
                  </div>
                ) : (
                  <PrimaryButton
                    onClick={() => {
                      if (roleType === 'ADMIN') {
                        setActionStatus('Sanctioned by State Director (ID: SSDM-2026-APPR-492)');
                      } else if (roleType === 'DSO') {
                        setActionStatus('Endorsed for Pune DSDP · Submitted to State Committee');
                      } else {
                        setActionStatus('Mandated NOS Revision by NCVET Committee');
                      }
                      setTimeout(() => setActionStatus(''), 4500);
                    }}
                  >
                    {roleType === 'ADMIN' && 'Approve & Sanction Allocation'}
                    {roleType === 'DSO' && 'Endorse Pune Target Draft'}
                    {roleType === 'NCVET' && 'Mandate NSQF Overhaul'}
                  </PrimaryButton>
                )}
              </div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
};
