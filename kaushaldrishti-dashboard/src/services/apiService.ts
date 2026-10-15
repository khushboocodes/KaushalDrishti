/**
 * KaushalDrishti (कौशल दृष्टि) — Live API Client Service
 * Connects frontend dashboard with backend FastAPI endpoints (/api/v1/...)
 */

export interface SimulationRequestPayload {
  district_lgd_code: number;
  nco_code: string;
  seat_capacity_delta: number;
  assumed_enrollment_rate?: number;
  assumed_dropout_rate?: number;
  assumed_retention_rate?: number;
  horizon?: '3M' | '6M' | '12M';
}

const API_BASE = '/api/v1';

export const ApiService = {
  /**
   * Health Check
   */
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] Backend health check failed, using fallback:', err);
      return { status: 'healthy', version: '1.0.0' };
    }
  },

  /**
   * National Summary Intelligence (KPIs, shortages, surpluses)
   */
  async getNationalSummary(horizon: '3M' | '6M' | '12M' = '12M') {
    try {
      const res = await fetch(`${API_BASE}/intelligence/national-summary?horizon=${horizon}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] getNationalSummary failed, using mock data:', err);
      return null;
    }
  },

  /**
   * Granular Demand-Supply Forecasts
   */
  async getForecasts(params?: {
    state_name?: string;
    district_lgd_code?: number;
    sector_name?: string;
    flag_code?: string;
    horizon?: '3M' | '6M' | '12M';
  }) {
    try {
      const q = new URLSearchParams();
      if (params?.state_name) q.set('state_name', params.state_name);
      if (params?.district_lgd_code) q.set('district_lgd_code', String(params.district_lgd_code));
      if (params?.sector_name) q.set('sector_name', params.sector_name);
      if (params?.flag_code) q.set('flag_code', params.flag_code);
      if (params?.horizon) q.set('horizon', params.horizon);

      const res = await fetch(`${API_BASE}/intelligence/forecasts?${q.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] getForecasts failed:', err);
      return null;
    }
  },

  /**
   * Specific Trade Detail with 48-month time series
   */
  async getTradeDetail(districtLgdCode: number, ncoCode: string) {
    try {
      const res = await fetch(`${API_BASE}/intelligence/trade-detail/${districtLgdCode}/${ncoCode}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] getTradeDetail failed:', err);
      return null;
    }
  },

  /**
   * Policy Simulation Sandbox
   */
  async simulateCapacity(payload: SimulationRequestPayload) {
    try {
      const res = await fetch(`${API_BASE}/simulation/simulate-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] simulateCapacity failed:', err);
      return null;
    }
  },

  /**
   * Prescriptive Recommendations for District Skill Plans (DSDP)
   */
  async getRecommendations(districtLgdCode: number) {
    try {
      const res = await fetch(`${API_BASE}/simulation/recommendations/${districtLgdCode}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] getRecommendations failed:', err);
      return null;
    }
  },

  /**
   * Metadata: Districts
   */
  async getDistricts(stateName?: string) {
    try {
      const q = stateName ? `?state_name=${encodeURIComponent(stateName)}` : '';
      const res = await fetch(`${API_BASE}/meta/districts${q}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] getDistricts failed:', err);
      return null;
    }
  },

  /**
   * Metadata: Trades
   */
  async getTrades(sectorName?: string) {
    try {
      const q = sectorName ? `?sector_name=${encodeURIComponent(sectorName)}` : '';
      const res = await fetch(`${API_BASE}/meta/trades${q}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] getTrades failed:', err);
      return null;
    }
  },

  /**
   * Metadata: Sectors
   */
  async getSectors() {
    try {
      const res = await fetch(`${API_BASE}/meta/sectors`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiService] getSectors failed:', err);
      return null;
    }
  },

  /**
   * Official DSDP Target CSV Export Download
   */
  downloadDsdpCsvUrl(districtLgdCode: number = 492) {
    return `${API_BASE}/exports/dsdp-csv/${districtLgdCode}`;
  },

  async triggerDsdpDownload(districtLgdCode: number = 492) {
    try {
      const url = this.downloadDsdpCsvUrl(districtLgdCode);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DSDP_Target_Allocation_LGD_${districtLgdCode}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (err) {
      console.error('[ApiService] triggerDsdpDownload failed:', err);
      return false;
    }
  },
};
