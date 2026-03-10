from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import Quest, QuestObjective
from backend.schemas.all_schemas import QuestData, QuestObjectiveData

router = APIRouter(prefix="/characters/{character_id}/quests", tags=["quests"])


@router.get("", response_model=list[QuestData])
def get_quests(character_id: str):
    session = get_session(character_id)
    try:
        quests = session.query(Quest).order_by(Quest.status, Quest.title).all()
        results = []
        for q in quests:
            qd = QuestData.model_validate(q)
            qd.objectives = [
                QuestObjectiveData.model_validate(o) for o in q.objectives
            ]
            results.append(qd)
        return results
    finally:
        session.close()


@router.post("", response_model=QuestData, status_code=201)
def add_quest(character_id: str, data: QuestData):
    session = get_session(character_id)
    try:
        quest = Quest(
            title=data.title,
            giver=data.giver,
            description=data.description,
            status=data.status,
            notes=data.notes,
        )
        for obj in data.objectives:
            quest.objectives.append(
                QuestObjective(text=obj.text, completed=obj.completed)
            )
        session.add(quest)
        session.commit()
        session.refresh(quest)
        result = QuestData.model_validate(quest)
        result.objectives = [
            QuestObjectiveData.model_validate(o) for o in quest.objectives
        ]
        return result
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/{quest_id}", response_model=QuestData)
def update_quest(character_id: str, quest_id: int, data: QuestData):
    session = get_session(character_id)
    try:
        quest = session.query(Quest).get(quest_id)
        if not quest:
            raise HTTPException(status_code=404, detail="Quest not found")
        quest.title = data.title
        quest.giver = data.giver
        quest.description = data.description
        quest.status = data.status
        quest.notes = data.notes

        # Replace objectives
        session.query(QuestObjective).filter_by(quest_id=quest_id).delete()
        for obj in data.objectives:
            quest.objectives.append(
                QuestObjective(text=obj.text, completed=obj.completed)
            )
        session.commit()
        session.refresh(quest)
        result = QuestData.model_validate(quest)
        result.objectives = [
            QuestObjectiveData.model_validate(o) for o in quest.objectives
        ]
        return result
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/{quest_id}")
def delete_quest(character_id: str, quest_id: int):
    session = get_session(character_id)
    try:
        quest = session.query(Quest).get(quest_id)
        if not quest:
            raise HTTPException(status_code=404, detail="Quest not found")
        session.delete(quest)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
