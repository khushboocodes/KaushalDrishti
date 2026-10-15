import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { SurfaceCard, PrimaryButton, SecondaryButton } from './DesignSystemUI';

export const BulkUploaderCard: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'success'>('idle');
  const [parsedRows, setParsedRows] = useState<number>(0);

  const handleSimulatedUpload = (name: string) => {
    setFileName(name);
    setUploadStatus('parsing');
    setTimeout(() => {
      setParsedRows(148);
      setUploadStatus('success');
    }, 800);
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

  return (
    <SurfaceCard className="space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#17604D]" />
          <h3 className="text-xs font-bold text-[#173F35]">
            Bulk District Telemetry CSV &amp; Admission Uploader
          </h3>
        </div>
        <span className="text-[11px] text-[#64716D] font-mono">MSDE Format v2.4</span>
      </div>

      <p className="text-xs text-[#64716D]">
        District Skill Committees and ITI principals can upload local batch admissions and certified trainee logs to recalculate localized tension ratios and early warning flags.
      </p>

      {uploadStatus === 'idle' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragActive
              ? 'border-[#17604D] bg-[#E2F0E3]/40'
              : 'border-[#E9E0D3] bg-[#FAF7F2] hover:border-[#17604D]'
          }`}
        >
          <UploadCloud className="w-8 h-8 text-[#17604D] mx-auto mb-2 opacity-80" />
          <div className="text-xs font-semibold text-[#173F35]">
            Drag &amp; drop District Admission CSV here
          </div>
          <div className="text-[11px] text-[#64716D] mt-1">
            Accepts <code className="font-mono text-[#17604D]">.csv</code>, <code className="font-mono text-[#17604D]">.xlsx</code> (Max 25 MB)
          </div>

          <label className="inline-block mt-3">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleChange}
              className="hidden"
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFFEFB] border border-[#E9E0D3] hover:bg-[#F5F0E7] text-[#173F35] cursor-pointer shadow-2xs">
              Browse Local Files
            </span>
          </label>
        </div>
      )}

      {uploadStatus === 'parsing' && (
        <div className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E9E0D3] text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-[#17604D] animate-spin mx-auto" />
          <div className="text-xs font-bold text-[#173F35]">
            Validating schema against LGD &amp; NCO-2015 registries...
          </div>
          <div className="text-[11px] text-[#64716D]">Checking columns for {fileName}</div>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="p-4 rounded-xl bg-[#E5F2E6] border border-[#CFE5D1] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#17604D]" />
              <div>
                <div className="text-xs font-bold text-[#173F35]">
                  Telemetry Successfully Ingested: {fileName}
                </div>
                <div className="text-[11px] text-[#17604D]">
                  {parsedRows} district admission rows cross-referenced with NCO trade catalog.
                </div>
              </div>
            </div>
            <SecondaryButton tone="warm" onClick={handleReset}>
              <span>Upload Another</span>
            </SecondaryButton>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs font-mono">
            <div className="p-2 rounded bg-[#FFFEFB] border border-[#CFE5D1]">
              <div className="text-[10px] text-[#64716D]">Valid Records</div>
              <div className="font-bold text-[#173F35] mt-0.5">148 / 148</div>
            </div>
            <div className="p-2 rounded bg-[#FFFEFB] border border-[#CFE5D1]">
              <div className="text-[10px] text-[#64716D]">Districts Synced</div>
              <div className="font-bold text-[#17604D] mt-0.5">3 (LGD 492, 158, 365)</div>
            </div>
            <div className="p-2 rounded bg-[#FFFEFB] border border-[#CFE5D1]">
              <div className="text-[10px] text-[#64716D]">Early Warnings Recalculated</div>
              <div className="font-bold text-[#D96843] mt-0.5">4 Critical Signals</div>
            </div>
          </div>
        </div>
      )}
    </SurfaceCard>
  );
};
