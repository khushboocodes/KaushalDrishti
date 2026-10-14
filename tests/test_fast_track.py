import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["system"] == "KaushalDrishti"

def test_national_summary():
    res = client.get("/api/v1/intelligence/national-summary?horizon=12M")
    assert res.status_code == 200
    data = res.json()
    assert "national_kpis" in data
    assert data["national_kpis"]["total_projected_demand"] > 0
    assert len(data["top_10_shortages"]) > 0
    assert len(data["top_10_oversupply"]) > 0
    assert len(data["state_aggregates"]) >= 3

def test_forecasts_query():
    res = client.get("/api/v1/intelligence/forecasts?district_lgd_code=158&horizon=12M")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] > 0
    first = data["records"][0]
    assert first["district_name"] == "Kanpur Nagar"
    assert "demand" in first
    assert "supply" in first
    assert "gap_analysis" in first

def test_trade_detail():
    res = client.get("/api/v1/intelligence/trade-detail/158/7411.0101")
    assert res.status_code == 200
    data = res.json()
    assert data["trade_name"] == "Solar PV Installation & Maintenance Technician"
    assert len(data["monthly_timeseries"]) == 48

def test_simulation_sandbox():
    payload = {
        "district_lgd_code": 158,
        "nco_code": "7411.0101",
        "seat_capacity_delta": 100,
        "assumed_enrollment_rate": 0.90,
        "assumed_dropout_rate": 0.10,
        "assumed_retention_rate": 0.80,
        "horizon": "12M"
    }
    res = client.post("/api/v1/simulation/simulate-gap", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "baseline" in data
    assert "simulated" in data
    assert "impact_assessment" in data
    assert data["simulated"]["sanctioned_seats"] > data["baseline"]["sanctioned_seats"]

def test_recommendations():
    res = client.get("/api/v1/simulation/recommendations/158")
    assert res.status_code == 200
    data = res.json()
    assert data["total_recommended_adjustments"] > 0

def test_metadata_endpoints():
    res_dist = client.get("/api/v1/meta/districts?state_name=Uttar%20Pradesh")
    assert res_dist.status_code == 200
    assert len(res_dist.json()["districts"]) > 0

    res_trades = client.get("/api/v1/meta/trades")
    assert res_trades.status_code == 200
    assert len(res_trades.json()["trades"]) > 0

    res_sec = client.get("/api/v1/meta/sectors")
    assert res_sec.status_code == 200
    assert len(res_sec.json()["sectors"]) == 4

def test_export_csv():
    res = client.get("/api/v1/exports/dsdp-csv/158")
    assert res.status_code == 200
    assert "MINISTRY OF SKILL DEVELOPMENT AND ENTREPRENEURSHIP" in res.text
    assert "Kanpur Nagar" in res.text

def test_frontend_serving():
    res = client.get("/")
    assert res.status_code == 200
    assert "KaushalDrishti" in res.text
    assert "National Command" in res.text
