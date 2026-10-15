/**
 * Dashboard Module — "India's Skill Landscape at a Glance"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout and warm heritage aesthetic.
 */

const CommandCenterModule = {
  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Render screen structure matching reference image 1
    container.innerHTML = `
      <!-- Page Header Banner with Heritage Skyline -->
      <div class="page-header-heritage">
        <div class="page-title-wrap">
          <h2 data-i18n="dashboard_title">India's Skill Landscape at a Glance</h2>
          <p data-i18n="dashboard_subtitle">Real-time insights to align training capacity with industry demand</p>
        </div>
        
        <!-- Heritage Monument Skyline Watermark -->
        <svg class="heritage-skyline-bg" viewBox="0 0 320 60" fill="none">
          <!-- Trees on left -->
          <circle cx="20" cy="40" r="14" fill="#86EFAC" opacity="0.6"/>
          <circle cx="34" cy="42" r="10" fill="#4ADE80" opacity="0.7"/>
          <rect x="26" y="44" width="4" height="16" fill="#78350F" opacity="0.6"/>
          
          <!-- Chhatri / Indian Temple Pavilion -->
          <path d="M60 60V32l10-8 10 8v28H60z" fill="#FDBA74" opacity="0.7"/>
          <path d="M65 32c0-8 10-12 10-12s10 4 10 12H65z" fill="#FB923C" opacity="0.9"/>
          <circle cx="75" cy="18" r="2.5" fill="#C2410C"/>

          <!-- India Gate / Grand Portal arch -->
          <rect x="105" y="18" width="50" height="42" fill="#E2E8F0" opacity="0.4"/>
          <path d="M100 18h60v5h-60z" fill="#EA580C" opacity="0.8"/>
          <rect x="104" y="23" width="12" height="37" fill="#F97316" opacity="0.85"/>
          <rect x="144" y="23" width="12" height="37" fill="#F97316" opacity="0.85"/>
          <path d="M116 38c0-8 14-8 14-8s14 0 14 8v22h-28V38z" fill="#FFFBEB"/>
          <circle cx="130" cy="27" r="3" fill="#D97706"/>

          <!-- Dome / Stupa with kalash -->
          <path d="M175 60V34c0-12 18-18 18-18s18 6 18 18v26h-36z" fill="#FED7AA" opacity="0.85"/>
          <path d="M185 60v-16a8 8 0 0 1 16 0v16h-16z" fill="#EA580C" opacity="0.5"/>
          <line x1="193" y1="16" x2="193" y2="10" stroke="#C2410C" stroke-width="2"/>
          <circle cx="193" cy="9" r="2" fill="#B45309"/>

          <!-- Red Fort style battlements & minaret -->
          <path d="M230 60V28h6v-4h4v4h6v-4h4v4h6v32h-26z" fill="#F87171" opacity="0.7"/>
          <path d="M270 60V22l7-6 7 6v38h-14z" fill="#FBBF24" opacity="0.75"/>
          <circle cx="277" cy="14" r="2" fill="#D97706"/>

          <!-- Foliage right -->
          <circle cx="300" cy="42" r="12" fill="#86EFAC" opacity="0.6"/>
          <circle cx="312" cy="44" r="8" fill="#4ADE80" opacity="0.7"/>
        </svg>
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
          </div>
          <div class="kpi-label" data-i18n="kpi_total_demand">Total Job Demand</div>
          <div class="kpi-value" id="kpiDemandVal">1.24 Cr</div>
          <div class="kpi-subtext">
            <span class="text-green">+18%</span> vs. previous year
          </div>
        </div>

        <!-- KPI 2: Trained Candidates -->
        <div class="kpi-card">
          <div class="kpi-top-row">
            <div class="kpi-icon-box kpi-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
          </div>
          <div class="kpi-label" data-i18n="kpi_trained_candidates">Trained Candidates</div>
          <div class="kpi-value" id="kpiSupplyVal">1.08 Cr</div>
          <div class="kpi-subtext">
            <span class="text-green">+12%</span> Across NSQF trades
          </div>
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
          <div class="kpi-value gap-red" id="kpiGapVal">+16 Lakh</div>
          <div class="kpi-subtext" style="color:#DC2626; font-weight:500;" data-i18n="kpi_undersupply_overall">Undersupply (overall)</div>
        </div>

        <!-- KPI 4: High-Growth Trades -->
        <div class="kpi-card">
          <div class="kpi-top-row">
            <div class="kpi-icon-box kpi-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
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
            <div class="card-controls-right">
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-box box-purple"></div>
                  <span data-i18n="legend_job_demand">Job Demand</span>
                </div>
                <div class="legend-item">
                  <div class="legend-box box-pink"></div>
                  <span data-i18n="legend_trained_candidates">Trained Candidates</span>
                </div>
              </div>
              <select class="select-sm" id="timeGranularitySelect">
                <option value="yearly" selected>Yearly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>
          <div style="position: relative; width: 100%; height: 250px;">
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
              <canvas id="donutChartCanvas" width="165" height="165"></canvas>
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

      <!-- Quick Insights (4 Cards Row) -->
      <div style="margin-top: 10px;">
        <div class="quick-insights-header">Quick Insights</div>
        <div class="quick-insights-strip">
          <!-- Quick 1: Healthcare -->
          <div class="insight-pill-card">
            <div class="insight-icon-square" style="background:var(--color-soft-coral); color:var(--color-terracotta);">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div class="insight-text-wrap">
              <span class="insight-name">Healthcare</span>
              <span class="insight-desc">High demand in 14 districts</span>
            </div>
          </div>

          <!-- Quick 2: Green Jobs -->
          <div class="insight-pill-card">
            <div class="insight-icon-square" style="background:var(--color-sage); color:var(--color-primary-accent);">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
            </div>
            <div class="insight-text-wrap">
              <span class="insight-name">Green Jobs</span>
              <span class="insight-desc"><strong style="color:var(--color-primary-accent);">32%</strong> projected growth</span>
            </div>
          </div>

          <!-- Quick 3: IT/ITeS -->
          <div class="insight-pill-card">
            <div class="insight-icon-square" style="background:#EFF6FF; color:#2563EB;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="insight-text-wrap">
              <span class="insight-name">IT/ITeS</span>
              <span class="insight-desc">Consistent demand</span>
            </div>
          </div>

          <!-- Quick 4: Construction -->
          <div class="insight-pill-card">
            <div class="insight-icon-square" style="background:var(--color-saffron-light); color:var(--color-saffron-dark);">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
              </svg>
            </div>
            <div class="insight-text-wrap">
              <span class="insight-name">Construction</span>
              <span class="insight-desc">Shortage risk in 8 states</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render the custom canvas charts
    this.renderGroupedBarChart();
    this.renderDonutChart();
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
    const padLeft = 48;
    const padBottom = 28;
    const padTop = 15;
    const padRight = 15;

    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Timeline data matching reference image: 2022, 2023, 2024, 2025, 2026 (F)
    const years = [
      { year: "2022", demand: 750000, supply: 680000 },
      { year: "2023", demand: 920000, supply: 820000 },
      { year: "2024", demand: 1100000, supply: 960000 },
      { year: "2025", demand: 1240000, supply: 1080000 },
      { year: "2026 (F)", demand: 1420000, supply: 1180000 },
    ];

    const maxVal = 1600000;
    const ySteps = [
      { val: 0, label: "0" },
      { val: 500000, label: "50L" },
      { val: 1000000, label: "1.0 Cr" },
      { val: 1500000, label: "1.5 Cr" }
    ];

    // Draw horizontal grid lines and y labels with design system tokens
    ctx.strokeStyle = "#E9E0D3";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64716D";
    ctx.font = "11px 'DM Sans', 'Inter', sans-serif";
    ctx.textAlign = "right";

    ySteps.forEach(step => {
      const y = padTop + chartH - (step.val / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      ctx.fillText(step.label, padLeft - 8, y + 4);
    });

    // Draw grouped bars matching reference palette (Purple #7B78B8 vs Soft Coral #F49D9D)
    const n = years.length;
    const groupW = chartW / n;
    const barW = Math.min(22, groupW * 0.32);
    const gapBetween = 4;

    years.forEach((item, i) => {
      const groupCenterX = padLeft + i * groupW + groupW / 2;

      // Demand Bar (Purple #7B78B8)
      const dH = (item.demand / maxVal) * chartH;
      const dX = groupCenterX - barW - gapBetween / 2;
      const dY = padTop + chartH - dH;
      ctx.fillStyle = "#7B78B8";
      this.drawRoundedRect(ctx, dX, dY, barW, dH, 4);

      // Supply Bar (Soft Coral / Pink #F49D9D)
      const sH = (item.supply / maxVal) * chartH;
      const sX = groupCenterX + gapBetween / 2;
      const sY = padTop + chartH - sH;
      ctx.fillStyle = "#F49D9D";
      this.drawRoundedRect(ctx, sX, sY, barW, sH, 4);

      // X-axis label
      ctx.fillStyle = "#173F35";
      ctx.font = item.year.includes("(F)") ? "600 11px 'DM Sans', 'Inter', sans-serif" : "11px 'DM Sans', 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.year, groupCenterX, h - 8);
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
    const size = 165;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = 72;
    const innerR = 48;

    // Percentages matching reference image: 38% Undersupply (Terracotta #D96843), 42% Balanced (Forest Green #17604D), 20% Oversupply (Sky Blue #0284C7)
    const segments = [
      { pct: 0.38, color: "#D96843" },  // Undersupply
      { pct: 0.42, color: "#17604D" },  // Balanced
      { pct: 0.20, color: "#0284C7" }   // Oversupply
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
  }
};

window.CommandCenterModule = CommandCenterModule;
