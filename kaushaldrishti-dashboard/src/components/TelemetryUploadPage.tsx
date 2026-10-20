import React, { useState, useEffect, useMemo } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  FileCheck,
  ShieldCheck,
  Clock,
  Database,
  ArrowRight,
  Layers,
  Info,
  Search,
  Sparkles,
  XCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Award,
  Printer,
  Activity,
  Gauge,
  Briefcase,
  Zap,
  Check,
  FileDown,
  FileText,
  Building2,
  Users,
  GraduationCap,
  Filter,
} from 'lucide-react';
import { SurfaceCard, PrimaryButton, SecondaryButton } from './DesignSystemUI';
import { UserSession } from './AuthModal';
import { NavRouteId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getHorizonConfig } from '../data/dashboardMetrics';
import {
  globalTelemetryStore,
  parseTelemetryCsv,
  IngestionBatchResult,
  ParsedTelemetryRow,
} from '../data/telemetryIngestionStore';

interface TelemetryUploadPageProps {
  userSession?: UserSession | null;
  dateRange?: string;
  searchQuery?: string;
  onNavigate?: (route: NavRouteId) => void;
}

interface IngestionHistoryItem {
  id: string;
  fileName: string;
  district: string;
  uploadedBy: string;
  recordsCount: number;
  timestamp: string;
  status: 'Verified' | 'Ingested' | 'Review Required';
  batchId: string;
}

const STATIC_PAST_INGESTION_LOGS: IngestionHistoryItem[] = [
  {
    id: 'batch-492-01',
    fileName: 'pune_district_iti_admissions_q3.csv',
    district: 'Pune, Maharashtra (LGD 492)',
    uploadedBy: 'DSC Pune Operational Lead',
    recordsCount: 148,
    timestamp: '2 hours ago',
    status: 'Verified',
    batchId: 'BATCH-MH-492-892',
  },
  {
    id: 'batch-158-02',
    fileName: 'kanpur_pmkvy_batch_completion_v2.xlsx',
    district: 'Kanpur Nagar, UP (LGD 158)',
    uploadedBy: 'Principal ITI Kanpur Lead',
    recordsCount: 312,
    timestamp: '1 day ago',
    status: 'Verified',
    batchId: 'BATCH-UP-158-441',
  },
  {
    id: 'batch-365-03',
    fileName: 'khordha_green_hydrogen_trades.csv',
    district: 'Khordha, Odisha (LGD 365)',
    uploadedBy: 'State SSDM Odisha Co-ordinator',
    recordsCount: 94,
    timestamp: '3 days ago',
    status: 'Ingested',
    batchId: 'BATCH-OD-365-119',
  },
  {
    id: 'batch-485-04',
    fileName: 'mumbai_healthcare_certified_gda.xlsx',
    district: 'Mumbai Suburban, MH (LGD 485)',
    uploadedBy: 'PMKK Mumbai Coordinator',
    recordsCount: 220,
    timestamp: '5 days ago',
    status: 'Verified',
    batchId: 'BATCH-MH-485-602',
  },
];

export const TelemetryUploadPage: React.FC<TelemetryUploadPageProps> = ({
  userSession,
  dateRange = 'Last 1 Year',
  searchQuery = '',
  onNavigate,
}) => {
  const { t } = useLanguage();
  const horizon = getHorizonConfig(dateRange);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'success'>('idle');
  const [activeBatch, setActiveBatch] = useState<IngestionBatchResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isCommitted, setIsCommitted] = useState<boolean>(false);
  const [commitNotice, setCommitNotice] = useState<string | null>(null);
  const [batchSearchQuery, setBatchSearchQuery] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'report' | 'table'>('report');
  const [tableFilterMode, setTableFilterMode] = useState<'all' | 'valid' | 'faulty'>('all');
  const [, setStoreRefreshCounter] = useState<number>(0);
  const [dbStatus, setDbStatus] = useState<{
    engine: string;
    status: string;
    cloud_persisted: boolean;
    total_batches_persisted: number;
    url?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/telemetry/db-status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setDbStatus(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return globalTelemetryStore.subscribe(() => {
      setStoreRefreshCounter((prev) => prev + 1);
    });
  }, []);

  const processFile = (file: File) => {
    setFileName(file.name);
    setUploadStatus('parsing');
    setParseError(null);
    setIsCommitted(false);
    setCommitNotice(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          throw new Error('The uploaded file is empty.');
        }
        const result = parseTelemetryCsv(text, file.name, file.size);
        setActiveBatch(result);
        setUploadStatus('success');
      } catch (err: any) {
        setParseError(err.message || 'Failed to parse CSV file. Please verify MSDE schema v2.4 format.');
        setUploadStatus('idle');
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read file from disk. Please check file permissions.');
      setUploadStatus('idle');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setUploadStatus('idle');
    setActiveBatch(null);
    setParseError(null);
    setIsCommitted(false);
    setCommitNotice(null);
    setBatchSearchQuery('');
    setActiveViewMode('report');
    setTableFilterMode('all');
  };

  const handleCommitToLedger = async () => {
    if (!activeBatch) return;
    await globalTelemetryStore.commitBatch(activeBatch);
    setIsCommitted(true);
    const dbTarget = dbStatus?.cloud_persisted ? 'PostgreSQL Cloud Database' : 'PostgreSQL-Ready Central Ledger';
    setCommitNotice(
      `Batch ${activeBatch.batchId} successfully committed into Central ${dbTarget}! Injected ${activeBatch.validRowsCount} verified district trade streams.`
    );
  };

  const handleDownloadTemplate = () => {
    setDownloadSuccess(true);
    const csvContent =
      'district_lgd_code,district_name,iti_mis_code,trade_nco_code,trade_name,batch_id,sanctioned_seats,enrolled_count,certified_count,retained_count,reporting_period\n' +
      '492,Pune,ITI270492,7411.0101,Solar PV Rooftop Technician,BATCH-2026-01,100,88,80,68,2026-Q1\n' +
      '158,Kanpur Nagar,ITI090158,7231.0102,EV Automotive Service Technician,BATCH-2026-02,120,112,102,86,2026-Q1\n' +
      '365,Khordha,ITI210365,7223.0501,CNC Precision Machinist,BATCH-2026-03,80,75,70,62,2026-Q1\n' +
      '214,Patna,ITI100214,5321.0100,Healthcare General Duty Assistant,BATCH-2026-04,90,85,82,74,2026-Q1\n' +
      '572,Bengaluru Urban,ITI290572,2512.0101,Software Developer,BATCH-2026-05,150,142,130,118,2026-Q1\n' +
      '474,Ahmedabad,ITI240474,7533.01,Industrial Sewing Machine Operator,BATCH-2026-06,110,105,98,90,2026-Q1\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'MSDE_District_Telemetry_Template_v2.4.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handleExportPdf = () => {
    if (!activeBatch || !batchAnalytics) return;

    const printWin = window.open('', '_blank', 'width=900,height=1100');
    if (!printWin) {
      alert('Popup blocker prevented opening PDF window. Please allow popups for this site.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>MSDE Telemetry Intelligence Report - ${activeBatch.batchId}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm 12mm 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #173F35; margin: 0; padding: 16px; font-size: 11px; line-height: 1.4; background: #fff; }
    .header { border-bottom: 2px solid #17604D; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .header-left h1 { margin: 0; font-size: 17px; color: #173F35; font-family: Georgia, serif; font-weight: bold; }
    .header-left p { margin: 2px 0 0; color: #64716D; font-size: 9.5px; }
    .header-right { text-align: right; font-size: 9.5px; color: #64716D; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 8.5px; text-transform: uppercase; }
    .badge-green { background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; }
    .meta-box { background: #FAF7F2; border: 1px solid #E9E0D3; border-radius: 8px; padding: 8px 12px; margin-bottom: 14px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .meta-item .label { font-size: 8.5px; color: #64716D; text-transform: uppercase; font-weight: 600; }
    .meta-item .val { font-size: 13px; font-weight: bold; color: #173F35; margin-top: 1px; }
    .meta-item .sub { font-size: 8.5px; color: #2E7D32; font-weight: 600; }
    h2 { font-size: 12px; color: #173F35; border-bottom: 1px solid #ECE4D7; padding-bottom: 3px; margin: 12px 0 6px; font-family: Georgia, serif; text-transform: uppercase; letter-spacing: 0.3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9.5px; }
    th { background: #FAF7F2; color: #64716D; text-align: left; padding: 5px 7px; border-bottom: 1px solid #E9E0D3; font-weight: 600; text-transform: uppercase; font-size: 8.5px; }
    td { padding: 5px 7px; border-bottom: 1px solid #F2ECE1; color: #173F35; }
    tr:nth-child(even) { background: #FCFBF9; }
    .text-right { text-align: right; }
    .pill { padding: 1px 5px; border-radius: 3px; font-size: 8px; font-weight: 600; }
    .pill-green { background: #E8F5E9; color: #2E7D32; }
    .pill-amber { background: #FEF3C7; color: #B45309; }
    .pill-red { background: #FDE8E8; color: #9B1C1C; }
    .policy-box { background: #FAF7F2; border-left: 3px solid #D97925; padding: 6px 10px; margin-bottom: 6px; border-radius: 0 4px 4px 0; }
    .policy-box strong { color: #173F35; font-size: 10px; }
    .policy-box p { margin: 2px 0 0; color: #4B5563; font-size: 9px; line-height: 1.35; }
    .footer { margin-top: 16px; padding-top: 8px; border-top: 1px dashed #CBD5E1; display: flex; justify-content: space-between; font-size: 8.5px; color: #94A3B8; font-family: monospace; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <span class="badge badge-green">Official MSDE Telemetry Intelligence Dossier</span>
      <h1>KaushalDrishti (कौशल दृष्टि) — Executive Telemetry Brief</h1>
      <p>Ministry of Skill Development & Entrepreneurship · Government of India · LGD 2024 & NCO-2015 Registry Certified</p>
    </div>
    <div class="header-right">
      <strong>Batch: ${activeBatch.batchId}</strong><br />
      Source: ${activeBatch.fileName}<br />
      Scope: ${dateRange} · Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">
      <div class="label">AI Model Confidence</div>
      <div class="val">${batchAnalytics.confidenceScore}%</div>
      <div class="sub">Registry Validated</div>
    </div>
    <div class="meta-item">
      <div class="label">Data Quality Health</div>
      <div class="val">${batchAnalytics.accuracyIndex}%</div>
      <div class="sub">${activeBatch.validRowsCount} / ${activeBatch.totalRows} Clean Rows</div>
    </div>
    <div class="meta-item">
      <div class="label">${dateRange} Projected Demand</div>
      <div class="val">+${batchAnalytics.totalProjectedDemand.toLocaleString('en-IN')}</div>
      <div class="sub">Hiring Absorption Velocity</div>
    </div>
    <div class="meta-item">
      <div class="label">Local Tension Ratio (TR)</div>
      <div class="val">${batchAnalytics.tensionRatio}x</div>
      <div class="sub">${parseFloat(batchAnalytics.tensionRatio) >= 1.25 ? 'High Shortage Pressure' : 'Balanced Capacity Band'}</div>
    </div>
  </div>

  <h2>1. Trainee Throughput & Admissions-to-Retention Pipeline Diagnostics</h2>
  <table>
    <thead>
      <tr>
        <th>Funnel Stage</th>
        <th class="text-right">Candidate Volume</th>
        <th class="text-right">Conversion Ratio</th>
        <th>Pipeline Diagnostics / Attrition Locus</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Sanctioned Intake Capacity</strong></td>
        <td class="text-right" style="font-family: monospace;">${activeBatch.totalSanctioned.toLocaleString('en-IN')} Seats</td>
        <td class="text-right" style="font-family: monospace;">100.0%</td>
        <td>Total state authorized training infrastructure capacity</td>
      </tr>
      <tr>
        <td><strong>2. Trainees Enrolled</strong></td>
        <td class="text-right" style="font-family: monospace;">${activeBatch.totalEnrolled.toLocaleString('en-IN')} Admitted</td>
        <td class="text-right" style="font-family: monospace;">${batchAnalytics.seatUtilizationRate}%</td>
        <td>Unfilled Capacity: ${(activeBatch.totalSanctioned - activeBatch.totalEnrolled).toLocaleString('en-IN')} seats (${(100 - batchAnalytics.seatUtilizationRate).toFixed(1)}% mobilization gap)</td>
      </tr>
      <tr>
        <td><strong>3. Exam Certified Graduates</strong></td>
        <td class="text-right" style="font-family: monospace;">${activeBatch.totalCertified.toLocaleString('en-IN')} Passed</td>
        <td class="text-right" style="font-family: monospace;">${batchAnalytics.trainingCompletionRate}%</td>
        <td>Academic Dropout Leakage: ${(activeBatch.totalEnrolled - activeBatch.totalCertified).toLocaleString('en-IN')} trainees (${(100 - batchAnalytics.trainingCompletionRate).toFixed(1)}% pre-exam attrition)</td>
      </tr>
      <tr>
        <td><strong>4. Retained in Employment</strong></td>
        <td class="text-right" style="font-family: monospace; font-weight: bold; color: #166534;">${activeBatch.totalRetained.toLocaleString('en-IN')} Placed</td>
        <td class="text-right" style="font-family: monospace; font-weight: bold; color: #166534;">${batchAnalytics.placementYieldRate}%</td>
        <td>Verified industry absorption; End-to-End Pipeline Efficiency: <strong>${batchAnalytics.overallPipelineEfficiency}%</strong></td>
      </tr>
    </tbody>
  </table>

  <h2>2. Top Ingested Trades — Certified Supply vs ${dateRange} Projected Demand</h2>
  <table>
    <thead>
      <tr>
        <th>NCO Code</th>
        <th>Trade Classification</th>
        <th>Sector</th>
        <th class="text-right">Certified Supply</th>
        <th class="text-right">Projected Demand</th>
        <th class="text-right">Net Gap</th>
        <th class="text-right">Placement Yield</th>
        <th>Market Status</th>
      </tr>
    </thead>
    <tbody>
      ${batchAnalytics.topTradesForecast.map((t: any) => `
        <tr>
          <td style="font-family: monospace;">${t.ncoCode}</td>
          <td><strong>${t.tradeName}</strong></td>
          <td>${t.sector}</td>
          <td class="text-right" style="font-family: monospace;">${t.certified.toLocaleString('en-IN')}</td>
          <td class="text-right" style="font-family: monospace; font-weight: bold; color: #D97925;">${t.projectedDemand.toLocaleString('en-IN')}</td>
          <td class="text-right" style="font-family: monospace; font-weight: bold; color: ${t.gap > 0 ? '#9B1C1C' : '#166534'};">${t.gap > 0 ? '+' + t.gap.toLocaleString('en-IN') : t.gap.toLocaleString('en-IN')}</td>
          <td class="text-right" style="font-family: monospace;">${t.placementYield}%</td>
          <td><span class="pill ${t.gap > 50 ? 'pill-red' : 'pill-amber'}">${t.status}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>3. Top District Placement Yield Rankings (Ground Truth Performance)</h2>
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>District & State</th>
        <th class="text-right">Sanctioned</th>
        <th class="text-right">Certified</th>
        <th class="text-right">Retained in Jobs</th>
        <th class="text-right">Placement Yield %</th>
      </tr>
    </thead>
    <tbody>
      ${batchAnalytics.topDistricts.map((d: any, i: number) => `
        <tr>
          <td>#${i + 1}</td>
          <td><strong>${d.district}</strong>, <span style="color: #64716D;">${d.state}</span></td>
          <td class="text-right" style="font-family: monospace;">${d.sanctioned.toLocaleString('en-IN')}</td>
          <td class="text-right" style="font-family: monospace;">${d.certified.toLocaleString('en-IN')}</td>
          <td class="text-right" style="font-family: monospace; font-weight: bold; color: #166534;">${d.retained.toLocaleString('en-IN')}</td>
          <td class="text-right" style="font-family: monospace; font-weight: bold; color: #166534;"><span class="pill pill-green">${d.yieldRate}% Placed</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>4. Automated AI Policy Prescriptions & Resource Reallocation Directives</h2>
  <div class="policy-box">
    <strong>🎯 Capacity Realignment Directive:</strong>
    <p>Strong employment absorption in <strong>${batchAnalytics.sectorList[0]?.sector || 'Core Technical'}</strong> indicates unmet industry demand. Recommend increasing sanctioned ITI seat allocation by +15% to +20% for upcoming FY 2026–27 intake cycle.</p>
  </div>
  <div class="policy-box" style="border-left-color: #D94E34;">
    <strong>⚠️ Dropout Mitigation & Academic Intervention:</strong>
    <p>Detected <strong>${(activeBatch.totalEnrolled - activeBatch.totalCertified).toLocaleString('en-IN')} trainee dropouts</strong> between enrollment and final certification. Recommend District Skill Committees mandate biometric attendance tracking and localized stipend disbursements.</p>
  </div>
  <div class="policy-box" style="border-left-color: #0284C7;">
    <strong>🤝 Flexi-MoU Industry Linkage:</strong>
    <p>Top performing clusters in <strong>${batchAnalytics.topDistricts.slice(0, 2).map((d: any) => d.district).join(' and ')}</strong> report superior placement retention (over 80%). State SSDMs should fast-track dual-system apprenticeship tie-ups with local industrial estates.</p>
  </div>

  <div class="footer">
    <div>Audit SHA-256: ${activeBatch.sha256Hash}</div>
    <div>Statutory Standard: DPDP Act (2023) Verified · NCVT & SID Ingestion Gateway</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  /**
   * Export microdata table rows as standardized CSV
   */
  const handleExportTableCsv = (mode: 'all' | 'valid' | 'faulty' = tableFilterMode) => {
    if (!activeBatch) return;
    const rowsToExport = activeBatch.rows.filter((r) => {
      if (mode === 'valid') return r.isValid;
      if (mode === 'faulty') return !r.isValid;
      return true;
    });

    if (rowsToExport.length === 0) {
      alert('No rows available in this category to export.');
      return;
    }

    const headers = [
      'District LGD Code',
      'District Name',
      'State',
      'ITI MIS Code',
      'Trade NCO Code',
      'Trade Name',
      'Sector',
      'NSQF Level',
      'Batch ID',
      'Sanctioned Seats',
      'Enrolled Count',
      'Certified Count',
      'Retained Count',
      'Placement Yield Rate (%)',
      'Record Status',
      'Audit Validation Errors (Rationale)',
    ];

    const escapeCsv = (val: any) => {
      const s = String(val ?? '').replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvRows = [
      headers.join(','),
      ...rowsToExport.map((r) =>
        [
          r.districtLgdCode,
          escapeCsv(r.districtName),
          escapeCsv(r.state),
          escapeCsv(r.itiMisCode),
          escapeCsv(r.tradeNcoCode),
          escapeCsv(r.tradeName),
          escapeCsv(r.sector),
          r.nsqfLevel,
          escapeCsv(r.batchId),
          r.sanctionedSeats,
          r.enrolledCount,
          r.certifiedCount,
          r.retainedCount,
          r.retentionRate,
          r.isValid ? 'VALID' : 'QUARANTINED_WARNING',
          escapeCsv(r.validationErrors.join('; ') || 'None (Clean Record)'),
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const label = mode === 'faulty' ? 'FAULTY_REVERIFY_LIST' : mode === 'valid' ? 'CLEAN_VERIFIED' : 'ALL_RECORDS';
    link.setAttribute('download', `MSDE_District_Telemetry_${label}_${activeBatch.batchId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Export microdata table rows as official landscape PDF dossier
   */
  const handleExportTablePdf = (mode: 'all' | 'valid' | 'faulty' = tableFilterMode) => {
    if (!activeBatch) return;
    const rowsToExport = activeBatch.rows.filter((r) => {
      if (mode === 'valid') return r.isValid;
      if (mode === 'faulty') return !r.isValid;
      return true;
    });

    if (rowsToExport.length === 0) {
      alert('No rows available in this category to export.');
      return;
    }

    const printWin = window.open('', '_blank', 'width=1100,height=1200');
    if (!printWin) {
      alert('Popup blocker prevented opening PDF window. Please allow popups for this site.');
      return;
    }

    const modeTitle =
      mode === 'faulty'
        ? 'MSDE ITI Re-Verification Directive & Quarantined Audit Sheet'
        : mode === 'valid'
        ? 'MSDE Verified Microdata Register (Approved for Central Ledger)'
        : 'MSDE Telemetry Microdata Registry (Comprehensive Batch Master)';

    const modeBadge =
      mode === 'faulty'
        ? '<span style="background: #FDE8E8; color: #9B1C1C; border: 1px solid #F8B4B4; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 8.5px;">ACTION REQUIRED · ITI RE-VERIFICATION DIRECTIVE</span>'
        : mode === 'valid'
        ? '<span style="background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 8.5px;">OFFICIAL MSDE VERIFIED LEDGER STREAM</span>'
        : '<span style="background: #FAF0E1; color: #8C4E13; border: 1px solid #ECDCC7; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 8.5px;">MASTER BATCH MICRODATA PREVIEW</span>';

    const directiveText =
      mode === 'faulty'
        ? `<strong>Urgent Administrative Notice for State SSDM &amp; ITI Principals:</strong> The following ${rowsToExport.length} flagged records failed LGD/NCO schema integrity or admission logic sanity checks. These rows have been <strong>quarantined</strong> and are excluded from the Central Labour Intelligence Ledger. Principals must re-verify admissions, correct capacity/LGD codes, and resubmit.`
        : mode === 'valid'
        ? `<strong>Official Record:</strong> Showing ${rowsToExport.length} verified records adhering strictly to Local Government Directory (LGD 2024) and National Classification of Occupations (NCO-2015) standards. These records have been merged into the central intelligence ledger.`
        : `<strong>Batch Overview:</strong> Showing ${rowsToExport.length} total records (${activeBatch.validRowsCount} Valid Clean Records, ${activeBatch.flaggedRowsCount} Quarantined Records).`;

    const tableRowsHtml = rowsToExport
      .map(
        (r, idx) => `
      <tr style="${!r.isValid ? 'background: #FFFDF9;' : ''}">
        <td style="font-family: monospace; color: #64716D;">${idx + 1}</td>
        <td><strong>${r.batchId}</strong><br /><span style="color: #64716D; font-family: monospace; font-size: 8.5px;">${r.itiMisCode}</span></td>
        <td><strong>${r.districtName}</strong><br /><span style="color: #64716D; font-size: 8.5px;">${r.state} (LGD: ${r.districtLgdCode || 'INVALID'})</span></td>
        <td><strong>${r.tradeName}</strong><br /><span style="color: #64716D; font-family: monospace; font-size: 8.5px;">${r.tradeNcoCode} · ${r.sector}</span></td>
        <td style="text-align: right; font-family: monospace;">${r.sanctionedSeats.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace;">${r.enrolledCount.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace; color: #166534; font-weight: bold;">${r.certifiedCount.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace; color: #D97925;">${r.retainedCount.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace; font-weight: bold;">${r.retentionRate}%</td>
        <td style="text-align: center;">
          ${
            r.isValid
              ? '<span style="color: #166534; font-weight: bold; font-size: 8px; background: #E8F5E9; padding: 2px 5px; border-radius: 3px;">VALID</span>'
              : '<span style="color: #9B1C1C; font-weight: bold; font-size: 8px; background: #FDE8E8; padding: 2px 5px; border-radius: 3px;">FLAGGED</span>'
          }
        </td>
        <td style="font-size: 8.5px;">
          ${
            r.validationErrors.length > 0
              ? r.validationErrors
                  .map(
                    (err) =>
                      `<div style="color: #9B1C1C; background: #FEF2F2; border: 1px solid #FECACA; padding: 1px 4px; border-radius: 3px; margin-bottom: 2px;">⚠️ ${err}</div>`
                  )
                  .join('')
              : '<span style="color: #166534;">Verified Clean</span>'
          }
        </td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${modeTitle} - ${activeBatch.batchId}</title>
  <style>
    @page { size: A4 landscape; margin: 10mm 12mm 10mm 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #173F35; margin: 0; padding: 14px; font-size: 9.5px; line-height: 1.35; background: #fff; }
    .header { border-bottom: 2px solid #17604D; padding-bottom: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
    .header-left h1 { margin: 2px 0; font-size: 15px; color: #173F35; font-family: Georgia, serif; font-weight: bold; }
    .header-left p { margin: 1px 0 0; color: #64716D; font-size: 9px; }
    .header-right { text-align: right; font-size: 8.5px; color: #64716D; }
    .directive-card { padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 9px; line-height: 1.4; ${
      mode === 'faulty'
        ? 'background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E;'
        : 'background: #FAF7F2; border: 1px solid #E9E0D3; color: #374151;'
    } }
    table { width: 100%; border-collapse: collapse; font-size: 9px; }
    th { background: #FAF7F2; color: #64716D; text-align: left; padding: 5px 6px; border-bottom: 1px solid #E9E0D3; font-weight: 600; text-transform: uppercase; font-size: 8px; }
    td { padding: 5px 6px; border-bottom: 1px solid #F2ECE1; color: #173F35; vertical-align: top; }
    tr:nth-child(even) { background: #FCFBF9; }
    .footer { margin-top: 14px; padding-top: 6px; border-top: 1px dashed #CBD5E1; display: flex; justify-content: space-between; font-size: 8px; color: #94A3B8; font-family: monospace; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      ${modeBadge}
      <h1>${modeTitle}</h1>
      <p>Ministry of Skill Development &amp; Entrepreneurship · KaushalDrishti Labour Intelligence Platform</p>
    </div>
    <div class="header-right">
      <strong>Batch: ${activeBatch.batchId}</strong><br />
      Source File: ${activeBatch.fileName} (${activeBatch.fileSizeKb} KB)<br />
      Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
    </div>
  </div>

  <div class="directive-card">
    ${directiveText}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 20px;">#</th>
        <th style="width: 100px;">Batch ID &amp; MIS</th>
        <th style="width: 130px;">District &amp; State</th>
        <th>Trade Name &amp; Sector</th>
        <th style="text-align: right; width: 65px;">Sanctioned</th>
        <th style="text-align: right; width: 60px;">Enrolled</th>
        <th style="text-align: right; width: 60px;">Certified</th>
        <th style="text-align: right; width: 60px;">Retained</th>
        <th style="text-align: right; width: 50px;">Yield</th>
        <th style="text-align: center; width: 65px;">Status</th>
        <th style="width: 220px;">Audit &amp; Logic Diagnostics</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <span>SHA-256 Audit Trail: ${activeBatch.sha256Hash}</span>
    <span>DPDP Act (2023) Compliant · National Classification of Occupations NCO-2015</span>
    <span>Official Report</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  // Dynamic AI Ingestion & Prediction Analytics
  const batchAnalytics = useMemo(() => {
    if (!activeBatch) return null;

    // 1. Sector breakdown
    const sectorMap: Record<string, { sector: string; certified: number; retained: number; sanctioned: number; enrolled: number; tradesCount: number }> = {};
    activeBatch.rows.forEach((r) => {
      const sec = r.sector || 'General Technical';
      if (!sectorMap[sec]) {
        sectorMap[sec] = { sector: sec, certified: 0, retained: 0, sanctioned: 0, enrolled: 0, tradesCount: 0 };
      }
      sectorMap[sec].certified += r.certifiedCount;
      sectorMap[sec].retained += r.retainedCount;
      sectorMap[sec].sanctioned += r.sanctionedSeats;
      sectorMap[sec].enrolled += r.enrolledCount;
      sectorMap[sec].tradesCount += 1;
    });
    const sectorList = Object.values(sectorMap)
      .map((s) => ({
        ...s,
        yieldRate: s.certified > 0 ? Math.round((s.retained / s.certified) * 1000) / 10 : 0,
        sharePct: activeBatch.totalCertified > 0 ? Math.round((s.certified / activeBatch.totalCertified) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.certified - a.certified);

    const horizonMultiplier = horizon.demandMultiplier;

    // 2. Top Trades AI Demand Forecast for selected horizon
    const tradeMap: Record<string, { tradeName: string; ncoCode: string; sector: string; certified: number; sanctioned: number; retained: number; enrolled: number }> = {};
    activeBatch.rows.forEach((r) => {
      const key = r.tradeName || r.tradeNcoCode;
      if (!tradeMap[key]) {
        tradeMap[key] = { tradeName: r.tradeName, ncoCode: r.tradeNcoCode, sector: r.sector, certified: 0, sanctioned: 0, retained: 0, enrolled: 0 };
      }
      tradeMap[key].certified += r.certifiedCount;
      tradeMap[key].sanctioned += r.sanctionedSeats;
      tradeMap[key].retained += r.retainedCount;
      tradeMap[key].enrolled += r.enrolledCount;
    });
    const topTradesForecast = Object.values(tradeMap)
      .sort((a, b) => b.certified - a.certified)
      .slice(0, 5)
      .map((t) => {
        const projectedDemand = Math.round(t.sanctioned * 1.35 * horizonMultiplier);
        const gap = projectedDemand - t.certified;
        const status = gap > 60 ? 'Acute Undersupply' : gap > 0 ? 'Moderate Undersupply' : 'Balanced Supply';
        const placementYield = t.certified > 0 ? Math.round((t.retained / t.certified) * 1000) / 10 : 0;
        return { ...t, projectedDemand, gap, status, placementYield };
      });

    // 3. District Ranking & Performance
    const districtMap: Record<string, { district: string; state: string; certified: number; retained: number; sanctioned: number }> = {};
    activeBatch.rows.forEach((r) => {
      const d = r.districtName;
      if (!districtMap[d]) {
        districtMap[d] = { district: d, state: r.state, certified: 0, retained: 0, sanctioned: 0 };
      }
      districtMap[d].certified += r.certifiedCount;
      districtMap[d].retained += r.retainedCount;
      districtMap[d].sanctioned += r.sanctionedSeats;
    });
    const topDistricts = Object.values(districtMap)
      .map((d) => ({
        ...d,
        yieldRate: d.certified > 0 ? Math.round((d.retained / d.certified) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.certified - a.certified)
      .slice(0, 5);

    // 4. Overall AI Metrics
    const totalProjectedDemand = Math.round(activeBatch.totalSanctioned * 1.35 * horizonMultiplier);
    const netSupplyGap = totalProjectedDemand - activeBatch.totalCertified;
    const tensionRatio = (totalProjectedDemand / Math.max(1, activeBatch.totalCertified)).toFixed(2);
    const passRate = activeBatch.validRowsCount / Math.max(1, activeBatch.totalRows);
    const confidenceScore = (91.0 + passRate * 8.0 - (activeBatch.flaggedRowsCount > 0 ? 3.5 : 0)).toFixed(1);
    const accuracyIndex = ((activeBatch.validRowsCount / Math.max(1, activeBatch.totalRows)) * 100).toFixed(1);

    // 5. Admissions Funnel drop-offs
    const seatUtilizationRate = activeBatch.totalSanctioned > 0 ? Math.round((activeBatch.totalEnrolled / activeBatch.totalSanctioned) * 1000) / 10 : 0;
    const trainingCompletionRate = activeBatch.totalEnrolled > 0 ? Math.round((activeBatch.totalCertified / activeBatch.totalEnrolled) * 1000) / 10 : 0;
    const placementYieldRate = activeBatch.totalCertified > 0 ? Math.round((activeBatch.totalRetained / activeBatch.totalCertified) * 1000) / 10 : 0;
    const overallPipelineEfficiency = activeBatch.totalSanctioned > 0 ? Math.round((activeBatch.totalRetained / activeBatch.totalSanctioned) * 1000) / 10 : 0;

    // 6. NSQF Stratification Breakdown
    const nsqfCountMap: Record<number, number> = { 3: 0, 4: 0, 5: 0, 6: 0 };
    activeBatch.rows.forEach((r) => {
      const lvl = r.nsqfLevel || 4;
      if (lvl <= 3) nsqfCountMap[3] = (nsqfCountMap[3] || 0) + r.certifiedCount;
      else if (lvl === 4) nsqfCountMap[4] = (nsqfCountMap[4] || 0) + r.certifiedCount;
      else if (lvl === 5) nsqfCountMap[5] = (nsqfCountMap[5] || 0) + r.certifiedCount;
      else nsqfCountMap[6] = (nsqfCountMap[6] || 0) + r.certifiedCount;
    });

    const nsqfStratification = [
      { level: 3, label: 'NSQF L3 (Foundational)', count: nsqfCountMap[3], wage: '₹14,000 – ₹18,000 / mo', desc: 'Assembly operators, retail sales, sewing' },
      { level: 4, label: 'NSQF L4 (Core Technician)', count: nsqfCountMap[4], wage: '₹18,500 – ₹25,000 / mo', desc: 'Solar PV tech, CNC machinist, healthcare GDA' },
      { level: 5, label: 'NSQF L5 (Specialist)', count: nsqfCountMap[5], wage: '₹25,000 – ₹34,000 / mo', desc: 'EV powertrain diagnostics, BIM modeler' },
      { level: 6, label: 'NSQF L6+ (Technologist)', count: nsqfCountMap[6], wage: '₹34,000 – ₹48,000 / mo', desc: 'Software developer, data analyst, automated QA' },
    ];

    // 7. Trainee Attrition & Leakage Diagnostics
    const unfilledSeats = Math.max(0, activeBatch.totalSanctioned - activeBatch.totalEnrolled);
    const academicDropouts = Math.max(0, activeBatch.totalEnrolled - activeBatch.totalCertified);
    const unplacedGraduates = Math.max(0, activeBatch.totalCertified - activeBatch.totalRetained);
    const primaryBottleneck =
      unplacedGraduates >= academicDropouts && unplacedGraduates >= unfilledSeats
        ? 'Post-Certification Placement Gap (Awaiting Industrial Placement)'
        : academicDropouts >= unfilledSeats
        ? 'Academic Course Dropouts (Pre-Certification Leaks)'
        : 'Initial Admission Mobilization Gap (Unfilled Sanction)';

    return {
      sectorList,
      topTradesForecast,
      topDistricts,
      totalProjectedDemand,
      netSupplyGap,
      tensionRatio,
      confidenceScore,
      accuracyIndex,
      seatUtilizationRate,
      trainingCompletionRate,
      placementYieldRate,
      overallPipelineEfficiency,
      nsqfStratification,
      unfilledSeats,
      academicDropouts,
      unplacedGraduates,
      primaryBottleneck,
    };
  }, [activeBatch, horizon]);

  const filteredBatchRows: ParsedTelemetryRow[] = useMemo(() => {
    if (!activeBatch) return [];
    return activeBatch.rows.filter((r) => {
      if (tableFilterMode === 'valid' && !r.isValid) return false;
      if (tableFilterMode === 'faulty' && r.isValid) return false;
      if (!batchSearchQuery.trim()) return true;
      const q = batchSearchQuery.toLowerCase();
      return (
        r.tradeName.toLowerCase().includes(q) ||
        r.tradeNcoCode.toLowerCase().includes(q) ||
        r.districtName.toLowerCase().includes(q) ||
        r.batchId.toLowerCase().includes(q) ||
        r.itiMisCode.toLowerCase().includes(q) ||
        r.validationErrors.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [activeBatch, tableFilterMode, batchSearchQuery]);

  const dynamicIngestionHistory: IngestionHistoryItem[] = [
    ...globalTelemetryStore.getBatches().map((b) => ({
      id: `history-${b.batchId}`,
      fileName: b.fileName,
      district: `${b.uniqueDistricts.slice(0, 2).join(', ')}${b.uniqueDistricts.length > 2 ? ' +' + (b.uniqueDistricts.length - 2) : ''}`,
      uploadedBy: `${userSession?.name || 'Local DSC Lead'} (${userSession?.role || 'Authority'})`,
      recordsCount: b.validRowsCount,
      timestamp: b.uploadedAt,
      status: b.status as 'Verified' | 'Ingested' | 'Review Required',
      batchId: b.batchId,
    })),
    ...STATIC_PAST_INGESTION_LOGS,
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E9E0D3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide uppercase bg-[#E2F0E3] text-[#17604D]">
              {t('Official MSDE Telemetry Ingestion', 'आधिकारिक एमएसडीई टेलीमेट्री अंतर्ग्रहण')}
            </span>
            <span className="text-[11px] text-[#64716D] font-mono">
              {t('Schema Version 2.4 · LGD & NCO-2015 Compliant', 'स्कीमा संस्करण 2.4 · एलजीडी एवं एनसीओ-2015 अनुपालक')}
            </span>
          </div>
          <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#173F35] mt-1">
            {t('Bulk District Telemetry CSV & Admission Uploader', 'बल्क जिला टेलीमेट्री सीएसवी एवं प्रवेश अपलोडर')}
          </h1>
          <p className="text-xs text-[#64716D] mt-0.5 max-w-3xl">
            {t(
              'District Skill Committees (DSCs) and ITI principals can upload local batch admissions, trainee dropouts, and certified placement outcomes to recalculate localized tension ratios and early warning shortage flags in real-time.',
              'जिला कौशल समितियां (डीएससी) और आईटीआई प्राचार्य वास्तविक समय में स्थानीय तनाव अनुपात और पूर्व चेतावनी सचेतकों की पुनर्गणना के लिए स्थानीय बैच प्रवेश, ड्रॉपआउट और प्रमाणित परिणामों को अपलोड कर सकते हैं।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {dbStatus && (
            <span
              title={`Engine: ${dbStatus.engine.toUpperCase()} · Batches Persisted: ${dbStatus.total_batches_persisted}`}
              className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs border ${
                dbStatus.cloud_persisted
                  ? 'bg-[#E5F2E6] text-[#166534] border-[#CFE5D1]'
                  : 'bg-[#EBF5FB] text-[#1B4F72] border-[#AED6F1]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  dbStatus.cloud_persisted ? 'bg-[#16A34A] animate-pulse' : 'bg-[#2980B9]'
                }`}
              />
              <Database className="w-3 h-3" />
              <span>
                {dbStatus.cloud_persisted
                  ? t('Cloud PostgreSQL: Connected', 'क्लाउड पोस्टग्रेएसक्यूएल: कनेक्टेड')
                  : t('PostgreSQL-Ready SQL Engine: Active', 'पोस्टग्रेएसक्यूएल इंजन: सक्रिय')}
              </span>
            </span>
          )}

          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C4E13] border border-[#ECDCC7] flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97925] animate-pulse"></span>
            <span>{dateRange}</span>
            <span className="text-[#A57849]">·</span>
            <span className="font-normal text-[#6C5840]">{horizon.label}</span>
          </span>

          <SecondaryButton tone="warm" onClick={handleDownloadTemplate} className="shadow-2xs">
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? t('Template Downloaded!', 'टेम्पलेट डाउनलोड हो गया!') : t('Download CSV Template', 'सीएसवी टेम्पलेट डाउनलोड करें')}</span>
          </SecondaryButton>
        </div>
      </div>

      {/* 4 Summary Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Accepted File Formats', 'स्वीकृत फ़ाइल प्रारूप')}</span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#17604D]" />
          </div>
          <div className="text-sm font-bold text-[#173F35] font-mono">
            .CSV, .XLSX
          </div>
          <div className="text-[11px] text-[#64716D] mt-0.5">
            {t('Max 25 MB per ingestion batch', 'अधिकतम 25 एमबी प्रति बैच')}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Registry Cross-Validation', 'रजिस्ट्री सत्यापन')}</span>
            <Database className="w-3.5 h-3.5 text-[#3B66B8]" />
          </div>
          <div className="text-sm font-bold text-[#173F35]">
            LGD 2024 &amp; NCO-2015
          </div>
          <div className="text-[11px] text-[#17604D] font-medium mt-0.5">
            {t('Automated schema sanity check', 'स्वचालित स्कीमा शुद्धता जांच')}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Target Authority Scope', 'लक्षित प्राधिकरण दायरा')}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97925]" />
          </div>
          <div className="text-sm font-bold text-[#173F35]">
            {userSession?.role || 'District Skill Committee'}
          </div>
          <div className="text-[11px] text-[#64716D] mt-0.5 truncate">
            {userSession?.department || 'Operational Jurisdiction'}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#64716D] mb-1">
            <span>{t('Statutory Compliance', 'वैधानिक अनुपालन')}</span>
            <FileCheck className="w-3.5 h-3.5 text-[#166534]" />
          </div>
          <div className="text-sm font-bold text-[#166534]">
            DPDP Act (2023)
          </div>
          <div className="text-[11px] text-[#17604D] font-medium mt-0.5">
            {t('256-bit Encrypted Audit Log', '256-बिट एन्क्रिप्टेड ऑडिट लॉग')}
          </div>
        </SurfaceCard>
      </div>

      {/* Primary Upload & Live Ingestion Card */}
      <SurfaceCard className="space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E0D3]">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#17604D]" />
            <h2 className="text-sm font-bold text-[#173F35]">
              {t('Upload Telemetry Batch', 'टेलीमेट्री बैच अपलोड करें')}
            </h2>
          </div>
          <span className="text-[11px] text-[#64716D] font-mono">MSDE Format v2.4</span>
        </div>

        {parseError && (
          <div className="p-3.5 rounded-xl bg-[#FDE8E8] border border-[#F8B4B4] flex items-start gap-3 text-xs text-[#9B1C1C]">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold">Schema Parse Error</div>
              <div className="mt-0.5">{parseError}</div>
            </div>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-white border border-[#F8B4B4] rounded text-[11px] font-semibold text-[#9B1C1C] hover:bg-[#FDF2F2] cursor-pointer shrink-0"
            >
              Try Again
            </button>
          </div>
        )}

        {uploadStatus === 'idle' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-[#17604D] bg-[#E2F0E3]/50 scale-[1.005]'
                : 'border-[#E0D5C3] bg-[#FAF7F2] hover:border-[#17604D]'
            }`}
          >
            <UploadCloud className="w-12 h-12 text-[#17604D] mx-auto mb-3 opacity-80" />
            <div className="text-sm font-bold text-[#173F35]">
              {t('Drag & drop District Admission CSV or Excel here', 'जिला प्रवेश सीएसवी अथवा एक्सेल फ़ाइल यहां ड्रैग एवं ड्रॉप करें')}
            </div>
            <p className="text-xs text-[#64716D] mt-1 max-w-md mx-auto">
              {t(
                'Accepts standardized batch reports with district LGD codes and NCO trade classifications.',
                'जिला एलजीडी कोड और एनसीओ ट्रेड वर्गीकरण के साथ मानकीकृत बैच रिपोर्ट स्वीकार करता है।'
              )}
            </p>
            <div className="text-[11px] font-mono text-[#17604D] mt-2">
              .csv, .xlsx · Max 25 MB
            </div>

            <label className="inline-block mt-4">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleChange}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#173F35] text-white hover:bg-[#12322A] cursor-pointer shadow-sm transition-all active:scale-[0.99]">
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t('Browse Local Files', 'फ़ाइलें ब्राउज़ करें')}</span>
              </span>
            </label>
          </div>
        )}

        {uploadStatus === 'parsing' && (
          <div className="p-8 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3] text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#17604D] animate-spin mx-auto" />
            <div className="text-sm font-bold text-[#173F35]">
              {t('Streaming & validating schema against LGD & NCO-2015 registries...', 'एलजीडी एवं एनसीओ-2015 रजिस्ट्रियों के विरुद्ध स्कीमा का सत्यापन जारी...')}
            </div>
            <div className="text-xs text-[#64716D]">
              {t('Reading file stream in memory for', 'कॉलम एवं प्रारूप का विश्लेषण')} <span className="font-mono font-bold text-[#173F35]">{fileName}</span>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && activeBatch && (
          <div className="p-5 rounded-xl bg-[#E5F2E6] border border-[#CFE5D1] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#17604D] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-[#173F35] flex items-center gap-2 flex-wrap">
                    <span>{t('Telemetry Ingested:', 'टेलीमेट्री अंतर्ग्रहीत:')}</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#CFE5D1] text-xs">
                      {activeBatch.fileName}
                    </span>
                    <span className="text-[11px] font-mono text-[#64716D]">
                      ({activeBatch.fileSizeKb} KB · Batch {activeBatch.batchId})
                    </span>
                  </div>
                  <div className="text-xs text-[#17604D] mt-0.5">
                    {activeBatch.totalRows} {t('rows extracted and cross-validated against canonical registries.', 'पंक्तियां निकाली गईं और मान्य की गईं।')}
                  </div>
                </div>
              </div>
              <SecondaryButton tone="warm" onClick={handleReset} className="self-start sm:self-auto shadow-2xs">
                <span>{t('Upload Another Batch', 'अन्य बैच अपलोड करें')}</span>
              </SecondaryButton>
            </div>

            {/* Dynamic Metric Cards from Parsed File */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-center text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#FFFEFB] border border-[#CFE5D1]">
                <div className="text-[10.5px] text-[#64716D] font-sans">{t('Valid Clean Records', 'मान्य शुद्ध रिकॉर्ड')}</div>
                <div className="text-base font-bold text-[#173F35] mt-0.5">
                  {activeBatch.validRowsCount} / {activeBatch.totalRows} ({Math.round((activeBatch.validRowsCount / Math.max(1, activeBatch.totalRows)) * 100)}%)
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFEFB] border border-[#CFE5D1]">
                <div className="text-[10.5px] text-[#64716D] font-sans">{t('Districts Detected', 'समकालिक जिले')}</div>
                <div className="text-base font-bold text-[#17604D] mt-0.5 truncate" title={activeBatch.uniqueDistricts.join(', ')}>
                  {activeBatch.uniqueDistricts.length} ({activeBatch.uniqueDistricts.slice(0, 2).join(', ')}{activeBatch.uniqueDistricts.length > 2 ? ' +' + (activeBatch.uniqueDistricts.length - 2) : ''})
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFEFB] border border-[#CFE5D1]">
                <div className="text-[10.5px] text-[#64716D] font-sans">{t('Certified Trainees Output', 'प्रमाणित प्रशिक्षार्थी आउटपुट')}</div>
                <div className="text-base font-bold text-[#17604D] mt-0.5">
                  +{activeBatch.totalCertified.toLocaleString('en-IN')} Candidates
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFEFB] border border-[#CFE5D1]">
                <div className="text-[10.5px] text-[#64716D] font-sans">{t('Average Placement Yield', 'औसत प्लेसमेंट प्राप्ति')}</div>
                <div className="text-base font-bold text-[#D97925] mt-0.5">
                  {activeBatch.avgRetentionRate}% ({activeBatch.totalRetained.toLocaleString('en-IN')} Placed)
                </div>
              </div>
            </div>

            {/* Quarantine Notice & Action Directive for SSDM Director */}
            {activeBatch.flaggedRowsCount > 0 && (
              <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#92400E]">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97925] mt-0.5" />
                  <div>
                    <div className="font-bold text-[#78350F] flex items-center gap-2">
                      <span>{t('Quarantine Notice & Action Directive:', 'संगीरोध सूचना एवं कार्रवाई निर्देश:')}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                        {activeBatch.flaggedRowsCount} {t('Faulty Records Quarantined', 'दोषपूर्ण रिकॉर्ड संगरोध')}
                      </span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-[#92400E] leading-relaxed">
                      {t(
                        `The remaining ${activeBatch.flaggedRowsCount} flagged rows are quarantined and will NOT be merged into the central ledger (only ${activeBatch.validRowsCount} verified clean rows will be merged). You can inspect them in the Microdata Registry tab and export a dossier to request re-verification and correction from the concerned ITI centers / DSCs.`,
                        `शेष ${activeBatch.flaggedRowsCount} चिह्नित पंक्तियों को संगरोध (quarantine) में रखा गया है और वे केंद्रीय लेज़र में मर्ज नहीं होंगी (केवल ${activeBatch.validRowsCount} सत्यापित शुद्ध पंक्तियां मर्ज होंगी)। इन्हें माइक्रोडाटा रजिस्ट्री टैब में देख कर संबंधित आईटीआई केंद्रों / डीएससी को पुनर्सत्यापन एवं सुधार हेतु भेजा जा सकता है।`
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveViewMode('table');
                    setTableFilterMode('faulty');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#D97925] text-white hover:bg-[#B45309] font-semibold text-xs shrink-0 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t('Inspect & Export Faulty Rows', 'दोषपूर्ण पंक्तियां देखें व निर्यात करें')} ({activeBatch.flaggedRowsCount}) &rarr;</span>
                </button>
              </div>
            )}

            {/* Ingestion Commitment Action */}
            {!isCommitted ? (
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECDCC7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#173F35] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97925]" />
                    <span>Synchronize with National Labour Intelligence Ledger</span>
                  </div>
                  <div className="text-[11px] text-[#64716D] mt-0.5">
                    Click commit to merge these {activeBatch.validRowsCount} verified district streams into live Demand &amp; Supply gap calculation.
                  </div>
                </div>
                <PrimaryButton onClick={handleCommitToLedger} className="shrink-0 shadow-xs">
                  <Database className="w-3.5 h-3.5" />
                  <span>Commit to Central Ledger</span>
                </PrimaryButton>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#E2F0E3] border border-[#BBF7D0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#17604D]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#17604D]" />
                  <span>
                    <strong>Batch Synchronized:</strong> {commitNotice}
                  </span>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('demand-supply');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#173F35] text-white hover:bg-[#12322A] text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    View in Demand &amp; Supply &rarr;
                  </button>
                )}
              </div>
            )}

            {/* Cryptographic Audit Hash Pill */}
            <div className="pt-1 flex items-center justify-between text-[10.5px] text-[#64716D] font-mono border-t border-[#CFE5D1]">
              <span className="truncate">Audit SHA-256: {activeBatch.sha256Hash}</span>
              <span className="shrink-0 font-sans font-semibold text-[#17604D]">DPDP Act (2023) Verified</span>
            </div>
          </div>
        )}
      </SurfaceCard>

      {/* Comprehensive Dynamic AI Report & Microdata Section */}
      {uploadStatus === 'success' && activeBatch && batchAnalytics && (
        <div className="space-y-4">
          {/* View Mode Switcher Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-[#ECDCC7]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveViewMode('report')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeViewMode === 'report'
                    ? 'bg-[#173F35] text-white shadow-xs'
                    : 'text-[#64716D] hover:text-[#173F35] hover:bg-white/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97925]" />
                <span>AI Ingestion &amp; Forecast Report</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveViewMode('table')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeViewMode === 'table'
                    ? 'bg-[#173F35] text-white shadow-xs'
                    : 'text-[#64716D] hover:text-[#173F35] hover:bg-white/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Microdata Registry ({activeBatch.totalRows} Rows)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportPdf}
              className="px-3.5 py-1.5 rounded-lg bg-[#173F35] text-white hover:bg-[#12322A] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
            >
              <FileDown className="w-4 h-4 text-[#E2F0E3]" />
              <span>Export Official PDF Report</span>
            </button>
          </div>

          {/* VIEW MODE 1: AI Ingestion & Forecast Report */}
          {activeViewMode === 'report' && (
            <div className="space-y-4">
              {/* Executive Model Reliability & Forecasting Banner */}
              <SurfaceCard className="p-4 bg-gradient-to-br from-[#FFFEFB] to-[#FAF7F2] border-[#E2D8C9]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#ECE4D7]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold tracking-wide uppercase bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
                        AI Engine Intelligence Report
                      </span>
                      <span className="text-xs font-mono text-[#64716D]">
                        Batch ID: {activeBatch.batchId}
                      </span>
                    </div>
                    <h2 className="font-serif-heading text-lg font-bold text-[#173F35] mt-1">
                      Telemetry Microdata Intelligence &amp; {dateRange} Labour Market Forecast
                    </h2>
                    <p className="text-xs text-[#64716D]">
                      Synthesized from {activeBatch.totalRows} verified district streams across {activeBatch.uniqueDistricts.length} districts and {batchAnalytics.sectorList.length} industrial sectors.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-[#64716D] block">Audit Integrity Hash</span>
                    <span className="text-[11px] font-mono font-bold text-[#17604D] truncate max-w-xs block">
                      {activeBatch.sha256Hash}
                    </span>
                  </div>
                </div>

                {/* 4 Executive Model Metric Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                  <div className="p-3 rounded-xl bg-white border border-[#E9E0D3] shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-[#64716D]">
                      <span>Model Confidence</span>
                      <ShieldCheck className="w-4 h-4 text-[#17604D]" />
                    </div>
                    <div className="text-2xl font-bold font-serif-heading text-[#173F35] mt-1">
                      {batchAnalytics.confidenceScore}%
                    </div>
                    <div className="text-[10.5px] font-medium text-[#166534] mt-0.5 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>High Confidence · LGD Registry Mapped</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E9E0D3] shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-[#64716D]">
                      <span>Data Quality Health Index</span>
                      <Activity className="w-4 h-4 text-[#D97925]" />
                    </div>
                    <div className="text-2xl font-bold font-serif-heading text-[#173F35] mt-1">
                      {batchAnalytics.accuracyIndex}%
                    </div>
                    <div className="text-[10.5px] font-medium text-[#17604D] mt-0.5">
                      {activeBatch.flaggedRowsCount === 0 ? 'Zero Logical Anomalies Detected' : `${activeBatch.flaggedRowsCount} Rows Need Field Audit`}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E9E0D3] shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-[#64716D]">
                      <span>{dateRange} Projected Demand</span>
                      <TrendingUp className="w-4 h-4 text-[#17604D]" />
                    </div>
                    <div className="text-2xl font-bold font-serif-heading text-[#17604D] mt-1">
                      +{batchAnalytics.totalProjectedDemand.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10.5px] font-medium text-[#64716D] mt-0.5">
                      Expected Employer Hiring Absorption
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E9E0D3] shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-[#64716D]">
                      <span>Local Tension Ratio (TR)</span>
                      <Gauge className="w-4 h-4 text-[#D94E34]" />
                    </div>
                    <div className="text-2xl font-bold font-serif-heading text-[#D94E34] mt-1">
                      {batchAnalytics.tensionRatio}x
                    </div>
                    <div className="text-[10.5px] font-medium text-[#D94E34] mt-0.5">
                      {parseFloat(batchAnalytics.tensionRatio) >= 1.25 ? 'High Demand / Undersupply Pressure' : 'Balanced Capacity Band'}
                    </div>
                  </div>
                </div>
              </SurfaceCard>

              {/* Charts Row 1: Admissions Funnel Flow + Sectoral Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Admissions-to-Retention Funnel Flow (7 cols) */}
                <SurfaceCard className="lg:col-span-7 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#17604D]" />
                        <h3 className="text-xs font-bold text-[#173F35]">
                          Admissions-to-Retention Pipeline Funnel Flow
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#64716D] font-mono">MSDE Throughput Funnel</span>
                    </div>

                    <p className="text-xs text-[#64716D] mt-2">
                      Tracks trainee progression through each institutional gateway: Sanctioned Capacity &rarr; Enrollment &rarr; Examination Certification &rarr; Verified Industry Placement.
                    </p>

                    {/* Funnel Step Bars */}
                    <div className="space-y-3.5 mt-4">
                      {/* Stage 1: Sanctioned */}
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#173F35] mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#173F35]"></span>
                            <span>Sanctioned Capacity</span>
                          </span>
                          <span className="font-mono font-bold">{activeBatch.totalSanctioned.toLocaleString('en-IN')} Seats (100%)</span>
                        </div>
                        <div className="w-full h-4 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E9E0D3]">
                          <div className="h-full bg-[#173F35] rounded-full w-full"></div>
                        </div>
                      </div>

                      {/* Stage 2: Enrolled */}
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#173F35] mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#17604D]"></span>
                            <span>Trainees Enrolled ({batchAnalytics.seatUtilizationRate}% Utilization)</span>
                          </span>
                          <span className="font-mono font-bold text-[#17604D]">{activeBatch.totalEnrolled.toLocaleString('en-IN')} Admitted</span>
                        </div>
                        <div className="w-full h-4 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E9E0D3]">
                          <div
                            className="h-full bg-[#17604D] rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(10, batchAnalytics.seatUtilizationRate))}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10.5px] text-[#64716D] mt-0.5">
                          <span>Unfilled Capacity: {Math.max(0, activeBatch.totalSanctioned - activeBatch.totalEnrolled).toLocaleString('en-IN')} seats</span>
                          <span>Fill Rate: {batchAnalytics.seatUtilizationRate}%</span>
                        </div>
                      </div>

                      {/* Stage 3: Certified */}
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#173F35] mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]"></span>
                            <span>Exam Certified ({batchAnalytics.trainingCompletionRate}% Completion Rate)</span>
                          </span>
                          <span className="font-mono font-bold text-[#2E7D32]">{activeBatch.totalCertified.toLocaleString('en-IN')} Passed</span>
                        </div>
                        <div className="w-full h-4 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E9E0D3]">
                          <div
                            className="h-full bg-[#2E7D32] rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(10, (activeBatch.totalCertified / Math.max(1, activeBatch.totalSanctioned)) * 100))}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10.5px] text-[#64716D] mt-0.5">
                          <span>Academic Dropouts: {Math.max(0, activeBatch.totalEnrolled - activeBatch.totalCertified).toLocaleString('en-IN')} trainees</span>
                          <span>Pass Efficiency: {batchAnalytics.trainingCompletionRate}%</span>
                        </div>
                      </div>

                      {/* Stage 4: Retained / Placed */}
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#173F35] mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D97925]"></span>
                            <span>Retained in Industry ({batchAnalytics.placementYieldRate}% Placement Yield)</span>
                          </span>
                          <span className="font-mono font-bold text-[#D97925]">{activeBatch.totalRetained.toLocaleString('en-IN')} Placed</span>
                        </div>
                        <div className="w-full h-4 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E9E0D3]">
                          <div
                            className="h-full bg-[#D97925] rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(10, (activeBatch.totalRetained / Math.max(1, activeBatch.totalSanctioned)) * 100))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Funnel Efficiency Summary Footnote */}
                  <div className="mt-4 pt-3 border-t border-[#ECE4D7] flex items-center justify-between text-xs">
                    <span className="text-[#64716D]">End-to-End Pipeline Conversion Efficiency:</span>
                    <span className="font-mono font-bold text-[#17604D] px-2 py-0.5 rounded bg-[#E8F5E9] border border-[#C8E6C9]">
                      {batchAnalytics.overallPipelineEfficiency}% of Sanctioned Seats Yield Employed Talent
                    </span>
                  </div>
                </SurfaceCard>

                {/* Right: Sectoral Output Distribution & Placement Rates (5 cols) */}
                <SurfaceCard className="lg:col-span-5 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
                      <div className="flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-[#D97925]" />
                        <h3 className="text-xs font-bold text-[#173F35]">
                          Sectoral Distribution &amp; Placement Yield
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#64716D] font-mono">{batchAnalytics.sectorList.length} Sectors</span>
                    </div>

                    <p className="text-xs text-[#64716D] mt-2">
                      Certified trainee distribution and localized job absorption rate segmented by National Occupational classification.
                    </p>

                    <div className="space-y-3 mt-3">
                      {batchAnalytics.sectorList.map((sec, idx) => {
                        const colors = ['bg-[#17604D]', 'bg-[#D97925]', 'bg-[#2E7D32]', 'bg-[#0284C7]', 'bg-[#9333EA]', 'bg-[#B45309]'];
                        const barColor = colors[idx % colors.length];
                        return (
                          <div key={sec.sector} className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E9E0D3]">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#173F35] mb-1">
                              <span className="truncate">{sec.sector}</span>
                              <span className="font-mono text-[11px] text-[#17604D]">
                                {sec.certified.toLocaleString('en-IN')} Trainees ({sec.sharePct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#ECE4D7]">
                              <div
                                className={`h-full ${barColor} rounded-full`}
                                style={{ width: `${Math.min(100, Math.max(5, sec.sharePct))}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-[10.5px] text-[#64716D] mt-1">
                              <span>{sec.tradesCount} Mapped Trades</span>
                              <span className="font-semibold text-[#D97925]">{sec.yieldRate}% Placement Yield</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[11px] text-[#64716D] border-t border-[#ECE4D7] flex items-center justify-between">
                    <span>Dominant Sector:</span>
                    <strong className="text-[#173F35]">{batchAnalytics.sectorList[0]?.sector || 'Core Technical'}</strong>
                  </div>
                </SurfaceCard>
              </div>

              {/* Charts Row 2: 1-Year AI Demand Forecast vs Certified Supply + Top Districts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Top Evaluated Trades — Dual Bar Comparison (7 cols) */}
                <SurfaceCard className="lg:col-span-7 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#17604D]" />
                      <h3 className="text-xs font-bold text-[#173F35]">
                        Top Ingested Trades: Certified Supply vs {dateRange} AI Demand Forecast
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-[10.5px] text-[#64716D]">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-[#17604D]"></span>
                        <span>Supply</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-[#D97925]"></span>
                        <span>Projected Demand</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mt-3">
                    {batchAnalytics.topTradesForecast.map((trade) => {
                      const maxVal = Math.max(trade.projectedDemand, trade.certified);
                      const supplyWidth = Math.round((trade.certified / maxVal) * 100);
                      const demandWidth = Math.round((trade.projectedDemand / maxVal) * 100);

                      return (
                        <div key={trade.ncoCode + trade.tradeName} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3]">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <div>
                              <div className="text-xs font-bold text-[#173F35]">
                                {trade.tradeName}{' '}
                                <span className="font-mono text-[10.5px] text-[#64716D]">({trade.ncoCode})</span>
                              </div>
                              <div className="text-[10px] text-[#64716D]">{trade.sector} · {trade.placementYield}% Placement Yield</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  trade.gap > 50
                                    ? 'bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]'
                                    : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                                }`}
                              >
                                {trade.gap > 0 ? `+${trade.gap} Deficit` : 'Balanced'}
                              </span>
                              <span className="text-[10.5px] text-[#17604D] font-mono font-semibold">
                                {trade.status}
                              </span>
                            </div>
                          </div>

                          {/* Dual Bars */}
                          <div className="space-y-1.5 font-mono text-[11px]">
                            {/* Certified Supply Bar */}
                            <div className="flex items-center gap-2">
                              <span className="w-16 text-[10.5px] text-[#64716D] font-sans">Supply:</span>
                              <div className="flex-1 bg-white rounded-full h-3 overflow-hidden border border-[#E0D5C3]">
                                <div
                                  className="h-full bg-[#17604D] rounded-full flex items-center justify-end pr-1 text-[9px] text-white font-bold transition-all duration-700"
                                  style={{ width: `${Math.max(12, supplyWidth)}%` }}
                                >
                                  {trade.certified}
                                </div>
                              </div>
                              <span className="w-12 text-right font-semibold text-[#17604D]">{trade.certified}</span>
                            </div>

                            {/* Projected Demand Bar */}
                            <div className="flex items-center gap-2">
                              <span className="w-16 text-[10.5px] text-[#64716D] font-sans">Demand:</span>
                              <div className="flex-1 bg-white rounded-full h-3 overflow-hidden border border-[#E0D5C3]">
                                <div
                                  className="h-full bg-[#D97925] rounded-full flex items-center justify-end pr-1 text-[9px] text-white font-bold transition-all duration-700"
                                  style={{ width: `${Math.max(12, demandWidth)}%` }}
                                >
                                  {trade.projectedDemand}
                                </div>
                              </div>
                              <span className="w-12 text-right font-semibold text-[#D97925]">{trade.projectedDemand}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SurfaceCard>

                {/* Right: Top Performing Districts by Placement Yield (5 cols) */}
                <SurfaceCard className="lg:col-span-5 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#166534]" />
                        <h3 className="text-xs font-bold text-[#173F35]">
                          Top District Placement Yield Rankings
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#64716D] font-mono">Job Retention</span>
                    </div>

                    <p className="text-xs text-[#64716D] mt-2">
                      Localities exhibiting highest post-certification employment retention and industrial linkage.
                    </p>

                    <div className="space-y-2.5 mt-3">
                      {batchAnalytics.topDistricts.map((dist, idx) => (
                        <div
                          key={dist.district}
                          className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E9E0D3] flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="w-5 h-5 rounded-full bg-[#173F35] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <div className="text-xs font-bold text-[#173F35] truncate">{dist.district}</div>
                              <div className="text-[10px] text-[#64716D]">{dist.state}</div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-[#17604D] font-mono">
                              {dist.yieldRate}% Placed
                            </div>
                            <div className="text-[10px] text-[#64716D] font-mono">
                              {dist.retained} / {dist.certified} candidates
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[11px] text-[#64716D] border-t border-[#ECE4D7]">
                    <span>Highest Placement Concentration: </span>
                    <strong className="text-[#17604D]">{batchAnalytics.topDistricts[0]?.district || 'Leading Cluster'}</strong>
                  </div>
                </SurfaceCard>
              </div>

              {/* Charts Row 3: Trainee Attrition & Leakage Diagnostics + NSQF Skill Level Stratification */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Trainee Attrition & Leakage Diagnostics (7 cols) */}
                <SurfaceCard className="lg:col-span-7 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#D94E34]" />
                        <h3 className="text-xs font-bold text-[#173F35]">
                          Trainee Attrition &amp; Pipeline Leakage Diagnostics
                        </h3>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]">
                        Early Warning Analysis
                      </span>
                    </div>

                    <p className="text-xs text-[#64716D] mt-2">
                      Pinpoints where potential skilled workforce is lost across institutional checkpoints.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3]">
                        <div className="text-[10.5px] text-[#64716D] font-medium">Unfilled Sanction Gap</div>
                        <div className="text-lg font-bold font-mono text-[#173F35] mt-0.5">
                          {batchAnalytics.unfilledSeats.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#64716D] mt-0.5">
                          {(100 - batchAnalytics.seatUtilizationRate).toFixed(1)}% vacant seats
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3]">
                        <div className="text-[10.5px] text-[#64716D] font-medium">Pre-Exam Dropouts</div>
                        <div className="text-lg font-bold font-mono text-[#D94E34] mt-0.5">
                          {batchAnalytics.academicDropouts.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#D94E34] font-semibold mt-0.5">
                          {(100 - batchAnalytics.trainingCompletionRate).toFixed(1)}% academic leaks
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3]">
                        <div className="text-[10.5px] text-[#64716D] font-medium">Post-Cert Placement Gap</div>
                        <div className="text-lg font-bold font-mono text-[#D97925] mt-0.5">
                          {batchAnalytics.unplacedGraduates.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#D97925] font-semibold mt-0.5">
                          {(100 - batchAnalytics.placementYieldRate).toFixed(1)}% awaiting job placement
                        </div>
                      </div>
                    </div>

                    {/* Primary Bottleneck Alert */}
                    <div className="mt-3 p-3 rounded-lg bg-[#FFF8F0] border border-[#FCE7D4] flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-[#D97925] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#173F35]">
                          Diagnostic Finding: {batchAnalytics.primaryBottleneck}
                        </div>
                        <div className="text-[11px] text-[#64716D] mt-0.5 leading-relaxed">
                          The largest loss of talent occurs at this stage. Interventions such as pre-placement corporate drives and dual-system apprenticeships will yield maximum ROI.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[11px] text-[#64716D] border-t border-[#ECE4D7] flex items-center justify-between">
                    <span>Overall Pipeline Retention:</span>
                    <strong className="text-[#17604D]">{batchAnalytics.overallPipelineEfficiency}% of Sanctioned Capacity</strong>
                  </div>
                </SurfaceCard>

                {/* Right: NSQF Qualification Level Stratification & Wage Index (5 cols) */}
                <SurfaceCard className="lg:col-span-5 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#17604D]" />
                        <h3 className="text-xs font-bold text-[#173F35]">
                          NSQF Qualification Stratification &amp; Wage Index
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#64716D] font-mono">Industry Band</span>
                    </div>

                    <p className="text-xs text-[#64716D] mt-2">
                      Trainee output classified by National Skills Qualification Framework hierarchy and expected entry-level wage bands.
                    </p>

                    <div className="space-y-2 mt-3">
                      {batchAnalytics.nsqfStratification.map((item) => (
                        <div
                          key={item.level}
                          className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E9E0D3] flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <div className="text-xs font-bold text-[#173F35] truncate">{item.label}</div>
                            <div className="text-[10px] text-[#64716D] truncate">{item.desc}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-mono font-bold text-[#17604D]">
                              {item.count.toLocaleString('en-IN')} Candidates
                            </div>
                            <div className="text-[10px] font-mono font-semibold text-[#D97925]">
                              {item.wage}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[11px] text-[#64716D] border-t border-[#ECE4D7] flex items-center justify-between">
                    <span>Primary Qualification Tier:</span>
                    <strong className="text-[#173F35]">NSQF Level 4 Certified Technicians</strong>
                  </div>
                </SurfaceCard>
              </div>

              {/* Row 4: Statutory Audit & NCVT/SID Verification Seal Card */}
              <SurfaceCard className="p-4 bg-gradient-to-r from-[#FAF7F2] via-[#FFFEFB] to-[#F4F9F5] border-[#CFE5D1]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center shrink-0 shadow-2xs">
                      <ShieldCheck className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#173F35]">
                          Statutory Telemetry Verification &amp; Cryptographic Ledger Seal
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                          DPDP Act (2023) Compliant
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                          NCVT MIS &amp; SID Ingested
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#64716D] mt-1 max-w-2xl">
                        This batch has been cryptographically validated against official Local Government Directory (LGD 2024) district registries and NCO-2015 occupational standards. Ready for formal submission to State SSDM Director Dr. Rajesh Varma, IES.
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[10.5px] font-mono text-[#64716D] flex-wrap">
                        <span>Audit Hash: <strong className="text-[#17604D]">{activeBatch.sha256Hash}</strong></span>
                        <span>·</span>
                        <span>File: <strong className="text-[#173F35]">{activeBatch.fileName}</strong></span>
                        <span>·</span>
                        <span>Valid Records: <strong className="text-[#166534]">{activeBatch.validRowsCount} / {activeBatch.totalRows} (100%)</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="px-3 py-1.5 rounded-lg bg-white border border-[#CFE5D1] shadow-2xs text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">Authorized Gateway</div>
                      <div className="text-xs font-bold text-[#173F35] mt-0.5">MSDE Telemetry Bus v2.4</div>
                      <div className="text-[9.5px] text-[#64716D] mt-0.5">Immutable Ingestion Timestamp</div>
                    </div>
                  </div>
                </div>
              </SurfaceCard>

              {/* Row 3: Automated AI Policy Directives & Prescriptions */}
              <SurfaceCard className="p-4 bg-[#FFFEFB] border-[#E2D8C9]">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E9E0D3]">
                  <Zap className="w-4 h-4 text-[#D97925]" />
                  <h3 className="text-xs font-bold text-[#173F35]">
                    Automated AI Policy Prescriptions &amp; Seat Allocation Directives
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3] space-y-1">
                    <div className="font-bold text-[#173F35] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#17604D]" />
                      <span>Capacity Realignment Directive</span>
                    </div>
                    <p className="text-[11.5px] text-[#64716D] leading-relaxed">
                      Strong employment absorption in <strong>{batchAnalytics.sectorList[0]?.sector || 'leading technical trades'}</strong> suggests unmet industry demand. Recommend sanctioning <strong>+15% to +20% additional intake</strong> across ITIs in {batchAnalytics.topDistricts[0]?.district || 'high-yield districts'}.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3] space-y-1">
                    <div className="font-bold text-[#173F35] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D97925]" />
                      <span>Dropout Mitigation Intervention</span>
                    </div>
                    <p className="text-[11.5px] text-[#64716D] leading-relaxed">
                      Detected <strong>{Math.max(0, activeBatch.totalEnrolled - activeBatch.totalCertified).toLocaleString('en-IN')} trainee dropouts</strong> between enrollment and final certification. Recommend District Skill Committees mandate attendance monitoring and remedial training.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3] space-y-1">
                    <div className="font-bold text-[#173F35] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Flexi-MoU Industry Linkage</span>
                    </div>
                    <p className="text-[11.5px] text-[#64716D] leading-relaxed">
                      Top performing clusters in <strong>{batchAnalytics.topDistricts.slice(0, 2).map((d) => d.district).join(' and ')}</strong> report superior placement retention (over 80%). State SSDMs should fast-track dual-system apprenticeship tie-ups with local industrial estates.
                    </p>
                  </div>
                </div>
              </SurfaceCard>
            </div>
          )}

          {/* VIEW MODE 2: Raw Microdata Preview Table */}
          {activeViewMode === 'table' && (
            <SurfaceCard className="p-4 space-y-3.5">
              {/* Header with Title, Search, 3 Filter Tabs, and Download Buttons */}
              <div className="flex flex-col gap-3 pb-3 border-b border-[#E9E0D3]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
                      <FileSpreadsheet className="w-4 h-4 text-[#17604D]" />
                      <span>Live Batch Microdata Preview ({activeBatch.fileName})</span>
                    </div>
                    <div className="text-[11px] text-[#64716D] mt-0.5">
                      Inspect row-level admissions, certification counts, and retention yields before final institutional commitment.
                    </div>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#64716D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={batchSearchQuery}
                      onChange={(e) => setBatchSearchQuery(e.target.value)}
                      placeholder="Filter batch trade or district..."
                      className="w-full pl-8 pr-3 py-1 text-xs bg-[#FFFEFB] border border-[#E9E0D3] rounded-lg text-[#173F35] focus:outline-none focus:border-[#17604D]"
                    />
                  </div>
                </div>

                {/* 3 Filter Mode Tabs & Export Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-lg border border-[#E9E0D3] overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setTableFilterMode('all')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        tableFilterMode === 'all'
                          ? 'bg-[#173F35] text-white shadow-2xs'
                          : 'text-[#64716D] hover:text-[#173F35] hover:bg-white/60'
                      }`}
                    >
                      <span>1. All Records (Mixed)</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          tableFilterMode === 'all' ? 'bg-white/20 text-white' : 'bg-[#E9E0D3] text-[#173F35]'
                        }`}
                      >
                        {activeBatch.totalRows}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTableFilterMode('valid')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        tableFilterMode === 'valid'
                          ? 'bg-[#166534] text-white shadow-2xs'
                          : 'text-[#64716D] hover:text-[#166534] hover:bg-white/60'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#BBF7D0]" />
                      <span>2. Only Correct Data</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          tableFilterMode === 'valid' ? 'bg-white/20 text-white' : 'bg-[#E2F0E3] text-[#166534]'
                        }`}
                      >
                        {activeBatch.validRowsCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTableFilterMode('faulty')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        tableFilterMode === 'faulty'
                          ? 'bg-[#9B1C1C] text-white shadow-2xs'
                          : 'text-[#64716D] hover:text-[#9B1C1C] hover:bg-white/60'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3 text-[#FCA5A5]" />
                      <span>3. Only Faulty Data</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          tableFilterMode === 'faulty' ? 'bg-white/20 text-white' : 'bg-[#FDE8E8] text-[#9B1C1C]'
                        }`}
                      >
                        {activeBatch.flaggedRowsCount}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleExportTableCsv(tableFilterMode)}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E0D5C3] text-xs font-semibold text-[#173F35] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      title={`Download ${tableFilterMode === 'faulty' ? 'Faulty' : tableFilterMode === 'valid' ? 'Clean' : 'All'} rows as CSV`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#17604D]" />
                      <span>
                        Download CSV ({tableFilterMode === 'faulty' ? 'Faulty' : tableFilterMode === 'valid' ? 'Clean' : 'All'})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportTablePdf(tableFilterMode)}
                      className="px-3 py-1.5 rounded-lg bg-[#173F35] hover:bg-[#12322A] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      title={`Download ${tableFilterMode === 'faulty' ? 'Faulty Sheet' : tableFilterMode === 'valid' ? 'Clean Register' : 'Complete Master'} as PDF`}
                    >
                      <FileDown className="w-3.5 h-3.5 text-[#E2F0E3]" />
                      <span>
                        Download PDF ({tableFilterMode === 'faulty' ? 'Faulty Sheet' : tableFilterMode === 'valid' ? 'Clean Register' : 'All Records'})
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Directive Advisory Banner inside table when viewing faulty rows */}
              {tableFilterMode === 'faulty' && (
                <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#92400E]">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#D97925] shrink-0 mt-0.5" />
                    <span>
                      <strong>ITI Centers Re-Verification Directive:</strong>{' '}
                      {t(
                        `These ${activeBatch.flaggedRowsCount} rows failed validation checks and are quarantined from the central ledger. Use 'Download PDF (Faulty Sheet)' or 'Download CSV' above to dispatch these discrepancy records to the respective ITI Principals for re-verification and resubmission.`,
                        `ये ${activeBatch.flaggedRowsCount} पंक्तियां सत्यापन में विफल रहीं और संगरोध में हैं। संबंधित आईटीआई प्राचार्यों को सुधार एवं पुनः प्रस्तुति हेतु भेजने के लिए ऊपर दिए गए 'Download PDF (Faulty Sheet)' अथवा 'Download CSV' का उपयोग करें।`
                      )}
                    </span>
                  </div>
                </div>
              )}

              {tableFilterMode === 'valid' && (
                <div className="p-2.5 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9] flex items-center gap-2 text-xs text-[#166534]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>
                    <strong>Approved Ledger Records:</strong> Showing {activeBatch.validRowsCount} verified rows adhering to LGD 2024 and NCO-2015 registries. Only these clean records merge into the National Ledger.
                  </span>
                </div>
              )}

              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#FAF7F2] text-[#64716D] uppercase text-[10px] tracking-wider border-b border-[#E9E0D3] sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Batch ID &amp; MIS</th>
                      <th className="py-2.5 px-3">District &amp; State</th>
                      <th className="py-2.5 px-3">Trade Name (NCO Code)</th>
                      <th className="py-2.5 px-3 text-right">Sanctioned</th>
                      <th className="py-2.5 px-3 text-right">Enrolled</th>
                      <th className="py-2.5 px-3 text-right">Certified</th>
                      <th className="py-2.5 px-3 text-right">Retained</th>
                      <th className="py-2.5 px-3 text-right">Yield</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1]">
                    {filteredBatchRows.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-xs text-[#64716D]">
                          {tableFilterMode === 'faulty' && activeBatch.flaggedRowsCount === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-1 text-[#166534]">
                              <CheckCircle2 className="w-5 h-5 text-[#166534]" />
                              <span className="font-semibold">No faulty or quarantined records in this batch!</span>
                              <span className="text-[11px] text-[#64716D]">All {activeBatch.totalRows} records passed validation checks cleanly.</span>
                            </div>
                          ) : (
                            <span>No records match the current filter or search criteria.</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredBatchRows.map((row, idx) => (
                        <tr key={row.id} className={`hover:bg-[#F8F5EF] transition-colors ${!row.isValid ? 'bg-[#FFFDFB]' : ''}`}>
                          <td className="py-2.5 px-3 text-[#64716D] font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-[#173F35] font-mono">{row.batchId}</div>
                            <div className="text-[10px] text-[#64716D] font-mono">{row.itiMisCode}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-[#173F35]">{row.districtName}</div>
                            <div className="text-[10px] text-[#64716D]">
                              {row.state} {row.districtLgdCode > 0 ? `(LGD ${row.districtLgdCode})` : ''}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-[#173F35] flex items-center gap-1.5">
                              <span>{row.tradeName}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F5F0E7] text-[#173F35] font-mono">
                                NSQF L{row.nsqfLevel}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#64716D] font-mono">{row.tradeNcoCode} · {row.sector}</div>
                            {!row.isValid && row.validationErrors.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {row.validationErrors.map((err, eIdx) => (
                                  <span key={eIdx} className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-[#9B1C1C] bg-[#FDE8E8] border border-[#F8B4B4] px-1.5 py-0.5 rounded">
                                    <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                    <span>{err}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-[#173F35]">
                            {row.sanctionedSeats.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#64716D]">
                            {row.enrolledCount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#17604D]">
                            {row.certifiedCount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#D97925]">
                            {row.retainedCount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-xs font-bold text-[#17604D]">
                            {row.retentionRate}%
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {row.isValid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E2F0E3] text-[#17604D] border border-[#BBF7D0]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Valid</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]"
                                title={row.validationErrors.join(', ')}
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Warning</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SurfaceCard>
          )}
        </div>
      )}

      {/* CSV Schema Reference Table */}
      <SurfaceCard className="p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
            <Info className="w-4 h-4 text-[#17604D]" />
            <span>{t('Required CSV Schema Specifications (MSDE v2.4)', 'आवश्यक सीएसवी स्कीमा विनिर्देश (एमएसडीई संस्करण 2.4)')}</span>
          </div>
          <span className="text-[11px] text-[#64716D]">{t('8 Mandatory Columns', '8 अनिवार्य कॉलम')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#64716D] uppercase text-[10px] tracking-wider border-b border-[#E9E0D3]">
              <tr>
                <th className="py-2 px-3">{t('Column Name', 'कॉलम का नाम')}</th>
                <th className="py-2 px-3">{t('Data Type', 'डेटा प्रकार')}</th>
                <th className="py-2 px-3">{t('Registry Standard', 'रजिस्ट्री मानक')}</th>
                <th className="py-2 px-3">{t('Example Value', 'उदाहरण')}</th>
                <th className="py-2 px-3">{t('Mandatory', 'अनिवार्य')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] font-mono text-[11px]">
              <tr>
                <td className="py-2 px-3 font-bold text-[#173F35]">district_lgd_code</td>
                <td className="py-2 px-3 text-[#64716D]">Integer</td>
                <td className="py-2 px-3 text-[#64716D]">MoPR Local Government Directory</td>
                <td className="py-2 px-3 text-[#17604D]">492</td>
                <td className="py-2 px-3 text-[#166534] font-bold">YES</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#173F35]">trade_nco_code</td>
                <td className="py-2 px-3 text-[#64716D]">String</td>
                <td className="py-2 px-3 text-[#64716D]">National Classification of Occupations 2015</td>
                <td className="py-2 px-3 text-[#17604D]">7411.0101</td>
                <td className="py-2 px-3 text-[#166534] font-bold">YES</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#173F35]">iti_mis_code</td>
                <td className="py-2 px-3 text-[#64716D]">String</td>
                <td className="py-2 px-3 text-[#64716D]">NCVT MIS Institution Code</td>
                <td className="py-2 px-3 text-[#17604D]">ITI270492</td>
                <td className="py-2 px-3 text-[#166534] font-bold">YES</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#173F35]">batch_id</td>
                <td className="py-2 px-3 text-[#64716D]">String</td>
                <td className="py-2 px-3 text-[#64716D]">Provider Internal Batch Identifier</td>
                <td className="py-2 px-3 text-[#17604D]">BATCH-2026-01</td>
                <td className="py-2 px-3 text-[#166534] font-bold">YES</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#173F35]">enrolled_count</td>
                <td className="py-2 px-3 text-[#64716D]">Integer</td>
                <td className="py-2 px-3 text-[#64716D]">Candidates Verified on SIP / Skill India</td>
                <td className="py-2 px-3 text-[#17604D]">88</td>
                <td className="py-2 px-3 text-[#166534] font-bold">YES</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-[#173F35]">certified_count</td>
                <td className="py-2 px-3 text-[#64716D]">Integer</td>
                <td className="py-2 px-3 text-[#64716D]">NCVET / DGT Certified Graduates</td>
                <td className="py-2 px-3 text-[#17604D]">80</td>
                <td className="py-2 px-3 text-[#166534] font-bold">YES</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SurfaceCard>

      {/* Ingestion Audit Trail & Cross-Navigation Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Ingestion History (8 cols) */}
        <SurfaceCard className="lg:col-span-8 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
              <Clock className="w-4 h-4 text-[#17604D]" />
              <span>{t('Recent Ingestion Batches & Audit Trail', 'हाल के अंतर्ग्रहण बैच एवं ऑडिट ट्रेल')}</span>
            </div>
            <span className="text-[11px] text-[#64716D] font-mono">Total {dynamicIngestionHistory.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#64716D] uppercase text-[10px] tracking-wider border-b border-[#E9E0D3]">
                <tr>
                  <th className="py-2 px-3">{t('File & Batch ID', 'फ़ाइल एवं बैच आईडी')}</th>
                  <th className="py-2 px-3">{t('District', 'ज़िला')}</th>
                  <th className="py-2 px-3 text-right">{t('Records', 'रिकॉर्ड')}</th>
                  <th className="py-2 px-3 text-right">{t('Status', 'स्थिति')}</th>
                  <th className="py-2 px-3 text-right">{t('Timestamp', 'समय')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {dynamicIngestionHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F5EF] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#173F35]">{item.fileName}</div>
                      <div className="text-[10px] text-[#64716D] font-mono">{item.batchId}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#64716D]">{item.district}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#173F35]">
                      {item.recordsCount}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E2F0E3] text-[#17604D] border border-[#BBF7D0]">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#64716D]">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        {/* Cross Link to Data Explorer (4 cols) */}
        <SurfaceCard className="lg:col-span-4 p-4 flex flex-col justify-between gap-3 bg-[#FAF6EE] border-[#E8DDCE]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173F35]">
              <Layers className="w-4 h-4 text-[#D97925]" />
              <span>{t('Labour Market Data Explorer', 'श्रम बाज़ार डेटा अन्वेषक')}</span>
            </div>
            <p className="text-xs text-[#64716D] leading-relaxed">
              {t(
                'Cross-reference your ingested telemetry batch against nationwide Periodic Labour Force Survey (PLFS), EPFO hiring metrics, and NCS vacancy data.',
                'अपने अंतर्ग्रहीत टेलीमेट्री बैच को राष्ट्रव्यापी आवधिक श्रम बल सर्वेक्षण (पीएलएफएस), ईपीएफओ भर्ती मेट्रिक्स और एनसीएस रिक्ति डेटा के साथ क्रॉस-रेफरेंस करें।'
              )}
            </p>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => {
                onNavigate('data-explorer');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17604D] hover:text-[#173F35] cursor-pointer pt-2 border-t border-[#E8DDCE]"
            >
              <span>{t('Open Labour Data Explorer', 'डेटा अन्वेषक खोलें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </SurfaceCard>
      </div>
    </div>
  );
};
