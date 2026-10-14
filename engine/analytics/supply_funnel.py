from typing import Dict, Any

class SupplyFunnelModeler:
    """
    Models the multi-stage leaky supply pipeline yield according to PRD Section 6:
    Sanctioned Seats (C)
      * Enrolment Rate (alpha) -> Enrolled
      * Completion Rate (1 - beta) -> Completers
      * Certification Pass Rate (gamma) -> Certified Candidates
      * Local Retention & Participation (mu) -> Locally Available Workers S_eff
    """

    def calculate_effective_supply(
        self,
        sanctioned_seats: int,
        alpha: float = 0.85, # Enrolment
        beta: float = 0.15,  # Dropout
        gamma: float = 0.88, # Certification pass
        mu: float = 0.72,    # Local retention factor
        informal_pool: int = 0,
        informal_discount_theta: float = 0.35, # e-Shram RPL discount
        stock_pool: int = 0,
        monthly_attrition_delta: float = 0.01,
        horizon_months: int = 12
    ) -> Dict[str, Any]:
        
        # 1. Pipeline Stages
        enrolled = int(round(sanctioned_seats * alpha))
        completers = int(round(enrolled * (1.0 - beta)))
        certified = int(round(completers * gamma))
        formal_available = int(round(certified * mu))

        # 2. Informal pool with RPL discount
        effective_informal = int(round(informal_pool * informal_discount_theta))

        # 3. Existing stock with natural attrition
        depleted_stock = int(round(stock_pool * ((1.0 - monthly_attrition_delta) ** horizon_months)))

        total_effective_supply = formal_available + effective_informal + depleted_stock
        net_conversion_yield_pct = round((formal_available / max(1, sanctioned_seats)) * 100.0, 1)

        return {
            "sanctioned_seats": sanctioned_seats,
            "pipeline_funnel": {
                "enrolled_candidates": enrolled,
                "completed_trainees": completers,
                "certified_graduates": certified,
                "locally_retained_workers": formal_available
            },
            "informal_contribution": effective_informal,
            "stock_carryover": depleted_stock,
            "total_effective_supply": total_effective_supply,
            "net_conversion_yield_pct": net_conversion_yield_pct,
            "coefficients": {
                "alpha_enrolment": alpha,
                "beta_dropout": beta,
                "gamma_certification": gamma,
                "mu_local_retention": mu
            }
        }

supply_modeler = SupplyFunnelModeler()
