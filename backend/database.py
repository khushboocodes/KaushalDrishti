"""
Central Database Connection & SQLAlchemy Models for KaushalDrishti
Supports Production PostgreSQL (Supabase, Neon, AWS RDS, Render) with
Zero-Config Local SQLite Fallback for Offline Development & Testing.
"""

import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy import (
    create_engine,
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    text
)
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from backend.config import settings

logger = logging.getLogger("kaushaldrishti.database")

Base = declarative_base()

class TelemetryBatchModel(Base):
    """Stores committed telemetry ingestion batches and metadata receipt."""
    __tablename__ = "telemetry_batches"

    batch_id = Column(String(128), primary_key=True, index=True)
    file_name = Column(String(256), nullable=True)
    file_size_kb = Column(Float, default=0.0)
    uploaded_at = Column(String(128), nullable=True)
    committed_at = Column(String(128), nullable=True)
    total_rows = Column(Integer, default=0)
    valid_rows_count = Column(Integer, default=0)
    flagged_rows_count = Column(Integer, default=0)
    total_sanctioned = Column(Integer, default=0)
    total_enrolled = Column(Integer, default=0)
    total_certified = Column(Integer, default=0)
    total_retained = Column(Integer, default=0)
    avg_retention_rate = Column(Float, default=0.0)
    sha256_hash = Column(String(128), nullable=True)
    status = Column(String(64), default="Verified")
    unique_districts = Column(Text, nullable=True)  # JSON-encoded array
    raw_payload = Column(Text, nullable=True)       # Full batch JSON for complete recovery
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> Dict[str, Any]:
        """Converts model to dictionary matching frontend IngestionBatchResult."""
        if self.raw_payload:
            try:
                data = json.loads(self.raw_payload)
                data["batchId"] = self.batch_id
                data["committedAt"] = self.committed_at
                return data
            except Exception:
                pass
        
        # Fallback to structured columns
        districts = []
        if self.unique_districts:
            try:
                districts = json.loads(self.unique_districts)
            except Exception:
                districts = [self.unique_districts]

        return {
            "batchId": self.batch_id,
            "fileName": self.file_name or "district_telemetry.csv",
            "fileSizeKb": self.file_size_kb,
            "uploadedAt": self.uploaded_at or self.committed_at or "",
            "committedAt": self.committed_at or "",
            "totalRows": self.total_rows,
            "validRowsCount": self.valid_rows_count,
            "flaggedRowsCount": self.flagged_rows_count,
            "uniqueDistricts": districts,
            "totalSanctioned": self.total_sanctioned,
            "totalEnrolled": self.total_enrolled,
            "totalCertified": self.total_certified,
            "totalRetained": self.total_retained,
            "avgRetentionRate": self.avg_retention_rate,
            "status": self.status,
            "sha256Hash": self.sha256_hash or "",
            "rows": []
        }


class TelemetryRecordModel(Base):
    """Stores individual clean, verified telemetry records for fast indexing."""
    __tablename__ = "telemetry_records"

    id = Column(String(128), primary_key=True, index=True)
    batch_id = Column(String(128), index=True, nullable=False)
    district_lgd_code = Column(Integer, default=0)
    district_name = Column(String(128), index=True)
    state = Column(String(128), index=True)
    iti_mis_code = Column(String(128), nullable=True)
    trade_nco_code = Column(String(64), index=True)
    trade_name = Column(String(256))
    sector = Column(String(128), index=True)
    nsqf_level = Column(Integer, default=4)
    sanctioned_seats = Column(Integer, default=0)
    enrolled_count = Column(Integer, default=0)
    certified_count = Column(Integer, default=0)
    retained_count = Column(Integer, default=0)
    annual_demand = Column(Integer, default=0)
    annual_trained = Column(Integer, default=0)
    gap = Column(Integer, default=0)
    status = Column(String(64), default="Balanced")
    is_valid = Column(Boolean, default=True)
    source = Column(String(128), default="Live District Telemetry (MSDE v2.4)")
    last_updated = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> Dict[str, Any]:
        """Converts model to ExplorerRecord representation."""
        return {
            "id": self.id,
            "ncoCode": self.trade_nco_code,
            "tradeName": self.trade_name,
            "nsqfLevel": self.nsqf_level,
            "sector": self.sector,
            "state": self.state,
            "district": self.district_name,
            "annualDemand": self.annual_demand,
            "annualTrained": self.annual_trained or self.certified_count,
            "gap": self.gap,
            "status": self.status,
            "source": self.source,
            "lastUpdated": self.last_updated or "Just now (Synced)"
        }


class DatabaseManager:
    """Manages database connection pool, initialization, and session lifecycle."""
    def __init__(self):
        self.engine = None
        self.SessionFactory = None
        self.active_engine_type = "uninitialized"
        self.db_url = ""
        self._init_engine()

    def _init_engine(self) -> None:
        raw_url = os.environ.get("DATABASE_URL") or settings.DATABASE_URL or ""
        raw_url = raw_url.strip()

        # 1. Attempt PostgreSQL if DATABASE_URL is supplied
        if raw_url:
            # Handle standard Heroku / Supabase postgres:// dialect upgrade
            if raw_url.startswith("postgres://"):
                raw_url = raw_url.replace("postgres://", "postgresql://", 1)

            try:
                logger.info(f"Connecting to Cloud PostgreSQL...")
                engine = create_engine(
                    raw_url,
                    pool_pre_ping=True,
                    pool_recycle=300,
                    pool_size=10,
                    max_overflow=20
                )
                # Verify active connection with ping
                with engine.connect() as conn:
                    conn.execute(text("SELECT 1"))
                
                self.engine = engine
                self.active_engine_type = "postgresql"
                self.db_url = raw_url
                logger.info("Successfully connected to PostgreSQL database cluster.")
            except Exception as e:
                logger.warning(
                    f"Failed to connect to PostgreSQL ({e}). Falling back to local SQLite engine."
                )
                self._fallback_sqlite()
        else:
            self._fallback_sqlite()

        # Build schema tables if not exist
        try:
            Base.metadata.create_all(bind=self.engine)
            self.SessionFactory = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self.engine))
            logger.info(f"Database schema initialized successfully on {self.active_engine_type}.")
        except Exception as e:
            logger.error(f"Error creating database schema tables: {e}")

    def _fallback_sqlite(self) -> None:
        settings.DATA_PATH.mkdir(parents=True, exist_ok=True)
        sqlite_file = settings.DATA_PATH / "kaushaldrishti.db"
        sqlite_url = f"sqlite:///{sqlite_file}"
        self.engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        self.active_engine_type = "sqlite"
        self.db_url = sqlite_url
        logger.info(f"Operating with local SQLite ledger storage at {sqlite_file}")

    def get_session(self):
        """Returns a thread-safe scoped database session."""
        if not self.SessionFactory:
            self._init_engine()
        return self.SessionFactory()

    def get_status(self) -> Dict[str, Any]:
        """Returns active database connection diagnostics for health and monitoring."""
        # Mask password in URL for display
        masked_url = self.db_url
        if "@" in masked_url and ":" in masked_url:
            parts = masked_url.split("@")
            prefix = parts[0].split(":")
            if len(prefix) >= 3:
                masked_url = f"{prefix[0]}:{prefix[1]}:****@{parts[1]}"

        batches_count = 0
        records_count = 0
        try:
            session = self.get_session()
            batches_count = session.query(TelemetryBatchModel).count()
            records_count = session.query(TelemetryRecordModel).count()
            session.close()
        except Exception:
            pass

        return {
            "engine": self.active_engine_type,
            "status": "connected" if self.engine else "disconnected",
            "url": masked_url,
            "total_batches_persisted": batches_count,
            "total_records_indexed": records_count,
            "cloud_persisted": (self.active_engine_type == "postgresql"),
            "timestamp": datetime.utcnow().isoformat()
        }

db_manager = DatabaseManager()
