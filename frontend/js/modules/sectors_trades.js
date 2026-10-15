/**
 * Sectors & Trades Module — "Sector-wise Analysis"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout and warm heritage aesthetic.
 */

const SectorsTradesModule = {
  sectorsList: [
    { name: "IT/ITeS", icon: "monitor", val: "2.8 Lakh", growth: "+34%", bg: "#EFF6FF", color: "#2563EB", demand: 280, supply: 215 },
    { name: "Healthcare", icon: "heart", val: "1.9 Lakh", growth: "+18%", bg: "#FEE2E2", color: "#DC2626", demand: 190, supply: 140 },
    { name: "Construction", icon: "hard-hat", val: "1.6 Lakh", growth: "+12%", bg: "#FFF7ED", color: "#EA580C", demand: 160, supply: 130 },
    { name: "Manufacturing", icon: "settings", val: "1.4 Lakh", growth: "+10%", bg: "#FEF3C7", color: "#D97706", demand: 140, supply: 105 },
    { name: "Retail", icon: "shopping-bag", val: "1.2 Lakh", growth: "+8%", bg: "#FDF2F8", color: "#DB2777", demand: 120, supply: 110 },
    { name: "Agriculture", icon: "feather", val: "0.9 Lakh", growth: "+5%", bg: "#ECFDF5", color: "#16A34A", demand: 90, supply: 80 },
    { name: "Hospitality", icon: "coffee", val: "0.8 Lakh", growth: "+14%", bg: "#FFFBEB", color: "#B45309", demand: 80, supply: 65 }
  ],

  top10Trades: [
    { rank: 1, trade: "Data Analyst (2511.01)", sector: "IT/ITeS", growth: "42%" },
    { rank: 2, trade: "Solar PV Technician (7412.03)", sector: "Green Jobs", growth: "38%" },
    { rank: 3, trade: "AI/ML Engineer (2512.01)", sector: "IT/ITeS", growth: "36%" },
    { rank: 4, trade: "Geriatric Care Assistant (5322.01)", sector: "Healthcare", growth: "32%" },
    { rank: 5, trade: "EV Technician (7412.05)", sector: "Manufacturing", growth: "30%" },
    { rank: 6, trade: "Drone Operator (8341.02)", sector: "Agriculture", growth: "28%" },
    { rank: 7, trade: "CNC Programmer (7223.01)", sector: "Manufacturing", growth: "26%" },
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
          ${this.getSectorSvg(s.icon)}
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
      <div class="page-title-wrap" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div>
          <h2 data-i18n="sector_title" style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-main);">Sector-wise Analysis</h2>
          <p data-i18n="sector_subtitle" style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">Compare demand, supply, growth and skill gaps across sectors</p>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <select class="filter-select" style="min-width:130px; height:34px;">
            <option>All Sectors</option>
            <option>IT/ITeS</option>
            <option>Healthcare</option>
            <option>Manufacturing</option>
            <option>Green Jobs</option>
          </select>
          <button class="btn-dark-navy" id="btnExportSector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            <span data-i18n="btn_export">Export Report</span>
          </button>
        </div>
      </div>

      <!-- Horizontal Sector Quick Cards -->
      <div class="sector-cards-strip">
        ${cardsHtml}
      </div>

      <!-- Two-Column Grid: Dual Horizontal Bar Chart on Left, Top 10 Growth on Right -->
      <div class="two-col-grid" style="grid-template-columns: 1.15fr 1fr; position:relative;">
        <!-- Left: Sector-wise Demand-Supply Gap -->
        <div class="card-panel">
          <div class="card-header-row">
            <span class="card-title" data-i18n="chart_sector_gap">Sector-wise Demand-Supply Gap</span>
            <div class="chart-legend">
              <div class="legend-item"><div class="legend-box box-purple"></div><span data-i18n="legend_job_demand">Job Demand</span></div>
              <div class="legend-item"><div class="legend-box box-pink"></div><span data-i18n="legend_trained_candidates">Trained Candidates</span></div>
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
                <th style="width:28px;">#</th>
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

        <!-- Heritage Botanical Watermark at Bottom-Left -->
        <svg viewBox="0 0 140 100" width="120" height="90" style="position:absolute; bottom:-10px; left:-10px; opacity:0.18; pointer-events:none;" fill="none">
          <path d="M10 90 C 30 60, 60 40, 110 20" stroke="#D97706" stroke-width="2"/>
          <path d="M25 75 C 35 60, 50 65, 45 80 Z" fill="#D97706"/>
          <path d="M50 55 C 60 40, 75 45, 70 60 Z" fill="#D97706"/>
          <path d="M75 35 C 85 20, 100 25, 95 40 Z" fill="#D97706"/>
        </svg>
      </div>
    `;

    this.renderHorizontalBars();
  },

  getSectorSvg(icon) {
    if (icon === "monitor") {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
    } else if (icon === "heart") {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    } else if (icon === "hard-hat") {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18h20M4 18v-4a8 8 0 0 1 16 0v4M12 6V2"/></svg>`;
    } else if (icon === "settings") {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
    } else if (icon === "shopping-bag") {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
    } else if (icon === "feather") {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 0-10 10c0 4.5 3 8 8 9.5V22h4v-.5c5-1.5 8-5 8-9.5A10 10 0 0 0 12 2z"/></svg>`;
    } else {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>`;
    }
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
    const padLeft = 90;
    const padBottom = 30;
    const padTop = 15;
    const padRight = 20;

    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const maxVal = 300; // in thousands

    // Draw vertical grid lines & X labels
    const xSteps = [0, 50, 100, 150, 200, 250, 300];
    ctx.strokeStyle = "#F1EFEA";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#A8A29E";
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

    // Draw horizontal paired bars (Purple #7B78B8 for demand, Soft coral #F49D9D for supply)
    const n = this.sectorsList.length;
    const rowH = chartH / n;
    const barH = 9;
    const gap = 3;

    this.sectorsList.forEach((sec, i) => {
      const centerY = padTop + i * rowH + rowH / 2;

      // Label on Y axis
      ctx.fillStyle = "#475569";
      ctx.font = "11.5px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(sec.name, padLeft - 10, centerY + 4);

      // Demand Bar (Purple #7B78B8)
      const dW = (sec.demand / maxVal) * chartW;
      const dY = centerY - barH - gap / 2;
      ctx.fillStyle = "#7B78B8";
      this.drawRoundedHRect(ctx, padLeft, dY, dW, barH, 3);

      // Supply Bar (Soft Coral / Pink #F49D9D)
      const sW = (sec.supply / maxVal) * chartW;
      const sY = centerY + gap / 2;
      ctx.fillStyle = "#F49D9D";
      this.drawRoundedHRect(ctx, padLeft, sY, sW, barH, 3);
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
