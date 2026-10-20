import { ExplorerRecord, SupplyStatus } from '../types';
import { COMPREHENSIVE_DEMAND_SUPPLY_RECORDS } from './demandSupplyData';

export interface ParsedTelemetryRow {
  id: string;
  districtLgdCode: number;
  districtName: string;
  state: string;
  itiMisCode: string;
  tradeNcoCode: string;
  tradeName: string;
  sector: string;
  nsqfLevel: number;
  batchId: string;
  sanctionedSeats: number;
  enrolledCount: number;
  certifiedCount: number;
  retainedCount: number;
  reportingPeriod: string;
  enrollmentRate: number; // e.g., 88.0%
  completionRate: number; // e.g., 90.9%
  retentionRate: number;  // e.g., 85.0%
  isValid: boolean;
  validationErrors: string[];
}

export interface IngestionBatchResult {
  batchId: string;
  fileName: string;
  fileSizeKb: number;
  uploadedAt: string;
  totalRows: number;
  validRowsCount: number;
  flaggedRowsCount: number;
  uniqueDistricts: string[];
  totalSanctioned: number;
  totalEnrolled: number;
  totalCertified: number;
  totalRetained: number;
  avgEnrollmentRate: number;
  avgCompletionRate: number;
  avgRetentionRate: number;
  rows: ParsedTelemetryRow[];
  status: 'Verified' | 'Review Required';
  sha256Hash: string;
}

// Canonical Local Government Directory (LGD 2024) Map for Primary Districts
export const CANONICAL_LGD_MAP: Record<number, { district: string; state: string }> = {
  492: { district: 'Pune', state: 'Maharashtra' },
  485: { district: 'Mumbai Suburban', state: 'Maharashtra' },
  158: { district: 'Kanpur Nagar', state: 'Uttar Pradesh' },
  160: { district: 'Lucknow', state: 'Uttar Pradesh' },
  365: { district: 'Khordha', state: 'Odisha' },
  214: { district: 'Patna', state: 'Bihar' },
  572: { district: 'Bengaluru Urban', state: 'Karnataka' },
  474: { district: 'Ahmedabad', state: 'Gujarat' },
  603: { district: 'Chennai', state: 'Tamil Nadu' },
  109: { district: 'Jaipur', state: 'Rajasthan' },
  532: { district: 'Hyderabad', state: 'Telangana' },
  418: { district: 'Bhopal', state: 'Madhya Pradesh' },
  342: { district: 'Kolkata', state: 'West Bengal' },
  34: { district: 'Ludhiana', state: 'Punjab' },
  81: { district: 'Gurugram', state: 'Haryana' },
  595: { district: 'Ernakulam', state: 'Kerala' },
  303: { district: 'Kamrup Metropolitan', state: 'Assam' },
  345: { district: 'Ranchi', state: 'Jharkhand' },
  405: { district: 'Raipur', state: 'Chhattisgarh' },
  544: { district: 'Visakhapatnam', state: 'Andhra Pradesh' },
  56: { district: 'Dehradun', state: 'Uttarakhand' },
  28: { district: 'Shimla', state: 'Himachal Pradesh' },
  12: { district: 'Srinagar', state: 'Jammu & Kashmir' },
  9: { district: 'Leh', state: 'Ladakh' },
  93: { district: 'New Delhi', state: 'NCT of Delhi' },
  585: { district: 'North Goa', state: 'Goa' },
  632: { district: 'Chandigarh', state: 'Chandigarh' },
  635: { district: 'Puducherry', state: 'Puducherry' },
};

// Canonical NCO-2015 to Sector & NSQF Master Mapping
export const CANONICAL_NCO_MAP: Record<string, { sector: string; nsqfLevel: number; defaultName: string }> = {
  '7411.0101': { sector: 'Green Jobs', nsqfLevel: 4, defaultName: 'Solar PV Rooftop Technician' },
  '7412.03': { sector: 'Green Jobs', nsqfLevel: 4, defaultName: 'Solar PV Technician' },
  '2512.0101': { sector: 'IT/ITeS', nsqfLevel: 6, defaultName: 'Software Developer' },
  '2512.01': { sector: 'IT/ITeS', nsqfLevel: 6, defaultName: 'Software Developer' },
  '2511.01': { sector: 'IT/ITeS', nsqfLevel: 6, defaultName: 'Data Analyst' },
  '7223.0501': { sector: 'Manufacturing', nsqfLevel: 4, defaultName: 'CNC Precision Machinist' },
  '7223.03': { sector: 'Manufacturing', nsqfLevel: 4, defaultName: 'CNC Operator / Programmer' },
  '7231.0102': { sector: 'Automotive', nsqfLevel: 5, defaultName: 'EV Automotive Service Technician' },
  '7412.05': { sector: 'Automotive', nsqfLevel: 5, defaultName: 'EV Powertrain Diagnostics Tech' },
  '5321.0100': { sector: 'Healthcare', nsqfLevel: 4, defaultName: 'Healthcare General Duty Assistant' },
  '5322.01': { sector: 'Healthcare', nsqfLevel: 4, defaultName: 'Geriatric Care Assistant' },
  '8341.02': { sector: 'Agriculture', nsqfLevel: 4, defaultName: 'Agri Drone Operator' },
  '9621.01': { sector: 'Logistics', nsqfLevel: 3, defaultName: 'Warehouse Logistics Associate' },
  '5123.02': { sector: 'Hospitality', nsqfLevel: 4, defaultName: 'Hospitality Associate & Front Office' },
  '3118.01': { sector: 'Construction', nsqfLevel: 5, defaultName: 'BIM Modeler & Digital Draughtsman' },
  '5223.01': { sector: 'Retail', nsqfLevel: 3, defaultName: 'Retail Sales & Customer Associate' },
  '8212.01': { sector: 'Electronics', nsqfLevel: 5, defaultName: 'Semiconductor Assembly & Test Tech' },
  '7533.01': { sector: 'Textiles & Apparel', nsqfLevel: 3, defaultName: 'Industrial Sewing Machine Operator' },
};

/**
 * Robust CSV line tokenizer respecting quoted fields
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Computes deterministic pseudo SHA-256 string for audit receipt
 */
function computeAuditHash(str: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c64e6d;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  return '0x' + hex.padStart(16, '0') + hex.padStart(16, '0');
}

/**
 * Full in-browser CSV parsing, validation, and analytics engine
 */
export function parseTelemetryCsv(
  csvText: string,
  fileName: string,
  fileSizeBytes: number
): IngestionBatchResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV file contains no records. Must have a header row and at least 1 record.');
  }

  const rawHeaders = parseCsvLine(lines[0]);
  const headers = rawHeaders.map((h) => h.toLowerCase().replace(/[\s\-_]/g, ''));

  // Header mapping indices
  const getIdx = (candidates: string[]) =>
    headers.findIndex((h) => candidates.some((c) => h === c || h.includes(c)));

  const idxLgd = getIdx(['districtlgdcode', 'lgdcode', 'districtlgd', 'lgd']);
  const idxDistrictName = getIdx(['districtname', 'district']);
  const idxItiMis = getIdx(['itimiscode', 'miscode', 'iticode']);
  const idxTradeNco = getIdx(['tradencocode', 'ncocode', 'nco']);
  const idxTradeName = getIdx(['tradename', 'trade']);
  const idxBatchId = getIdx(['batchid', 'batch']);
  const idxSanctioned = getIdx(['sanctionedseats', 'sanctioned', 'seats']);
  const idxEnrolled = getIdx(['enrolledcount', 'enrolled', 'admitted']);
  const idxCertified = getIdx(['certifiedcount', 'certified', 'passed']);
  const idxRetained = getIdx(['retainedcount', 'retained', 'placed']);
  const idxPeriod = getIdx(['reportingperiod', 'period', 'quarter']);

  const parsedRows: ParsedTelemetryRow[] = [];
  const uniqueDistrictsSet = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseCsvLine(lines[i]);
    if (rawCols.length === 0 || (rawCols.length === 1 && rawCols[0] === '')) continue;

    const errors: string[] = [];
    const lgdCodeRaw = idxLgd !== -1 ? parseInt(rawCols[idxLgd], 10) : NaN;
    const lgdInfo = !isNaN(lgdCodeRaw) ? CANONICAL_LGD_MAP[lgdCodeRaw] : undefined;

    let district = (idxDistrictName !== -1 ? rawCols[idxDistrictName] : '') || lgdInfo?.district || 'Unknown District';
    let state = lgdInfo?.state || 'National Jurisdiction';

    if (isNaN(lgdCodeRaw)) {
      errors.push('Missing or non-integer district_lgd_code');
    }

    const ncoCode = (idxTradeNco !== -1 ? rawCols[idxTradeNco] : '') || '7411.0101';
    const ncoInfo = CANONICAL_NCO_MAP[ncoCode] || CANONICAL_NCO_MAP[ncoCode.slice(0, 7)] || {
      sector: 'General Technical',
      nsqfLevel: 4,
      defaultName: 'Technical Vocational Trade',
    };

    const tradeName = (idxTradeName !== -1 ? rawCols[idxTradeName] : '') || ncoInfo.defaultName;
    const itiCode = (idxItiMis !== -1 ? rawCols[idxItiMis] : '') || `ITI${lgdCodeRaw || '000000'}`;
    const batchId = (idxBatchId !== -1 ? rawCols[idxBatchId] : '') || `BATCH-${Date.now()}-${i}`;
    const period = (idxPeriod !== -1 ? rawCols[idxPeriod] : '') || '2026-Q1';

    const sanctioned = Math.max(0, idxSanctioned !== -1 ? parseInt(rawCols[idxSanctioned], 10) || 0 : 0);
    const enrolled = Math.max(0, idxEnrolled !== -1 ? parseInt(rawCols[idxEnrolled], 10) || 0 : 0);
    const certified = Math.max(0, idxCertified !== -1 ? parseInt(rawCols[idxCertified], 10) || 0 : 0);
    const retained = Math.max(0, idxRetained !== -1 ? parseInt(rawCols[idxRetained], 10) || 0 : 0);

    if (sanctioned === 0) {
      errors.push('Sanctioned seats must be greater than zero');
    }
    if (enrolled > sanctioned && sanctioned > 0) {
      errors.push(`Over-enrollment: ${enrolled} exceeds sanctioned capacity ${sanctioned}`);
    }
    if (certified > enrolled && enrolled > 0) {
      errors.push(`Invalid certification: ${certified} certified exceeds enrolled ${enrolled}`);
    }
    if (retained > certified && certified > 0) {
      errors.push(`Invalid retention: ${retained} retained exceeds certified ${certified}`);
    }

    const enrollmentRate = sanctioned > 0 ? Math.round((enrolled / sanctioned) * 1000) / 10 : 0;
    const completionRate = enrolled > 0 ? Math.round((certified / enrolled) * 1000) / 10 : 0;
    const retentionRate = certified > 0 ? Math.round((retained / certified) * 1000) / 10 : 0;

    uniqueDistrictsSet.add(`${district}${!isNaN(lgdCodeRaw) ? ` (LGD ${lgdCodeRaw})` : ''}`);

    parsedRows.push({
      id: `row-${i}-${batchId}`,
      districtLgdCode: isNaN(lgdCodeRaw) ? 0 : lgdCodeRaw,
      districtName: district,
      state: state,
      itiMisCode: itiCode,
      tradeNcoCode: ncoCode,
      tradeName: tradeName,
      sector: ncoInfo.sector,
      nsqfLevel: ncoInfo.nsqfLevel,
      batchId: batchId,
      sanctionedSeats: sanctioned,
      enrolledCount: enrolled,
      certifiedCount: certified,
      retainedCount: retained,
      reportingPeriod: period,
      enrollmentRate: enrollmentRate,
      completionRate: completionRate,
      retentionRate: retentionRate,
      isValid: errors.length === 0,
      validationErrors: errors,
    });
  }

  const validRowsCount = parsedRows.filter((r) => r.isValid).length;
  const flaggedRowsCount = parsedRows.length - validRowsCount;

  const totalSanctioned = parsedRows.reduce((acc, r) => acc + r.sanctionedSeats, 0);
  const totalEnrolled = parsedRows.reduce((acc, r) => acc + r.enrolledCount, 0);
  const totalCertified = parsedRows.reduce((acc, r) => acc + r.certifiedCount, 0);
  const totalRetained = parsedRows.reduce((acc, r) => acc + r.retainedCount, 0);

  const avgEnrollmentRate = totalSanctioned > 0 ? Math.round((totalEnrolled / totalSanctioned) * 1000) / 10 : 0;
  const avgCompletionRate = totalEnrolled > 0 ? Math.round((totalCertified / totalEnrolled) * 1000) / 10 : 0;
  const avgRetentionRate = totalCertified > 0 ? Math.round((totalRetained / totalCertified) * 1000) / 10 : 0;

  const batchIdentifier =
    parsedRows[0]?.batchId?.split('-').slice(0, 2).join('-') || `BATCH-INGEST-${Date.now().toString().slice(-4)}`;

  return {
    batchId: batchIdentifier,
    fileName: fileName,
    fileSizeKb: Math.round((fileSizeBytes / 1024) * 10) / 10,
    uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    totalRows: parsedRows.length,
    validRowsCount: validRowsCount,
    flaggedRowsCount: flaggedRowsCount,
    uniqueDistricts: Array.from(uniqueDistrictsSet),
    totalSanctioned: totalSanctioned,
    totalEnrolled: totalEnrolled,
    totalCertified: totalCertified,
    totalRetained: totalRetained,
    avgEnrollmentRate: avgEnrollmentRate,
    avgCompletionRate: avgCompletionRate,
    avgRetentionRate: avgRetentionRate,
    rows: parsedRows,
    status: flaggedRowsCount === 0 ? 'Verified' : 'Review Required',
    sha256Hash: computeAuditHash(csvText),
  };
}

/**
 * Multi-User Observable Store for Real-Time District Telemetry
 * Synchronizes with Central Backend Ledger (FastAPI /api/telemetry/...)
 * so that committed data is instantly visible across all users, devices, and sessions.
 */
class TelemetryStore {
  private activeRecords: ExplorerRecord[] = [...COMPREHENSIVE_DEMAND_SUPPLY_RECORDS];
  private ingestedBatches: IngestionBatchResult[] = [];
  private listeners: Array<() => void> = [];
  private syncTimer: any = null;
  private isSyncing: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Initial hydration from central backend server
      this.syncWithServer();

      // 2. Multi-client background synchronization polling (every 6 seconds)
      this.syncTimer = setInterval(() => {
        this.syncWithServer();
      }, 6000);
    }
  }

  public getRecords(): ExplorerRecord[] {
    return this.activeRecords;
  }

  public getBatches(): IngestionBatchResult[] {
    return this.ingestedBatches;
  }

  /**
   * Rebuilds ExplorerRecords from all active batches
   */
  private rebuildRecords(): void {
    const newRecords: ExplorerRecord[] = [];

    this.ingestedBatches.forEach((batch) => {
      const rows = batch.rows || [];
      rows
        .filter((r) => r.isValid)
        .forEach((r, idx) => {
          const annualDemand = Math.round(r.sanctionedSeats * 1.35);
          const annualTrained = r.certifiedCount;
          const gap = annualDemand - annualTrained;
          const status: SupplyStatus = gap > 150 ? 'Undersupply' : gap < -150 ? 'Oversupply' : 'Balanced';

          newRecords.push({
            id: `telemetry-${batch.batchId}-${idx}`,
            ncoCode: r.tradeNcoCode,
            tradeName: r.tradeName,
            nsqfLevel: r.nsqfLevel,
            sector: r.sector,
            state: r.state,
            district: r.districtName,
            annualDemand: annualDemand,
            annualTrained: annualTrained,
            gap: gap,
            status: status,
            source: 'Live District Telemetry (MSDE v2.4)',
            lastUpdated: batch.uploadedAt || 'Just now (Synced)',
          });
        });
    });

    this.activeRecords = [...newRecords, ...COMPREHENSIVE_DEMAND_SUPPLY_RECORDS];
  }

  /**
   * Fetches latest committed batches from central server ledger
   */
  public async syncWithServer(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await fetch('/api/telemetry/batches', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      const serverBatches: IngestionBatchResult[] = data.batches || [];

      // Check if server batches differ from current local state
      const serverSig = serverBatches.map((b) => `${b.batchId}:${b.validRowsCount}`).join('|');
      const localSig = this.ingestedBatches.map((b) => `${b.batchId}:${b.validRowsCount}`).join('|');

      if (serverSig !== localSig) {
        this.ingestedBatches = serverBatches;
        this.rebuildRecords();
        this.notify();
      }
    } catch {
      // Quietly continue using local cache if server is offline
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Commits a batch locally and pushes to central backend server for global persistence
   */
  public async commitBatch(batch: IngestionBatchResult): Promise<void> {
    // 1. Optimistic local update
    const existingIdx = this.ingestedBatches.findIndex((b) => b.batchId === batch.batchId);
    if (existingIdx >= 0) {
      this.ingestedBatches[existingIdx] = batch;
    } else {
      this.ingestedBatches.unshift(batch);
    }

    this.rebuildRecords();
    this.notify();

    // 2. Persist to central backend server
    try {
      await fetch('/api/telemetry/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(batch),
      });
    } catch (err) {
      console.warn('[TelemetryStore] Failed to persist batch to central server:', err);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}

export const globalTelemetryStore = new TelemetryStore();
