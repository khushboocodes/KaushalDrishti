import io
import csv
import json
from typing import Dict, Any, List
from engine.analytics.gap_analyzer import gap_analyzer
from engine.simulation.recommender import dsdp_recommender

class TargetExporter:
    """Generates MSDE-compliant DSDP target package exports."""

    def generate_csv(self, district_lgd_code: int) -> str:
        recs = dsdp_recommender.generate_recommendations(district_lgd_code)
        if "error" in recs:
            return "Error: District not found"

        output = io.StringIO()
        writer = csv.writer(output)
        
        # Official MSDE DSDP Header
        writer.writerow(["MINISTRY OF SKILL DEVELOPMENT AND ENTREPRENEURSHIP (MSDE)"])
        writer.writerow(["DISTRICT SKILL DEVELOPMENT PLAN (DSDP) - ANNUAL SEAT TARGET ALLOCATION"])
        writer.writerow([f"District: {recs['district_name']} (LGD: {recs['district_lgd_code']})", f"State: {recs['state_name']}"])
        writer.writerow([])
        
        # Table Header
        writer.writerow([
            "Trade / Occupation Title",
            "NCO-2015 Code",
            "Sector",
            "Action Type",
            "Current Sanctioned Seats",
            "Recommended Seat Adjustment",
            "Proposed New Sanctioned Target",
            "Estimated Fiscal Variance (INR)",
            "Policy Justification"
        ])

        for item in recs.get("proposed_seat_adjustments", []):
            writer.writerow([
                item["trade_name"],
                item["nco_code"],
                item["sector_name"],
                item["action_type"],
                item["current_seats"],
                item["recommended_delta"],
                item["proposed_target"],
                item["budget_impact_inr"],
                item["rationale"]
            ])

        writer.writerow([])
        writer.writerow(["FISCAL SUMMARY"])
        writer.writerow(["Budget Freed from Saturated Trades (INR)", recs["fiscal_summary"]["budget_freed_from_curtailment_inr"]])
        writer.writerow(["Budget Required for Sunrise Trades (INR)", recs["fiscal_summary"]["budget_required_for_expansion_inr"]])
        writer.writerow(["Net Fiscal Variance (INR)", recs["fiscal_summary"]["net_fiscal_variance_inr"]])
        writer.writerow(["Net Fiscal Variance (Lakhs INR)", recs["fiscal_summary"]["net_fiscal_variance_lakhs"]])

        return output.getvalue()

target_exporter = TargetExporter()
