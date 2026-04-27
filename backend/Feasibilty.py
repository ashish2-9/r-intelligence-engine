# =============================================================================
# engines/feasibility.py
#
# Feasibility Filter Engine — Layer 2 of the R-Intelligence decision pipeline.
#
# Responsibility:
#   Evaluate each of the five R-strategies against hard physical and
#   contextual constraints. A strategy that is gated out here (False) is
#   NEVER scored or recommended. This prevents the system from suggesting
#   actions that are impossible in the user's real-world context.
#
# Gate logic is deterministic and rule-based (no ML). Each gate has a clear,
# auditable reason string so the Decision Engine can surface it to the user.
# =============================================================================

import logging
from dataclasses import dataclass, field

from Model import ConditionType, MaterialType

logger = logging.getLogger(__name__)


# =============================================================================
# CONDITION CAPABILITY MATRIX
# Maps each condition to its capabilities and restrictions.
# ─────────────────────────────────────────────────────
# reuse_viable:      Item can be used again without intervention
# repair_needed:     Item is damaged/broken and requires repair
# contaminated:      Item has hygiene/chemical contamination
# =============================================================================
CONDITION_MATRIX: dict[ConditionType, dict] = {
    ConditionType.NEW:          {"reuse_viable": True,  "repair_needed": False, "contaminated": False},
    ConditionType.GOOD:         {"reuse_viable": True,  "repair_needed": False, "contaminated": False},
    ConditionType.USED:         {"reuse_viable": True,  "repair_needed": False, "contaminated": False},
    ConditionType.DAMAGED:      {"reuse_viable": False, "repair_needed": True,  "contaminated": False},
    ConditionType.BROKEN:       {"reuse_viable": False, "repair_needed": True,  "contaminated": False},
    ConditionType.CONTAMINATED: {"reuse_viable": False, "repair_needed": False, "contaminated": True},
    ConditionType.END_OF_LIFE:  {"reuse_viable": False, "repair_needed": False, "contaminated": False},
}

# Minimum repair feasibility score (%) for repair to be considered viable.
# Below this threshold the material/item type is considered un-repairable.
MIN_REPAIR_FEASIBILITY = 30.0

# Minimum recyclability percentage for the recycle gate to pass.
# Below this threshold the recycling yield is too low to justify.
MIN_RECYCLABILITY_PCT = 20.0


@dataclass
class FeasibilityGate:
    """
    Holds the binary pass/fail result and reason string for one R-strategy.
    """
    feasible: bool = False
    reason:   str  = ""


@dataclass
class FeasibilityResult:
    """
    Aggregated feasibility result for all five R-strategies.
    Each strategy carries both a boolean flag and an explanation.
    """
    reduce:  FeasibilityGate = field(default_factory=FeasibilityGate)
    reuse:   FeasibilityGate = field(default_factory=FeasibilityGate)
    repair:  FeasibilityGate = field(default_factory=FeasibilityGate)
    recycle: FeasibilityGate = field(default_factory=FeasibilityGate)
    recover: FeasibilityGate = field(default_factory=FeasibilityGate)

    def feasible_strategies(self) -> list[str]:
        """Return a list of strategy names that passed the feasibility gate."""
        return [
            name for name in ("reduce", "reuse", "repair", "recycle", "recover")
            if getattr(self, name).feasible
        ]


def run_feasibility_filter(
    material:               MaterialType,
    condition:              ConditionType,
    repair_feasibility_pct: float,
    recyclability_pct:      float,
    has_recycling_facility: bool,
    has_repair_shop:        bool,
    is_industrial:          bool,
) -> FeasibilityResult:
    """
    Evaluate all five R-strategies against hard gates.

    Parameters
    ----------
    material               : The material enum value (e.g. PET_PLASTIC)
    condition              : Current condition of the item
    repair_feasibility_pct : Material-level repair score 0–100 (from DB)
    recyclability_pct      : Material recyclability 0–100 (from DB)
    has_recycling_facility : User context — recycling infrastructure present
    has_repair_shop        : User context — repair service accessible
    is_industrial          : User context — industrial vs household

    Returns
    -------
    FeasibilityResult with one FeasibilityGate per strategy.
    """
    mat = material.value
    cond_props = CONDITION_MATRIX[condition]
    result = FeasibilityResult()

    # -----------------------------------------------------------------
    # GATE 1 — REDUCE
    # Reduce is always theoretically feasible for consumable materials.
    # It is gated out only for end-of-life items (the item already exists
    # and its production cannot be un-done).
    # -----------------------------------------------------------------
    if condition == ConditionType.END_OF_LIFE:
        result.reduce = FeasibilityGate(
            False,
            "End-of-life items cannot benefit from reduce — usage is already complete."
        )
    elif mat == "organic":
        # Organic waste is a one-way process; 'reduce' still applies as a
        # behavioural recommendation (buy less food), but we flag it
        # specifically so the explanation is accurate.
        result.reduce = FeasibilityGate(
            True,
            "Reduce is applicable as a purchasing/consumption behaviour change."
        )
    else:
        result.reduce = FeasibilityGate(
            True,
            "Reducing consumption of this material category is always achievable."
        )

    # -----------------------------------------------------------------
    # GATE 2 — REUSE
    # Gates: contaminated items, organic waste, items that need repair first,
    # end-of-life items.
    # -----------------------------------------------------------------
    if cond_props["contaminated"]:
        result.reuse = FeasibilityGate(
            False,
            "Contaminated items cannot be safely reused due to hygiene or chemical risks."
        )
    elif mat == "organic":
        result.reuse = FeasibilityGate(
            False,
            "Organic/food materials cannot be reused in their current form."
        )
    elif not cond_props["reuse_viable"]:
        result.reuse = FeasibilityGate(
            False,
            f"Item in '{condition.value}' condition cannot be reused directly — repair is required first."
        )
    elif condition == ConditionType.END_OF_LIFE:
        result.reuse = FeasibilityGate(
            False,
            "End-of-life items have exhausted their serviceable life."
        )
    else:
        result.reuse = FeasibilityGate(
            True,
            "Item is structurally sound and can be used again in its current form."
        )

    # -----------------------------------------------------------------
    # GATE 3 — REPAIR
    # Three conditions must ALL be true:
    #   (a) The item's condition indicates it needs or could benefit from repair
    #   (b) The material type is technically repairable (repair_feasibility >= threshold)
    #   (c) A repair shop is accessible in the user's context
    # -----------------------------------------------------------------
    if not cond_props["repair_needed"]:
        result.repair = FeasibilityGate(
            False,
            f"Item in '{condition.value}' condition does not require repair — consider reuse."
        )
    elif repair_feasibility_pct < MIN_REPAIR_FEASIBILITY:
        result.repair = FeasibilityGate(
            False,
            f"{mat} has a repair feasibility of {repair_feasibility_pct:.0f}% "
            f"(minimum {MIN_REPAIR_FEASIBILITY:.0f}% required) — not economically viable."
        )
    elif not has_repair_shop and not is_industrial:
        result.repair = FeasibilityGate(
            False,
            "No repair shop or repair café detected in the user's context. "
            "Repair is technically possible but currently inaccessible."
        )
    else:
        result.repair = FeasibilityGate(
            True,
            f"Item is repairable ({repair_feasibility_pct:.0f}% feasibility) "
            "and a repair service is accessible."
        )

    # -----------------------------------------------------------------
    # GATE 4 — RECYCLE
    # Gates: low recyclability materials, contaminated items, no local
    # infrastructure. Note: aluminium and glass have universal facilities
    # and pass the infrastructure gate regardless.
    # -----------------------------------------------------------------
    UNIVERSAL_RECYCLE_MATERIALS = {"glass", "aluminium", "steel", "paper"}

    if cond_props["contaminated"]:
        result.recycle = FeasibilityGate(
            False,
            "Contaminated items are rejected by recycling facilities and will cause stream contamination."
        )
    elif recyclability_pct < MIN_RECYCLABILITY_PCT:
        result.recycle = FeasibilityGate(
            False,
            f"{mat} has a recyclability of {recyclability_pct:.0f}% "
            f"— below the {MIN_RECYCLABILITY_PCT:.0f}% viability threshold."
        )
    elif mat == "organic":
        result.recycle = FeasibilityGate(
            False,
            "Organic material is not processed by conventional recycling streams — composting is the route."
        )
    elif not has_recycling_facility and mat not in UNIVERSAL_RECYCLE_MATERIALS:
        result.recycle = FeasibilityGate(
            False,
            "No recycling facility detected for this material in the user's location."
        )
    else:
        result.recycle = FeasibilityGate(
            True,
            f"{mat} can be recycled ({recyclability_pct:.0f}% yield) "
            "and infrastructure is accessible."
        )

    # -----------------------------------------------------------------
    # GATE 5 — RECOVER
    # Recovery (energy-from-waste or composting) is the last resort.
    # It is always feasible but semantically meaningful primarily for:
    #   - Organic materials (composting)
    #   - Items with no other viable option
    #   - Contaminated items that cannot be reused/recycled
    # We never hard-gate Recover to False — it is the ultimate fallback.
    # -----------------------------------------------------------------
    if mat == "organic":
        result.recover = FeasibilityGate(
            True,
            "Organic material is ideally suited for composting or anaerobic digestion."
        )
    elif condition == ConditionType.END_OF_LIFE:
        result.recover = FeasibilityGate(
            True,
            "End-of-life item: recovery (energy-from-waste) extracts residual value over landfill."
        )
    else:
        result.recover = FeasibilityGate(
            True,
            "Recovery is always available as a last-resort option to divert from landfill."
        )

    # Log a summary for observability
    feasible = result.feasible_strategies()
    logger.debug(
        f"Feasibility result for material={mat} condition={condition.value}: "
        f"feasible={feasible}"
    )

    return result