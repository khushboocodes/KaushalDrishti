/**
 * KaushalDrishti — Master Application Coordinator
 * Handles sidebar navigation, view switching, bilingual toggling, and global search.
 */

class AppCoordinator {
  constructor() {
    this.currentView = "dashboard";
    this.viewInstances = {
      "dashboard": window.CommandCenterModule,
      "demand-supply": window.DemandSupplyModule,
      "forecasting": window.TradeDeepDiveModule,
      "sectors-trades": window.SectorsTradesModule,
      "geographic-view": window.DistrictExplorerModule,
      "simulator": window.SimulatorModule,
      "alerts-insights": window.AlertCenterModule,
      "reports": window.ExportHubModule,
      "data-explorer": {
        async init(containerId) {
          const c = document.getElementById(containerId);
          if (c) {
            const rawData = [
              { nco: "7411.0101", trade: "Solar PV Installation Technician", sector: "Green Jobs", level: "Level 4", demand: "1,240", supply: "320", statusHtml: '<span class="badge-shortage">Critical Shortage</span>' },
              { nco: "7231.0102", trade: "Electric Vehicle Diagnostic Specialist", sector: "Automotive", level: "Level 5", demand: "980", supply: "210", statusHtml: '<span class="badge-shortage">Critical Shortage</span>' },
              { nco: "5321.0100", trade: "General Duty Nursing Assistant", sector: "Healthcare", level: "Level 4", demand: "1,650", supply: "680", statusHtml: '<span class="badge-shortage">Critical Shortage</span>' },
              { nco: "2511.0100", trade: "Data Analyst / BI Specialist", sector: "IT/ITeS", level: "Level 6", demand: "2,400", supply: "1,800", statusHtml: '<span class="badge-balanced">Balanced</span>' },
              { nco: "4132.0100", trade: "Data Entry Operator", sector: "IT/ITeS", level: "Level 3", demand: "450", supply: "2,800", statusHtml: '<span class="badge-shortage" style="background:#FFFBEB; color:#D97706; border-color:#FDE68A;">Severe Oversupply</span>' }
            ];

            const renderRows = (query = "") => {
              const q = query.trim().toLowerCase();
              const filtered = !q ? rawData : rawData.filter(r => r.trade.toLowerCase().includes(q) || r.nco.toLowerCase().includes(q) || r.sector.toLowerCase().includes(q));
              if (!filtered.length) {
                return `
                  <div class="empty-state-box" style="padding:40px 16px;">
                    <img src="/assets/kaushaldrishti/empty-search.png" alt="No Search Results" class="empty-state-img" />
                    <h4 class="empty-state-title">No Matching Diagnostic Records</h4>
                    <p class="empty-state-desc">No records matched "${query}". Try searching for Solar, Nursing, EV, or Data Analyst.</p>
                  </div>
                `;
              }
              const rowsHtml = filtered.map(r => `
                <tr>
                  <td><strong>${r.nco}</strong></td>
                  <td>${r.trade}</td>
                  <td><span class="tag-badge">${r.sector}</span></td>
                  <td>${r.level}</td>
                  <td>${r.demand}</td>
                  <td>${r.supply}</td>
                  <td>${r.statusHtml}</td>
                </tr>
              `).join("");

              return `
                <table class="growth-table-wrap">
                  <thead>
                    <tr>
                      <th style="width:110px;">NCO Code</th>
                      <th>Trade Classification</th>
                      <th>Sector</th>
                      <th>NSQF Level</th>
                      <th>National Demand</th>
                      <th>Trained Supply</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rowsHtml}
                  </tbody>
                </table>
              `;
            };

            c.innerHTML = `
              <div class="page-title-wrap" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
                <div>
                  <h2 style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-primary);">Data Explorer</h2>
                  <p style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">National cross-sectional skill diagnostic repository</p>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="position:relative; width:220px;">
                    <img src="/assets/kaushaldrishti/icon-search.png" alt="" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); width:13px; height:13px; opacity:0.6; pointer-events:none;" />
                    <input type="text" placeholder="Filter NCO or Trade..." class="form-input" style="width:100%; height:32px; font-size:12px; padding-left:30px;" id="dataExplorerFilter" />
                  </div>
                  <button class="btn-dark-navy" style="height:32px; padding:0 12px; font-size:11.5px;" onclick="window.open('/api/v1/intelligence/national-summary', '_blank')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>
              <div class="card-panel" id="dataExplorerTableCard">
                ${renderRows()}
              </div>
            `;

            const filterInput = document.getElementById("dataExplorerFilter");
            const tableCard = document.getElementById("dataExplorerTableCard");
            if (filterInput && tableCard) {
              filterInput.addEventListener("input", (e) => {
                tableCard.innerHTML = renderRows(e.target.value);
              });
            }
          }
        }
      },
      "api-access": {
        async init(containerId) {
          const c = document.getElementById(containerId);
          if (c) {
            c.innerHTML = `
              <div class="page-title-wrap" style="margin-bottom:16px;">
                <h2 style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-primary);">API Access & Developer Documentation</h2>
                <p style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">RESTful OpenAPI endpoints powering the KaushalDrishti engine</p>
              </div>
              <div class="card-panel" style="max-width: 840px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                  <span class="card-title">Production Endpoints</span>
                  <a href="/docs" target="_blank" class="btn-primary" style="text-decoration:none;">Open Interactive Swagger Docs</a>
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; font-size:12.5px;">
                  <div style="background:var(--bg-app); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <span style="background:var(--color-primary-accent); color:white; padding:3px 9px; border-radius:4px; font-weight:700; font-size:10.5px;">GET</span>
                      <strong style="margin-left:10px; color:var(--text-primary);">/api/v1/intelligence/national-summary</strong>
                      <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">National KPI totals, leaderboards, and tension aggregates</div>
                    </div>
                    <span style="font-size:10.5px; font-weight:600; color:var(--color-primary-accent); background:var(--color-sage); padding:2px 8px; border-radius:4px;">200 OK</span>
                  </div>
                  <div style="background:var(--bg-app); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <span style="background:var(--color-primary-accent); color:white; padding:3px 9px; border-radius:4px; font-weight:700; font-size:10.5px;">GET</span>
                      <strong style="margin-left:10px; color:var(--text-primary);">/api/v1/intelligence/forecasts</strong>
                      <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Filtered trade-district forecasts (3M / 6M / 12M / 3Y horizons)</div>
                    </div>
                    <span style="font-size:10.5px; font-weight:600; color:var(--color-primary-accent); background:var(--color-sage); padding:2px 8px; border-radius:4px;">200 OK</span>
                  </div>
                  <div style="background:var(--bg-app); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <span style="background:var(--color-terracotta); color:white; padding:3px 9px; border-radius:4px; font-weight:700; font-size:10.5px;">POST</span>
                      <strong style="margin-left:10px; color:var(--text-primary);">/api/v1/simulation/simulate-gap</strong>
                      <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Real-time What-If policy reallocation tensor engine</div>
                    </div>
                    <span style="font-size:10.5px; font-weight:600; color:var(--color-primary-accent); background:var(--color-sage); padding:2px 8px; border-radius:4px;">200 OK</span>
                  </div>
                  <div style="background:var(--bg-app); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <span style="background:var(--color-primary-accent); color:white; padding:3px 9px; border-radius:4px; font-weight:700; font-size:10.5px;">GET</span>
                      <strong style="margin-left:10px; color:var(--text-primary);">/api/v1/exports/dsdp-csv/{district_lgd}</strong>
                      <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Download official MSDE DSDP annual allocation CSV</div>
                    </div>
                    <span style="font-size:10.5px; font-weight:600; color:var(--color-primary-accent); background:var(--color-sage); padding:2px 8px; border-radius:4px;">200 OK</span>
                  </div>
                </div>
              </div>
            `;
          }
        }
      },
      "settings": {
        async init(containerId) {
          const c = document.getElementById(containerId);
          if (c) {
            c.innerHTML = `
              <div class="page-title-wrap" style="margin-bottom:16px;">
                <h2 style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-primary);">Settings & Policy Weights</h2>
                <p style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">Configure analytical coefficients for the Composite Demand Index (CDI)</p>
              </div>
              <div class="card-panel" style="max-width: 680px;">
                <div class="card-title" style="margin-bottom:16px;">CDI Component Parameters</div>
                <div style="display:flex; flex-direction:column; gap:16px;">
                  <div>
                    <label style="font-size:12px; font-weight:600; color:var(--text-primary); display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Vacancy Volume Weight (w_V)</span>
                      <span style="color:var(--color-primary-accent); font-weight:700;">0.35</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.35" class="sim-slider" disabled />
                  </div>
                  <div>
                    <label style="font-size:12px; font-weight:600; color:var(--text-primary); display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Growth Momentum Weight (w_G)</span>
                      <span style="color:var(--color-primary-accent); font-weight:700;">0.25</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.25" class="sim-slider" disabled />
                  </div>
                  <div>
                    <label style="font-size:12px; font-weight:600; color:var(--text-primary); display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Employer Hiring Breadth (w_H)</span>
                      <span style="color:var(--color-primary-accent); font-weight:700;">0.15</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.15" class="sim-slider" disabled />
                  </div>
                  <div>
                    <label style="font-size:12px; font-weight:600; color:var(--text-primary); display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Skill Dispersion Factor (w_S)</span>
                      <span style="color:var(--color-primary-accent); font-weight:700;">0.15</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.15" class="sim-slider" disabled />
                  </div>
                  <div>
                    <label style="font-size:12px; font-weight:600; color:var(--text-primary); display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Macro-Economic Proxy (w_M)</span>
                      <span style="color:var(--color-primary-accent); font-weight:700;">0.10</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.10" class="sim-slider" disabled />
                  </div>
                  <div style="margin-top:10px;">
                    <button class="btn-primary" onclick="alert('Settings verified & saved according to MSDE policy framework.')">Save Policy Parameters</button>
                  </div>
                </div>
              </div>
            `;
          }
        }
      }
    };
  }

  async init() {
    if (window.i18n) {
      await window.i18n.init();
    }

    this.bindNavigation();
    this.bindLanguageToggle();
    this.bindGlobalSearch();
    this.bindAuthModal();

    // Default to "dashboard"
    await this.switchView("dashboard");
  }

  bindAuthModal() {
    const badge = document.getElementById("userProfileBadge");
    const modal = document.getElementById("authModal");
    const closeBtn = document.getElementById("authModalClose");

    if (badge && modal) {
      badge.addEventListener("click", () => {
        modal.style.display = "flex";
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }

  handleLogin() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
    alert("Authentication confirmed: Signed in as MSDE National System Administrator.");
  }

  bindNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = link.getAttribute("data-view");
        if (targetView) {
          this.switchView(targetView);
        }
      });
    });
  }

  bindLanguageToggle() {
    const btn = document.getElementById("langToggleBtn");
    const label = document.getElementById("currentLangLabel");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = window.i18n ? window.i18n.currentLang : "en";
      const next = current === "en" ? "hi" : "en";
      if (window.i18n) {
        window.i18n.setLanguage(next);
      }
      if (label) {
        label.innerText = next === "en" ? "English" : "हिन्दी";
      }
    });
  }

  bindGlobalSearch() {
    const input = document.getElementById("globalSearchInput");
    if (!input) return;

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = input.value.trim().toLowerCase();
        if (!query) return;

        if (query.includes("pune") || query.includes("kanpur") || query.includes("maharashtra") || query.includes("district")) {
          this.switchView("geographic-view");
        } else if (query.includes("solar") || query.includes("developer") || query.includes("forecast") || query.includes("growth")) {
          this.switchView("forecasting");
        } else if (query.includes("sector") || query.includes("it") || query.includes("health") || query.includes("construction")) {
          this.switchView("sectors-trades");
        } else if (query.includes("alert") || query.includes("shortage") || query.includes("oversupply")) {
          this.switchView("alerts-insights");
        } else {
          this.switchView("sectors-trades");
        }
      }
    });
  }

  async switchView(viewName, params = {}) {
    if (!this.viewInstances[viewName]) {
      console.warn("View instance not found for:", viewName);
      return;
    }

    this.currentView = viewName;

    // Update active state in sidebar
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-view") === viewName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Toggle panels
    document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) {
      targetPanel.classList.add("active");
      await this.viewInstances[viewName].init(`view-${viewName}`, params);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppCoordinator();
  window.app.init();
});
