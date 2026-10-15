/**
 * Dashboard Module — "India's Skill Landscape at a Glance"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout.
 */

const CommandCenterModule = {
  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Render screen structure matching user's reference image
    container.innerHTML = `
      <!-- Page Header Row -->
      <div class="page-header">
        <div class="page-title-wrap">
          <h2 data-i18n="dashboard_title">India's Skill Landscape at a Glance</h2>
          <p data-i18n="dashboard_subtitle">Real-time insights for a future-ready workforce</p>
        </div>
        <div class="time-pills-group">
          <button class="time-pill-btn" data-time="3M" data-i18n="time_last_3m">Last 3 Months</button>
          <button class="time-pill-btn active" data-time="1Y" data-i18n="time_last_1y">Last 1 Year</button>
          <button class="time-pill-btn" data-time="NEXT_1Y" data-i18n="time_next_1y">Next 1 Year (Forecast)</button>
        </div>
      </div>

      <!-- 4 Top KPI Cards Grid -->
      <div class="kpi-cards-grid">
        <!-- KPI 1: Total Job Demand -->
        <div class="kpi-card">
          <div class="kpi-top-row">
            <div class="kpi-icon-box kpi-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <span class="badge-growth badge-growth-green">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
              +18%
            </span>
          </div>
          <div class="kpi-label" data-i18n="kpi_total_demand">Total Job Demand</div>
          <div class="kpi-value" id="kpiDemandVal">12.4 Lakh</div>
          <div class="kpi-subtext" data-i18n="kpi_demand_sub">New job postings (NCO mapped)</div>
        </div>

        <!-- KPI 2: Trained Candidates -->
        <div class="kpi-card">
          <div class="kpi-top-row">
            <div class="kpi-icon-box kpi-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span class="badge-growth badge-growth-green">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
              +12%
            </span>
          </div>
          <div class="kpi-label" data-i18n="kpi_trained_candidates">Trained Candidates</div>
          <div class="kpi-value" id="kpiSupplyVal">10.8 Lakh</div>
          <div class="kpi-subtext" data-i18n="kpi_trained_sub">Across NSQF trades</div>
        </div>

        <!-- KPI 3: Demand-Supply Gap -->
        <div class="kpi-card">
          <div class="kpi-top-row">
            <div class="kpi-icon-box kpi-icon-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
          </div>
          <div class="kpi-label" data-i18n="kpi_demand_supply_gap">Demand-Supply Gap</div>
          <div class="kpi-value gap-red" id="kpiGapVal">+1.6 Lakh</div>
          <div class="kpi-subtext" style="color:#DC2626; font-weight:500;" data-i18n="kpi_undersupply_overall">Undersupply (overall)</div>
        </div>

        <!-- KPI 4: High-Growth Trades -->
        <div class="kpi-card">
          <div class="kpi-top-row">
            <div class="kpi-icon-box kpi-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
          <div class="kpi-label" data-i18n="kpi_high_growth_trades">High-Growth Trades</div>
          <div class="kpi-value" id="kpiGrowthCount">28</div>
          <div class="kpi-subtext" data-i18n="kpi_growth_sub">> 20% expected growth</div>
        </div>
      </div>

      <!-- Two-Column Chart Layout -->
      <div class="two-col-grid">
        <!-- Card 1: Job Demand vs Trained Candidates (Grouped Bar Chart) -->
        <div class="card-panel">
          <div class="card-header-row">
            <span class="card-title" data-i18n="chart_demand_vs_trained">Job Demand vs Trained Candidates</span>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-box box-blue"></div>
                <span data-i18n="legend_job_demand">Job Demand</span>
              </div>
              <div class="legend-item">
                <div class="legend-box box-teal"></div>
                <span data-i18n="legend_trained_candidates">Trained Candidates</span>
              </div>
            </div>
          </div>
          <div style="position: relative; width: 100%; height: 260px;">
            <canvas id="demandVsSupplyCanvas" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>

        <!-- Card 2: Demand-Supply Status (Donut Chart) -->
        <div class="card-panel">
          <div class="card-header-row">
            <span class="card-title" data-i18n="chart_status_all_trades">Demand-Supply Status (All Trades)</span>
          </div>
          <div class="donut-chart-layout">
            <!-- Donut Visual with Center Metric -->
            <div class="donut-visual-wrap">
              <canvas id="donutChartCanvas" width="170" height="170"></canvas>
              <div class="donut-center-label">
                <div class="donut-center-count">1,245</div>
                <div class="donut-center-sub" data-i18n="donut_total_trades">Total Trades</div>
              </div>
            </div>
            <!-- Donut Legend on the Right -->
            <div class="donut-legend-col">
              <div class="donut-legend-row">
                <div class="legend-dot dot-red"></div>
                <span data-i18n="donut_undersupply">Undersupply</span>
                <span class="donut-legend-pct">38%</span>
              </div>
              <div class="donut-legend-row">
                <div class="legend-dot dot-green"></div>
                <span data-i18n="donut_balanced">Balanced</span>
                <span class="donut-legend-pct">42%</span>
              </div>
              <div class="donut-legend-row">
                <div class="legend-dot dot-orange"></div>
                <span data-i18n="donut_oversupply">Oversupply</span>
                <span class="donut-legend-pct">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render the custom canvas charts
    this.renderGroupedBarChart();
    this.renderDonutChart();
    this.bindTimePills();
  },

  renderGroupedBarChart() {
    const canvas = document.getElementById("demandVsSupplyCanvas");
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
    const padBottom = 30;
    const padTop = 15;
    const padRight = 15;

    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Sector data matching reference image
    const sectors = [
      { name: "IT/ITeS", demand: 135000, supply: 105000 },
      { name: "Healthcare", demand: 110000, supply: 92000 },
      { name: "Construction", demand: 98000, supply: 84000 },
      { name: "Manufacturing", demand: 142000, supply: 115000 },
      { name: "Retail", demand: 90000, supply: 80000 },
      { name: "Agriculture", demand: 75000, supply: 65000 },
      { name: "Hospitality", demand: 62000, supply: 50000 },
    ];

    const maxVal = 200000;
    const ySteps = [0, 50000, 100000, 150000, 200000];

    // Draw horizontal grid lines and y labels
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

      const label = val === 0 ? "0" : (val / 1000) + "K";
      ctx.fillText(label, padLeft - 8, y + 4);
    });

    // Draw grouped bars
    const n = sectors.length;
    const groupW = chartW / n;
    const barW = Math.min(18, groupW * 0.32);
    const gapBetween = 4;

    sectors.forEach((sec, i) => {
      const groupCenterX = padLeft + i * groupW + groupW / 2;

      // Demand Bar (Blue)
      const dH = (sec.demand / maxVal) * chartH;
      const dX = groupCenterX - barW - gapBetween / 2;
      const dY = padTop + chartH - dH;
      ctx.fillStyle = "#3B82F6";
      this.drawRoundedRect(ctx, dX, dY, barW, dH, 3);

      // Supply Bar (Teal)
      const sH = (sec.supply / maxVal) * chartH;
      const sX = groupCenterX + gapBetween / 2;
      const sY = padTop + chartH - sH;
      ctx.fillStyle = "#14B8A6";
      this.drawRoundedRect(ctx, sX, sY, barW, sH, 3);

      // X-axis label
      ctx.fillStyle = "#64748B";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sec.name, groupCenterX, h - 8);
    });
  },

  drawRoundedRect(ctx, x, y, width, height, radius) {
    if (height < 2) return;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  },

  renderDonutChart() {
    const canvas = document.getElementById("donutChartCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const size = 170;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = 75;
    const innerR = 52;

    // Percentages: 38% Undersupply (Red), 42% Balanced (Green), 20% Oversupply (Orange)
    const segments = [
      { pct: 0.38, color: "#EF4444" },  // Undersupply
      { pct: 0.42, color: "#10B981" },  // Balanced
      { pct: 0.20, color: "#F59E0B" }   // Oversupply
    ];

    let startAngle = -Math.PI / 2;

    segments.forEach(seg => {
      const sliceAngle = seg.pct * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      startAngle = endAngle;
    });
  },

  bindTimePills() {
    const pills = document.querySelectorAll(".time-pill-btn");
    pills.forEach(btn => {
      btn.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
};

window.CommandCenterModule = CommandCenterModule;
