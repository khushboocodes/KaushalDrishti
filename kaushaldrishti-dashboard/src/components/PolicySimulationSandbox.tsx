import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw, CheckCircle2, TrendingDown, Users, GraduationCap, Award, MapPin } from 'lucide-react';
import { SurfaceCard, PrimaryButton, SecondaryButton } from './DesignSystemUI';
import { ApiService, SimulationRequestPayload } from '../services/apiService';

export const PolicySimulationSandbox: React.FC = () => {
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

  // Real-time recalculation using pipeline yield formula
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
    setCommittedMsg('Capacity parameters committed to Draft District Skill Development Plan (DSDP).');
    setTimeout(() => setCommittedMsg(null), 4000);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-[#E9E0D3]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#E2F0E3] text-[#17604D]">
              Interactive Policy Sandbox
            </span>
            <span className="text-[11px] text-[#64716D]">MSDE Common Norms Compliant</span>
          </div>
          <h2 className="font-serif-heading text-xl font-bold text-[#173F35] mt-1">
            &quot;What-If&quot; Training Capacity Sandbox &amp; Gap Simulator
          </h2>
          <p className="text-xs text-[#64716D] mt-0.5">
            Simulate adding or reallocating training seats, test dropout sensitivity, and evaluate real-time gap reduction before committing targets.
          </p>
        </div>

        <SecondaryButton tone="warm" onClick={handleReset} className="self-start sm:self-auto">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Levers</span>
        </SecondaryButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Sliders and Levers (6 cols) */}
        <SurfaceCard className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
              <SlidersHorizontal className="w-4 h-4 text-[#17604D]" />
              <span>Policy Levers &amp; Capacity Parameters</span>
            </div>
            <span className="text-[11px] text-[#64716D] font-mono">LGD &amp; NCO-2015</span>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#173F35] mb-1">
                Target District
              </label>
              <select
                value={districtCode}
                onChange={(e) => setDistrictCode(Number(e.target.value))}
                className="w-full text-xs bg-[#FAF7F2] border border-[#E9E0D3] rounded-lg px-2.5 py-1.5 font-medium text-[#173F35] focus:outline-none"
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
                Target Trade
              </label>
              <select
                value={ncoCode}
                onChange={(e) => setNcoCode(e.target.value)}
                className="w-full text-xs bg-[#FAF7F2] border border-[#E9E0D3] rounded-lg px-2.5 py-1.5 font-medium text-[#173F35] focus:outline-none"
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
              <span className="font-semibold text-[#173F35]">Sanctioned Seats Adjustment</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-[#F5D7CC] text-[#9E3B22]">
                {seatDelta >= 0 ? `+${seatDelta}` : seatDelta} Seats
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
              <span>-100 (Curtail excess)</span>
              <span>Baseline: {baselineSanctioned}</span>
              <span>+400 (Add batches)</span>
            </div>
          </div>

          {/* Slider 2: Enrolment Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#173F35]">Assumed Enrolment Rate (α)</span>
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
          </div>

          {/* Slider 3: Dropout Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#173F35]">Assumed Trainee Dropout Rate (β)</span>
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
          </div>

          {/* Slider 4: Retention Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#173F35]">Local District Retention (μ)</span>
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
          </div>
        </SurfaceCard>

        {/* Right Column: Comparative Impact Tensor (6 cols) */}
        <SurfaceCard className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
            <div className="text-xs font-bold text-[#173F35]">
              Real-Time Policy Impact Tensor
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2F0E3] text-[#17604D]">
              LIVE RECALCULATION
            </span>
          </div>

          {/* Top 3 Impact Metrics */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[10px] text-[#64716D]">Simulated Supply</div>
              <div className="text-lg font-bold text-[#173F35] tabular-nums mt-0.5">
                {simulatedSupply}
              </div>
              <div className="text-[10px] text-[#17604D] font-semibold mt-0.5">
                +{simulatedSupply - baselineSupply} trained
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DA]">
              <div className="text-[10px] text-[#64716D]">Remaining Gap</div>
              <div className="text-lg font-bold text-[#D94E34] tabular-nums mt-0.5">
                {simulatedGap}
              </div>
              <div className="text-[10px] text-[#64716D] mt-0.5">
                from {baselineGap}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#E5F2E6] border border-[#CFE5D1]">
              <div className="text-[10px] text-[#17604D] font-semibold">Gap Reduction</div>
              <div className="text-lg font-bold text-[#17604D] tabular-nums mt-0.5">
                {gapReductionPct}%
              </div>
              <div className="text-[10px] text-[#17604D] mt-0.5">
                -{gapReduction} shortage
              </div>
            </div>
          </div>

          {/* Training Pipeline Funnel Breakdown */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="font-semibold text-[#173F35] text-[11px]">
              Trainee Pipeline Conversion Funnel:
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF7F2]">
                <span className="text-[#64716D] inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 1. Sanctioned Seats
                </span>
                <span className="font-bold text-[#173F35]">{simulatedSanctioned}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF7F2]">
                <span className="text-[#64716D] inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> 2. Enrolled Candidates ({enrolmentRate}%)
                </span>
                <span className="font-bold text-[#173F35]">{enrolledCount}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#FAF7F2]">
                <span className="text-[#64716D] inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 3. Certified Graduates (90%)
                </span>
                <span className="font-bold text-[#173F35]">{certifiedCount}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#EBF4ED] text-[#17604D]">
                <span className="font-semibold inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> 4. Locally Retained Workforce ({retentionRate}%)
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
              Trained models update with each batch allocation
            </span>
            <PrimaryButton onClick={handleCommit} disabled={isSimulating}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Simulating...' : 'Commit to District Plan'}</span>
            </PrimaryButton>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
};
