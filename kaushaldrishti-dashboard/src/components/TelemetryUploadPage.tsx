import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  FileCheck,
  ShieldCheck,
  Clock,
  Database,
  ArrowRight,
  Layers,
  Info,
} from 'lucide-react';
import { SurfaceCard, PrimaryButton, SecondaryButton } from './DesignSystemUI';
import { UserSession } from './AuthModal';
import { NavRouteId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getHorizonConfig } from '../data/dashboardMetrics';

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

const PAST_INGESTION_LOGS: IngestionHistoryItem[] = [
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
  const [parsedRows, setParsedRows] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleSimulatedUpload = (name: string) => {
    setFileName(name);
    setUploadStatus('parsing');
    setTimeout(() => {
      setParsedRows(148);
      setUploadStatus('success');
    }, 900);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSimulatedUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulatedUpload(e.target.files[0].name);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setUploadStatus('idle');
    setParsedRows(0);
  };

  const handleDownloadTemplate = () => {
    setDownloadSuccess(true);
    const csvContent =
      'district_lgd_code,district_name,iti_mis_code,trade_nco_code,trade_name,batch_id,sanctioned_seats,enrolled_count,certified_count,retained_count,reporting_period\n' +
      '492,Pune,ITI270492,7411.0101,Solar PV Rooftop Technician,BATCH-2026-01,100,88,80,68,2026-Q1\n' +
      '158,Kanpur Nagar,ITI090158,7231.0102,EV Automotive Service Technician,BATCH-2026-02,120,112,102,86,2026-Q1\n' +
      '365,Khordha,ITI210365,7223.0501,CNC Precision Machinist,BATCH-2026-03,80,75,70,62,2026-Q1\n';

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

      {/* Primary Upload Card */}
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
              {t('Validating schema against LGD & NCO-2015 registries...', 'एलजीडी एवं एनसीओ-2015 रजिस्ट्रियों के विरुद्ध स्कीमा का सत्यापन जारी...')}
            </div>
            <div className="text-xs text-[#64716D]">
              {t('Analyzing columns and formatting for', 'कॉलम एवं प्रारूप का विश्लेषण')} <span className="font-mono font-bold text-[#173F35]">{fileName}</span>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="p-5 rounded-xl bg-[#E5F2E6] border border-[#CFE5D1] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#17604D] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-[#173F35]">
                    {t('Telemetry Successfully Ingested:', 'टेलीमेट्री सफलतापूर्वक अंतर्ग्रहीत:')} <span className="font-mono">{fileName}</span>
                  </div>
                  <div className="text-xs text-[#17604D]">
                    {parsedRows} {t('district admission rows validated and synchronized with central labour database.', 'जिला प्रवेश रिकॉर्ड मान्य और केंद्रीय श्रम डेटाबेस के साथ समकालिक किए गए।')}
                  </div>
                </div>
              </div>
              <SecondaryButton tone="warm" onClick={handleReset} className="self-start sm:self-auto shadow-2xs">
                <span>{t('Upload Another Batch', 'अन्य बैच अपलोड करें')}</span>
              </SecondaryButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-center text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#FFFEFB] border border-[#CFE5D1]">
                <div className="text-[10.5px] text-[#64716D] font-sans">{t('Valid Clean Records', 'मान्य शुद्ध रिकॉर्ड')}</div>
                <div className="text-base font-bold text-[#173F35] mt-0.5">148 / 148 (100%)</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFEFB] border border-[#CFE5D1]">
                <div className="text-[10.5px] text-[#64716D] font-sans">{t('Districts Synced', 'समकालिक जिले')}</div>
                <div className="text-base font-bold text-[#17604D] mt-0.5">3 (LGD 492, 158, 365)</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFEFB] border border-[#CFE5D1]">
                <div className="text-[10.5px] text-[#64716D] font-sans">{t('Early Warnings Recalculated', 'पुनर्गणित सचेतक')}</div>
                <div className="text-base font-bold text-[#D96843] mt-0.5">4 Critical Signals</div>
              </div>
            </div>
          </div>
        )}
      </SurfaceCard>

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
            <span className="text-[11px] text-[#64716D] font-mono">Total 4 Records</span>
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
                {PAST_INGESTION_LOGS.map((item) => (
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
