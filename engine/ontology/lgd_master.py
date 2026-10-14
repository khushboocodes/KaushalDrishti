import json
from pathlib import Path
from typing import Optional, Dict, List, Any
from rapidfuzz import process, fuzz
from backend.config import settings

MASTER_LGD_PATH = settings.MASTER_DATA_PATH / "lgd_districts.json"

class LGDMaster:
    """Canonical Local Government Directory (LGD) reference resolver."""
    
    def __init__(self, data_path: Optional[Path] = None):
        self.data_path = data_path or MASTER_LGD_PATH
        self._districts: Dict[int, Dict[str, Any]] = {}
        self._name_to_id: Dict[str, int] = {}
        self._alias_to_id: Dict[str, int] = {}
        self._state_groups: Dict[str, List[Dict[str, Any]]] = {}
        self._load_data()

    def _load_data(self) -> None:
        if not self.data_path.exists():
            return
        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        for d in data.get("districts", []):
            code = d["district_lgd_code"]
            self._districts[code] = d
            clean_name = d["district_name"].strip().lower()
            self._name_to_id[clean_name] = code
            self._alias_to_id[clean_name] = code
            
            # Map aliases
            for alias in d.get("aliases", []):
                self._alias_to_id[alias.strip().lower()] = code
                
            state = d["state_name"]
            if state not in self._state_groups:
                self._state_groups[state] = []
            self._state_groups[state].append(d)

    def get_by_code(self, district_lgd_code: int) -> Optional[Dict[str, Any]]:
        return self._districts.get(district_lgd_code)

    def get_districts_by_state(self, state_name: str) -> List[Dict[str, Any]]:
        return self._state_groups.get(state_name, [])

    def list_all(self) -> List[Dict[str, Any]]:
        return list(self._districts.values())

    def resolve(self, query: str, state_hint: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Tri-tier resolution:
        1. Exact canonical name or alias match
        2. Constrained fuzzy match within state (if state_hint provided)
        3. Global fuzzy match with score threshold >= 82
        """
        if not query:
            return None
        q_clean = query.strip().lower()

        # 1. Exact alias / canonical match
        if q_clean in self._alias_to_id:
            return self._districts[self._alias_to_id[q_clean]]

        # 2. Scoped to state
        candidates = []
        if state_hint and state_hint in self._state_groups:
            candidates = [d["district_name"] for d in self._state_groups[state_hint]]
        else:
            candidates = list(self._name_to_id.keys())

        if not candidates:
            return None

        match = process.extractOne(q_clean, candidates, scorer=fuzz.token_sort_ratio)
        if match and match[1] >= 80:
            matched_name = match[0].lower()
            code = self._name_to_id.get(matched_name) or self._alias_to_id.get(matched_name)
            if code:
                return self._districts[code]

        return None

lgd_master = LGDMaster()
