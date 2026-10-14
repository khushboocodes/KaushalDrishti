import json
import math
import random
from pathlib import Path
from backend.config import settings

def generate_pilot_telemetry():
    """
    Generates multi-year monthly time series (Jan 2023 to Dec 2026) for pilot districts.
    Includes:
    - 36 months historical observations (2023-2025)
    - 12 months forward test horizon (2026)
    - Realistic trends, seasonality, economic shocks, and noise.
    """
    random.seed(42)
    
    # Load masters
    with open(settings.MASTER_DATA_PATH / "lgd_districts.json", "r", encoding="utf-8") as f:
        districts = json.load(f)["districts"]
        
    with open(settings.MASTER_DATA_PATH / "nco_catalog.json", "r", encoding="utf-8") as f:
        occupations = json.load(f)["occupations"]

    # Focus pilot districts for rich depth
    pilot_lgd_codes = [
        158, # Kanpur Nagar, UP
        160, # Lucknow, UP
        184, # Varanasi, UP
        148, # Gautam Buddha Nagar, UP
        180, # Sonbhadra, UP (Sparse/Rural)
        492, # Pune, MH
        485, # Mumbai, MH
        488, # Nagpur, MH
        475, # Gadchiroli, MH (Tribal/Sparse)
        365, # Khordha / Bhubaneswar, OD
        354, # Cuttack, OD
        376  # Sundargarh / Rourkela, OD
    ]
    
    selected_districts = [d for d in districts if d["district_lgd_code"] in pilot_lgd_codes]
    
    # Dates: 48 months (2023-01 to 2026-12)
    months = []
    for year in range(2023, 2027):
        for m in range(1, 13):
            months.append(f"{year}-{m:02d}")

    # Demand profile multipliers per trade
    trade_profiles = {
        "7411.0101": {"base": 120, "trend": 0.038, "seasonality_peak": 4, "volatility": 0.08},  # Solar PV Tech (Rapid growth)
        "7411.0102": {"base": 85,  "trend": 0.032, "seasonality_peak": 4, "volatility": 0.09},  # Rooftop Assembler
        "3131.0201": {"base": 30,  "trend": 0.045, "seasonality_peak": 5, "volatility": 0.12},  # Microgrid Operator
        "7231.0102": {"base": 140, "trend": 0.042, "seasonality_peak": 9, "volatility": 0.07},  # EV Technician (Booming in Pune/Noida)
        "7223.0501": {"base": 220, "trend": 0.015, "seasonality_peak": 10, "volatility": 0.06}, # CNC Machinist (Steady high)
        "7212.0100": {"base": 90,  "trend": 0.018, "seasonality_peak": 10, "volatility": 0.08}, # Robotic Welding
        "5321.0100": {"base": 190, "trend": 0.025, "seasonality_peak": 11, "volatility": 0.05}, # GDA Healthcare (Strong constant pull)
        "5322.0101": {"base": 80,  "trend": 0.029, "seasonality_peak": 11, "volatility": 0.07}, # Home Health Aide
        "3212.0100": {"base": 65,  "trend": 0.020, "seasonality_peak": 7,  "volatility": 0.08}, # Lab Technician
        "4132.0100": {"base": 320, "trend": -0.018, "seasonality_peak": 3, "volatility": 0.05}, # Data Entry Operator (Shrinking demand!)
        "3514.0201": {"base": 50,  "trend": 0.055, "seasonality_peak": 6, "volatility": 0.15},  # AI Data Annotator (Sunrise)
        "3513.0100": {"base": 40,  "trend": 0.048, "seasonality_peak": 8, "volatility": 0.12}   # Cyber SOC Analyst
    }

    # District weights
    district_scale = {
        492: 2.4, # Pune (Major industrial)
        485: 2.8, # Mumbai
        148: 2.2, # Gautam Buddha Nagar / Noida
        160: 1.8, # Lucknow
        158: 1.6, # Kanpur Nagar
        184: 1.2, # Varanasi
        488: 1.3, # Nagpur
        365: 1.4, # Khordha
        354: 1.1, # Cuttack
        376: 1.3, # Sundargarh
        180: 0.35, # Sonbhadra (Rural sparse)
        475: 0.25  # Gadchiroli (Tribal sparse)
    }

    demand_records = []
    
    for dist in selected_districts:
        d_code = dist["district_lgd_code"]
        d_mult = district_scale.get(d_code, 1.0)
        
        for occ in occupations:
            nco = occ["nco_code"]
            profile = trade_profiles.get(nco, {"base": 70, "trend": 0.01, "seasonality_peak": 6, "volatility": 0.10})
            
            # Special district-trade interaction adjustments
            local_multiplier = 1.0
            if d_code in [492, 148] and "Automotive" in occ["sector_name"]:
                local_multiplier = 1.8 # EV boom in Pune & Noida
            elif d_code in [158, 180, 479] and "Green" in occ["sector_name"]:
                local_multiplier = 1.6 # Solar projects in Kanpur, Sonbhadra
            elif d_code in [160, 365, 485] and "Healthcare" in occ["sector_name"]:
                local_multiplier = 1.7 # Healthcare centers in capitals
            elif d_code in [180, 475]: # Sparse rural districts
                local_multiplier = 0.3

            monthly_series = []
            
            for t_idx, month_str in enumerate(months):
                year_offset = t_idx / 12.0
                month_num = int(month_str.split("-")[1])
                
                # Trend growth
                trend_val = profile["base"] * d_mult * local_multiplier * math.exp(profile["trend"] * t_idx)
                
                # Seasonality (Sine wave peaking at seasonality_peak)
                seasonal_factor = 1.0 + 0.18 * math.sin(2 * math.pi * (month_num - profile["seasonality_peak"]) / 12.0)
                
                # Shock injection: Green energy policy push in Kanpur & Sonbhadra starting mid-2024
                shock = 1.0
                if d_code in [158, 180] and nco == "7411.0101" and t_idx >= 18:
                    shock = 1.45 # 45% sudden surge in solar rooftop tenders
                elif d_code == 492 and nco == "7231.0102" and t_idx >= 14:
                    shock = 1.55 # EV industrial corridor expansion in Pune
                elif nco == "4132.0100" and t_idx >= 24:
                    shock = 0.72 # Accelerated automation reducing DEO jobs

                noise = random.gauss(0, profile["volatility"])
                estimated_vacancies = max(2, int(round(trend_val * seasonal_factor * shock * (1.0 + noise))))
                
                # Synthetic hiring breadth (unique employers)
                unique_employers = max(1, int(round(estimated_vacancies * random.uniform(0.15, 0.45))))
                
                monthly_series.append({
                    "month": month_str,
                    "active_vacancies": estimated_vacancies,
                    "unique_employers": unique_employers,
                    "is_simulated": True,
                    "is_forecast_horizon": (t_idx >= 36)
                })

            demand_records.append({
                "district_lgd_code": d_code,
                "district_name": dist["district_name"],
                "state_name": dist["state_name"],
                "nco_code": nco,
                "trade_name": occ["title"],
                "sector_name": occ["sector_name"],
                "monthly_history": monthly_series
            })

    out_file = settings.PILOT_DATA_PATH / "demand_history.json"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"total_records": len(demand_records), "records": demand_records}, f, indent=2)
    print(f"Generated pilot demand history: {len(demand_records)} district-trade panels -> {out_file}")

def generate_institutional_capacity():
    """
    Generates training capacity, enrollment, and leaky funnel attrition parameters
    for Government ITIs, Private ITIs, PMKKs, and JSS facilities.
    """
    random.seed(101)
    
    with open(settings.PILOT_DATA_PATH / "demand_history.json", "r", encoding="utf-8") as f:
        demand_data = json.load(f)["records"]

    capacity_records = []
    
    # Baseline conversion yield parameters by trade
    trade_yields = {
        "7411.0101": {"alpha": 0.86, "beta": 0.14, "gamma": 0.88, "mu": 0.75, "seats_base": 120}, # Solar PV
        "7411.0102": {"alpha": 0.82, "beta": 0.16, "gamma": 0.85, "mu": 0.72, "seats_base": 80},
        "3131.0201": {"alpha": 0.90, "beta": 0.10, "gamma": 0.91, "mu": 0.80, "seats_base": 40},
        "7231.0102": {"alpha": 0.94, "beta": 0.11, "gamma": 0.89, "mu": 0.78, "seats_base": 140}, # EV Service
        "7223.0501": {"alpha": 0.92, "beta": 0.12, "gamma": 0.87, "mu": 0.74, "seats_base": 240}, # CNC Machinist
        "7212.0100": {"alpha": 0.88, "beta": 0.15, "gamma": 0.84, "mu": 0.70, "seats_base": 100},
        "5321.0100": {"alpha": 0.89, "beta": 0.13, "gamma": 0.92, "mu": 0.82, "seats_base": 200}, # GDA Healthcare
        "5322.0101": {"alpha": 0.85, "beta": 0.17, "gamma": 0.88, "mu": 0.76, "seats_base": 90},
        "3212.0100": {"alpha": 0.91, "beta": 0.12, "gamma": 0.90, "mu": 0.79, "seats_base": 80},
        "4132.0100": {"alpha": 0.96, "beta": 0.22, "gamma": 0.82, "mu": 0.58, "seats_base": 650}, # DEO (Massive seat over-allocation!)
        "3514.0201": {"alpha": 0.84, "beta": 0.15, "gamma": 0.86, "mu": 0.75, "seats_base": 50},
        "3513.0100": {"alpha": 0.88, "beta": 0.12, "gamma": 0.89, "mu": 0.80, "seats_base": 40}
    }

    for item in demand_data:
        d_code = item["district_lgd_code"]
        nco = item["nco_code"]
        yield_info = trade_yields.get(nco, {"alpha": 0.85, "beta": 0.15, "gamma": 0.85, "mu": 0.70, "seats_base": 100})
        
        # Scale seats according to district tier
        seat_scale = 1.0
        if d_code in [492, 485, 148]:
            seat_scale = 2.0
        elif d_code in [160, 158, 365, 376]:
            seat_scale = 1.4
        elif d_code in [180, 475]:
            seat_scale = 0.4

        sanctioned_seats = max(20, int(round(yield_info["seats_base"] * seat_scale)))
        
        # Leaky funnel breakdown
        enrolled = int(round(sanctioned_seats * yield_info["alpha"]))
        completions = int(round(enrolled * (1.0 - yield_info["beta"])))
        certified = int(round(completions * yield_info["gamma"]))
        locally_available = int(round(certified * yield_info["mu"]))

        # Informal e-Shram pool estimate
        informal_pool = max(10, int(round(sanctioned_seats * random.uniform(0.3, 0.8))))

        capacity_records.append({
            "district_lgd_code": d_code,
            "district_name": item["district_name"],
            "state_name": item["state_name"],
            "nco_code": nco,
            "trade_name": item["trade_name"],
            "sector_name": item["sector_name"],
            "sanctioned_annual_seats": sanctioned_seats,
            "intake_enrollment": enrolled,
            "completions": completions,
            "certified_candidates": certified,
            "locally_available_supply": locally_available,
            "informal_worker_pool": informal_pool,
            "attrition_coefficients": {
                "alpha_enrollment_rate": yield_info["alpha"],
                "beta_dropout_rate": yield_info["beta"],
                "gamma_certification_rate": yield_info["gamma"],
                "mu_local_retention_rate": yield_info["mu"]
            },
            "net_conversion_yield_pct": round((locally_available / sanctioned_seats) * 100, 1),
            "is_simulated": True
        })

    out_file = settings.PILOT_DATA_PATH / "institutional_capacity.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"total_records": len(capacity_records), "records": capacity_records}, f, indent=2)
    print(f"Generated institutional capacity data: {len(capacity_records)} records -> {out_file}")

if __name__ == "__main__":
    generate_pilot_telemetry()
    generate_institutional_capacity()
