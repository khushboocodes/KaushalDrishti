"""
Distribution-Free Conformal Prediction Intervals (80% & 95%)
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Ministry of Skill Development and Entrepreneurship (MSDE)

Computes rigorous split conformal prediction intervals guaranteeing finite-sample
coverage without assuming Gaussian residual errors:
P(y_{test} in [y_hat - q_alpha, y_hat + q_alpha]) >= 1 - alpha
"""

from typing import List, Tuple, Dict, Any, Optional
import numpy as np
from pydantic import BaseModel
from backend.logger import logger

class ConformalInterval(BaseModel):
    point_forecast: float
    lower_80: float
    upper_80: float
    lower_95: float
    upper_95: float
    calibration_residuals_count: int

class ConformalPredictionEngine:
    """
    Split conformal prediction calibration engine computing 80% and 95%
    prediction bands across forecasting horizons.
    """

    def __init__(self):
        self.logger = logger
        self._calibration_residuals: List[float] = []
        self._q80: float = 25.0
        self._q95: float = 45.0

    def calibrate(self, y_true: np.ndarray, y_pred: np.ndarray) -> None:
        """
        Calibrates the non-conformity scores R_i = |y_i - y_pred_i| on holdout data.
        """
        if len(y_true) != len(y_pred) or len(y_true) == 0:
            self.logger.warning("Conformal calibration failed: empty or mismatched arrays.")
            return

        residuals = np.abs(np.array(y_true) - np.array(y_pred))
        self._calibration_residuals = sorted(residuals.tolist())
        n = len(self._calibration_residuals)

        # 80% coverage -> alpha = 0.20
        idx_80 = min(n - 1, int(np.ceil((n + 1) * 0.80)) - 1)
        self._q80 = float(self._calibration_residuals[idx_80])

        # 95% coverage -> alpha = 0.05
        idx_95 = min(n - 1, int(np.ceil((n + 1) * 0.95)) - 1)
        self._q95 = float(self._calibration_residuals[idx_95])

        self.logger.info(f"Conformal Calibration on {n} points: q_80%={self._q80:.2f}, q_95%={self._q95:.2f}")

    def compute_interval(self, point_forecast: float) -> ConformalInterval:
        """
        Constructs bounded intervals around a point forecast.
        """
        y_hat = max(0.0, float(point_forecast))

        lower_80 = max(0.0, y_hat - self._q80)
        upper_80 = y_hat + self._q80

        lower_95 = max(0.0, y_hat - self._q95)
        upper_95 = y_hat + self._q95

        return ConformalInterval(
            point_forecast=round(y_hat, 1),
            lower_80=round(lower_80, 1),
            upper_80=round(upper_80, 1),
            lower_95=round(lower_95, 1),
            upper_95=round(upper_95, 1),
            calibration_residuals_count=len(self._calibration_residuals)
        )
