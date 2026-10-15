"""
Ghost Vacancy & Stale Posting Temporal Decay Engine
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Ministry of Skill Development and Entrepreneurship (MSDE)

Applies exponential temporal decay to discount aged job postings and
eliminate phantom 'ghost' vacancies from the effective demand signal:
W_fresh(t) = exp(-lambda * delta_t)
"""

import math
from datetime import datetime, date
from typing import List, Dict, Any, Tuple
from pydantic import BaseModel
from backend.logger import logger

class StaleDecaySummary(BaseModel):
    initial_raw_vacancies: int
    decayed_effective_vacancies: float
    stale_postings_purged: int
    retention_efficiency_pct: float

class TemporalDecayEngine:
    """
    Exponential freshness decay engine preventing ghost vacancies from inflating demand.
    """

    LAMBDA_COMMERCIAL = 0.035   # Half life ~ 20 days
    LAMBDA_PUBLIC = 0.015       # Half life ~ 46 days for govt / public notices
    PURGE_THRESHOLD = 0.05      # Weight below which posting is considered a dead ghost

    def __init__(self, reference_date: date = None):
        self.reference_date = reference_date or date.today()
        self.logger = logger

    def compute_decay_weight(self, posted_date_str: str, source_portal: str = "COMMERCIAL") -> float:
        """
        Calculates exponential decay weight W_fresh(t) based on age in days.
        """
        try:
            posted_dt = datetime.strptime(posted_date_str, "%Y-%m-%d").date()
        except Exception:
            return 1.0

        delta_days = max(0, (self.reference_date - posted_dt).days)

        lam = self.LAMBDA_PUBLIC if ("NCS" in source_portal.upper() or "GOV" in source_portal.upper()) else self.LAMBDA_COMMERCIAL
        weight = math.exp(-lam * delta_days)
        return round(weight, 4)

    def apply_decay_filter(self, postings: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], StaleDecaySummary]:
        """
        Calculates freshness weights for all postings, computes effective decayed vacancy sum,
        and filters out postings that have completely decayed below PURGE_THRESHOLD.
        """
        active_postings = []
        initial_vacancies = 0
        effective_vacancies = 0.0
        purged_count = 0

        for p in postings:
            raw_v = int(p.get("vacancies", 1))
            initial_vacancies += raw_v

            posted_dt = p.get("posted_date", self.reference_date.strftime("%Y-%m-%d"))
            source = p.get("source_portal", "COMMERCIAL")

            w = self.compute_decay_weight(posted_dt, source)
            p["freshness_weight"] = w
            effective_v = raw_v * w
            p["effective_vacancies"] = round(effective_v, 2)

            if w < self.PURGE_THRESHOLD:
                purged_count += 1
                p["is_ghost_vacancy"] = True
            else:
                p["is_ghost_vacancy"] = False
                effective_vacancies += effective_v
                active_postings.append(p)

        efficiency = round((effective_vacancies / initial_vacancies * 100), 2) if initial_vacancies > 0 else 100.0

        summary = StaleDecaySummary(
            initial_raw_vacancies=initial_vacancies,
            decayed_effective_vacancies=round(effective_vacancies, 1),
            stale_postings_purged=purged_count,
            retention_efficiency_pct=efficiency
        )
        self.logger.info(f"Temporal Decay Filter: Raw {initial_vacancies} -> Effective {summary.decayed_effective_vacancies} (Purged {purged_count} stale ghost postings).")
        return active_postings, summary
