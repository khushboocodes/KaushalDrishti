import os
from pathlib import Path
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseModel):
    PROJECT_NAME: str = "KaushalDrishti"
    PROJECT_TITLE: str = "AI-Enabled Labour Market Intelligence & Skill Forecasting Engine"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Paths
    BASE_PATH: Path = BASE_DIR
    DATA_PATH: Path = BASE_DIR / "data"
    MASTER_DATA_PATH: Path = BASE_DIR / "data" / "master"
    PILOT_DATA_PATH: Path = BASE_DIR / "data" / "pilot"
    FRONTEND_PATH: Path = BASE_DIR / "frontend"
    
    # Server & CORS
    HOST: str = "0.0.0.0"
    PORT: int = int(os.environ.get("PORT", 8000))
    CORS_ORIGINS: list[str] = ["*"]
    
    # Default Forecast Horizons
    HORIZONS: list[str] = ["3M", "6M", "12M"]
    DEFAULT_HORIZON: str = "12M"
    
    # Pilot States & Sectors
    PILOT_STATES: list[str] = ["Uttar Pradesh", "Maharashtra", "Odisha"]
    PILOT_SECTORS: list[str] = [
        "Green Energy & Solar PV",
        "Automotive & EV Diagnostics",
        "Healthcare & Allied Care",
        "IT-ITeS & Digital Services"
    ]
    
    # CDI Weights (Configurable)
    WEIGHT_VACANCY_VOLUME: float = 0.35
    WEIGHT_GROWTH_MOMENTUM: float = 0.25
    WEIGHT_EMPLOYER_BREADTH: float = 0.15
    WEIGHT_SKILL_DISPERSION: float = 0.15
    WEIGHT_MACRO_PROXY: float = 0.10

settings = Settings()
