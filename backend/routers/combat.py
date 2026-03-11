from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import Attack, Condition, CombatNotes
from backend.schemas.all_schemas import AttackData, ConditionData, CombatNotesData

router = APIRouter(prefix="/characters/{character_id}/combat", tags=["combat"])

DEFAULT_CONDITIONS = [
    "Blinded", "Charmed", "Deafened", "Frightened", "Grappled",
    "Incapacitated", "Invisible", "Paralyzed", "Petrified",
    "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious",
]


def _ensure_conditions(session):
    existing = {c.name for c in session.query(Condition).all()}
    for cond in DEFAULT_CONDITIONS:
        if cond not in existing:
            session.add(Condition(name=cond, active=False))
    session.flush()


# Attacks
@router.get("/attacks", response_model=list[AttackData])
def get_attacks(character_id: str):
    session = get_session(character_id)
    try:
        attacks = session.query(Attack).all()
        return [AttackData.model_validate(a) for a in attacks]
    finally:
        session.close()


@router.post("/attacks", response_model=AttackData, status_code=201)
def add_attack(character_id: str, data: AttackData):
    session = get_session(character_id)
    try:
        attack = Attack(**data.model_dump(exclude={"id"}))
        session.add(attack)
        session.commit()
        session.refresh(attack)
        return AttackData.model_validate(attack)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/attacks/{attack_id}", response_model=AttackData)
def update_attack(character_id: str, attack_id: int, data: AttackData):
    session = get_session(character_id)
    try:
        attack = session.query(Attack).get(attack_id)
        if not attack:
            raise HTTPException(status_code=404, detail="Attack not found")
        for field, value in data.model_dump(exclude={"id"}).items():
            setattr(attack, field, value)
        session.commit()
        session.refresh(attack)
        return AttackData.model_validate(attack)
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/attacks/{attack_id}")
def delete_attack(character_id: str, attack_id: int):
    session = get_session(character_id)
    try:
        attack = session.query(Attack).get(attack_id)
        if not attack:
            raise HTTPException(status_code=404, detail="Attack not found")
        session.delete(attack)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Conditions
@router.get("/conditions", response_model=list[ConditionData])
def get_conditions(character_id: str):
    session = get_session(character_id)
    try:
        _ensure_conditions(session)
        session.commit()
        conditions = session.query(Condition).order_by(Condition.name).all()
        return [ConditionData.model_validate(c) for c in conditions]
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/conditions")
def update_conditions(character_id: str, data: list[ConditionData]):
    session = get_session(character_id)
    try:
        _ensure_conditions(session)
        for item in data:
            row = session.query(Condition).filter_by(name=item.name).first()
            if row:
                row.active = item.active
        session.commit()
        return {"status": "saved"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Combat Notes
@router.get("/notes", response_model=CombatNotesData)
def get_combat_notes(character_id: str):
    session = get_session(character_id)
    try:
        notes = session.query(CombatNotes).first()
        if not notes:
            notes = CombatNotes(id=1)
            session.add(notes)
            session.commit()
            session.refresh(notes)
        return CombatNotesData.model_validate(notes)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/notes")
def update_combat_notes(character_id: str, data: CombatNotesData):
    session = get_session(character_id)
    try:
        notes = session.query(CombatNotes).first()
        if not notes:
            notes = CombatNotes(id=1)
            session.add(notes)
            session.flush()
        for field, value in data.model_dump().items():
            setattr(notes, field, value)
        session.commit()
        return {"status": "saved"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
