import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { SurfaceCard, PrimaryButton, SecondaryButton } from './DesignSystemUI';
import { ApiService, SimulationRequestPayload } from '../services/apiService';
import { UserSession } from './AuthModal';
import { NavRouteId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getHorizonConfig } from '../data/dashboardMetrics';

interface PolicySandboxPageProps {
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
  onNavigate?: (route: NavRouteId) => void;
}

interface ScenarioPreset {
  id: string;
  title: string;
  districtCode: number;
  ncoCode: string;
  seatDelta: number;
  enrolmentRate: number;
  dropoutRate: number;
  retentionRate: number;
}

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'solar-pune',
    title: 'Solar PV Expansion (Pune +100)',
    districtCode: 492,
    ncoCode: '7411.0101',
    seatDelta: 100,
    enrolmentRate: 90,
    dropoutRate: 10,
    retentionRate: 78,
  },
  {
    id: 'ev-kanpur',
    title: 'EV Service Ramp (Kanpur +140)',
    districtCode: 158,
    ncoCode: '7231.0102',
    seatDelta: 140,
    enrolmentRate: 92,
    dropoutRate: 8,
    retentionRate: 82,
  },
  {
    id: 'health-lucknow',
    title: 'Healthcare Retention (Lucknow +80)',
    districtCode: 160,
    ncoCode: '5321.0100',
    seatDelta: 80,
    enrolmentRate: 95,
    dropoutRate: 6,
    retentionRate: 88,
  },
  {
    id: 'cloud-mumbai',
    title: 'Cloud & AI Annotators (Mumbai +200)',
    districtCode: 485,
    ncoCode: '3514.0201',
    seatDelta: 200,
    enrolmentRate: 94,
    dropoutRate: 9,
    retentionRate: 76,
  },
];

export const PolicySandboxPage: React.FC<PolicySandboxPageProps> = ({
  userSession,
  dateRange = 'Last 1 Year',
  searchQuery = '',
  onNavigate,
}) => {
  const { t } = useLanguage();
  const horizon = getHorizonConfig(dateRange);

  const [districtCode, setDistrictCode] = useState<number>(492); // Pune default
  const [ncoCode, setNcoCode] = useState<string>('7411.0101'); // Solar PV
  const [seatDelta, setSeatDelta] = useState<number>(100);
  const [enrolmentRate, setEnrolmentRate] = useState<number>(88);
  const [dropoutRate, setDropoutRate] = useState<number>(12);
  const [retentionRate, setRetentionRate] = useState<number>(75);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [committedMsg, setCommittedMsg] = useState<string | null>(null);

  // Baseline data for chosen district/trade
  const baselineSanctioned = 180;
  const baselineDemand = 2450;
  const baselineSupply = 125;
  const baselineGap = baselineDemand - baselineSupply;

  // Real-time recalculation using pipeline yield formula:
  // Effective New Supply = (Baseline + SeatDelta) * (enrolment * (1 - dropout) * retention) * certification(0.9)
  const simulatedSanctioned = Math.max(0, baselineSanctioned + seatDelta);
  const alpha = enrolmentRate / 100;
  const beta = dropoutRate / 100;
  const mu = retentionRate / 100;
  const gamma = 0.90; // Standard certification coefficient

  const enrolledCount = Math.round(simulatedSanctioned * alpha);
  const completedCount = Math.round(enrolledCount * (1 - beta));
  const certifiedCount = Math.round(completedCount * gamma);
  const retainedCount = Math.round(certifiedCount * mu);
  const informalContribution = 45; // Estimated non-formal workforce transition
  const simulatedSupply = retainedCount + informalContribution;
  const simulatedGap = Math.max(0, baselineDemand - simulatedSupply);
  const gapReduction = baselineGap - simulatedGap;
  const gapReductionPct = baselineGap > 0 ? Math.round((gapReduction / baselineGap) * 100) : 0;

  // Overall Pipeline Net Conversion Yield %
  const netPipelineYieldPct = Math.round(alpha * (1 - beta) * gamma * mu * 100);

  const handleApplyPreset = (preset: ScenarioPreset) => {
    setDistrictCode(preset.districtCode);
    setNcoCode(preset.ncoCode);
    setSeatDelta(preset.seatDelta);
    setEnrolmentRate(preset.enrolmentRate);
    setDropoutRate(preset.dropoutRate);
    setRetentionRate(preset.retentionRate);
  };

  const handleReset = () => {
    setSeatDelta(0);
    setEnrolmentRate(85);
    setDropoutRate(15);
    setRetentionRate(72);
  };

  const handleCommit = async () => {
    setIsSimulating(true);
    const payload: SimulationRequestPayload = {
      district_lgd_code: districtCode,
      nco_code: ncoCode,
      seat_capacity_delta: seatDelta,
      assumed_enrollment_rate: alpha,
      assumed_dropout_rate: beta,
      assumed_retention_rate: mu,
      horizon: '12M',
    };
    await ApiService.simulateCapacity(payload);
    setIsSimulating(false);
    setCommittedMsg(
      t(
        'Capacity parameters committed to Draft District Skill Development Plan (DSDP).',
        'क्षमता मापदंड प्रारूप जिला कौशल विकास योजना (डीएसडीपी) में दर्ज कर दिए गए हैं।'
      )
    );
    setTimeout(() => setCommittedMsg(null), 4500);
  };

  const districtNamesMap: Record<number, string> = {
    492: 'Pune, Maharashtra (LGD 492)',
    158: 'Kanpur Nagar, Uttar Pradesh (LGD 158)',
    365: 'Khordha / Bhubaneswar, Odisha (LGD 365)',
    160: 'Lucknow, Uttar Pradesh (LGD 160)',
    485: 'Mumbai Suburban, Maharashtra (LGD 485)',
  };

  const tradeNamesMap: Record<string, string> = {
    '7411.0101': 'Solar PV Rooftop Technician (7411.0101)',
    '7231.0102': 'EV Automotive Service Technician (7231.0102)',
    '7223.0501': 'CNC Machinist & Precision Operator (7223.0501)',
    '5321.0100': 'Healthcare General Duty Assistant (5321.0100)',
    '2512.0101': 'Software Developer / Cloud Eng (2512.0101)',
    '3514.0201': 'AI Model Data Annotator (3514.0201)',
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E9E0D3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide uppercase bg-[#E2F0E3] text-[#17604D]">
              {t('Interactive Policy Sandbox', 'इंटरैक्टिव नीति सैंडबॉक्स')}
            </span>
            <span className="text-[11px] text-[#64716D] font-medium">
              {t('MSDE Common Norms (5th Amendment) Compliant', 'एमएसडीई सामान्य मानदंड (5वां संशोधन) अनुपालक')}
            </span>
          </div>
          <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#173F35] mt-1">
            {t('"What-If" Training Capacity Sandbox & Gap Simulator', '"व्हॉट-इफ़" प्रशिक्षण क्षमता सैंडबॉक्स एवं अंतर सिम्युलेटर')}
          </h1>
          <p className="text-xs text-[#64716D] mt-0.5 max-w-3xl">
            {t(
              'Simulate adding or reallocating training seats, test dropout sensitivity, and evaluate real-time gap reduction before committing targets to District Skill Development Plans (DSDP).',
              'प्रशिक्षण सीटों को जोड़ने या पुनर्वितरित करने का सिमुलेशन करें, ड्रॉपआउट संवेदनशीलता का परीक्षण करें और जिला कौशल विकास योजना में लक्ष्य स्वीकृत करने से पूर्व वास्तविक समय में कमी में कमी का मूल्यांकन करें।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
            <span>{dateRange}</span>
            <span className="text-[#A57849]">·</span>
            <span className="font-normal text-[#6C5840]">{horizon.label}</span>
          </span>

          <SecondaryButton tone="warm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Reset Levers', 'लीवर रीसेट करें')}</span>
          </SecondaryButton>
        </div>
      </div>

      {/* 4 Summary Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Active Simulation Target', 'सक्रिय सिमुलेशन लक्ष्य')}</span>
            <MapPin className="w-3.5 h-3.5 text-[#17604D]" />
          </div>
          <div className="text-sm font-bold text-[#173F35] truncate" title={districtNamesMap[districtCode]}>
            {districtNamesMap[districtCode]?.split('(')[0] || 'District'}
          </div>
          <div className="text-[11px] text-[#64716D] truncate mt-0.5" title={tradeNamesMap[ncoCode]}>
            {tradeNamesMap[ncoCode]?.split('(')[0]}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Pipeline Net Yield (α·β·γ·μ)', 'पाइपलाइन शुद्ध रूपांतरण दर')}</span>
            <Activity className="w-3.5 h-3.5 text-[#3B66B8]" />
          </div>
          <div className="text-xl font-bold text-[#173F35] tabular-nums">
            {netPipelineYieldPct}%
          </div>
          <div className="text-[11px] text-[#17604D] font-medium mt-0.5">
            {retainedCount} {t('locally retained of', 'स्थानीय रूप से प्रतिधारित')} {simulatedSanctioned}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Simulated Gap Abatement', 'अनुमानित अंतर कमी')}</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#166534]" />
          </div>
          <div className="text-xl font-bold text-[#166534] tabular-nums">
            +{gapReductionPct}% {t('Deficit Reduction', 'कमी में सुधार')}
          </div>
          <div className="text-[11px] text-[#64716D] mt-0.5">
            -{gapReduction} {t('shortage vs baseline', 'कमी तुलनात्मक आधार')}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Governance Standard', 'शासन मानक')}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97925]" />
          </div>
          <div className="text-sm font-bold text-[#173F35]">
            DSDP Draft Sanction
          </div>
          <div className="text-[11px] text-[#17604D] font-medium mt-0.5">
            {t('Real-Time Tensor Active', 'रीयल-टाइम टेंसर सक्रिय')}
          </div>
        </SurfaceCard>
      </div>

      {/* Scenario Presets Bar */}
      <SurfaceCard className="p-3 bg-[#FAF7F2] border-[#EAE2D5]">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
            <Sparkles className="w-4 h-4 text-[#D97925]" />
            <span>{t('One-Click Scenario Presets:', 'एक-क्लिक परिदृश्य प्रीसेट:')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {SCENARIO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FFFEFB] border border-[#E0D5C3] text-[#173F35] hover:bg-[#F5EEDB] hover:border-[#D1BFA5] transition-all cursor-pointer shadow-2xs"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </SurfaceCard>

      {/* Main Interactive Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Sliders and Levers (6 cols) */}
        <SurfaceCard className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
              <SlidersHorizontal className="w-4 h-4 text-[#17604D]" />
              <span>{t('Policy Levers & Capacity Parameters', 'नीति लीवर एवं क्षमता मापदंड')}</span>
            </div>
            <span className="text-[11px] text-[#64716D] font-mono">LGD &amp; NCO-2015</span>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#173F35] mb-1">
                {t('Target District', 'लक्षित जिला')}
              </label>
              <select
                value={districtCode}
                onChange={(e) => setDistrictCode(Number(e.target.value))}
                className="w-full text-xs bg-[#FAF7F2] border border-[#E9E0D3] rounded-lg px-2.5 py-1.5 font-medium text-[#173F35] focus:outline-none focus:border-[#17604D]"
              >
                <option value={492}>Pune, Maharashtra (LGD 492)</option>
                <option value={158}>Kanpur Nagar, Uttar Pradesh (LGD 158)</option>
                <option value={365}>Khordha / Bhubaneswar, Odisha (LGD 365)</option>
                <option value={160}>Lucknow, Uttar Pradesh (LGD 160)</option>
                <option value={485}>Mumbai Suburban, Maharashtra (LGD 485)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#173F35] mb-1">
                {t('Target Trade', 'लक्षित व्यवसाय')}
              </label>
              <select
                value={ncoCode}
                onChange={(e) => setNcoCode(e.target.value)}
                className="w-full text-xs bg-[#FAF7F2] border border-[#E9E0D3] rounded-lg px-2.5 py-1.5 font-medium text-[#173F35] focus:outline-none focus:border-[#17604D]"
              >
                <option value="7411.0101">Solar PV Rooftop Technician (7411.0101)</option>
                <option value="7231.0102">EV Automotive Service Technician (7231.0102)</option>
                <option value="7223.0501">CNC Machinist &amp; Precision Operator (7223.0501)</option>
                <option value="5321.0100">Healthcare General Duty Assistant (5321.0100)</option>
                <option value="2512.0101">Software Developer / Cloud Eng (2512.0101)</option>
                <option value="3514.0201">AI Model Data Annotator (3514.0201)</option>
              </select>
            </div>
          </div>

          <hr className="border-[#F2ECE1]" />

          {/* Slider 1: Seat Capacity Delta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#173F35]">{t('Sanctioned Seats Adjustment', 'स्वीकृत सीटों का समायोजन')}</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-[#F5D7CC] text-[#9E3B22]">
                {seatDelta >= 0 ? `+${seatDelta}` : seatDelta} {t('Seats', 'सीटें')}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="400"
              step="20"
              value={seatDelta}
              onChange={(e) => setSeatDelta(Number(e.target.value))}
              className="w-full accent-[#17604D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64716D]">
              <span>-100 ({t('Curtail excess', 'अतिरिक्त कटौती')})</span>
              <span>{t('Baseline', 'आधार रेखा')}: {baselineSanctioned}</span>
              <span>+400 ({t('Add batches', 'नए बैच जोड़ें')})</span>
            </div>
          </div>

          {/* Slider 2: Enrolment Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#173F35]">{t('Assumed Enrolment Rate (α)', 'अनुमानित नामांकन दर (α)')}</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-[#E5F2E6] text-[#17604D]">
                {enrolmentRate}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={enrolmentRate}
              onChange={(e) => setEnrolmentRate(Number(e.target.value))}
              className="w-full accent-[#17604D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64716D]">
              <span>50%</span>
              <span>{t('Target Benchmark', 'लक्ष्य मानक')}: 85%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 3: Dropout Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#173F35]">{t('Assumed Trainee Dropout Rate (β)', 'अनुमानित ड्रॉपआउट दर (β)')}</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-[#FBF0D9] text-[#D97925]">
                {dropoutRate}%
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="35"
              step="1"
              value={dropoutRate}
              onChange={(e) => setDropoutRate(Number(e.target.value))}
              className="w-full accent-[#17604D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64716D]">
              <span>2% ({t('Optimal', 'सर्वोत्तम')})</span>
              <span>{t('MSDE Ceiling', 'अधिकतम सीमा')}: 15%</span>
              <span>35% ({t('High Risk', 'उच्च जोखिम')})</span>
            </div>
          </div>

          {/* Slider 4: Retention Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#173F35]">{t('Local District Retention (μ)', 'स्थानीय जिला प्रतिधारण (μ)')}</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-[#EBF0FA] text-[#3B66B8]">
                {retentionRate}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              step="1"
              value={retentionRate}
              onChange={(e) => setRetentionRate(Number(e.target.value))}
              className="w-full accent-[#17604D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64716D]">
              <span>40% ({t('Out-migration', 'बाह्य प्रवास')})</span>
              <span>{t('Average', 'औसत')}: 70%</span>
              <span>95% ({t('High Retention', 'उच्च प्रतिधारण')})</span>
            </div>
          </div>
        </SurfaceCard>

        {/* Right Column: Comparative Impact Tensor (6 cols) */}
        <SurfaceCard className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
            <div className="text-xs font-bold text-[#173F35]">
              {t('Real-Time Policy Impact Tensor', 'रीयल-टाइम नीति प्रभाव टेंसर')}
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2F0E3] text-[#17604D]">
              {t('LIVE RECALCULATION', 'सक्रिय पुनर्गणना')}
            </span>
          </div>

          {/* Top 3 Impact Metrics */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[10px] text-[#64716D]">{t('Simulated Supply', 'अनुमानित आपूर्ति')}</div>
              <div className="text-lg font-bold text-[#173F35] tabular-nums mt-0.5">
                {simulatedSupply}
              </div>
              <div className="text-[10px] text-[#17604D] font-semibold mt-0.5">
                +{simulatedSupply - baselineSupply} {t('trained', 'प्रशिक्षित')}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[10px] text-[#64716D]">{t('Remaining Gap', 'शेष अंतर')}</div>
              <div className="text-lg font-bold text-[#D94E34] tabular-nums mt-0.5">
                {simulatedGap}
              </div>
              <div className="text-[10px] text-[#64716D] mt-0.5">
                {t('from', 'मूल')} {baselineGap}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#E5F2E6] border border-[#CFE5D1]">
              <div className="text-[10px] text-[#17604D] font-semibold">{t('Gap Reduction', 'अंतर कमी')}</div>
              <div className="text-lg font-bold text-[#17604D] tabular-nums mt-0.5">
                {gapReductionPct}%
              </div>
              <div className="text-[10px] text-[#17604D] mt-0.5">
                -{gapReduction} {t('shortage', 'कमी')}
              </div>
            </div>
          </div>

          {/* Training Pipeline Funnel Breakdown */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="font-semibold text-[#173F35] text-[11px]">
              {t('Trainee Pipeline Conversion Funnel:', 'प्रशिक्षु पाइपलाइन रूपांतरण फ़नल:')}
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF7F2]">
                <span className="text-[#64716D] inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 1. {t('Sanctioned Seats', 'स्वीकृत सीटें')}
                </span>
                <span className="font-bold text-[#173F35]">{simulatedSanctioned}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF7F2]">
                <span className="text-[#64716D] inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> 2. {t('Enrolled Candidates', 'नामांकित अभ्यर्थी')} ({enrolmentRate}%)
                </span>
                <span className="font-bold text-[#173F35]">{enrolledCount}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF7F2]">
                <span className="text-[#64716D] inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 3. {t('Certified Graduates', 'प्रमाणित स्नातक')} (90%)
                </span>
                <span className="font-bold text-[#173F35]">{certifiedCount}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#EBF4ED] text-[#17604D]">
                <span className="font-semibold inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> 4. {t('Locally Retained Workforce', 'स्थानीय रूप से प्रतिधारित कार्यबल')} ({retentionRate}%)
                </span>
                <span className="font-bold">{retainedCount}</span>
              </div>
            </div>
          </div>

          {committedMsg && (
            <div className="p-2.5 rounded-lg bg-[#E2F0E3] text-[#17604D] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{committedMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[10px] text-[#64716D]">
              {t('Trained models update with each batch allocation', 'प्रत्येक बैच आवंटन के साथ मॉडल अपडेट होते हैं')}
            </span>
            <PrimaryButton onClick={handleCommit} disabled={isSimulating}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSimulating ? t('Simulating...', 'सिमुलेशन जारी...') : t('Commit to District Plan', 'जिला योजना में दर्ज करें')}</span>
            </PrimaryButton>
          </div>
        </SurfaceCard>
      </div>

      {/* Explanatory Policy Reference & Cross-Navigation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <SurfaceCard className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
            <FileCheck2 className="w-4 h-4 text-[#17604D]" />
            <span>{t('MSDE Common Norms Yield Formula', 'एमएसडीई सामान्य मानदंड उत्पादकता सूत्र')}</span>
          </div>
          <p className="text-xs text-[#64716D] leading-relaxed">
            {t(
              'Net workforce output is modeled as: Effective Supply = (Baseline + ΔSeats) × α × (1 - β) × γ × μ + Informal Transition. This enforces realistic target estimation instead of assuming 100% throughput.',
              'शुद्ध कार्यबल उत्पादन को इस प्रकार मॉडल किया गया है: प्रभावी आपूर्ति = (आधार + Δसीटें) × α × (1 - β) × γ × μ + गैर-औपचारिक संक्रमण। यह 100% परिणाम मानने के बजाय यथार्थवादी लक्ष्य निर्धारण सुनिश्चित करता है।'
            )}
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-4 flex flex-col justify-between gap-3 bg-[#F6F2E9] border-[#E8DDCE]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
              <Layers className="w-4 h-4 text-[#D97925]" />
              <span>{t('Review Institutional Capacity', 'संस्थागत क्षमता की समीक्षा')}</span>
            </div>
            <p className="text-xs text-[#64716D] mt-1">
              {t(
                'Explore district-wise accredited ITIs, PMKVY centres, and seat utilization rates across all 36 Indian States & UTs.',
                'सभी 36 भारतीय राज्यों एवं केंद्र शासित प्रदेशों में जिलावार मान्यता प्राप्त आईटीआई, पीएमकेवीवाई केंद्रों और सीट उपयोग दरों का अन्वेषण करें।'
              )}
            </p>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('training')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17604D] hover:text-[#173F35] cursor-pointer"
            >
              <span>{t('Go to Training & Capacity Overview', 'प्रशिक्षण एवं क्षमता अवलोकन पर जाएं')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </SurfaceCard>
      </div>
    </div>
  );
};
