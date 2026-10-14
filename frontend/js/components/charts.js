class ChartHelper {
  /**
   * Draws a dual funnel comparing labor demand signals with the leaky supply funnel.
   */
  static renderDualFunnel(containerId, demandMetrics, supplyMetrics) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const pipeline = supplyMetrics.pipeline_yield_12m.pipeline_funnel;
    const sanctioned = supplyMetrics.sanctioned_seats;
    const enrolled = pipeline.enrolled_candidates;
    const completed = pipeline.completed_trainees;
    const certified = pipeline.certified_graduates;
    const retained = pipeline.locally_retained_workers;

    const demandVal = demandMetrics.forecast_12m;

    el.innerHTML = `
      <div class="dual-funnel-grid">
        <!-- Demand Side -->
        <div class="funnel-col demand-col">
          <div class="funnel-col-title">
            <span class="dot dot-red"></span> Industry Labor Demand Pull
          </div>
          <div class="funnel-card demand-card">
            <div class="funnel-number">${demandVal.toLocaleString()}</div>
            <div class="funnel-label">Total Projected Net Hires (12M)</div>
            <div class="funnel-sub">Derived from NCS, Portals & Sector Capex</div>
          </div>
          <div class="funnel-sub-grid">
            <div class="mini-stat">
              <span class="m-val">${demandMetrics.cdi.composite_demand_index}</span>
              <span class="m-lbl">CDI Score</span>
            </div>
            <div class="mini-stat">
              <span class="m-val text-green">${demandMetrics.yoy_trend_pct > 0 ? '+' : ''}${demandMetrics.yoy_trend_pct}%</span>
              <span class="m-lbl">YoY Growth</span>
            </div>
          </div>
        </div>

        <!-- VS Divider -->
        <div class="funnel-divider">
          <div class="vs-circle">VS</div>
          <div class="gap-badge ${demandVal > retained ? 'badge-shortage' : 'badge-surplus'}">
            ${demandVal > retained ? `Shortage: +${(demandVal - retained).toLocaleString()}` : `Surplus: -${(retained - demandVal).toLocaleString()}`}
          </div>
        </div>

        <!-- Supply Funnel Side -->
        <div class="funnel-col supply-col">
          <div class="funnel-col-title">
            <span class="dot dot-blue"></span> Training Pipeline Leaky Funnel
          </div>
          <div class="funnel-bars">
            <div class="f-bar-row">
              <div class="f-bar-lbl">1. Approved Seats</div>
              <div class="f-bar-track">
                <div class="f-bar-fill fill-1" style="width: 100%;">${sanctioned}</div>
              </div>
            </div>
            <div class="f-bar-row">
              <div class="f-bar-lbl">2. Actual Enrolment (85%)</div>
              <div class="f-bar-track">
                <div class="f-bar-fill fill-2" style="width: ${(enrolled/sanctioned*100)}%;">${enrolled}</div>
              </div>
            </div>
            <div class="f-bar-row">
              <div class="f-bar-lbl">3. Completers (82%)</div>
              <div class="f-bar-track">
                <div class="f-bar-fill fill-3" style="width: ${(completed/sanctioned*100)}%;">${completed}</div>
              </div>
            </div>
            <div class="f-bar-row">
              <div class="f-bar-lbl">4. Certified (88%)</div>
              <div class="f-bar-track">
                <div class="f-bar-fill fill-4" style="width: ${(certified/sanctioned*100)}%;">${certified}</div>
              </div>
            </div>
            <div class="f-bar-row highlight-row">
              <div class="f-bar-lbl font-bold">5. Locally Retained (72%)</div>
              <div class="f-bar-track">
                <div class="f-bar-fill fill-5 font-bold" style="width: ${(retained/sanctioned*100)}%;">${retained}</div>
              </div>
            </div>
          </div>
          <div class="net-yield-banner">
            <span>Net Pipeline Yield: <strong>${supplyMetrics.net_conversion_yield_pct}%</strong></span>
            <span class="yield-hint">(Out of 100 sanctioned seats, ~${Math.round(supplyMetrics.net_conversion_yield_pct)} reach local jobs)</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders high-performance Canvas time-series chart with confidence bands.
   */
  static renderTimeSeriesCanvas(canvasId, monthlySeries, conformal80, conformal95) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    const padLeft = 55;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 40;

    const plotW = W - padLeft - padRight;
    const plotH = H - padTop - padBottom;

    if (!monthlySeries || monthlySeries.length === 0) return;

    const values = monthlySeries.map(m => m.active_vacancies);
    const maxVal = Math.max(...values, conformal95 ? conformal95[1] : 100) * 1.15;
    const minVal = 0;

    const getX = (idx) => padLeft + (idx / (monthlySeries.length - 1)) * plotW;
    const getY = (val) => padTop + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;

    // Grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yVal = minVal + (i / 4) * (maxVal - minVal);
      const y = getY(yVal);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(yVal).toLocaleString(), padLeft - 8, y + 4);
    }

    // Historical vs Forecast Divider line at month 36 (Jan 2026)
    const splitIdx = 36;
    if (splitIdx < monthlySeries.length) {
      const splitX = getX(splitIdx);
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(splitX, padTop);
      ctx.lineTo(splitX, padTop + plotH);
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "11px Outfit";
      ctx.textAlign = "center";
      ctx.fillText("<- Actuals (2023-25) | 2026 Forecast ->", splitX, padTop - 10);
      ctx.restore();
    }

    // Shaded 80% & 95% Conformal Confidence Band in Forecast Window
    if (conformal80 && conformal95 && splitIdx < monthlySeries.length) {
      const fX1 = getX(splitIdx);
      const fX2 = getX(monthlySeries.length - 1);
      const yTop95 = getY(conformal95[1] / 12);
      const yBot95 = getY(conformal95[0] / 12);
      const yTop80 = getY(conformal80[1] / 12);
      const yBot80 = getY(conformal80[0] / 12);

      // 95% Band
      ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
      ctx.fillRect(fX1, yTop95, fX2 - fX1, Math.max(4, yBot95 - yTop95));

      // 80% Band
      ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
      ctx.fillRect(fX1, yTop80, fX2 - fX1, Math.max(4, yBot80 - yTop80));
    }

    // Historical Curve (Solid Teal)
    ctx.beginPath();
    ctx.strokeStyle = "#0d9488";
    ctx.lineWidth = 2.5;
    for (let i = 0; i <= Math.min(splitIdx, monthlySeries.length - 1); i++) {
      const x = getX(i);
      const y = getY(values[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Forecast Curve (Dashed Electric Blue)
    if (splitIdx < monthlySeries.length) {
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      for (let i = splitIdx; i < monthlySeries.length; i++) {
        const x = getX(i);
        const y = getY(values[i]);
        if (i === splitIdx) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // X-Axis Month labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter";
    ctx.textAlign = "center";
    for (let i = 0; i < monthlySeries.length; i += 6) {
      const x = getX(i);
      const lbl = monthlySeries[i].month;
      ctx.fillText(lbl, x, padTop + plotH + 18);
    }
  }
}

window.ChartHelper = ChartHelper;
