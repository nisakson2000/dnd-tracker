import uuid
import logging
from fastapi import APIRouter, HTTPException

from backend.database import (
    init_character_db, list_character_files, delete_character_db, get_session,
)
from backend.models.all_models import CharacterOverview
from backend.schemas.all_schemas import CharacterSummary, CharacterCreate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/characters", tags=["characters"])


@router.get("", response_model=list[CharacterSummary])
def list_characters():
    files = list_character_files()
    results = []
    for f in files:
        char_id = f["id"]
        try:
            session = get_session(char_id)
            overview = session.query(CharacterOverview).first()
            if overview:
                results.append(CharacterSummary(
                    id=char_id,
                    name=overview.name,
                    race=overview.race or "",
                    primary_class=overview.primary_class or "",
                    level=overview.level or 1,
                    campaign_name=overview.campaign_name or "",
                    ruleset=getattr(overview, 'ruleset', None) or "5e-2014",
                    updated_at=str(overview.updated_at) if overview.updated_at else None,
                ))
            session.close()
        except Exception as e:
            logger.warning("Failed to read character %s: %s", char_id, e)
            results.append(CharacterSummary(
                id=char_id, name=char_id, race="", primary_class="",
                level=1, campaign_name="",
            ))
    return results


@router.post("", response_model=CharacterSummary, status_code=201)
def create_character(data: CharacterCreate):
    char_id = str(uuid.uuid4())[:8]
    init_character_db(char_id)

    session = get_session(char_id)
    try:
        overview = CharacterOverview(
            id=1, name=data.name, ruleset=data.ruleset,
            race=data.race, primary_class=data.primary_class,
            primary_subclass=data.primary_subclass,
        )
        session.add(overview)

        from backend.routers.overview import _init_defaults
        _init_defaults(session)

        session.commit()
        return CharacterSummary(
            id=char_id, name=data.name, race=data.race,
            primary_class=data.primary_class,
            level=1, campaign_name="", ruleset=data.ruleset,
        )
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/{character_id}")
def delete_character(character_id: str):
    try:
        delete_character_db(character_id)
        return {"status": "deleted"}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Character not found")
