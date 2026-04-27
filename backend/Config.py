# =============================================================================
# config.py
# Centralised configuration loaded from a .env file using pydantic-settings.
# All secrets (API keys, DB URIs) live here — never hard-coded elsewhere.
# =============================================================================

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables / .env file.
    pydantic-settings automatically validates types and raises on missing required vars.
    """

    # -------------------------------------------------------------------------
    # Application metadata
    # -------------------------------------------------------------------------
    APP_NAME: str = "R-Intelligence API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # -------------------------------------------------------------------------
    # MySQL connection URI
    # Format: mysql+pymysql://<user>:<password>@<host>:<port>/<dbname>
    # Example: mysql+pymysql://root:secret@localhost:3306/r_intelligence
    # -------------------------------------------------------------------------
    MYSQL_URI: str

    # -------------------------------------------------------------------------
    # Optional: EPA / external recycling infrastructure API key
    # Used by the feasibility engine to check live recycling facility data.
    # The system degrades gracefully if this is not set.
    # -------------------------------------------------------------------------
    EPA_API_KEY: str = ""

    # -------------------------------------------------------------------------
    # Scoring engine weights — must sum to 1.0
    # Exposed here so they can be tuned via environment without code changes.
    # -------------------------------------------------------------------------
    WEIGHT_ENV: float = 0.35
    WEIGHT_COST: float = 0.20
    WEIGHT_LIFECYCLE: float = 0.25
    WEIGHT_EFFORT: float = 0.20

    # -------------------------------------------------------------------------
    # Hierarchy override threshold.
    # If a higher-priority R scores within this fraction of the top score,
    # it overrides and becomes the primary recommendation.
    # Default: 0.15 (15%)
    # -------------------------------------------------------------------------
    HIERARCHY_OVERRIDE_THRESHOLD: float = 0.15

    # -------------------------------------------------------------------------
    # Behavioral intelligence thresholds
    # -------------------------------------------------------------------------
    BEHAVIORAL_LOOKBACK_DAYS: int = 30        # Window for pattern detection
    BEHAVIORAL_NUDGE_THRESHOLD: int = 10      # Disposals before a nudge fires

    # -------------------------------------------------------------------------
    # Tell pydantic-settings to read from a .env file in the project root.
    # -------------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Returns a cached singleton of Settings.
    Using lru_cache ensures we only parse the .env file once per process.
    Inject into FastAPI routes via: Depends(get_settings)
    """
    return Settings()