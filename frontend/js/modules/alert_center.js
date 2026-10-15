/**
 * Alerts & Insights Module
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches the reference enterprise SaaS design layout.
 */

const AlertCenterModule = {
  currentTab: "all",

  alertsList: [
    {
      id: "alt_1",
      type: "undersupply",
      title: "Acute Shortage - Solar PV Technician",
      titleColor: "alert-title-red",
      desc: "Projected undersupply of 18,000 candidates in 2026",
      tags: ["Green Jobs", "5 districts"]
    },
    {
      id: "alt_2",
      type: "oversupply",
      title: "Approaching Saturation - Data Entry Operator",
      titleColor: "alert-title-orange",
      desc: "Oversupply expected in 12 districts by 2026",
      tags: ["IT/ITeS", "12 districts"]
    },
    {
      id: "alt_3",
      type: "growth",
      title: "Surging Demand - EV Diagnostic Technician",
      titleColor: "alert-title-red",
      desc: "Industrial hiring expanded by +48% YoY across EV manufacturing hubs",
      tags: ["Automotive & EV", "8 districts"]
    },
    {
      id: "alt_4",
      type: "undersupply",
      title: "Healthcare Deficit - Geriatric Care Assistant",
      titleColor: "alert-title-red",
      desc: "Critical shortage of 6,200 certified care assistants projected",
      tags: ["Healthcare", "6 districts"]
    }
  ],

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-wrap">
          <h2 data-i18n="alerts_main_title">Alerts & Insights</h2>
          <p data-i18n="alerts_main_subtitle">Early warning signals and actionable capacity planning recommendations</p>
        </div>
      </div>

      <!-- Tri-Panel Layout matching reference image -->
      <div class="alerts-tri-grid">
        <!-- Left Panel: Selected Trade Detail (Electrician) -->
        <div class="card-panel">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:4px;">
            <div>
              <h3 style="font-size:16px; font-weight:700; color:var(--text-main);">Electrician (7412.01)</h3>
              <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                Sector: Construction • NSQF Level 4
              </div>
            </div>
            <span class="badge-growth badge-growth-green">In Demand</span>
          </div>

          <!-- Mini sub-tabs -->
          <div style="display:flex; gap:6px; border-bottom:1px solid var(--border-light); padding:10px 0 8px 0; margin-bottom:14px; overflow-x:auto;">
            <span style="font-size:11.5px; font-weight:600; color:var(--color-primary); cursor:pointer;">Overview</span>
            <span style="font-size:11.5px; color:var(--text-muted); cursor:pointer;">Demand & Supply</span>
            <span style="font-size:11.5px; color:var(--text-muted); cursor:pointer;">Geographic</span>
          </div>

          <!-- Metrics List -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div class="district-stat-box">
              <div class="stat-label-small">Job Demand</div>
              <div class="stat-val-med">
                52,000
                <span class="badge-growth badge-growth-green">+16%</span>
              </div>
            </div>

            <div class="district-stat-box">
              <div class="stat-label-small">Trained Candidates</div>
              <div class="stat-val-med">
                68,000
                <span class="badge-growth badge-growth-green">+8%</span>
              </div>
            </div>

            <div style="background:#FFFBEB; border:1px solid #FEF3C7; border-radius:var(--radius-md); padding:10px 12px;">
              <div class="stat-label-small" style="color:#B45309;">Demand-Supply Gap</div>
              <div style="font-size:17px; font-weight:700; color:#D97706;">-16,000 <span style="font-size:12px; font-weight:600;">Oversupply</span></div>
            </div>

            <div class="district-stat-box">
              <div class="stat-label-small">Average Local Salary</div>
              <div style="font-size:16px; font-weight:700; color:var(--text-main);">₹18,500 <span style="font-size:11px; font-weight:500; color:var(--text-muted);">/ month</span></div>
            </div>
          </div>
        </div>

        <!-- Center Panel: Alerts & Insights List -->
        <div class="card-panel">
          <div class="card-header-row">
            <span class="card-title">Alerts & Insights</span>
            <button style="background:none; border:none; font-size:11.5px; color:var(--color-primary); font-weight:600; cursor:pointer;" id="btnMarkRead">
              Mark all as read
            </button>
          </div>

          <!-- Alert Category Filter Tabs -->
          <div class="alert-subtabs">
            <button class="alert-tab-btn active" data-tab="all">All Alerts (24)</button>
            <button class="alert-tab-btn" data-tab="undersupply">Undersupply (10)</button>
            <button class="alert-tab-btn" data-tab="oversupply">Oversupply (9)</button>
            <button class="alert-tab-btn" data-tab="growth">High Growth (5)</button>
          </div>

          <!-- Alerts Feed -->
          <div id="alertsFeedContainer">
            ${this.renderAlertCards("all")}
          </div>
        </div>

        <!-- Right Panel: Planning Recommendations -->
        <div class="card-panel">
          <div class="card-header-row">
            <span class="card-title">Planning Recommendations</span>
            <button class="action-btn-sm" style="display:flex; align-items:center; gap:4px;" id="btnDownloadReport">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download Report
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            <!-- Recommendation 1 -->
            <div class="recom-item-card">
              <div class="recom-icon" style="background:#ECFDF5; color:#059669;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </div>
              <div class="recom-text">
                <h4>Increase Training Capacity</h4>
                <p>Scale up training for 12 high-demand trades in 8 districts</p>
              </div>
            </div>

            <!-- Recommendation 2 -->
            <div class="recom-item-card">
              <div class="recom-icon" style="background:#FFF7ED; color:#EA580C;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="10" r="3"></circle><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path></svg>
              </div>
              <div class="recom-text">
                <h4>Consider New Centres</h4>
                <p>Set up 18 new training centres in identified districts</p>
              </div>
            </div>

            <!-- Recommendation 3 -->
            <div class="recom-item-card">
              <div class="recom-icon" style="background:#EFF6FF; color:#2563EB;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              </div>
              <div class="recom-text">
                <h4>Revise Curriculum</h4>
                <p>Update NSQF content for 5 emerging trades</p>
              </div>
            </div>

            <!-- Recommendation 4 -->
            <div class="recom-item-card">
              <div class="recom-icon" style="background:#FEF2F2; color:#DC2626;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div class="recom-text">
                <h4>Phase Out / Reduce Seats</h4>
                <p>Reduce intake for 7 oversupplied trades</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  renderAlertCards(filterType) {
    const list = (filterType === "all") 
      ? this.alertsList 
      : this.alertsList.filter(a => a.type === filterType);

    if (!list.length) {
      return `<p style="padding:20px; font-size:12px; color:var(--text-muted); text-align:center;">No alerts in this category.</p>`;
    }

    return list.map(a => `
      <div class="alert-item-card">
        <div class="alert-card-title ${a.titleColor}">${a.title}</div>
        <div class="alert-card-sub">${a.desc}</div>
        <div class="alert-card-footer">
          <div style="display:flex; gap:6px;">
            ${a.tags.map(t => `<span class="tag-badge">${t}</span>`).join("")}
          </div>
          <button class="action-btn-sm" onclick="alert('Viewing detailed telemetry for: ${a.title}')">View Details</button>
        </div>
      </div>
    `).join("");
  },

  bindEvents() {
    const tabBtns = document.querySelectorAll(".alert-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");
        const container = document.getElementById("alertsFeedContainer");
        if (container) {
          container.innerHTML = this.renderAlertCards(tab);
        }
      });
    });

    const btnMark = document.getElementById("btnMarkRead");
    if (btnMark) {
      btnMark.addEventListener("click", () => {
        btnMark.innerText = "All marked as read ✓";
        btnMark.style.color = "#059669";
      });
    }

    const btnDownload = document.getElementById("btnDownloadReport");
    if (btnDownload) {
      btnDownload.addEventListener("click", () => {
        window.location.href = "/api/v1/exports/dsdp-csv?district_lgd_code=158";
      });
    }
  }
};

window.AlertCenterModule = AlertCenterModule;
