from typing import Dict, Any, List
import numpy as np
from backend.config import settings

class CDICalculator:
    """
    Computes the Composite Demand Index (CDI) according to PRD Section 5.1:
    CDI = w_V * V_norm + w_G * G_norm + w_H * H_norm + w_S * S_norm + w_M * M_norm
    """
    def __init__(self):
        self.w_v = settings.WEIGHT_VACANCY_VOLUME
        self.w_g = settings.WEIGHT_GROWTH_MOMENTUM
        self.w_h = settings.WEIGHT_EMPLOYER_BREADTH
        self.w_s = settings.WEIGHT_SKILL_DISPERSION
        self.w_m = settings.WEIGHT_MACRO_PROXY

    def compute(self, metrics: Dict[str, float]) -> Dict[str, Any]:
        """
        metrics dict expects:
        - raw_vacancies: recent vacancy volume
        - mom_growth: month-over-month growth rate (-1.0 to +2.0)
        - unique_employers: count of distinct employers
        - skill_frequency: frequency score 0-100
        - macro_proxy: district economic vitality score 0-100
        """
        raw_vacancies = metrics.get("raw_vacancies", 0)
        mom_growth = metrics.get("mom_growth", 0.0)
        unique_employers = metrics.get("unique_employers", 0)
        skill_frequency = metrics.get("skill_frequency", 50.0)
        macro_proxy = metrics.get("macro_proxy", 50.0)

        # Min-max normalization with robust ceiling caps
        v_norm = min(100.0, max(0.0, (raw_vacancies / 350.0) * 100.0))
        g_norm = min(100.0, max(0.0, (mom_growth + 0.3) / 0.8 * 100.0)) # Maps -30% to +50% into [0, 100]
        h_norm = min(100.0, max(0.0, (unique_employers / 80.0) * 100.0))
        s_norm = min(100.0, max(0.0, skill_frequency))
        m_norm = min(100.0, max(0.0, macro_proxy))

        cdi_score = (
            self.w_v * v_norm +
            self.w_g * g_norm +
            self.w_h * h_norm +
            self.w_s * s_norm +
            self.w_m * m_norm
        )
        cdi_score = round(float(cdi_score), 1)

        return {
            "composite_demand_index": cdi_score,
            "components": {
                "normalized_vacancy_volume": round(v_norm, 1),
                "growth_momentum": round(g_norm, 1),
                "employer_breadth": round(h_norm, 1),
                "skill_frequency": round(s_norm, 1),
                "macro_economic_proxy": round(m_norm, 1)
            },
            "weights_used": {
                "w_v": self.w_v,
                "w_g": self.w_g,
                "w_h": self.w_h,
                "w_s": self.w_s,
                "w_m": self.w_m
            },
            "interpretation": self._interpret_cdi(cdi_score)
        }

    def _interpret_cdi(self, score: float) -> str:
        if score >= 75.0:
            return "High Demand Pressure"
        elif score >= 50.0:
            return "Moderate Demand"
        elif score >= 30.0:
            return "Low Demand Pressure"
        else:
            return "Stagnant / Depressed Demand"

cdi_calculator = CDICalculator()
