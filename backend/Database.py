# =============================================================================
# database.py
# SQLAlchemy async-ready engine, session factory, and 4NF table definitions.
#
# 4NF Compliance Notes:
# ─────────────────────
# A relation is in 4NF if, for every non-trivial multivalued dependency A →→ B,
# A is a superkey. We enforce this by:
#
#   1. Splitting one-to-many facts into separate tables.
#      A single `decisions` row stores exactly ONE fact set (winner, scores,
#      explanation). Secondary alternatives are in `decision_alternatives` —
#      a separate table keyed by (decision_id, strategy) — so no row in
#      `decisions` encodes multiple independent multi-valued facts.
#
#   2. The `user_items` table records item submissions independently of
#      decisions, avoiding a scenario where one row in `decisions` would
#      need to encode both "what was submitted" AND "what was decided"
#      as independent multi-valued attributes.
#
#   3. Material properties are normalised into `material_properties` so the
#      scoring engine reads from a single authoritative source, not a
#      duplicated constant dict.
# =============================================================================

import logging
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    create_engine,
    event,
    text,
)
from sqlalchemy.orm import DeclarativeBase, Session, relationship, sessionmaker
from sqlalchemy.pool import QueuePool

from Config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


# =============================================================================
# ENGINE SETUP
# =============================================================================

engine = create_engine(
    settings.MYSQL_URI,
    poolclass=QueuePool,
    pool_size=10,           # Max persistent connections
    max_overflow=20,        # Connections beyond pool_size (temporary)
    pool_pre_ping=True,     # Validate connections before use (handles stale conns)
    pool_recycle=3600,      # Recycle connections after 1 hour
    echo=settings.DEBUG,    # SQL logging in debug mode only
)

# Ensure MySQL uses UTF-8 on every new connection
@event.listens_for(engine, "connect")
def set_charset(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("SET NAMES utf8mb4")
    cursor.execute("SET character_set_connection=utf8mb4")
    cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,  # Keep objects usable after commit without re-query
)


# =============================================================================
# DECLARATIVE BASE
# =============================================================================

class Base(DeclarativeBase):
    pass


# =============================================================================
# TABLE DEFINITIONS (4NF)
# =============================================================================

class MaterialProperty(Base):
    """
    Normalised material catalogue.
    One row per material type — single source of truth for the scoring engine.
    Corresponds to the `material_properties` table.
    """
    __tablename__ = "material_properties"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    material_key        = Column(String(50), unique=True, nullable=False, index=True)
    display_name        = Column(String(100), nullable=False)
    recyclability_pct   = Column(Float, nullable=False)   # 0–100
    repair_feasibility  = Column(Float, nullable=False)   # 0–100 (0 = not repairable)
    co2_per_kg          = Column(Float, nullable=False)   # kg CO₂ per kg material
    lifecycle_base_yrs  = Column(Float, nullable=False)   # Typical single-use lifespan
    lifecycle_reuse_yrs = Column(Float, nullable=False)   # Lifespan under reuse strategy


class User(Base):
    """
    User tracking for sustainability scoring.
    Replaces the Supabase users table.
    """
    __tablename__ = "users"

    user_id = Column(String(255), primary_key=True)
    sustainability_score = Column(Float, nullable=False, default=0.0)

    items = relationship("UserItem", back_populates="user")


class UserItem(Base):
    """
    Records every item submission by a user.
    Independent of what decision was made — 4NF requires separating the
    'what was submitted' fact from the 'what was decided' fact.
    """
    __tablename__ = "user_items"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    user_id      = Column(String(255), ForeignKey("users.user_id"), nullable=False, index=True)
    material     = Column(String(50), nullable=False, index=True)
    condition    = Column(String(50), nullable=False)
    description  = Column(Text, nullable=True)
    submitted_at = Column(DateTime, nullable=False)

    # One item submission → one decision (1:1 enforced by FK in decisions table)
    decision = relationship("Decision", back_populates="item", uselist=False)
    user = relationship("User", back_populates="items")


class Decision(Base):
    """
    Core decision record — stores exactly one winner per submission.
    The multi-valued 'alternatives' fact lives in a separate table (4NF).
    """
    __tablename__ = "decisions"

    decision_id          = Column(String(36), primary_key=True)   # UUID
    user_item_id         = Column(Integer, ForeignKey("user_items.id"), nullable=False, unique=True)
    primary_strategy     = Column(String(20), nullable=False)
    confidence_pct       = Column(Float, nullable=False)
    override_applied     = Column(Boolean, nullable=False, default=False)
    override_reason      = Column(Text, nullable=True)
    # Composite score components for the winning strategy
    score_env            = Column(Float, nullable=False)
    score_cost           = Column(Float, nullable=False)
    score_lifecycle      = Column(Float, nullable=False)
    score_effort         = Column(Float, nullable=False)
    score_total          = Column(Float, nullable=False)
    # Impact estimates
    co2_saved_kg         = Column(Float, nullable=False)
    energy_saving_pct    = Column(Float, nullable=False)
    lifecycle_multiplier = Column(Float, nullable=False)
    # Human-readable output
    explanation          = Column(Text, nullable=False)
    action_guidance      = Column(Text, nullable=False)
    created_at           = Column(DateTime, nullable=False)

    # Relationships
    item         = relationship("UserItem", back_populates="decision")
    alternatives = relationship("DecisionAlternative", back_populates="decision",
                                cascade="all, delete-orphan")


class DecisionAlternative(Base):
    """
    Stores secondary R-strategy options for a decision.
    Separated from `decisions` to satisfy 4NF — a decision can have
    multiple independent alternatives, which would be a multi-valued
    dependency if embedded in the decisions row.

    Keyed by (decision_id, strategy) — no two rows can represent the same
    strategy for the same decision.
    """
    __tablename__ = "decision_alternatives"
    __table_args__ = (
        UniqueConstraint("decision_id", "strategy", name="uq_decision_strategy"),
    )

    id            = Column(Integer, primary_key=True, autoincrement=True)
    decision_id   = Column(String(36), ForeignKey("decisions.decision_id",
                           ondelete="CASCADE"), nullable=False, index=True)
    strategy      = Column(String(20), nullable=False)
    score_total   = Column(Float, nullable=False)
    description   = Column(Text, nullable=False)

    decision = relationship("Decision", back_populates="alternatives")


# =============================================================================
# DATABASE INITIALISATION
# =============================================================================

# Static seed data for the material properties catalogue.
# In production this would be managed via a migration tool (Alembic).
MATERIAL_SEED_DATA = [
    dict(material_key="pet_plastic",   display_name="PET Plastic",
         recyclability_pct=78,  repair_feasibility=0,   co2_per_kg=2.1,
         lifecycle_base_yrs=0.5, lifecycle_reuse_yrs=5.0),
    dict(material_key="hdpe_plastic",  display_name="HDPE Plastic",
         recyclability_pct=82,  repair_feasibility=0,   co2_per_kg=1.8,
         lifecycle_base_yrs=0.5, lifecycle_reuse_yrs=4.0),
    dict(material_key="mixed_plastic", display_name="Mixed/Film Plastic",
         recyclability_pct=15,  repair_feasibility=0,   co2_per_kg=2.5,
         lifecycle_base_yrs=0.2, lifecycle_reuse_yrs=1.0),
    dict(material_key="glass",         display_name="Glass",
         recyclability_pct=90,  repair_feasibility=10,  co2_per_kg=0.6,
         lifecycle_base_yrs=1.0, lifecycle_reuse_yrs=20.0),
    dict(material_key="aluminium",     display_name="Aluminium",
         recyclability_pct=95,  repair_feasibility=40,  co2_per_kg=8.2,
         lifecycle_base_yrs=1.0, lifecycle_reuse_yrs=15.0),
    dict(material_key="steel",         display_name="Steel/Tin",
         recyclability_pct=88,  repair_feasibility=50,  co2_per_kg=2.8,
         lifecycle_base_yrs=2.0, lifecycle_reuse_yrs=15.0),
    dict(material_key="electronic",    display_name="Electronic Composite",
         recyclability_pct=35,  repair_feasibility=75,  co2_per_kg=70.0,
         lifecycle_base_yrs=2.0, lifecycle_reuse_yrs=6.0),
    dict(material_key="textile",       display_name="Textile/Fabric",
         recyclability_pct=20,  repair_feasibility=60,  co2_per_kg=15.0,
         lifecycle_base_yrs=2.0, lifecycle_reuse_yrs=5.0),
    dict(material_key="organic",       display_name="Organic/Food",
         recyclability_pct=0,   repair_feasibility=0,   co2_per_kg=1.9,
         lifecycle_base_yrs=0.0, lifecycle_reuse_yrs=0.0),
    dict(material_key="paper",         display_name="Paper/Cardboard",
         recyclability_pct=85,  repair_feasibility=0,   co2_per_kg=0.9,
         lifecycle_base_yrs=0.1, lifecycle_reuse_yrs=0.5),
]


def init_db() -> None:
    """
    Creates all tables (if they don't exist) and seeds the material
    properties catalogue. Safe to call on every startup — uses
    'CREATE TABLE IF NOT EXISTS' semantics via checkfirst=True.
    """
    logger.info("Initialising database schema...")
    Base.metadata.create_all(bind=engine, checkfirst=True)

    # Seed material properties if the table is empty
    with SessionLocal() as session:
        existing = session.execute(
            text("SELECT COUNT(*) FROM material_properties")
        ).scalar()
        if existing == 0:
            logger.info("Seeding material_properties table...")
            for row in MATERIAL_SEED_DATA:
                session.add(MaterialProperty(**row))
            session.commit()
            logger.info(f"Inserted {len(MATERIAL_SEED_DATA)} material records.")
        else:
            logger.info(f"material_properties already has {existing} rows — skipping seed.")


def get_material(session: Session, material_key: str) -> MaterialProperty | None:
    """Convenience query: fetch a single material record by its key."""
    return session.query(MaterialProperty).filter_by(material_key=material_key).first()


# =============================================================================
# DEPENDENCY INJECTION HELPER
# =============================================================================

@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    Context manager that yields a database session and ensures it is closed
    (and rolled back on error) regardless of what happens inside the block.

    Usage:
        with get_db_session() as session:
            session.add(...)
            session.commit()
    """
    session = SessionLocal()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI Depends() generator for injecting a session into route handlers.

    Usage in a route:
        @app.post("/analyse")
        def analyse(db: Session = Depends(get_db)):
            ...
    """
    with get_db_session() as session:
        yield session


def check_db_connection() -> bool:
    """
    Returns True if the database is reachable, False otherwise.
    Used by the /health endpoint.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.error(f"DB health check failed: {exc}")
        return False