"""
Walk-Forward Rolling Origin Cross-Validation Suite
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Problem Statement ID: 26246

Performs walk-forward temporal cross-validation across rolling origin splits
to evaluate out-of-sample forecast accuracy without lookahead bias.
"""

from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd
from pydantic import BaseModel
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from engine.forecasting.feature_store import PanelFeatureStore
from engine.forecasting.gbm_engine import GBMPanelForecaster
from backend.logger import logger

class FoldEvaluationResult(BaseModel):
    fold_index: int
    train_end_idx: int
    test_horizon: int
    test_samples: int
    rmse: float
    mae: float
    mape: float

class BacktestSummary(BaseModel):
    total_folds: int
    horizon: int
    mean_rmse: float
    mean_mae: float
    mean_mape: float
    folds: List[FoldEvaluationResult]

class WalkForwardBacktestSuite:
    """
    Rolling origin temporal cross-validator for panel time-series.
    """

    def __init__(self, horizon: int = 3, n_folds: int = 4):
        self.horizon = horizon
        self.n_folds = n_folds
        self.feature_store = PanelFeatureStore()
        self.logger = logger

    def run_backtest(self) -> BacktestSummary:
        """
        Executes rolling origin splits over the panel feature store dataset.
        """
        df, y = self.feature_store.build_supervised_matrix(horizon=self.horizon)
        if df.empty or len(y) == 0:
            raise ValueError("Empty dataset for rolling backtest.")

        meta_cols = [c for c in df.columns if c.startswith("meta_")]
        feat_cols = [c for c in df.columns if c not in meta_cols]
        X = df[feat_cols]

        total_samples = len(X)
        fold_results: List[FoldEvaluationResult] = []

        # Generate rolling origin cutoff points
        # e.g., using origins starting at 50% through 85% of temporal index
        origin_pcts = np.linspace(0.55, 0.85, self.n_folds)

        for fold_idx, pct in enumerate(origin_pcts):
            train_cutoff = int(total_samples * pct)
            test_window = min(int(total_samples * 0.12), total_samples - train_cutoff)
            if test_window <= 0:
                continue

            test_end = train_cutoff + test_window

            X_tr, y_tr = X.iloc[:train_cutoff], y.iloc[:train_cutoff]
            X_te, y_te = X.iloc[train_cutoff:test_end], y.iloc[train_cutoff:test_end]

            # Fit model strictly on past
            forecaster = GBMPanelForecaster(horizon=self.horizon)
            forecaster.feature_cols = feat_cols
            from sklearn.ensemble import HistGradientBoostingRegressor
            forecaster.model = HistGradientBoostingRegressor(
                max_iter=100,
                learning_rate=0.08,
                random_state=42 + fold_idx
            )
            forecaster.model.fit(X_tr, y_tr)
            forecaster.is_trained = True

            preds = forecaster.predict(X_te)
            rmse = float(np.sqrt(mean_squared_error(y_te, preds)))
            mae = float(mean_absolute_error(y_te, preds))
            mape = float(mean_absolute_percentage_error(y_te, preds) * 100)

            res = FoldEvaluationResult(
                fold_index=fold_idx + 1,
                train_end_idx=train_cutoff,
                test_horizon=self.horizon,
                test_samples=len(y_te),
                rmse=round(rmse, 2),
                mae=round(mae, 2),
                mape=round(mape, 2)
            )
            fold_results.append(res)
            self.logger.info(f"Fold {res.fold_index}/{self.n_folds}: RMSE={res.rmse}, MAE={res.mae}, MAPE={res.mape}%")

        mean_rmse = round(float(np.mean([f.rmse for f in fold_results])), 2)
        mean_mae = round(float(np.mean([f.mae for f in fold_results])), 2)
        mean_mape = round(float(np.mean([f.mape for f in fold_results])), 2)

        summary = BacktestSummary(
            total_folds=len(fold_results),
            horizon=self.horizon,
            mean_rmse=mean_rmse,
            mean_mae=mean_mae,
            mean_mape=mean_mape,
            folds=fold_results
        )
        self.logger.info(f"Walk-Forward Backtest (H={self.horizon}M): Mean RMSE={mean_rmse}, Mean MAPE={mean_mape}%")
        return summary
