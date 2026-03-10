from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import JournalEntry
from backend.schemas.all_schemas import JournalEntryData

router = APIRouter(prefix="/characters/{character_id}/journal", tags=["journal"])


@router.get("", response_model=list[JournalEntryData])
def get_journal_entries(character_id: str):
    session = get_session(character_id)
    try:
        entries = session.query(JournalEntry).order_by(
            JournalEntry.created_at.desc()
        ).all()
        result = []
        for e in entries:
            d = JournalEntryData.model_validate(e)
            d.created_at = str(e.created_at) if e.created_at else None
            d.updated_at = str(e.updated_at) if e.updated_at else None
            result.append(d)
        return result
    finally:
        session.close()


@router.post("", response_model=JournalEntryData, status_code=201)
def add_journal_entry(character_id: str, data: JournalEntryData):
    session = get_session(character_id)
    try:
        entry = JournalEntry(**data.model_dump(exclude={"id", "created_at", "updated_at"}))
        session.add(entry)
        session.commit()
        session.refresh(entry)
        result = JournalEntryData.model_validate(entry)
        result.created_at = str(entry.created_at) if entry.created_at else None
        result.updated_at = str(entry.updated_at) if entry.updated_at else None
        return result
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/{entry_id}", response_model=JournalEntryData)
def update_journal_entry(character_id: str, entry_id: int, data: JournalEntryData):
    session = get_session(character_id)
    try:
        entry = session.query(JournalEntry).get(entry_id)
        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")
        for field, value in data.model_dump(exclude={"id", "created_at", "updated_at"}).items():
            setattr(entry, field, value)
        session.commit()
        session.refresh(entry)
        result = JournalEntryData.model_validate(entry)
        result.created_at = str(entry.created_at) if entry.created_at else None
        result.updated_at = str(entry.updated_at) if entry.updated_at else None
        return result
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/{entry_id}")
def delete_journal_entry(character_id: str, entry_id: int):
    session = get_session(character_id)
    try:
        entry = session.query(JournalEntry).get(entry_id)
        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")
        session.delete(entry)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
