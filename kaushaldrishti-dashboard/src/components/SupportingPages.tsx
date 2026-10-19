import React, { useState } from 'react';
import {
  Download,
  Search,
  Copy,
  Check,
  Building2,
  Users,
  GraduationCap,
  Award,
  RefreshCw,
  FileSpreadsheet,
  SlidersHorizontal,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import {
  SurfaceCard,
  PrimaryButton,
  SecondaryButton,
  SelectControl,
  FilterTabButton,
  EmptyStateCard,
} from './DesignSystemUI';
import {
  LogoHorizontal,
  LogoIcon,
  LogoSquare,
  HeaderIllustration,
  SidebarBottomIllustration,
  MiniIllustration,
  LeafLeft,
  LeafRight,
  MandalaPattern,
  EmptyStateIllustration,
  AssetOutlineIcon,
} from './Assets';
import { PolicySimulationSandbox } from './PolicySimulationSandbox';
import { PolicySandboxPage } from './PolicySandboxPage';
import { BulkUploaderCard } from './BulkUploaderCard';
import { TelemetryUploadPage } from './TelemetryUploadPage';
import { AuthModal, UserSession } from './AuthModal';
import { NavRouteId } from '../types';
import { ApiService } from '../services/apiService';
import {
  STATES_DATA,
  SECTOR_METRICS,
  GENERATED_REPORTS,
  EXPLORER_RECORDS,
} from '../data/mockData';
import {
  COMPREHENSIVE_DEMAND_SUPPLY_RECORDS,
  ALL_SECTORS_LIST,
} from '../data/demandSupplyData';
import { getHorizonConfig } from '../data/dashboardMetrics';
import { useLanguage } from '../context/LanguageContext';

/**
 * ============================================================================
 * SUPPORTING ROUTE: Demand & Supply
 * ============================================================================
 */
export const DemandSupplyPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery: initialSearch = '' }) => {
  const { t } = useLanguage();
  const horizon = getHorizonConfig(dateRange);
  const [stateFilter, setStateFilter] = useState<string>('All States');
  const [sectorFilter, setSectorFilter] = useState<string>('All Sectors');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  const filteredRecords = COMPREHENSIVE_DEMAND_SUPPLY_RECORDS.filter((rec) => {
    const matchesState = stateFilter === 'All States' || rec.state === stateFilter;
    const matchesSector = sectorFilter === 'All Sectors' || rec.sector === sectorFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      rec.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.ncoCode.includes(searchQuery);
    return matchesState && matchesSector && matchesSearch;
  });

  const isFiltered = stateFilter !== 'All States' || sectorFilter !== 'All Sectors' || searchQuery.trim().length > 0;

  const totalFilteredDemand = filteredRecords.reduce(
    (acc, r) => acc + Math.round(r.annualDemand * horizon.demandMultiplier),
    0
  );
  const totalFilteredSupply = filteredRecords.reduce(
    (acc, r) => acc + Math.round(r.annualTrained * horizon.supplyMultiplier),
    0
  );
  const filteredUndersupplyTrades = filteredRecords.filter(
    (r) => r.status === 'Undersupply'
  ).length;
  const filteredBalancedTrades = filteredRecords.filter((r) => r.status === 'Balanced').length;

  const formatLakhOrCr = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)} Lakh`;
    return num.toLocaleString('en-IN');
  };

  const balancedCount = Math.max(0, 1245 - horizon.undersupplyTrades - horizon.oversupplyTrades);

  const displayDemand = isFiltered ? formatLakhOrCr(totalFilteredDemand) : horizon.demandCr;
  const displaySupply = isFiltered ? formatLakhOrCr(totalFilteredSupply) : horizon.supplyCr;
  const displayDeficitTrades = isFiltered ? `${filteredUndersupplyTrades} Trades` : `${horizon.undersupplyTrades} Trades`;
  const displayBalancedTrades = isFiltered ? `${filteredBalancedTrades} Trades` : `${balancedCount} Trades`;

  const demandSubtext = isFiltered
    ? `${stateFilter !== 'All States' ? stateFilter : 'All States'} · ${sectorFilter !== 'All Sectors' ? sectorFilter : 'All Sectors'}`
    : t('Across 36 States & UTs');

  const supplySubtext = isFiltered
    ? `${filteredRecords.length} District Batches Evaluated`
    : t('ITIs, PMKVY 4.0 & Polytechnics');

  const deficitSubtext = isFiltered
    ? `${Math.round((filteredUndersupplyTrades / Math.max(1, filteredRecords.length)) * 100)}% of filtered trades`
    : `${Math.round((horizon.undersupplyTrades / 1245) * 100)}% ${t('of 1,245 mapped NCO trades', '1,245 एनसीओ व्यवसायों में')}`;

  const balancedSubtext = isFiltered
    ? `${Math.round((filteredBalancedTrades / Math.max(1, filteredRecords.length)) * 100)}% of filtered trades`
    : `${Math.round((balancedCount / 1245) * 100)}% ${t('within ±5% variance band', '±5% भिन्नता के भीतर')}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {t('Demand & Supply Reconciliation')}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {t('Granular trade-by-district demand vs certified supply gap ledger across NSQF levels')}
          </p>
        </div>
        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
          <span>{dateRange}</span>
          <span className="text-[#A57849]">·</span>
          <span className="font-normal text-[#6C5840]">{horizon.label}</span>
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-1">
          <div className="text-xs text-[#64716D]">{t('Aggregate Demand')} ({dateRange})</div>
          <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-1">{displayDemand}</div>
          <div className="text-[11px] text-[#17604D] font-semibold mt-1">
            {demandSubtext}
          </div>
        </SurfaceCard>
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-2">
          <div className="text-xs text-[#64716D]">{t('Certified Supply Pipeline')}</div>
          <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-1">{displaySupply}</div>
          <div className="text-[11px] text-[#64716D] mt-1">
            {supplySubtext}
          </div>
        </SurfaceCard>
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-3">
          <div className="text-xs text-[#64716D]">{t('Net Deficit (Shortfall)', 'शुद्ध कमी (घाटा)')}</div>
          <div className="text-2xl font-bold text-[#D94E34] tabular-nums mt-1">{displayDeficitTrades}</div>
          <div className="text-[11px] text-[#64716D] mt-1">
            {deficitSubtext}
          </div>
        </SurfaceCard>
        <SurfaceCard className="kpi-card animate-card-slide-up anim-delay-4">
          <div className="text-xs text-[#64716D]">{t('Balanced Equilibrium Trades', 'संतुलित व्यवसाय')}</div>
          <div className="text-2xl font-bold text-[#17604D] tabular-nums mt-1">{displayBalancedTrades}</div>
          <div className="text-[11px] text-[#64716D] mt-1">
            {balancedSubtext}
          </div>
        </SurfaceCard>
      </div>

      {/* Filters */}
      <SurfaceCard className="p-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-[11px] font-medium text-[#64716D] block mb-1">
              Search Occupation or District
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64716D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Solar PV, Pune, 2512.01..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFEFB] border border-[#E9E0D3] rounded-lg text-[#173F35] focus:outline-none focus:border-[#17604D]"
              />
            </div>
          </div>
          <SelectControl
            label="State"
            value={stateFilter}
            onChange={setStateFilter}
            options={[
              { label: 'All States', value: 'All States' },
              ...STATES_DATA.map((s) => ({ label: s.state, value: s.state })),
            ]}
          />
          <SelectControl
            label="Sector"
            value={sectorFilter}
            onChange={setSectorFilter}
            options={[
              { label: 'All Sectors', value: 'All Sectors' },
              ...ALL_SECTORS_LIST.map((sec) => ({ label: sec, value: sec })),
            ]}
          />
        </div>
      </SurfaceCard>

      {/* Detailed Gap Table */}
      {filteredRecords.length === 0 ? (
        <EmptyStateCard
          variant="search"
          title="No Matching Trade-District Records"
          description="Try clearing your search query or selecting All States and All Sectors to inspect the national demand-supply reconciliation ledger."
          actionLabel="Reset Filters"
          onAction={() => {
            setStateFilter('All States');
            setSectorFilter('All Sectors');
            setSearchQuery('');
          }}
        />
      ) : (
        <SurfaceCard className="overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#173F35]">
              {t('Detailed Demand–Supply Gap Ledger', 'विस्तृत मांग-आपूर्ति अंतर बहीखाता')} ({dateRange})
            </h2>
            <span className="text-[11px] text-[#8C4E13] font-semibold bg-[#FAF0E1] px-2 py-0.5 rounded">
              Multiplier: {horizon.demandMultiplier}x Demand · {horizon.supplyMultiplier}x Supply
            </span>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E9E0D3] bg-[#FAF7F2] text-[#64716D]">
                <th className="py-2.5 px-3 font-semibold">{t('Trade (NCO Code)', 'व्यवसाय (एनसीओ कोड)')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('NSQF')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('Sector')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('District, State', 'ज़िला, राज्य')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('Job Demand')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('Trained Supply', 'प्रशिक्षित आपूर्ति')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('Net Gap', 'शुद्ध अंतर')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {filteredRecords.map((rec) => {
                const scaledDemand = Math.round(rec.annualDemand * horizon.demandMultiplier);
                const scaledTrained = Math.round(rec.annualTrained * horizon.supplyMultiplier);
                const scaledGap = scaledDemand - scaledTrained;
                return (
                  <tr key={rec.id} className="hover:bg-[#F8F5EF]">
                    <td className="py-2.5 px-3 font-medium text-[#173F35]">
                      {rec.tradeName}{' '}
                      <span className="text-[#64716D] font-mono">({rec.ncoCode})</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#64716D] tabular-nums">
                      Level {rec.nsqfLevel}
                    </td>
                    <td className="py-2.5 px-3 text-[#64716D]">{rec.sector}</td>
                    <td className="py-2.5 px-3 text-[#173F35]">
                      {rec.district}, <span className="text-[#64716D]">{rec.state}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold tabular-nums">
                      {scaledDemand.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {scaledTrained.toLocaleString('en-IN')}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                        scaledGap > 0 ? 'text-[#D94E34]' : 'text-[#B5721E]'
                      }`}
                    >
                      {scaledGap > 0
                        ? `+${scaledGap.toLocaleString('en-IN')}`
                        : scaledGap.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#173F35]">
                      {scaledGap > 2500 ? 'Acute Undersupply' : scaledGap > 0 ? 'Undersupply' : 'Balanced'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SurfaceCard>
      )}
    </div>
  );
};

/**
 * ============================================================================
 * SUPPORTING ROUTE: Training Capacity
 * ============================================================================
 */
export const TrainingCapacityPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
  onNavigate?: (route: NavRouteId) => void;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery = '', onNavigate }) => {
  const { t } = useLanguage();
  const horizon = getHorizonConfig(dateRange);
  const [selectedState, setSelectedState] = useState<string>('All States');
  const allDistricts = STATES_DATA.flatMap((s) => s.districts);
  const filteredDistricts = allDistricts.filter((d) => {
    const matchesState = selectedState === 'All States' || d.state === selectedState;
    const matchesSearch =
      !searchQuery.trim() ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  const centresCountStr =
    dateRange === 'Next 3 Years' ? '18,420' : dateRange === 'FY 2026–27' ? '16,200' : '14,952';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {t('National Training Capacity & Infrastructure')}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {t('ITI, NSTI, and PMKK training provider seat sanctions, batch utilization and instructor readiness')}
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
            value={selectedState}
            onChange={setSelectedState}
            options={[
              { label: 'All States', value: 'All States' },
              ...STATES_DATA.map((s) => ({ label: s.state, value: s.state })),
            ]}
            className="w-44"
          />
        </div>
      </div>

      {/* 4 Capacity KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <SurfaceCard className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E5F2E6] text-[#17604D] flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#64716D]">Available Seats ({dateRange})</div>
            <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-0.5">
              {horizon.availableSeatsLakh}
            </div>
            <div className="text-[11px] text-[#17604D] font-medium mt-1">
              +{dateRange === 'Next 3 Years' ? '28.4%' : dateRange === 'FY 2026–27' ? '18.9%' : '8.4%'} capacity added
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF0FA] text-[#3B66B8] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#64716D]">Allocated Seats ({dateRange})</div>
            <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-0.5">
              {horizon.allocatedSeatsLakh}
            </div>
            <div className="text-[11px] text-[#64716D] mt-1">
              {dateRange === 'Next 3 Years' ? '88.7%' : dateRange === 'FY 2026–27' ? '89.8%' : '87.2%'} overall utilization
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBF0D9] text-[#D97925] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#64716D]">Training Centres</div>
            <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-0.5">
              {centresCountStr}
            </div>
            <div className="text-[11px] text-[#64716D] mt-1">
              Govt ITIs, PMKK &amp; NSDC Partners
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBE5DE] text-[#D94E34] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#64716D]">Course Completion Rate</div>
            <div className="text-2xl font-bold text-[#173F35] tabular-nums mt-0.5">
              {horizon.completionRate}
            </div>
            <div className="text-[11px] text-[#17604D] font-medium mt-1">
              ↗ +{dateRange === 'Next 3 Years' ? '4.9%' : dateRange === 'FY 2026–27' ? '2.6%' : '3.2%'} vs baseline
            </div>
          </div>
        </SurfaceCard>
      </div>

      {/* District-Level Capacity Table */}
      <SurfaceCard className="overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#173F35]">
            District-Level Training Centre Capacity &amp; Seat Utilization ({dateRange})
          </h2>
          <span className="text-[11px] text-[#8C4E13] font-semibold bg-[#FAF0E1] px-2 py-0.5 rounded">
            Supply Scaling: {horizon.supplyMultiplier}x
          </span>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E9E0D3] bg-[#FAF7F2] text-[#64716D]">
              <th className="py-2.5 px-3 font-semibold">District</th>
              <th className="py-2.5 px-3 font-semibold">State</th>
              <th className="py-2.5 px-3 font-semibold text-right">Accredited Centres</th>
              <th className="py-2.5 px-3 font-semibold text-right">Annual Trained</th>
              <th className="py-2.5 px-3 font-semibold text-right">Seat Utilization</th>
              <th className="py-2.5 px-3 font-semibold text-right">Capacity Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2ECE1]">
            {filteredDistricts.map((dist) => {
              const scaledTrained = Math.round(dist.trained * horizon.supplyMultiplier);
              return (
                <tr key={dist.id} className="hover:bg-[#F8F5EF]">
                  <td className="py-2.5 px-3 font-semibold text-[#173F35]">{dist.name}</td>
                  <td className="py-2.5 px-3 text-[#64716D]">{dist.state}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{dist.centresCount}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    {scaledTrained.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-[#17604D] tabular-nums">
                    {dist.seatUtilization}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#173F35]">{dist.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SurfaceCard>

      {/* Cross-Link Banner to Dedicated Policy Simulation Sandbox */}
      <SurfaceCard className="p-4 bg-gradient-to-r from-[#FAF6EF] to-[#F3EDE0] border-[#E5DAC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E2F0E3] text-[#17604D] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#173F35]">
              {t('"What-If" Training Capacity Sandbox & Gap Simulator', '"व्हॉट-इफ़" प्रशिक्षण क्षमता सैंडबॉक्स एवं अंतर सिम्युलेटर')}
            </div>
            <div className="text-[11px] text-[#64716D] mt-0.5">
              {t(
                'Simulate adding or reallocating training seats, test dropout sensitivity, and evaluate real-time gap reduction before committing targets.',
                'प्रशिक्षण सीटों को जोड़ने या पुनर्वितरित करने का सिमुलेशन करें, ड्रॉपआउट संवेदनशीलता का परीक्षण करें और वास्तविक समय में कमी में कमी का मूल्यांकन करें।'
              )}
            </div>
          </div>
        </div>
        {onNavigate && (
          <SecondaryButton
            tone="warm"
            onClick={() => {
              onNavigate('policy-sandbox');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <span>{t('Launch Policy Sandbox', 'सैंडबॉक्स खोलें')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </SecondaryButton>
        )}
      </SurfaceCard>
    </div>
  );
};

export { PolicySandboxPage };

/**
 * ============================================================================
 * SUPPORTING ROUTE: Reports (Official MSDE Reports, Assessments & Data Exports)
 * ============================================================================
 */
export const ReportsPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery: initialSearch = '' }) => {
  const { t } = useLanguage();
  const horizon = getHorizonConfig(dateRange);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  const filteredReports = GENERATED_REPORTS.filter((r) => {
    const matchCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const matchSearch =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Search/Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E0D3]">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {t('Executive Reports & Policy Dossiers')}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {t('Generate DPDP-compliant statutory reports, state briefing notes, and district skill development plans (DSDP)')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
            <span>{dateRange}</span>
            <span className="text-[#A57849]">·</span>
            <span className="font-normal text-[#6C5840]">{horizon.label}</span>
          </span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64716D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E9E0D3] bg-[#FFFEFB] text-xs text-[#173F35] placeholder:text-[#8E9B97] focus:outline-none focus:border-[#17604D] w-48 sm:w-56"
            />
          </div>
          <SelectControl
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: 'All Categories', value: 'All' },
              { label: 'State Skill Gap', value: 'State Skill Gap' },
              { label: 'Sector Forecast', value: 'Sector Forecast' },
              { label: 'NSQF Curriculum', value: 'NSQF Curriculum' },
              { label: 'ITI Capacity', value: 'ITI Capacity' },
            ]}
            className="w-40 sm:w-44"
          />
        </div>
      </div>

      {/* Reports Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SurfaceCard className="p-3">
          <div className="text-[11px] font-medium text-[#64716D]">Total Available Reports</div>
          <div className="text-xl font-bold text-[#173F35] mt-0.5">{GENERATED_REPORTS.length} Dossiers</div>
        </SurfaceCard>
        <SurfaceCard className="p-3">
          <div className="text-[11px] font-medium text-[#64716D]">Primary Formats</div>
          <div className="text-xl font-bold text-[#17604D] mt-0.5">PDF · XLSX · CSV</div>
        </SurfaceCard>
        <SurfaceCard className="p-3">
          <div className="text-[11px] font-medium text-[#64716D]">Latest Dossier Update</div>
          <div className="text-xl font-bold text-[#D97925] mt-0.5">14 Oct 2026</div>
        </SurfaceCard>
        <SurfaceCard className="p-3">
          <div className="text-[11px] font-medium text-[#64716D]">Governance Authority</div>
          <div className="text-xl font-bold text-[#173F35] mt-0.5">MSDE / NCVET</div>
        </SurfaceCard>
      </div>

      {filteredReports.length === 0 ? (
        <EmptyStateCard
          variant="reports"
          title="No Reports Found in Selected Category"
          description="No generated reports match your search or filter. Reset to view all official MSDE reports."
          actionLabel="Show All Reports"
          onAction={() => {
            setCategoryFilter('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <SurfaceCard className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E9E0D3] bg-[#FAF7F2] text-[#64716D]">
                <th className="py-2.5 px-3 font-semibold">Report Title</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Target Period</th>
                <th className="py-2.5 px-3 font-semibold">Generated On</th>
                <th className="py-2.5 px-3 font-semibold">Format / Size</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#F8F5EF] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#173F35]">
                    {rep.title}
                    <div className="text-[11px] font-normal text-[#64716D]">
                      {rep.author}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EAF3EE] text-[#166534] border border-[#BBF7D0]">
                      {rep.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#173F35] tabular-nums font-medium">{rep.period}</td>
                  <td className="py-2.5 px-3 text-[#64716D] tabular-nums">
                    {rep.generatedDate}
                  </td>
                  <td className="py-2.5 px-3 text-[#64716D] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-[#F5F0E7] text-[#173F35] font-semibold text-[10px]">
                      {rep.format}
                    </span>{' '}
                    <span className="text-[11px]">· {rep.size}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <SecondaryButton
                      tone="warm"
                      onClick={() => ApiService.triggerDsdpDownload(492)}
                      title="Download Official DSDP Target Allocation Dossier"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </SecondaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SurfaceCard>
      )}
    </div>
  );
};

export const ReportsAndRecommendationsPage = ReportsPage;

/**
 * ============================================================================
 * SUPPORTING ROUTE: Data Explorer
 * ============================================================================
 */
export const DataExplorerPage: React.FC<{
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
  onNavigate?: (route: NavRouteId) => void;
}> = ({ userSession, dateRange = 'Last 1 Year', searchQuery: initialSearch = '', onNavigate }) => {
  const { t } = useLanguage();
  const horizon = getHorizonConfig(dateRange);
  const [query, setQuery] = useState<string>(initialSearch);
  const [stateFilter, setStateFilter] = useState<string>('All States');
  const [sectorFilter, setSectorFilter] = useState<string>('All Sectors');
  const [sourceFilter, setSourceFilter] = useState<string>('All Sources');
  const [nsqfFilter, setNsqfFilter] = useState<string>('All Levels');

  const filtered = COMPREHENSIVE_DEMAND_SUPPLY_RECORDS.filter((r) => {
    const matchQ =
      !query.trim() ||
      r.tradeName.toLowerCase().includes(query.toLowerCase()) ||
      r.ncoCode.includes(query) ||
      r.district.toLowerCase().includes(query.toLowerCase()) ||
      r.state.toLowerCase().includes(query.toLowerCase()) ||
      r.sector.toLowerCase().includes(query.toLowerCase());
    const matchState = stateFilter === 'All States' || r.state === stateFilter;
    const matchSector = sectorFilter === 'All Sectors' || r.sector === sectorFilter;
    const matchSource = sourceFilter === 'All Sources' || r.source === sourceFilter;
    const matchNsqf =
      nsqfFilter === 'All Levels' || `Level ${r.nsqfLevel}` === nsqfFilter;
    return matchQ && matchState && matchSector && matchSource && matchNsqf;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
            {t('Labour Market Data Explorer')}
          </h1>
          <p className="text-xs text-[#64716D] mt-1">
            {t('Deep query engine for multi-dimensional analysis of PLFS, Periodic Labour Force Survey, and EPFO hiring trends')}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
            <span>{dateRange}</span>
            <span className="text-[#A57849]">·</span>
            <span className="font-normal text-[#6C5840]">{horizon.label}</span>
          </span>
          <div className="flex items-center gap-2 text-xs text-[#17604D] font-medium">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Data Freshness: Synced 2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <SurfaceCard className="p-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-[11px] font-medium text-[#64716D] block mb-1">
              Filter by Trade, NCO or District
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64716D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search NCO code or trade..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFEFB] border border-[#E9E0D3] rounded-lg text-[#173F35] focus:outline-none focus:border-[#17604D]"
              />
            </div>
          </div>
          <SelectControl
            label="State"
            value={stateFilter}
            onChange={setStateFilter}
            options={[
              { label: 'All States', value: 'All States' },
              ...STATES_DATA.map((s) => ({ label: s.state, value: s.state })),
            ]}
          />
          <SelectControl
            label="Sector"
            value={sectorFilter}
            onChange={setSectorFilter}
            options={[
              { label: 'All Sectors', value: 'All Sectors' },
              ...ALL_SECTORS_LIST.map((sec) => ({ label: sec, value: sec })),
            ]}
          />
          <SelectControl
            label="Data Source"
            value={sourceFilter}
            onChange={setSourceFilter}
            options={[
              { label: 'All Sources', value: 'All Sources' },
              { label: 'NSDC Skill India', value: 'NSDC Skill India' },
              { label: 'PLFS Microdata', value: 'PLFS Microdata' },
              { label: 'EPFO Payroll', value: 'EPFO Payroll' },
              { label: 'NCS Portal', value: 'NCS Portal' },
            ]}
          />
          <SelectControl
            label="NSQF Level"
            value={nsqfFilter}
            onChange={setNsqfFilter}
            options={[
              { label: 'All Levels', value: 'All Levels' },
              { label: 'Level 3', value: 'Level 3' },
              { label: 'Level 4', value: 'Level 4' },
              { label: 'Level 5', value: 'Level 5' },
              { label: 'Level 6', value: 'Level 6' },
            ]}
          />
        </div>
      </SurfaceCard>

      {filtered.length === 0 ? (
        <EmptyStateCard
          variant="data"
          title="No Dataset Rows Match Your Filter Criteria"
          description="Try broadening your NCO-2015 occupation code filter or switching Data Source to All Sources."
          actionLabel="Clear Explorer Filters"
          onAction={() => {
            setQuery('');
            setStateFilter('All States');
            setSectorFilter('All Sectors');
            setSourceFilter('All Sources');
            setNsqfFilter('All Levels');
          }}
        />
      ) : (
        <SurfaceCard className="overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#173F35]">
              Microdata Registry ({dateRange})
            </h2>
            <span className="text-[11px] text-[#8C4E13] font-semibold bg-[#FAF0E1] px-2 py-0.5 rounded">
              Scaling Factor: {horizon.demandMultiplier}x Demand / {horizon.supplyMultiplier}x Supply
            </span>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E9E0D3] bg-[#FAF7F2] text-[#64716D]">
                <th className="py-2.5 px-3 font-semibold">NCO Code</th>
                <th className="py-2.5 px-3 font-semibold">Occupation Title</th>
                <th className="py-2.5 px-3 font-semibold">NSQF</th>
                <th className="py-2.5 px-3 font-semibold">Location</th>
                <th className="py-2.5 px-3 font-semibold text-right">Demand</th>
                <th className="py-2.5 px-3 font-semibold text-right">Trained</th>
                <th className="py-2.5 px-3 font-semibold">Primary Source</th>
                <th className="py-2.5 px-3 font-semibold text-right">Freshness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {filtered.map((item) => {
                const scaledDemand = Math.round(item.annualDemand * horizon.demandMultiplier);
                const scaledTrained = Math.round(item.annualTrained * horizon.supplyMultiplier);
                return (
                  <tr key={item.id} className="hover:bg-[#F8F5EF]">
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#17604D]">
                      {item.ncoCode}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#173F35]">{item.tradeName}</td>
                    <td className="py-2.5 px-3 text-[#64716D] tabular-nums">
                      L{item.nsqfLevel}
                    </td>
                    <td className="py-2.5 px-3 text-[#173F35]">
                      {item.district}, <span className="text-[#64716D]">{item.state}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold tabular-nums">
                      {scaledDemand.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {scaledTrained.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-[#64716D]">{item.source}</td>
                    <td className="py-2.5 px-3 text-right text-[#64716D] tabular-nums">
                      {item.lastUpdated}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SurfaceCard>
      )}

      {/* Cross-Link Banner to Dedicated Telemetry Ingestion Page */}
      <SurfaceCard className="p-4 bg-gradient-to-r from-[#FAF6EF] to-[#F3EDE0] border-[#E5DAC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E2F0E3] text-[#17604D] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#173F35]">
              {t('Bulk District Telemetry CSV & Admission Uploader', 'बल्क जिला टेलीमेट्री सीएसवी एवं प्रवेश अपलोडर')}
            </div>
            <div className="text-[11px] text-[#64716D] mt-0.5">
              {t(
                'Need to ingest local ITI batch admissions or district telemetry files? Upload and validate datasets in the dedicated Telemetry Upload portal.',
                'क्या स्थानीय आईटीआई बैच प्रवेश अथवा जिला टेलीमेट्री फ़ाइलें अपलोड करनी हैं? समर्पित टेलीमेट्री अपलोड पोर्टल में डेटासेट अपलोड एवं सत्यापित करें।'
              )}
            </div>
          </div>
        </div>
        {onNavigate && (
          <SecondaryButton
            tone="warm"
            onClick={() => {
              onNavigate('telemetry-upload');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <span>{t('Go to Telemetry Upload', 'टेलीमेट्री अपलोड पर जाएं')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </SecondaryButton>
        )}
      </SurfaceCard>
    </div>
  );
};

export { TelemetryUploadPage };

/**
 * ============================================================================
 * SUPPORTING ROUTE: API Access
 * ============================================================================
 */
export const ApiAccessPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleCurl = `curl -X GET "https://api.kaushaldrishti.gov.in/v1/districts/MH-PUNE/skill-gaps?sector=IT-ITeS" \\
  -H "Authorization: Bearer kd_live_msde_94a8f21c0e" \\
  -H "Accept: application/json"`;

  const sampleJson = `{
  "district": "Pune",
  "state": "Maharashtra",
  "period": "FY2026-27",
  "summary": {
    "job_demand": 48200,
    "trained_candidates": 32500,
    "net_gap": 15700,
    "status": "Undersupply"
  },
  "top_shortage_trades": [
    { "nco_code": "2512.01", "trade": "Software Developer", "demand": 8200 },
    { "nco_code": "7223.03", "trade": "CNC Operator", "demand": 3400 }
  ]
}`;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
          State &amp; SSDM API Integration
        </h1>
        <p className="text-xs text-[#64716D] mt-1">
          REST endpoints for State Skill Development Missions, NCVET, and Skill India Digital portals
        </p>
      </div>

      {/* Endpoint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {[
          {
            method: 'GET',
            path: '/v1/districts/{id}/skill-gaps',
            desc: 'Returns district-level demand, certified supply, and NCO-2015 shortage status.',
            rate: '1,000 req / min',
          },
          {
            method: 'POST',
            path: '/v1/forecasts/nco-2015',
            desc: 'Generates 1-to-5 year workforce demand projections for specified NCO trade codes.',
            rate: '500 req / min',
          },
          {
            method: 'GET',
            path: '/v1/centres/capacity-audit',
            desc: 'Lists ITI & PMKVY seat utilization and recommended expansion corridors.',
            rate: '1,000 req / min',
          },
        ].map((ep) => (
          <SurfaceCard key={ep.path} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-[#17604D]">
                  {ep.method}
                </span>
                <span className="text-[11px] text-[#64716D] tabular-nums">{ep.rate}</span>
              </div>
              <div className="font-mono text-xs font-bold text-[#173F35] mt-1.5 break-all">
                {ep.path}
              </div>
              <p className="text-xs text-[#64716D] mt-1.5 leading-relaxed">{ep.desc}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-[11px]">
              <span className="text-[#17604D] font-semibold">Operational (99.95% SLA)</span>
              <button
                type="button"
                onClick={() => handleCopy(ep.path, ep.path)}
                className="text-[#64716D] hover:text-[#173F35] inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === ep.path ? (
                  <>
                    <Check className="w-3 h-3 text-[#17604D]" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy URI
                  </>
                )}
              </button>
            </div>
          </SurfaceCard>
        ))}
      </div>

      {/* Request & Response Code Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SurfaceCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#173F35]">Request Example (cURL)</h2>
            <SecondaryButton
              tone="outline"
              onClick={() => handleCopy('curl', sampleCurl)}
              className="py-1 px-2.5"
            >
              {copiedKey === 'curl' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#17604D]" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </SecondaryButton>
          </div>
          <pre className="bg-[#1B2522] text-[#E6F0EC] p-3.5 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed">
            {sampleCurl}
          </pre>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-[#173F35]">Response Payload (200 OK)</h2>
            <SecondaryButton
              tone="outline"
              onClick={() => handleCopy('json', sampleJson)}
              className="py-1 px-2.5"
            >
              {copiedKey === 'json' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#17604D]" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </SecondaryButton>
          </div>
          <pre className="bg-[#1B2522] text-[#E6F0EC] p-3.5 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed">
            {sampleJson}
          </pre>
        </SurfaceCard>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * SUPPORTING ROUTE: Settings
 * ============================================================================
 */
export interface SettingsPageProps {
  userSession?: UserSession | null;
  onUserSessionChange?: (session: UserSession) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userSession,
  onUserSessionChange,
}) => {
  const { t } = useLanguage();
  const [savedBanner, setSavedBanner] = useState<boolean>(false);
  const [directorateName, setDirectorateName] = useState<string>(
    'Policy Planning & Analytics Division (MSDE)'
  );
  const [defaultState, setDefaultState] = useState<string>('Maharashtra');
  const [shortageThreshold, setShortageThreshold] = useState<string>('15%');
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  return (
    <div className="space-y-5 w-full">
      <div>
        <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
          {t('Platform & Planner Settings')}
        </h1>
        <p className="text-xs text-[#64716D] mt-1">
          {t('Configure MSDE planner profile, regional jurisdiction defaults, and early-warning shortage thresholds')}
        </p>
      </div>

      <SurfaceCard className="space-y-5 p-6 w-full">
        <h2 className="text-sm font-bold text-[#173F35] pb-2.5 border-b border-[#E9E0D3]">
          {t('Planner Profile & Jurisdiction')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-medium text-[#64716D] block mb-1">
              Directorate / Authority Name
            </label>
            <input
              type="text"
              value={directorateName}
              onChange={(e) => setDirectorateName(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFEFB] border border-[#E9E0D3] rounded-lg text-[#173F35] font-medium focus:outline-none focus:border-[#17604D]"
            />
          </div>
          <SelectControl
            label="Default State Jurisdiction"
            value={defaultState}
            onChange={setDefaultState}
            options={STATES_DATA.map((s) => ({ label: s.state, value: s.state }))}
          />
          <SelectControl
            label="Acute Shortage Trigger Threshold"
            value={shortageThreshold}
            onChange={setShortageThreshold}
            options={[
              { label: '10% Demand-Supply Gap', value: '10%' },
              { label: '15% Demand-Supply Gap (Recommended)', value: '15%' },
              { label: '20% Demand-Supply Gap', value: '20%' },
            ]}
          />
          <SelectControl
            label="Primary Classification Standard"
            value="NCO-2015 + NSQF Aligned"
            onChange={() => {}}
            options={[
              { label: 'NCO-2015 + NSQF Aligned', value: 'NCO-2015 + NSQF Aligned' },
              { label: 'NIC-2008 Sector Mapping', value: 'NIC-2008 Sector Mapping' },
            ]}
          />
        </div>

        <h2 className="text-sm font-bold text-[#173F35] pt-2 pb-2.5 border-b border-[#E9E0D3]">
          Alert &amp; Digest Notifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAF7F2] border border-[#EFE7DA] cursor-pointer hover:bg-[#F5F0E7] transition-colors">
            <div>
              <div className="font-semibold text-[#173F35]">
                Immediate District Shortage Alerts
              </div>
              <div className="text-[11px] text-[#64716D] mt-0.5">
                Notify when any NSQF Level 3–6 trade exceeds projected undersupply threshold
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="accent-[#17604D] w-4 h-4 shrink-0 ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAF7F2] border border-[#EFE7DA] cursor-pointer hover:bg-[#F5F0E7] transition-colors">
            <div>
              <div className="font-semibold text-[#173F35]">
                Weekly State Skill Gap Briefing PDF
              </div>
              <div className="text-[11px] text-[#64716D] mt-0.5">
                Automated Monday summary for State Skill Development Mission directors
              </div>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="accent-[#17604D] w-4 h-4 shrink-0 ml-3"
            />
          </label>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          {savedBanner && (
            <span className="text-xs font-semibold text-[#17604D]">
              Preferences saved to planner profile.
            </span>
          )}
          <PrimaryButton
            onClick={() => {
              setSavedBanner(true);
              setTimeout(() => setSavedBanner(false), 3000);
            }}
          >
            Save Preferences
          </PrimaryButton>
        </div>
      </SurfaceCard>

      {/* MSDE Officer Authentication & Access Delegation (Added on) */}
      <SurfaceCard className="space-y-4 p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E0D3]">
          <div>
            <h2 className="text-sm font-bold text-[#173F35]">
              MSDE Government Officer Authentication &amp; Delegation
            </h2>
            <p className="text-xs text-[#64716D] mt-0.5">
              Secure role-based access for District Skill Officers (DSO), State SSDM Directors, and NCVET Authorities.
            </p>
          </div>
          <SecondaryButton
            tone="warm"
            onClick={() => setAuthModalOpen(true)}
            className="shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#17604D]" />
            <span>Launch Officer Auth Dialog</span>
          </SecondaryButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#E9E0D3]">
            <div className="text-[10px] uppercase font-bold text-[#64716D]">Access Tier</div>
            <div className="text-sm font-bold text-[#173F35] mt-1">Level-3 Restricted</div>
            <div className="text-[11px] text-[#17604D] mt-0.5">Authorized for DSDP Allocation</div>
          </div>
          <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#E9E0D3]">
            <div className="text-[10px] uppercase font-bold text-[#64716D]">Compliance Standard</div>
            <div className="text-sm font-bold text-[#173F35] mt-1">DPDP Act (2023)</div>
            <div className="text-[11px] text-[#64716D] mt-0.5">256-Bit TLS End-to-End</div>
          </div>
          <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#E9E0D3]">
            <div className="text-[10px] uppercase font-bold text-[#64716D]">Active Gateway</div>
            <div className="text-sm font-bold text-[#173F35] mt-1">NIC e-Gov Single Sign-On</div>
            <div className="text-[11px] text-[#64716D] mt-0.5">MSDE Planner Domain</div>
          </div>
        </div>
      </SurfaceCard>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(session) => {
          if (onUserSessionChange) {
            onUserSessionChange(session);
          }
        }}
        currentSession={userSession}
      />
    </div>
  );
};

/**
 * ============================================================================
 * DESIGN SYSTEM & ASSET SHEET CATALOGUE (Reference Image 2 Showcase)
 * ============================================================================
 */
export const DesignSystemCataloguePage: React.FC = () => {
  const colorTokens = [
    { name: 'Warm ivory', hex: '#F8F5EF', usage: 'Main page background' },
    { name: 'Warm white', hex: '#FFFEFB', usage: 'Cards and panels' },
    { name: 'Cream', hex: '#F5F0E7', usage: 'Sidebar and secondary surfaces' },
    { name: 'Forest green', hex: '#173F35', usage: 'Primary text and brand' },
    { name: 'Deep green', hex: '#17604D', usage: 'Primary buttons & selected controls' },
    { name: 'Terracotta', hex: '#D96843', usage: 'Active navigation & warning accents' },
    { name: 'Soft coral', hex: '#F5D7CC', usage: 'Shortage and alert backgrounds' },
    { name: 'Sage', hex: '#DCE9D9', usage: 'Balanced or positive states' },
    { name: 'Saffron', hex: '#F2B968', usage: 'Caution and secondary highlights' },
    { name: 'Muted slate', hex: '#64716D', usage: 'Supporting text' },
    { name: 'Warm border', hex: '#E9E0D3', usage: 'Borders and dividers' },
  ];

  const iconList = [
    'dashboard',
    'demand',
    'forecast',
    'sectors',
    'map',
    'training',
    'alerts',
    'reports',
    'data',
    'api',
    'settings',
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif-heading text-2xl font-bold text-[#173F35]">
          KaushalDrishti Design System &amp; Asset Catalogue
        </h1>
        <p className="text-xs text-[#64716D] mt-1">
          Standalone extracted visual assets from Reference Image 2, color tokens, typography scale, and reusable components
        </p>
      </div>

      {/* Section 1: Extracted Logo Variations & Header / Sidebar Illustrations */}
      <SurfaceCard className="space-y-4">
        <h2 className="text-sm font-bold text-[#173F35] border-b border-[#E9E0D3] pb-2">
          1. Brand Logos &amp; Panoramic Indian Illustrations (Extracted Standalone Assets)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center justify-center gap-2">
            <LogoHorizontal />
            <span className="text-[11px] font-mono text-[#64716D]">logo-horizontal.png</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center justify-center gap-2">
            <LogoIcon size={54} />
            <span className="text-[11px] font-mono text-[#64716D]">logo-icon.png</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center justify-center gap-2">
            <LogoSquare />
            <span className="text-[11px] font-mono text-[#64716D]">logo-square.png</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-8 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
            <HeaderIllustration className="w-full h-28" />
            <div className="text-[11px] font-mono text-[#64716D] mt-1 text-center">
              header-illustration.png (1600×200)
            </div>
          </div>
          <div className="lg:col-span-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center">
            <SidebarBottomIllustration className="w-full h-28" />
            <div className="text-[11px] font-mono text-[#64716D] mt-1">
              sidebar-bottom.png (320×200)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center">
            <LeafLeft className="w-20 h-20" />
            <span className="text-[11px] font-mono text-[#64716D]">leaf-left.png</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center">
            <LeafRight className="w-20 h-20" />
            <span className="text-[11px] font-mono text-[#64716D]">leaf-right.png</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center">
            <MandalaPattern className="w-20 h-20" />
            <span className="text-[11px] font-mono text-[#64716D]">mandala-pattern.png</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center justify-center">
            <MiniIllustration className="w-full h-20" />
            <span className="text-[11px] font-mono text-[#64716D]">mini-illustration.png</span>
          </div>
        </div>
      </SurfaceCard>

      {/* Section 2: Empty State Illustrations */}
      <SurfaceCard className="space-y-3">
        <h2 className="text-sm font-bold text-[#173F35] border-b border-[#E9E0D3] pb-2">
          2. Empty State Illustrations (400×300 Standalone Artwork)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(
            [
              'search',
              'data',
              'analysis',
              'map',
              'training',
              'reports',
              'construction',
            ] as const
          ).map((variant) => (
            <div
              key={variant}
              className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center text-center"
            >
              <EmptyStateIllustration variant={variant} className="w-28 h-20" />
              <span className="text-[10px] font-mono text-[#64716D] mt-1">
                empty-{variant}.png
              </span>
            </div>
          ))}
        </div>
      </SurfaceCard>

      {/* Section 3: Outline Navigation Icon Set & Colour Tokens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <SurfaceCard className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold text-[#173F35] border-b border-[#E9E0D3] pb-2">
            3. Outline Navigation Icons (48×48 Theme)
          </h2>
          <div className="grid grid-cols-4 gap-2.5">
            {iconList.map((ic) => (
              <div
                key={ic}
                className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EFE7DA] flex flex-col items-center gap-1.5 text-[#173F35]"
              >
                <AssetOutlineIcon name={ic} className="w-5 h-5" />
                <span className="text-[10px] font-mono text-[#64716D]">icon-{ic}</span>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-7 space-y-3">
          <h2 className="text-sm font-bold text-[#173F35] border-b border-[#E9E0D3] pb-2">
            4. Mandatory Colour Palette Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {colorTokens.map((tok) => (
              <div
                key={tok.name}
                className="flex items-center gap-2.5 p-2 rounded-lg border border-[#E9E0D3] bg-[#FFFEFB]"
              >
                <div
                  className="w-8 h-8 rounded-md border border-[#E9E0D3] shrink-0"
                  style={{ backgroundColor: tok.hex }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#173F35] truncate">{tok.name}</div>
                  <div className="text-[10px] font-mono text-[#64716D]">{tok.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
};
