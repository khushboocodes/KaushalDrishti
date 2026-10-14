from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from backend.config import settings
from backend.api.router import api_router
from backend.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"*** {settings.PROJECT_NAME} v{settings.VERSION} Engine Initialized ***")
    yield
    logger.info(f"*** {settings.PROJECT_NAME} Shutdown Complete ***")

app = FastAPI(
    title=f"{settings.PROJECT_NAME} — {settings.PROJECT_TITLE}",
    description="Strategic Decision Support & Skill Demand-Supply Forecasting Platform for MSDE, NCVET, and State Skill Development Missions.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Enable permissive CORS for frontend-backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
app.include_router(api_router, prefix="/api") # convenience alias

# Mount frontend directory for single-server serving
frontend_dir = settings.FRONTEND_PATH
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
    logger.info(f"Mounted frontend dashboard at root / from {frontend_dir}")
else:
    logger.warning(f"Frontend directory {frontend_dir} does not exist yet.")
