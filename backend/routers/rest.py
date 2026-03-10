from fastapi import APIRouter, HTTPException
from math import ceil

from backend.database import get_session
from backend.models.all_models import CharacterOverview, SpellSlot

router = APIRouter(
    prefix="/characters/{character_id}/rest",
    tags=["rest"],
)


@router.post("/long")
def long_rest(character_id: str):
    session = get_session(character_id)
    try:
        overview = session.query(CharacterOverview).first()
        if not overview:
            raise HTTPException(status_code=404, detail="Character not found")

        restored = []

        # Restore HP to max
        if overview.current_hp < overview.max_hp:
            restored.append(f"HP restored: {overview.current_hp} → {overview.max_hp}")
            overview.current_hp = overview.max_hp

        # Remove temp HP
        if overview.temp_hp > 0:
            restored.append("Temporary HP removed")
            overview.temp_hp = 0

        # Reset death saves
        if overview.death_save_successes > 0 or overview.death_save_failures > 0:
            restored.append("Death saves reset")
            overview.death_save_successes = 0
            overview.death_save_failures = 0

        # Reduce exhaustion by 1 (PHB: long rest with food/water)
        if overview.exhaustion_level > 0:
            old_level = overview.exhaustion_level
            overview.exhaustion_level = max(0, overview.exhaustion_level - 1)
            restored.append(f"Exhaustion reduced: {old_level} → {overview.exhaustion_level}")

        # Recover half hit dice (rounded up)
        # hit_dice_total is stored as e.g. "5d10"
        total_dice = overview.level
        max_recover = max(1, ceil(total_dice / 2))
        if overview.hit_dice_used > 0:
            recovered = min(overview.hit_dice_used, max_recover)
            overview.hit_dice_used = max(0, overview.hit_dice_used - recovered)
            restored.append(f"Hit dice recovered: {recovered} (used: {overview.hit_dice_used} remaining)")

        # Reset all spell slots
        slots = session.query(SpellSlot).all()
        slots_reset = False
        for slot in slots:
            if slot.used_slots > 0:
                slot.used_slots = 0
                slots_reset = True
        if slots_reset:
            restored.append("Spell slots fully restored")

        session.commit()

        if not restored:
            restored.append("Already fully rested")

        return {"status": "long_rest_complete", "restored": restored}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.post("/short")
def short_rest(character_id: str, hit_dice_to_spend: int = 0):
    session = get_session(character_id)
    try:
        overview = session.query(CharacterOverview).first()
        if not overview:
            raise HTTPException(status_code=404, detail="Character not found")

        restored = []

        # Spend hit dice (user chose how many)
        if hit_dice_to_spend > 0:
            available = overview.level - overview.hit_dice_used
            actual_spend = min(hit_dice_to_spend, available)
            if actual_spend > 0:
                overview.hit_dice_used += actual_spend
                restored.append(f"Spent {actual_spend} hit dice (apply rolled HP manually)")

        # Reset warlock pact magic slots
        # We check if primary_class is Warlock to reset spell slots
        if overview.primary_class == "Warlock":
            slots = session.query(SpellSlot).all()
            for slot in slots:
                if slot.used_slots > 0:
                    slot.used_slots = 0
            restored.append("Pact Magic slots restored")

        session.commit()

        if not restored:
            restored.append("Short rest complete")

        return {"status": "short_rest_complete", "restored": restored}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
