/**
 * Sectors & Trades Module — "Sector-wise Analysis"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout.
 */

const SectorsTradesModule = {
  sectorsList: [
    { name: "IT/ITeS", icon: "monitor", val: "2.8 Lakh", growth: "+24%", bg: "#EFF6FF", color: "#2563EB", demand: 280, supply: 220 },
    { name: "Healthcare", icon: "activity", val: "1.9 Lakh", growth: "+18%", bg: "#ECFEFF", color: "#06B6D4", demand: 190, supply: 145 },
    { name: "Construction", icon: "hard-hat", val: "1.6 Lakh", growth: "+12%", bg: "#FFF7ED", color: "#F97316", demand: 160, supply: 135 },
    { name: "Manufacturing", icon: "settings", val: "1.4 Lakh", growth: "+16%", bg: "#FEF3C7", color: "#F59E0B", demand: 140, supply: 105 },
    { name: "Retail", icon: "shopping-bag", val: "1.2 Lakh", growth: "+8%", bg: "#EFF6FF", color: "#3B82F6", demand: 120, supply: 110 },
    { name: "Agriculture", icon: "feather", val: "0.9 Lakh", growth: "+10%", bg: "#ECFDF5", color: "#10B981", demand: 90, supply: 80 },
    { name: "Hospitality", icon: "coffee", val: "0.8 Lakh", growth: "+14%", bg: "#FEF2F2", color: "#EF4444", demand: 80, supply: 65 }
  ],

  top10Trades: [
    { rank: 1, trade: "Data Analyst (2511.01)", sector: "IT/ITeS", growth: "42%" },
    { rank: 2, trade: "Solar PV Technician (7412.03)", sector: "Green Jobs", growth: "38%" },
    { rank: 3, trade: "AI/ML Engineer (2512.01)", sector: "IT/ITeS", growth: "36%" },
    { rank: 4, trade: "Geriatric Care Assistant (5322.01)", sector: "Healthcare", growth: "32%" },
    { rank: 5, trade: "EV Technician (7412.05)", sector: "Manufacturing", growth: "30%" },
    { rank: 6, trade: "Drone Operator (8341.02)", sector: "Agriculture", growth: "28%" },
    { rank: 7, trade: "CNC Programmer (7223.03)", sector: "Manufacturing", growth: "26%" },
    { rank: 8, trade: "Logistics Associate (9621.01)", sector: "Logistics", growth: "24%" },
    { rank: 9, trade: "Hospitality Associate (5123.02)", sector: "Hospitality", growth: "22%" },
    { rank: 10, trade: "Electric Vehicle Driver (8322.01)", sector: "Transport", growth: "21%" }
  ],

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cardsHtml = this.sectorsList.map(s => `
      <div class="sector-mini-card">
        <div class="sector-mini-icon" style="background:${s.bg}; color:${s.color};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <div class="sector-mini-name">${s.name}</div>
        <div class="sector-mini-val">${s.val}</div>
        <div class="sector-mini-growth">${s.growth}</div>
      </div>
    `).join("");

    const tableRows = this.top10Trades.map(t => `
      <tr>
        <td style="font-weight:600; color:var(--text-muted);">${t.rank}</td>
        <td><strong>${t.trade}</strong></td>
        <td><span class="tag-badge">${t.sector}</span></td>
        <td class="growth-pct-green">${t.growth}</td>
      </tr>
    `).join("");

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-wrap">
          <h2 data-i18n="sector_title">Sector-wise Analysis</h2>
          <p data-i18n="sector_subtitle">Compare demand, supply, growth and skill gaps across sectors</p>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <select class="filter-select" style="min-width:140px;">
            <option>All Sectors</option>
            <option>IT/ITeS</option>
            <option>Healthcare</option>
            <option>Manufacturing</option>
          </select>
          <button class="btn-primary-blue" id="btnExportSector">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            <span data-i18n="btn_export">Export</span>
          </button>
        </div>
      </div>

      <!-- Horizontal Sector Quick Cards -->
      <div class="sector-cards-strip">
        ${cardsHtml}
      </div>

      <!-- Two-Column Grid: Dual Horizontal Bar Chart on Left, Top 10 Growth on Right -->
      <div class="two-col-grid" style="grid-template-columns: 1fr 1fr;">
        <!-- Left: Sector-wise Demand-Supply Gap -->
        <div class="card-panel">
          <div class="card-header-row">
            <span class="card-title" data-i18n="chart_sector_gap">Sector-wise Demand-Supply Gap</span>
            <div class="chart-legend">
              <div class="legend-item"><div class="legend-box box-blue"></div><span data-i18n="legend_job_demand">Job Demand</span></div>
              <div class="legend-item"><div class="legend-box box-teal"></div><span data-i18n="legend_trained_candidates">Trained Candidates</span></div>
            </div>
          </div>
          <div style="position:relative; width:100%; height:380px;">
            <canvas id="sectorHorizontalBarCanvas" style="width:100%; height:100%;"></canvas>
          </div>
        </div>

        <!-- Right: Top 10 Trades by Projected Growth -->
        <div class="card-panel">
          <div class="card-header-row">
            <span class="card-title" data-i18n="top_10_growth_title">Top 10 Trades by Projected Growth (Next 3 Years)</span>
          </div>
          <table class="growth-table-wrap">
            <thead>
              <tr>
                <th style="width:30px;">#</th>
                <th data-i18n="th_trade">Trade (NCO Code)</th>
                <th data-i18n="th_sector">Sector</th>
                <th data-i18n="th_growth">Projected Growth</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.renderHorizontalBars();
  },

  renderHorizontalBars() {
    const canvas = document.getElementById("sectorHorizontalBarCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padLeft = 85;
    const padBottom = 30;
    const padTop = 15;
    const padRight = 20;

    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const maxVal = 300; // in thousands

    // Draw vertical grid lines & X labels
    const xSteps = [0, 50, 100, 150, 200, 250, 300];
    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#94A3B8";
    ctx.font = "10.5px Inter, sans-serif";
    ctx.textAlign = "center";

    xSteps.forEach(val => {
      const x = padLeft + (val / maxVal) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + chartH);
      ctx.stroke();

      const label = val === 0 ? "0" : val + "K";
      ctx.fillText(label, x, h - 10);
    });

    // Draw horizontal paired bars
    const n = this.sectorsList.length;
    const rowH = chartH / n;
    const barH = 10;
    const gap = 3;

    this.sectorsList.forEach((sec, i) => {
      const centerY = padTop + i * rowH + rowH / 2;

      // Label on Y axis
      ctx.fillStyle = "#475569";
      ctx.font = "11.5px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(sec.name, padLeft - 10, centerY + 4);

      // Demand Bar (Blue)
      const dW = (sec.demand / maxVal) * chartW;
      const dY = centerY - barH - gap / 2;
      ctx.fillStyle = "#3B82F6";
      this.drawRoundedHRect(ctx, padLeft, dY, dW, barH, 2);

      // Supply Bar (Teal)
      const sW = (sec.supply / maxVal) * chartW;
      const sY = centerY + gap / 2;
      ctx.fillStyle = "#14B8A6";
      this.drawRoundedHRect(ctx, padLeft, sY, sW, barH, 2);
    });
  },

  drawRoundedHRect(ctx, x, y, width, height, radius) {
    if (width < 2) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();
  }
};

window.SectorsTradesModule = SectorsTradesModule;
