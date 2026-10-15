"""
64-Bit SimHash Vacancy Deduplication Pipeline
Part of KaushalDrishti (कौशल दृष्टि) - LMIS Engine
Ministry of Skill Development and Entrepreneurship (MSDE)

Computes 64-bit SimHash fingerprints over employer, location, and requirement
vectors to cluster and purge syndicated and re-posted ghost vacancies.
"""

import hashlib
import re
from typing import List, Dict, Any, Tuple, Set
from pydantic import BaseModel
from backend.logger import logger

class DeduplicationResult(BaseModel):
    total_raw_postings: int
    unique_postings_retained: int
    duplicates_purged: int
    deduplication_rate_pct: float
    clustered_groups_count: int

class SimHashDeduplicator:
    """
    64-bit locality-sensitive hashing (LSH) SimHash engine for detecting
    near-duplicate job advertisements across syndicated job boards.
    """

    BITS = 64
    HAMMING_DISTANCE_THRESHOLD = 3
    STOPWORDS = {"ltd", "limited", "pvt", "private", "inc", "corp", "company", "co", "the", "and", "in", "at", "for"}

    def __init__(self, hamming_threshold: int = HAMMING_DISTANCE_THRESHOLD):
        self.hamming_threshold = hamming_threshold
        self.logger = logger

    def _tokenize(self, text: str) -> List[str]:
        """Normalizes and extracts filtered word tokens."""
        clean = re.sub(r"[^\w\s]", " ", text.lower()).strip()
        tokens = [w for w in clean.split() if w not in self.STOPWORDS]
        if not tokens:
            return ["empty"]
        return tokens

    def _hash64(self, token: str) -> int:
        """Computes 64-bit unsigned integer hash using MD5 digest."""
        digest = hashlib.md5(token.encode("utf-8")).digest()
        val = 0
        for b in digest[:8]:
            val = (val << 8) | b
        return val

    def compute_simhash(self, employer: str, district_lgd: int, nco_code: str, description_or_skills: str) -> int:
        """
        Computes 64-bit SimHash vector projection.
        Feature weights:
        - Employer word tokens: weight 4
        - District LGD: weight 6
        - NCO code: weight 6
        - Description tokens: weight 1
        """
        v = [0] * self.BITS
        features: List[Tuple[str, int]] = []

        # Location and occupational identity (high weight anchors)
        features.append((f"LGD:{district_lgd}", 6))
        features.append((f"NCO:{nco_code}", 6))

        # Employer tokens with company suffix stripping
        for emp_tok in self._tokenize(employer):
            features.append((f"EMP:{emp_tok}", 4))

        # Description & skill tokens
        for tok in self._tokenize(description_or_skills):
            features.append((tok, 1))

        for feat, weight in features:
            h = self._hash64(feat)
            for i in range(self.BITS):
                bitmask = 1 << i
                if h & bitmask:
                    v[i] += weight
                else:
                    v[i] -= weight

        fingerprint = 0
        for i in range(self.BITS):
            if v[i] > 0:
                fingerprint |= (1 << i)

        return fingerprint

    def hamming_distance(self, hash1: int, hash2: int) -> int:
        """Calculates bitwise Hamming distance between two 64-bit hashes."""
        xor_val = hash1 ^ hash2
        return bin(xor_val).count("1")

    def deduplicate(self, postings: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], DeduplicationResult]:
        """
        Clusters and purges duplicate vacancies based on SimHash Hamming distance <= threshold.
        """
        unique_postings: List[Dict[str, Any]] = []
        hash_entries: List[Tuple[int, Dict[str, Any]]] = []
        duplicates_count = 0

        for p in postings:
            emp = str(p.get("employer", ""))
            lgd = int(p.get("district_lgd_code", 0))
            nco = str(p.get("nco_code", ""))
            text = f"{p.get('title', '')} {' '.join(p.get('skills_raw', []))}"

            h = self.compute_simhash(emp, lgd, nco, text)
            p["simhash_64"] = hex(h)

            # Check if this matches any existing unique posting within threshold
            is_duplicate = False
            for prev_h, prev_p in hash_entries:
                dist = self.hamming_distance(h, prev_h)
                if dist <= self.hamming_threshold:
                    # Near duplicate detected
                    is_duplicate = True
                    duplicates_count += 1
                    # Merge vacancy volume
                    prev_p["vacancies"] = max(prev_p.get("vacancies", 1), p.get("vacancies", 1))
                    if "duplicate_sources" not in prev_p:
                        prev_p["duplicate_sources"] = []
                    prev_p["duplicate_sources"].append(p.get("job_id", "anon"))
                    break

            if not is_duplicate:
                hash_entries.append((h, p))
                unique_postings.append(p)

        clusters = len(unique_postings)
        rate = round((duplicates_count / len(postings) * 100), 2) if postings else 0.0

        res = DeduplicationResult(
            total_raw_postings=len(postings),
            unique_postings_retained=len(unique_postings),
            duplicates_purged=duplicates_count,
            deduplication_rate_pct=rate,
            clustered_groups_count=clusters
        )
        self.logger.info(f"SimHash Deduplication: Retained {len(unique_postings)} unique from {len(postings)} raw postings (Deduplicated {duplicates_count}).")
        return unique_postings, res
