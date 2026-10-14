# KaushalDrishti Forecasting Engine — Benchmark Validation Results
### Horizon: 3-Month Forward Forecasting

| Model Architecture | RMSE | MAE | MAPE (%) | Improvement vs Naive |
| :--- | :--- | :--- | :--- | :--- |
| **Naive Persistence** | 63.89 | 44.81 | 19.56% | 0.0% |
| **3M Moving Average** | 69.96 | 48.53 | 20.71% | -5.9% |
| **Seasonal Naive (12M Lag)** | 119.43 | 86.99 | 35.7% | -82.5% |
| **KaushalDrishti HistGBM** | 37.66 | 25.92 | 12.44% | 36.4% |

### Methodological Validation Notes:
1. **Out-of-sample Evaluation:** Models evaluated on held-out temporal panel cuts without lookahead bias.
2. **Error Target:** KaushalDrishti HistGBM achieves MAPE < 18.5%, outperforming naive persistence by > 25%.
3. **Zero Data Leakage:** All feature lags and rolling windows computed strictly on t <= origin.

*(Generated automatically by KaushalDrishti Benchmark Runner)*