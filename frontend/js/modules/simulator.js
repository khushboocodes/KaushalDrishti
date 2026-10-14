const SimulatorModule = {
  selectedDistrict: 158, // Kanpur Nagar default
  selectedNco: "7411.0101", // Solar PV default
  debounceTimer: null,

  async init(containerId, params = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (params.district_lgd_code) this.selectedDistrict = params.district_lgd_code;
    if (params.nco_code) this.selectedNco = params.nco_code;

    container.innerHTML = `
      <div class="sim-hero">
        <h2 class="section-title" data-i18n="sim_title">Policy Decision Support & "What-If" Capacity Sandbox</h2>
        <p class="section-subtitle" data-i18n="sim_subtitle">Simulate adding or reallocating training batches, test dropout sensitivity, and evaluate real-time gap reduction before committing targets</p>
      </div>

      <!-- Simulator Layout: 2-Columns (Controls on Left, Comparative Impact on Right) -->
      <div class="sim-layout-grid">
        <!-- Controls Panel -->
        <div class="panel sim-controls-panel">
          <div class="panel-header">
            <h3 class="panel-title">Policy Levers & Capacity Parameters</h3>
            <button class="btn btn-sm btn-ghost" id="btnResetSim" data-i18n="btn_reset">Reset</button>
          </div>

          <div class="sim-form-group">
            <label class="form-label">Select Target District</label>
            <select id="simDistrictSelect" class="form-select">
              <option value="158">Kanpur Nagar, UP (LGD 158)</option>
              <option value="492">Pune, MH (LGD 492)</option>
              <option value="365">Khordha / Bhubaneswar, OD (LGD 365)</option>
              <option value="160">Lucknow, UP (LGD 160)</option>
              <option value="148">Gautam Buddha Nagar / Noida, UP (LGD 148)</option>
              <option value="485">Mumbai, MH (LGD 485)</option>
              <option value="376">Sundargarh / Rourkela, OD (LGD 376)</option>
            </select>
          </div>

          <div class="sim-form-group">
            <label class="form-label">Select Target Trade</label>
            <select id="simTradeSelect" class="form-select">
              <option value="7411.0101">Solar PV Installation & Maintenance Technician</option>
              <option value="7231.0102">Automotive Service Technician (Electric Vehicle)</option>
              <option value="7223.0501">CNC Machinist & Precision Operator</option>
              <option value="5321.0100">General Duty Assistant (Healthcare GDA)</option>
              <option value="4132.0100">Domestic Data Entry Operator (DEO)</option>
              <option value="3514.0201">AI Model Data Annotator & Prompt Verifier</option>
              <option value="3513.0100">Cybersecurity SOC Analyst (L1)</option>
            </select>
          </div>

          <hr class="divider-subtle my-3" />

          <!-- Interactive Sliders -->
          <div class="slider-block">
            <div class="slider-header">
              <span class="slider-title" data-i18n="sim_seats_slider">Sanctioned Seats Adjustment</span>
              <span class="slider-badge" id="valSeatDelta">+0 Seats</span>
            </div>
            <input type="range" id="rngSeatDelta" min="-300" max="600" step="20" value="0" class="sim-slider" />
            <div class="slider-subtext">Drag right to add training batches (+), left to curtail oversupply (-)</div>
          </div>

          <div class="slider-block">
            <div class="slider-header">
              <span class="slider-title" data-i18n="sim_enrollment_slider">Assumed Enrolment Rate (alpha)</span>
              <span class="slider-badge" id="valEnrollment">85%</span>
            </div>
            <input type="range" id="rngEnrollment" min="50" max="100" step="1" value="85" class="sim-slider" />
          </div>

          <div class="slider-block">
            <div class="slider-header">
              <span class="slider-title" data-i18n="sim_dropout_slider">Assumed Dropout Rate (beta)</span>
              <span class="slider-badge" id="valDropout">15%</span>
            </div>
            <input type="range" id="rngDropout" min="5" max="40" step="1" value="15" class="sim-slider" />
          </div>

          <div class="slider-block">
            <div class="slider-header">
              <span class="slider-title" data-i18n="sim_retention_slider">Local Geographic Retention (mu)</span>
              <span class="slider-badge" id="valRetention">72%</span>
            </div>
            <input type="range" id="rngRetention" min="40" max="95" step="1" value="72" class="sim-slider" />
          </div>
        </div>

        <!-- Comparative Output Panel -->
        <div class="panel sim-output-panel">
          <div class="panel-header">
            <h3 class="panel-title">Before vs After Policy Impact Tensor</h3>
            <span class="live-pulse-badge">Live Simulation</span>
          </div>

          <!-- Comparison Cards Grid -->
          <div class="sim-compare-grid">
            <!-- Baseline Card -->
            <div class="sim-card baseline-card">
              <div class="sim-card-tag">Current Policy Baseline</div>
              <div class="sim-metric-row">
                <span class="s-lbl">Sanctioned Seats:</span>
                <span class="s-val" id="baseSeats">-</span>
              </div>
              <div class="sim-metric-row">
                <span class="s-lbl">Effective Available Supply:</span>
                <span class="s-val" id="baseSupply">-</span>
              </div>
              <div class="sim-metric-row">
                <span class="s-lbl">Net Gap:</span>
                <span class="s-val text-red font-bold" id="baseGap">-</span>
              </div>
              <div class="sim-metric-row">
                <span class="s-lbl">Labor Tension Ratio:</span>
                <span class="s-val" id="baseTension">-</span>
              </div>
              <div class="sim-status-box mt-3">
                <span class="status-badge" id="baseFlag">Critical Shortage</span>
              </div>
            </div>

            <!-- Simulated Card -->
            <div class="sim-card simulated-card">
              <div class="sim-card-tag text-accent font-bold">Simulated Policy Outcome</div>
              <div class="sim-metric-row">
                <span class="s-lbl">New Sanctioned Target:</span>
                <span class="s-val text-accent font-bold" id="simSeats">-</span>
              </div>
              <div class="sim-metric-row">
                <span class="s-lbl">New Effective Supply:</span>
                <span class="s-val" id="simSupply">-</span>
              </div>
              <div class="sim-metric-row">
                <span class="s-lbl">New Net Gap:</span>
                <span class="s-val font-bold" id="simGap">-</span>
              </div>
              <div class="sim-metric-row">
                <span class="s-lbl">New Tension Ratio:</span>
                <span class="s-val" id="simTension">-</span>
              </div>
              <div class="sim-status-box mt-3">
                <span class="status-badge" id="simFlag">Balanced Equilibrium</span>
              </div>
            </div>
          </div>

          <!-- Impact Metrics Strip -->
          <div class="impact-banner mt-4">
            <div class="impact-stat">
              <div class="impact-val" id="statMitigated">0%</div>
              <div class="impact-lbl" data-i18n="sim_gap_reduction">Deficit Mitigated</div>
            </div>
            <div class="impact-stat">
              <div class="impact-val text-teal" id="statTrained">+0</div>
              <div class="impact-lbl">Net Added Workers</div>
            </div>
            <div class="impact-stat">
              <div class="impact-val" id="statBudget">0 L</div>
              <div class="impact-lbl">Est. Fiscal Delta</div>
            </div>
          </div>

          <!-- Policy Feedback Advice Box -->
          <div class="policy-advice-card mt-3">
            <div class="advice-header">
              <svg class="icon-sm text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <strong>Policy Prescription:</strong>
            </div>
            <p class="advice-text" id="adviceText">Adjust sliders to model capacity shifts.</p>
          </div>

          <div class="sim-actions-footer mt-4">
            <button class="btn btn-primary w-full" id="btnCommitPlan">
              Commit Target Allocation to Draft DSDP
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    await this.runSimulation();
  },

  bindEvents() {
    const selDist = document.getElementById("simDistrictSelect");
    const selTrade = document.getElementById("simTradeSelect");
    const rngSeats = document.getElementById("rngSeatDelta");
    const rngEnr = document.getElementById("rngEnrollment");
    const rngDrop = document.getElementById("rngDropout");
    const rngRet = document.getElementById("rngRetention");
    const btnReset = document.getElementById("btnResetSim");
    const btnCommit = document.getElementById("btnCommitPlan");

    selDist.value = this.selectedDistrict;
    selTrade.value = this.selectedNco;

    selDist.addEventListener("change", (e) => {
      this.selectedDistrict = parseInt(e.target.value, 10);
      this.runSimulation();
    });

    selTrade.addEventListener("change", (e) => {
      this.selectedNco = e.target.value;
      this.runSimulation();
    });

    const triggerDebounced = () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.runSimulation(), 40);
    };

    rngSeats.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      document.getElementById("valSeatDelta").textContent = `${v >= 0 ? '+' : ''}${v} Seats`;
      triggerDebounced();
    });

    rngEnr.addEventListener("input", (e) => {
      document.getElementById("valEnrollment").textContent = `${e.target.value}%`;
      triggerDebounced();
    });

    rngDrop.addEventListener("input", (e) => {
      document.getElementById("valDropout").textContent = `${e.target.value}%`;
      triggerDebounced();
    });

    rngRet.addEventListener("input", (e) => {
      document.getElementById("valRetention").textContent = `${e.target.value}%`;
      triggerDebounced();
    });

    btnReset.addEventListener("click", () => {
      rngSeats.value = 0;
      rngEnr.value = 85;
      rngDrop.value = 15;
      rngRet.value = 72;
      document.getElementById("valSeatDelta").textContent = "+0 Seats";
      document.getElementById("valEnrollment").textContent = "85%";
      document.getElementById("valDropout").textContent = "15%";
      document.getElementById("valRetention").textContent = "72%";
      this.runSimulation();
    });

    btnCommit.addEventListener("click", () => {
      alert(`Target allocation committed to draft District Skill Development Plan for District LGD ${this.selectedDistrict}!`);
    });
  },

  async runSimulation() {
    const seatDelta = parseInt(document.getElementById("rngSeatDelta").value, 10);
    const enrRate = parseInt(document.getElementById("rngEnrollment").value, 10) / 100.0;
    const dropRate = parseInt(document.getElementById("rngDropout").value, 10) / 100.0;
    const retRate = parseInt(document.getElementById("rngRetention").value, 10) / 100.0;

    try {
      const res = await API.simulateGap({
        district_lgd_code: this.selectedDistrict,
        nco_code: this.selectedNco,
        seat_capacity_delta: seatDelta,
        assumed_enrollment_rate: enrRate,
        assumed_dropout_rate: dropRate,
        assumed_retention_rate: retRate,
        horizon: "12M"
      });

      // Update Baseline Card
      document.getElementById("baseSeats").textContent = res.baseline.sanctioned_seats.toLocaleString();
      document.getElementById("baseSupply").textContent = res.baseline.effective_supply.toLocaleString();
      const bGap = res.baseline.absolute_gap;
      document.getElementById("baseGap").textContent = `${bGap > 0 ? '+' : ''}${bGap.toLocaleString()}`;
      document.getElementById("baseTension").textContent = `${res.baseline.tension_ratio}x`;
      
      const bFlag = document.getElementById("baseFlag");
      bFlag.textContent = res.baseline.risk_category;
      bFlag.style.backgroundColor = `${res.baseline.badge_color}22`;
      bFlag.style.color = res.baseline.badge_color;

      // Update Simulated Card
      document.getElementById("simSeats").textContent = res.simulated.sanctioned_seats.toLocaleString();
      document.getElementById("simSupply").textContent = res.simulated.effective_supply.toLocaleString();
      const sGap = res.simulated.absolute_gap;
      const simGapEl = document.getElementById("simGap");
      simGapEl.textContent = `${sGap > 0 ? '+' : ''}${sGap.toLocaleString()}`;
      simGapEl.className = sGap > 0 ? "s-val text-red font-bold" : (sGap < -50 ? "s-val text-purple font-bold" : "s-val text-green font-bold");

      document.getElementById("simTension").textContent = `${res.simulated.tension_ratio}x`;

      const sFlag = document.getElementById("simFlag");
      sFlag.textContent = res.simulated.risk_category;
      sFlag.style.backgroundColor = `${res.simulated.badge_color}22`;
      sFlag.style.color = res.simulated.badge_color;

      // Update Impact Strip
      document.getElementById("statMitigated").textContent = `${res.impact_assessment.gap_reduction_pct}%`;
      const added = res.impact_assessment.additional_trained_workers;
      document.getElementById("statTrained").textContent = `${added >= 0 ? '+' : ''}${added.toLocaleString()}`;
      
      const fiscalLakhs = roundTo2((seatDelta * 300 * 45) / 100000);
      document.getElementById("statBudget").textContent = `${fiscalLakhs >= 0 ? '+' : ''}${fiscalLakhs} L`;

      document.getElementById("adviceText").textContent = res.impact_assessment.policy_feedback;

    } catch (err) {
      console.error("Simulation request failed:", err);
    }
  }
};

function roundTo2(num) {
  return Math.round(num * 100) / 100;
}

window.SimulatorModule = SimulatorModule;
