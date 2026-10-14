const CommandCenterModule = {
  mapInstance: null,

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Top Macro KPI Strip -->
      <div class="kpi-strip">
        <div class="kpi-card" id="kpiDemandCard">
          <div class="kpi-icon-wrap bg-blue-subtle">
            <svg class="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-label" data-i18n="kpi_projected_demand">Projected Demand (12M)</div>
            <div class="kpi-value" id="kpiDemand">-</div>
            <div class="kpi-sub" id="kpiDemandSub">Macro Vacancy Pull</div>
          </div>
        </div>

        <div class="kpi-card" id="kpiSupplyCard">
          <div class="kpi-icon-wrap bg-teal-subtle">
            <svg class="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-label" data-i18n="kpi_projected_supply">Projected Pipeline (12M)</div>
            <div class="kpi-value" id="kpiSupply">-</div>
            <div class="kpi-sub" id="kpiSupplySub">Effective Available Workers</div>
          </div>
        </div>

        <div class="kpi-card" id="kpiGapCard">
          <div class="kpi-icon-wrap bg-orange-subtle">
            <svg class="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-label" data-i18n="kpi_net_gap">Net National Gap</div>
            <div class="kpi-value" id="kpiGap">-</div>
            <div class="kpi-sub" id="kpiTension">Tension: -</div>
          </div>
        </div>

        <div class="kpi-card" id="kpiRiskCard">
          <div class="kpi-icon-wrap bg-red-subtle">
            <svg class="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-label" data-i18n="kpi_distress_districts">Distress Trade Pairs</div>
            <div class="kpi-value" id="kpiDistress">-</div>
            <div class="kpi-sub">Critical Shortage / Saturated</div>
          </div>
        </div>
      </div>

      <!-- Main Command Grid: Map on Left, Leaderboards on Right -->
      <div class="command-grid">
        <div class="panel map-panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title" data-i18n="choropleth_title">Geospatial Labor Tension Heatmap of India</h3>
              <p class="panel-subtitle" data-i18n="choropleth_subtitle">Click any pilot state (UP, MH, OD) to drill down into district intelligence</p>
            </div>
            <div class="horizon-toggle-pill">
              <button class="pill-btn active" data-horizon="12M">12M Strategic</button>
              <button class="pill-btn" data-horizon="6M">6M Mid-term</button>
              <button class="pill-btn" data-horizon="3M">3M Tactical</button>
            </div>
          </div>
          <div id="indiaMapContainer" class="map-inner-container"></div>
        </div>

        <div class="panel leaderboards-panel">
          <!-- Top Shortages Card -->
          <div class="leaderboard-section">
            <div class="lb-header text-red">
              <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span data-i18n="top_shortages_title">Top Critical Shortages (Urgent Capacity Add)</span>
            </div>
            <div class="lb-list" id="topShortagesList">
              <div class="loading-spinner">Loading shortages...</div>
            </div>
          </div>

          <!-- Top Oversupply Card -->
          <div class="leaderboard-section">
            <div class="lb-header text-purple">
              <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
              <span data-i18n="top_oversupply_title">Top Severe Oversupply Risks (Downscaling Advised)</span>
            </div>
            <div class="lb-list" id="topOversupplyList">
              <div class="loading-spinner">Loading oversupply risks...</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindPills();
    await this.loadData("12M");
  },

  bindPills() {
    document.querySelectorAll(".horizon-toggle-pill .pill-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".horizon-toggle-pill .pill-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const horizon = e.target.getAttribute("data-horizon");
        this.loadData(horizon);
      });
    });
  },

  async loadData(horizon = "12M") {
    try {
      const data = await API.getNationalSummary(horizon);
      const kpis = data.national_kpis;

      document.getElementById("kpiDemand").textContent = kpis.total_projected_demand.toLocaleString();
      document.getElementById("kpiSupply").textContent = kpis.total_projected_supply.toLocaleString();
      
      const gapEl = document.getElementById("kpiGap");
      gapEl.textContent = kpis.net_national_gap > 0 ? `+${kpis.net_national_gap.toLocaleString()}` : kpis.net_national_gap.toLocaleString();
      gapEl.className = kpis.net_national_gap > 0 ? "kpi-value text-red" : "kpi-value text-purple";

      document.getElementById("kpiTension").textContent = `National Tension: ${kpis.overall_tension_ratio}x`;
      document.getElementById("kpiDistress").textContent = kpis.high_risk_district_trade_count;

      // Render Map
      if (!this.mapInstance) {
        this.mapInstance = new IndiaMapComponent("indiaMapContainer", (selectedState) => {
          window.app.switchView("district-explorer", { state_name: selectedState });
        });
      }
      this.mapInstance.setData(data.state_aggregates);

      // Render Shortages
      const shortList = document.getElementById("topShortagesList");
      shortList.innerHTML = data.top_10_shortages.slice(0, 5).map(item => `
        <div class="lb-item shortage-item">
          <div class="lb-info">
            <div class="lb-title">${item.trade_name}</div>
            <div class="lb-meta">${item.district_name}, ${item.state_name} • ${item.sector_name}</div>
          </div>
          <div class="lb-stats">
            <span class="badge badge-critical">+${item.absolute_gap.toLocaleString()}</span>
            <span class="lb-tension">${item.tension_ratio}x</span>
          </div>
        </div>
      `).join("");

      // Render Oversupply
      const overList = document.getElementById("topOversupplyList");
      overList.innerHTML = data.top_10_oversupply.slice(0, 5).map(item => `
        <div class="lb-item oversupply-item">
          <div class="lb-info">
            <div class="lb-title">${item.trade_name}</div>
            <div class="lb-meta">${item.district_name}, ${item.state_name} • ${item.sector_name}</div>
          </div>
          <div class="lb-stats">
            <span class="badge badge-oversupply">${item.absolute_gap.toLocaleString()}</span>
            <span class="lb-tension">${item.tension_ratio}x</span>
          </div>
        </div>
      `).join("");

      if (window.i18n) window.i18n.applyTranslations();

    } catch (err) {
      console.error("Command Center load failed:", err);
    }
  }
};

window.CommandCenterModule = CommandCenterModule;
