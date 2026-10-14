const ExportHubModule = {
  currentDistrict: 158, // Kanpur default

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="export-hero">
        <h2 class="section-title">District Skill Development Plan (DSDP) Target Allocation Hub</h2>
        <p class="section-subtitle">Generate, audit, and download automated target revision packages compliant with MSDE Common Cost Norms</p>
      </div>

      <!-- District Selector Card -->
      <div class="panel mb-4">
        <div class="filter-strip" style="margin: 0; padding: 0; background: transparent; border: none;">
          <div class="filter-group">
            <label class="filter-label">Select Target District</label>
            <select id="exportDistrictSelect" class="form-select">
              <option value="158">Kanpur Nagar, Uttar Pradesh (LGD 158)</option>
              <option value="492">Pune, Maharashtra (LGD 492)</option>
              <option value="365">Khordha / Bhubaneswar, Odisha (LGD 365)</option>
              <option value="160">Lucknow, Uttar Pradesh (LGD 160)</option>
              <option value="148">Gautam Buddha Nagar / Noida, UP (LGD 148)</option>
              <option value="485">Mumbai, Maharashtra (LGD 485)</option>
              <option value="376">Sundargarh / Rourkela, Odisha (LGD 376)</option>
            </select>
          </div>
          <div class="filter-group" style="align-self: flex-end;">
            <button class="btn btn-primary" id="btnDownloadCsv">
              <svg class="icon-btn" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download Official MSDE CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Fiscal Summary Cards -->
      <div class="kpi-strip mb-4" id="exportKpiStrip">
        <div class="kpi-card">
          <div class="kpi-body">
            <div class="kpi-label">Total Recommended Adjustments</div>
            <div class="kpi-value" id="expAdjCount">-</div>
            <div class="kpi-sub">Across High-Tension Trades</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-body">
            <div class="kpi-label">Budget Freed from Saturated Trades</div>
            <div class="kpi-value text-teal" id="expFreed">-</div>
            <div class="kpi-sub">Conserved Public Capital</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-body">
            <div class="kpi-label">Budget Required for Sunrise Trades</div>
            <div class="kpi-value text-blue" id="expReq">-</div>
            <div class="kpi-sub">Targeted Expansion Investment</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-body">
            <div class="kpi-label">Net Fiscal Variance</div>
            <div class="kpi-value text-accent" id="expVariance">-</div>
            <div class="kpi-sub">Balanced Capital Reallocation</div>
          </div>
        </div>
      </div>

      <!-- Prescriptive Table -->
      <div class="panel">
        <div class="panel-header">
          <h3 class="panel-title">Automated Target Revision Schedule</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Trade Title</th>
                <th>Sector</th>
                <th>Action Recommendation</th>
                <th>Current Sanctioned</th>
                <th>Target Delta</th>
                <th>New Proposed Target</th>
                <th>Estimated Fiscal Impact</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody id="exportTableBody">
              <tr><td colspan="8" class="text-center py-4">Loading recommendations...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents();
    await this.loadRecommendations();
  },

  bindEvents() {
    const sel = document.getElementById("exportDistrictSelect");
    const btn = document.getElementById("btnDownloadCsv");

    sel.addEventListener("change", (e) => {
      this.currentDistrict = parseInt(e.target.value, 10);
      this.loadRecommendations();
    });

    btn.addEventListener("click", () => {
      window.location.href = `/api/v1/exports/dsdp-csv/${this.currentDistrict}`;
    });
  },

  async loadRecommendations() {
    try {
      const data = await API.getDistrictRecommendations(this.currentDistrict);
      const shifts = data.proposed_seat_adjustments || [];
      const fiscal = data.fiscal_summary || {};

      document.getElementById("expAdjCount").textContent = data.total_recommended_adjustments;
      document.getElementById("expFreed").textContent = `Rs ${(fiscal.budget_freed_from_curtailment_inr / 100000).toFixed(1)} L`;
      document.getElementById("expReq").textContent = `Rs ${(fiscal.budget_required_for_expansion_inr / 100000).toFixed(1)} L`;
      document.getElementById("expVariance").textContent = `Rs ${fiscal.net_fiscal_variance_lakhs} L`;

      const tbody = document.getElementById("exportTableBody");
      tbody.innerHTML = shifts.map(item => `
        <tr>
          <td>
            <div class="table-trade-name">${item.trade_name}</div>
            <div class="table-trade-code">NCO: ${item.nco_code}</div>
          </td>
          <td><span class="sector-tag">${item.sector_name}</span></td>
          <td>
            <span class="status-badge ${item.action_type === 'EXPAND_SANCTIONED_SEATS' ? 'badge-critical' : 'badge-oversupply'}">
              ${item.action_type === 'EXPAND_SANCTIONED_SEATS' ? 'Expand Seats' : 'Curtail Saturated Seats'}
            </span>
          </td>
          <td class="font-medium">${item.current_seats}</td>
          <td class="${item.recommended_delta > 0 ? 'text-teal font-bold' : 'text-purple font-bold'}">
            ${item.recommended_delta > 0 ? '+' : ''}${item.recommended_delta}
          </td>
          <td class="font-bold">${item.proposed_target}</td>
          <td class="font-medium">Rs ${(item.budget_impact_inr / 100000).toFixed(2)} L</td>
          <td class="text-sm text-secondary">${item.rationale}</td>
        </tr>
      `).join("");

    } catch (err) {
      console.error("Failed to load export recommendations:", err);
    }
  }
};

window.ExportHubModule = ExportHubModule;
