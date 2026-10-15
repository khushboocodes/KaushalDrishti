/**
 * Alerts & Insights Module — "Alerts & Insights"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches Panel 5 of the reference enterprise SaaS design layout.
 */

const AlertCenterModule = {
  currentTab: "all",

  alertsList: [
    {
      id: "alt_1",
      category: "undersupply",
      title: "Acute Shortage – Solar PV Technician (7412.03)",
      titleColor: "var(--color-terracotta)",
      desc: "Projected undersupply of 18,000 candidates in 2026",
      tags: [
        { label: "Green Jobs", color: "#17604D", bg: "var(--color-sage)" },
        { label: "6 districts", color: "var(--color-terracotta)", bg: "var(--color-soft-coral)" },
        { label: "2 hours ago", color: "var(--text-secondary)", bg: "var(--bg-app)" }
      ],
      iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-terracotta)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      iconBg: "var(--color-soft-coral)"
    },
    {
      id: "alt_2",
      category: "oversupply",
      title: "Approaching Saturation – Data Entry Operator (4120.01)",
      titleColor: "#B45309",
      desc: "Oversupply expected in 12 districts by 2026",
      tags: [
        { label: "IT/ITeS", color: "#17604D", bg: "rgba(23, 96, 77, 0.08)" },
        { label: "12 districts", color: "#B45309", bg: "rgba(242, 185, 104, 0.22)" },
        { label: "5 hours ago", color: "var(--text-secondary)", bg: "var(--bg-app)" }
      ],
      iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      iconBg: "rgba(242, 185, 104, 0.22)"
    },
    {
      id: "alt_3",
      category: "growth",
      title: "High Growth Opportunity – AI/ML Engineer (2512.01)",
      titleColor: "#17604D",
      desc: "Demand expected to grow by 35% in next 3 years",
      tags: [
        { label: "IT/ITeS", color: "#17604D", bg: "rgba(23, 96, 77, 0.08)" },
        { label: "8 districts", color: "#17604D", bg: "var(--color-sage)" },
        { label: "1 day ago", color: "var(--text-secondary)", bg: "var(--bg-app)" }
      ],
      iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#17604D" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      iconBg: "var(--color-sage)"
    }
  ],

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-title-wrap" style="margin-bottom:16px;">
        <h2 data-i18n="alerts_main_title" style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-primary);">Alerts & Insights</h2>
        <p data-i18n="alerts_main_subtitle" style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">Early warnings for emerging shortages and saturation risks</p>
      </div>

      <!-- Filter Subtabs -->
      <div class="alert-subtabs">
        <button class="alert-tab-btn active" data-tab="all">All Alerts (24)</button>
        <button class="alert-tab-btn" data-tab="undersupply">Undersupply (10)</button>
        <button class="alert-tab-btn" data-tab="oversupply">Oversupply (8)</button>
        <button class="alert-tab-btn" data-tab="growth">High Growth (6)</button>
      </div>

      <!-- Two-Column Layout: Left Alerts List (1.6fr) vs Right Insight Summary (1fr) -->
      <div class="two-col-grid" style="grid-template-columns: 1.6fr 1fr;">
        <!-- Left: Alerts List -->
        <div id="alertsFeedContainer" style="display:flex; flex-direction:column; gap:12px;">
          ${this.renderAlertCards("all")}
        </div>

        <!-- Right: Insight Summary Box with Heritage Artwork -->
        <div class="card-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-terracotta)" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <h3 style="font-size:15px; font-weight:700; color:var(--text-primary); font-family:var(--font-display);">Insight Summary</h3>
            </div>

            <p style="font-size:12.5px; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">
              Healthcare and Green Jobs show strong demand across <strong style="color:var(--text-primary);">70%</strong> of districts, while data entry and basic IT support roles are approaching saturation in urban areas.
            </p>

            <a href="#" style="color:var(--color-terracotta); font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-bottom:20px;">
              <span>View Full Report</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Bottom Heritage & Skilled Worker SVG Artwork -->
          <div style="background:var(--bg-sidebar); border:1px solid var(--border-color); border-radius:12px; padding:16px; text-align:center;">
            <svg viewBox="0 0 260 110" width="100%" height="95" fill="none">
              <!-- Indian Monuments in Background (India gate + domes) -->
              <path d="M20 90h220v2H20z" fill="var(--color-terracotta)" opacity="0.6"/>
              <rect x="90" y="35" width="40" height="55" fill="var(--color-saffron)" opacity="0.4"/>
              <path d="M85 35h50v4h-50z" fill="var(--color-terracotta)" opacity="0.7"/>
              <path d="M100 55c0-6 10-6 10-6s10 0 10 6v35h-20V55z" fill="#FFFDF9"/>
              <circle cx="110" cy="45" r="2" fill="var(--color-terracotta)"/>

              <!-- Left Temple / Chhatri -->
              <path d="M40 90V45l8-6 8 6v45H40z" fill="var(--color-saffron)" opacity="0.5"/>
              <circle cx="48" cy="36" r="2" fill="var(--color-terracotta)"/>

              <!-- Right Stupa / Fort -->
              <path d="M165 90V45c0-8 12-12 12-12s12 4 12 12v45h-24z" fill="var(--color-soft-coral)" opacity="0.5"/>
              <circle cx="177" cy="30" r="2" fill="var(--color-terracotta)"/>

              <!-- Worker 1 (Engineer with Hard Hat) -->
              <g transform="translate(65, 55)">
                <circle cx="10" cy="8" r="5" fill="#D97706"/>
                <path d="M5 6c0-4 10-4 10 0v2H5V6z" fill="var(--color-saffron)"/>
                <path d="M4 18c0-5 4-7 8-7s8 2 8 7v17H4V18z" fill="#17604D"/>
              </g>

              <!-- Worker 2 (Healthcare Professional / Nurse) -->
              <g transform="translate(100, 52)">
                <circle cx="10" cy="8" r="5" fill="#D97706"/>
                <path d="M4 18c0-5 4-7 8-7s8 2 8 7v20H4V18z" fill="#17604D"/>
                <path d="M9 16h4M11 14v4" stroke="#FFFFFF" stroke-width="1.5"/>
              </g>

              <!-- Worker 3 (Solar PV / Technician with tool) -->
              <g transform="translate(135, 54)">
                <circle cx="10" cy="8" r="5" fill="#D97706"/>
                <path d="M5 5c0-3 10-3 10 0v3H5V5z" fill="var(--color-terracotta)"/>
                <path d="M4 18c0-5 4-7 8-7s8 2 8 7v18H4V18z" fill="#173F35"/>
                <line x1="16" y1="18" x2="22" y2="12" stroke="#64716D" stroke-width="2"/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  renderAlertCards(tab) {
    const list = tab === "all" ? this.alertsList : this.alertsList.filter(a => a.category === tab);
    if (!list.length) {
      return `<div style="padding:20px; text-align:center; color:var(--text-secondary); font-size:13px;">No alerts in this category.</div>`;
    }

    return list.map(item => `
      <div class="alert-item-card" style="display:flex; align-items:flex-start; justify-content:space-between; gap:14px; background:var(--color-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px;">
        <div style="display:flex; align-items:flex-start; gap:12px;">
          <div style="width:34px; height:34px; border-radius:6px; background:${item.iconBg}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ${item.iconSvg}
          </div>
          <div>
            <h4 style="font-size:13.5px; font-weight:700; color:var(--text-primary); margin-bottom:3px;">${item.title}</h4>
            <p style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">${item.desc}</p>
            <div style="display:flex; align-items:center; gap:6px;">
              ${item.tags.map(t => `<span style="font-size:10.5px; font-weight:600; padding:2px 7px; border-radius:4px; color:${t.color}; background:${t.bg};">${t.label}</span>`).join("")}
            </div>
          </div>
        </div>
        <button class="action-btn-sm" style="flex-shrink:0; font-weight:600; color:var(--text-primary); border:1px solid var(--border-color); background:var(--bg-app); border-radius:6px; padding:6px 12px; cursor:pointer;">
          View Details
        </button>
      </div>
    `).join("");
  },

  bindEvents() {
    const tabs = document.querySelectorAll(".alert-tab-btn");
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        const feed = document.getElementById("alertsFeedContainer");
        if (feed) {
          feed.innerHTML = this.renderAlertCards(btn.dataset.tab);
        }
      });
    });
  }
};

window.AlertCenterModule = AlertCenterModule;
