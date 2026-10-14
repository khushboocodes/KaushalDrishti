"""
Early Warning Classification Precision & Recall Evaluation Suite
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Problem Statement ID: 26246

Validates the 5-state early warning radar against ground truth outcomes to compute
Precision, Recall, and Macro F1 for shortage and oversupply risk states.
"""

from typing import Dict, Any, List, Tuple
import numpy as np
from pydantic import BaseModel
from sklearn.metrics import precision_recall_fscore_support
from engine.analytics.early_warning import EarlyWarningRadar
from backend.logger import logger

class ClassMetric(BaseModel):
    state_name: str
    precision: float
    recall: float
    f1_score: float
    support: int

class AlertEvaluationReport(BaseModel):
    total_evaluations: int
    macro_f1: float
    weighted_f1: float
    critical_shortage_f1: float
    oversupply_f1: float
    class_metrics: List[ClassMetric]

class AlertEvaluator:
    """
    Evaluates early warning radar classifications against subsequent ground truth outcomes.
    """

    def __init__(self):
        self.radar = EarlyWarningRadar()
        self.logger = logger

    def simulate_radar_evaluations(self, n_samples: int = 500) -> AlertEvaluationReport:
        """
        Simulates paired forecast indicators and verifies radar classification performance.
        """
        np.random.seed(42)
        y_true_labels = []
        y_pred_labels = []

        # Generate realistic distribution of labor market scenarios
        for _ in range(n_samples):
            scenario = np.random.choice(
                ["critical_shortage", "emerging_shortage", "balanced", "saturation", "oversupply"],
                p=[0.25, 0.20, 0.30, 0.15, 0.10]
            )

            if scenario == "critical_shortage":
                d_abs = np.random.randint(500, 1200)
                s_eff = np.random.randint(50, 200)
                true_label = EarlyWarningRadar.STATE_CRITICAL_SHORTAGE
            elif scenario == "emerging_shortage":
                d_abs = np.random.randint(300, 600)
                s_eff = int(d_abs / np.random.uniform(1.3, 1.6))
                true_label = EarlyWarningRadar.STATE_EMERGING_SHORTAGE
            elif scenario == "balanced":
                s_eff = np.random.randint(300, 700)
                d_abs = int(s_eff * np.random.uniform(0.85, 1.15))
                true_label = EarlyWarningRadar.STATE_BALANCED
            elif scenario == "saturation":
                s_eff = np.random.randint(400, 800)
                d_abs = int(s_eff * np.random.uniform(0.65, 0.79))
                true_label = EarlyWarningRadar.STATE_MODERATE_SATURATION
            else:  # oversupply
                s_eff = np.random.randint(600, 1500)
                d_abs = int(s_eff * np.random.uniform(0.2, 0.55))
                true_label = EarlyWarningRadar.STATE_SEVERE_OVERSUPPLY

            tension = max(0.1, d_abs / max(1, s_eff))
            gap = d_abs - s_eff

            pred_flag = self.radar.classify(
                absolute_gap=gap,
                tension_ratio=tension,
                confidence_score=0.88
            )

            y_true_labels.append(true_label)
            y_pred_labels.append(pred_flag["flag_code"])

        unique_labels = sorted(list(set(y_true_labels + y_pred_labels)))
        prec, rec, f1, sup = precision_recall_fscore_support(
            y_true_labels, y_pred_labels, labels=unique_labels, zero_division=0
        )

        class_metrics = []
        shortage_f1 = 0.0
        oversupply_f1 = 0.0

        for i, lbl in enumerate(unique_labels):
            m = ClassMetric(
                state_name=lbl,
                precision=round(float(prec[i]), 3),
                recall=round(float(rec[i]), 3),
                f1_score=round(float(f1[i]), 3),
                support=int(sup[i])
            )
            class_metrics.append(m)
            if "CRITICAL" in lbl:
                shortage_f1 = m.f1_score
            elif "OVERSUPPLY" in lbl:
                oversupply_f1 = m.f1_score

        macro_f1 = round(float(np.mean(f1)), 3)
        weighted_f1 = round(float(np.average(f1, weights=sup)), 3)

        report = AlertEvaluationReport(
            total_evaluations=n_samples,
            macro_f1=macro_f1,
            weighted_f1=weighted_f1,
            critical_shortage_f1=shortage_f1,
            oversupply_f1=oversupply_f1,
            class_metrics=class_metrics
        )
        self.logger.info(f"Alert Radar Evaluation: Macro F1={macro_f1}, Shortage F1={shortage_f1}, Oversupply F1={oversupply_f1}")
        return report
