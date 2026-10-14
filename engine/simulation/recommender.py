from typing import List, Dict, Any
from engine.analytics.gap_analyzer import gap_analyzer
from engine.simulation.budget_modeler import budget_infra_modeler

class DSDPRecommender:
    """
    Automated District Skill Development Plan (DSDP) Target Reallocation Optimizer.
    Suggests transfers from saturated trades to shortage trades to balance labor tension.
    """

    def generate_recommendations(self, district_lgd_code: int) -> Dict[str, Any]:
        records = gap_analyzer.query(district_lgd_code=district_lgd_code)
        if not records:
            return {"error": "District not found or no data available"}

        district_name = records[0]["district_name"]
        state_name = records[0]["state_name"]

        proposed_shifts = []
        total_seats_reallocated = 0
        estimated_budget_freed = 0
        estimated_budget_required = 0

        # Separate shortage trades and surplus trades
        shortages = [r for r in records if r["gap_analysis"]["12M"]["absolute_gap"] > 100]
        surpluses = [r for r in records if r["gap_analysis"]["12M"]["absolute_gap"] < -50]

        for sur in surpluses:
            gap = sur["gap_analysis"]["12M"]["absolute_gap"]
            current_seats = sur["supply"]["sanctioned_seats"]
            # Downscale by up to 40% of current seats or half the surplus
            recommended_cut = min(int(round(current_seats * 0.40)), int(round(abs(gap) * 0.60)))
            if recommended_cut > 10:
                cost_info = budget_infra_modeler.evaluate_cost_and_feasibility(sur["nco_code"], -recommended_cut)
                proposed_shifts.append({
                    "action_type": "REDUCE_SANCTIONED_SEATS",
                    "nco_code": sur["nco_code"],
                    "trade_name": sur["trade_name"],
                    "sector_name": sur["sector_name"],
                    "current_seats": current_seats,
                    "recommended_delta": -recommended_cut,
                    "proposed_target": current_seats - recommended_cut,
                    "budget_impact_inr": cost_info["total_fiscal_delta_inr"],
                    "rationale": f"Severe oversupply (Gap: {gap}). Certified candidates face employment saturation."
                })
                total_seats_reallocated += recommended_cut
                estimated_budget_freed += abs(cost_info["total_fiscal_delta_inr"])

        for sho in shortages:
            gap = sho["gap_analysis"]["12M"]["absolute_gap"]
            current_seats = sho["supply"]["sanctioned_seats"]
            conversion_yield = sho["supply"]["net_conversion_yield_pct"] / 100.0
            needed_seats = int(round((gap * 0.50) / max(0.2, conversion_yield)))
            recommended_add = min(300, max(20, needed_seats))

            cost_info = budget_infra_modeler.evaluate_cost_and_feasibility(sho["nco_code"], recommended_add)
            proposed_shifts.append({
                "action_type": "EXPAND_SANCTIONED_SEATS",
                "nco_code": sho["nco_code"],
                "trade_name": sho["trade_name"],
                "sector_name": sho["sector_name"],
                "current_seats": current_seats,
                "recommended_delta": +recommended_add,
                "proposed_target": current_seats + recommended_add,
                "budget_impact_inr": cost_info["total_fiscal_delta_inr"],
                "lead_time_months": cost_info["procurement_lead_time_months"],
                "rationale": f"Acute worker shortage (Gap: +{gap}). High employer demand and sunrise growth trajectory."
            })
            estimated_budget_required += cost_info["total_fiscal_delta_inr"]

        return {
            "district_lgd_code": district_lgd_code,
            "district_name": district_name,
            "state_name": state_name,
            "total_recommended_adjustments": len(proposed_shifts),
            "proposed_seat_adjustments": proposed_shifts,
            "fiscal_summary": {
                "budget_freed_from_curtailment_inr": estimated_budget_freed,
                "budget_required_for_expansion_inr": estimated_budget_required,
                "net_fiscal_variance_inr": estimated_budget_required - estimated_budget_freed,
                "net_fiscal_variance_lakhs": round((estimated_budget_required - estimated_budget_freed) / 100000.0, 2)
            },
            "policy_guidance": "Recommended seat shifts maximize local youth absorption while minimizing net scheme budget increases."
        }

dsdp_recommender = DSDPRecommender()
