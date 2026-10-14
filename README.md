# KaushalDrishti (कौशल दृष्टि)
## AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine
### Ministry of Skill Development and Entrepreneurship (MSDE) — Problem Statement ID: 26246

[![Python Version](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.13%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-purple.svg)](frontend/css/a11y.css)
[![DPDP Act 2023](https://img.shields.io/badge/DPDP%20Act%202023-Verified%20Compliant-success.svg)](docs/DPDP_COMPLIANCE_REPORT.md)

---

## 🌟 Executive Overview
**KaushalDrishti (कौशल दृष्टि)** is an enterprise Labour Market Intelligence System (LMIS) and forward-looking demand-supply forecasting decision engine engineered for apex planners at **MSDE, NCVET, DGT, Sector Skill Councils (SSCs), State Skill Missions (SSDMs), and District Skill Committees (DSCs)**.

The system addresses the fundamental structural mismatch in India's vocational skilling ecosystem:
- **Chronic Oversupply:** Millions certified in saturated, legacy trades with declining wages and low placement.
- **Acute Undersupply:** Rapidly growing sunrise sectors (Solar PV, EV diagnostics, allied healthcare) facing acute talent shortages.
- **The "Sanctioned Seat = Worker" Fallacy:** Accounting for leaky pipeline attrition (enrollment rates, dropouts, certification exams, out-migration).

KaushalDrishti synthesizes heterogeneous labor market signals, forecasts net gaps over 3, 6, and 12-month horizons, triggers an explainable **5-State Early Warning Radar**, and provides an interactive **What-If Policy Simulation Sandbox** to optimize seat allocation *before* public capital is committed.

---

## 🚀 Quick Start (One Command Run)

Run the unified full-stack application (FastAPI backend + interactive bilingual GIS dashboard):

```bash
# 1. Install lightweight dependencies
pip install -r requirements.txt

# 2. Launch server (auto-binds to port 8000)
python run.py
```

Open your browser to:
- 🌐 **Interactive Dashboard:** [http://localhost:8000](http://localhost:8000)
- 📚 **Interactive Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- 🩺 **Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🚢 Instant Cloud Deployment

Deploy KaushalDrishti directly to the cloud using the pre-configured deployment templates:

| Platform | Deployment Config | Instructions |
| :--- | :--- | :--- |
| **Render** | [`render.yaml`](render.yaml) | Connect GitHub repo & click "New Web Service" (Select Blueprint). |
| **Vercel** | [`vercel.json`](vercel.json) | Run `vercel --prod` or import repo in Vercel Dashboard. |
| **Docker** | [`Dockerfile`](Dockerfile) | `docker build -t kaushaldrishti . && docker run -p 8000:8000 kaushaldrishti` |
| **Railway / HF** | [`Procfile`](Procfile) | Auto-detected with `web: python run.py`. |

For step-by-step instructions, see the [Deployment Guide](docs/DEPLOYMENT_GUIDE.md).

---

## 🏗️ System Architecture & Engineering Highlights

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   HETEROGENEOUS DATA INGESTION                         │
│  [NCS Vacancies]    [e-Shram Registrations]    [PLFS Macro Indicators] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  DATA HYGIENE & ENTITY RESOLUTION                      │
│  • 64-Bit SimHash Deduplication (Hamming distance <= 3)               │
│  • Ghost Vacancy Exponential Decay: W(t) = exp(-lambda * delta_t)     │
│  • Tri-Tier LGD Fuzzy Matcher (Exact -> Phonetic -> RapidFuzz)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│               ANALYTICAL CORE & ML FORECASTING ENGINE                  │
│  • Composite Demand Index (CDI): 0.35V + 0.25G + 0.15H + 0.15S + 0.10M │
│  • Multi-Stage Supply Funnel: Sanction * Enroll * (1-Drop) * Pass * Ret│
│  • HistGradientBoosting Panel Regressor (3M, 6M, 12M Horizons)         │
│  • Minimum Trace (MinT) Hierarchical Spatial Reconciliation            │
│  • Split Conformal Prediction (80% & 95% Distribution-Free Bounds)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                 POLICY DECISION SUPPORT & DASHBOARD                    │
│  • 5-State Early Warning Radar (Critical Shortage to Severe Surplus)  │
│  • Sub-20ms What-If Policy Capacity Simulation Sandbox                 │
│  • Bilingual English / Hindi (हिन्दी) GIS Choropleth Interface        │
│  • Automated District Skill Development Plan (DSDP) Target Exporter    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Core Dashboard Modules

1. **National Command Center:** Executive overview of nationwide labor demand, supply, net mismatch, distress districts, and an interactive SVG India choropleth map.
2. **Geospatial District Explorer:** Granular diagnostics across 41 pilot districts in Uttar Pradesh, Maharashtra, and Odisha with dual-funnel pipeline visualization.
3. **Trade & Sector Deep-Dive Lab:** Multi-line forecast curves (3M/6M/12M) with shaded 80%/95% confidence intervals and curriculum competency deficit clouds.
4. **Early Warning Radar & Triage Center:** 5-state priority queue with contributing signal attribution and recommended planning interventions.
5. **What-If Policy Simulation Sandbox:** Interactive sliders to adjust training batches, convert trades, and simulate policy impact in $<20\text{ms}$.
6. **Target Setting & Scheme Export Hub:** One-click generation of official MSDE-compliant DSDP annual allocation packages in CSV format.

---

## 🧪 Benchmark & Model Performance

- **Forecast Accuracy:** **MAPE = 16.4%** across rolling walk-forward evaluation origins, outperforming simple moving average baselines by **28.6%** (see [Benchmark Report](docs/benchmark_results.md)).
- **Radar Classification Quality:** **Macro F1 = 0.88** on identifying Critical Shortage and Severe Oversupply conditions.
- **Execution Performance:** Full simulation recalculation in **$< 15$ ms** in-memory.
- **Statutory Compliance:** 100% verified compliance with **DPDP Act 2023** ($k \ge 50$ anonymization, zero PII, SHA-256 audit logs; see [Audit Report](docs/DPDP_COMPLIANCE_REPORT.md)).

---

## 📂 Repository Structure

```text
KaushalDrishti/
├── backend/                  # FastAPI Application & REST Endpoints
│   ├── api/router.py         # Versioned API routes (/intelligence, /simulation, /exports)
│   ├── config.py             # Central application configuration
│   └── main.py               # Application entrypoint & static mounting
├── engine/                   # Analytical & Machine Learning Core
│   ├── analytics/            # CDI Calculator, Supply Funnel, Gap Engine, Early Warning Radar
│   ├── forecasting/          # Panel Feature Store, HistGBM Forecaster, MinT Reconciler, Conformal Engine
│   ├── hygiene/              # 64-Bit SimHash Deduplicator, Temporal Decay, LGD Fuzzy Resolver
│   ├── ingestion/            # NCS Connector, e-Shram Aggregator, PLFS Pipeline
│   ├── ontology/             # Canonical LGD & NCO Master Resolvers
│   ├── security/             # DPDP Act 2023 Compliance Guard
│   └── simulation/           # What-If Sandbox Core, Budget Modeler, DSDP Recommender
├── frontend/                 # Interactive Bilingual GIS Dashboard
│   ├── css/                  # Design tokens, modern aesthetic styles, accessibility (a11y)
│   ├── js/                   # Vanilla ES6 Modular Architecture
│   │   ├── components/       # SVG Map, Canvas Chart, Funnel Visualization
│   │   ├── modules/          # Command Center, Explorer, Trade Lab, Alert Radar, Simulator
│   │   └── i18n.js           # Bilingual Localization Engine (English & Hindi)
│   └── locales/              # Translation files (en.json, hi.json)
├── data/                     # Canonical Master Ontologies & Pilot Telemetry
│   ├── master/               # LGD Districts, NCO-2015 Catalog, NSQF Crosswalk
│   └── pilot/                # Multi-Year Calibrated Demand & Supply Time Series
├── docs/                     # Technical Whitepaper, Pitch Deck, Deployment Guide, Audit Reports
├── tests/                    # Comprehensive Pytest Verification Suite
├── Dockerfile                # Multi-stage container deployment
├── render.yaml               # Render Cloud deployment blueprint
├── vercel.json               # Vercel Serverless deployment configuration
├── requirements.txt          # Python dependencies
└── run.py                    # Unified single-command launcher
```

---

## 👥 Authors & Sponsoring Apex Body
- **Problem Statement ID:** 26246
- **Apex Ministry:** Ministry of Skill Development and Entrepreneurship (MSDE), Government of India.
- **Built for:** National / State / District Skill Development Planners.
