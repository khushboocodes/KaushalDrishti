"""
Supervised Panel Feature Store & Lag Matrix Generator
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Problem Statement ID: 26246

Transforms panel demand time-series into supervised machine learning
feature matrices with strict temporal ordering to prevent data leakage.
"""

from typing import List, Dict, Any, Tuple, Optional
import json
import math
import numpy as np
import pandas as pd
from pathlib import Path
from backend.config import settings
from backend.logger import logger

class PanelFeatureStore:
    """
    Constructs multi-horizon lag matrices, rolling statistics, and cyclical
    features across district-trade panel time series.
    """

    def __init__(self, data_path: Optional[Path] = None):
        self.data_path = data_path or (settings.PILOT_DATA_PATH / "demand_history.json")
        self.logger = logger
        self.feature_names = [
            "lag_0", "lag_1", "lag_2", "lag_3", "lag_6", "lag_12",
            "rolling_mean_3", "rolling_mean_6", "rolling_std_6",
            "growth_mom_3", "growth_mom_12",
            "employer_breadth_ratio",
            "month_sin", "month_cos", "quarter",
            "district_code_num", "sector_code_num"
        ]

    def load_raw_panel_data(self) -> List[Dict[str, Any]]:
        """Loads the panel time series records."""
        if not self.data_path.exists():
            self.logger.error(f"Panel data file not found: {self.data_path}")
            return []
        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("records", [])

    def build_supervised_matrix(self, horizon: int = 3) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Builds feature matrix X and target y for a specific forecast horizon (e.g. 3, 6, 12 months).
        Ensures temporal integrity: features at month t predict demand at month t + horizon.
        """
        records = self.load_raw_panel_data()
        rows = []
        targets = []

        # Unique mappings for categoricals
        district_map = {}
        sector_map = {}

        for rec in records:
            dist_id = rec["district_lgd_code"]
            sec_name = rec["sector_name"]
            if dist_id not in district_map:
                district_map[dist_id] = len(district_map)
            if sec_name not in sector_map:
                sector_map[sec_name] = len(sector_map)

            series = rec.get("monthly_history", [])
            # Extract monthly sequence of vacancies and employers
            # Only use non-forecast actuals for training (2023-01 to 2025-12 = 36 months)
            valid_steps = [s for s in series if not s.get("is_forecast_horizon", False)]
            if len(valid_steps) < 13 + horizon:
                continue

            vals = [s["active_vacancies"] for s in valid_steps]
            emps = [s.get("unique_employers", 1) for s in valid_steps]
            months = [s["month"] for s in valid_steps]

            # Construct rolling windows
            # We need at least 12 previous months for lag_12
            for t in range(12, len(vals) - horizon):
                target_val = vals[t + horizon]
                curr_month_str = months[t]
                m_num = int(curr_month_str.split("-")[1])

                # Lags
                lag_0 = vals[t]
                lag_1 = vals[t - 1]
                lag_2 = vals[t - 2]
                lag_3 = vals[t - 3]
                lag_6 = vals[t - 6]
                lag_12 = vals[t - 12]

                # Rolling stats
                window_3 = vals[t-2:t+1]
                window_6 = vals[t-5:t+1]
                roll_mean_3 = float(np.mean(window_3))
                roll_mean_6 = float(np.mean(window_6))
                roll_std_6 = float(np.std(window_6))

                # Growth momentum
                mom_3 = (lag_0 - lag_3) / (lag_3 + 1e-4)
                mom_12 = (lag_0 - lag_12) / (lag_12 + 1e-4)

                # Employer breadth
                emp_ratio = emps[t] / (lag_0 + 1e-4)

                # Cyclical time encodings
                m_rad = 2 * math.pi * (m_num - 1) / 12
                month_sin = math.sin(m_rad)
                month_cos = math.cos(m_rad)
                quarter = (m_num - 1) // 3 + 1

                row = {
                    "lag_0": lag_0,
                    "lag_1": lag_1,
                    "lag_2": lag_2,
                    "lag_3": lag_3,
                    "lag_6": lag_6,
                    "lag_12": lag_12,
                    "rolling_mean_3": roll_mean_3,
                    "rolling_mean_6": roll_mean_6,
                    "rolling_std_6": roll_std_6,
                    "growth_mom_3": mom_3,
                    "growth_mom_12": mom_12,
                    "employer_breadth_ratio": emp_ratio,
                    "month_sin": month_sin,
                    "month_cos": month_cos,
                    "quarter": quarter,
                    "district_code_num": district_map[dist_id],
                    "sector_code_num": sector_map[sec_name],
                    "meta_district_lgd": dist_id,
                    "meta_nco_code": rec["nco_code"],
                    "meta_month": curr_month_str
                }
                rows.append(row)
                targets.append(target_val)

        df = pd.DataFrame(rows)
        y = pd.Series(targets, name="target_demand")
        self.logger.info(f"Feature Store: Built matrix for horizon={horizon} with shape={df.shape}.")
        return df, y
