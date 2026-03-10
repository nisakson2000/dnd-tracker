from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import NPC
from backend.schemas.all_schemas import NPCData

router = APIRouter(prefix="/characters/{character_id}/npcs", tags=["npcs"])


@router.get("", response_model=list[NPCData])
def get_npcs(character_id: str):
    session = get_session(character_id)
    try:
        npcs = session.query(NPC).order_by(NPC.name).all()
        return [NPCData.model_validate(n) for n in npcs]
    finally:
        session.close()


@router.post("", response_model=NPCData, status_code=201)
def add_npc(character_id: str, data: NPCData):
    session = get_session(character_id)
    try:
        npc = NPC(**data.model_dump(exclude={"id"}))
        session.add(npc)
        session.commit()
        session.refresh(npc)
        return NPCData.model_validate(npc)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/{npc_id}", response_model=NPCData)
def update_npc(character_id: str, npc_id: int, data: NPCData):
    session = get_session(character_id)
    try:
        npc = session.query(NPC).get(npc_id)
        if not npc:
            raise HTTPException(status_code=404, detail="NPC not found")
        for field, value in data.model_dump(exclude={"id"}).items():
            setattr(npc, field, value)
        session.commit()
        session.refresh(npc)
        return NPCData.model_validate(npc)
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/{npc_id}")
def delete_npc(character_id: str, npc_id: int):
    session = get_session(character_id)
    try:
        npc = session.query(NPC).get(npc_id)
        if not npc:
            raise HTTPException(status_code=404, detail="NPC not found")
        session.delete(npc)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
