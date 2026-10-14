const AlertCenterModule = {
  activeTab: "CRITICAL_SHORTAGE_RISK",
  cachedAlerts: [],

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="alert-center-hero">
        <h2 class="section-title">Early Warning Radar & Priority Triage Matrix</h2>
        <p class="section-subtitle">Categorized alerts flagging trades approaching acute worker deficits or saturation before the next annual target sanction</p>
      </div>

      <!-- Risk State Filter Tabs -->
      <div class="alert-tabs">
        <button class="alert-tab-btn active tab-critical" data-tab="CRITICAL_SHORTAGE_RISK">
          <span class="tab-icon">🛑</span> Critical Shortages (<span id="countCritical">0</span>)
        </button>
        <button class="alert-tab-btn tab-emerging" data-tab="EMERGING_SHORTAGE">
          <span class="tab-icon">⚠️</span> Emerging Shortages (<span id="countEmerging">0</span>)
        </button>
        <button class="alert-tab-btn tab-balanced" data-tab="BALANCED_EQUILIBRIUM">
          <span class="tab-icon">✅</span> Balanced Trades (<span id="countBalanced">0</span>)
        </button>
        <button class="alert-tab-btn tab-saturation" data-tab="MODERATE_SATURATION">
          <span class="tab-icon">🔷</span> Moderate Saturation (<span id="countSaturation">0</span>)
        </button>
        <button class="alert-tab-btn tab-oversupply" data-tab="SEVERE_OVERSUPPLY_RISK">
          <span class="tab-icon">⛔</span> Severe Oversupply (<span id="countOversupply">0</span>)
        </button>
        <button class="alert-tab-btn tab-sparse" data-tab="LOW_CONFIDENCE_DATA_SPARSE">
          <span class="tab-icon">🔘</span> Sparse / Tribal Data (<span id="countSparse">0</span>)
        </button>
      </div>

      <!-- Triage Cards Grid -->
      <div class="triage-cards-grid" id="triageGrid">
        <div class="loading-spinner">Loading early-warning alerts...</div>
      </div>
    `;

    this.bindTabs();
    await this.loadAlerts();
  },

  bindTabs() {
    document.querySelectorAll(".alert-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetBtn = e.target.closest(".alert-tab-btn");
        document.querySelectorAll(".alert-tab-btn").forEach(b => b.classList.remove("active"));
        targetBtn.classList.add("active");
        this.activeTab = targetBtn.getAttribute("data-tab");
        this.renderTriageCards();
      });
    });
  },

  async loadAlerts() {
    try {
      const res = await API.getForecasts({ horizon: "12M" });
      this.cachedAlerts = res.records || [];

      // Update badge counts
      const counts = {
        CRITICAL_SHORTAGE_RISK: 0,
        EMERGING_SHORTAGE: 0,
        BALANCED_EQUILIBRIUM: 0,
        MODERATE_SATURATION: 0,
        SEVERE_OVERSUPPLY_RISK: 0,
        LOW_CONFIDENCE_DATA_SPARSE: 0
      };

      this.cachedAlerts.forEach(r => {
        const flag = r.gap_analysis.early_warning.flag_code;
        if (counts[flag] !== undefined) counts[flag]++;
      });

      document.getElementById("countCritical").textContent = counts.CRITICAL_SHORTAGE_RISK;
      document.getElementById("countEmerging").textContent = counts.EMERGING_SHORTAGE;
      document.getElementById("countBalanced").textContent = counts.BALANCED_EQUILIBRIUM;
      document.getElementById("countSaturation").textContent = counts.MODERATE_SATURATION;
      document.getElementById("countOversupply").textContent = counts.SEVERE_OVERSUPPLY_RISK;
      document.getElementById("countSparse").textContent = counts.LOW_CONFIDENCE_DATA_SPARSE;

      this.renderTriageCards();
    } catch (err) {
      console.error("Failed to load alerts:", err);
    }
  },

  renderTriageCards() {
    const grid = document.getElementById("triageGrid");
    const filtered = this.cachedAlerts.filter(r => r.gap_analysis.early_warning.flag_code === this.activeTab);

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-state">No trades currently classified under this risk tier.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(r => {
      const gap = r.gap_analysis["12M"].absolute_gap;
      const tension = r.gap_analysis["12M"].tension_ratio;
      const warning = r.gap_analysis.early_warning;
      const drivers = r.gap_analysis.primary_drivers || [];

      return `
        <div class="triage-card" style="border-left: 4px solid ${warning.badge_color};">
          <div class="triage-header">
            <div>
              <div class="triage-trade-title">${r.trade_name}</div>
              <div class="triage-geo">${r.district_name}, ${r.state_name} • ${r.sector_name}</div>
            </div>
            <span class="status-badge" style="background: ${warning.badge_color}22; color: ${warning.badge_color};">
              ${warning.label}
            </span>
          </div>

          <div class="triage-stats-row">
            <div class="t-stat">
              <span class="t-val">${r.demand.forecast_12m.toLocaleString()}</span>
              <span class="t-lbl">12M Demand</span>
            </div>
            <div class="t-stat">
              <span class="t-val">${r.supply.effective_supply_12m.toLocaleString()}</span>
              <span class="t-lbl">12M Supply</span>
            </div>
            <div class="t-stat">
              <span class="t-val ${gap > 0 ? 'text-red' : 'text-purple'} font-bold">
                ${gap > 0 ? '+' : ''}${gap.toLocaleString()}
              </span>
              <span class="t-lbl">Net Gap</span>
            </div>
            <div class="t-stat">
              <span class="t-val">${tension}x</span>
              <span class="t-lbl">Tension</span>
            </div>
          </div>

          <div class="triage-action-box">
            <div class="triage-action-title">Recommended Planning Intervention:</div>
            <div class="triage-action-desc">${warning.recommended_action}</div>
          </div>

          <div class="triage-drivers-snippet">
            <strong>Key Contributing Signals:</strong>
            <ul>
              ${drivers.slice(0, 2).map(d => `<li>${d}</li>`).join("")}
            </ul>
          </div>

          <div class="triage-footer">
            <button class="btn btn-sm btn-outline" onclick="window.AlertCenterModule.openSim(${r.district_lgd_code}, '${r.nco_code}')">
              Simulate Seat Adjustment
            </button>
            <button class="btn btn-sm btn-ghost" onclick="window.AlertCenterModule.openDeep(${r.district_lgd_code}, '${r.nco_code}')">
              Full Intelligence View ->
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  openSim(dCode, ncoCode) {
    window.app.switchView("simulator", { district_lgd_code: dCode, nco_code: ncoCode });
  },

  openDeep(dCode, ncoCode) {
    window.app.switchView("trade-deep-dive", { district_lgd_code: dCode, nco_code: ncoCode });
  }
};

window.AlertCenterModule = AlertCenterModule;
