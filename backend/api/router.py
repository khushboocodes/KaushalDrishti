from fastapi import APIRouter, Query, Response, HTTPException
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

from backend.config import settings
from engine.ontology.lgd_master import lgd_master
from engine.ontology.nco_master import nco_master
from engine.analytics.gap_analyzer import gap_analyzer
from engine.analytics.cvos_ranker import cvos_ranker
from engine.simulation.sandbox_core import simulation_sandbox
from engine.simulation.recommender import dsdp_recommender
from engine.export.exporter import target_exporter

api_router = APIRouter()

# --- Request Models ---
class SimulationRequest(BaseModel):
    district_lgd_code: int = Field(..., description="LGD Code of the district (e.g., 158 for Kanpur, 492 for Pune)")
    nco_code: str = Field(..., description="NCO-2015 8-digit trade code (e.g., '7411.0101')")
    seat_capacity_delta: int = Field(0, description="Proposed addition (+) or reduction (-) in sanctioned seats")
    assumed_enrollment_rate: Optional[float] = Field(None, ge=0.0, le=1.0)
    assumed_dropout_rate: Optional[float] = Field(None, ge=0.0, le=1.0)
    assumed_retention_rate: Optional[float] = Field(None, ge=0.0, le=1.0)
    horizon: str = Field("12M", pattern="^(3M|6M|12M)$")

# --- Endpoints ---

@api_router.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "title": settings.PROJECT_TITLE
    }

@api_router.get("/intelligence/national-summary", tags=["Labour Market Intelligence"])
def get_national_summary(horizon: str = Query("12M", pattern="^(3M|6M|12M)$")):
    """Returns high-level national skilling KPIs, early-warning flag distribution, top shortages & surpluses, and state aggregates."""
    return cvos_ranker.get_national_summary(horizon=horizon)

@api_router.get("/intelligence/forecasts", tags=["Labour Market Intelligence"])
def get_forecasts(
    state_name: Optional[str] = Query(None, description="Filter by State (e.g., 'Uttar Pradesh', 'Maharashtra')"),
    district_lgd_code: Optional[int] = Query(None, description="Filter by LGD District code"),
    sector_name: Optional[str] = Query(None, description="Filter by Sector name"),
    flag_code: Optional[str] = Query(None, description="Filter by early-warning state flag"),
    horizon: str = Query("12M", pattern="^(3M|6M|12M)$")
):
    """Retrieves granular district-trade demand-supply forecasts, net gaps, and early warning flags."""
    records = gap_analyzer.query(
        state_name=state_name,
        district_lgd_code=district_lgd_code,
        sector_name=sector_name,
        flag_code=flag_code,
        horizon=horizon
    )
    return {
        "count": len(records),
        "horizon": horizon,
        "records": records
    }

@api_router.get("/intelligence/trade-detail/{district_lgd_code}/{nco_code}", tags=["Labour Market Intelligence"])
def get_trade_detail(district_lgd_code: int, nco_code: str):
    """Retrieves full 48-month time series, competency breakdown, and pipeline details for a specific district-trade pair."""
    record = gap_analyzer.get_by_district_and_trade(district_lgd_code, nco_code)
    if not record:
        raise HTTPException(status_code=404, detail="Trade record not found for given district")
    
    # Enrich with NCO catalog competency keywords
    occ_info = nco_master.get_by_code(nco_code)
    if occ_info:
        record["competency_metadata"] = {
            "core_competencies": occ_info.get("core_competencies", []),
            "nsqf_level": occ_info.get("nsqf_level"),
            "crosswalk": occ_info.get("crosswalk", {})
        }
    return record

@api_router.post("/simulation/simulate-gap", tags=["Policy Decision Support"])
def simulate_capacity_adjustment(payload: SimulationRequest):
    """Simulates the impact of adding/reallocating training seats, altering dropout/retention assumptions on projected gap."""
    res = simulation_sandbox.simulate(
        district_lgd_code=payload.district_lgd_code,
        nco_code=payload.nco_code,
        seat_capacity_delta=payload.seat_capacity_delta,
        assumed_enrollment_rate=payload.assumed_enrollment_rate,
        assumed_dropout_rate=payload.assumed_dropout_rate,
        assumed_retention_rate=payload.assumed_retention_rate,
        horizon=payload.horizon
    )
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res

@api_router.get("/simulation/recommendations/{district_lgd_code}", tags=["Policy Decision Support"])
def get_district_recommendations(district_lgd_code: int):
    """Generates prescriptive seat adjustment recommendations for District Skill Committees (DSDP)."""
    res = dsdp_recommender.generate_recommendations(district_lgd_code)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@api_router.get("/meta/districts", tags=["Metadata & Ontologies"])
def list_districts(state_name: Optional[str] = None):
    """Lists canonical LGD districts."""
    if state_name:
        return {"districts": lgd_master.get_districts_by_state(state_name)}
    return {"districts": lgd_master.list_all()}

@api_router.get("/meta/trades", tags=["Metadata & Ontologies"])
def list_trades(sector_name: Optional[str] = None):
    """Lists NCO occupational trades."""
    if sector_name:
        return {"trades": nco_master.list_by_sector(sector_name)}
    return {"trades": nco_master.list_all()}

@api_router.get("/meta/sectors", tags=["Metadata & Ontologies"])
def list_sectors():
    """Lists all pilot sectors."""
    return {"sectors": settings.PILOT_SECTORS}

@api_router.get("/exports/dsdp-csv/{district_lgd_code}", tags=["Exports & Reporting"])
def export_dsdp_csv(district_lgd_code: int):
    """Exports official MSDE-compliant DSDP annual target CSV."""
    csv_content = target_exporter.generate_csv(district_lgd_code)
    filename = f"DSDP_Target_Allocation_LGD_{district_lgd_code}.csv"
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
