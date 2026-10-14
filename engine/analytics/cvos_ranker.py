from typing import List, Dict, Any
from engine.analytics.gap_analyzer import gap_analyzer

class CVOSRanker:
    """
    Ranks trades and districts using the Composite Vulnerability & Opportunity Score (CVOS).
    Identifies high-priority shortages and extreme oversupply risks.
    """

    def compute_cvos(self, record: Dict[str, Any], horizon: str = "12M") -> float:
        gap_info = record["gap_analysis"][horizon]
        tension = gap_info["tension_ratio"]
        abs_gap = gap_info["absolute_gap"]
        trend = record["demand"]["yoy_trend_pct"]
        conf = record["gap_analysis"]["confidence_score"]

        # Formulate weights
        term_tension = abs(tension - 1.0) * 15.0
        term_gap = (abs(abs_gap) / 100.0) * 8.0
        term_growth = (abs(trend) / 50.0) * 5.0
        term_uncertainty = (1.0 - conf) * 10.0

        cvos_score = term_tension + term_gap + term_growth + term_uncertainty
        return round(float(cvos_score), 2)

    def get_national_summary(self, horizon: str = "12M") -> Dict[str, Any]:
        records = gap_analyzer.list_all()
        if not records:
            return {}

        total_demand = sum(r["demand"][f"forecast_{horizon.lower()}"] for r in records)
        total_supply = sum(r["supply"][f"effective_supply_{horizon.lower()}"] for r in records)
        net_gap = total_demand - total_supply

        # Flag counts
        flag_counts = {}
        for r in records:
            flag = r["gap_analysis"]["early_warning"]["flag_code"]
            flag_counts[flag] = flag_counts.get(flag, 0) + 1

        # Calculate CVOS for all records
        ranked = []
        for r in records:
            score = self.compute_cvos(r, horizon)
            item = dict(r)
            item["cvos_score"] = score
            ranked.append(item)

        # Top Shortages (Positive gap, sorted by gap descending)
        shortages = [r for r in ranked if r["gap_analysis"][horizon]["absolute_gap"] > 0]
        shortages.sort(key=lambda x: x["gap_analysis"][horizon]["absolute_gap"], reverse=True)
        top_shortages = shortages[:10]

        # Top Oversupply (Negative gap, sorted by gap ascending)
        surpluses = [r for r in ranked if r["gap_analysis"][horizon]["absolute_gap"] < 0]
        surpluses.sort(key=lambda x: x["gap_analysis"][horizon]["absolute_gap"])
        top_surpluses = surpluses[:10]

        # State aggregation
        state_summaries = {}
        for r in records:
            st = r["state_name"]
            if st not in state_summaries:
                state_summaries[st] = {
                    "state_name": st,
                    "total_demand": 0,
                    "total_supply": 0,
                    "net_gap": 0,
                    "critical_shortage_count": 0,
                    "severe_oversupply_count": 0,
                    "total_trades_evaluated": 0
                }
            gap = r["gap_analysis"][horizon]["absolute_gap"]
            flag = r["gap_analysis"]["early_warning"]["flag_code"]
            state_summaries[st]["total_demand"] += r["demand"][f"forecast_{horizon.lower()}"]
            state_summaries[st]["total_supply"] += r["supply"][f"effective_supply_{horizon.lower()}"]
            state_summaries[st]["net_gap"] += gap
            state_summaries[st]["total_trades_evaluated"] += 1
            if flag == "CRITICAL_SHORTAGE_RISK":
                state_summaries[st]["critical_shortage_count"] += 1
            elif flag == "SEVERE_OVERSUPPLY_RISK":
                state_summaries[st]["severe_oversupply_count"] += 1

        for st, data in state_summaries.items():
            data["tension_ratio"] = round(data["total_demand"] / max(1, data["total_supply"]), 2)

        return {
            "horizon": horizon,
            "national_kpis": {
                "total_projected_demand": total_demand,
                "total_projected_supply": total_supply,
                "net_national_gap": net_gap,
                "overall_tension_ratio": round(total_demand / max(1, total_supply), 2),
                "high_risk_district_trade_count": flag_counts.get("CRITICAL_SHORTAGE_RISK", 0) + flag_counts.get("SEVERE_OVERSUPPLY_RISK", 0),
                "data_freshness": "Synced: Active Real-time | Source: NCS, Aggregated Portals & DGT Registers"
            },
            "flag_distribution": flag_counts,
            "top_10_shortages": [
                {
                    "trade_name": r["trade_name"],
                    "district_name": r["district_name"],
                    "state_name": r["state_name"],
                    "sector_name": r["sector_name"],
                    "absolute_gap": r["gap_analysis"][horizon]["absolute_gap"],
                    "tension_ratio": r["gap_analysis"][horizon]["tension_ratio"],
                    "flag": r["gap_analysis"]["early_warning"]["label"],
                    "flag_code": r["gap_analysis"]["early_warning"]["flag_code"]
                }
                for r in top_shortages
            ],
            "top_10_oversupply": [
                {
                    "trade_name": r["trade_name"],
                    "district_name": r["district_name"],
                    "state_name": r["state_name"],
                    "sector_name": r["sector_name"],
                    "absolute_gap": r["gap_analysis"][horizon]["absolute_gap"],
                    "tension_ratio": r["gap_analysis"][horizon]["tension_ratio"],
                    "flag": r["gap_analysis"]["early_warning"]["label"],
                    "flag_code": r["gap_analysis"]["early_warning"]["flag_code"]
                }
                for r in top_surpluses
            ],
            "state_aggregates": list(state_summaries.values())
        }

cvos_ranker = CVOSRanker()
