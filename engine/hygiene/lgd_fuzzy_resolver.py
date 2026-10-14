"""
Tri-Tier LGD Fuzzy Geographic Resolver
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Problem Statement ID: 26246

Resolves noisy, colloquial, and legacy district strings to authoritative
LGD codes using exact alias lookup, phonetic normalization, and Jaro-Winkler/Token-Sort scoring.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from rapidfuzz import process, fuzz
from engine.ontology.lgd_master import lgd_master
from backend.logger import logger

class ResolutionResult(BaseModel):
    query: str
    resolved: bool
    district_lgd_code: Optional[int] = None
    district_name: Optional[str] = None
    state_lgd_code: Optional[int] = None
    state_name: Optional[str] = None
    confidence_score: float
    resolution_method: str  # 'EXACT_ALIAS', 'PHONETIC_MATCH', 'FUZZY_JARO_WINKLER', 'FAILED'

class LGDFuzzyResolver:
    """
    Robust enterprise geographic entity resolution engine for Indian administrative boundaries.
    """

    CONFIDENCE_THRESHOLD = 0.75

    def __init__(self):
        self.master = lgd_master
        self.logger = logger
        # Precomputed common phonetic mappings
        self._phonetic_aliases = {
            "kashi": "varanasi",
            "benares": "varanasi",
            "banaras": "varanasi",
            "cawnpore": "kanpur nagar",
            "kanpur": "kanpur nagar",
            "poona": "pune",
            "bombay": "mumbai",
            "orissa": "odisha",
            "bhubaneshwar": "khordha",
            "bhubaneswar": "khordha",
            "sonbhadra": "sonbhadra",
            "gadhchiroli": "gadchiroli",
            "prayag": "prayagraj",
            "allahabad": "prayagraj",
            "faizabad": "ayodhya",
        }

    def _phonetic_normalize(self, text: str) -> str:
        """Applies sound-alike rules for Indian Anglicized spellings."""
        s = text.lower().strip()
        # Common Anglicized vowel and consonant variants
        s = s.replace("aa", "a").replace("ee", "i").replace("oo", "u").replace("ou", "u")
        s = s.replace("gh", "g").replace("bh", "b").replace("dh", "d").replace("th", "t").replace("kh", "k")
        s = s.replace("sh", "s").replace("w", "v")
        return s

    def resolve(self, query: str, state_hint: Optional[str] = None) -> ResolutionResult:
        """
        Executes 3-tier resolution:
        Tier 1: Canonical Name & Direct Master Alias match (Confidence = 1.0)
        Tier 2: Phonetic Alias Dictionary & Phonetic Normalization (Confidence >= 0.90)
        Tier 3: RapidFuzz / WRatio fuzzy match (Confidence = match_score / 100)
        """
        if not query or not query.strip():
            return ResolutionResult(
                query=str(query),
                resolved=False,
                confidence_score=0.0,
                resolution_method="FAILED"
            )

        q_clean = query.strip().lower()

        # Tier 1: Canonical / Direct Alias
        if q_clean in self.master._alias_to_id:
            code = self.master._alias_to_id[q_clean]
            d = self.master.get_by_code(code)
            return ResolutionResult(
                query=query,
                resolved=True,
                district_lgd_code=code,
                district_name=d["district_name"],
                state_lgd_code=d["state_lgd_code"],
                state_name=d["state_name"],
                confidence_score=1.0,
                resolution_method="EXACT_ALIAS"
            )

        # Tier 2: Phonetic Alias Dictionary & Phonetic normalization
        if q_clean in self._phonetic_aliases:
            target_canonical = self._phonetic_aliases[q_clean]
            if target_canonical in self.master._alias_to_id:
                code = self.master._alias_to_id[target_canonical]
                d = self.master.get_by_code(code)
                return ResolutionResult(
                    query=query,
                    resolved=True,
                    district_lgd_code=code,
                    district_name=d["district_name"],
                    state_lgd_code=d["state_lgd_code"],
                    state_name=d["state_name"],
                    confidence_score=0.95,
                    resolution_method="PHONETIC_MATCH"
                )

        q_phon = self._phonetic_normalize(q_clean)
        if q_phon in self.master._alias_to_id:
            code = self.master._alias_to_id[q_phon]
            d = self.master.get_by_code(code)
            return ResolutionResult(
                query=query,
                resolved=True,
                district_lgd_code=code,
                district_name=d["district_name"],
                state_lgd_code=d["state_lgd_code"],
                state_name=d["state_name"],
                confidence_score=0.92,
                resolution_method="PHONETIC_MATCH"
            )

        # Tier 3: Scoped or Global RapidFuzz Match across canonical names and aliases
        candidates_map: Dict[str, int] = {}
        if state_hint and state_hint in self.master._state_groups:
            for d in self.master._state_groups[state_hint]:
                code = d["district_lgd_code"]
                candidates_map[d["district_name"].lower()] = code
                for a in d.get("aliases", []):
                    candidates_map[a.lower()] = code
        else:
            candidates_map = self.master._alias_to_id

        if candidates_map:
            candidate_strings = list(candidates_map.keys())
            match = process.extractOne(q_clean, candidate_strings, scorer=fuzz.WRatio)
            if match:
                matched_str, score, _ = match
                conf = score / 100.0
                if conf >= self.CONFIDENCE_THRESHOLD:
                    code = candidates_map[matched_str]
                    d = self.master.get_by_code(code)
                    return ResolutionResult(
                        query=query,
                        resolved=True,
                        district_lgd_code=code,
                        district_name=d["district_name"],
                        state_lgd_code=d["state_lgd_code"],
                        state_name=d["state_name"],
                        confidence_score=round(conf, 3),
                        resolution_method="FUZZY_JARO_WINKLER"
                    )

        return ResolutionResult(
            query=query,
            resolved=False,
            confidence_score=0.0,
            resolution_method="FAILED"
        )
