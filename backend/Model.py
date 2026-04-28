# =============================================================================
# models.py
# All Pydantic v2 schemas for API request validation and response serialisation.
# These are the contracts between the API surface and the decision engines.
# =============================================================================

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# =============================================================================
# ENUMERATIONS — enforce valid input values at the schema layer
# =============================================================================

class MaterialType(str, Enum):
    PET_PLASTIC    = "pet_plastic"
    HDPE_PLASTIC   = "hdpe_plastic"
    MIXED_PLASTIC  = "mixed_plastic"
    GLASS          = "glass"
    ALUMINIUM      = "aluminium"
    STEEL          = "steel"
    ELECTRONIC     = "electronic"
    TEXTILE        = "textile"
    ORGANIC        = "organic"
    PAPER          = "paper"


class ConditionType(str, Enum):
    NEW          = "new"
    GOOD         = "good"
    USED         = "used"
    DAMAGED      = "damaged"       # Damaged but repairable
    BROKEN       = "broken"        # Non-functional
    CONTAMINATED = "contaminated"  # Hygiene / chemical contamination
    END_OF_LIFE  = "end_of_life"   # Fully exhausted


class RStrategy(str, Enum):
    """
    The five R-strategies in descending priority order per the EU Waste
    Framework Directive (2008/98/EC). The integer ordering is used by the
    hierarchy engine — lower value = higher priority.
    """
    REDUCE  = "reduce"    # Priority 1 — best
    REUSE   = "reuse"     # Priority 2
    REPAIR  = "repair"    # Priority 3
    RECYCLE = "recycle"   # Priority 4
    RECOVER = "recover"   # Priority 5 — last resort


# =============================================================================
# REQUEST SCHEMAS
# =============================================================================

class AnalyseItemRequest(BaseModel):
    """
    Inbound payload for the /analyse endpoint.
    The user submits item properties + their local context.
    """

    # --- Item details --------------------------------------------------------
    user_id: str = Field(
        ...,
        description="Unique identifier for the user (UUID string or email hash).",
        examples=["user_abc123"],
    )
    material: MaterialType = Field(
        ...,
        description="The primary material category of the item.",
    )
    condition: ConditionType = Field(
        ...,
        description="Current physical condition of the item.",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=500,
        description="Free-text description, e.g. '500ml PET water bottle'.",
    )

    # --- Context flags (drive feasibility gating) ----------------------------
    has_recycling_facility: bool = Field(
        default=False,
        description="True if a recycling drop-off or kerbside collection is accessible.",
    )
    has_repair_shop: bool = Field(
        default=False,
        description="True if a repair café or certified repair shop is nearby.",
    )
    is_industrial_context: bool = Field(
        default=False,
        description="True if the item originates from an industrial/commercial setting.",
    )
    location_code: Optional[str] = Field(
        default=None,
        max_length=20,
        description="ISO country code or postcode prefix for infrastructure lookup.",
        examples=["GB", "IN-MH", "US-CA"],
    )

    @field_validator("user_id")
    @classmethod
    def user_id_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("user_id must not be blank")
        return v.strip()


class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    fullName: str
    username: str
    email: str
    password: str


# =============================================================================
# INTERNAL / ENGINE SCHEMAS (not exposed directly to the API caller)
# =============================================================================

class FeasibilityResult(BaseModel):
    """
    Output of the feasibility filter engine.
    Each R-strategy is either feasible (True) or gated out (False),
    along with the reason for any gate.
    """
    reduce:  bool = False
    reuse:   bool = False
    repair:  bool = False
    recycle: bool = False
    recover: bool = False

    reduce_reason:  str = ""
    reuse_reason:   str = ""
    repair_reason:  str = ""
    recycle_reason: str = ""
    recover_reason: str = ""


class RScore(BaseModel):
    """
    The four component scores + weighted total for one R-strategy.
    All raw component scores are in the range [0.0, 10.0].
    """
    strategy:  RStrategy
    env:       float = Field(ge=0.0, le=10.0)
    cost:      float = Field(ge=0.0, le=10.0)
    lifecycle: float = Field(ge=0.0, le=10.0)
    effort:    float = Field(ge=0.0, le=10.0)  # Raw effort (higher = more effort)
    total:     float = Field(ge=0.0, le=10.0)  # Weighted composite


class HierarchyResult(BaseModel):
    """
    Output of the hierarchy priority engine.
    Carries the final winning strategy and whether an override was applied.
    """
    winner:           RStrategy
    override_applied: bool = False
    override_from:    Optional[RStrategy] = None  # The strategy that was numerically top
    override_reason:  str = ""


# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================

class AlternativeOption(BaseModel):
    """A secondary R-strategy presented alongside the primary recommendation."""
    strategy:    RStrategy
    total_score: float
    description: str          # Human-readable action description


class DecisionResponse(BaseModel):
    """
    Full API response for /analyse.
    Contains everything the frontend needs: decision, scores, explanation,
    alternatives, impact estimates, and optional behavioral nudge.
    """

    # --- Identity ---
    decision_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="UUID written to the decisions table.",
    )
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # --- Core decision ---
    primary_strategy:    RStrategy
    confidence_pct:      float = Field(ge=0.0, le=100.0)
    override_applied:    bool
    override_reason:     str = ""

    # --- Score breakdown ---
    scores:       list[RScore]             # All scored (feasible) strategies
    alternatives: list[AlternativeOption]  # Top 2 non-primary feasible options

    # --- Impact estimates ---
    co2_saved_kg:      float  # Estimated CO₂ savings vs. disposal baseline
    energy_saving_pct: float  # Energy saving vs. manufacturing new
    lifecycle_multiplier: float  # How many times longer the item will last

    # --- Explanation ---
    explanation:     str  # Plain-English reasoning paragraph
    action_guidance: str  # Specific next step for the user

    # --- Behavioral intelligence ---
    behavioral_nudge: Optional[str] = None  # Set if a pattern was detected


class BehavioralNudgeResponse(BaseModel):
    """Response from the /behavioral/{user_id} endpoint."""
    user_id:  str
    nudge:    Optional[str]
    pattern_detected: bool
    material_counts:  dict[str, int]


class UserResponse(BaseModel):
    user_id: str
    fullName: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None

class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class PredictionResponse(BaseModel):
    """Response from the /predict/{user_id} endpoint."""
    user_id:           str
    forecast_month:    str   # ISO format YYYY-MM
    predicted_items:   int
    top_material:      Optional[str]
    intervention_tip:  str


class HealthResponse(BaseModel):
    """Lightweight health-check response."""
    status:  str
    version: str
    db_ok:   bool