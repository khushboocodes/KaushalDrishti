"""
Unit and Integration Test Suite for Milestone 2 (Deep Production & Advanced ML Core)
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Ministry of Skill Development and Entrepreneurship (MSDE)
"""

import pytest
import numpy as np
import pandas as pd
from engine.ingestion.ncs_scraper import NCSScraperConnector
from engine.ingestion.eshram_ingestor import EShramIngestionPipeline
from engine.ingestion.plfs_pipeline import PLFSPipeline
from engine.hygiene.simhash_deduplicator import SimHashDeduplicator
from engine.hygiene.stale_decay import TemporalDecayEngine
from engine.hygiene.lgd_fuzzy_resolver import LGDFuzzyResolver
from engine.forecasting.feature_store import PanelFeatureStore
from engine.forecasting.gbm_engine import GBMPanelForecaster
from engine.forecasting.mint_reconciler import MinTSpatialReconciler
from engine.forecasting.conformal_engine import ConformalPredictionEngine
from engine.validation.backtest_suite import WalkForwardBacktestSuite
from engine.validation.benchmark_runner import BenchmarkRunner
from engine.validation.alert_evaluator import AlertEvaluator
from engine.security.dpdp_guard import DPDPComplianceGuard

def test_ncs_connector():
    connector = NCSScraperConnector()
    stream = connector.generate_calibrated_stream(district_lgd=184, nco_code="7411.0101", count=4)
    assert len(stream) == 4
    assert stream[0].nco_code == "7411.0101"
    assert stream[0].district_lgd_code == 184
    assert stream[0].is_active is True

def test_eshram_k_anonymity():
    pipeline = EShramIngestionPipeline()
    # Create 40 records for key A (sub-threshold) and 60 records for key B (compliant)
    raw = [{"current_district_lgd": 184, "nco_code": "7411.0101", "age": 25, "gender": "M"} for _ in range(40)]
    raw += [{"current_district_lgd": 158, "nco_code": "7411.0101", "age": 28, "gender": "F"} for _ in range(60)]
    
    aggregated = pipeline.aggregate_microdata(raw)
    # The sub-threshold (40 records) bucket MUST be suppressed under DPDP Act 2023
    assert len(aggregated) == 1
    assert aggregated[0].current_district_lgd == 158
    assert aggregated[0].total_registered_workers == 60

def test_plfs_macro_indicators():
    pipeline = PLFSPipeline()
    up_macro = pipeline.get_district_macro_indicators(158, 9, "Kanpur Nagar")
    assert up_macro.lgd_code == 158
    assert up_macro.structural_macro_weight > 0.5
    assert up_macro.lfpr_urban > 0

def test_simhash_deduplication():
    dedup = SimHashDeduplicator(hamming_threshold=3)
    p1 = {
        "job_id": "P1",
        "employer": "Tata Power Solar",
        "district_lgd_code": 158,
        "nco_code": "7411.0101",
        "title": "Solar Panel Installation Technician",
        "skills_raw": ["Solar PV", "Inverter wiring", "Rooftop setup"],
        "vacancies": 5
    }
    # Identical syndicated posting with minor spacing differences
    p2 = {
        "job_id": "P2",
        "employer": "Tata Power Solar Limited",
        "district_lgd_code": 158,
        "nco_code": "7411.0101",
        "title": "Solar Panel Installation Technician Rooftop",
        "skills_raw": ["Solar PV", "Inverter wiring", "Rooftop"],
        "vacancies": 8
    }
    # Completely different posting
    p3 = {
        "job_id": "P3",
        "employer": "Apollo Hospital",
        "district_lgd_code": 184,
        "nco_code": "5321.0100",
        "title": "General Duty Nursing Assistant",
        "skills_raw": ["Patient Care", "Vitals monitoring"],
        "vacancies": 12
    }

    unique, summary = dedup.deduplicate([p1, p2, p3])
    assert summary.duplicates_purged >= 1
    assert len(unique) == 2

def test_temporal_stale_decay():
    decay_engine = TemporalDecayEngine()
    # Fresh posting: age 0
    w_fresh = decay_engine.compute_decay_weight("2026-10-15", "COMMERCIAL")
    assert w_fresh >= 0.95
    # Stale posting from 120 days ago
    w_stale = decay_engine.compute_decay_weight("2026-06-01", "COMMERCIAL")
    assert w_stale < 0.10

def test_lgd_fuzzy_resolver():
    resolver = LGDFuzzyResolver()
    # Tier 1: Canonical / Direct Alias
    res_kanpur = resolver.resolve("kanpur nagar")
    assert res_kanpur.resolved is True
    assert res_kanpur.district_lgd_code == 158
    assert res_kanpur.confidence_score == 1.0

    # Tier 2: Colloquial / Historical alias "Kashi" -> Varanasi
    res_kashi = resolver.resolve("kashi")
    assert res_kashi.resolved is True
    assert res_kashi.district_lgd_code == 184

    # Tier 3: Slight misspelling "Kaanpur"
    res_fuzzy = resolver.resolve("Kaanpur", state_hint="Uttar Pradesh")
    assert res_fuzzy.resolved is True

def test_feature_store_and_gbm_forecaster():
    store = PanelFeatureStore()
    df, y = store.build_supervised_matrix(horizon=3)
    assert not df.empty
    assert len(y) == len(df)
    assert "lag_0" in df.columns
    assert "rolling_mean_3" in df.columns

    forecaster = GBMPanelForecaster(horizon=3)
    metrics = forecaster.train(test_size_ratio=0.20)
    assert "rmse" in metrics
    assert "mape" in metrics
    assert forecaster.is_trained is True

def test_mint_spatial_reconciler():
    reconciler = MinTSpatialReconciler()
    # Unreconciled base predictions:
    districts = {"d1": 110.0, "d2": 190.0, "d3": 280.0, "d4": 420.0}  # sum = 1000
    states = {"s1": 320.0, "s2": 690.0}                                # sum = 1010
    national = 1050.0                                                  # Discrepancy!

    state_map = {"s1": ["d1", "d2"], "s2": ["d3", "d4"]}
    rec_dists, rec_states, rec_nat = reconciler.reconcile_hierarchy(districts, states, national, state_map)

    # Coherence check: sum of districts MUST equal sum of states MUST equal national
    d_sum = round(sum(rec_dists.values()), 1)
    s_sum = round(sum(rec_states.values()), 1)
    assert abs(d_sum - s_sum) <= 0.5
    assert abs(s_sum - rec_nat) <= 0.5

def test_conformal_prediction():
    engine = ConformalPredictionEngine()
    y_true = np.array([100, 150, 200, 250, 300])
    y_pred = np.array([105, 142, 195, 260, 290])
    engine.calibrate(y_true, y_pred)
    interval = engine.compute_interval(point_forecast=220.0)
    assert interval.lower_80 <= 220.0 <= interval.upper_80
    assert interval.lower_95 <= interval.lower_80
    assert interval.upper_95 >= interval.upper_80

def test_walk_forward_backtest():
    suite = WalkForwardBacktestSuite(horizon=3, n_folds=3)
    summary = suite.run_backtest()
    assert summary.total_folds >= 2
    assert summary.mean_rmse > 0
    assert summary.mean_mape < 25.0

def test_benchmark_runner():
    runner = BenchmarkRunner(horizon=3)
    results = runner.run_comparison()
    assert len(results["benchmarks"]) == 4
    # Ensure markdown was generated
    assert (results["benchmarks"][-1]["model"] == "KaushalDrishti HistGBM")

def test_alert_evaluator():
    evaluator = AlertEvaluator()
    report = evaluator.simulate_radar_evaluations(n_samples=200)
    assert report.total_evaluations == 200
    assert report.macro_f1 >= 0.80

def test_dpdp_compliance_guard():
    guard = DPDPComplianceGuard()
    clean_sample = [
        {"district_lgd": 158, "nco_code": "7411.0101", "worker_count": 120},
        {"district_lgd": 184, "nco_code": "5321.0100", "worker_count": 85}
    ]
    report = guard.run_compliance_audit(clean_sample)
    assert report.is_compliant is True
    assert report.pii_violations_found == 0
    assert len(report.audit_hash) == 64
