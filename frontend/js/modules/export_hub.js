/**
 * Reports & Recommendations Module — "Planning Recommendations"
 * KaushalDrishti (कौशल दृष्टि)
 * Directly matches Panel 6 of the reference enterprise SaaS design layout.
 */

const ExportHubModule = {
  currentDistrict: 158, // Kanpur default

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-title-wrap" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div>
          <h2 data-i18n="recom_title" style="font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--text-primary);">Planning Recommendations</h2>
          <p data-i18n="recom_subtitle" style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">Actionable insights for training targets, curriculum and infrastructure</p>
        </div>
        <button class="btn-primary" id="btnDownloadReport">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          <span data-i18n="btn_download_report">Download Report</span>
        </button>
      </div>

      <!-- 3 Action Cards Grid (Matching reference Panel 6) -->
      <div class="recom-cards-grid">
        <!-- Card 1: Increase Training Capacity -->
        <div class="recom-card-box">
          <div>
            <div class="recom-top-row">
              <div style="width:36px; height:36px; border-radius:50%; background:var(--color-sage); color:#17604D; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              </div>
              <div style="flex:1;">
                <h4 style="font-size:13.5px; font-weight:700; color:var(--text-primary);">Increase Training Capacity</h4>
                <p style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">Scale up training for 12 high-demand trades in 8 districts</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
              <span style="font-size:10px; color:var(--text-secondary); font-weight:500;">Priority</span>
              <span style="font-size:10.5px; font-weight:700; color:var(--color-terracotta); background:var(--color-soft-coral); padding:2px 7px; border-radius:4px;">High</span>
            </div>
          </div>
          <div style="margin-top:14px;">
            <a href="#" style="color:var(--color-terracotta); font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              <span>View Details</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        <!-- Card 2: Revise Curriculum -->
        <div class="recom-card-box">
          <div>
            <div class="recom-top-row">
              <div style="width:36px; height:36px; border-radius:50%; background:rgba(242, 185, 104, 0.22); color:#B45309; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div style="flex:1;">
                <h4 style="font-size:13.5px; font-weight:700; color:var(--text-primary);">Revise Curriculum</h4>
                <p style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">Update NSQF content for 5 emerging trades</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
              <span style="font-size:10px; color:var(--text-secondary); font-weight:500;">Priority</span>
              <span style="font-size:10.5px; font-weight:700; color:#B45309; background:rgba(242, 185, 104, 0.22); padding:2px 7px; border-radius:4px;">Medium</span>
            </div>
          </div>
          <div style="margin-top:14px;">
            <a href="#" style="color:var(--color-terracotta); font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              <span>View Details</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        <!-- Card 3: Consider New Centres -->
        <div class="recom-card-box">
          <div>
            <div class="recom-top-row">
              <div style="width:36px; height:36px; border-radius:50%; background:var(--color-soft-coral); color:var(--color-terracotta); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/></svg>
              </div>
              <div style="flex:1;">
                <h4 style="font-size:13.5px; font-weight:700; color:var(--text-primary);">Consider New Centres</h4>
                <p style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">Set up 18 new training centres in underserved districts</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
              <span style="font-size:10px; color:var(--text-secondary); font-weight:500;">Priority</span>
              <span style="font-size:10.5px; font-weight:700; color:var(--color-terracotta); background:var(--color-soft-coral); padding:2px 7px; border-radius:4px;">High</span>
            </div>
          </div>
          <div style="margin-top:14px;">
            <a href="#" style="color:var(--color-terracotta); font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              <span>View Details</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Expected Impact (Next 3 Years) Banner -->
      <div class="expected-impact-banner" style="position:relative;">
        <div style="font-size:13.5px; font-weight:700; color:var(--text-primary); margin-bottom:12px;">
          Expected Impact (Next 3 Years)
        </div>
        <div class="impact-stats-row">
          <!-- Stat 1 -->
          <div class="impact-stat-item">
            <div style="width:36px; height:36px; border-radius:8px; background:var(--color-sage); color:#17604D; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="val" style="font-family:var(--font-display); color:var(--text-primary);">+1.2 Lakh</div>
              <div class="sub" style="color:var(--text-secondary);">Additional trained candidates</div>
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="impact-stat-item">
            <div style="width:36px; height:36px; border-radius:8px; background:var(--color-sage); color:#17604D; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div class="val" style="font-family:var(--font-display); color:var(--text-primary);">-40%</div>
              <div class="sub" style="color:var(--text-secondary);">Reduction in demand-supply gap</div>
            </div>
          </div>

          <!-- Stat 3 -->
          <div class="impact-stat-item">
            <div style="width:36px; height:36px; border-radius:8px; background:var(--color-sage); color:#17604D; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div>
              <div class="val" style="font-family:var(--font-display); color:var(--text-primary);">+28%</div>
              <div class="sub" style="color:var(--text-secondary);">Employment potential</div>
            </div>
          </div>

          <!-- Stat 4 -->
          <div class="impact-stat-item">
            <div style="width:36px; height:36px; border-radius:8px; background:rgba(242, 185, 104, 0.22); color:#B45309; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/></svg>
            </div>
            <div>
              <div class="val" style="font-family:var(--font-display); color:var(--text-primary);">18</div>
              <div class="sub" style="color:var(--text-secondary);">New centres recommended</div>
            </div>
          </div>
        </div>

        <!-- Heritage Foliage Watermark on Right -->
        <svg viewBox="0 0 100 80" width="80" height="60" style="position:absolute; right:10px; bottom:6px; opacity:0.18; pointer-events:none;" fill="none">
          <path d="M80 75 C 60 50, 40 35, 10 20" stroke="#D96843" stroke-width="2"/>
          <path d="M65 60 C 55 50, 45 55, 50 65 Z" fill="#D96843"/>
          <path d="M45 42 C 35 32, 25 38, 30 48 Z" fill="#F2B968"/>
        </svg>
      </div>

      <!-- District Skill Development Plan (DSDP) Operational Audit Section -->
      <div class="card-panel" style="margin-top:20px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div>
            <h3 class="card-title">DSDP Official MSDE Target Revisions</h3>
            <p style="font-size:11.5px; color:var(--text-secondary); margin-top:2px;">Automated district reallocation schedule compliant with MSDE Common Cost Norms</p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <select id="exportDistrictSelect" class="form-select filter-select" style="height:32px; font-size:12px;">
              <option value="158" selected>Kanpur Nagar, Uttar Pradesh (LGD 158)</option>
              <option value="492">Pune, Maharashtra (LGD 492)</option>
              <option value="365">Khordha / Bhubaneswar, Odisha (LGD 365)</option>
              <option value="160">Lucknow, Uttar Pradesh (LGD 160)</option>
              <option value="485">Mumbai, Maharashtra (LGD 485)</option>
            </select>
            <button class="btn-primary" id="btnDownloadCsv" style="height:32px; padding:0 12px; font-size:11.5px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              <span>Download Official CSV</span>
            </button>
          </div>
        </div>

        <table class="growth-table-wrap">
          <thead>
            <tr>
              <th>Trade Title</th>
              <th>Sector</th>
              <th>Action</th>
              <th>Current Sanctioned</th>
              <th>Target Delta</th>
              <th>Proposed Target</th>
              <th>Fiscal Impact</th>
            </tr>
          </thead>
          <tbody id="exportTableBody">
            <tr>
              <td><strong style="color:var(--text-primary);">Solar PV Installation Technician</strong></td>
              <td><span class="tag-badge">Green Jobs</span></td>
              <td><span style="color:#17604D; font-weight:700;">EXPAND (+100%)</span></td>
              <td>250</td>
              <td style="color:#17604D; font-weight:700;">+250</td>
              <td><strong style="color:var(--text-primary);">500</strong></td>
              <td style="color:#17604D; font-weight:600;">+₹32.5 Lakh</td>
            </tr>
            <tr>
              <td><strong style="color:var(--text-primary);">EV Diagnostic Specialist</strong></td>
              <td><span class="tag-badge">Automotive</span></td>
              <td><span style="color:#17604D; font-weight:700;">EXPAND (+80%)</span></td>
              <td>200</td>
              <td style="color:#17604D; font-weight:700;">+160</td>
              <td><strong style="color:var(--text-primary);">360</strong></td>
              <td style="color:#17604D; font-weight:600;">+₹20.8 Lakh</td>
            </tr>
            <tr>
              <td><strong style="color:var(--text-primary);">Data Entry Operator</strong></td>
              <td><span class="tag-badge">IT/ITeS</span></td>
              <td><span style="color:var(--color-terracotta); font-weight:700;">CURTAIL (-50%)</span></td>
              <td>800</td>
              <td style="color:var(--color-terracotta); font-weight:700;">-400</td>
              <td><strong style="color:var(--text-primary);">400</strong></td>
              <td style="color:#173F35; font-weight:600;">-₹52.0 Lakh (Freed)</td>
            </tr>
            <tr>
              <td><strong style="color:var(--text-primary);">Sewing Machine Operator</strong></td>
              <td><span class="tag-badge">Apparel</span></td>
              <td><span style="color:var(--color-terracotta); font-weight:700;">CURTAIL (-35%)</span></td>
              <td>600</td>
              <td style="color:var(--color-terracotta); font-weight:700;">-210</td>
              <td><strong style="color:var(--text-primary);">390</strong></td>
              <td style="color:#173F35; font-weight:600;">-₹27.3 Lakh (Freed)</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const csvBtn = document.getElementById("btnDownloadCsv");
    const distSelect = document.getElementById("exportDistrictSelect");
    const reportBtn = document.getElementById("btnDownloadReport");

    if (csvBtn) {
      csvBtn.addEventListener("click", () => {
        const lgd = distSelect ? distSelect.value : "158";
        window.open(`/api/v1/exports/dsdp-csv/${lgd}`, "_blank");
      });
    }

    if (reportBtn) {
      reportBtn.addEventListener("click", () => {
        const lgd = distSelect ? distSelect.value : "158";
        window.open(`/api/v1/exports/dsdp-csv/${lgd}`, "_blank");
      });
    }
  }
};

window.ExportHubModule = ExportHubModule;
