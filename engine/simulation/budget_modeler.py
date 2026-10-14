from typing import Dict, Any

class BudgetAndInfraModeler:
    """
    Models fiscal impact and infrastructure lead-time constraints under MSDE Common Cost Norms.
    """
    
    # Common Cost Norms per candidate hour
    HOURLY_RATES = {
        "Category-I (Technical)": 49.00,
        "Category-II (Services)": 42.50
    }

    # Standard course hours
    DEFAULT_HOURS = {
        "7411.0101": 300, # Solar PV
        "7411.0102": 200,
        "7231.0102": 400, # EV Technician
        "7223.0501": 1200,# CNC Machinist
        "5321.0100": 360, # GDA
        "4132.0100": 200, # DEO
        "3514.0201": 240, # AI Data
        "3513.0100": 400  # Cyber SOC
    }

    LEAD_TIME_MONTHS = {
        "7411.0101": 4, # Solar lab setup & grid safety clearance
        "7411.0102": 2,
        "7231.0102": 6, # High voltage EV testing rig
        "7223.0501": 6, # Heavy CNC machinery procurement
        "5321.0100": 3, # Hospital tie-up & nursing sim lab
        "4132.0100": 1, # Basic computer lab
        "3514.0201": 1,
        "3513.0100": 2
    }

    def evaluate_cost_and_feasibility(self, nco_code: str, seat_delta: int) -> Dict[str, Any]:
        hours = self.DEFAULT_HOURS.get(nco_code, 300)
        category = "Category-I (Technical)" if nco_code.startswith(("7", "3")) else "Category-II (Services)"
        rate_per_hour = self.HOURLY_RATES.get(category, 45.0)

        # Cost per candidate
        cost_per_trainee = hours * rate_per_hour
        total_fiscal_delta = int(round(cost_per_trainee * seat_delta))
        lead_time = self.LEAD_TIME_MONTHS.get(nco_code, 3)

        feasibility_status = "FEASIBLE"
        warnings = []

        if seat_delta > 300 and lead_time >= 4:
            feasibility_status = "INFRASTRUCTURE_CONSTRAINED"
            warnings.append(f"Expansion of +{seat_delta} seats exceeds typical district lab capacity. Requires phased procurement over {lead_time} months.")

        return {
            "nco_code": nco_code,
            "cost_norm_category": category,
            "rate_per_candidate_hour_inr": rate_per_hour,
            "training_duration_hours": hours,
            "cost_per_certified_candidate_inr": int(round(cost_per_trainee)),
            "total_fiscal_delta_inr": total_fiscal_delta,
            "total_fiscal_delta_lakhs": round(total_fiscal_delta / 100000.0, 2),
            "procurement_lead_time_months": lead_time,
            "feasibility_status": feasibility_status,
            "warnings": warnings
        }

budget_infra_modeler = BudgetAndInfraModeler()
