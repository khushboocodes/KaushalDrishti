"""
Hygiene & Deduplication Package for KaushalDrishti
"""
from .simhash_deduplicator import SimHashDeduplicator, DeduplicationResult
from .stale_decay import TemporalDecayEngine, StaleDecaySummary
from .lgd_fuzzy_resolver import LGDFuzzyResolver, ResolutionResult

__all__ = [
    "SimHashDeduplicator",
    "DeduplicationResult",
    "TemporalDecayEngine",
    "StaleDecaySummary",
    "LGDFuzzyResolver",
    "ResolutionResult",
]
