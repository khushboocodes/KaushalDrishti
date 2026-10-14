# Project KaushalDrishti (कौशल दृष्टि)
## Hackathon Evaluation & Submission Checklist
### Problem Statement ID: 26246 — Ministry of Skill Development and Entrepreneurship (MSDE)

---

### 1. Mandatory Problem Statement Requirements Mapping

| Problem Statement Requirement | KaushalDrishti Feature Implementation | Verification Location |
| :--- | :--- | :--- |
| **"Functioning forecasting dashboard covering at least a few pilot sectors and States"** | Full interactive dashboard covering 3 Pilot States (UP, MH, OD) across 4 Pilot Sectors (Solar PV, EV/Automotive, Healthcare, IT-ITeS). | Module 1 (Command Center) & Module 2 (District Explorer) |
| **"Documented methodology for combining heterogeneous labour market data sources into a single demand index"** | Formal mathematical Composite Demand Index (CDI): $0.35V + 0.25G + 0.15H + 0.15S + 0.10M$ combining vacancy volumes, growth momentum, hiring breadth, skill frequency, and macro economic proxies. | [PRD_KaushalDrishti.md](file:///c:/Users/loq/Downloads/KaushalDrishti/PRD_KaushalDrishti.md#L305-L335) & `engine/analytics/cdi_engine.py` |
| **"Early-warning flags for trades approaching saturation or acute shortage"** | Deterministic 5-State Early Warning Radar State Machine with accessible non-color exclusive indicators, priority weights, and prescriptive administrative interventions. | Module 4 (Early Warning Radar) & `engine/analytics/early_warning.py` |
| **"API / export layer so forecasts can feed into scheme target-setting workflows"** | FastAPI OpenAPI 3.0 REST endpoints (`/api/v1/intelligence/forecasts`, `/api/v1/simulation/simulate-gap`) + Downloadable MSDE-compliant DSDP CSV / Excel target packages. | Module 6 (Target Export), `/docs` Swagger UI & `engine/export/exporter.py` |
| **"Multilingual, accessible interface for state-level planning units"** | Full bilingual localization in English & Hindi (हिन्दी) with instant client-side toggling; WCAG 2.1 AA accessible contrast ratios ($\ge 4.5:1$). | Header Language Switcher & `frontend/locales/` |

---

### 2. Live Demo Script (5-Minute Evaluation Walkthrough)

1. **Step 1: Executive Macro Overview (Module 1)**
   - Open root `/` $\rightarrow$ National Command Center.
   - Point out top KPI cards: 1.17M Projected Demand, Effective Pipeline Supply, Net Mismatch Gap (+400K), and Data Freshness.
   - Hover over **Uttar Pradesh (UP)**, **Maharashtra (MH)**, and **Odisha (OD)** on the interactive India Choropleth map to show real-time state tension ratios.
2. **Step 2: Geographic & Trade Drill-down (Module 2)**
   - Switch to **District Explorer** or click on Maharashtra.
   - Filter by **Pune (LGD 492)** $\rightarrow$ Highlight acute shortage in *EV Service Technician* (+65,647 gap).
   - Filter by **Kanpur Nagar (LGD 158)** $\rightarrow$ Highlight *Solar PV Installation Technician* demand pull.
   - Review the **Dual Funnel visualization**: compare industry demand against the leaky training pipeline (Sanctioned $\rightarrow$ Enrolled $\rightarrow$ Completed $\rightarrow$ Certified $\rightarrow$ Retained).
3. **Step 3: Deep Dive & Uncertainty Quantification (Module 3)**
   - Click "Deep Dive" on Solar PV $\rightarrow$ Show 48-month continuous curve (2023–2025 actuals + 2026 forecast with shaded 80%/95% conformal prediction bands).
   - Inspect the **Competency Gap Cloud** (showing skills demanded by industry vs current NSQF curriculum deficits).
4. **Step 4: "What-If" Capacity Simulation Sandbox (Module 5)**
   - Navigate to **What-If Sandbox** for Kanpur Nagar Solar PV.
   - Drag the *Sanctioned Seats Adjustment* slider to add +180 seats (6 training batches).
   - Watch the right-hand panel instantly recalculate effective supply, reduce the net deficit by 17.5%, and display budget variance and procurement lead time.
5. **Step 5: DSDP Target Export (Module 6)**
   - Open **Target Export Hub**.
   - Show the automated recommendations transferring seats from saturated Data Entry to high-demand Solar/EV trades.
   - Click **"Download Official MSDE CSV"** to demonstrate integration readiness for District Skill Development Plans.
6. **Step 6: Multilingual Accessibility**
   - Click the **"हिन्दी"** button in the header $\rightarrow$ Show the entire interface instantly translating into Hindi.
