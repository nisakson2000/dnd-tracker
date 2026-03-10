from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import Backstory
from backend.schemas.all_schemas import BackstoryData

router = APIRouter(prefix="/characters/{character_id}/backstory", tags=["backstory"])


@router.get("", response_model=BackstoryData)
def get_backstory(character_id: str):
    session = get_session(character_id)
    try:
        bs = session.query(Backstory).first()
        if not bs:
            bs = Backstory(id=1)
            session.add(bs)
            session.commit()
            session.refresh(bs)
        return BackstoryData.model_validate(bs)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("")
def update_backstory(character_id: str, data: BackstoryData):
    session = get_session(character_id)
    try:
        bs = session.query(Backstory).first()
        if not bs:
            bs = Backstory(id=1)
            session.add(bs)
            session.flush()

        for field, value in data.model_dump().items():
            setattr(bs, field, value)
        session.commit()
        return {"status": "saved"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
