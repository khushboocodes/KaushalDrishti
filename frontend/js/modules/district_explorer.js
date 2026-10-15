/**
 * Geographic View Module — "India – District Level Labour Demand-Supply"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout and warm heritage aesthetic.
 */

const DistrictExplorerModule = {
  currentState: "Maharashtra",
  currentDistrict: "Pune",
  currentMetric: "demand",
  currentViewMode: "map",

  districtData: {
    "Maharashtra": {
      stateOverview: {
        demand: "3.2 Lakh",
        supply: "2.6 Lakh",
        gap: "+60,000",
        status: "Undersupply"
      },
      "Pune": {
        demand: "48,200",
        supply: "32,500",
        gap: "+15,700",
        status: "Undersupply",
        topTrades: [
          { rank: 1, name: "Software Developer", count: "8,200" },
          { rank: 2, name: "CNC Operator", count: "3,400" },
          { rank: 3, name: "Electrician", count: "2,800" },
          { rank: 4, name: "Retail Sales Associate", count: "2,600" },
          { rank: 5, name: "AC Technician", count: "2,100" }
        ]
      },
      "Mumbai": {
        demand: "56,400",
        supply: "44,100",
        gap: "+12,300",
        status: "Undersupply",
        topTrades: [
          { rank: 1, name: "Data Analyst", count: "9,400" },
          { rank: 2, name: "Retail Sales Associate", count: "4,600" },
          { rank: 3, name: "Hospitality Associate", count: "3,800" },
          { rank: 4, name: "EV Diagnostic Tech", count: "2,900" },
          { rank: 5, name: "Logistics Coordinator", count: "2,400" }
        ]
      },
      "Nagpur": {
        demand: "24,800",
        supply: "21,200",
        gap: "+3,600",
        status: "Undersupply",
        topTrades: [
          { rank: 1, name: "Solar PV Technician", count: "4,100" },
          { rank: 2, name: "Electrician", count: "2,600" },
          { rank: 3, name: "Automotive Fitter", count: "2,100" },
          { rank: 4, name: "General Duty Assistant", count: "1,800" },
          { rank: 5, name: "Welder / Fabricator", count: "1,400" }
        ]
      }
    },
    "Uttar Pradesh": {
      stateOverview: {
        demand: "5.4 Lakh",
        supply: "4.1 Lakh",
        gap: "+1.3 Lakh",
        status: "Undersupply"
      },
      "Kanpur Nagar": {
        demand: "38,400",
        supply: "24,100",
        gap: "+14,300",
        status: "Undersupply",
        topTrades: [
          { rank: 1, name: "Solar PV Installation Tech", count: "6,800" },
          { rank: 2, name: "Industrial Electrician", count: "3,900" },
          { rank: 3, name: "CNC Machining Tech", count: "3,100" },
          { rank: 4, name: "General Duty Nursing Assistant", count: "2,400" },
          { rank: 5, name: "Leather & Footwear Tech", count: "1,900" }
        ]
      },
      "Lucknow": {
        demand: "42,100",
        supply: "35,600",
        gap: "+6,500",
        status: "Undersupply",
        topTrades: [
          { rank: 1, name: "Software Developer", count: "7,200" },
          { rank: 2, name: "Solar Micro-grid Specialist", count: "3,800" },
          { rank: 3, name: "Allied Health Assistant", count: "3,100" },
          { rank: 4, name: "EV Two-Wheeler Tech", count: "2,500" },
          { rank: 5, name: "Telecommunication Tech", count: "1,800" }
        ]
      }
    }
  },

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-title-wrap" style="margin-bottom: 16px;">
        <h2 data-i18n="geo_title" style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-main);">India – District Level Labour Demand-Supply</h2>
        <p data-i18n="geo_subtitle" style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">Explore demand, supply and gaps across States and Districts</p>
      </div>

      <!-- Filter Toolbar Row -->
      <div class="filter-toolbar-row">
        <div class="filter-group">
          <label data-i18n="filter_state">State</label>
          <select id="geoSelectState" class="filter-select">
            <option value="Maharashtra" selected>Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>

        <div class="filter-group">
          <label data-i18n="filter_district">District</label>
          <select id="geoSelectDistrict" class="filter-select">
            <option value="Pune" selected>Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nagpur">Nagpur</option>
          </select>
        </div>

        <div class="filter-group">
          <label data-i18n="filter_sector">Sector</label>
          <select id="geoSelectSector" class="filter-select">
            <option value="all" selected>All Sectors</option>
            <option value="green">Green Jobs</option>
            <option value="it">IT/ITeS</option>
            <option value="auto">Manufacturing & EV</option>
            <option value="health">Healthcare</option>
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
        <!-- Left: India Map Container -->
        <div class="map-container-card">
          <!-- India Map Visual SVG with Pune Callout -->
          <div class="map-svg-wrap" id="stateMapSvgWrap">
            ${this.renderIndiaMapSvg()}
          </div>

          <!-- Zoom Controls -->
          <div class="map-zoom-controls">
            <button class="zoom-btn" title="Zoom in">+</button>
            <button class="zoom-btn" title="Zoom out">-</button>
          </div>

          <!-- Horizontal Legend at Bottom -->
          <div class="map-legend-horizontal">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:var(--color-terracotta);"></span>
              <span>High Undersupply</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:var(--color-saffron);"></span>
              <span>Moderate</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:var(--color-sage); border:1px solid #C2D5BF;"></span>
              <span>Balanced</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:var(--color-primary-accent);"></span>
              <span>High Oversupply</span>
            </div>
          </div>
        </div>

        <!-- Right: State Overview + High-Demand Trades Breakdown -->
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

  renderIndiaMapSvg() {
    return `
      <div style="position:relative; width:100%; height:100%; min-height:430px; display:flex; align-items:center; justify-content:center;">
        <svg viewBox="0 0 520 460" width="100%" height="420" style="max-width:520px; overflow:visible;">
          <defs>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08"/>
            </filter>
          </defs>

          <!-- Stylized Multi-state Map of India -->
          <g filter="url(#softGlow)" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round">
            <!-- J&K / Ladakh -->
            <path d="M 175 40 L 210 25 L 245 45 L 255 80 L 225 100 L 180 85 Z" fill="#FDE047" opacity="0.85"/>
            <!-- Himachal & Punjab -->
            <path d="M 160 85 L 185 85 L 200 115 L 165 125 Z" fill="#BBF7D0" opacity="0.9"/>
            <!-- Rajasthan -->
            <path d="M 120 135 L 175 125 L 185 185 L 130 195 L 105 160 Z" fill="#FED7AA" opacity="0.9"/>
            <!-- Uttar Pradesh -->
            <path d="M 185 125 L 265 120 L 295 155 L 230 185 L 185 175 Z" fill="#FCA5A5" opacity="0.85"/>
            <!-- Gujarat -->
            <path d="M 95 195 L 140 190 L 155 240 L 115 255 L 75 220 Z" fill="#FEF08A" opacity="0.9"/>
            <!-- Madhya Pradesh -->
            <path d="M 160 190 L 255 185 L 270 235 L 175 245 Z" fill="#FED7AA" opacity="0.9"/>
            <!-- Bihar & Jharkhand -->
            <path d="M 270 145 L 340 145 L 350 205 L 295 210 Z" fill="#FCA5A5" opacity="0.85"/>
            <!-- West Bengal & Northeast -->
            <path d="M 345 165 L 380 150 L 420 155 L 430 195 L 380 200 L 355 235 Z" fill="#86EFAC" opacity="0.85"/>
            <!-- Odisha -->
            <path d="M 285 220 L 340 215 L 325 275 L 275 260 Z" fill="#FED7AA" opacity="0.9"/>
            <!-- Chhattisgarh -->
            <path d="M 250 220 L 285 215 L 275 285 L 235 270 Z" fill="#FEF08A" opacity="0.9"/>
            
            <!-- Maharashtra (Highlighted - Terracotta/Coral) -->
            <path id="mapMaharashtra" d="M 145 235 L 225 230 L 250 280 L 195 315 L 135 280 Z" fill="#F87171" stroke="#D96843" stroke-width="2.5" style="cursor:pointer;">
              <title>Maharashtra State (Pune District Highlighted)</title>
            </path>
            
            <!-- Andhra & Telangana -->
            <path d="M 205 295 L 275 275 L 295 350 L 235 365 Z" fill="#FDE047" opacity="0.85"/>
            <!-- Karnataka -->
            <path d="M 155 315 L 205 305 L 210 385 L 160 375 Z" fill="#FED7AA" opacity="0.9"/>
            <!-- Tamil Nadu & Kerala -->
            <path d="M 185 380 L 230 370 L 210 440 L 175 425 Z" fill="#86EFAC" opacity="0.9"/>
          </g>

          <!-- Pulsing Map Marker for Pune, Maharashtra -->
          <g transform="translate(178, 275)">
            <circle cx="0" cy="0" r="10" fill="#D96843" opacity="0.3">
              <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="0" cy="0" r="5" fill="#D96843" stroke="#FFFFFF" stroke-width="2"/>
            <!-- Leader Line pointing to Pune Callout -->
            <path d="M 4 -4 L 40 -30 L 70 -30" stroke="#D96843" stroke-width="1.5" stroke-dasharray="2,2" fill="none"/>
          </g>
        </svg>

        <!-- Floating Interactive Callout Box for Pune -->
        <div style="position:absolute; top:130px; right:35px; width:195px; background:rgba(255,254,251,0.96); border:1px solid var(--border-color); border-radius:var(--radius-md); box-shadow:var(--shadow-card); padding:10px 12px; font-size:11.5px; z-index:15; backdrop-filter:blur(4px);">
          <div style="font-family:var(--font-display); font-weight:700; color:var(--text-primary); font-size:12.5px; margin-bottom:6px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">
            Pune, Maharashtra
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:var(--text-secondary);">
            <span>Job Demand</span>
            <span style="font-weight:700; color:var(--text-primary);">48,200</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:var(--text-secondary);">
            <span>Trained Candidates</span>
            <span style="font-weight:700; color:var(--text-primary);">32,500</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="color:var(--text-secondary);">Status</span>
            <span class="badge-shortage">Undersupply</span>
          </div>
        </div>
      </div>
    `;
  },

  renderDetailCardContent(state, dist) {
    const sData = this.districtData[state] || this.districtData["Maharashtra"];
    const overview = sData.stateOverview;
    const d = sData[dist] || sData["Pune"];

    const tradesList = d.topTrades.map(t => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:7px 0; border-bottom:1px solid var(--border-subtle); font-size:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-weight:600; color:var(--text-secondary); width:16px;">${t.rank}.</span>
          <span style="color:var(--text-primary); font-weight:500;">${t.name}</span>
        </div>
        <span style="font-weight:700; color:var(--text-primary);">${t.count}</span>
      </div>
    `).join("");

    return `
      <!-- State Overview Box with Mini State Graphic -->
      <div class="state-overview-box">
        <div class="state-title-row">
          <div>
            <h3>${state} <span style="font-size:11px; font-weight:500; color:var(--text-secondary);">(State Overview)</span></h3>
          </div>
          <!-- Mini Golden Silhouette Outline of State -->
          <svg viewBox="0 0 40 36" width="34" height="30" fill="#F2B968" opacity="0.9">
            <path d="M4 6 L18 4 L34 12 L38 24 L28 32 L16 30 L6 20 Z"/>
          </svg>
        </div>

        <div class="state-stats-three">
          <div class="stat-metric-cell">
            <span class="label">Total Job Demand</span>
            <span class="val">${overview.demand}</span>
          </div>
          <div class="stat-metric-cell">
            <span class="label">Trained Candidates</span>
            <span class="val">${overview.supply}</span>
          </div>
          <div class="stat-metric-cell">
            <span class="label">Gap</span>
            <span class="val red">${overview.gap}</span>
          </div>
        </div>
      </div>

      <!-- Top High-Demand Trades -->
      <div class="state-overview-box" style="margin-top:14px;">
        <div style="font-family:var(--font-display); font-size:13.5px; font-weight:700; color:var(--text-primary); margin-bottom:10px;">
          Top High-Demand Trades (${dist})
        </div>
        <div>
          ${tradesList}
        </div>
        
        <!-- View Detailed District Report Link Button -->
        <div style="margin-top:14px; text-align:left;">
          <a href="#" style="color:var(--color-terracotta); font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
            <span>&gt; View Detailed District Report</span>
            <span style="font-size:14px;">&rarr;</span>
          </a>
        </div>
      </div>
    `;
  },

  renderMatrixRows() {
    return `
      <tr>
        <td><strong>Pune</strong></td>
        <td>Maharashtra</td>
        <td>48,200</td>
        <td>32,500</td>
        <td style="color:var(--color-terracotta); font-weight:700;">+15,700</td>
        <td><span class="badge-shortage">Undersupply</span></td>
        <td>Software Developer (8,200)</td>
      </tr>
      <tr>
        <td><strong>Kanpur Nagar</strong></td>
        <td>Uttar Pradesh</td>
        <td>38,400</td>
        <td>24,100</td>
        <td style="color:var(--color-terracotta); font-weight:700;">+14,300</td>
        <td><span class="badge-shortage">Undersupply</span></td>
        <td>Solar PV Technician (6,800)</td>
      </tr>
      <tr>
        <td><strong>Mumbai</strong></td>
        <td>Maharashtra</td>
        <td>56,400</td>
        <td>44,100</td>
        <td style="color:var(--color-terracotta); font-weight:700;">+12,300</td>
        <td><span class="badge-shortage">Undersupply</span></td>
        <td>Data Analyst (9,400)</td>
      </tr>
      <tr>
        <td><strong>Lucknow</strong></td>
        <td>Uttar Pradesh</td>
        <td>42,100</td>
        <td>35,600</td>
        <td style="color:var(--color-terracotta); font-weight:700;">+6,500</td>
        <td><span class="badge-shortage">Undersupply</span></td>
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

    if (stateSel) {
      stateSel.addEventListener("change", (e) => {
        const state = e.target.value;
        this.currentState = state;
        const dists = Object.keys(this.districtData[state] || {}).filter(k => k !== "stateOverview");
        distSel.innerHTML = dists.map(d => `<option value="${d}">${d}</option>`).join("");
        this.currentDistrict = dists[0] || "";
        this.updateDetailCard();
      });
    }

    if (distSel) {
      distSel.addEventListener("change", (e) => {
        this.currentDistrict = e.target.value;
        this.updateDetailCard();
      });
    }

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
  },

  updateDetailCard() {
    const card = document.getElementById("districtDetailCard");
    if (card) {
      card.innerHTML = this.renderDetailCardContent(this.currentState, this.currentDistrict);
    }
  }
};

window.DistrictExplorerModule = DistrictExplorerModule;
