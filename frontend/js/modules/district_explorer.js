/**
 * Geographic View Module — "India - District Level Labour Demand-Supply"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout.
 */

const DistrictExplorerModule = {
  currentState: "Maharashtra",
  currentDistrict: "Pune",
  currentMetric: "demand",
  currentViewMode: "map",

  districtData: {
    "Maharashtra": {
      "Pune": {
        demand: "48,200",
        demandGrowth: "+22%",
        supply: "32,500",
        supplyGrowth: "+10%",
        gap: "+15,700",
        gapType: "Undersupply",
        topTrades: [
          { name: "Software Developer", count: "8,200" },
          { name: "CNC Operator", count: "3,400" },
          { name: "Electrician", count: "2,800" },
          { name: "Retail Sales Associate", count: "2,600" },
          { name: "AC Technician", count: "2,100" }
        ]
      },
      "Mumbai": {
        demand: "56,400",
        demandGrowth: "+18%",
        supply: "44,100",
        supplyGrowth: "+12%",
        gap: "+12,300",
        gapType: "Undersupply",
        topTrades: [
          { name: "Data Analyst", count: "9,400" },
          { name: "Retail Sales Associate", count: "4,600" },
          { name: "Hospitality Associate", count: "3,800" },
          { name: "EV Diagnostic Tech", count: "2,900" },
          { name: "Logistics Coordinator", count: "2,400" }
        ]
      },
      "Nagpur": {
        demand: "24,800",
        demandGrowth: "+14%",
        supply: "21,200",
        supplyGrowth: "+9%",
        gap: "+3,600",
        gapType: "Undersupply",
        topTrades: [
          { name: "Solar PV Technician", count: "4,100" },
          { name: "Electrician", count: "2,600" },
          { name: "Automotive Fitter", count: "2,100" },
          { name: "General Duty Assistant", count: "1,800" },
          { name: "Welder / Fabricator", count: "1,400" }
        ]
      }
    },
    "Uttar Pradesh": {
      "Kanpur Nagar": {
        demand: "38,400",
        demandGrowth: "+26%",
        supply: "24,100",
        supplyGrowth: "+14%",
        gap: "+14,300",
        gapType: "Undersupply",
        topTrades: [
          { name: "Solar PV Installation Tech", count: "6,800" },
          { name: "Industrial Electrician", count: "3,900" },
          { name: "CNC Machining Tech", count: "3,100" },
          { name: "General Duty Nursing Assistant", count: "2,400" },
          { name: "Leather & Footwear Tech", count: "1,900" }
        ]
      },
      "Lucknow": {
        demand: "42,100",
        demandGrowth: "+20%",
        supply: "35,600",
        supplyGrowth: "+11%",
        gap: "+6,500",
        gapType: "Undersupply",
        topTrades: [
          { name: "Software Developer", count: "7,200" },
          { name: "Solar Micro-grid Specialist", count: "3,800" },
          { name: "Allied Health Assistant", count: "3,100" },
          { name: "EV Two-Wheeler Tech", count: "2,500" },
          { name: "Telecommunication Tech", count: "1,800" }
        ]
      },
      "Varanasi": {
        demand: "28,200",
        demandGrowth: "+19%",
        supply: "22,400",
        supplyGrowth: "+8%",
        gap: "+5,800",
        gapType: "Undersupply",
        topTrades: [
          { name: "Textile Handloom Master", count: "4,900" },
          { name: "Solar Water Pump Tech", count: "3,200" },
          { name: "Geriatric Care Aide", count: "2,400" },
          { name: "Electrician", count: "2,100" },
          { name: "Hospitality Executive", count: "1,700" }
        ]
      }
    },
    "Odisha": {
      "Khordha / Bhubaneswar": {
        demand: "32,600",
        demandGrowth: "+21%",
        supply: "24,800",
        supplyGrowth: "+11%",
        gap: "+7,800",
        gapType: "Undersupply",
        topTrades: [
          { name: "IT Data Engineer", count: "5,400" },
          { name: "Solar Plant Installer", count: "3,600" },
          { name: "Mining Equipment Tech", count: "2,900" },
          { name: "General Duty Assistant", count: "2,200" },
          { name: "Industrial Fitter", count: "1,800" }
        ]
      }
    }
  },

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-wrap">
          <h2 data-i18n="geo_title">India - District Level Labour Demand-Supply</h2>
          <p data-i18n="geo_subtitle">Explore demand, supply and gap across States and Districts</p>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="filter-toolbar-row">
        <div class="filter-group">
          <label data-i18n="filter_state">Select State</label>
          <select id="geoSelectState" class="filter-select">
            <option value="Maharashtra" selected>Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Odisha">Odisha</option>
          </select>
        </div>

        <div class="filter-group">
          <label data-i18n="filter_district">Select District</label>
          <select id="geoSelectDistrict" class="filter-select">
            <option value="Pune" selected>Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nagpur">Nagpur</option>
          </select>
        </div>

        <div class="filter-group">
          <label data-i18n="filter_sector">Select Sector</label>
          <select id="geoSelectSector" class="filter-select">
            <option value="all" selected>All Sectors</option>
            <option value="green">Green Jobs / Solar PV</option>
            <option value="auto">Automotive & EV</option>
            <option value="health">Healthcare & Allied</option>
            <option value="it">IT-ITeS & Digital</option>
          </select>
        </div>

        <!-- View Mode: Map / Table -->
        <div class="view-mode-toggle">
          <button class="view-mode-btn active" id="btnViewMap" data-i18n="view_map">Map</button>
          <button class="view-mode-btn" id="btnViewTable" data-i18n="view_table">Table</button>
        </div>
      </div>

      <!-- Main Two-Column Layout (Map & Detail Panel) -->
      <div class="geo-view-grid" id="geoMainGrid">
        <!-- Left: Map Container -->
        <div class="map-container-card">
          <!-- Floating Metric Switcher Pills -->
          <div class="map-floating-metrics">
            <button class="map-metric-pill active" data-metric="demand" data-i18n="map_pill_demand">Job Demand</button>
            <button class="map-metric-pill" data-metric="supply" data-i18n="map_pill_supply">Trained Candidates</button>
            <button class="map-metric-pill" data-metric="gap" data-i18n="map_pill_gap">Demand-Supply Gap</button>
            <button class="map-metric-pill" data-metric="growth" data-i18n="map_pill_growth">Growth Rate</button>
          </div>

          <!-- Map Visual SVG -->
          <div class="map-svg-wrap" id="stateMapSvgWrap">
            ${this.renderStateMapSvg("Maharashtra", "Pune")}
          </div>

          <!-- Zoom Controls -->
          <div class="map-zoom-controls">
            <button class="zoom-btn" title="Zoom in">+</button>
            <button class="zoom-btn" title="Zoom out">-</button>
          </div>

          <!-- Floating Legend (Bottom Right) -->
          <div class="map-legend-card">
            <div class="map-legend-title" data-i18n="legend_gap_title">Demand-Supply Gap</div>
            <div class="map-legend-list">
              <div class="map-legend-row"><div class="legend-box" style="background:#DC2626;"></div><span data-i18n="legend_high_under">High Undersupply</span></div>
              <div class="map-legend-row"><div class="legend-box" style="background:#F97316;"></div><span data-i18n="legend_mod_under">Moderate Undersupply</span></div>
              <div class="map-legend-row"><div class="legend-box" style="background:#10B981;"></div><span data-i18n="legend_balanced">Balanced</span></div>
              <div class="map-legend-row"><div class="legend-box" style="background:#A3E635;"></div><span data-i18n="legend_mod_over">Moderate Oversupply</span></div>
              <div class="map-legend-row"><div class="legend-box" style="background:#C084FC;"></div><span data-i18n="legend_high_over">High Oversupply</span></div>
            </div>
          </div>
        </div>

        <!-- Right: District Detail Card -->
        <div class="district-detail-card" id="districtDetailCard">
          ${this.renderDetailCardContent("Maharashtra", "Pune")}
        </div>
      </div>

      <!-- Alternate Table View Container -->
      <div id="geoTableWrap" style="display:none;" class="card-panel">
        <h3 class="card-title" style="margin-bottom:14px;" data-i18n="table_diagnostic_matrix">District Labour Diagnostic Matrix</h3>
        <table class="growth-table-wrap">
          <thead>
            <tr>
              <th>District</th>
              <th>State</th>
              <th>Job Demand</th>
              <th>Trained Supply</th>
              <th>Net Gap</th>
              <th>Status</th>
              <th>Top Trade Demand</th>
            </tr>
          </thead>
          <tbody id="geoTableBody">
            ${this.renderMatrixRows()}
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents();
  },

  renderStateMapSvg(state, selectedDist) {
    // High-fidelity district cluster SVG for Maharashtra & UP
    return `
      <svg viewBox="0 0 460 380" width="100%" height="340" style="max-height:360px;">
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
          </filter>
        </defs>

        <!-- District Polygons (Maharashtra stylized cluster) -->
        <g id="stateDistrictsGroup" filter="url(#shadow)">
          <!-- Pune (Highlighted Red/Undersupply) -->
          <path id="dist_pune" d="M 175 165 L 215 155 L 245 185 L 230 225 L 180 230 L 160 190 Z" 
                fill="${selectedDist === 'Pune' ? '#EF4444' : '#F87171'}" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer; transition:all 0.2s;">
            <title>Pune District: High Undersupply (+15,700)</title>
          </path>
          <text x="195" y="195" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Pune</text>

          <!-- Mumbai / Thane -->
          <path id="dist_mumbai" d="M 125 150 L 160 145 L 175 165 L 160 190 L 120 180 Z" 
                fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Mumbai: Undersupply</title>
          </path>
          <text x="142" y="170" font-size="9" font-weight="600" fill="#FFFFFF" text-anchor="middle">Mumbai</text>

          <!-- Nashik -->
          <path d="M 145 110 L 195 95 L 215 135 L 160 145 L 135 125 Z" 
                fill="#34D399" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Nashik: Balanced</title>
          </path>
          <text x="175" y="125" font-size="10" font-weight="600" fill="#FFFFFF" text-anchor="middle">Nashik</text>

          <!-- Aurangabad / Chhatrapati Sambhajinagar -->
          <path d="M 215 135 L 275 120 L 290 160 L 245 185 L 215 155 Z" 
                fill="#FBBF24" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Chhatrapati Sambhajinagar</title>
          </path>
          <text x="250" y="155" font-size="9" font-weight="600" fill="#1E293B" text-anchor="middle">Sambhajinagar</text>

          <!-- Ahmednagar -->
          <path d="M 195 95 L 255 85 L 275 120 L 215 135 Z" 
                fill="#A3E635" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Ahmednagar: Moderate Oversupply</title>
          </path>

          <!-- Satara & Kolhapur -->
          <path d="M 160 190 L 180 230 L 190 280 L 140 260 L 135 210 Z" 
                fill="#60A5FA" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Satara: Balanced</title>
          </path>
          <text x="160" y="240" font-size="9" font-weight="600" fill="#FFFFFF" text-anchor="middle">Satara</text>

          <!-- Solapur -->
          <path d="M 230 225 L 280 215 L 300 270 L 240 280 L 190 280 L 180 230 Z" 
                fill="#F87171" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Solapur: Undersupply</title>
          </path>
          <text x="245" y="255" font-size="9" font-weight="600" fill="#FFFFFF" text-anchor="middle">Solapur</text>

          <!-- Nagpur & Vidarbha East -->
          <path d="M 330 90 L 400 80 L 420 130 L 350 145 L 310 115 Z" 
                fill="#F472B6" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Nagpur: High Demand</title>
          </path>
          <text x="365" y="115" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">Nagpur</text>

          <!-- Amravati -->
          <path d="M 275 120 L 330 90 L 350 145 L 300 165 Z" 
                fill="#818CF8" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Amravati</title>
          </path>

          <!-- Nanded & Marathwada -->
          <path d="M 290 160 L 350 145 L 370 205 L 310 220 Z" 
                fill="#FBBF24" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Nanded</title>
          </path>
          <text x="330" y="185" font-size="9" font-weight="600" fill="#1E293B" text-anchor="middle">Nanded</text>

          <!-- Latur -->
          <path d="M 280 215 L 310 220 L 330 260 L 285 270 Z" 
                fill="#34D399" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Latur</title>
          </path>

          <!-- Konkan South -->
          <path d="M 140 260 L 190 280 L 180 340 L 130 320 Z" 
                fill="#4ADE80" stroke="#FFFFFF" stroke-width="2" style="cursor:pointer;">
            <title>Ratnagiri / Sindhudurg</title>
          </path>
          <text x="155" y="300" font-size="9" font-weight="600" fill="#FFFFFF" text-anchor="middle">Konkan</text>
        </g>
      </svg>
    `;
  },

  renderDetailCardContent(state, district) {
    const stateGroup = this.districtData[state] || this.districtData["Maharashtra"];
    const d = stateGroup[district] || Object.values(stateGroup)[0];

    const rows = d.topTrades.map((t, idx) => `
      <tr>
        <td>${idx + 1}. ${t.name}</td>
        <td>${t.count}</td>
      </tr>
    `).join("");

    return `
      <div class="district-detail-header">
        <h3 id="detailDistTitle">${district} District</h3>
        <p id="detailStateSub">${state}</p>
      </div>

      <!-- Quick KPI Split -->
      <div class="district-stat-row">
        <div class="district-stat-box">
          <div class="stat-label-small" data-i18n="stat_job_demand">Job Demand</div>
          <div class="stat-val-med">
            ${d.demand}
            <span class="badge-growth badge-growth-green">${d.demandGrowth}</span>
          </div>
        </div>
        <div class="district-stat-box">
          <div class="stat-label-small" data-i18n="stat_trained_candidates">Trained Candidates</div>
          <div class="stat-val-med">
            ${d.supply}
            <span class="badge-growth badge-growth-green">${d.supplyGrowth}</span>
          </div>
        </div>
      </div>

      <!-- Demand-Supply Gap Box -->
      <div class="district-gap-box">
        <div class="gap-box-label" data-i18n="kpi_demand_supply_gap">Demand-Supply Gap</div>
        <div class="gap-box-val">${d.gap} <span style="font-size:14px; font-weight:600;">${d.gapType}</span></div>
      </div>

      <!-- Top 5 High-Demand Trades -->
      <div class="trades-list-header" data-i18n="top_5_trades_title">Top 5 High-Demand Trades</div>
      <table class="top-trades-table">
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  },

  renderMatrixRows() {
    return `
      <tr>
        <td><strong>Pune</strong></td>
        <td>Maharashtra</td>
        <td>48,200</td>
        <td>32,500</td>
        <td style="color:#DC2626; font-weight:700;">+15,700</td>
        <td><span class="badge-growth badge-growth-green" style="background:#FEF2F2; color:#DC2626;">Undersupply</span></td>
        <td>Software Developer (8,200)</td>
      </tr>
      <tr>
        <td><strong>Kanpur Nagar</strong></td>
        <td>Uttar Pradesh</td>
        <td>38,400</td>
        <td>24,100</td>
        <td style="color:#DC2626; font-weight:700;">+14,300</td>
        <td><span class="badge-growth badge-growth-green" style="background:#FEF2F2; color:#DC2626;">Undersupply</span></td>
        <td>Solar PV Technician (6,800)</td>
      </tr>
      <tr>
        <td><strong>Mumbai</strong></td>
        <td>Maharashtra</td>
        <td>56,400</td>
        <td>44,100</td>
        <td style="color:#DC2626; font-weight:700;">+12,300</td>
        <td><span class="badge-growth badge-growth-green" style="background:#FEF2F2; color:#DC2626;">Undersupply</span></td>
        <td>Data Analyst (9,400)</td>
      </tr>
      <tr>
        <td><strong>Khordha / Bhubaneswar</strong></td>
        <td>Odisha</td>
        <td>32,600</td>
        <td>24,800</td>
        <td style="color:#DC2626; font-weight:700;">+7,800</td>
        <td><span class="badge-growth badge-growth-green" style="background:#FEF2F2; color:#DC2626;">Undersupply</span></td>
        <td>IT Data Engineer (5,400)</td>
      </tr>
      <tr>
        <td><strong>Lucknow</strong></td>
        <td>Uttar Pradesh</td>
        <td>42,100</td>
        <td>35,600</td>
        <td style="color:#DC2626; font-weight:700;">+6,500</td>
        <td><span class="badge-growth badge-growth-green" style="background:#FEF2F2; color:#DC2626;">Undersupply</span></td>
        <td>Software Developer (7,200)</td>
      </tr>
    `;
  },

  bindEvents() {
    const stateSel = document.getElementById("geoSelectState");
    const distSel = document.getElementById("geoSelectDistrict");
    const btnMap = document.getElementById("btnViewMap");
    const btnTable = document.getElementById("btnViewTable");
    const mapGrid = document.getElementById("geoMainGrid");
    const tableWrap = document.getElementById("geoTableWrap");

    // State change updates district dropdown
    if (stateSel) {
      stateSel.addEventListener("change", (e) => {
        const state = e.target.value;
        this.currentState = state;
        const dists = Object.keys(this.districtData[state] || {});
        distSel.innerHTML = dists.map(d => `<option value="${d}">${d}</option>`).join("");
        this.currentDistrict = dists[0] || "";
        this.updateView();
      });
    }

    // District change updates detail card
    if (distSel) {
      distSel.addEventListener("change", (e) => {
        this.currentDistrict = e.target.value;
        this.updateView();
      });
    }

    // View mode Map vs Table
    if (btnMap && btnTable) {
      btnMap.addEventListener("click", () => {
        btnMap.classList.add("active");
        btnTable.classList.remove("active");
        mapGrid.style.display = "grid";
        tableWrap.style.display = "none";
      });
      btnTable.addEventListener("click", () => {
        btnTable.classList.add("active");
        btnMap.classList.remove("active");
        mapGrid.style.display = "none";
        tableWrap.style.display = "block";
      });
    }

    // Metric switcher pills
    const metricPills = document.querySelectorAll(".map-metric-pill");
    metricPills.forEach(pill => {
      pill.addEventListener("click", () => {
        metricPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
      });
    });

    // Interactive map polygon click
    const punePath = document.getElementById("dist_pune");
    const mumbaiPath = document.getElementById("dist_mumbai");
    if (punePath) {
      punePath.addEventListener("click", () => {
        distSel.value = "Pune";
        this.currentDistrict = "Pune";
        this.updateView();
      });
    }
    if (mumbaiPath) {
      mumbaiPath.addEventListener("click", () => {
        distSel.value = "Mumbai";
        this.currentDistrict = "Mumbai";
        this.updateView();
      });
    }
  },

  updateView() {
    const detailCard = document.getElementById("districtDetailCard");
    if (detailCard) {
      detailCard.innerHTML = this.renderDetailCardContent(this.currentState, this.currentDistrict);
    }
    const mapWrap = document.getElementById("stateMapSvgWrap");
    if (mapWrap) {
      mapWrap.innerHTML = this.renderStateMapSvg(this.currentState, this.currentDistrict);
    }
  }
};

window.DistrictExplorerModule = DistrictExplorerModule;
