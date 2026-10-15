/**
 * KaushalDrishti — Master Application Coordinator
 * Handles sidebar navigation, view switching, bilingual toggling, and global search.
 */

class AppCoordinator {
  constructor() {
    this.currentView = "dashboard";
    this.viewInstances = {
      "dashboard": window.CommandCenterModule,
      "demand-supply": window.SectorsTradesModule,
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
            c.innerHTML = `
              <div class="page-header">
                <div class="page-title-wrap">
                  <h2>Data Explorer</h2>
                  <p>National cross-sectional skill diagnostic repository</p>
                </div>
              </div>
              <div class="card-panel">
                <table class="growth-table-wrap">
                  <thead>
                    <tr>
                      <th>NCO Code</th>
                      <th>Trade Classification</th>
                      <th>Sector</th>
                      <th>NSQF Level</th>
                      <th>National Demand</th>
                      <th>Trained Supply</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>7411.0101</strong></td><td>Solar PV Installation Technician</td><td>Green Jobs</td><td>Level 4</td><td>1,240</td><td>320</td><td><span class="badge-growth" style="background:#FEF2F2; color:#DC2626;">Critical Shortage</span></td></tr>
                    <tr><td><strong>7231.0102</strong></td><td>Electric Vehicle Diagnostic Specialist</td><td>Automotive</td><td>Level 5</td><td>980</td><td>210</td><td><span class="badge-growth" style="background:#FEF2F2; color:#DC2626;">Critical Shortage</span></td></tr>
                    <tr><td><strong>5321.0100</strong></td><td>General Duty Nursing Assistant</td><td>Healthcare</td><td>Level 4</td><td>1,650</td><td>680</td><td><span class="badge-growth" style="background:#FEF2F2; color:#DC2626;">Critical Shortage</span></td></tr>
                    <tr><td><strong>2511.0100</strong></td><td>Data Analyst / BI Specialist</td><td>IT/ITeS</td><td>Level 6</td><td>2,400</td><td>1,800</td><td><span class="badge-growth" style="background:#ECFDF5; color:#059669;">Balanced</span></td></tr>
                    <tr><td><strong>4132.0100</strong></td><td>Data Entry Operator</td><td>IT/ITeS</td><td>Level 3</td><td>450</td><td>2,800</td><td><span class="badge-growth" style="background:#FFFBEB; color:#D97706;">Severe Oversupply</span></td></tr>
                  </tbody>
                </table>
              </div>
            `;
          }
        }
      },
      "api-access": {
        async init(containerId) {
          const c = document.getElementById(containerId);
          if (c) {
            c.innerHTML = `
              <div class="page-header">
                <div class="page-title-wrap">
                  <h2>API Access & Developer Documentation</h2>
                  <p>RESTful OpenAPI endpoints powering the KaushalDrishti engine</p>
                </div>
              </div>
              <div class="card-panel" style="max-width: 800px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                  <span class="card-title">Production Endpoints</span>
                  <a href="/docs" target="_blank" class="btn-primary-blue" style="text-decoration:none;">Open Interactive Swagger Docs</a>
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
                  <div style="background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid #E2E8F0;">
                    <span style="background:#2563EB; color:white; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px;">GET</span>
                    <strong style="margin-left:8px;">/api/v1/intelligence/national-summary</strong> — National KPI totals and leaderboards
                  </div>
                  <div style="background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid #E2E8F0;">
                    <span style="background:#2563EB; color:white; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px;">GET</span>
                    <strong style="margin-left:8px;">/api/v1/intelligence/forecasts</strong> — Filtered trade-district forecasts (3M/6M/12M)
                  </div>
                  <div style="background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid #E2E8F0;">
                    <span style="background:#059669; color:white; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px;">POST</span>
                    <strong style="margin-left:8px;">/api/v1/simulation/simulate-gap</strong> — Real-time What-If policy reallocation engine
                  </div>
                  <div style="background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid #E2E8F0;">
                    <span style="background:#2563EB; color:white; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px;">GET</span>
                    <strong style="margin-left:8px;">/api/v1/exports/dsdp-csv</strong> — Download official MSDE DSDP annual allocation CSV
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
              <div class="page-header">
                <div class="page-title-wrap">
                  <h2>Settings & Policy Weights</h2>
                  <p>Configure analytical coefficients for the Composite Demand Index (CDI)</p>
                </div>
              </div>
              <div class="card-panel" style="max-width: 650px;">
                <div class="card-title" style="margin-bottom:16px;">CDI Component Parameters</div>
                <div style="display:flex; flex-direction:column; gap:16px;">
                  <div>
                    <label style="font-size:12.5px; font-weight:600; color:var(--text-main); display:flex; justify-content:space-between;">
                      <span>Vacancy Volume Weight (w_V)</span>
                      <span>0.35</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.35" style="width:100%;" disabled />
                  </div>
                  <div>
                    <label style="font-size:12.5px; font-weight:600; color:var(--text-main); display:flex; justify-content:space-between;">
                      <span>Growth Momentum Weight (w_G)</span>
                      <span>0.25</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.25" style="width:100%;" disabled />
                  </div>
                  <div>
                    <label style="font-size:12.5px; font-weight:600; color:var(--text-main); display:flex; justify-content:space-between;">
                      <span>Employer Hiring Breadth (w_H)</span>
                      <span>0.15</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.15" style="width:100%;" disabled />
                  </div>
                  <div>
                    <label style="font-size:12.5px; font-weight:600; color:var(--text-main); display:flex; justify-content:space-between;">
                      <span>Skill Dispersion Factor (w_S)</span>
                      <span>0.15</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.15" style="width:100%;" disabled />
                  </div>
                  <div>
                    <label style="font-size:12.5px; font-weight:600; color:var(--text-main); display:flex; justify-content:space-between;">
                      <span>Macro-Economic Proxy (w_M)</span>
                      <span>0.10</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value="0.10" style="width:100%;" disabled />
                  </div>
                  <div style="margin-top:10px;">
                    <button class="btn-primary-blue" onclick="alert('Settings saved successfully.')">Save Policy Parameters</button>
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

    // Default to "dashboard"
    await this.switchView("dashboard");
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
