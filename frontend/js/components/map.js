class IndiaMapComponent {
  constructor(containerId, onStateSelect) {
    this.container = document.getElementById(containerId);
    this.onStateSelect = onStateSelect;
    this.stateData = {};
  }

  setData(stateAggregates) {
    this.stateData = {};
    stateAggregates.forEach(s => {
      this.stateData[s.state_name] = s;
    });
    this.render();
  }

  render() {
    if (!this.container) return;

    // Premium Stylized SVG Map of India with Pilot State Paths & Geospatial Tension Rings
    this.container.innerHTML = `
      <div class="map-wrapper">
        <svg viewBox="0 0 800 900" class="india-svg" id="indiaMapSvg">
          <defs>
            <!-- Gradients -->
            <linearGradient id="gradShortage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#b91c1c" stop-opacity="0.95"/>
            </linearGradient>
            <linearGradient id="gradBalanced" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#047857" stop-opacity="0.95"/>
            </linearGradient>
            <linearGradient id="gradOversupply" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a855f7" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#7e22ce" stop-opacity="0.95"/>
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- National Base Silhouette (India Boundary Outline) -->
          <path class="national-boundary" d="
            M 360,50 L 390,70 L 420,110 L 410,160 L 370,180 L 320,190 L 280,240 
            L 220,290 L 210,340 L 230,400 L 270,440 L 260,510 L 320,620 L 360,720 
            L 400,810 L 410,870 L 430,810 L 480,720 L 530,620 L 560,540 L 540,460 
            L 600,410 L 670,390 L 730,340 L 710,290 L 640,300 L 580,310 L 520,280 
            L 470,230 L 430,220 L 380,180 Z" />

          <!-- ================= UTTAR PRADESH ================= -->
          <g class="state-group" id="state-up" data-state="Uttar Pradesh">
            <path class="state-poly state-up" d="
              M 350,260 L 440,240 L 510,290 L 490,360 L 450,380 L 390,360 L 350,310 Z" />
            <circle class="state-node node-up" cx="420" cy="310" r="16" />
            <text class="state-label" x="420" y="315">UP</text>
          </g>

          <!-- ================= MAHARASHTRA ================= -->
          <g class="state-group" id="state-mh" data-state="Maharashtra">
            <path class="state-poly state-mh" d="
              M 260,450 L 340,430 L 430,460 L 450,520 L 380,590 L 290,560 L 260,510 Z" />
            <circle class="state-node node-mh" cx="340" cy="505" r="16" />
            <text class="state-label" x="340" y="510">MH</text>
          </g>

          <!-- ================= ODISHA ================= -->
          <g class="state-group" id="state-od" data-state="Odisha">
            <path class="state-poly state-od" d="
              M 480,450 L 550,440 L 580,490 L 540,560 L 490,540 L 470,490 Z" />
            <circle class="state-node node-od" cx="525" cy="495" r="15" />
            <text class="state-label" x="525" y="500">OD</text>
          </g>

          <!-- Other Major Metro Nodes (Benchmark Centers) -->
          <g class="metro-node" title="Delhi NCR">
            <circle cx="360" cy="270" r="7" class="hub-circle" />
            <text x="372" y="274" class="hub-label">Delhi NCR</text>
          </g>
          <g class="metro-node" title="Bengaluru, Karnataka">
            <circle cx="370" cy="670" r="7" class="hub-circle" />
            <text x="382" y="674" class="hub-label">Bengaluru</text>
          </g>
          <g class="metro-node" title="Hyderabad, Telangana">
            <circle cx="410" cy="580" r="7" class="hub-circle" />
            <text x="422" y="584" class="hub-label">Hyderabad</text>
          </g>
        </svg>

        <!-- Interactive Map Floating Tooltip -->
        <div id="mapTooltip" class="map-tooltip hidden">
          <div class="tooltip-header" id="ttTitle">Uttar Pradesh</div>
          <div class="tooltip-metrics">
            <div class="tt-metric">
              <span class="tt-lbl">Tension:</span>
              <span class="tt-val" id="ttTension">1.45x</span>
            </div>
            <div class="tt-metric">
              <span class="tt-lbl">Net Gap:</span>
              <span class="tt-val text-red" id="ttGap">+4,210</span>
            </div>
          </div>
          <div class="tt-alert" id="ttAlert">Critical Shortage: Solar PV Technician</div>
          <div class="tt-hint">Click state to drill down into districts -></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const tooltip = document.getElementById("mapTooltip");
    const ttTitle = document.getElementById("ttTitle");
    const ttTension = document.getElementById("ttTension");
    const ttGap = document.getElementById("ttGap");
    const ttAlert = document.getElementById("ttAlert");

    this.container.querySelectorAll(".state-group").forEach(el => {
      const stateName = el.getAttribute("data-state");
      const stateInfo = this.stateData[stateName];

      el.addEventListener("mouseenter", (e) => {
        if (!stateInfo) return;
        ttTitle.textContent = stateName;
        ttTension.textContent = `${stateInfo.tension_ratio}x`;
        ttGap.textContent = stateInfo.net_gap > 0 ? `+${stateInfo.net_gap.toLocaleString()}` : stateInfo.net_gap.toLocaleString();
        ttGap.className = stateInfo.net_gap > 0 ? "tt-val text-red" : "tt-val text-purple";
        
        ttAlert.textContent = stateInfo.critical_shortage_count > 0 
          ? `High Urgency: ${stateInfo.critical_shortage_count} Critical Shortages`
          : `Balanced / Saturation: ${stateInfo.severe_oversupply_count} Surplus Trades`;
        
        tooltip.classList.remove("hidden");
      });

      el.addEventListener("mousemove", (e) => {
        const rect = this.container.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 15}px`;
        tooltip.style.top = `${e.clientY - rect.top - 20}px`;
      });

      el.addEventListener("mouseleave", () => {
        tooltip.classList.add("hidden");
      });

      el.addEventListener("click", () => {
        if (this.onStateSelect) {
          this.onStateSelect(stateName);
        }
      });
    });
  }
}

window.IndiaMapComponent = IndiaMapComponent;
