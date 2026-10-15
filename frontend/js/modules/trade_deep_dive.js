/**
 * Forecasting Module — "Skill Demand Forecasting"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout.
 */

const TradeDeepDiveModule = {
  currentSector: "IT/ITeS",
  currentTrade: "Software Developer (2512.01)",
  currentHorizon: "3 Years",

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-wrap">
          <h2 data-i18n="forecast_title">Skill Demand Forecasting</h2>
          <p data-i18n="forecast_subtitle">AI-powered forecasts to plan training capacity and resources</p>
        </div>
      </div>

      <!-- Filter Controls Strip -->
      <div class="filter-toolbar-row">
        <div class="filter-group">
          <label data-i18n="filter_sector">Select Sector</label>
          <select id="forecastSectorSelect" class="filter-select">
            <option value="IT/ITeS" selected>IT/ITeS</option>
            <option value="Green Energy">Green Jobs / Solar PV</option>
            <option value="Automotive">Automotive & EV</option>
            <option value="Healthcare">Healthcare & Allied</option>
          </select>
        </div>

        <div class="filter-group">
          <label data-i18n="filter_trade">Select Trade</label>
          <select id="forecastTradeSelect" class="filter-select" style="min-width: 220px;">
            <option value="Software Developer (2512.01)" selected>Software Developer (2512.01)</option>
            <option value="Data Analyst (2511.01)">Data Analyst (2511.01)</option>
            <option value="Solar PV Tech (7412.03)">Solar PV Tech (7412.03)</option>
            <option value="EV Service Specialist (7412.05)">EV Service Specialist (7412.05)</option>
          </select>
        </div>

        <div class="filter-group">
          <label data-i18n="filter_horizon">Forecast Horizon</label>
          <select id="forecastHorizonSelect" class="filter-select">
            <option value="1 Year">1 Year</option>
            <option value="2 Years">2 Years</option>
            <option value="3 Years" selected>3 Years</option>
          </select>
        </div>

        <div style="margin-left: auto;">
          <button class="btn-primary-blue" id="btnGenerateForecast">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span data-i18n="btn_generate_forecast">Generate Forecast</span>
          </button>
        </div>
      </div>

      <!-- Main Forecast Grid: 65% Chart & Insights on Left, 35% Summary on Right -->
      <div class="two-col-grid" style="grid-template-columns: 1.7fr 1fr;">
        <!-- Left: Line Chart & Key Influencing Factors -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- Projected Job Demand Line Chart -->
          <div class="card-panel">
            <div class="card-header-row">
              <span class="card-title" data-i18n="chart_projected_demand">Projected Job Demand</span>
              <div class="chart-legend">
                <div class="legend-item">
                  <div style="width:14px; height:2px; background:#3B82F6;"></div>
                  <span data-i18n="legend_historical">Historical</span>
                </div>
                <div class="legend-item">
                  <div style="width:14px; height:2px; border-top:2px dashed #10B981;"></div>
                  <span data-i18n="legend_forecast">Forecast</span>
                </div>
              </div>
            </div>
            <div style="position:relative; width:100%; height:230px;">
              <canvas id="forecastLineCanvas" style="width:100%; height:100%;"></canvas>
            </div>
          </div>

          <!-- Key Factors Influencing Demand -->
          <div class="card-panel">
            <div class="card-title" style="margin-bottom:12px;" data-i18n="key_factors_title">Key Factors Influencing Demand</div>
            <div class="factors-list">
              <div class="factor-item">
                <div class="factor-bullet" style="color:#2563EB;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </div>
                <span data-i18n="factor_ai">Growth in digital services and AI adoption</span>
              </div>
              <div class="factor-item">
                <div class="factor-bullet" style="color:#0D9488;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <span data-i18n="factor_gcc">Increased GCC investments in India</span>
              </div>
              <div class="factor-item">
                <div class="factor-bullet" style="color:#7C3AED;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <span data-i18n="factor_cloud">Rising demand for cloud and cybersecurity skills</span>
              </div>
              <div class="factor-item">
                <div class="factor-bullet" style="color:#F59E0B;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/></svg>
                </div>
                <span data-i18n="factor_dpi">Government digital initiatives (DPI, e-Governance)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Forecast Summary & Confidence Ring -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- Card 1: Forecast Summary -->
          <div class="card-panel">
            <div class="card-title" style="margin-bottom:16px;" data-i18n="forecast_summary_title">Forecast Summary</div>
            
            <div style="display:flex; flex-direction:column; gap:14px;">
              <div>
                <div class="stat-label-small" data-i18n="stat_current_demand">Current Demand (2024)</div>
                <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-main);">92,000</div>
              </div>

              <div>
                <div class="stat-label-small" data-i18n="stat_proj_demand">Projected Demand (2027)</div>
                <div style="font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--text-main); display:flex; align-items:center; gap:8px;">
                  1,58,000
                  <span class="badge-growth badge-growth-green">+72%</span>
                </div>
              </div>

              <div>
                <div class="stat-label-small" data-i18n="stat_rec_seats">Recommended Training Seats</div>
                <div style="font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-main);">1,20,000</div>
              </div>

              <div style="background:#FEF2F2; border:1px solid #FEE2E2; border-radius:var(--radius-md); padding:10px 14px;">
                <div class="stat-label-small" style="color:#991B1B;" data-i18n="stat_exp_gap">Expected Gap (2027)</div>
                <div style="font-size:18px; font-weight:700; color:#DC2626;">+38,000 <span style="font-size:12px; font-weight:600;">Undersupply</span></div>
              </div>
            </div>
          </div>

          <!-- Card 2: Forecast Confidence -->
          <div class="card-panel">
            <div class="card-title" data-i18n="forecast_confidence_title">Forecast Confidence</div>
            <div class="confidence-gauge-wrap">
              <!-- Circular Progress Ring (87%) -->
              <div class="circle-progress-ring">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" stroke="#F1F5F9" stroke-width="6" fill="none"/>
                  <circle cx="36" cy="36" r="30" stroke="#0D9488" stroke-width="6" fill="none"
                          stroke-dasharray="188.5" stroke-dashoffset="24.5" stroke-linecap="round"
                          transform="rotate(-90 36 36)"/>
                </svg>
                <span style="position:absolute;">87%</span>
              </div>
              <div>
                <span class="badge-growth badge-growth-green" style="margin-bottom:4px;" data-i18n="high_confidence">High Confidence</span>
                <p style="font-size:11.5px; color:var(--text-muted); margin-top:4px;" data-i18n="confidence_desc">Based on 5 data sources and historical trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderForecastLineChart();
  },

  renderForecastLineChart() {
    const canvas = document.getElementById("forecastLineCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padLeft = 45;
    const padBottom = 26;
    const padTop = 15;
    const padRight = 20;

    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Y Axis levels: 0, 50K, 100K, 150K, 200K
    const maxVal = 200;
    const ySteps = [0, 50, 100, 150, 200];

    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#94A3B8";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "right";

    ySteps.forEach(val => {
      const y = padTop + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      const label = val === 0 ? "0" : val + "K";
      ctx.fillText(label, padLeft - 8, y + 4);
    });

    // X Axis Years: 2024, 2025, 2026, 2027
    const years = [
      { year: "2024", xPct: 0.05 },
      { year: "2025", xPct: 0.35 },
      { year: "2026", xPct: 0.65 },
      { year: "2027", xPct: 0.95 }
    ];

    ctx.textAlign = "center";
    ctx.fillStyle = "#64748B";
    years.forEach(yr => {
      const x = padLeft + yr.xPct * chartW;
      ctx.fillText(yr.year, x, h - 6);
    });

    // Coordinates:
    // 2024: 75K
    // 2025: 92K (transition from historical to forecast)
    // 2026: 125K
    // 2027: 158K
    const p2024 = { x: padLeft + 0.05 * chartW, y: padTop + chartH - (75 / maxVal) * chartH };
    const p2025 = { x: padLeft + 0.35 * chartW, y: padTop + chartH - (92 / maxVal) * chartH };
    const p2026 = { x: padLeft + 0.65 * chartW, y: padTop + chartH - (125 / maxVal) * chartH };
    const p2027 = { x: padLeft + 0.95 * chartW, y: padTop + chartH - (158 / maxVal) * chartH };

    // Shaded gradient under historical curve
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    grad.addColorStop(0, "rgba(59, 130, 246, 0.18)");
    grad.addColorStop(1, "rgba(59, 130, 246, 0.0)");

    ctx.beginPath();
    ctx.moveTo(p2024.x, padTop + chartH);
    ctx.lineTo(p2024.x, p2024.y);
    ctx.lineTo(p2025.x, p2025.y);
    ctx.lineTo(p2025.x, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Solid Blue Line (Historical 2024 to 2025)
    ctx.beginPath();
    ctx.moveTo(p2024.x, p2024.y);
    ctx.lineTo(p2025.x, p2025.y);
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.stroke();

    // Data points on historical
    ctx.fillStyle = "#3B82F6";
    [p2024, p2025].forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Dashed Green Line (Forecast 2025 to 2027)
    ctx.beginPath();
    ctx.moveTo(p2025.x, p2025.y);
    ctx.lineTo(p2026.x, p2026.y);
    ctx.lineTo(p2027.x, p2027.y);
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Data points on forecast
    ctx.fillStyle = "#10B981";
    [p2026, p2027].forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
};

window.TradeDeepDiveModule = TradeDeepDiveModule;
