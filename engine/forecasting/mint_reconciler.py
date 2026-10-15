"""
Minimum Trace (MinT) Hierarchical Spatial Reconciler
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Ministry of Skill Development and Entrepreneurship (MSDE)

Reconciles independent bottom-level (district), middle-level (state), and top-level (national)
forecasts into mathematically coherent projections using the MinT optimal linear projection:
y_tilde = S (S^T W^-1 S)^-1 S^T W^-1 y_hat
"""

from typing import Dict, List, Any, Tuple
import numpy as np
from backend.logger import logger

class MinTSpatialReconciler:
    """
    Hierarchical reconciler enforcing spatial aggregation consistency:
    Sum of District Forecasts == State Forecast == National Sector Total.
    """

    def __init__(self):
        self.logger = logger

    def reconcile_hierarchy(
        self,
        district_forecasts: Dict[str, float],   # e.g., {"kanpur_solar": 420.0, "varanasi_solar": 280.0, ...}
        state_forecasts: Dict[str, float],      # e.g., {"up_solar": 730.0, "mh_solar": 910.0}
        national_forecast: float,               # e.g., 1680.0
        state_to_districts_map: Dict[str, List[str]] # e.g., {"up_solar": ["kanpur_solar", ...]}
    ) -> Tuple[Dict[str, float], Dict[str, float], float]:
        """
        Applies optimal trace reconciliation using structural summing matrix S.
        Returns reconciled (district_forecasts, state_forecasts, national_forecast).
        """
        bottom_keys = list(district_forecasts.keys())
        state_keys = list(state_forecasts.keys())
        n_bottom = len(bottom_keys)
        n_states = len(state_keys)
        total_nodes = 1 + n_states + n_bottom

        if n_bottom == 0:
            return district_forecasts, state_forecasts, national_forecast

        # Construct Summing Matrix S of shape (total_nodes, n_bottom)
        # Row 0: Top node (sum of all bottom nodes) -> [1, 1, 1, ...]
        # Rows 1..n_states: State nodes (1 if district belongs to state, 0 otherwise)
        # Rows n_states+1..total_nodes: Identity matrix I_n_bottom
        S = np.zeros((total_nodes, n_bottom), dtype=float)
        S[0, :] = 1.0  # National sum

        bottom_idx = {k: i for i, k in enumerate(bottom_keys)}
        for s_idx, s_key in enumerate(state_keys):
            dists = state_to_districts_map.get(s_key, [])
            for d in dists:
                if d in bottom_idx:
                    S[1 + s_idx, bottom_idx[d]] = 1.0

        S[1 + n_states:, :] = np.eye(n_bottom)

        # Vector of base unreconciled forecasts y_hat
        y_hat = np.zeros(total_nodes, dtype=float)
        y_hat[0] = national_forecast
        for i, s_key in enumerate(state_keys):
            y_hat[1 + i] = state_forecasts.get(s_key, 0.0)
        for i, b_key in enumerate(bottom_keys):
            y_hat[1 + n_states + i] = district_forecasts.get(b_key, 0.0)

        # MinT reconciliation using structural scaling covariance W = diag(S * 1)
        # Diagonal elements proportional to hierarchical aggregation depth
        scale_diag = np.sum(S, axis=1)
        scale_diag[scale_diag == 0] = 1.0
        W_inv = np.diag(1.0 / scale_diag)

        # Compute projection matrix P = (S^T W^-1 S)^-1 S^T W^-1
        # Reconciled bottom forecasts: b_tilde = P * y_hat
        # Reconciled all levels: y_tilde = S * b_tilde
        try:
            St_Winv = np.dot(S.T, W_inv)
            inner = np.dot(St_Winv, S)
            inner_inv = np.linalg.pinv(inner)
            P = np.dot(inner_inv, St_Winv)
            b_tilde = np.dot(P, y_hat)
            # Ensure non-negative labor demand
            b_tilde = np.maximum(0.0, b_tilde)
            y_tilde = np.dot(S, b_tilde)
        except Exception as e:
            self.logger.warning(f"MinT matrix inversion failed, falling back to bottom-up: {e}")
            # Fallback to bottom-up aggregation
            b_tilde = np.array([district_forecasts[k] for k in bottom_keys])
            y_tilde = np.dot(S, b_tilde)

        # Unpack reconciled values
        reconciled_national = round(float(y_tilde[0]), 1)
        reconciled_states = {}
        for i, s_key in enumerate(state_keys):
            reconciled_states[s_key] = round(float(y_tilde[1 + i]), 1)

        reconciled_districts = {}
        for i, b_key in enumerate(bottom_keys):
            reconciled_districts[b_key] = round(float(b_tilde[i]), 1)

        self.logger.info(
            f"MinT Reconciled: Unreconciled Nat={national_forecast:.1f} -> Reconciled Nat={reconciled_national:.1f} "
            f"(Bottom Sum = {sum(reconciled_districts.values()):.1f})"
        )
        return reconciled_districts, reconciled_states, reconciled_national
