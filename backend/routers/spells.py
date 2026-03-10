from fastapi import APIRouter, HTTPException, Request

from backend.database import get_session
from backend.models.all_models import Spell, SpellSlot
from backend.schemas.all_schemas import SpellData, SpellSlotData

router = APIRouter(prefix="/characters/{character_id}/spells", tags=["spells"])


@router.get("", response_model=list[SpellData])
def get_spells(character_id: str):
    session = get_session(character_id)
    try:
        spells = session.query(Spell).order_by(Spell.level, Spell.name).all()
        return [SpellData.model_validate(s) for s in spells]
    finally:
        session.close()


@router.post("", response_model=SpellData, status_code=201)
def add_spell(character_id: str, data: SpellData):
    session = get_session(character_id)
    try:
        spell = Spell(**data.model_dump(exclude={"id"}))
        session.add(spell)
        session.commit()
        session.refresh(spell)
        return SpellData.model_validate(spell)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Spell Slots — must be before /{spell_id} routes to avoid "slots" matching as spell_id
@router.get("/slots", response_model=list[SpellSlotData])
def get_spell_slots(character_id: str):
    session = get_session(character_id)
    try:
        slots = session.query(SpellSlot).order_by(SpellSlot.slot_level).all()
        return [SpellSlotData.model_validate(s) for s in slots]
    finally:
        session.close()


@router.put("/slots")
async def update_spell_slots(character_id: str, request: Request):
    raw = await request.json()
    if not isinstance(raw, list):
        raise HTTPException(status_code=400, detail="Expected a list of slot objects")
    session = get_session(character_id)
    try:
        for item in raw:
            slot_level = int(item.get("slot_level", 0))
            max_slots = int(item.get("max_slots", 0))
            used_slots = int(item.get("used_slots", 0))
            row = session.query(SpellSlot).filter_by(slot_level=slot_level).first()
            if row:
                row.max_slots = max_slots
                row.used_slots = used_slots
            else:
                session.add(SpellSlot(
                    slot_level=slot_level,
                    max_slots=max_slots,
                    used_slots=used_slots,
                ))
        session.commit()
        return {"status": "saved"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.post("/slots/reset")
def reset_spell_slots(character_id: str):
    session = get_session(character_id)
    try:
        slots = session.query(SpellSlot).all()
        for slot in slots:
            slot.used_slots = 0
        session.commit()
        return {"status": "reset"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/{spell_id}", response_model=SpellData)
def update_spell(character_id: str, spell_id: int, data: SpellData):
    session = get_session(character_id)
    try:
        spell = session.query(Spell).get(spell_id)
        if not spell:
            raise HTTPException(status_code=404, detail="Spell not found")
        for field, value in data.model_dump(exclude={"id"}).items():
            setattr(spell, field, value)
        session.commit()
        session.refresh(spell)
        return SpellData.model_validate(spell)
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/{spell_id}")
def delete_spell(character_id: str, spell_id: int):
    session = get_session(character_id)
    try:
        spell = session.query(Spell).get(spell_id)
        if not spell:
            raise HTTPException(status_code=404, detail="Spell not found")
        session.delete(spell)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
