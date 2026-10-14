from typing import Dict, Any, Optional
from engine.analytics.gap_analyzer import gap_analyzer
from engine.analytics.supply_funnel import supply_modeler
from engine.analytics.early_warning import early_warning_radar

class SimulationSandboxCore:
    """
    Sub-20ms in-memory simulation engine for planner What-If scenarios.
    """

    def simulate(
        self,
        district_lgd_code: int,
        nco_code: str,
        seat_capacity_delta: int = 0,
        assumed_enrollment_rate: Optional[float] = None,
        assumed_dropout_rate: Optional[float] = None,
        assumed_retention_rate: Optional[float] = None,
        horizon: str = "12M"
    ) -> Dict[str, Any]:
        baseline = gap_analyzer.get_by_district_and_trade(district_lgd_code, nco_code)
        if not baseline:
            return {"error": "Record not found for given district and trade"}

        # Extract baseline parameters
        base_demand = baseline["demand"][f"forecast_{horizon.lower()}"]
        base_supply_metrics = baseline["supply"]
        base_sanctioned = base_supply_metrics["sanctioned_seats"]
        base_coefficients = base_supply_metrics["pipeline_yield_12m"]["coefficients"]
        
        alpha = assumed_enrollment_rate if assumed_enrollment_rate is not None else base_coefficients["alpha_enrolment"]
        beta = assumed_dropout_rate if assumed_dropout_rate is not None else base_coefficients["beta_dropout"]
        gamma = base_coefficients["gamma_certification"]
        mu = assumed_retention_rate if assumed_retention_rate is not None else base_coefficients["mu_local_retention"]
        
        # New simulated seats
        simulated_sanctioned_seats = max(0, base_sanctioned + seat_capacity_delta)

        # Recalculate pipeline yield
        sim_yield = supply_modeler.calculate_effective_supply(
            sanctioned_seats=simulated_sanctioned_seats,
            alpha=alpha,
            beta=beta,
            gamma=gamma,
            mu=mu,
            informal_pool=base_supply_metrics["informal_worker_pool"],
            horizon_months=12
        )

        sim_eff_supply = sim_yield["total_effective_supply"]
        sim_abs_gap = base_demand - sim_eff_supply
        sim_tension_ratio = round(base_demand / max(1, sim_eff_supply), 2)

        # Re-evaluate early warning state
        sim_warning = early_warning_radar.classify(
            absolute_gap=sim_abs_gap,
            tension_ratio=sim_tension_ratio,
            confidence_score=baseline["gap_analysis"]["confidence_score"],
            growth_rate_pct=baseline["demand"]["yoy_trend_pct"]
        )

        # Baseline comparison
        base_gap = baseline["gap_analysis"][horizon]["absolute_gap"]
        base_tension = baseline["gap_analysis"][horizon]["tension_ratio"]
        base_warning = baseline["gap_analysis"]["early_warning"]

        gap_mitigated = base_gap - sim_abs_gap
        gap_reduction_pct = round((gap_mitigated / max(1, abs(base_gap))) * 100.0, 1) if base_gap != 0 else 0.0

        # Feedback statement
        feedback = self._generate_simulation_feedback(
            trade_name=baseline["trade_name"],
            seat_delta=seat_capacity_delta,
            base_gap=base_gap,
            sim_gap=sim_abs_gap,
            base_flag=base_warning["flag_code"],
            sim_flag=sim_warning["flag_code"],
            gap_reduction_pct=gap_reduction_pct
        )

        return {
            "district_lgd_code": district_lgd_code,
            "district_name": baseline["district_name"],
            "state_name": baseline["state_name"],
            "nco_code": nco_code,
            "trade_name": baseline["trade_name"],
            "horizon": horizon,
            "projected_demand": base_demand,
            "baseline": {
                "sanctioned_seats": base_sanctioned,
                "effective_supply": base_supply_metrics[f"effective_supply_{horizon.lower()}"],
                "absolute_gap": base_gap,
                "tension_ratio": base_tension,
                "risk_category": base_warning["label"],
                "flag_code": base_warning["flag_code"],
                "badge_color": base_warning["badge_color"]
            },
            "simulated": {
                "sanctioned_seats": simulated_sanctioned_seats,
                "effective_supply": sim_eff_supply,
                "absolute_gap": sim_abs_gap,
                "tension_ratio": sim_tension_ratio,
                "risk_category": sim_warning["label"],
                "flag_code": sim_warning["flag_code"],
                "badge_color": sim_warning["badge_color"],
                "pipeline_yield": sim_yield
            },
            "impact_assessment": {
                "additional_trained_workers": sim_eff_supply - base_supply_metrics[f"effective_supply_{horizon.lower()}"],
                "gap_mitigated": gap_mitigated,
                "gap_reduction_pct": gap_reduction_pct,
                "status_transition": f"{base_warning['label']} -> {sim_warning['label']}",
                "policy_feedback": feedback
            }
        }

    def _generate_simulation_feedback(
        self,
        trade_name: str,
        seat_delta: int,
        base_gap: int,
        sim_gap: int,
        base_flag: str,
        sim_flag: str,
        gap_reduction_pct: float
    ) -> str:
        if base_gap > 0: # Shortage
            if sim_flag == "BALANCED_EQUILIBRIUM":
                return f"Adding {seat_delta} seats successfully brings {trade_name} into Balanced Equilibrium, eliminating the labor shortage!"
            elif gap_reduction_pct > 0:
                return f"Adding {seat_delta} seats mitigates {gap_reduction_pct}% of the labor deficit. Complement with accelerated RPL drives to achieve full equilibrium."
            else:
                return "Simulated adjustments did not meaningfully decrease the worker shortage."
        else: # Surplus
            if seat_delta < 0:
                return f"Downscaling capacity by {abs(seat_delta)} seats reduces wasteful oversupply by {gap_reduction_pct}%, conserving scheme funds and protecting graduate wages."
            else:
                return "Increasing seats in an already saturated trade worsens graduate underemployment and is strongly discouraged."

simulation_sandbox = SimulationSandboxCore()
