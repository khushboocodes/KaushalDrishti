/**
 * Demand & Supply Module — "Labour Demand & Supply Diagnostics"
 * KaushalDrishti (कौशल दृष्टि)
 * Standardized to global design system tokens, Lora typography, and warm heritage palette.
 */

const DemandSupplyModule = {
  trades: [
    { nco: "7411.0101", title: "Solar PV Installation & Maintenance Technician", sector: "Green Jobs", level: "Level 4", demand: "18,400", supply: "9,200", gap: "-9,200", status: "Critical Shortage", type: "shortage" },
    { nco: "7231.0102", title: "Electric Vehicle Diagnostic Specialist", sector: "Automotive", level: "Level 5", demand: "14,200", supply: "6,800", gap: "-7,400", status: "Critical Shortage", type: "shortage" },
    { nco: "5321.0100", title: "General Duty Nursing Assistant", sector: "Healthcare", level: "Level 4", demand: "22,500", supply: "14,100", gap: "-8,400", status: "Critical Shortage", type: "shortage" },
    { nco: "2511.0100", title: "Data Analyst & Business Intelligence Specialist", sector: "IT/ITeS", level: "Level 6", demand: "34,000", supply: "28,500", gap: "-5,500", status: "Moderate Shortage", type: "caution" },
    { nco: "7223.0100", title: "CNC Machine Operator & Programmer", sector: "Manufacturing", level: "Level 4", demand: "16,800", supply: "16,200", gap: "-600", status: "Balanced", type: "balanced" },
    { nco: "5123.0200", title: "Hospitality & Front Desk Executive", sector: "Hospitality", level: "Level 4", demand: "12,400", supply: "12,100", gap: "-300", status: "Balanced", type: "balanced" },
    { nco: "4132.0100", title: "Data Entry Operator / Office Assistant", sector: "IT/ITeS", level: "Level 3", demand: "8,500", supply: "32,400", gap: "+23,900", status: "Severe Oversupply", type: "oversupply" },
    { nco: "7531.0100", title: "Basic Sewing Machine Operator", sector: "Apparel", level: "Level 2", demand: "6,200", supply: "18,600", gap: "+12,400", status: "Severe Oversupply", type: "oversupply" }
  ],

  async init(containerId) {
    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-title-wrap" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div>
          <h2 style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-primary);">Demand & Supply Diagnostics</h2>
          <p style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">Compare employer hiring vacancy telemetry with certified training supply</p>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="display:flex; align-items:center; gap:6px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-pill); padding:2px 10px 2px 8px;">
            <img src="/assets/kaushaldrishti/icon-filter.png" alt="Filter" style="width:14px; height:14px; opacity:0.75;" />
            <select class="form-select filter-select" id="dsStateFilter" style="height:32px; font-size:12px; border:none; background:transparent; padding:0; outline:none;">
              <option>All States</option>
              <option>Maharashtra</option>
              <option>Uttar Pradesh</option>
              <option>Odisha</option>
              <option>Karnataka</option>
            </select>
          </div>
          <select class="form-select filter-select" id="dsSectorFilter" style="height:34px; font-size:12px;">
            <option>All Sectors</option>
            <option>IT/ITeS</option>
            <option>Green Jobs</option>
            <option>Automotive</option>
            <option>Healthcare</option>
            <option>Manufacturing</option>
            <option>Apparel</option>
            <option>Mining & Heavy Engineering</option>
          </select>
          <button class="btn-primary" id="btnExportDS" style="height:34px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            <span>Export Analysis</span>
          </button>
        </div>
      </div>

      <!-- 4 Standardized KPI Cards -->
      <div class="kpi-cards-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon" style="background:var(--color-sage); color:#17604D;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
          </div>
          <div class="kpi-label">Total Job Demand</div>
          <div class="kpi-value">1.24 Cr</div>
          <div class="kpi-delta delta-pos">
            <span class="delta-arrow">&uarr;</span> +18% <span class="delta-label">vs previous year</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon" style="background:rgba(23, 96, 77, 0.1); color:#17604D;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
          </div>
          <div class="kpi-label">Certified Candidates</div>
          <div class="kpi-value">1.08 Cr</div>
          <div class="kpi-delta delta-pos">
            <span class="delta-arrow">&uarr;</span> +12% <span class="delta-label">Across NSQF trades</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon" style="background:var(--color-soft-coral); color:var(--color-terracotta);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div class="kpi-label">Demand-Supply Gap</div>
          <div class="kpi-value" style="color:var(--color-terracotta);">+16 Lakh</div>
          <div class="kpi-delta delta-neg">
            Undersupply (overall)
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon" style="background:rgba(242, 185, 104, 0.22); color:#B45309;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>
          <div class="kpi-label">High-Tension Trades</div>
          <div class="kpi-value">42</div>
          <div class="kpi-delta delta-caution">
            &gt; 20% critical mismatch
          </div>
        </div>
      </div>

      <!-- Granular Diagnostics Table -->
      <div class="card-panel" style="margin-top:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div>
            <h3 class="card-title">National Trade-Level Mismatch Ledger</h3>
            <p style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">Calibrated against NCS postings, e-Shram registrations, and SIP certified capacity</p>
          </div>
          <div style="position:relative; width:250px;">
            <img src="/assets/kaushaldrishti/icon-search.png" alt="" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); width:13px; height:13px; opacity:0.6; pointer-events:none;" />
            <input type="text" id="dsTradeSearch" placeholder="Search trade or NCO code..." class="form-input" style="width:100%; height:32px; font-size:12px; padding-left:30px;" />
          </div>
        </div>

        <div id="dsTableContainer">
          ${this.renderTable()}
        </div>
      </div>
    `;

    this.bindEvents();
  },

  renderTable(query = "", sector = "All Sectors") {
    let list = this.trades;
    if (sector && sector !== "All Sectors") {
      list = list.filter(t => t.sector.toLowerCase().includes(sector.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.nco.toLowerCase().includes(q) || t.sector.toLowerCase().includes(q));
    }

    if (!list.length) {
      if (query) {
        return `
          <div class="empty-state-box">
            <img src="/assets/kaushaldrishti/empty-search.png" alt="No Search Results" class="empty-state-img" />
            <h4 class="empty-state-title">No Matching Trades Found</h4>
            <p class="empty-state-desc">No trade classification matched your query "${query}". Try searching for Solar, Nursing, EV, or Data Analyst.</p>
          </div>
        `;
      } else {
        return `
          <div class="empty-state-box">
            <img src="/assets/kaushaldrishti/empty-data.png" alt="No Data Available" class="empty-state-img" />
            <h4 class="empty-state-title">No Trade Records in this Sector</h4>
            <p class="empty-state-desc">There are currently no certified trade records or active vacancy signals recorded for "${sector}".</p>
          </div>
        `;
      }
    }

    const rows = list.map(t => {
      let badgeClass = "badge-balanced";
      let gapColor = "var(--text-primary)";
      if (t.type === "shortage") {
        badgeClass = "badge-shortage";
        gapColor = "var(--color-terracotta)";
      } else if (t.type === "caution") {
        badgeClass = "badge-shortage";
        gapColor = "#B45309";
      } else if (t.type === "oversupply") {
        badgeClass = "badge-shortage";
        gapColor = "var(--color-terracotta)";
      } else {
        gapColor = "#17604D";
      }

      return `
        <tr>
          <td style="font-weight:700; color:var(--text-secondary);">${t.nco}</td>
          <td><strong style="color:var(--text-primary); font-size:12.5px;">${t.title}</strong></td>
          <td><span class="tag-badge">${t.sector}</span></td>
          <td style="color:var(--text-secondary); font-size:11.5px;">${t.level}</td>
          <td style="font-weight:600; color:var(--text-primary);">${t.demand}</td>
          <td style="font-weight:600; color:var(--text-primary);">${t.supply}</td>
          <td style="font-weight:700; color:${gapColor};">${t.gap}</td>
          <td><span class="${badgeClass}">${t.status}</span></td>
          <td>
            <button class="action-btn-sm" onclick="window.app && window.app.switchView('simulator', { nco_code: '${t.nco}' })" style="border:1px solid var(--border-color); background:var(--bg-app); border-radius:4px; padding:3px 8px; font-size:11px; cursor:pointer; color:var(--text-primary);">
              Simulate Target
            </button>
          </td>
        </tr>
      `;
    }).join("");

    return `
      <table class="growth-table-wrap">
        <thead>
          <tr>
            <th style="width:110px;">NCO Code</th>
            <th>Trade Title</th>
            <th>Sector</th>
            <th>NSQF</th>
            <th>Demand</th>
            <th>Supply</th>
            <th>Gap (Delta)</th>
            <th>Tension Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  },

  bindEvents() {
    const searchInput = document.getElementById("dsTradeSearch");
    const sectorFilter = document.getElementById("dsSectorFilter");
    const container = document.getElementById("dsTableContainer");

    const update = () => {
      if (container) {
        const q = searchInput ? searchInput.value.trim() : "";
        const s = sectorFilter ? sectorFilter.value : "All Sectors";
        container.innerHTML = this.renderTable(q, s);
      }
    };

    if (searchInput) {
      searchInput.addEventListener("input", update);
    }
    if (sectorFilter) {
      sectorFilter.addEventListener("change", update);
    }
  }
};

window.DemandSupplyModule = DemandSupplyModule;
