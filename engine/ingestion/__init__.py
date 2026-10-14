"""
Ingestion Package for KaushalDrishti
"""
from .ncs_scraper import NCSScraperConnector, NCSJobPosting
from .eshram_ingestor import EShramIngestionPipeline, EShramAggregatedRecord
from .plfs_pipeline import PLFSPipeline, PLFSMacroIndicators

__all__ = [
    "NCSScraperConnector",
    "NCSJobPosting",
    "EShramIngestionPipeline",
    "EShramAggregatedRecord",
    "PLFSPipeline",
    "PLFSMacroIndicators",
]
