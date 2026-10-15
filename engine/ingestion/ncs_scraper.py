"""
National Career Service (NCS) & Public Employment Exchange Connector
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Ministry of Skill Development and Entrepreneurship (MSDE)
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, date, timedelta
from pydantic import BaseModel, Field
import json
import logging
from backend.logger import logger

class NCSJobPosting(BaseModel):
    job_id: str
    nco_code: str
    title: str
    employer: str
    district_lgd_code: int
    state_lgd_code: int
    vacancies: int = Field(ge=1, default=1)
    posted_date: str
    expiry_date: Optional[str] = None
    min_nsqf_level: int = Field(ge=1, le=10, default=4)
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    skills_raw: List[str] = Field(default_factory=list)
    source_portal: str = "NCS_INDIA"
    is_active: bool = True

class NCSScraperConnector:
    """
    Automated batch connector and parser for National Career Service (NCS)
    and State Employment Exchange vacancy feeds.
    """

    def __init__(self, feed_url: Optional[str] = None):
        self.feed_url = feed_url or "https://data.gov.in/api/ncs/vacancies"
        self.logger = logger

    def validate_and_parse_record(self, raw_record: Dict[str, Any]) -> Optional[NCSJobPosting]:
        """
        Validates a single raw posting against schema, standardizing dates and codes.
        """
        try:
            # Handle date formatting
            posted_dt_str = raw_record.get("posted_date")
            if not posted_dt_str:
                posted_dt_str = datetime.now().strftime("%Y-%m-%d")

            # Check if expired
            expiry_dt_str = raw_record.get("expiry_date")
            is_active = True
            if expiry_dt_str:
                try:
                    expiry_dt = datetime.strptime(expiry_dt_str, "%Y-%m-%d").date()
                    if expiry_dt < date.today():
                        is_active = False
                except Exception:
                    pass

            posting = NCSJobPosting(
                job_id=str(raw_record.get("job_id", f"NCS-{int(datetime.now().timestamp())}")),
                nco_code=str(raw_record.get("nco_code", "7411.0101")),
                title=str(raw_record.get("title", "Technician")),
                employer=str(raw_record.get("employer", "Anonymous Industry")),
                district_lgd_code=int(raw_record.get("district_lgd_code", 184)),
                state_lgd_code=int(raw_record.get("state_lgd_code", 9)),
                vacancies=max(1, int(raw_record.get("vacancies", 1))),
                posted_date=posted_dt_str,
                expiry_date=expiry_dt_str,
                min_nsqf_level=int(raw_record.get("min_nsqf_level", 4)),
                salary_min=raw_record.get("salary_min"),
                salary_max=raw_record.get("salary_max"),
                skills_raw=raw_record.get("skills_raw", []),
                source_portal=raw_record.get("source_portal", "NCS_INDIA"),
                is_active=is_active
            )
            return posting
        except Exception as e:
            self.logger.warning(f"Failed to parse raw NCS record: {raw_record}. Error: {e}")
            return None

    def ingest_batch(self, raw_records: List[Dict[str, Any]]) -> List[NCSJobPosting]:
        """
        Parses and validates a batch of raw records from NCS.
        """
        valid_postings = []
        for rec in raw_records:
            parsed = self.validate_and_parse_record(rec)
            if parsed:
                valid_postings.append(parsed)
        self.logger.info(f"NCS Connector: Ingested {len(valid_postings)} valid postings from {len(raw_records)} raw records.")
        return valid_postings

    def generate_calibrated_stream(self, district_lgd: int, nco_code: str, count: int = 5) -> List[NCSJobPosting]:
        """
        Generates calibrated benchmark stream for offline evaluation & live demo simulations.
        """
        results = []
        today = date.today()
        for i in range(count):
            posted = today - timedelta(days=i * 4)
            expiry = today + timedelta(days=30 - i * 4)
            posting = NCSJobPosting(
                job_id=f"NCS-{district_lgd}-{nco_code.replace('.', '')}-{i+101}",
                nco_code=nco_code,
                title=f"Industrial Role {nco_code}",
                employer=f"Enterprise Partner #{100 + i}",
                district_lgd_code=district_lgd,
                state_lgd_code=9 if district_lgd in [184, 155, 178] else 27,
                vacancies=3 + (i % 4) * 2,
                posted_date=posted.strftime("%Y-%m-%d"),
                expiry_date=expiry.strftime("%Y-%m-%d"),
                min_nsqf_level=4,
                salary_min=18000.0,
                salary_max=28000.0,
                skills_raw=["Technical Operations", "Quality Control", "Preventive Maintenance"],
                source_portal="NCS_INDIA",
                is_active=True
            )
            results.append(posting)
        return results
