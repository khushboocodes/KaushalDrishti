const DistrictExplorerModule = {
  currentFilters: {
    state_name: "Uttar Pradesh",
    district_lgd_code: 158, // Kanpur Nagar default
    sector_name: "",
    flag_code: "",
    horizon: "12M"
  },
  cachedRecords: [],

  async init(containerId, initialParams = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (initialParams.state_name) {
      this.currentFilters.state_name = initialParams.state_name;
      // Default district per state
      if (initialParams.state_name === "Maharashtra") this.currentFilters.district_lgd_code = 492; // Pune
      else if (initialParams.state_name === "Odisha") this.currentFilters.district_lgd_code = 365; // Khordha
      else this.currentFilters.district_lgd_code = 158; // Kanpur
    }

    container.innerHTML = `
      <!-- Filter Bar -->
      <div class="filter-strip">
        <div class="filter-group">
          <label class="filter-label">State</label>
          <select id="selState" class="form-select">
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Odisha">Odisha</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">District (LGD Master)</label>
          <select id="selDistrict" class="form-select">
            <option value="158">Kanpur Nagar (LGD 158)</option>
            <option value="160">Lucknow (LGD 160)</option>
            <option value="184">Varanasi (LGD 184)</option>
            <option value="148">Gautam Buddha Nagar / Noida (LGD 148)</option>
            <option value="180">Sonbhadra (LGD 180 - Sparse)</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Sector</label>
          <select id="selSector" class="form-select">
            <option value="">All Sectors</option>
            <option value="Green Energy & Solar PV">Green Energy & Solar PV</option>
            <option value="Automotive & EV Diagnostics">Automotive & EV Diagnostics</option>
            <option value="Healthcare & Allied Care">Healthcare & Allied Care</option>
            <option value="IT-ITeS & Digital Services">IT-ITeS & Digital Services</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Risk Tier</label>
          <select id="selRisk" class="form-select">
            <option value="">All Risk Tiers</option>
            <option value="CRITICAL_SHORTAGE_RISK">Critical Shortage</option>
            <option value="EMERGING_SHORTAGE">Emerging Shortage</option>
            <option value="BALANCED_EQUILIBRIUM">Balanced</option>
            <option value="MODERATE_SATURATION">Moderate Saturation</option>
            <option value="SEVERE_OVERSUPPLY_RISK">Severe Oversupply</option>
          </select>
        </div>

        <div class="filter-group search-group">
          <label class="filter-label">Search Trade / NCO</label>
          <input type="text" id="inpSearch" class="form-input" placeholder="Search trade or code..." />
        </div>
      </div>

      <!-- District Context Header -->
      <div class="district-hero" id="districtHero">
        <div class="d-hero-left">
          <div class="d-breadcrumbs">
            <span id="heroState">Uttar Pradesh</span> > <strong id="heroDistrict">Kanpur Nagar</strong>
            <span class="badge badge-lgd">LGD Code: <span id="heroLgd">158</span></span>
          </div>
          <h2 class="d-hero-title" id="heroTitle">Kanpur Nagar Industrial District Intelligence</h2>
          <div class="cluster-tags" id="heroClusters">
            <span class="tag">Solar Rooftop Subsidy Zone</span>
            <span class="tag">Leather & Heavy Machinery</span>
            <span class="tag">Defense Corridor Node</span>
          </div>
        </div>
        <div class="d-hero-actions">
          <button class="btn btn-secondary" id="btnExportDsdp">
            <svg class="icon-btn" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Export DSDP Target CSV
          </button>
        </div>
      </div>

      <!-- Dual Funnel Showcase for Top Highlighted Trade -->
      <div class="panel mb-4" id="dualFunnelPanel">
        <div class="panel-header">
          <h3 class="panel-title" id="funnelTradeTitle">Pipeline Yield vs Industry Demand Pull: Solar PV Technician</h3>
          <span class="badge badge-critical" id="funnelBadge">Critical Shortage (+2,415)</span>
        </div>
        <div id="dualFunnelContainer"></div>
      </div>

      <!-- Diagnostic Matrix Table of All Trades in District -->
      <div class="panel table-panel">
        <div class="panel-header">
          <div>
            <h3 class="panel-title">Trade-by-Trade Diagnostic Matrix</h3>
            <p class="panel-subtitle">Comprehensive evaluation of labor tension, effective supply pipeline, and early-warning flags</p>
          </div>
          <div class="table-counter">Showing <span id="tableCount">0</span> Trades</div>
        </div>
        <div class="table-responsive">
          <table class="data-table" id="districtTable">
            <thead>
              <tr>
                <th data-i18n="table_trade">Trade / Occupation</th>
                <th>Sector</th>
                <th data-i18n="table_demand">12M Demand</th>
                <th data-i18n="table_supply">12M Available Supply</th>
                <th data-i18n="table_gap">Net Gap</th>
                <th data-i18n="table_tension">Tension</th>
                <th data-i18n="table_status">Risk Status</th>
                <th data-i18n="table_action">Actions</th>
              </tr>
            </thead>
            <tbody id="districtTableBody">
              <tr><td colspan="8" class="text-center py-4">Loading district records...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents();
    await this.populateDistricts();
    await this.loadDistrictData();
  },

  bindEvents() {
    const selState = document.getElementById("selState");
    const selDistrict = document.getElementById("selDistrict");
    const selSector = document.getElementById("selSector");
    const selRisk = document.getElementById("selRisk");
    const inpSearch = document.getElementById("inpSearch");
    const btnExportDsdp = document.getElementById("btnExportDsdp");

    selState.addEventListener("change", async (e) => {
      this.currentFilters.state_name = e.target.value;
      await this.populateDistricts();
      await this.loadDistrictData();
    });

    selDistrict.addEventListener("change", async (e) => {
      this.currentFilters.district_lgd_code = parseInt(e.target.value, 10);
      await this.loadDistrictData();
    });

    selSector.addEventListener("change", (e) => {
      this.currentFilters.sector_name = e.target.value;
      this.filterAndRenderTable();
    });

    selRisk.addEventListener("change", (e) => {
      this.currentFilters.flag_code = e.target.value;
      this.filterAndRenderTable();
    });

    inpSearch.addEventListener("input", () => {
      this.filterAndRenderTable();
    });

    btnExportDsdp.addEventListener("click", () => {
      window.location.href = `/api/v1/exports/dsdp-csv/${this.currentFilters.district_lgd_code}`;
    });
  },

  async populateDistricts() {
    const selDistrict = document.getElementById("selDistrict");
    const res = await API.getDistricts(this.currentFilters.state_name);
    const districts = res.districts || [];
    
    selDistrict.innerHTML = districts.map(d => `
      <option value="${d.district_lgd_code}">${d.district_name} (LGD ${d.district_lgd_code})</option>
    `).join("");

    if (districts.length > 0) {
      // Pick first or retain current if present
      const exists = districts.find(d => d.district_lgd_code === this.currentFilters.district_lgd_code);
      if (exists) {
        selDistrict.value = this.currentFilters.district_lgd_code;
      } else {
        this.currentFilters.district_lgd_code = districts[0].district_lgd_code;
        selDistrict.value = districts[0].district_lgd_code;
      }
    }
  },

  async loadDistrictData() {
    try {
      const res = await API.getForecasts({
        district_lgd_code: this.currentFilters.district_lgd_code,
        horizon: this.currentFilters.horizon
      });
      this.cachedRecords = res.records || [];

      // Update Hero Header
      if (this.cachedRecords.length > 0) {
        const first = this.cachedRecords[0];
        document.getElementById("heroState").textContent = first.state_name;
        document.getElementById("heroDistrict").textContent = first.district_name;
        document.getElementById("heroLgd").textContent = first.district_lgd_code;
        document.getElementById("heroTitle").textContent = `${first.district_name} (${first.state_name}) Labour Market Intelligence`;
      }

      // Render Table
      this.filterAndRenderTable();

      // Render Dual Funnel for top shortage or first record
      if (this.cachedRecords.length > 0) {
        const topShortage = this.cachedRecords.find(r => r.gap_analysis["12M"].absolute_gap > 0) || this.cachedRecords[0];
        this.renderHighlightedFunnel(topShortage);
      }
    } catch (err) {
      console.error("Failed to load district data:", err);
    }
  },

  renderHighlightedFunnel(record) {
    document.getElementById("funnelTradeTitle").textContent = `Pipeline Yield vs Industry Demand: ${record.trade_name} (${record.sector_name})`;
    const gap = record.gap_analysis["12M"].absolute_gap;
    const badge = document.getElementById("funnelBadge");
    badge.textContent = gap > 0 ? `Critical Shortage (+${gap.toLocaleString()})` : `Oversupply (${gap.toLocaleString()})`;
    badge.className = gap > 0 ? "badge badge-critical" : "badge badge-oversupply";

    ChartHelper.renderDualFunnel("dualFunnelContainer", record.demand, record.supply);
  },

  filterAndRenderTable() {
    const search = (document.getElementById("inpSearch").value || "").toLowerCase().trim();
    const sector = this.currentFilters.sector_name;
    const risk = this.currentFilters.flag_code;

    let filtered = this.cachedRecords.filter(r => {
      if (sector && r.sector_name !== sector) return false;
      if (risk && r.gap_analysis.early_warning.flag_code !== risk) return false;
      if (search) {
        const matchTitle = r.trade_name.toLowerCase().includes(search);
        const matchCode = r.nco_code.toLowerCase().includes(search);
        if (!matchTitle && !matchCode) return false;
      }
      return true;
    });

    document.getElementById("tableCount").textContent = filtered.length;
    const tbody = document.getElementById("districtTableBody");

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No trades match the selected filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const gap = r.gap_analysis["12M"].absolute_gap;
      const tension = r.gap_analysis["12M"].tension_ratio;
      const warning = r.gap_analysis.early_warning;
      const gapClass = gap > 0 ? "text-red font-bold" : (gap < -50 ? "text-purple font-bold" : "text-green");

      return `
        <tr>
          <td>
            <div class="table-trade-name">${r.trade_name}</div>
            <div class="table-trade-code">NCO: ${r.nco_code} • NSQF L${r.nco_code.startsWith('7') ? 4 : (r.nco_code.startsWith('3') ? 5 : 3)}</div>
          </td>
          <td><span class="sector-tag">${r.sector_name}</span></td>
          <td class="font-medium">${r.demand.forecast_12m.toLocaleString()}</td>
          <td class="font-medium">${r.supply.effective_supply_12m.toLocaleString()}</td>
          <td class="${gapClass}">${gap > 0 ? '+' : ''}${gap.toLocaleString()}</td>
          <td><span class="tension-pill">${tension}x</span></td>
          <td>
            <span class="status-badge" style="background: ${warning.badge_color}22; color: ${warning.badge_color}; border: 1px solid ${warning.badge_color}44;">
              ${warning.label}
            </span>
          </td>
          <td>
            <div class="action-btn-group">
              <button class="btn-sm btn-outline" onclick="window.DistrictExplorerModule.openDeepDive(${r.district_lgd_code}, '${r.nco_code}')" title="Inspect Forecast History">
                Deep Dive
              </button>
              <button class="btn-sm btn-primary" onclick="window.DistrictExplorerModule.openSimulator(${r.district_lgd_code}, '${r.nco_code}')" title="Simulate Batch Addition">
                Simulate
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  openDeepDive(dCode, ncoCode) {
    window.app.switchView("trade-deep-dive", { district_lgd_code: dCode, nco_code: ncoCode });
  },

  openSimulator(dCode, ncoCode) {
    window.app.switchView("simulator", { district_lgd_code: dCode, nco_code: ncoCode });
  }
};

window.DistrictExplorerModule = DistrictExplorerModule;
