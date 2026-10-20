from fastapi.testclient import TestClient
from backend.main import app
from engine.ingestion.telemetry_ledger import telemetry_ledger

client = TestClient(app)

def test_telemetry_ledger_endpoints():
    # 1. Reset ledger before test
    res = client.delete("/api/telemetry/reset")
    assert res.status_code == 200

    # 2. Check initial empty state
    res = client.get("/api/telemetry/batches")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 0
    assert data["batches"] == []

    # 3. Commit a sample batch
    sample_batch = {
        "batchId": "BATCH-TEST-2026",
        "fileName": "test_district_telemetry.csv",
        "fileSizeKb": 12.5,
        "uploadedAt": "10:30 AM",
        "totalRows": 2,
        "validRowsCount": 2,
        "flaggedRowsCount": 0,
        "uniqueDistricts": ["Kanpur Nagar (LGD 158)"],
        "totalSanctioned": 100,
        "totalEnrolled": 90,
        "totalCertified": 85,
        "totalRetained": 70,
        "avgRetentionRate": 82.4,
        "status": "Verified",
        "sha256Hash": "0x1234567890abcdef",
        "rows": [
            {
                "districtLgdCode": 158,
                "districtName": "Kanpur Nagar",
                "state": "Uttar Pradesh",
                "itiMisCode": "ITI090158",
                "tradeNcoCode": "7411.0101",
                "tradeName": "Solar PV Rooftop Technician",
                "sector": "Green Energy",
                "nsqfLevel": 4,
                "sanctionedSeats": 60,
                "enrolledCount": 55,
                "certifiedCount": 50,
                "retainedCount": 42,
                "isValid": True,
                "validationErrors": []
            },
            {
                "districtLgdCode": 158,
                "districtName": "Kanpur Nagar",
                "state": "Uttar Pradesh",
                "itiMisCode": "ITI090158",
                "tradeNcoCode": "7231.0102",
                "tradeName": "EV Automotive Service Technician",
                "sector": "Automotive",
                "nsqfLevel": 4,
                "sanctionedSeats": 40,
                "enrolledCount": 35,
                "certifiedCount": 35,
                "retainedCount": 28,
                "isValid": True,
                "validationErrors": []
            }
        ]
    }

    res = client.post("/api/telemetry/commit", json=sample_batch)
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["status"] == "success"
    assert res_data["batchId"] == "BATCH-TEST-2026"

    # 4. Fetch batches and verify persistence
    res = client.get("/api/telemetry/batches")
    assert res.status_code == 200
    batches_data = res.json()
    assert batches_data["count"] == 1
    assert batches_data["batches"][0]["batchId"] == "BATCH-TEST-2026"

    # 5. Fetch explorer records and verify schema
    res = client.get("/api/telemetry/records")
    assert res.status_code == 200
    records_data = res.json()
    assert records_data["count"] == 2
    assert records_data["records"][0]["source"] == "Live District Telemetry (MSDE v2.4)"

    # Clean up after test
    client.delete("/api/telemetry/reset")
