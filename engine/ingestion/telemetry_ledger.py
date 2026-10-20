"""
Telemetry Ledger Manager for MSDE District Telemetry Ingestion
Maintains central, persistent storage of verified district batches in PostgreSQL / SQLite.
Synchronizes data across all users, browser sessions, and deployment instances.
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.config import settings
from backend.database import (
    db_manager,
    TelemetryBatchModel,
    TelemetryRecordModel
)

logger = logging.getLogger("kaushaldrishti.telemetry_ledger")

class TelemetryLedgerManager:
    def __init__(self, ledger_backup_path: Optional[Path] = None):
        self.backup_path = ledger_backup_path or (settings.DATA_PATH / "telemetry_ledger.json")

    def _save_local_backup(self, batches: List[Dict[str, Any]]) -> None:
        """Saves a secondary JSON snapshot on disk for offline diagnostics."""
        try:
            self.backup_path.parent.mkdir(parents=True, exist_ok=True)
            data = {
                "version": "MSDE-v2.4",
                "database_engine": db_manager.active_engine_type,
                "updated_at": datetime.now().isoformat(),
                "batches": batches
            }
            temp_path = self.backup_path.with_suffix(".tmp")
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            temp_path.replace(self.backup_path)
        except Exception as e:
            logger.debug(f"Non-critical: Local JSON backup write failed: {e}")

    def commit_batch(self, batch_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Commits a new verified telemetry batch into the SQL database.
        Upserts the batch record and indexes its valid microdata rows.
        """
        batch_id = batch_data.get("batchId") or batch_data.get("batch_id") or f"BATCH-{int(datetime.now().timestamp())}"
        batch_data["batchId"] = batch_id
        
        committed_at = batch_data.get("committedAt") or datetime.now().strftime("%I:%M %p, %d %b %Y")
        batch_data["committedAt"] = committed_at

        session = db_manager.get_session()
        try:
            # 1. Clean up existing records for this batch if re-committing
            session.query(TelemetryRecordModel).filter(TelemetryRecordModel.batch_id == batch_id).delete()
            
            existing_batch = session.query(TelemetryBatchModel).filter(TelemetryBatchModel.batch_id == batch_id).first()
            if not existing_batch:
                existing_batch = TelemetryBatchModel(batch_id=batch_id)
                session.add(existing_batch)

            existing_batch.file_name = batch_data.get("fileName", "district_telemetry.csv")
            existing_batch.file_size_kb = float(batch_data.get("fileSizeKb", 0.0))
            existing_batch.uploaded_at = batch_data.get("uploadedAt", committed_at)
            existing_batch.committed_at = committed_at
            existing_batch.total_rows = int(batch_data.get("totalRows", 0))
            existing_batch.valid_rows_count = int(batch_data.get("validRowsCount", 0))
            existing_batch.flagged_rows_count = int(batch_data.get("flaggedRowsCount", 0))
            existing_batch.total_sanctioned = int(batch_data.get("totalSanctioned", 0))
            existing_batch.total_enrolled = int(batch_data.get("totalEnrolled", 0))
            existing_batch.total_certified = int(batch_data.get("totalCertified", 0))
            existing_batch.total_retained = int(batch_data.get("totalRetained", 0))
            existing_batch.avg_retention_rate = float(batch_data.get("avgRetentionRate", 0.0))
            existing_batch.sha256_hash = batch_data.get("sha256Hash", "")
            existing_batch.status = batch_data.get("status", "Verified")
            existing_batch.unique_districts = json.dumps(batch_data.get("uniqueDistricts", []))
            existing_batch.raw_payload = json.dumps(batch_data, ensure_ascii=False)

            # 2. Index valid microdata rows for high-performance dashboard queries
            rows = batch_data.get("rows", [])
            valid_inserted = 0
            for idx, r in enumerate(rows):
                is_valid = r.get("isValid", True) if "isValid" in r else r.get("is_valid", True)
                if not is_valid:
                    continue

                sanctioned = int(r.get("sanctionedSeats") or r.get("sanctioned_seats") or 0)
                enrolled = int(r.get("enrolledCount") or r.get("enrolled_count") or 0)
                certified = int(r.get("certifiedCount") or r.get("certified_count") or 0)
                retained = int(r.get("retainedCount") or r.get("retained_count") or 0)
                annual_demand = round(sanctioned * 1.35)
                gap = annual_demand - certified
                status = "Undersupply" if gap > 150 else ("Oversupply" if gap < -150 else "Balanced")

                record_model = TelemetryRecordModel(
                    id=f"telemetry-{batch_id}-{idx}",
                    batch_id=batch_id,
                    district_lgd_code=int(r.get("districtLgdCode") or r.get("district_lgd_code") or 0),
                    district_name=str(r.get("districtName") or r.get("district_name") or "Unknown District"),
                    state=str(r.get("state") or "National Jurisdiction"),
                    iti_mis_code=str(r.get("itiMisCode") or r.get("iti_mis_code") or ""),
                    trade_nco_code=str(r.get("tradeNcoCode") or r.get("trade_nco_code") or "7411.0101"),
                    trade_name=str(r.get("tradeName") or r.get("trade_name") or "Technical Trade"),
                    sector=str(r.get("sector") or "General Technical"),
                    nsqf_level=int(r.get("nsqfLevel") or r.get("nsqf_level") or 4),
                    sanctioned_seats=sanctioned,
                    enrolled_count=enrolled,
                    certified_count=certified,
                    retained_count=retained,
                    annual_demand=annual_demand,
                    annual_trained=certified,
                    gap=gap,
                    status=status,
                    is_valid=True,
                    source="Live District Telemetry (MSDE v2.4)",
                    last_updated=committed_at
                )
                session.add(record_model)
                valid_inserted += 1

            session.commit()
            total_batches = session.query(TelemetryBatchModel).count()

            # Refresh local backup
            all_batches = [b.to_dict() for b in session.query(TelemetryBatchModel).order_by(TelemetryBatchModel.created_at.desc()).all()]
            self._save_local_backup(all_batches)

            return {
                "status": "success",
                "message": f"Batch {batch_id} successfully persisted in {db_manager.active_engine_type.upper()} database.",
                "batchId": batch_id,
                "database": db_manager.active_engine_type,
                "totalBatches": total_batches,
                "validRecordsInjected": valid_inserted,
                "timestamp": committed_at
            }
        except Exception as e:
            session.rollback()
            logger.error(f"Failed to commit batch {batch_id} to database: {e}")
            raise
        finally:
            session.close()

    def get_batches(self) -> List[Dict[str, Any]]:
        """Returns all batches persisted in the central database."""
        session = db_manager.get_session()
        try:
            batch_models = session.query(TelemetryBatchModel).order_by(TelemetryBatchModel.created_at.desc()).all()
            return [b.to_dict() for b in batch_models]
        except Exception as e:
            logger.error(f"Error fetching batches from database: {e}")
            return []
        finally:
            session.close()

    def get_records(self) -> List[Dict[str, Any]]:
        """
        Extracts all valid microdata records formatted as ExplorerRecord items
        for instant ingestion into all dashboard tables.
        """
        session = db_manager.get_session()
        try:
            records = session.query(TelemetryRecordModel).order_by(TelemetryRecordModel.created_at.desc()).all()
            return [r.to_dict() for r in records]
        except Exception as e:
            logger.error(f"Error fetching records from database: {e}")
            return []
        finally:
            session.close()

    def clear_batches(self) -> bool:
        """Clears all telemetry batches and records (admin/test reset)."""
        session = db_manager.get_session()
        try:
            session.query(TelemetryRecordModel).delete()
            session.query(TelemetryBatchModel).delete()
            session.commit()
            self._save_local_backup([])
            return True
        except Exception as e:
            session.rollback()
            logger.error(f"Error clearing telemetry ledger database: {e}")
            return False
        finally:
            session.close()

telemetry_ledger = TelemetryLedgerManager()
