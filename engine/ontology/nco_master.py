import json
from pathlib import Path
from typing import Optional, Dict, List, Any
from rapidfuzz import process, fuzz
from backend.config import settings

NCO_CATALOG_PATH = settings.MASTER_DATA_PATH / "nco_catalog.json"
NSQF_CROSSWALK_PATH = settings.MASTER_DATA_PATH / "nsqf_crosswalk.json"

class NCOMaster:
    """Canonical NCO-2015 8-Digit occupational catalog and crosswalk resolver."""
    
    def __init__(self, nco_path: Optional[Path] = None, crosswalk_path: Optional[Path] = None):
        self.nco_path = nco_path or NCO_CATALOG_PATH
        self.crosswalk_path = crosswalk_path or NSQF_CROSSWALK_PATH
        
        self._occupations: Dict[str, Dict[str, Any]] = {}
        self._crosswalks: Dict[str, Dict[str, Any]] = {}
        self._sector_groups: Dict[str, List[Dict[str, Any]]] = {}
        self._titles: Dict[str, str] = {} # lower title -> nco_code
        self._load_data()

    def _load_data(self) -> None:
        if self.nco_path.exists():
            with open(self.nco_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for occ in data.get("occupations", []):
                    code = occ["nco_code"]
                    self._occupations[code] = occ
                    self._titles[occ["title"].lower()] = code
                    
                    sec = occ["sector_name"]
                    if sec not in self._sector_groups:
                        self._sector_groups[sec] = []
                    self._sector_groups[sec].append(occ)

        if self.crosswalk_path.exists():
            with open(self.crosswalk_path, "r", encoding="utf-8") as f:
                cdata = json.load(f)
                for cw in cdata.get("crosswalks", []):
                    code = cw["nco_code"]
                    self._crosswalks[code] = cw

    def get_by_code(self, nco_code: str) -> Optional[Dict[str, Any]]:
        occ = self._occupations.get(nco_code)
        if occ:
            res = dict(occ)
            if nco_code in self._crosswalks:
                res["crosswalk"] = self._crosswalks[nco_code]
            return res
        return None

    def list_all(self) -> List[Dict[str, Any]]:
        results = []
        for code, occ in self._occupations.items():
            item = dict(occ)
            if code in self._crosswalks:
                item["crosswalk"] = self._crosswalks[code]
            results.append(item)
        return results

    def list_by_sector(self, sector_name: str) -> List[Dict[str, Any]]:
        return self._sector_groups.get(sector_name, [])

    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        if not query:
            return self.list_all()[:limit]
        
        q_clean = query.strip().lower()
        candidates = list(self._titles.keys())
        matches = process.extract(q_clean, candidates, scorer=fuzz.token_sort_ratio, limit=limit)
        
        results = []
        for match in matches:
            if match[1] >= 50:
                code = self._titles[match[0]]
                item = self.get_by_code(code)
                if item:
                    item["match_score"] = round(match[1], 1)
                    results.append(item)
        return results

nco_master = NCOMaster()
