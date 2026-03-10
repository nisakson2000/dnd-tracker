from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import LoreNote
from backend.schemas.all_schemas import LoreNoteData

router = APIRouter(prefix="/characters/{character_id}/lore", tags=["lore"])


@router.get("", response_model=list[LoreNoteData])
def get_lore_notes(character_id: str):
    session = get_session(character_id)
    try:
        notes = session.query(LoreNote).order_by(LoreNote.updated_at.desc()).all()
        results = []
        for n in notes:
            d = LoreNoteData.model_validate(n)
            d.created_at = str(n.created_at) if n.created_at else None
            d.updated_at = str(n.updated_at) if n.updated_at else None
            results.append(d)
        return results
    finally:
        session.close()


@router.post("", response_model=LoreNoteData, status_code=201)
def add_lore_note(character_id: str, data: LoreNoteData):
    session = get_session(character_id)
    try:
        note = LoreNote(**data.model_dump(exclude={"id", "created_at", "updated_at"}))
        session.add(note)
        session.commit()
        session.refresh(note)
        result = LoreNoteData.model_validate(note)
        result.created_at = str(note.created_at) if note.created_at else None
        result.updated_at = str(note.updated_at) if note.updated_at else None
        return result
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/{note_id}", response_model=LoreNoteData)
def update_lore_note(character_id: str, note_id: int, data: LoreNoteData):
    session = get_session(character_id)
    try:
        note = session.query(LoreNote).get(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        for field, value in data.model_dump(exclude={"id", "created_at", "updated_at"}).items():
            setattr(note, field, value)
        session.commit()
        session.refresh(note)
        result = LoreNoteData.model_validate(note)
        result.created_at = str(note.created_at) if note.created_at else None
        result.updated_at = str(note.updated_at) if note.updated_at else None
        return result
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/{note_id}")
def delete_lore_note(character_id: str, note_id: int):
    session = get_session(character_id)
    try:
        note = session.query(LoreNote).get(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        session.delete(note)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
