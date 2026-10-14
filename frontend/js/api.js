const API = {
  baseUrl: "/api/v1",

  async getNationalSummary(horizon = "12M") {
    const res = await fetch(`${this.baseUrl}/intelligence/national-summary?horizon=${horizon}`);
    if (!res.ok) throw new Error("Failed to load national summary");
    return await res.json();
  },

  async getForecasts({ state_name, district_lgd_code, sector_name, flag_code, horizon = "12M" } = {}) {
    const params = new URLSearchParams({ horizon });
    if (state_name) params.append("state_name", state_name);
    if (district_lgd_code) params.append("district_lgd_code", district_lgd_code);
    if (sector_name) params.append("sector_name", sector_name);
    if (flag_code) params.append("flag_code", flag_code);

    const res = await fetch(`${this.baseUrl}/intelligence/forecasts?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch forecasts");
    return await res.json();
  },

  async getTradeDetail(districtLgdCode, ncoCode) {
    const res = await fetch(`${this.baseUrl}/intelligence/trade-detail/${districtLgdCode}/${ncoCode}`);
    if (!res.ok) throw new Error("Failed to load trade detail");
    return await res.json();
  },

  async simulateGap({ district_lgd_code, nco_code, seat_capacity_delta, assumed_enrollment_rate, assumed_dropout_rate, assumed_retention_rate, horizon = "12M" }) {
    const res = await fetch(`${this.baseUrl}/simulation/simulate-gap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        district_lgd_code,
        nco_code,
        seat_capacity_delta,
        assumed_enrollment_rate,
        assumed_dropout_rate,
        assumed_retention_rate,
        horizon
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Simulation failed");
    }
    return await res.json();
  },

  async getDistrictRecommendations(districtLgdCode) {
    const res = await fetch(`${this.baseUrl}/simulation/recommendations/${districtLgdCode}`);
    if (!res.ok) throw new Error("Failed to load recommendations");
    return await res.json();
  },

  async getDistricts(stateName) {
    const url = stateName 
      ? `${this.baseUrl}/meta/districts?state_name=${encodeURIComponent(stateName)}`
      : `${this.baseUrl}/meta/districts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch districts");
    return await res.json();
  },

  async getSectors() {
    const res = await fetch(`${this.baseUrl}/meta/sectors`);
    if (!res.ok) throw new Error("Failed to fetch sectors");
    return await res.json();
  }
};

window.API = API;
