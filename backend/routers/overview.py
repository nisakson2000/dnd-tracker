from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import (
    CharacterOverview, AbilityScore, SavingThrow, Skill,
)
from backend.schemas.all_schemas import (
    OverviewData, AbilityScoreData, SavingThrowData, SkillData,
    FullOverviewResponse,
)

router = APIRouter(prefix="/characters/{character_id}/overview", tags=["overview"])

ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]
SKILLS_MAP = {
    "Acrobatics": "DEX", "Animal Handling": "WIS", "Arcana": "INT",
    "Athletics": "STR", "Deception": "CHA", "History": "INT",
    "Insight": "WIS", "Intimidation": "CHA", "Investigation": "INT",
    "Medicine": "WIS", "Nature": "INT", "Perception": "WIS",
    "Performance": "CHA", "Persuasion": "CHA", "Religion": "INT",
    "Sleight of Hand": "DEX", "Stealth": "DEX", "Survival": "WIS",
}


def _init_defaults(session):
    for ab in ABILITIES:
        if not session.query(AbilityScore).filter_by(ability=ab).first():
            session.add(AbilityScore(ability=ab, score=10))
        if not session.query(SavingThrow).filter_by(ability=ab).first():
            session.add(SavingThrow(ability=ab, proficient=False))
    for sk_name in SKILLS_MAP:
        if not session.query(Skill).filter_by(name=sk_name).first():
            session.add(Skill(name=sk_name, proficient=False, expertise=False))
    session.flush()


@router.get("", response_model=FullOverviewResponse)
def get_overview(character_id: str):
    session = get_session(character_id)
    try:
        overview = session.query(CharacterOverview).first()
        if not overview:
            raise HTTPException(status_code=404, detail="Character not found")

        abilities = session.query(AbilityScore).all()
        saves = session.query(SavingThrow).all()
        skills = session.query(Skill).all()

        return FullOverviewResponse(
            overview=OverviewData.model_validate(overview),
            ability_scores=[AbilityScoreData.model_validate(a) for a in abilities],
            saving_throws=[SavingThrowData.model_validate(s) for s in saves],
            skills=[SkillData.model_validate(s) for s in skills],
        )
    finally:
        session.close()


@router.put("")
def update_overview(character_id: str, data: OverviewData):
    session = get_session(character_id)
    try:
        overview = session.query(CharacterOverview).first()
        if not overview:
            raise HTTPException(status_code=404, detail="Character not found")

        for field, value in data.model_dump().items():
            setattr(overview, field, value)
        session.commit()
        return {"status": "saved"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/ability-scores")
def update_ability_scores(character_id: str, data: list[AbilityScoreData]):
    session = get_session(character_id)
    try:
        for item in data:
            row = session.query(AbilityScore).filter_by(ability=item.ability).first()
            if row:
                row.score = item.score
            else:
                session.add(AbilityScore(ability=item.ability, score=item.score))
        session.commit()
        return {"status": "saved"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/saving-throws")
def update_saving_throws(character_id: str, data: list[SavingThrowData]):
    session = get_session(character_id)
    try:
        for item in data:
            row = session.query(SavingThrow).filter_by(ability=item.ability).first()
            if row:
                row.proficient = item.proficient
        session.commit()
        return {"status": "saved"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/skills")
def update_skills(character_id: str, data: list[SkillData]):
    session = get_session(character_id)
    try:
        for item in data:
            row = session.query(Skill).filter_by(name=item.name).first()
            if row:
                row.proficient = item.proficient
                row.expertise = item.expertise
        session.commit()
        return {"status": "saved"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
