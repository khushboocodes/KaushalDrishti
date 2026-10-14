"""
Gradient Boosted Panel Forecasting Engine
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Problem Statement ID: 26246

Trains gradient boosted tree models (HistGradientBoosting / LightGBM)
on panel demand time series for multi-horizon (3M, 6M, 12M) forecasting.
"""

import os
import pickle
from pathlib import Path
from typing import Dict, Any, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error, mean_absolute_error
from engine.forecasting.feature_store import PanelFeatureStore
from backend.logger import logger

MODELS_DIR = Path("models")

class GBMPanelForecaster:
    """
    Panel forecaster leveraging histogram-based gradient boosted decision trees
    with monotonic and l2 regularization.
    """

    def __init__(self, horizon: int = 3):
        self.horizon = horizon
        self.feature_store = PanelFeatureStore()
        self.logger = logger
        self.model: Optional[HistGradientBoostingRegressor] = None
        self.is_trained: bool = False
        self.feature_cols: list = []
        self.metrics: Dict[str, float] = {}

    def train(self, test_size_ratio: float = 0.2) -> Dict[str, float]:
        """
        Extracts features from the panel store, splits temporally, and fits the model.
        """
        df, y = self.feature_store.build_supervised_matrix(horizon=self.horizon)
        if df.empty or len(y) == 0:
            raise ValueError("Feature store returned empty dataset for training.")

        # Identify feature columns (excluding metadata)
        meta_cols = [c for c in df.columns if c.startswith("meta_")]
        self.feature_cols = [c for c in df.columns if c not in meta_cols]

        X = df[self.feature_cols]

        # Temporal split: last 20% by month order
        split_idx = int(len(X) * (1.0 - test_size_ratio))
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

        self.logger.info(f"Training GBM Forecaster for H={self.horizon}M (Train samples: {len(X_train)}, Test: {len(X_test)})...")

        # Initialize Histogram Gradient Boosting (LightGBM equivalent in scikit-learn)
        self.model = HistGradientBoostingRegressor(
            max_iter=150,
            learning_rate=0.08,
            max_leaf_nodes=31,
            min_samples_leaf=15,
            l2_regularization=0.5,
            random_state=42
        )

        self.model.fit(X_train, y_train)
        self.is_trained = True

        # Evaluate on test set
        y_pred = self.model.predict(X_test)
        y_pred = np.clip(y_pred, a_min=0, a_max=None)  # Demand cannot be negative

        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        mae = float(mean_absolute_error(y_test, y_pred))
        mape = float(mean_absolute_percentage_error(y_test, y_pred) * 100)

        self.metrics = {
            "rmse": round(rmse, 2),
            "mae": round(mae, 2),
            "mape": round(mape, 2),
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        }
        self.logger.info(f"GBM Forecaster (H={self.horizon}M) Results: RMSE={rmse:.2f}, MAE={mae:.2f}, MAPE={mape:.2f}%")
        return self.metrics

    def predict(self, feature_df: pd.DataFrame) -> np.ndarray:
        """Generates predictions given a feature matrix."""
        if not self.is_trained or self.model is None:
            raise RuntimeError("Model has not been trained or loaded yet.")
        X = feature_df[self.feature_cols]
        preds = self.model.predict(X)
        return np.clip(preds, a_min=0, a_max=None)

    def save_model(self, filepath: Optional[Path] = None) -> Path:
        """Serializes model artifact to disk."""
        if not self.is_trained or self.model is None:
            raise RuntimeError("Cannot save untrained model.")
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        out_path = filepath or (MODELS_DIR / f"lgbm_demand_h{self.horizon}.pkl")
        with open(out_path, "wb") as f:
            pickle.dump({
                "model": self.model,
                "horizon": self.horizon,
                "feature_cols": self.feature_cols,
                "metrics": self.metrics
            }, f)
        self.logger.info(f"Saved trained model to {out_path}")
        return out_path

    @classmethod
    def load_model(cls, filepath: Path) -> "GBMPanelForecaster":
        """Loads serialized model artifact from disk."""
        with open(filepath, "rb") as f:
            data = pickle.load(f)
        forecaster = cls(horizon=data["horizon"])
        forecaster.model = data["model"]
        forecaster.feature_cols = data["feature_cols"]
        forecaster.metrics = data.get("metrics", {})
        forecaster.is_trained = True
        return forecaster
